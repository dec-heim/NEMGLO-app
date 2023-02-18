import { Button, Card, Col, Container, Image, ListGroup, ListGroupItem, Row, Alert } from "react-bootstrap";

import Snapshot1 from "../media/NEMGLO_snapshot_ppaconfig.png";
import Snapshot2 from "../media/NEMGLO_snapshot_operation.png";
import M1S1 from "../media/getstarted/method_1_step_1.png"
import M1S2 from "../media/getstarted/method_1_step_2.png"
import M1S3 from "../media/getstarted/method_1_step_3.png"
import M1S4 from "../media/getstarted/method_1_step_4.png"
import M1S5 from "../media/getstarted/method_1_step_5.png"
import M2S1 from "../media/getstarted/method_2_step_1.png"
import M2S2 from "../media/getstarted/method_2_step_2.png"
import M2S3 from "../media/getstarted/method_2_step_3.png"

import Footer from "../components/Footer";

export default function GetStarted() {
  return (
    <div className="about text-center" >
      <header></header>
      <main>
        <Container style={{marginTop: 30, }}>
          <Row>
            <h1 class="font-weigh-line">Get Started</h1>
            <p class="mt-1">Some example snapshots of this tool are shown below. Jump straight to the Installation Guide to get started!<br></br><br></br>
          </p>
          </Row>
          <Row sm={1} style={{marginBottom: 30}}>
            <Col fluid style={{width: "50%"}}>
              <Card>
                <Card.Header>Example of NEMGLO Configuration Menu</Card.Header>
                <span style={{height: "10px"}}></span>
                <Card.Img variant="bottom" src={Snapshot1}></Card.Img>
              </Card>
            </Col>
            <Col fluid style={{width: "50%"}}>
              <Card>
                <Card.Header>Example of NEMGLO Simulation Results</Card.Header>
                <span style={{height: "1rem"}}></span>
                <Card.Img variant="bottom" src={Snapshot2}></Card.Img>
                <span style={{height: "1rem"}}></span>
              </Card>
            </Col>
          </Row>
            <br />
          <Row >
            <h2 class="font-weigh-line">Installation Guide</h2>
            <p> In order to use the NEMGLO App, you must first install NEMGLO to run on your local machine. You can NOT use NEMGLO App on a mobile device!<br /></p>
              {/* There are two methods to do so. If you are familar with python, or wish to also use the NEMGLO python package directly choose Method 2*. */}
              <Alert key="primary" variant="primary">
                Thank you for being an early user of NEMGLO! This means some things mightn't work as expected. <br />
                Please raise any issues: <a href="https://github.com/dec-heim/NEMGLO/issues" target="_blank">https://github.com/dec-heim/NEMGLO/issues</a>
              </Alert>
            <Col><Card style={{}}>
              <Card.Header as="h5">Method 1: Install an Executable (Desktop App)</Card.Header>
            <Card.Body>
              <Card.Subtitle><i>Recommended for all users</i></Card.Subtitle><br />
              <Card.Text>Note this method to run executables file locally is only possible for windows 64bit systems.</Card.Text>
              <ListGroup>
                <ListGroupItem>
                  <span>1. Download the executable files via the link below (choose the latest version release available). Then check the box (as higlighted in red) and choose "Download" (highlighted).<br /><br /></span>
                  <a href="https://1drv.ms/u/s!Ah0M0uvBzDUqdyf_1FnXhtILtng?e=BRvvfb" target="_blank"><Button variant="primary">Go to file on onedrive</Button></a>
                  <br /><br />
                  <div><img src={M1S1} width="60%" height="100%" className="alignCenter" fluid rounded alt="install step 1"/></div>
                </ListGroupItem>
                <ListGroupItem>
                <span>2. Move the downloaded .zip file to a folder where you are happy to run the executable. Extract the executable by right clicking the file, and choosing 'Extract All...'<br /><br /></span>
                <div><img src={M1S2} width="40%" height="100%" className="alignCenter" fluid rounded alt="install step 2"/></div>
                </ListGroupItem>
                <ListGroupItem>
                <span>3. Once extracted, navigate to the extracted folder and you can now launch NEMGLO with by double clicking the "Launch NEMGLO.bat".
                  This script will simply launch both the frontend (NEMGLO-app.exe) and backend (NEMGLO_API_.exe). Be patient it may take a moment to load completely.<br /><br /></span>
                <div><img src={M1S3} width="60%" height="100%" className="alignCenter" fluid rounded alt="install step 3"/></div>
                </ListGroupItem>
                <ListGroupItem>
                <span>4. If successful, two windows should open (as shown below). The terminal window is the API and should log some initial messages once it is up and running.
                  This is also where you can see logged information or errors encountered as you use the app.
                  The main window overlayed is the NEMGLO application user interface. You should navigate within this window to use the NEMGLO app.
                  <br /><br /></span>
                <div><img src={M1S4} width="70%" height="100%" className="alignCenter" fluid rounded alt="install step 4"/></div><br />
                </ListGroupItem>
                <ListGroupItem>
                <span>5. Step #3 will automatically create a folder "CACHE" in that same directory where you run NEMGLO (see image below). This folder is where the downloaded historical market data from AEMO is stored, as well as where the NEMGLO log file is saved.
                  <br /><br /></span>
                <div><img src={M1S5} width="60%" height="100%" className="alignCenter" fluid rounded alt="install step 5"/></div>
                </ListGroupItem>
              </ListGroup>
            </Card.Body>
          </Card></Col>
          {/* <Col><Card style={{}}>
              <Card.Header as="h5">Method 2: Install NEMGLO python package</Card.Header>
            <Card.Body>
              <Card.Subtitle><i>Recommended only for advanced/development use.</i></Card.Subtitle><br />
              <Card.Text>Launching NEMGLO API from python should work in all operating systems (Windows + Mac + Linux). However!
                You may likely encounter an error running the optimiser as you may need to install custom binaries for the cbc package. Refer to information on the <a href="https://github.com/coin-or/Cbc" target="_blank">CBC Github Repo</a></Card.Text>
              <ListGroup>
                <ListGroupItem>
                  <span>1. Open your terminal/virtual-environment and install NEMGLO python package using <b>pip install nemglo</b>, or clone the GitHub Repository via the link below.<br /><br /></span>
                  <a href="https://github.com/dec-heim/NEMGLO" target="_blank"><Button variant="outline-primary"><b>pip install nemglo</b> or click here to go to Github Repo</Button></a>
                  <br /><br />
                  <div><img src={M2S1} width="90%" height="100%" className="alignCenter" fluid rounded alt="install step 1"/></div>
                </ListGroupItem>
                <ListGroupItem>
                  <span>2. Open a python shell. Import the nemglo package using <b>import nemglo</b><br></br><br></br></span>
                  <div><img src={M2S2} width="90%" height="100%" className="alignCenter" fluid rounded alt="install step 1"/></div>
                </ListGroupItem>
                <ListGroupItem>
                  <span>3. Launch the API using the command <b>nemglo.api.run()</b><br></br><br></br></span>
                  <div><img src={M2S3} width="90%" height="100%" className="alignCenter" fluid rounded alt="install step 1"/></div><br></br>
                  <span>You can now start using nemglo via your browser. Click the button below when you are ready to use the NEMGLO App.<br></br>
                    Note by default the 'CACHE' folder is created dependent on the directory path from which you launch python.
                    If you wish, you can also define this folder location... refer to <a href="https://nemglo.readthedocs.io/en/latest/" target="_blank">NEMGLO python documentation</a><br></br><br></br></span>
                <a href="https://www.nemglo.org/simulator"><Button variant="primary">Start using the NEMGLO App</Button></a>
                </ListGroupItem>
              </ListGroup>
            </Card.Body>
          </Card></Col> */}
          <span style={{height: "15px"}}></span>
          </Row>
          <Row>
            <h2 class="font-weigh-line">Read More</h2>
            <span><a href="/about">Find out more about NEMGLO here</a><br /><br /></span>
            <span><a href="https://nemglo.readthedocs.io/en/latest/">Still need help? Click to visit the documentation on ReadTheDocs</a></span>
          <span style={{height: "100px"}}><br /></span>
          </Row>          
        </Container>
      </main>
      <Footer></Footer>
    </div>
  );
}
