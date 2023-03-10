import React, { Component } from "react";
import { Button, Card } from "react-bootstrap";
import { Audio } from "react-loader-spinner";

import BackendErrorLogs from "../components/BackendErrorLogs";
import HelpToolTip from "../components/HelpToolTip";

export default class SimulationView extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
    };
    this.onRunSimulation = this.onRunSimulation.bind(this);
  }

  onRunSimulation = async () => {
    this.setState({ isLoading: true });
    await this.props.runSimulation();
    this.setState({ isLoading: false });
  };

  render() {
    const {
      config,
      ppa1Disabled,
      ppa2Disabled,
      recEnabled,
      emissionsEnabled,
      recSpotPriceEnabled,
      emissionsCarbonPriceSelected,
      co2PriceSelected,
      co2ConstraintSelected,
      showErrorLogs,
      errorLogs
    } = this.props.state;
    return (
      <div>
        <BackendErrorLogs
          show={showErrorLogs}
          errorLogs={errorLogs}
          setStateVariable={this.props.setStateVariable}
        ></BackendErrorLogs>
        <Card>
          <Card.Header>
            Perform Simulation
            <HelpToolTip
              description={
                "A summary of the configured input parameters for the simulator."
              }
            ></HelpToolTip>
          </Card.Header>
          <Card.Body>
            {!this.state.isLoading ? (
              <div>
                <Card.Title style={{ paddingBottom: 10 }}>Market Data</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Dispatch Interval: {config.dispatchIntervalLength}
                </Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">
                  Start Date: {config.startDate}
                </Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">
                  End Date: {config.endDate}
                </Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">
                  Region: {config.region}
                </Card.Subtitle>
                <Card.Title style={{ paddingBottom: 10, paddingTop: 10 }}>
                  Electrolyser Load
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Technology Type: {config.technologyType}
                </Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">
                  H2 Price ($/kh): {config.h2Price}
                </Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">
                  Capacity (MW): {config.electrolyserCapacity}
                </Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">
                  Minimum Stable Load: {config.minStableLoad}
                </Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">
                  Nominal SEC (KWH/kg): {config.nominalSec}
                </Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">
                  Conversion Factor (%): {config.conversionFactor}
                </Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">
                  SEC Profile: {config.secProfile}
                </Card.Subtitle>
                {!ppa1Disabled && (
                  <div>
                    <Card.Title style={{ paddingBottom: 10, paddingTop: 10 }}>
                      PPA 1
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      DUID (Unit): {config.duid1}
                    </Card.Subtitle>
                    <Card.Subtitle className="mb-2 text-muted">
                      PPA Strike ($/MWh): {config.ppa1StrikePrice}
                    </Card.Subtitle>
                    <Card.Subtitle className="mb-2 text-muted">
                      Capacity (MW): {config.ppa1Capacity}
                    </Card.Subtitle>
                  </div>
                )}
                {!ppa2Disabled && (
                  <div>
                    <Card.Title style={{ paddingBottom: 10, paddingTop: 10 }}>
                      PPA 2
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      DUID (Unit): {config.duid2}
                    </Card.Subtitle>
                    <Card.Subtitle className="mb-2 text-muted">
                      PPA Strike ($/MWh): {config.ppa2StrikePrice}
                    </Card.Subtitle>
                    <Card.Subtitle className="mb-2 text-muted">
                      Capacity (MW): {config.ppa2Capacity}
                    </Card.Subtitle>
                  </div>
                )}
                {recEnabled && (
                  <div>
                    <Card.Title style={{ paddingBottom: 10, paddingTop: 10 }}>
                      Renewable Energy Certificates (RECs)
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Accounting Method:{" "}
                      {config.recMode === "total"
                        ? "[Aggregate] Acquire and Surrender RECs in Aggregate"
                        : "[Temporal] Temporally Match Operation to RECs via PPAs"}
                    </Card.Subtitle>
                    {recSpotPriceEnabled && (
                      <Card.Subtitle className="mb-2 text-muted">
                        REC Spot Price ($/MWh): {config.recMarketPrice}
                      </Card.Subtitle>
                    )}
                    <Card.Subtitle className="mb-2 text-muted">
                      Allow Buying RECs:{" "}
                      {config.recAllowBuying ? "True" : "False"}
                    </Card.Subtitle>
                    <Card.Subtitle className="mb-2 text-muted">
                      Allow Selling RECs:{" "}
                      {config.recAllowSelling ? "True" : "False"}
                    </Card.Subtitle>
                  </div>
                )}
                {emissionsEnabled && (
                  <div>
                    <Card.Title style={{ paddingBottom: 10, paddingTop: 10 }}>
                      Emissions
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Grid Emissions Trace: {config.emissionsType}
                    </Card.Subtitle>
                    {co2PriceSelected && (
                      <Card.Subtitle className="mb-2 text-muted">
                        Shadow Carbon Price ($/tCO2-e): {config.co2Price}
                      </Card.Subtitle>
                    )}
                    {co2ConstraintSelected && (
                      <Card.Subtitle className="mb-2 text-muted">
                        Carbon Intensity of H2 (tCO2-e/tH2):{" "}
                        {config.co2Constraint}
                      </Card.Subtitle>
                    )}
                  </div>
                )}
                <br></br>
                <Button variant={"primary"} onClick={this.onRunSimulation}>
                  Run Simulation
                </Button>{" "}
                <Button
                  variant={"danger"}
                  onClick={() => window.location.reload(false)}
                >
                  Reset Model Config
                </Button>
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
