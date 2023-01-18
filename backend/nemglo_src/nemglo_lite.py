import yaml
import json
from nemglo_src.data_fetch import Market
from nemglo_src.components.renewables import Generator
from nemglo_src.components.electrolyser import Electrolyser
from nemglo_src.components.emissions import Emissions
from nemglo_src.planner import Plan 
from types import SimpleNamespace
from nemglo_src.backend import input_validation as inv
from datetime import datetime as dt
import logging

logger = logging.getLogger(__name__)

def convert_dt_fmt(string):
    ret_str = dt.strptime(string, '%Y-%m-%d')
    ret_str = dt.strftime(ret_str, '%Y/%m/%d')
    return ret_str

def convert_timestamp(timestamps):
    result = []
    for time in timestamps:
        result.append(dt.strptime(str(time), '%Y-%m-%d %H:%M:%S').strftime('%Y-%m-%d %H:%M:%S'))
    return result


def get_market_data(conf):
    """Processes market data API call.

    Parameters
    ----------
    conf : dict
        Input parameters to process. As defined in NEMGLO-API documentation.

    Returns
    -------
    json
        Returned Fields: "availgens", "availgens_default_cap", "availgens_tech", "time", "timestamps", "prices"
    """
    logger.info('=== Commence get_market_data() ===')
    inv.validate_get_market_data(conf)
    c_md = SimpleNamespace(**conf['market_data'])

    # Nemosis Data -> Price extraction
    data = Market(local_cache=r'CACHE',
                  intlength=int(c_md.dispatch_interval_length),
                  region=c_md.region,
                  start_date=convert_dt_fmt(c_md.start_date) + " " + [c_md.start_time if hasattr(c_md, "start_time") else "00:00"][0],
                  end_date=convert_dt_fmt(c_md.end_date) + " " + [c_md.end_time if hasattr(c_md, "end_time") else "00:00"][0])
    print('finished Market class')
    data._download_geninfo(filter_regions=[c_md.region])
    tracedata, tracedata['time'], tracedata['prices'], tracedata['vre'] = {}, {}, {}, {}
    
    # Nemed Data -> Emissions extraction
    if 'emissions_data' in conf:
        raise NotImplementedError("EMISSIONS DATA NOT CONFIGURED")
        emissions = SimpleNamespace(**conf['emissions_data'])
        co2_data = nemed_data(intlength=market.dispatch_interval_length, local_cache=r'CACHE2')
        co2_data.set_dates(convert_dt_fmt(market.start_date), convert_dt_fmt(market.end_date))
        co2_data.set_region(market.region)
        emissions_df = co2_data.get_emissions(emissions.emissions_type)

    prc_df = data.get_prices()
    tracedata['time'] = prc_df['Time']
    tracedata['prices'] = prc_df['Prices']

    result = {}
    result['availgens'] = data._info['DUID'].to_list()
    result['availgens_default_cap'] = data._info['Reg Cap (MW)'].to_list()
    result['availgens_tech'] = data._info['Fuel Source - Descriptor'].to_list()
    result['time'] = convert_timestamp(tracedata['time'])
    result['timestamps'] = json.loads(tracedata['time'].dt.tz_localize('Australia/Sydney').to_json(orient='records'))
    result['prices'] = tracedata['prices'].to_list()
    if 'emissions_data' in conf:
        result['emissions'] = emissions_df['Emissions_Intensity'].to_list()
    logger.info('=== End get_market_data() ===')
    return json.dumps(result)


def get_generator_data(conf):
    # ONLY FOR SINGLE GEN, CANNOT PASS BOTH
    logger.info('=== Commence get_generator_data() ===')
    inv.validate_get_generator_data(conf)
    c_md = SimpleNamespace(**conf['market_data'])
    ppa_id, ppa_vals = [(key,value) for (key, value) in conf.items() if 'ppa' in key][0]

    data = Market(local_cache=r'CACHE',
                intlength=int(c_md.dispatch_interval_length),
                region=c_md.region,
                start_date=convert_dt_fmt(c_md.start_date) + " " + [c_md.start_time if hasattr(c_md, "start_time") else "00:00"][0],
                end_date=convert_dt_fmt(c_md.end_date) + " " + [c_md.end_time if hasattr(c_md, "end_time") else "00:00"][0],
                duid_1=ppa_vals['duid'])

    desired_cap = ppa_vals['capacity'] 

    tracedata, tracedata['time'], tracedata['vre'] = {}, {}, {}
    vre = data.get_generation()
    tracedata['time'] = vre['Time']
    tracedata['vre'] = vre[data._duid_1]  # note this returns either conf ppa 1 or 2.  
    result = {}
    result['generator'] = [tracedata['vre'].name]
    result['time'] = convert_timestamp(tracedata['time'])
    result['timestamps'] = json.loads(tracedata['time'].dt.tz_localize('Australia/Sydney').to_json(orient='records'))
    result['cf_trace'] = json.loads(tracedata['vre'].to_json(orient='records'))
    result['mw_trace'] = json.loads(tracedata['vre'].mul(desired_cap).to_json(orient='records'))
    logger.info('=== End get_generator_data() ===')
    return json.dumps(result)


def get_operation(conf):
    # Process Inputs
    logger.info('=== Commence get_operation() ===')
    # inv.validate_get_operation(conf)
    c_md = SimpleNamespace(**conf['market_data'])
    c_el = SimpleNamespace(**conf['electrolyser_load'])
    if 'ppa_1' in conf:
        c_ppa1 = SimpleNamespace(**conf['ppa_1'])
    else:
        c_ppa1 = None
    if 'ppa_2' in conf:
        c_ppa2 = SimpleNamespace(**conf['ppa_2'])
    else:
        c_ppa2 = None
    if 'rec' in conf:
        c_rec = SimpleNamespace(**conf['rec'])
    else:
        c_rec = None

    # Setup environment
    tracedata, tracedata['time'], tracedata['prices'], tracedata['vre'] = {}, {}, {}, {}
    p2g = Plan(identifier="p2g")

    # Market Data
    data = Market(local_cache=r'CACHE',
                  intlength=int(c_md.dispatch_interval_length),
                  region=c_md.region,
                  start_date=convert_dt_fmt(c_md.start_date) + " " + [c_md.start_time if hasattr(c_md, "start_time") else "00:00"][0],
                  end_date=convert_dt_fmt(c_md.end_date) + " " + [c_md.end_time if hasattr(c_md, "end_time") else "00:00"][0],
                  duid_1=[c_ppa1.duid if c_ppa1 != None else None][0],
                  duid_2=[c_ppa2.duid if c_ppa2 != None else None][0])

    prc_df = data.get_prices()
    tracedata['time'] = prc_df['Time']
    tracedata['prices'] = prc_df['Prices']
    p2g.load_market_prices(prc_df)
    tracedata['vre'] = data.get_generation()  

    # Electrolyser Data
    h2e = Electrolyser(p2g, identifier="h2e")
    h2e.load_h2_parameters_preset(capacity = float(c_el.capacity),
                                maxload = float(c_el.capacity),
                                minload = float(c_el.min_stable_load),
                                offload = 0.0,
                                electrolyser_type = str(c_el.technology_type),
                                sec_profile = str(c_el.sec_profile),
                                h2_price_kg = float(c_el.h2_price))
    h2e.add_electrolyser_operation()

    # PPA Data
    if 'ppa_1' in conf:
        gen_1 = Generator(p2g, identifier='gen_1')
        gen_1.load_vre_parameters(duid = str(c_ppa1.duid),
                                  capacity = float(c_ppa1.capacity),
                                  trace = tracedata['vre'][['Time', c_ppa1.duid]],
                                  ppa_strike = float(c_ppa1.strike_price),
                                  ppa_floor = [float(c_ppa1.floor_price) if hasattr(c_ppa1, "floor_price") else None][0])              
        gen_1.add_ppa_contract()
    if 'ppa_2' in conf:
        gen_2 = Generator(p2g, identifier='gen_2')
        gen_2.load_vre_parameters(duid = str(c_ppa2.duid),
                                  capacity = float(c_ppa2.capacity),
                                  trace = tracedata['vre'][['Time', c_ppa2.duid]],
                                  ppa_strike = float(c_ppa2.strike_price),
                                  ppa_floor = [float(c_ppa2.floor_price) if hasattr(c_ppa2, "floor_price") else None][0])              
        gen_2.add_ppa_contract()

    # Certificate Data
    if 'rec' in conf:
        if c_rec.constraint == "interval":
            p2g.autoadd_rec_price_on_interval(rec_price=c_rec.rec_price, allow_buying=False, allow_selling=False)
        elif c_rec.constraint == "total":
            p2g.autoadd_rec_price_on_total(rec_price=c_rec.rec_price, allow_buying=False, allow_selling=False)

    # Optimise
    p2g.optimise()
    costs = p2g.get_costs(exclude_shadow=True)

    # Results
    result = {}
    result['time'] = convert_timestamp(tracedata['time'])
    result['prices'] = tracedata['prices'].to_list()

    if ('ppa_1' in conf):
        result['ppa1'] = json.loads(tracedata['vre'][c_ppa1.duid].to_json(orient='split'))
        result['size_vre1'] = c_ppa1.capacity
        result['cost_vre1'] = costs['gen_1-ppa_cfd'].to_list()
    if ('ppa_2' in conf):
        result['ppa2'] = json.loads(tracedata['vre'][c_ppa2.duid].to_json(orient='split'))
        result['size_vre2'] = c_ppa2.capacity
        result['cost_vre2'] = costs['gen_2-ppa_cfd'].to_list()
    if ('ppa_1' in conf) & ('ppa_2' in conf):
        tracedata['combined_vre'] = c_ppa1.capacity * tracedata['vre'][c_ppa1.duid] + \
                                    c_ppa2.capacity * tracedata['vre'][c_ppa2.duid]
        comb_vre = json.loads(tracedata['combined_vre'].to_json(orient='split'))
        result['combined_vre'] = comb_vre['data']

    tracedata['optimised_load'] = p2g.get_load()
    tracedata['optimised_load']['time'] = tracedata['optimised_load']['time'].dt.tz_localize('Australia/Sydney')
    opt_load = json.loads(tracedata['optimised_load'].to_json(orient='split'))
    result['optimised_load'] = [x[1] for x in opt_load['data']]
    result['timestamps'] = [x[2] for x in opt_load['data']]

    result['cost_total'] = costs['total_cost'].to_list()
    result['cost_h2'] = costs['h2e-h2_produced'].to_list()
    result['cost_energy'] = costs['h2e-mw_load'].to_list()

    logger.info('=== End get_operation() ===')
    return json.dumps(result)



### ARCHIVE ##############################################################################
def operate_h2e_api(input_file_path=r'E:\PROJECTS\NEMGLO\localonly\inputs.yaml'):
    
    # Read inputs .yaml file
    with open(input_file_path, 'r') as f:
        inputs = yaml.safe_load(f)

    # Parse data
    config = inputs['simulation_config']
    result_fmt = inputs['results']

    # Create nemosis data object
    inputdata = nemosis_data(intlength=config['market_data']['intlength'],
                             local_cache=config['setup']['cache'])

    inputdata.set_dates(start = config['market_data']['start'],
                        end = config['market_data']['end'])
    
    inputdata.set_region(region = config['market_data']['region'])

    if 'renewables' in config:
        if ('generator_1' in config['renewables']) & ('generator_2' in config['renewables']):
            inputdata.set_unit(duid_1 = config['renewables']['generator_1']['duid'],
                            duid_2 = config['renewables']['generator_2']['duid'])
        elif ('generator_1' in config['renewables']):
            inputdata.set_unit(duid_1 = config['renewables']['generator_1']['duid'],
                            duid_2 = None)
        else:
            raise Exception("Invalid generator format in input file")


    # Load Market Data to Planner
    P2G = Plan()
    P2G.load_market(timeseries = inputdata.get_timestamp(),
                    prices = inputdata.get_prices(valueonly=True),
                    lgc_price = config['market_data']['lgc_price'])

    # Add Electrolyser Object
    h2e = Electrolyser()
    h2e._capacity = config['electrolyser']['capacity']
    h2e._minload = config['electrolyser']['load']['load_min']
    h2e._maxload = config['electrolyser']['load']['load_max']
    h2e._offload = config['electrolyser']['load']['load_off']
    h2e._h2_price_kg = config['electrolyser']['h2_price_kg']

    h2e.config_sec_by_type(electrolyser_type = config['electrolyser']['electrolyser_type'],
                           profile = config['electrolyser']['sec']['sec_profile'])

    P2G.add_electrolyser(h2e)

    # temp ramping
    if 'rampcost' in config['electrolyser']:
        h2e.ramping_smoother(P2G, cost=config['electrolyser']['rampcost'])

    # production targets
    for k in config['electrolyser'].keys():
        if k.__contains__('production_target'):
            h2e.production_target(P2G,
                target_value=config['electrolyser'][k]['target_value'],
                bound=config['electrolyser'][k]['bound'],
                period=config['electrolyser'][k]['period'])

            if config['electrolyser'][k]['soft_constraint']:
                bound = config['electrolyser'][k]['bound']
                period = config['electrolyser'][k]['period']
                cost = config['electrolyser'][k]['soft_constraint_cost']

                if bound == 'max':
                    P2G.relax_and_price_constr_violation(constr_name=f"prd_tgt_{bound}_{period}", sense='-', cost=-1*cost)
                elif bound == 'min':
                    P2G.relax_and_price_constr_violation(constr_name=f"prd_tgt_{bound}_{period}", sense='+', cost=cost)



    # Add Renewable Object
    if 'renewables' in config:
        for k in config['renewables']:
            # First gen Duid
            if config['renewables'][k]['activate']:
                # Create VRE object
                gen = VREGenerator()
                gen._duid = config['renewables'][k]['duid']
                gen._capacity = config['renewables'][k]['capacity']
                gen._ppa_strike = config['renewables'][k]['ppa_strike']
                gen._ppa_include_rec = True
                
                # Retrieve trace data
                inputdata.set_unit(duid_1 = config['renewables'][k]['duid'], duid_2=None)
                vre = inputdata.get_vre_traces()
                gen._trace = list(vre[config['renewables'][k]['duid']])

                P2G.add_vre_generator(gen)
            

    # Add emissions object
    if 'emissions' in config:
        print("try nemed_data")
        em_data = nemed_data(intlength=config['market_data']['intlength'],
                             local_cache=config['setup']['emcache'])
        em_data.set_region(region = config['market_data']['region'])
        em_data.set_dates(start = config['market_data']['start'],
                          end = config['market_data']['end'])
        print("try get emissions")
        e_df = em_data.get_emissions(emissions_type=config['emissions']['type'])
        print("got it")
        print(e_df)
        print(em_data._intensity.values)

        co2 = Emissions()
        co2._trace = em_data._intensity.values # tCO2-e/MWh
        co2._shadow_price = config['emissions']['shadow_price'] # $/tCO2-e
        co2.add_emissions(P2G)
        P2G.add_emissions(co2)


    # Run Optimisation
    P2G.optimise(solver_name="GRB",
                 save_debug = result_fmt['save_files']['debug'],
                 save_results = result_fmt['save_files']['results'],
                 results_dir = result_fmt['save_files']['directory'])

    print("End of nemglo operate_h2e_api script")

    return