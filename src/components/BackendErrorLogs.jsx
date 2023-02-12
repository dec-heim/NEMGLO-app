import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";

import HelpToolTip from "./HelpToolTip";

export default function BackendErrorLogs(props) {

    // const getLogs = () => {
    //     const logs = props.errorLogs.split("\n");
    //     return {logs.map((log) => log} <br> 
        
    // }

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            {/* <InfoOutlinedIcon style={{marginBottom: 5, marginRight: 20}}></InfoOutlinedIcon> */}
            Error Logs
            <HelpToolTip description={"If error occured during simuation, logs display here"}></HelpToolTip>
          </Modal.Title>
       
        </Modal.Header>
        <Modal.Body>
            <div style={{fontSize:"15px", whiteSpace: "pre-wrap"}}>
                {props.errorLogs}
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={() => props.setStateVariable("showErrorLogs", false)} variant={"primary"}>Dismiss</Button>
        </Modal.Footer>
      </Modal>
    );
  }