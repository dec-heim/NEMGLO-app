# TODO:
# > Check pricing objective function on $/MW or $/MWh

import pandas as pd
import numpy as np
from ..backend.optimiser_formatters import *
from ..backend import input_validation as inv
from ..planner import Plan

class Emissions:
    """Object to store the user input parameters of Emissions, check and validate inputs,
    then perform loading actions to planner object.
    """
    def __init__(self, system_plan, identifier):
        # Error check on parsed arguments
        assert isinstance(system_plan, Plan), "Generator Argument: 'system_plan' must be nemglo.planner.Plan object"
        assert isinstance(identifier, str), "Generator Argument: 'identifier' must be a str"
        inv.validate_unique_id(self.__class__, system_plan, identifier)

        # Link object to Plan
        self._system_plan = system_plan
        cname = self.__class__.__name__
        self._system_plan._components.update({cname: [self]})
        self._id = identifier

        # Emissions Characteristics
        self._trace = None # tCO2-e
        self._shadow_price = None # $/tCO2-e

    
    def load_emissions(self, trace, shadow_price):
        # Validate Inputs
        assert isinstance(shadow_price, float), "Emissions Argument: 'shadow_price' must be a float"
        self._validate_trace(trace)

        # Store Values
        self._trace = trace
        self._shadow_price = shadow_price


    def _validate_trace(self, trace):
        schema = inv.DataFrameSchema(name="trace", primary_keys=['Time', 'Emissions_Intensity'])
        schema.add_column(inv.SeriesSchema(name='Time', data_type=np.dtype('datetime64[ns]'), no_duplicates=True, \
            ascending_order=True, minimum=self._system_plan._timeseries[0], maximum=self._system_plan._timeseries[-1]))
        schema.add_column(inv.SeriesSchema(name='Emissions_Intensity', data_type=np.float64, must_be_real_number=True, \
            not_negative=True))
        schema.validate(trace)


    def add_emissions(self):
        planner = self._system_plan
        co2_name = self._id + '-impact_emissions'
        grid_name = self._id + '-grid_load'
        load_name = planner._components['Electrolyser'][0]._id + '-mw_load'

        # Create `grid_load` variable which is mw_load of electrolyser less RE availabilities
        create_timeseries_vars(planner, var_name=grid_name, lb=0, ub=np.inf)
        
        # Set `impact emissions` variable
        var_ids = planner._var[grid_name][['interval', 'variable_id']]
        create_constr_rhs_on_interval_dynamicvar(planner, constr_name=grid_name,
            constr_type='<=', rhs_var_id_series=var_ids) ### MAY NEED TO SET ASS <=

        coeffs = {load_name: 1}
        if 'Generator' in planner._components:
            for gen in planner._components['Generator']:
                name_ppa_rec = gen._id + '-vre_avail'
                coeffs.update({name_ppa_rec: -1})

        create_constr_lhs_on_interval(planner, constr_name=grid_name, constr_rhs=planner._constr_rhs_dynamic[grid_name],
                                        coefficient_map=coeffs)


        # Create `impact emissions` variable
        create_timeseries_vars(planner, var_name=co2_name, lb=0, ub=np.inf)
        
        # Set `impact emissions` variable
        var_ids = planner._var[co2_name][['interval', 'variable_id']]
        create_constr_rhs_on_interval_dynamicvar(planner, constr_name=co2_name,
            constr_type='==', rhs_var_id_series=var_ids)

        # Set `impact emissions` volume
        coeffs = self._trace['Emissions_Intensity'].mul(planner._intlength / 60).to_list()

        create_constr_lhs_on_interval_dynamic(planner, constr_name=co2_name,
            constr_rhs=planner._constr_rhs_dynamic[co2_name],
            decision_vars=planner._var[grid_name],
            coefficient_list=coeffs)

        # OLD FUNCTION
        # planner = self._system_plan
        # co2_name = self._id + '-impact_emissions'
        # load_name = planner._components['Electrolyser'][0]._id + '-mw_load'

        # # Create `impact emissions` variable
        # create_timeseries_vars(planner, var_name=co2_name, lb=0, ub=np.inf)

        # # Set `impact emissions` variable
        # var_ids = planner._var[co2_name][['interval', 'variable_id']]
        # create_constr_rhs_on_interval_dynamicvar(planner, constr_name=co2_name,
        #     constr_type='==', rhs_var_id_series=var_ids)

        # ## TODO: Update the implementation in optimisation_formatters
        # coeffs = self._trace['Emissions_Intensity'].mul(planner._intlength / 60).to_list()
        # #coeffs = [self._trace['Emissions_Intensity'][i] * (planner._intlength / 60) for i in range(len(self._trace))]
        # create_constr_lhs_on_interval_dynamic(planner, constr_name=co2_name,
        #     constr_rhs=planner._constr_rhs_dynamic[co2_name],
        #     decision_vars=planner._var[load_name],
        #     coefficient_list=coeffs)


    def _price_emissions(self):
        planner = self._system_plan
        co2_name = self._id + '-impact_emissions'

        # Price `impact emissions` in optimiser
        series = planner._var[co2_name]
        create_objective_cost(planner, var_name=co2_name,
                    decision_var_series=series, cost=self._shadow_price)


    def _set_emissions_limit(self):
        # tCO2/MWh

        # 100 tCO2 for 1000 kg

        # kg CO2 per kg H2
        
        return -1
        