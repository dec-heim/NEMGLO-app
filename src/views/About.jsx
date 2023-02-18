import { Button, Card, Col, Container, Image, Row, ListGroup } from "react-bootstrap";

import NemgloLogo from "../media/nemgloLogo_long_bgwhite.png";
import ceem from "../media/UNSWCEEMLogoTransparent.png";
import dgfi from "../media/DGFILogo.gif";
import unsw from "../media/unswlogo.jpg";
import Footer from "../components/Footer";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

import * as React from 'react';
import StarBorder from '@mui/icons-material/StarBorder';

export default function About() {
  return (
    <div className="about text-center" >
      <header></header>
      <main>
        <Container style={{marginTop: 30, }}>
          <Row sm={1} style={{marginBottom: 30}}><Col style={{height: "80px"}}>
            <img
                src={NemgloLogo}
                width="30%"
                height="100%"
                className="alignCenter"
                fluid
                rounded
                alt="nemglo logo"
              />
          </Col></Row>
          <Row>
            <h1 class="font-weigh-line">About</h1>
            <p class="mt-1">NEMGLO, the Australian National Electricity Market Green-energy Load Optimisation tool is an open-source mixed-integer linear program (MILP)
            which allows users to solve counterfactual operating strategies for a hypothetical flexible load participating in the NEM energy market.
            Case studies can be constructed using this tool with the ability to study techno-economic-environmental considerations of a flexible load
            such as a Hydrogen Electrolyser.<br /><br />
            This project was developed to provide access to a free, open-source tool that could be used to help industry & research communities to better understand key opportunities and barriers for green-energy consumption from flexible loads.
            Namely a fitting context for such is in evaluating flexible operation of hydrogen electrolyser technology and how it may procure green-energy via grid-connection in the NEM, through contracting Power Purchase Agreements and relevant certificate schemes (such as LGCs).
            By incorporating emissions data, results from this tool can help distill what might legitmately be classified as 'green-hydrogen' rather than green-washing.<br /><br />
            <b>Key Features of NEMGLO include:</b>
            <List style={{justifyContents: "center"}}>
              <ListItem><ListItemText style={{textAlign: "center"}}> Adjustable Load Operating Characteristics (Min stable load, Hydrogen Specific Energy Consumption, etc.)</ListItemText></ListItem>
              <ListItem><ListItemText style={{textAlign: "center"}}> Multiple Power Purchase Agreements (contract volume, strike, floor, etc.)</ListItemText></ListItem>
              <ListItem><ListItemText style={{textAlign: "center"}}> Renewable Energy Certificate procurement + surrender (with/without temporal matching)</ListItemText></ListItem>
              <ListItem><ListItemText style={{textAlign: "center"}}> Shadow Pricing of Grid Emissions Intensity (average & marginal emissions)</ListItemText></ListItem>
              <ListItem><ListItemText style={{textAlign: "center"}}> Constrain to Green Energy Certification Standards for H2 (max tCO2 content per tH2)</ListItemText></ListItem>
            </List></p>
          </Row>
          <Row>
            <h1 class="font-weigh-line">Licence & Disclaimer</h1>
            <div>
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
            OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.<br /><br /></div>
          </Row>
          <Row>
            <h1 class="font-weigh-line">Contact</h1>
            <p class="mt-1">
              Please send any feedback and queries to: 
              Declan Heim, <a href="mailto:declanheim@outlook.com">declanheim@outlook.com</a>
              <br />
              For bugs and issues, please raise these directly on the GitHub Repository: <a href="https://github.com/dec-heim/NEMGLO/issues">https://github.com/dec-heim/NEMGLO/issues</a>
              <br /><br />
            </p>
          </Row>
          <Row>
            <h1 class="font-weigh-line">Citation</h1>
            <p class="mt-1">
              Please reference usage of this package with:<br />
              <b>D. Heim, J. Anand, and I. MacGill. (2022). NEMGLO (v0.2).</b>
              <br /><br />
            </p>
          </Row>
          <Row>
            <h1 class="font-weigh-line">Development Team</h1>
            <p class="mt-1">
              Declan Heim (Lead Developer) <br />
              Jay Anand (Co Developer) <br />
              Iain MacGill (Project Advisor) <br /><br />
            </p>
          </Row>
          <div className="text-center">
            <Row
              style={{
                alignItems: "center",
              }}
            >
              <h1 class="font-weigh-line">Acknowledgements</h1>
              <span>This project was developed in 2022 as a Masters Thesis Project at <a href="https://www.ceem.unsw.edu.au/" target="_blank">UNSW Collaboration on Energy and Environmental Markets</a>
              <br /> and with financial support of the <a href="https://www.dgfi.unsw.edu.au/" target="_blank">UNSW Digital Grid Futures Institute (DGFI)</a> from Aug-Dec 2022.<br /><br /><br /></span>
              <Col sm={4}>
                <a href="https://www.unsw.edu.au/" target="_blank"><Image src={unsw} fluid rounded width="200"/></a>
              </Col>
              <Col sm={4}>
                <a href="https://www.ceem.unsw.edu.au/" target="_blank"><Image src={ceem} fluid rounded width="250" /></a>
              </Col>
              <Col sm={4}>
                <a href="https://www.dgfi.unsw.edu.au/" target="_blank"><Image src={dgfi} fluid rounded width="250" /></a>
              </Col>
              <span style={{height: "100px"}}><br></br></span>
            </Row>
          </div>
        </Container>
      </main>
      <Footer></Footer>
    </div>
  );
}
