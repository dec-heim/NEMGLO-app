import { max } from "moment";
import React, { Component } from "react";
import { Alert, Button, ButtonGroup, Card, Col, Container, Row, ToggleButton } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Audio } from "react-loader-spinner";

import NemGloApi from "../api/NemgloApi";
import NewPPAChart from "../components/charts/NewPPAChart";
import DownloadCSV from "../components/DownloadCSV";
import PPAConfig from "./PPAConfig";

export default class PPAConf extends Component {
  constructor() {
    super();
    this.state = {
      marketData: null,
      formValidated: false,
      startDate: "",
      endDate: "",
      region: "",
      dispatchIntervalLength: 0,
      dataPoints: [],
      csvData: [],
      isMakingApiCall: false,
      duid1ApiCall: "",
      duid2ApiCall: "",
      showDispatchChart: true,
    };
    this.isDisabled = this.isDisabled.bind(this);
    this.setConfigUpdateChart = this.setConfigUpdateChart.bind(this);
    this.setPPADisabled = this.setPPADisabled.bind(this);
  }

  showDispatchChart(isShow) {
    console.log(isShow);
    this.setState({ showDispatchChart: isShow });
  }

  setPPADisabled(PPANum, isDisabled) {
    this.props.setPPADisabled(PPANum, isDisabled);
    const { config } = this.props;
    let ppa1Capacity = config.ppa1Capacity;
    let ppa2Capacity = config.ppa2Capacity;
    let ppa1Disabled = this.props.ppa1Disabled;
    let ppa2Disabled = this.props.ppa2Disabled;

    if (isDisabled) {
      if (PPANum === "duid1") {
        ppa1Disabled = true;
      } else if (PPANum === "duid2") {
        ppa2Disabled = true;
      }
    } else {
      if (PPANum === "duid1") {
        ppa1Disabled = false;
      } else if (PPANum === "duid2") {
        ppa2Disabled = false;
      }
    }

    this.storeDataPoints(
      config.ppa1Data,
      config.ppa2Data,
      ppa1Capacity,
      ppa2Capacity,
      ppa1Disabled,
      ppa2Disabled
    );
  }

  setConfigUpdateChart(id, capacity) {
    console.log(this.props)
    const { setConfigValue, config, ppa1Disabled, ppa2Disabled } = this.props;
    setConfigValue(id, capacity);
    if (
      config.ppa1Data.time !== undefined ||
      config.ppa2Data.time !== undefined
    ) {

      this.storeDataPoints(
        config.ppa1Data,
        config.ppa2Data,
        config.ppa1Capacity,
        config.ppa2Capacity,
        ppa1Disabled,
        ppa2Disabled
      );
    }
  }

  handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      this.getGeneratorData();
    }
    this.setState({ formValidated: true });
  };

  getGeneratorData = async () => {
    this.setState({ dataPoints: [] });
    const {
      startDate,
      endDate,
      region,
      dispatchIntervalLength,
      setPPAData,
      config,
      marketData,
      ppa1Disabled,
      ppa2Disabled,
    } = this.props;
    const duid1Body = {
      startDate: startDate,
      endDate: endDate,
      region: region,
      dispatchIntervalLength: dispatchIntervalLength,
      duid: config.duid1 === "" ? marketData.availgens[0] : config.duid1,
      ppaCapacity: config.ppa1Capacity,
      ppaStrikePrice: config.ppa1StrikePrice,
      ppaFloorPrice: config.ppa1FloorPrice,
    };
    const duid2Body = {
      startDate: startDate,
      endDate: endDate,
      region: region,
      dispatchIntervalLength: dispatchIntervalLength,
      duid: config.duid2 === "" ? marketData.availgens[1] : config.duid2,
      ppaCapacity: config.ppa2Capacity,
      ppaStrikePrice: config.ppa2StrikePrice,
      ppaFloorPrice: config.ppa2FloorPrice,
    };

    this.setState({
      isMakingApiCall: true,
      duid1ApiCall: duid1Body.duid,
      duid2ApiCall: duid2Body.duid,
    });

    let ppaData1 = {};
    let ppaData2 = {};

    if (!ppa1Disabled) {
      ppaData1 = await NemGloApi.getGeneratorData(duid1Body);
      if (ppaData1 === null) {
        this.setState({ isMakingApiCall: false });
      }
    }
    if (!ppa2Disabled) {
      ppaData2 = await NemGloApi.getGeneratorData(duid2Body);
      if (ppaData2 === null) {
        this.setState({ isMakingApiCall: false });
      }
    }

    this.storeDataPoints(
      ppaData1,
      ppaData2,
      config.ppa1Capacity,
      config.ppa2Capacity,
      ppa1Disabled,
      ppa2Disabled
    );
    setPPAData(ppaData1, "duid1");
    setPPAData(ppaData2, "duid2");
    this.setState({ isMakingApiCall: false });
  };

  componentDidMount() {
    const {
      startDate,
      endDate,
      region,
      dispatchIntervalLength,
      config,
      ppa1Disabled,
      ppa2Disabled,
    } = this.props;
    this.setState({
      startDate,
      endDate,
      region,
      dispatchIntervalLength,
    });
    if (
      config.ppa1Data.time !== undefined ||
      config.ppa2Data.time !== undefined
    ) {
      this.storeDataPoints(
        config.ppa1Data,
        config.ppa2Data,
        config.ppa1Capacity,
        config.ppa2Capacity,
        ppa1Disabled,
        ppa2Disabled
      );
    }
  }

  calculateCost = (capacity, floorPrice, strikePrice, marketPrice, floorPriceEnabled) => {
    const { dispatchIntervalLength } = this.props;
    if (floorPriceEnabled) {
      return (
        (strikePrice - Math.max(floorPrice, marketPrice)) *
        (dispatchIntervalLength / 60) * capacity
      );
    } else {
      return (strikePrice - marketPrice) * (dispatchIntervalLength / 60) * capacity;
    }
  };

  storeDataPoints = (
    ppaData1,
    ppaData2,
    ppa1Capacity,
    ppa2Capacity,
    ppa1Disabled,
    ppa2Disabled
  ) => {
    if (ppa1Disabled && ppa2Disabled) {
      return;
    }

    const { config, ppa1FloorPriceEnabled, ppa2FloorPriceEnabled, marketData } =
      this.props;
    let dataPoints = [];
    let csvData = [];

    if (!ppa1Disabled && "time" in ppaData1) {
      for (let i = 0; i < ppaData1.time.length; i++) {
        let dataPoint = {};
        let csvRow = {};
        dataPoint["timestamp"] = ppaData1.timestamps[i];
        csvRow["Time"] = ppaData1.time[i];
        // csvRow["Electrolyser Nominal Load"] = config.electrolyserCapacity; // No need to have this in CSV
        dataPoint["Electrolyser Nominal Load"] = config.electrolyserCapacity;
        if (!ppa1Disabled) {
          dataPoint["PPA 1"] = ppa1Capacity * ppaData1.cf_trace[i];
          csvRow["PPA 1"] = ppa1Capacity * ppaData1.cf_trace[i];
          dataPoint["PPA 1 Cost"] = this.calculateCost(
            config.ppa1Capacity,
            config.ppa1FloorPrice,
            config.ppa1StrikePrice,
            marketData.prices[i],
            ppa1FloorPriceEnabled
          );
          csvRow["PPA 1 Cost"] = this.calculateCost(
            config.ppa1Capacity,
            config.ppa1FloorPrice,
            config.ppa1StrikePrice,
            marketData.prices[i],
            ppa1FloorPriceEnabled
          );
        }
        if (!ppa2Disabled) {
          dataPoint["PPA 2"] = ppa2Capacity * ppaData2.cf_trace[i];
          csvRow["PPA 2"] = ppa2Capacity * ppaData2.cf_trace[i];
          dataPoint["PPA 2 Cost"] = this.calculateCost(
            config.ppa2Capacity,
            config.ppa2FloorPrice,
            config.ppa2StrikePrice,
            marketData.prices[i],
            ppa2FloorPriceEnabled
          );
          csvRow["PPA 2 Cost"] = this.calculateCost(
            config.ppa2Capacity,
            config.ppa2FloorPrice,
            config.ppa2StrikePrice,
            marketData.prices[i],
            ppa2FloorPriceEnabled
          );
        }
        if ("PPA 1" in dataPoint && "PPA 2" in dataPoint) {
          dataPoint["Combined Trace"] = dataPoint["PPA 1"] + dataPoint["PPA 2"];
          csvRow["Combined Trace"] = dataPoint["PPA 1"] + dataPoint["PPA 2"];
          dataPoint["Combined Cost"] =
            dataPoint["PPA 1 Cost"] + dataPoint["PPA 2 Cost"];
          csvRow["Combined Cost"] =
            dataPoint["PPA 1 Cost"] + dataPoint["PPA 2 Cost"];
        }
        dataPoints.push(dataPoint);
        csvData.push(csvRow);
      }
    } else if ("time" in ppaData2) {
      for (let i = 0; i < ppaData2.time.length; i++) {
        let dataPoint = {};
        let csvRow = {};
        dataPoint["timestamp"] = ppaData2.timestamps[i];
        csvRow["Time"] = ppaData2.time[i];
        csvRow["Electrolyser Nominal Load"] = config.electrolyserCapacity;
        dataPoint["Electrolyser Nominal Load"] = config.electrolyserCapacity;
        if (!ppa1Disabled) {
          dataPoint["PPA 1"] = ppa1Capacity * ppaData1.cf_trace[i];
          csvRow["PPA 1"] = ppa1Capacity * ppaData1.cf_trace[i];
          dataPoint["PPA 1 Cost"] = ppaData1.cost_trace[i];
          csvRow["PPA 1 Cost"] = ppaData1.cost_trace[i];
        }
        if (!ppa2Disabled) {
          dataPoint["PPA 2"] = ppa2Capacity * ppaData2.cf_trace[i];
          csvRow["PPA 2"] = ppa2Capacity * ppaData2.cf_trace[i];
          dataPoint["PPA 2 Cost"] = ppaData2.cost_trace[i];
          csvRow["PPA 2 Cost"] = ppaData2.cost_trace[i];
        }
        if ("PPA 1" in dataPoint && "PPA 2" in dataPoint) {
          dataPoint["Combined Trace"] = dataPoint["PPA 1"] + dataPoint["PPA 2"];
          csvRow["Combined Trace"] = dataPoint["PPA 1"] + dataPoint["PPA 2"];
          dataPoint["Combined Cost"] =
            dataPoint["PPA 1 Cost"] + dataPoint["PPA 2 Cost"];
          csvRow["Combined Cost"] =
            dataPoint["PPA 1 Cost"] + dataPoint["PPA 2 Cost"];
        }
        // console.log(dataPoints);
        dataPoints.push(dataPoint);
        csvData.push(csvRow);
      }
    }
    this.setState({ dataPoints, csvData });
  };

  isDisabled = () => {
    return this.state.radioValue === "2";
  };

  render() {
    let {
      setConfigValue,
      config,
      marketData,
      ppa1Disabled,
      ppa2Disabled,
      setPPADisabled,
      setPPAData,
      ppa1FloorPriceEnabled,
      ppa2FloorPriceEnabled,
      setStateVariable
    } = this.props;
    let {
      formValidated,
      dataPoints,
      csvData,
      isMakingApiCall,
      duid1ApiCall,
      duid2ApiCall,
      showDispatchChart,
    } = this.state;
    const baseInterval = {
      timeUnit: "minute",
      count: 5,
    };
    let dispatchSeriesSettings = [];
    let costSeriesSettings = [];
    if (!ppa1Disabled) {
      dispatchSeriesSettings.push({
        valueYField: "PPA 1",
        tooltip: "#1: {valueY.formatNumber('#.0')} MW",
        enableYAxis: true,
      });
      costSeriesSettings.push({
        valueYField: "PPA 1 Cost",
        tooltip: "#1: {valueY.formatNumber('#.00')} $/MWh",
        enableYAxis: true,
      });
    }

    if (!ppa2Disabled) {
      dispatchSeriesSettings.push({
        valueYField: "PPA 2",
        tooltip: "#2: {valueY.formatNumber('#.0')} MW",
        enableYAxis: true,
      });
      costSeriesSettings.push({
        valueYField: "PPA 2 Cost",
        tooltip: "#2: {valueY.formatNumber('#.00')} $/MWh",
        enableYAxis: true,
      });
    }
    if (!ppa1Disabled && !ppa2Disabled) {
      dispatchSeriesSettings.push({
        valueYField: "Combined Trace",
        tooltip: "NET: {valueY.formatNumber('#.0')} MW",
        enableYAxis: true,
      });
      costSeriesSettings.push({
        valueYField: "Combined Cost",
        tooltip: "NET: {valueY.formatNumber('#.00')} $/MWh",
        enableYAxis: true,
      });
    }
    dispatchSeriesSettings.push({
      valueYField: "Electrolyser Nominal Load",
      tooltip: "Nominal Load",
      enableYAxis: true,
    });

    let showAlert =
      (duid1ApiCall !== "" && duid1ApiCall !== config.duid1) ||
      (duid2ApiCall !== "" && duid2ApiCall !== config.duid2);
    let showDownloadCsv = csvData.length !== 0;
    let seriesSettings = showDispatchChart
      ? dispatchSeriesSettings
      : costSeriesSettings;
    return (
      <div>
        {showAlert && (
          <Alert key="info" variant="info">
            You updated the PPA Configuration, select Get Renewables Data to get
            new results.
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
          <Card.Title style={{ paddingLeft: 15, paddingRight: 15 }}>
            Renewable Power Purchase Agreements
            {dataPoints.length > 0 && (
            <ButtonGroup className="mb-2 float-end">
              <Button onClick={() => this.showDispatchChart(true)} variant={showDispatchChart ? "primary": "outline-primary"} active={showDispatchChart ? true : false}>
                Dispatch
              </Button>
              <Button onClick={() => this.showDispatchChart(false)} variant={showDispatchChart ? "outline-primary" : "primary"} active={showDispatchChart ? false : true}>
                Cost
              </Button>
            </ButtonGroup>
            )}
          </Card.Title>
          <Card.Body>
            {!isMakingApiCall ? (
              <div>
                {dataPoints.length > 0 && (
                  <NewPPAChart
                    id={"ppa-plot"}
                    data={dataPoints}
                    isDispatchChart={showDispatchChart}
                    seriesSettings={seriesSettings}
                    baseInterval={{
                      timeUnit: "minute",
                      count: config.dispatchIntervalLength,
                    }}
                  ></NewPPAChart>
                )}
                <Container
                  style={{
                    paddingTop: 20,
                  }}
                >
                  <Form
                    noValidate
                    validated={formValidated}
                    onSubmit={this.handleSubmit}
                  >
                    <Row className="show-grid">
                      <Col>
                        <PPAConfig
                          title="PPA 1"
                          duidId="duid1"
                          prevDuid={this.state.duid1ApiCall}
                          capacityId="ppa1Capacity"
                          strikePriceId="ppa1StrikePrice"
                          floorPriceId="ppa1FloorPrice"
                          setConfigValue={setConfigValue}
                          setConfigUpdateChart={this.setConfigUpdateChart}
                          duid={
                            config.duid1 === ""
                              ? marketData.availgens[0]
                              : config.duid1
                          }
                          ppaCapacity={config.ppa1Capacity}
                          ppaStrikePrice={config.ppa1StrikePrice}
                          ppaFloorPrice={config.ppa1FloorPrice}
                          marketData={marketData}
                          otherPPADuid={config.duid2}
                          isDisabled={ppa1Disabled}
                          setPPADisabled={this.setPPADisabled}
                          availableGens={marketData.availgens}
                          startDate={config.startDate}
                          endDate={config.endDate}
                          region={config.region}
                          dispatchIntervalLength={config.dispatchIntervalLength}
                          ppaData={config.ppa1Data}
                          setPPAData={setPPAData}
                          electrolyserCapacity={config.electrolyserCapacity}
                          ppaFloorPriceEnabled={ppa1FloorPriceEnabled}
                          ppaFloorPriceId="ppa1FloorPriceEnabled"
                          setStateVariable={setStateVariable}
                        />
                      </Col>
                      <Col>
                        <PPAConfig
                          title="PPA 2"
                          duidId="duid2"
                          prevDuid={this.state.duid2ApiCall}
                          capacityId="ppa2Capacity"
                          strikePriceId="ppa2StrikePrice"
                          floorPriceId="ppa2FloorPrice"
                          setConfigValue={setConfigValue}
                          setConfigUpdateChart={this.setConfigUpdateChart}
                          duid={
                            config.duid2 === ""
                              ? marketData.availgens[1]
                              : config.duid2
                          }
                          ppaCapacity={config.ppa2Capacity}
                          ppaStrikePrice={config.ppa2StrikePrice}
                          ppaFloorPrice={config.ppa2FloorPrice}
                          marketData={marketData}
                          otherPPADuid={config.duid1}
                          isDisabled={ppa2Disabled}
                          setPPADisabled={this.setPPADisabled}
                          availableGens={marketData.availgens}
                          startDate={config.startDate}
                          endDate={config.endDate}
                          region={config.region}
                          dispatchIntervalLength={config.dispatchIntervalLength}
                          ppaData={config.ppa2Data}
                          setPPAData={setPPAData}
                          electrolyserCapacity={config.electrolyserCapacity}
                          ppaFloorPriceEnabled={ppa2FloorPriceEnabled}
                          ppaFloorPriceId="ppa2FloorPriceEnabled"
                          setStateVariable={setStateVariable}
                        />
                      </Col>
                    </Row>
                    <Container style={{ height: 10 }}></Container>
                    {showDownloadCsv && (
                      <DownloadCSV
                        data={csvData}
                        filename="nemglo-ppa-data"
                      ></DownloadCSV>
                    )}
                    {ppa1Disabled && ppa2Disabled ? (
                      <Button className="float-end" variant={"secondary"}>
                        Get Renewables Data
                      </Button>
                    ) : (
                      <Button
                        className="float-end"
                        type="submit"
                        variant={"primary"}
                      >
                        Get Renewables Data
                      </Button>
                    )}
                  </Form>
                </Container>
              </div>
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
