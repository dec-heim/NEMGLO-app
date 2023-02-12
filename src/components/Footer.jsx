import React from "react";
import { Row, Col, Container } from "react-bootstrap";

const Footer = () => (
  <div className="footer px-1" justify="center">
    <Container fluid>
    <Row>
        <Col>
        <p style={{textAlign: "left"}}><b>v0.2 Beta</b></p>
        </Col>
        <Col>
            <p class="text-center">Copyright &copy; Declan Heim and Jay Anand, 2022</p>
        </Col>
        <Col>
            <div style={{textAlign: "right"}}>
                <a href="/about" class="text-white">About NEMGLO</a>
            </div>
        </Col>
    </Row>
    </Container>
  </div>
);

export default Footer;