import React from "react";
import { CSVDownload, CSVLink } from "react-csv";
import { Button } from "react-bootstrap";

export default function DownloadCSV({ data, filename }) {
  return <CSVLink data={data} filename={filename}>
      <Button
        variant="outline-dark">
        Download CSV
      </Button>
    </CSVLink>;
}
