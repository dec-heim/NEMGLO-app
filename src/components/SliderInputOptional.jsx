import React, { useEffect, useState } from "react";
import { InputGroup, Stack } from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";
import Form from "react-bootstrap/Form";
import Tooltip  from "react-bootstrap/Tooltip";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import HelpToolTip from "./HelpToolTip";

export default function SliderInputOptional(props) {
  const [value, setValue] = useState({ ...props.value });
  const [isSelected, setSelected] = useState({ ...props.selected });

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    setSelected(props.selected);
  }, [props.selected]);


  const updateValue = (e) => {
    let val = e.target.value;
    if (val <= props.max) {
      setValue(e.target.value);
      props.setConfigValue(props.id, parseFloat(e.target.value));
    }
  };

  const updateSelected = () => {
    console.log("ere");
    let val = !isSelected;
    // if (!props.overrideSelected) {
    console.log(props.selectedId);
    setSelected(val)
    props.setStateVariable(props.selectedId, val)
    // }
    // let val;
    // console.log("override is selected"+props.overrideSelected)
    // if (props.overrideSelected) {
    //   val = true;
    //   console.log("entre truth")
    //   setSelected(true)
    //   props.setStateVariable(props.selectedId, true)
    //   console.log(isSelected);
    // } else {
    //   console.log("else part")
    //   val = !isSelected;
    //   setSelected(val)
    //   props.setStateVariable(props.selectedId, val)
    //   console.log(isSelected);
    // }
    
  };
  return (
    <Form.Group style={{ paddingBottom: 10 }}>
      <Form.Label style={{ textAlign: "text-center text-md-right" }}>
        {props.label}
        <HelpToolTip description={props.description}></HelpToolTip>
      </Form.Label>
      <Stack direction="horizontal" gap={5}>
        {(props.showLocked && props.disabled && !props.cardDisabled) | (props.overrideSelected) ? (
          <span>
            <OverlayTrigger overlay={ <Tooltip>{props.lockedDescription}</Tooltip>} placement="left">
              <InputGroup>
                <InputGroup.Checkbox onChange={() => updateSelected()} disabled={props.disabled} checked={isSelected}/>
                <Form.Control disabled={!isSelected || props.disabled}  
                required = {!props.disabled && isSelected}
                step={props.step}
                value={value}
                type="number"
                onChange={(e) => updateValue(e)} />
              </InputGroup>
            </OverlayTrigger>
          </span>
        ) : (
          <span>
            <InputGroup>
              <InputGroup.Checkbox onChange={() => updateSelected()} disabled={props.disabled} checked={isSelected}/>
              <Form.Control disabled={!isSelected || props.disabled}  
              required = {!props.disabled && isSelected}
              step={props.step}
              value={value}
              type="number"
              onChange={(e) => updateValue(e)} />
            </InputGroup>
          </span>
        )}
        <RangeSlider
          disabled={!isSelected || props.disabled}
          step={props.step}
          max={props.max}
          min={props.min}
          value={value}
          tooltip="off"
          onChange={(e) => updateValue(e)}
        />
      </Stack>
    </Form.Group>
  );
}