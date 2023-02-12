import React, { Component } from "react";
import { Alert, Container, Modal} from "react-bootstrap";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";

import NemGloApi from "../api/NemgloApi";
import AgreeDisclaimer from "../components/AgreeDisclaimer";
import Footer from "../components/Footer";
import ElectrolyserLoadConfig from "./ElectrolyserLoadConfig";
import PlannerConfig from "./PlannerConfig";
import PPAConf from "./PPAConf";
import ResultsView from "./ResultsView";
import RevenueChartView from "./RevenueChartView";
import SimulationView from "./SimulationView";
import StrategyConfig from "./StrategyConfig";

const secProfiles = ["fixed", "variable"];
const regions = ["NSW1", "QLD1", "VIC1", "SA1", "TAS1"];
const technologyTypes = ["PEM", "AE"];

export default class SimulationDashboard extends Component {
  constructor() {
    super();
    this.state = {
      config: {
        dispatchIntervalLength: 30,
        startDate: "2021-01-01",
        startTime: "00:00",
        endDate: "2021-01-07",
        endTime: "00:00",
        electrolyserCapacity: 50,
        ppa1StrikePrice: 20,
        ppa1FloorPrice: 0,
        ppa1Capacity: 30,
        ppa2StrikePrice: 30,
        ppa2FloorPrice: 0,
        ppa2Capacity: 30,
        duid1: "",
        duid2: "",
        ppa1Data: {},
        ppa2Data: {},
        secProfile: secProfiles[0],
        conversionFactor: 100,
        nominalSec: 60,
        // overload: 0,
        // ratedLoad: 50,
        minStableLoad: 10,
        h2Price: 6,
        technologyType: technologyTypes[0],
        region: regions[0],
        recMode: "total",
        emissionsType: "Total",
        recAllowBuying: false,
        recAllowSelling: false,
        recMarketPrice: 50,
        co2Price: 50,
        co2Constraint: 5,
      },
      dataPoints: [],
      revenueResults: [],
      csvData: [],
      csvDataCosts: [],
      viewResults: false,
      resetConfig: false,
      runSimulation: false,
      viewConfig: true,
      resultsLoaded: false,
      runningSimulation: false,
      formValidated: false,
      isLoading: false,
      currentConfig: "plannerConfig",
      marketData: {},
      emissionsTypeEnabled: false,
      ppa1Disabled: false,
      ppa2Disabled: true,
      recEnabled: true,
      emissionsEnabled: false,
      recSpotPriceEnabled: false,
      emissionsCarbonPriceSelected: true,
      co2PriceSelected: false,
      co2ConstraintSelected: false,
      ppa1FloorPriceEnabled: false,
      ppa2FloorPriceEnabled: false,
      hideAgreeDisclaimer: false,
      showErrorLogs: false,
    };

    // Bindings go here
    this.setConfigValue = this.setConfigValue.bind(this);
    this.getResultsChartsData = this.getResultsChartsData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isDateInvalid = this.isDateInvalid.bind(this);
    this.setMarketData = this.setMarketData.bind(this);
    this.setPPADisabled = this.setPPADisabled.bind(this);
    this.setPPAData = this.setPPAData.bind(this);
    this.getChart1Settings = this.getChart1Settings.bind(this);
    this.getChart2Settings = this.getChart2Settings.bind(this);
    this.setStateVariable = this.setStateVariable.bind(this);
    this.hideDisclaimer = this.hideDisclaimer.bind(this);
  }

  isMarketDataLoaded = () => {
    return Object.keys(this.state.marketData).length > 0;
  };

  setConfigValue = (id, val) => {
    const { config } = this.state;
    config[id] = val;
    this.setState({
      config,
    });
  };

  hideDisclaimer = (val) => {
    this.setState({ hideAgreeDisclaimer: val });
  };

  getResultsChartsData = (response) => {
    const { config } = this.state;
    let data = response.data;
    let dataPoints = [];
    let revenueResults = [];
    let csvData = [];
    let csvDataCosts = [];
    for (let i = 0; i < data.time.length; i++) {
      let dataPoint = {};
      let csvRow = {};
      dataPoint["timestamp"] = data.timestamps[i];
      csvRow["Time"] = data.time[i];

      dataPoint["Price"] = data.prices[i];
      csvRow["Price"] = data.prices[i];
      if ("ppa1" in data) {
        dataPoint["PPA 1"] = data.ppa1.data[i] * config.ppa1Capacity;
        csvRow["PPA1"] = data.ppa1.data[i] * config.ppa1Capacity;
      }
      if ("ppa2" in data) {
        dataPoint["PPA 2"] = data.ppa2.data[i] * config.ppa2Capacity;
        csvRow["PPA2"] = data.ppa2.data[i] * config.ppa2Capacity;
      }
      if (("ppa2" in data) & ("ppa1" in data)) {
        dataPoint["Net PPA"] = data.combined_vre[i];
        csvRow["Net_PPA"] = data.combined_vre[i];
      }
      if ("rec" in data) {
        dataPoint["Market RECs"] = data.rec[i];
        csvRow["Market_RECs"] = data.rec[i];
      }
      if ("grid_emissions" in data) {
        dataPoint["Grid Emissions"] = data.grid_emissions[i];
        csvRow["Grid_Emissions"] = data.grid_emissions[i];
      }
      dataPoint["Load"] = data.optimised_load[i];
      csvRow["Load"] = data.optimised_load[i];
      dataPoints.push(dataPoint);
      csvData.push(csvRow);

      let revenueResult = {};
      let csvRowCosts = {};
      revenueResult["timestamp"] = data.timestamps[i];
      csvRowCosts["Timestamp"] = data.time[i];
      revenueResult["Energy"] = data.cost_energy[i];
      csvRowCosts["Energy"] = data.cost_energy[i];
      revenueResult["H2"] = data.cost_h2[i];
      csvRowCosts["H2"] = data.cost_h2[i];
      revenueResult["Total"] = data.cost_total[i];
      csvRowCosts["Total"] = data.cost_total[i];
      if ("cost_vre1" in data) {
        revenueResult["PPA 1"] = data.cost_vre1[i];
        csvRowCosts["PPA1"] = data.cost_vre1[i];
      }
      if ("cost_vre2" in data) {
        revenueResult["PPA 2"] = data.cost_vre2[i];
        csvRowCosts["PPA2"] = data.cost_vre2[i];
      }
      if ("cost_rec" in data) {
        revenueResult["Market RECs"] = data.cost_rec[i];
        csvRowCosts["Market_RECs"] = data.cost_rec[i];
      }
      revenueResults.push(revenueResult);
      csvDataCosts.push(csvRowCosts);
    }
    this.setState({ dataPoints, revenueResults, csvData, csvDataCosts });
  };

  viewResults = () => {
    this.setState({ viewResults: true, viewConfig: false });
  };

  viewConfig = () => {
    this.setState({ viewResults: false, viewConfig: true });
  };

  isDateInvalid = () => {
    const { config } = this.state;
    if (config.startDate !== "" && config.endDate !== "") {
      const start = new Date(config.startDate);
      const end = new Date(config.endDate);
      let diff = end.getTime() - start.getTime();
      let diffDays = diff / (1000 * 3600 * 24);
      return diffDays > 7 || diffDays <= 0;
    }
    return config.startDate === "" || config.endDate === "";
  };

  setMarketData = (marketData) => {
    const duid1 = marketData.availgens[2];
    const duid2 = marketData.availgens[3];
    this.setConfigValue("duid1", duid1);
    this.setConfigValue("duid2", duid2);
    this.setState({ marketData, duid1, duid2 });
  };

  setPPAData = (ppaData, PPANum) => {
    const { config } = this.state;
    if (PPANum === "duid1") {
      config.ppa1Data = ppaData;
    } else if (PPANum === "duid2") {
      config.ppa2Data = ppaData;
    }
    this.setState({ config });
  };

  setPPADisabled = (PPANum, isDisabled) => {
    if (PPANum === "duid1") {
      this.setState({ ppa1Disabled: isDisabled });
    } else if (PPANum === "duid2") {
      this.setState({ ppa2Disabled: isDisabled });
    }
  };

  setStateVariable(id, enabled) {
    this.setState({
      [id]: enabled,
    });
  }

  handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false || this.isDateInvalid()) {
      event.stopPropagation();
    } else {
      this.runSimulation();
    }
    this.setState({ formValidated: true });
  };

  runSimulation = async () => {
    const {config, ppa1Disabled, ppa2Disabled, recEnabled, recSpotPriceEnabled, emissionsEnabled, co2PriceSelected, co2ConstraintSelected} = this.state;
    this.setState({ runningSimulation: true, resultsLoaded: false });
    const response = await NemGloApi.runSimulation(
      config,
      ppa1Disabled,
      ppa2Disabled,
      recEnabled,
      recSpotPriceEnabled,
      emissionsEnabled,
      co2PriceSelected,
      co2ConstraintSelected
    );
    if (response.status === 200) {
      this.getResultsChartsData(response);
      this.setState({ runningSimulation: false, resultsLoaded: true, showErrorLogs: false });
    } else {
      console.log(response.data);
      alert("Simulation Error");
      this.setState({ runningSimulation: false, resultsLoaded: false, showErrorLogs: true, errorLogs: response.data});
    }
  };

  onSelectView = (id) => {
    let { currentConfig } = this.state;
    currentConfig = id;
    this.setState({
      currentConfig,
    });
  };

  resetConfig = () => {
    this.setState({
      config: {
        dispatchIntervalLength: 30,
        startDate: "2021-01-01",
        startTime: "00:00",
        endDate: "2021-01-07",
        endTime: "00:00",
        electrolyserCapacity: 50,
        ppa1StrikePrice: 20,
        ppa1FloorPrice: null,
        ppa1Capacity: 30,
        ppa2StrikePrice: 30,
        ppa2FloorPrice: null,
        ppa2Capacity: 30,
        duid1: "",
        duid2: "",
        ppa1Data: {},
        ppa2Data: {},
        secProfile: secProfiles[0],
        conversionFactor: 50,
        nominalSec: 6,
        // overload: 0,
        // ratedLoad: 50,
        minStableLoad: 50,
        h2Price: 6,
        technologyType: technologyTypes[0],
        region: regions[0],
      },
      dataPoints: [],
      viewResults: false,
      resetConfig: false,
      runSimulation: false,
      viewConfig: true,
      resultsLoaded: false,
      runningSimulation: false,
      formValidated: false,
      currentConfig: "plannerConfig",
    });
  };

  getChart1Settings = () => {
    const { ppa1Disabled, ppa2Disabled, emissionsEnabled, recSpotPriceEnabled } = this.state;

    let seriesSettings = [
      {
        valueYField: "Price",
        tooltip: "Price: ${valueY.formatNumber('#.00')}/MWh",
        enableYAxis: true,
      },
      {
        valueYField: "Load",
        tooltip: "Load:  {valueY.formatNumber('#.0')} MW",
        enableYAxis: false,
      },
    ];
    if ((!ppa1Disabled) && (!ppa2Disabled)) {
      seriesSettings.push({
        valueYField: "Net PPA",
        tooltip: "Net PPA:  {valueY.formatNumber('#.0')} MW",
        enableYAxis: true,
      });
    } else {
      if (!ppa1Disabled) {
        seriesSettings.push({
          valueYField: "PPA 1",
          tooltip: "PPA1:  {valueY.formatNumber('#.0')} MW",
          enableYAxis: false,
        });
      }
      if (!ppa2Disabled) {
        seriesSettings.push({
          valueYField: "PPA 2",
          tooltip: "PPA2:  {valueY.formatNumber('#.0')} MW",
          enableYAxis: false,
        });
      }
    }
    if (emissionsEnabled) {
      seriesSettings.push({
        valueYField: "Grid Emissions",
        tooltip: "EI:  {valueY.formatNumber('#.0')} tCO2e/MWh",
        enableYAxis: true,
      })
    }
    if (recSpotPriceEnabled) {
      seriesSettings.push({
        valueYField: "Market RECs",
        tooltip: "RECs:  {valueY.formatNumber('#.0')} MW",
        enableYAxis: false,
      });
    }
    return seriesSettings;
  };

  getChart2Settings = () => {
    let seriesSettings = [
      {
        valueYField: "Total",
        tooltip: "Total:  ${valueY.formatNumber('#.00')}",
        enableYAxis: false,
      },
      {
        valueYField: "Energy",
        tooltip: "Energy: ${valueY.formatNumber('#.00')}",
        enableYAxis: true,
      },
      {
        valueYField: "H2",
        tooltip: "H2:  ${valueY.formatNumber('#.00')}",
        enableYAxis: false,
      },
    ];
    if (!this.props.ppa1Disabled) { // This is not actually doing anything
      seriesSettings.push({
        valueYField: "PPA 1",
        tooltip: "PPA1:  ${valueY.formatNumber('#.00')}",
        enableYAxis: false,
      });
    }
    if (!this.props.ppa2Disabled) { // This is not actually doing anything
      seriesSettings.push({
        valueYField: "PPA 2",
        tooltip: "PPA2:  ${valueY.formatNumber('#.00')}",
        enableYAxis: false,
      });
    }
    seriesSettings.push({
      valueYField: "Market RECs",
      tooltip: "RECs:  ${valueY.formatNumber('#.00')}",
      enableYAxis: false,
    });
    return seriesSettings;
  };

  render() {
    const {
      config,
      resultsLoaded,
      dataPoints,
      csvData,
      csvDataCosts,
      currentConfig,
      marketData,
      emissionsTypeEnabled,
      ppa1Disabled,
      ppa2Disabled,
      revenueResults,
      recEnabled,
      emissionsEnabled,
      recSpotPriceEnabled,
      co2PriceSelected,
      co2ConstraintSelected,
      ppa1FloorPriceEnabled,
      ppa2FloorPriceEnabled,
      hideAgreeDisclaimer,
    } = this.state;
    return (
      <div>
        <div
          //className="full-screen-div"
          style={{
            display: "flex",
            background: "#eceff4",
            minHeight: "100vh",
            width: "100%",
          }} //,
        >
          <Sidebar style={{ borderRight: "None" }}>
            <Menu>
              <SubMenu label="Configure Model">
                <MenuItem
                  id="plannerConfig"
                  onClick={() => this.onSelectView("plannerConfig")}
                >
                  {" "}
                  Market Data{" "}
                </MenuItem>
                {this.isMarketDataLoaded() && (
                  <MenuItem
                    id="electrolyserConfig"
                    onClick={() => this.onSelectView("electrolyserConfig")}
                  >
                    {" "}
                    Electrolyser Load{" "}
                  </MenuItem>
                )}

                {this.isMarketDataLoaded() && (
                  <MenuItem
                    id="ppa1Config"
                    onClick={() => this.onSelectView("ppa1Config")}
                  >
                    {" "}
                    Renewable PPAs{" "}
                  </MenuItem>
                )}
                {this.isMarketDataLoaded() && (
                  <MenuItem
                    id="strategyConfig"
                    onClick={() => this.onSelectView("strategyConfig")}
                  >
                    {" "}
                    Operating Strategy{" "}
                  </MenuItem>
                )}
              </SubMenu>
              {this.isMarketDataLoaded() && (
                <MenuItem onClick={() => this.onSelectView("simulationView")}>
                  {" "}
                  Simulate{" "}
                </MenuItem>
              )}
              <SubMenu label="Results" defaultOpen={true}>
                {resultsLoaded && (
                  <MenuItem onClick={() => this.onSelectView("viewChart1")}>
                    {" "}
                    Price & Dispatch{" "}
                  </MenuItem>
                )}
                {resultsLoaded && (
                  <MenuItem onClick={() => this.onSelectView("viewChart2")}>
                    {" "}
                    View Costings{" "}
                  </MenuItem>
                )}
              </SubMenu>
            </Menu>
          </Sidebar>
          <Container
            style={{
              paddingBottom: 20,
              paddingTop: 20,
              paddingLeft: 20,
              paddingRight: 20,
            }}
          >
            <AgreeDisclaimer
              show={!hideAgreeDisclaimer}
              hideDisclaimer={this.hideDisclaimer}
              setStateVariable={this.setStateVariable}></AgreeDisclaimer>
            <Container
              style={{ paddingLeft: 5, paddingRight: 5, paddingBottom: 20 }}
            >
              {currentConfig === "plannerConfig" && (
                <PlannerConfig
                  setConfigValue={this.setConfigValue}
                  dispatchIntervalLength={config.dispatchIntervalLength}
                  startDate={config.startDate}
                  startTime={config.startTime}
                  endDate={config.endDate}
                  endTime={config.endTime}
                  region={config.region}
                  marketData={marketData}
                  emissionsType={config.emissionsType}
                  emissionsTypeEnabled={emissionsTypeEnabled}
                  setStateVariable={this.setStateVariable}
                  setMarketData={this.setMarketData}

                />
              )}
              {currentConfig === "electrolyserConfig" && (
                <ElectrolyserLoadConfig
                  setConfigValue={this.setConfigValue}
                  technologyType={config.technologyType}
                  h2Price={config.h2Price}
                  electrolyserCapacity={config.electrolyserCapacity}
                  minStableLoad={config.minStableLoad}
                  ratedLoad={config.ratedLoad}
                  overload={config.overload}
                  nominalSec={config.nominalSec}
                  conversionFactor={config.conversionFactor}
                  secProfile={config.secProfile}
                />
              )}
              {currentConfig === "ppa1Config" && (
                <PPAConf
                  config={config}
                  marketData={marketData}
                  ppa1Disabled={ppa1Disabled}
                  ppa2Disabled={ppa2Disabled}
                  setConfigValue={this.setConfigValue}
                  setPPAData={this.setPPAData}
                  setPPADisabled={this.setPPADisabled}
                  startDate={config.startDate}
                  startTime={config.startTime}
                  endDate={config.endDate}
                  endTime={config.endTime}
                  region={config.region}
                  dispatchIntervalLength={config.dispatchIntervalLength}
                  electrolyserCapacity={config.electrolyserCapacity}
                  ppa1FloorPriceEnabled={ppa1FloorPriceEnabled}
                  ppa2FloorPriceEnabled={ppa2FloorPriceEnabled}
                  setStateVariable={this.setStateVariable}
                />
              )}
              {currentConfig === "strategyConfig" && (
                <StrategyConfig
                  setConfigValue={this.setConfigValue}
                  recMode={config.recMode}
                  recMarketPrice={config.recMarketPrice}
                  recAllowBuying={config.recAllowBuying}
                  recAllowSelling={config.recAllowSelling}
                  setStateVariable={this.setStateVariable}
                  recEnabled={recEnabled}
                  emissionsEnabled={emissionsEnabled}
                  co2Price={config.co2Price}
                  co2Constraint={config.co2Constraint}
                  recSpotPriceEnabled={recSpotPriceEnabled}
                  emissionsTypeEnabled={emissionsTypeEnabled}
                  emissionsType={config.emissionsType}
                  co2PriceSelected={co2PriceSelected}
                  co2ConstraintSelected={co2ConstraintSelected}
                  ppasDisabled={ppa1Disabled && ppa2Disabled}
                />
              )}
              {currentConfig === "simulationView" && (
                <SimulationView
                  state={this.state}
                  runSimulation={this.runSimulation}
                  setStateVariable={this.setStateVariable}
                />
              )}
              {currentConfig === "viewChart1" && (
                <ResultsView
                  chart1={dataPoints}
                  csv={csvData}
                  csvFilename="nemglo-results-operation"
                  chartSettings={this.getChart1Settings()}
                  title={"Price & Dispatch Results"}
                />
              )}
              {currentConfig === "viewChart2" && (
                <RevenueChartView
                  chart1={revenueResults}
                  csv={csvDataCosts}
                  csvFilename="nemglo-results-costs"
                  chartSettings={this.getChart2Settings()}
                  title={"Cost Results"}
                />
              )}
            </Container>
            <Container
              style={{
                textAlign: "center",
              }}
            >
            </Container>
          </Container>
        </div>
        <Footer></Footer>
      </div>
    );
  }
}
