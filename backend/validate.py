# Validate API Calls
import pandas as pd
import logging

logger = logging.getLogger(__name__)

def validate_get_market_data(conf):
    """Validate required and allowed fields for '/api/get-market-data' call.
    """
    _check_fields(d=conf,
                  name="conf",
                  required={"market_data"},
                  allowed={"emissions_data"})

    _check_fields(d=conf['market_data'],
                  name="conf['market_data']",
                  required={"start_date", "end_date", "region", "dispatch_interval_length"},
                  allowed={""}
                  )

    if 'emissions_data' in conf:
        _check_fields(d=conf['emissions_data'],
                      name="conf['emissions_data']",
                      required={"emissions_type"})


def validate_get_generator_data(conf):
    """Validate required and allowed fields for '/api/get-generator-data' call.    
    """
    _check_fields(d=conf,
                  name="conf",
                  required={"market_data","ppa"},
                  allowed={""})

    _check_fields(d=conf['market_data'],
                  name="conf['market_data']",
                  required={"start_date", "end_date", "region", "dispatch_interval_length"},
                  allowed={""}
                  )

    _check_fields(d=conf['ppa'],
                  name="conf['ppa']",
                  required={"duid", "capacity"},
                  allowed={"strike_price","floor_price"})


def validate_get_data(conf):
    """Validate required and allowed fields for '/api/get-data' call.    
    """
    _check_fields(d=conf,
                  name="conf",
                  required={"market_data", "electrolyser_load", "ppa_1", "ppa_2", "rec"},
                  allowed={""})
    logger.warning("No subfield checks on '/api/get-data'")
    # _check_fields(d=conf['market_data'],
    #               name="conf['market_data']",
    #               required={"start_date", "end_date", "region", "dispatch_interval_length"},
    #               allowed={""}
    #               )

    # _check_fields(d=conf['ppa'],
    #               name="conf['ppa']",
    #               required={"duid", "capacity", "strike_price"},
    #               allowed={"floor_price"})


def _check_fields(d, name="", required={""}, allowed={""}, log_type=logger.exception):
    err_message = f"API param: {name} has invalid fields. Required fields are: {required}. Allowed fields are: {allowed}"
    try:
        assert required <= d.keys() <= (required | allowed), err_message
    except AssertionError as e:
        log_type(e)
        raise e