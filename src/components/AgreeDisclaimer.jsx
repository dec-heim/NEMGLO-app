import { Button, Container, Col, Row, Modal} from "react-bootstrap";
import React, { useEffect, useState } from "react";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
export default function AgreeDisclaimer(props) {

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            <InfoOutlinedIcon style={{marginBottom: 5, marginRight: 20}}></InfoOutlinedIcon>
            Licence & Disclaimer

          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div style={{fontSize:"15px"}}>
            BSD 3-Clause License<br/>

            Copyright (c) 2022, Declan Heim and Jay Anand.<br/>
            All rights reserved.<br/><br/>

            Redistribution and use in source and binary forms, with or without
            modification, are permitted provided that the following conditions are met:<br/><br/>

            1. Redistributions of source code must retain the above copyright notice, this
            list of conditions and the following disclaimer.<br/>

            2. Redistributions in binary form must reproduce the above copyright notice,
            this list of conditions and the following disclaimer in the documentation
            and/or other materials provided with the distribution.<br/>

            3. Neither the name of the copyright holder nor the names of its
            contributors may be used to endorse or promote products derived from
            this software without specific prior written permission.<br/><br/>

            THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
            AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
            IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
            DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
            FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
            DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
            SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
            CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
            OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
            OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.</div>
          
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={() => props.hideDisclaimer(true)} variant={"primary"}>Agree and Continue</Button>
        </Modal.Footer>
      </Modal>
    );
  }