import * as am5 from "@amcharts/amcharts5";
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5xy from "@amcharts/amcharts5/xy";
import React, { Component } from "react";

import timestamp2str from "./Utils";

class MarketDataChart extends Component {
  constructor() {
    super();
    this.state = {};
    this.createAxisAndSeries = this.createAxisAndSeries.bind(this);
    this.updateChart = this.updateChart.bind(this);
  }

  createAxisAndSeries = (
    chart,
    xAxis,
    yAxis,
    data,
    valueYField,
    root,
    tooltip,
    lineColor,
    lineColorText,
    yRenderer
  ) => {
    if (chart.yAxes.indexOf(yAxis) > 0) {
      yAxis.set("syncWithAxis", chart.yAxes.getIndex(0));
    }

    // let exporting = am5plugins_exporting.Exporting.new(root, {
    //   menu: am5plugins_exporting.ExportingMenu.new(root, {}),
    //   dataSource: data
    // });


    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/

    let series = chart.series.push(
      am5xy.LineSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: valueYField,
        valueXField: "timestamp",
        stroke: lineColor,
      })
    );

    // Customise tooltip
    let tooltiper = am5.Tooltip.new(root, {
      getFillFromSprite: false,
      autoTextColor: false,
      pointerOrientation: "horizontal",
      labelText: tooltip,
    });
    tooltiper.get("background").setAll({
      fill: lineColor,
    })
    tooltiper.label.setAll({
      fill: lineColorText,
    })
    series.set("tooltip", tooltiper);

    //series.fills.template.setAll({ fillOpacity: 0.2, visible: true });
    series.strokes.template.setAll({ strokeWidth: 1 });

    yRenderer.grid.template.set("strokeOpacity", 0.05);
    yRenderer.labels.template.set("fill", lineColor);
    yRenderer.setAll({
      stroke: lineColor,
      strokeOpacity: 1,
      opacity: 1,
    });

    // Set up data processor to parse string dates
    // https://www.amcharts.com/docs/v5/concepts/data/#Pre_processing_data
    series.data.processor = am5.DataProcessor.new(root, {
      dateFormat: "yyyy-MM-dd",
      dateFields: ["timestamp"],
    });

    series.data.setAll(data);
  };

  updateChart = () => {
    am5.array.each(am5.registry.rootElements, function (root) {
      if (root !== undefined) {
        if ( root.dom.id === "chartdiv") {
          root.dispose();
        }
      }
      
    });

    let root = am5.Root.new("chartdiv");

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        focusable: false,
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
        layout: root.verticalLayout,
      })
    );

    let easing = am5.ease.linear;
    // chart.get("colors").set("step", 3);
    // chart.get("colors").set("colors", [
    //   am5.color(0xB23A48), //red
    //   am5.color(0x2A324B), // black-dark-navy
    //   am5.color(0x5aaa95),
    //   am5.color(0x86a873),
    //   am5.color(0xbb9f06)
    // ]);
    const {baseInterval} = this.props;
    // Create axis
    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxDeviation: 0.1,
        groupData: false,
        baseInterval: baseInterval,
        renderer: am5xy.AxisRendererX.new(root, {}),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    // Define data

    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    let cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        xAxis: xAxis,
        behavior: "none",
      })
    );
    cursor.lineY.set("visible", false);

    // add scrollbar
    chart.set(
      "scrollbarX",
      am5.Scrollbar.new(root, {
        orientation: "horizontal",
      })
    );
    let data = this.props.data; // valueYField, tooltip
    const {seriesSettings} = this.props;

    let priceRenderer = am5xy.AxisRendererY.new(root, {
      opposite: false,
    });
    let yAxisPrice = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 1,
        renderer: priceRenderer,
      })
    );
    // Add yaxis label
    yAxisPrice.children.unshift(
      am5.Label.new(root, {
        rotation: -90,
        text: "[#B23A48]Price ($/MWh)[/]",
        y: am5.p50,
        centerX: am5.p50
      })
    );

    let emissionsRenderer = am5xy.AxisRendererY.new(root, {
      opposite: true,
    });
    let yAxisEmissions = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 1,
        renderer: emissionsRenderer,
      })
    );
    // Add secondary axis label if series is on y2
    for (let i = 0; i < seriesSettings.length; i++) {
      if (seriesSettings[i].valueYField === "Emissions Intensity") {
        yAxisEmissions.children.push(
          am5.Label.new(root, {
            rotation: -90,
            text: "[#2A324B]Grid Emissions Intensity (tCO2-e/MWh)[/]",
            y: am5.p50,
            centerX: am5.p50
          })
        );
      }
    }


    // Color Styling
    const nemgloStyle = getComputedStyle(document.body);
    let myColors = { 
      "Price": nemgloStyle.getPropertyValue('--nemglo-price'),
      "Emissions Intensity": nemgloStyle.getPropertyValue('--nemglo-gridem'),
    }
    const myColorsText = {
      "Price": nemgloStyle.getPropertyValue('--light'),
      "Emissions Intensity": nemgloStyle.getPropertyValue('--light'),
    }

    // Update series on chart
    for (let i = 0; i < seriesSettings.length; i++) {
      let seriesSetting = seriesSettings[i];
      let yAxis =
        seriesSetting.valueYField === "Price" ? yAxisPrice : yAxisEmissions;
      let yRenderer =
        seriesSetting.valueYField === "Price"
          ? priceRenderer
          : emissionsRenderer;
      let lineColor = myColors[seriesSetting.valueYField];
      let lineColorText = myColorsText[seriesSetting.valueYField];
      this.createAxisAndSeries(
        chart,
        xAxis,
        yAxis,
        data,
        seriesSetting.valueYField,
        root,
        seriesSetting.tooltip,
        lineColor,
        lineColorText,
        yRenderer
      );
    }

    let legend = chart.children.push(
      am5.Legend.new(root, {
        nameField: "valueYField",
        centerX: am5.percent(50),
        x: am5.percent(50),
      })
    );
    legend.data.setAll(chart.series.values);
  };

  componentDidUpdate() {
    this.updateChart();
  }

  componentDidMount() {
    this.updateChart();
  }

  componentWillUnmount() {
    if (this.root) {
      this.root.dispose();
    }
  }

  render() {
    return <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>;
  }
}

export default MarketDataChart;
