import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { ProSidebarProvider } from "react-pro-sidebar";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Linux from "./media/linux.png";
import NemgloLogo from "./media/nemgloLogo_long_bgdark.png";
import About from "./views/About";
import LandingPage from "./views/LandingPage";
import SimulationDashboard from "./views/SimulationDashboard";
import GetStarted from "./views/GetStarted";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div>
    <ProSidebarProvider className="pro-sidebar">
      <Navbar bg="dark" variant="dark" expand="lg" className="navheader">
        <Container>
          <Navbar.Brand>
            <img
              src={NemgloLogo}
              width="100"
              height="25"
              style={{ paddingTop: "2px"}}
              className="d-inline-block align-top"
              alt="nemglo logo"
            />
            {/* NEMGLO */}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {/* <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/start">Get Started</Nav.Link> */}
              <Nav.Link href="/">Simulator</Nav.Link>
              <Nav.Link href="/about">About</Nav.Link>
              <Nav.Link href="/web">NEMGLO.org</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Router>
        <div>
          <Routes>
            <Route exact path="/web" element={<LandingPage />} />
            <Route exact path="/start" element={<GetStarted />} />
            <Route exact path="/" element={<SimulationDashboard />} />
            <Route exact path="/about" element={<About />} />
          </Routes>
        </div>
      </Router>
    </ProSidebarProvider>
    </div>
  );
}

export default App;
