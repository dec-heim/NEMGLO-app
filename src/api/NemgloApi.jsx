import axios from "axios";

import config from "../config.json";

const getMarketData = async (marketConfig, emissionsTypeEnabled) => {
  try {
    let body = {
      market_data: {
        start_date: marketConfig.startDate,
        end_date: marketConfig.endDate,
        start_time: marketConfig.startTime,
        end_time: marketConfig.endTime,
        region: marketConfig.region,
        dispatch_interval_length: marketConfig.dispatch_interval_length
      },
    };
    if (emissionsTypeEnabled) {
      body["emissions_data"] = {
        emissions_type: marketConfig.emissions_type,
      };
    }
    const reponse = await axios.post(`${config.api}/get-market-data`, body);
    return reponse.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const getGeneratorData = async (simConfig) => {
  try {
    const body = {
      market_data: {
        start_date: simConfig.startDate,
        end_date: simConfig.endDate,
        region: simConfig.region,
        dispatch_interval_length: simConfig.dispatchIntervalLength,
      },
      ppa: {
        duid: simConfig.duid,
        capacity: simConfig.ppaCapacity,
        strike_price: simConfig.ppaStrikePrice,
        floor_price: simConfig.ppaFloorPrice,
      },
    };
    const reponse = await axios.post(`${config.api}/get-generator-data`, body);
    return reponse.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const getGeneratorData_ppa1 = async (simConfig) => {
  try {
    const body = {
      market_data: {
        start_date: simConfig.startDate,
        end_date: simConfig.endDate,
        region: simConfig.region,
        dispatch_interval_length: simConfig.dispatchIntervalLength,
      },
      ppa_1: {
        duid: simConfig.duid1,
        capacity: simConfig.ppa1Capacity,
      },
    };
    const reponse = await axios.post(`${config.api}/get-generator-data`, body);
    return reponse.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const getGeneratorData_ppa2 = async (simConfig) => {
  try {
    const body = {
      market_data: {
        start_date: simConfig.startDate,
        end_date: simConfig.endDate,
        region: simConfig.region,
        dispatch_interval_length: simConfig.dispatchIntervalLength,
      },
      ppa_2: {
        duid: simConfig.duid2,
        capacity: simConfig.ppa2Capacity,
      },
    };
    const reponse = await axios.post(`${config.api}/get-generator-data`, body);
    return reponse.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const runSimulation = async (
  simConfig,
  ppa1Disabled,
  ppa2Disabled,
  recEnabled,
  recSpotPriceEnabled,
  emissionsEnabled,
  co2PriceSelected
) => {
  try {
    let minStableMW = simConfig.minStableLoad * 0.01 * simConfig.electrolyserCapacity;
    let body = {
      market_data: {
        start_date: simConfig.startDate,
        end_date: simConfig.endDate,
        region: simConfig.region,
        dispatch_interval_length: simConfig.dispatchIntervalLength,
      },
      electrolyser_load: {
        technology_type: simConfig.technologyType,
        h2_price: simConfig.h2Price,
        capacity: simConfig.electrolyserCapacity,
        min_stable_load: minStableMW,
        rated_load: simConfig.ratedLoad,
        overload: simConfig.overload,
        nominal_sec: simConfig.secProfile,
        conversion_factor: simConfig.conversionFactor,
        sec_profile: simConfig.secProfile,
      },
    };

    if (!ppa1Disabled) {
      body["ppa_1"] = {
        duid: simConfig.duid1,
        capacity: simConfig.ppa1Capacity,
        strike_price: simConfig.ppa1StrikePrice,
      };
    }
    if (!ppa2Disabled) {
      body["ppa_2"] = {
        duid: simConfig.duid2,
        capacity: simConfig.ppa2Capacity,
        strike_price: simConfig.ppa2StrikePrice,
      };
    }
    if (recEnabled) {
      body["rec"] = recSpotPriceEnabled ? {
        constraint: simConfig.recMode,
        rec_price: simConfig.recMarketPrice,
        allow_buying: simConfig.recAllowBuying,
        allow_selling: simConfig.recAllowSelling,
      } : {
        constraint: simConfig.recMode,
        allow_buying: simConfig.recAllowBuying,
        allow_selling: simConfig.recAllowSelling,
      };
    }

    if (emissionsEnabled) {
        body["emissions"] = co2PriceSelected ? {
          emissions_type: simConfig.emissionsType,
          co2_price: simConfig.co2Price
      } : {
          emissions_type: simConfig.emissionsType,
          co2_constraint: simConfig.co2Constraint
      };
    }

    console.log(body);

    const reponse = await axios.post(`${config.api}/get-data`, body);
    return reponse;
  } catch (err) {
    console.log(err);
    console.log(err.response); // I guess we should store this in variable somewhere and display on page or alert box or something.
    return err.response;
  }
};

export default {
  runSimulation,
  getMarketData,
  getGeneratorData_ppa1,
  getGeneratorData_ppa2,
  getGeneratorData,
};
