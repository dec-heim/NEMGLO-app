import React, { Component } from "react";
import { Card } from "react-bootstrap";

import PriceDispatchChart from "../components/charts/PriceDispachChart";
import DownloadCSV from "../components/DownloadCSV";

export default class ResultsView extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
        <Card
          style={{
            paddingTop: 20,
            paddingLeft: 5,
            paddingRight: 5,
            paddingBottom: 5,
          }}
        >
          <Card.Title style={{ paddingLeft: 15 }}>
            {this.props.title}
          </Card.Title>
          <Card.Body>
            <PriceDispatchChart
              data={this.props.chart1}
              seriesSettings={this.props.chartSettings}
              
            ></PriceDispatchChart>
            <DownloadCSV
              data={this.props.csv}
              filename={this.props.csvFilename}>
            </DownloadCSV>
          </Card.Body>
        </Card>
    );
  }
}
