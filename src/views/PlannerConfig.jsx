import React, { Component } from "react";
import { Alert, Button, Card, Col, Container, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Audio } from "react-loader-spinner";

import NemGloApi from "../api/NemgloApi";
import MarketDataChart from "../components/charts/MarketDataChart";
import DownloadCSV from "../components/DownloadCSV";
import DropDownSelector from "../components/DropDownSelector";
import DropDownSelectorOptional from "../components/DropDownSelectorOptional";
import HelpToolTip from "../components/HelpToolTip";
import BackendErrorLogs from "../components/BackendErrorLogs";

const regions = ["NSW1", "QLD1", "VIC1", "SA1", "TAS1"];

export default class PlannerConfig extends Component {
  constructor() {
    super();
    this.state = {
      marketData: null,
      formValidated: false,
      dataPoints: [],
      isMakingApiCall: false,
      prevDispatchLength: null,
      prevStartDate: null, 
      prevEndDate: null, 
      prevRegion: null, 
      prevStartTime: null, 
      prevEndTime: null, 
      prevEmissionsType : null, 
      prevEmissionsEnabled: null
    };
    this.isDateInvalid = this.isDateInvalid.bind(this);
    this.getMarketData = this.getMarketData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.storeDataPoints = this.storeDataPoints.bind(this);
    this.getCSVData = this.getCSVData.bind(this);
    this.setStateVariable = this.setStateVariable.bind(this);
  }

  componentDidMount() {
    if (this.props.marketData !== {}) {
      if ("prices" in this.props.marketData) {
        if (this.props.marketData.prices.length > 0) {
          this.storeDataPoints(this.props.marketData);
        }
      }
    }
  }

  setStateVariable(id, enabled) {
    this.setState({
      [id]: enabled,
    });
  }
  handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      this.getMarketData();
    }
    this.setState({ formValidated: true });
  };

  isDateInvalid = () => {
    const { startDate, endDate } = this.props;
    if (startDate !== "" && endDate !== "") {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const earliest = new Date("2018-01-01T00:00:00.000+10:00");
      const curr = new Date(); //.toISOString().slice(0, 10);

      // Date not earlier than defined param
      if (start < earliest) {
        return true;
      }
      // Date not later than two months prior curr
      if (end.getTime() > curr.getTime() - 1000 * 3600 * 24 * 30 * 2) {
        return true;
      }
      let diff = end.getTime() - start.getTime();
      let diffDays = diff / (1000 * 3600 * 24);
      // Date range longer than 7 days or invalid
      if (diffDays > 7 || diffDays <= 0 || isNaN(diffDays)) {
        return true;
      } else {
        return false;
      }
    }
    if (startDate !== "" && endDate === "") {
      return true;
    }
    if (startDate === "" && endDate !== "") {
      return true;
    }
    return false;
  };

  getCSVData = (region, emissionsType, emissionsTypeEnabled) => {
    const { marketData } = this.props;
    let csvData = [["time", "region", "price"]];
    if (emissionsTypeEnabled && (emissionsType === "Total") && ('emissions' in marketData)) {
      csvData = [["time", "region", "price", "total_emissions_intensity"]];
    }
    if (emissionsTypeEnabled && (emissionsType === "Marginal") && ('emissions' in marketData)) {
      csvData = [["time", "region", "price", "marginal_emissions_intensity"]];
    }
    if ("time" in marketData) {
      for (let i = 0; i < marketData.time.length; i++) {
        if (emissionsTypeEnabled && ('emissions' in marketData)) {
          csvData.push([marketData.time[i], region, marketData.prices[i], marketData.emissions[i]]);
        } else {
          csvData.push([marketData.time[i], region, marketData.prices[i]]);
        }
      }
    }
    return csvData;
  };

  getMarketData = async () => {
    this.setState({ dataPoints: [] });
    const {
      startDate,
      endDate,
      region,
      dispatchIntervalLength,
      startTime,
      endTime,
      emissionsType,
      emissionsTypeEnabled
    } = this.props;
    const config = {
      startDate: startDate,
      endDate: endDate,
      startTime: startTime,
      endTime: endTime,
      region: region,
      dispatch_interval_length: dispatchIntervalLength,
      emissions_type: emissionsType,
    };
    this.setState({ prevDispatchLength: dispatchIntervalLength, prevStartDate: startDate, 
      prevEndDate: endDate, prevStartTime: startTime, prevEndTime: endTime, prevRegion: region, prevEmissionsEnabled: emissionsTypeEnabled, prevEmissionsType: emissionsType });
    this.setState({ isMakingApiCall: true });
    const response = await NemGloApi.getMarketData(config, emissionsTypeEnabled);
    if (response.code === "ERR_NETWORK") {
      const connectionErrorMessage = ("Failed to establish connection to NEMGLO_API.\n\n"+
        "The most likely cause is that you do not have NEMGLO_API running locally on your computer. "+
        "NEMGLO_API must run concurrently with the NEMGLO app interface.\n\n"+
        "Other reasons why this might have failed even if NEMGLO_API is running may be due to your browser blocking the NEMGLO API. "+
        "Ensure you are running NEMGLO locally via the executable. Do not try to access the NEMGLO app via the website!\n\n"+
        " For more information see: https://www.nemglo.org/start")
      this.setState({ isMakingApiCall: false, formValidated: false, showErrorLogs: true, errorLogs: connectionErrorMessage})
    } else {
      const marketData = response.data;
      this.setState({ isMakingApiCall: false, showErrorLogs: false });
      this.storeDataPoints(marketData);
      this.props.setMarketData(marketData);
      this.setState({ marketData });
    }
  };

  storeDataPoints = (marketData) => {
    let dataPoints = [];
    for (let i = 0; i < marketData.time.length; i++) {
      let dataPoint = {};
      dataPoint["timestamp"] = marketData.timestamps[i];
      dataPoint["Price"] = marketData.prices[i];
      if ("emissions" in marketData) {
        dataPoint["Emissions Intensity"] = marketData.emissions[i];
      }
      dataPoints.push(dataPoint);
    }
    this.setState({ dataPoints });   
  };

  render() {
    let seriesSettings = [
      {
        valueYField: "Price",
        tooltip: "{valueY.formatNumber('#.00')} $/MWh",
        enableYAxis: true,
      },
    ];
    if (this.props.emissionsTypeEnabled) {
      seriesSettings.push({
        valueYField: "Emissions Intensity",
        tooltip: "{valueY.formatNumber('#.000')} tCO2-e/MWh",
        enableYAxis: true,
      });
    }
    const {
      formValidated,
      dataPoints,
      isMakingApiCall,
      prevDispatchLength,
      prevStartDate, 
      prevEndDate, 
      prevRegion, 
      prevStartTime, 
      prevEndTime, 
      prevEmissionsEnabled,
      prevEmissionsType,
      showErrorLogs,
      errorLogs
    } = this.state;
    const {
      startDate,
      endDate,
      region,
      dispatchIntervalLength,
      startTime,
      endTime,
      emissionsType,
      emissionsTypeEnabled,
      setStateVariable,
      setConfigValue,
      marketData
    } = this.props;
    let showAlert =
      (prevDispatchLength !== null && prevDispatchLength !== dispatchIntervalLength) || 
      (prevStartDate !== null && prevStartDate !== startDate) || 
      (prevEndDate !== null && prevEndDate !== endDate) || 
      (prevRegion !== null && prevRegion !== region) || 
      (prevStartTime !== null && prevStartTime !== startTime) || 
      (prevEndTime !== null && prevEndTime !== endTime) ||
      (prevEmissionsEnabled !== null && prevEmissionsEnabled !== emissionsTypeEnabled) ||
      (prevEmissionsType !== null && prevEmissionsType !== emissionsType);
    let showDownloadCsv = ('time' in marketData) && (marketData.time.length > 0);
    return (
      <div>
        <BackendErrorLogs
          show={showErrorLogs}
          errorLogs={errorLogs}
          setStateVariable={this.setStateVariable}
        ></BackendErrorLogs>
        {showAlert && (
          <Alert key="info" variant="info">
            You updated the Planner Configuration, select Get Market Data to
            get new results.
          </Alert>
        )}
        <Card
          style={{
            paddingTop: 20,
            paddingLeft: 5,
            paddingRight: 5,
            paddingBottom: 5,
          }}
        >
          <Card.Title style={{ paddingLeft: 15 }}>Market Data</Card.Title>

          <Card.Body>
            {dataPoints.length > 0 && (
              <div>
                <MarketDataChart
                  id="planner-plot"
                  data={dataPoints}
                  seriesSettings={seriesSettings}
                  baseInterval={{
                    timeUnit: "minute",
                    count: dispatchIntervalLength,
                  }}
                ></MarketDataChart>
              </div>
            )}
            {!isMakingApiCall ? (
              <Form
                noValidate
                validated={formValidated}
                onSubmit={this.handleSubmit}
              >
                <Row>
                  <Col>
                    <DropDownSelector
                      id="dispatchIntervalLength"
                      label="Dispatch Interval Length"
                      description="The time resolution (minutes) between simulated load dispatch intervals. NEM input data is aggregated to this length."
                      value={dispatchIntervalLength}
                      options={[5, 30, 60]}
                      setConfigValue={setConfigValue}
                    ></DropDownSelector>

                    <Form.Group style={{ paddingBottom: 10 }}>
                      <Form.Label
                        style={{
                          textAlign: "text-center text-md-right",
                        }}
                      >
                        Start Time
                        <HelpToolTip
                          description={"Time to commence simulation."}
                        ></HelpToolTip>
                      </Form.Label>
                      <Form.Control
                        required
                        id="startTime"
                        type="time"
                        onChange={(e) =>
                          setConfigValue("startTime", e.target.value)
                        }
                        value={startTime}
                        isInvalid={this.isDateInvalid()}
                      />
                      <Container style={{ paddingBottom: 10 }}></Container>
                      <Form.Label
                        style={{
                          textAlign: "text-center text-md-right",
                        }}
                      >
                        Start Date
                        <HelpToolTip
                          description={
                            "Date to commence simulation. Time commences by default from 00:00 but all intervals are reported as time-ending."
                          }
                        ></HelpToolTip>
                      </Form.Label>
                      <Form.Control
                        style={{ paddingBottom: 10 }}
                        required
                        id="startDate"
                        type="date"
                        format="dd/MM/yyyy"
                        onChange={(e) =>
                          setConfigValue("startDate", e.target.value)
                        }
                        value={startDate}
                        isInvalid={this.isDateInvalid()}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please select a valid date. Earliest date supported is
                        01/01/2018. Maximum date range is 7 days.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <DropDownSelectorOptional
                      id="emissionsType"
                      label="Emissions Type"
                      description="Enable checkbox to load emissions data. Emissions Type can either be Total (Average Emissions Intensity of the specified region) or Marginal Emissions Intensity."
                      value={emissionsType}
                      options={["Total", "Marginal"]}
                      setConfigValue={setConfigValue}
                      selected={emissionsTypeEnabled}
                      selectedId="emissionsTypeEnabled"
                      setStateVariable={setStateVariable}
                    ></DropDownSelectorOptional>
                  </Col>

                  <Col>
                    <DropDownSelector
                      id="region"
                      label="Region"
                      description="The NEM region for which input data is sourced and the simulation is run in."
                      value={region}
                      options={regions}
                      setConfigValue={setConfigValue}
                    ></DropDownSelector>

                    <Form.Group style={{ paddingBottom: 10 }}>
                      <Form.Label
                        style={{
                          textAlign: "text-center text-md-right",
                        }}
                      >
                        End Time
                        <HelpToolTip
                          description={
                            "Date to commence simulation. Time commences by default from 00:00 but all intervals are reported as time-ending."
                          }
                        ></HelpToolTip>
                      </Form.Label>

                      <Form.Control
                        required
                        id="endTime"
                        type="time"
                        onChange={(e) =>
                          setConfigValue("endTime", e.target.value)
                        }
                        value={endTime}
                        isInvalid={this.isDateInvalid()}
                      />
                      <Container style={{ paddingBottom: 10 }}></Container>

                      <Form.Label
                        style={{
                          textAlign: "text-center text-md-right",
                        }}
                      >
                        End Date
                        <HelpToolTip
                          description={
                            "Date to end simulation. Time ends by default at 00:00"
                          }
                        ></HelpToolTip>
                      </Form.Label>
                      <Form.Control
                        required
                        id="endDate"
                        type="date"
                        format="dd/MM/yyyy"
                        onChange={(e) =>
                          setConfigValue("endDate", e.target.value)
                        }
                        value={endDate}
                        isInvalid={this.isDateInvalid()}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please select a valid date. Latest date supported is 2
                        months prior today. Maximum date range is 7 days.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Container style={{ height: 10 }}></Container>
                {showDownloadCsv && (
                  <DownloadCSV data={this.getCSVData(region, emissionsType, emissionsTypeEnabled)} filename="nemglo-market-data"></DownloadCSV>
                )}
                {this.isDateInvalid() && (
                  <Button
                    className="float-end"
                    type="submit"
                    variant={"secondary"}
                    disabled={this.isDateInvalid()}
                  >
                    Get Market Data
                  </Button>
                )}
                {!this.isDateInvalid() && (
                  <Button
                    className="float-end"
                    type="submit"
                    variant={"primary"}
                    disabled={this.isDateInvalid()}
                  >
                    Get Market Data
                  </Button>
                )}
              </Form>
            ) : (
              <Audio
                height="80"
                width="80"
                radius="9"
                color="green"
                ariaLabel="loading"
                wrapperStyle
                wrapperClass
                style={{
                  height: "100vh",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            )}
          </Card.Body>
        </Card>
      </div>
    );
  }
}
