import React, { useEffect, useState } from "react";
import { InputGroup, Stack } from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";
import Form from "react-bootstrap/Form";
import Tooltip  from "react-bootstrap/Tooltip";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import HelpToolTip from "./HelpToolTip";

export default function SwitchInputOptional(props) {
  const [isSelected, setSelected] = useState({ ...props.selected });

  useEffect(() => {
    setSelected(props.selected);
  }, [props.selected]);

  const updateValue = () => {
    let val = !isSelected;
    setSelected(val)
    props.setConfigValue(props.id, val);
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
                  <InputGroup.Checkbox onChange={() => updateValue()} disabled={props.disabled} checked={props.selected}/>
                  <Form.Control disabled={!isSelected || props.disabled}  
                  required = {!props.disabled && isSelected}
                  value={props.value}
                  type="text"
                  readOnly
                  placeholder={props.showText}/>
                </InputGroup>
              </OverlayTrigger>
            </span>
          ) : (
            <span>
              <InputGroup>
                <InputGroup.Checkbox onChange={() => updateValue()} disabled={props.disabled} checked={props.selected}/>
                <Form.Control disabled={!isSelected || props.disabled}  
                required = {!props.disabled && isSelected}
                value={props.value}
                type="text"
                readOnly
                placeholder={props.showText}/>
              </InputGroup>
            </span>
          )}
        {/* <InputGroup>
          <InputGroup.Checkbox onChange={() => updateValue()} disabled={props.disabled} checked={props.selected}/>
          <Form.Control disabled={!isSelected || props.disabled}  
          required = {!props.disabled && isSelected}
          value={props.value}
          type="text"
          readOnly
          placeholder={props.showText}/>
        </InputGroup> */}
      </Stack>
    </Form.Group>
  );
}
