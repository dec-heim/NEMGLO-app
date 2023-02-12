import React, { useState } from "react";
import { Alert, Card, Col, Container, Row } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import ToggleButton from "react-bootstrap/ToggleButton";

import DropDownSelector from "../components/DropDownSelector";
import RegularInput from "../components/RegularInput";
import SliderInput from "../components/SliderInput";
import SliderInputOptional from "../components/SliderInputOptional";
import SwitchInputOptional from "../components/SwitchInputOptional";

export default function StrategyConfig({
  setConfigValue,
  recMode,
  recMarketPrice,
  recAllowBuying,
  recAllowSelling,
  setStateVariable,
  recEnabled,
  emissionsEnabled,
  co2Price,
  co2Constraint,
  recSpotPriceEnabled,
  emissionsTypeEnabled,
  emissionsType,
  co2PriceSelected,
  co2ConstraintSelected,
  ppasDisabled,
}) {
  const [showAlert, setShowAlert] = useState(false);
  const [showAlert1, setShowAlert1] = useState(false);
  const [forceRecEnable, setForceRecEnable] = useState(false);

  const toggleButton = (id, checked) => {
    if (id === "emissionsEnabled") {
      if (!emissionsTypeEnabled) {
        setShowAlert(true);
      } else {
        setStateVariable(id, checked);
      }
    } else {
      setStateVariable(id, checked);
    }
  };

  const setAccountingMethod = (id, value) => {
    if (value.includes("[Aggregate]")) {
      setConfigValue(id, "total");
    }
    if (value.includes("[Temporal]")) {
      setConfigValue(id, "interval");
    }
  };


  const toggleEmissions = (id, val) => {
    setConfigValue(id, val);
    setShowAlert1(true);
  };

  const toggleRecSpotPrice = (id, val) => {
    if (!ppasDisabled) {
      setStateVariable(id, val);
    }
  }

  return (
    <div>
      {showAlert && (
        <Alert key="info" variant="info">
          Go back to <b>Market Data</b> and update the <i>Emissions Type</i> to retrieve correct
          data
        </Alert>
      )}
        {showAlert1 && (
        <Alert key="info" variant="info">
          Updated Emissions Trace. Go to <b>Market Data</b> to refresh the market data chart.
        </Alert>
      )}
      <Card
        style={{
          paddingTop: 20,
          paddingBottom: 10,
          paddingLeft: 5,
          paddingRight: 5,
        }}
      >
        <Card.Title style={{ paddingLeft: 15 }}>
          {/* <Alert
          variant="dark"
          style={{ paddingLeft: 50, textAlign: "center", fontSize: "15px" }}
        >
          New features coming soon...
        </Alert> */}
          Operating Strategy
        </Card.Title>
        <Card.Body>
          <Row>
            <Col>
              <Card>
                <Card.Title style={{ paddingLeft: 15, paddingTop: 15 }}>
                  Renewable Energy Certificates (RECs)
                  <ToggleButton
                    style={{ marginRight: "1rem" }}
                    className="mb-2 float-end"
                    id="recEnabled"
                    type="checkbox"
                    variant={recEnabled ? "primary" : "secondary"}
                    checked={recEnabled}
                    value="1"
                    onChange={(e) =>
                      toggleButton("recEnabled", e.currentTarget.checked)
                    }
                  >
                    {recEnabled ? "Enabled" : "Disabled"}
                  </ToggleButton>
                </Card.Title>
                <Card.Body>
                  <div>
                    <DropDownSelector
                      id={"recMode"}
                      label="Accounting Method"
                      description="This determines how the optimiser should consider RECs and its influence on load operating behaviour. The former option ensures load operation is completely covered by RECs collected over the entire simulation. The latter ensures sufficient RECs are collected per dispatch interval."
                      options={[
                        "[Aggregate] Acquire and Surrender RECs in Aggregate",
                        "[Temporal] Temporally Match Operation to RECs via PPAs",
                      ]}
                      setConfigValue={setAccountingMethod}
                      value={
                        recMode === "total"
                          ? "[Aggregate] Acquire and Surrender RECs in Aggregate"
                          : "[Temporal] Temporally Match Operation to RECs via PPAs"
                      }
                      disabled={!recEnabled}
                    ></DropDownSelector>
                    <SliderInputOptional
                      id={"recMarketPrice"}
                      label="REC Spot Price ($/MWh)"
                      description="If enabled a REC spot market facilitates the ability for the load to buy or sell surplus RECs at the given price."
                      showLocked={false}
                      showLockedWhenSelected={true}
                      lockedDescription="REC Spot Price must be considered where trading RECs are allowed but there are no PPAs."
                      setConfigValue={setConfigValue}
                      value={recMarketPrice}
                      max={200}
                      min={0}
                      disabled={!recEnabled && !ppasDisabled && !(recAllowSelling || recAllowBuying)}
                      selected={recSpotPriceEnabled || ppasDisabled || (recAllowSelling || recAllowBuying)}
                      selectedId="recSpotPriceEnabled"
                      setStateVariable={toggleRecSpotPrice}
                      overrideSelected={ppasDisabled}
                    ></SliderInputOptional>
                    <Row className={{display: "inline-block", alignSelf: "flex-end"}}>
                      <Col>
                        <SwitchInputOptional
                          id={"recAllowBuying"}
                          label="REC Trading Configuration"
                          setConfigValue={setConfigValue}
                          value={"Allow Buying RECs"}
                          showLocked={true}
                          lockedDescription="Allow Buying RECs option requires a REC Spot Price to be set."
                          selected={recAllowBuying}
                          disabled={!recEnabled || !recSpotPriceEnabled}
                          cardDisabled={!recEnabled}
                        ></SwitchInputOptional>
                      </Col>
                      <Col> {/* make this column sit in line with Allow Buying Recs*/}
                        <SwitchInputOptional
                          id={"recAllowSelling"}
                          label=""
                          setConfigValue={setConfigValue}
                          value={"Allow Selling RECs"}
                          showLocked={true}
                          lockedDescription="Allow Selling RECs option requires a REC Spot Price to be set, and a PPA through which surplus certificates have been acquired."
                          selected={recAllowSelling}
                          disabled={!recEnabled || !recSpotPriceEnabled}
                          cardDisabled={!recEnabled}
                        ></SwitchInputOptional>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Title style={{ paddingLeft: 15, paddingTop: 15 }}>
                  Emissions
                  <ToggleButton
                    style={{ marginRight: "1rem" }}
                    className="mb-2 float-end"
                    id="emissionsEnabled"
                    type="checkbox"
                    variant={
                      emissionsEnabled && emissionsTypeEnabled
                        ? "primary"
                        : "secondary"
                    }
                    checked={emissionsEnabled}
                    value="1"
                    onChange={(e) =>
                      toggleButton("emissionsEnabled", e.currentTarget.checked)
                    }
                  >
                    {emissionsEnabled ? "Enabled" : "Disabled"}
                  </ToggleButton>
                </Card.Title>
                <Card.Body>
                  <div>
                    <DropDownSelector
                      id={"emissionsType"}
                      label="Grid Emissions Trace"
                      description="The emissions data type considered. Navigate to the 'Planner' page to change this setting and load a new data trace."
                      options={["Total", "Marginal"]}
                      setConfigValue={toggleEmissions}
                      value={emissionsType}
                      disabled={!emissionsEnabled || !emissionsTypeEnabled}
                    ></DropDownSelector>

                    <SliderInputOptional
                      id={"co2Price"}
                      label="Shadow Carbon Price ($/tCO2-e)"
                      description="A shadow price for carbon applied to energy sourced from the spot market which is in excess of the traded energy received under the PPA structures. The shadow price therefore only applies to a proportion of total energy consumed when the contracted plant is generating."
                      showLocked={true}
                      lockedDescription="Shadow Carbon Price cannot be enforced with 'Carbon Intensity' constraint."
                      setConfigValue={setConfigValue}
                      value={co2Price}
                      max={500}
                      min={0}
                      disabled={!emissionsEnabled || co2ConstraintSelected}
                      cardDisabled={!emissionsEnabled}
                      selected={co2PriceSelected}
                      selectedId="co2PriceSelected"
                      setStateVariable={setStateVariable}
                    ></SliderInputOptional>
                    <SliderInputOptional
                      id={"co2Constraint"}
                      label="Carbon Intensity of H2 (tCO2-e/tH2)"
                      description="Apply a constraint on the carbon content intensity of produced hydrogen. This reflects only the carbon intensity of energy consumed from the spot market in excess of traded energy received under PPA structures. This constraint also applies on aggregate over the entire simulation window, not per interval."
                      showLocked={true}
                      lockedDescription="Carbon Intensity Constraint cannot be enforced with 'Shadow Carbon Price'."
                      setConfigValue={setConfigValue}
                      value={co2Constraint}
                      max={10}
                      step={0.1}
                      disabled={!emissionsEnabled || co2PriceSelected}
                      cardDisabled={!emissionsEnabled}
                      min={0}
                      selected={co2ConstraintSelected}
                      selectedId="co2ConstraintSelected"
                      setStateVariable={setStateVariable}
                    ></SliderInputOptional>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}
