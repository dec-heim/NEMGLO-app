# Logging
import logging
import sys
logging.getLogger(__name__).addHandler(logging.NullHandler())
logging.basicConfig(
    stream=sys.stdout, level=logging.INFO, format="%(levelname)s: %(message)s"
)

# Backend API imports
from nemglo_src.data_fetch import *
from nemglo_src.planner import *
from nemglo_src.components.electrolyser import Electrolyser
from nemglo_src.components.renewables import Generator
from nemglo_src import nemglo_lite as lite

from datetime import datetime
import json
import validate as inv
from types import SimpleNamespace

# Flask/CORS imports
from flask import Flask, request, jsonify, abort
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)#, resources={r'/*': {'origins': ['https://www.nemglo.org/','http://localhost:3000','http://nemglo-backend.eba-rdn2wca8.ap-southeast-2.elasticbeanstalk.com/','https://main.d33u9p9lbzxx3x.amplifyapp.com']}})
app.config['CORS_HEADERS'] = 'Content-Type'

# # Helper Functions
# def convert_timestamp(timestamps):
#     result = []
#     for time in timestamps:
#         result.append(datetime.strptime(str(time), '%Y-%m-%d %H:%M:%S').strftime('%Y-%m-%d %H:%M:%S'))
#     return result

# def convert_dt_fmt(string):
#     ret_str = dt.strptime(string, '%Y-%m-%d')
#     ret_str = dt.strftime(ret_str, '%d/%m/%Y %H:%M')
#     return ret_str

# API - Market Data inputs [preview]
@app.route('/', methods=['GET'])
def default():
    return "nemglo version beta 0.2"

@app.route('/api/', methods=['GET'])
def default_api():
    return "NEMGLO API"

# API - Market Data inputs [preview]
@app.route('/api/get-market-data', methods=['POST'])
def api_get_market_data():
    try:
        conf = request.json
        # inv.validate_get_market_data(conf)
        # market = SimpleNamespace(**conf['market_data'])

        # # Nemosis Data -> Price extraction
        # data = nemosis_data(local_cache=r'CACHE')
        # data._download_geninfo(filter_regions=[[market.region]])
        # tracedata, tracedata['time'], tracedata['prices'], tracedata['vre'] = {}, {}, {}, {}
        # data.set_intlen(market.dispatch_interval_length)
        # data.set_dates(convert_dt_fmt(market.start_date), convert_dt_fmt(market.end_date))
        # data.set_region(market.region)
        
        # # Nemed Data -> Emissions extraction
        # if 'emissions_data' in conf:
        #     emissions = SimpleNamespace(**conf['emissions_data'])
        #     co2_data = nemed_data(intlength=market.dispatch_interval_length, local_cache=r'CACHE2')
        #     co2_data.set_dates(convert_dt_fmt(market.start_date), convert_dt_fmt(market.end_date))
        #     co2_data.set_region(market.region)
        #     emissions_df = co2_data.get_emissions(emissions.emissions_type)

        # tracedata['time'] = data.get_timestamp()
        # tracedata['prices'] = data.get_prices()

        # result = {}
        # result['availgens'] = data._info['DUID'].to_list()
        # result['availgens_default_cap'] = data._info['Reg Cap (MW)'].to_list()
        # result['availgens_tech'] = data._info['Fuel Source - Descriptor'].to_list()
        # result['time'] = convert_timestamp(tracedata['time'])
        # result['timestamps'] = json.loads(tracedata['prices']['Time'].dt.tz_localize('Australia/Sydney').to_json(orient='records'))
        # result['prices'] = tracedata['prices']['Prices'].to_list()
        # if 'emissions_data' in conf:
        #     result['emissions'] = emissions_df['Emissions_Intensity'].to_list()

        # return json.dumps(result)
        return lite.get_market_data(conf)
    except:
        abort(500)


# API - Generator Data inputs [preview]. ONLY FOR SINGLE GEN, CANNOT PASS BOTH
@app.route('/api/get-generator-data', methods=['POST'])
def api_get_generator_data():
    try:
        conf = request.json
        # print(conf)
        # inv.validate_get_generator_data(conf)
        # market = SimpleNamespace(**conf['market_data'])

        # data = nemosis_data(local_cache=r'CACHE')
        # data._download_geninfo(filter_regions=[[market.region]])
        # data.set_intlen(market.dispatch_interval_length)
        # data.set_dates(convert_dt_fmt(market.start_date), convert_dt_fmt(market.end_date))
        # data.set_region(market.region)
        # ppa_id, ppa_vals = [(key,value) for (key, value) in conf.items() if 'ppa' in key][0]
        # data.set_unit(ppa_vals['duid'], None)
        # desired_cap = ppa_vals['capacity'] 

        # tracedata, tracedata['time'], tracedata['vre'] = {}, {}, {}
        # tracedata['time'] = data.get_vre_traces()['Time']
        # tracedata['vre'] = data.get_vre_traces()[data._duid_1]  # note this returns either conf ppa 1 or 2.  
        # result = {}
        # result['generator'] = [tracedata['vre'].name]
        # result['time'] = convert_timestamp(tracedata['time'])
        # result['timestamps'] = json.loads(tracedata['time'].dt.tz_localize('Australia/Sydney').to_json(orient='records'))
        # result['cf_trace'] = json.loads(tracedata['vre'].to_json(orient='records'))
        # result['mw_trace'] = json.loads(tracedata['vre'].mul(desired_cap).to_json(orient='records'))

        # return json.dumps(result)
        return lite.get_generator_data(conf)
    except:
        abort(500)



# API - Model Simulation [MAIN]
@app.route('/api/get-data', methods=['POST'])
def api_get_data():
    try:
        conf = request.json
        # # inv.validate_get_data(conf)

        # # Result objects
        # tracedata, tracedata['time'], tracedata['prices'], tracedata['vre'] = {}, {}, {}, {}
        # p2g = Plan(identifier="p2g")

        # # Market Data -> Data Fetch Object
        # market_data = conf['market_data']
        # data = nemosis_data(local_cache=r'CACHE')
        # data.set_dates(convert_dt_fmt(market_data['start_date']), convert_dt_fmt(market_data['end_date']))
        # data.set_region(market_data['region'])
        # data.set_intlen(market_data['dispatch_interval_length'])

        # tracedata['time'] = data.get_timestamp()
        # tracedata['prices'] = data.get_prices()
        # p2g.load_market_prices(tracedata['prices'])

        # # PPA Data
        # if 'ppa_1' in conf:
        #     ppa_1 = conf["ppa_1"]
        # if 'ppa_2' in conf:
        #     ppa_2 = conf["ppa_2"]

        # if ('ppa_1' in conf) and ('ppa_2' in conf):
        #     data.set_unit(ppa_1['duid'], ppa_2['duid'])
        # elif ('ppa_1' in conf):
        #     data.set_unit(ppa_1['duid'], None)
        # tracedata['vre'] = data.get_vre_traces()    

        # # Electrolyser Data
        # electrolyser_load = conf["electrolyser_load"]

        # h2e = Electrolyser(p2g, identifier="h2e")
        # h2e.load_h2_parameters_preset(capacity = float(electrolyser_load['capacity']),
        #                             maxload = float(electrolyser_load['capacity']), #electrolyser_load['maxload'],
        #                             minload = float(electrolyser_load['min_stable_load']),
        #                             offload = 0.0,
        #                             electrolyser_type = str(electrolyser_load['technology_type']),
        #                             sec_profile = str(electrolyser_load['sec_profile']),
        #                             h2_price_kg = float(electrolyser_load['h2_price']))
        # h2e.add_electrolyser_operation()

        # # Add PPA contract 1
        # if ('ppa_1' in conf):
        #     gen_1 = Generator(p2g, identifier='gen_1')
        #     if 'floor_price' in ppa_1:
        #         gen_1.load_vre_parameters(duid = str(ppa_1['duid']),
        #                                 capacity = float(ppa_1['capacity']),
        #                                 trace = tracedata['vre'][['Time', ppa_1['duid']]],
        #                                 ppa_strike = float(ppa_1['strike_price']),
        #                                 ppa_floor = float(ppa_1['floor_price']))
        #     else:
        #         gen_1.load_vre_parameters(duid = str(ppa_1['duid']),
        #                                 capacity = float(ppa_1['capacity']),
        #                                 trace = tracedata['vre'][['Time', ppa_1['duid']]],
        #                                 ppa_strike = float(ppa_1['strike_price']),
        #                                 ppa_floor = None)                
        #     gen_1.add_ppa_contract()

        # # Add PPA contract 2
        # if ('ppa_2' in conf):
        #     gen_2 = Generator(p2g, identifier='gen_2')
        #     if 'floor_price' in ppa_2:
        #         gen_2.load_vre_parameters(duid = str(ppa_2['duid']),
        #                                 capacity = float(ppa_2['capacity']),
        #                                 trace = tracedata['vre'][['Time', ppa_2['duid']]],
        #                                 ppa_strike = float(ppa_2['strike_price']),
        #                                 ppa_floor = float(ppa_2['floor_price']))
        #     else:
        #         gen_2.load_vre_parameters(duid = str(ppa_2['duid']),
        #                                 capacity = float(ppa_2['capacity']),
        #                                 trace = tracedata['vre'][['Time', ppa_2['duid']]],
        #                                 ppa_strike = float(ppa_2['strike_price']),
        #                                 ppa_floor = None)                
        #     gen_2.add_ppa_contract()

        # # add certificates
        # if ('rec' in conf):
        #     # rec_price = conf['rec']['rec_price']
        #     if ('constraint' in conf['rec']) & (conf['rec']['constraint'] == 'interval'):
        #         p2g.autoadd_rec_price_on_interval(rec_price=0.0, allow_buying=False, allow_selling=False)
        #     elif ('constraint' in conf['rec']) & (conf['rec']['constraint'] == 'total'):
        #         p2g.autoadd_rec_price_on_total(rec_price=0.0, allow_buying=False, allow_selling=False)

        # # optimise
        # p2g.optimise()

        # if ('ppa_1' in conf):
        #     duid_1 = ppa_1['duid']
        # if ('ppa_2' in conf):
        #     duid_2 = ppa_2['duid']
        # if ('ppa_1' in conf) and ('ppa_2' in conf):
        #     tracedata['combined_vre'] = ppa_1['capacity'] * tracedata['vre'][duid_1] + \
        #                                 ppa_2['capacity'] * tracedata['vre'][duid_2]
        #     comb_vre = json.loads(tracedata['combined_vre'].to_json(orient='split'))

        # tracedata['optimised_load'] = p2g.get_load()
        # tracedata['optimised_load']['time'] = tracedata['optimised_load']['time'].dt.tz_localize('Australia/Sydney')
        # opt_load = json.loads(tracedata['optimised_load'].to_json(orient='split'))

        # costs = p2g.get_costs(exclude_shadow=True)

        # result = {}
        # result['time'] = convert_timestamp(tracedata['time'])
        # result['prices'] = tracedata['prices']['Prices'].to_list()

        # if ('ppa_1' in conf):
        #     result['ppa1'] = json.loads(tracedata['vre'][duid_1].to_json(orient='split'))
        #     result['size_vre1'] = ppa_1['capacity']
        #     result['cost_vre1'] = costs['gen_1-ppa_cfd'].to_list()

        # if ('ppa_2' in conf):
        #     result['ppa2'] = json.loads(tracedata['vre'][duid_2].to_json(orient='split'))
        #     result['size_vre2'] = ppa_2['capacity']
        #     result['cost_vre2'] = costs['gen_2-ppa_cfd'].to_list()
        
        # if ('ppa_1' in conf) and ('ppa_2' in conf):
        #     result['combined_vre'] = comb_vre['data']
        # result['optimised_load'] = [x[1] for x in opt_load['data']]
        # result['timestamps'] = [x[2] for x in opt_load['data']]

        # result['cost_total'] = costs['total_cost'].to_list()
        # result['cost_h2'] = costs['h2e-h2_produced'].to_list()
        # result['cost_energy'] = costs['h2e-mw_load'].to_list()

        # return json.dumps(result)
        return lite.get_operation(conf)
    except:
        abort(500)

if __name__ == "__main__":
    app.run(port=5000)