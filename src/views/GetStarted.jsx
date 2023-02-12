import { Button, Card, Col, Container, Image, ListGroup, ListGroupItem, Row, Alert } from "react-bootstrap";

import Snapshot1 from "../media/NEMGLO_snapshot_ppaconfig.png";
import Snapshot2 from "../media/NEMGLO_snapshot_operation.png";
import M1S1 from "../media/getstarted/method_1_step_1.png"
import M1S2 from "../media/getstarted/method_1_step_2.png"
import M1S3 from "../media/getstarted/method_1_step_3.png"
import M1S4 from "../media/getstarted/method_1_step_4.png"
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
          <Row>
            <h2 class="font-weigh-line">Standalone Desktop App</h2>
            <Alert key="info" variant="info">
                Using NEMGLO App will soon be a lot simplier with a single executable file that launches an app locally on your windows computer. Stay tuned!
            </Alert>
            <span><br /></span>
          </Row>
          <Row >
            <h2 class="font-weigh-line">Advanced Installation Guide</h2>
            <p> In order to use the NEMGLO App, you must first install NEMGLO to run on your local machine. You can NOT use NEMGLO App on a mobile device!<br />
              There are two methods to do so. If you are familar with python, or wish to also use the NEMGLO python package directly choose <b>Method 2</b>.</p>
              <Alert key="primary" variant="primary">
                Thank you for being an early user of NEMGLO! This means some things mightn't work as expected. <br />
                Please raise any issues: <a href="https://github.com/dec-heim/NEMGLO/issues" target="_blank">https://github.com/dec-heim/NEMGLO/issues</a>
              </Alert>
            <Col><Card style={{}}>
              <Card.Header as="h5">Method 1: Install an executable</Card.Header>
            <Card.Body>
              <Card.Subtitle><i>Recommended for non-python users</i></Card.Subtitle><br />
              <Card.Text>Note this method to run an executable file locally is only possible for windows users and requires 7zip to unzip the download available on Onedrive. You can download 7zip here if not already installed: <a href="https://www.7-zip.org/download.html" target="_blank">https://www.7-zip.org/download.html</a></Card.Text>
              <ListGroup>
                <ListGroupItem>
                  <span>1. Download the executable file via the link below. Then check the box (as higlighted in red) and choose "Download" (highlighted).<br /><br /></span>
                  <a href="https://1drv.ms/u/s!Ah0M0uvBzDUqdyf_1FnXhtILtng?e=BRvvfb" target="_blank"><Button variant="primary">Go to file on onedrive</Button></a>
                  <br /><br />
                  <div><img src={M1S1} width="90%" height="100%" className="alignCenter" fluid rounded alt="install step 1"/></div>
                </ListGroupItem>
                <ListGroupItem>
                <span>2. Move the downloaded .7z zipped file to a folder where you are happy to run the executable. Extract the executable by right clicking the file, go to 7-Zip option and choose 'Extract Here'.<br /><br /></span>
                <div><img src={M1S2} width="90%" height="100%" className="alignCenter" fluid rounded alt="install step 2"/></div>
                </ListGroupItem>
                <ListGroupItem>
                <span>3. Once extracted, double click the NEMGLO_API_v__.exe to launch the NEMGLO API. In doing so this will create a folder 'CACHE' which is used to store downloaded historical NEM data from AEMO.<br /><br /></span>
                <div><img src={M1S3} width="90%" height="100%" className="alignCenter" fluid rounded alt="install step 2"/></div>
                </ListGroupItem>
                <ListGroupItem>
                <span>4. If successful, a terminal window will open (as shown below). If all messages are printed as below, the API is running correctly. This is also where you can see logged information as you use the app.
                  <br /><br /></span>
                <div><img src={M1S4} width="90%" height="100%" className="alignCenter" fluid rounded alt="install step 2"/></div><br />
                <span>You can now start using nemglo via your browser. Click the button below when you are ready to use the NEMGLO App.<br /><br /></span>
                <a href="https://www.nemglo.org/simulator"><Button variant="primary">Start using the NEMGLO App</Button></a>
                </ListGroupItem>
              </ListGroup>
            </Card.Body>
          </Card></Col>
          <Col><Card style={{}}>
              <Card.Header as="h5">Method 2: Install NEMGLO python package</Card.Header>
            <Card.Body>
              <Card.Subtitle><i>Recommended for python users</i></Card.Subtitle><br />
              <Card.Text>text</Card.Text>
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
          </Card></Col>
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
