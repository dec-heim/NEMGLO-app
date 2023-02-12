import React, { useEffect, useState } from "react";
import { InputGroup, Stack } from "react-bootstrap";
import Form from "react-bootstrap/Form";

import HelpToolTip from "./HelpToolTip";

export default function DropDownSelectorOptional(props) {
  const [value, setValue] = useState({ ...props.value });
  const [isSelected, setSelected] = useState({ ...props.selected });

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    setSelected(props.selected);
  }, [props.selected]);

  const updateValue = (e) => {
    props.setConfigValue(props.id, e.target.value);
    console.log("setting value..."+e.target.value);
  };

  const updateSelected = () => {
    let val = !isSelected;
    setSelected(val);
    props.setStateVariable(props.selectedId, val);
    console.log(":) isselected  "+val)
  };

  return (
    <Form.Group style={{ paddingBottom: 10 }}>
      <Form.Label style={{ textAlign: "text-center text-md-right" }}>
        {props.label}
        <HelpToolTip description={props.description}></HelpToolTip>
      </Form.Label>
      <InputGroup>
        <InputGroup.Checkbox onChange={() => updateSelected()} disabled={props.disabled} checked={props.selected}/>
        <Form.Select disabled={!isSelected || props.disabled}  
        required = {!props.disabled && isSelected}
        value={value}
        onChange={(e) => updateValue(e)}>
          {props.options.length > 0 && isSelected &&
            props.options.map((option) => (
              <option value={option}>{option}</option>
            ))}
        </Form.Select>
      </InputGroup>
    </Form.Group>
  );
}