import * as am5 from "@amcharts/amcharts5";
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5xy from "@amcharts/amcharts5/xy";
import React, { Component } from "react";

class RevenueChart extends Component {
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

    // Customise tooltip color
    let tooltiper = am5.Tooltip.new(root, {
      getFillFromSprite: false,
      autoTextColor: false,
      labelText: tooltip,
    });
    tooltiper.get("background").setAll({
      fill: lineColor,
    })
    tooltiper.label.setAll({
      fill: lineColorText,
    })
    series.set("tooltip", tooltiper);

    if (valueYField == "Total") {
      series.strokes.template.setAll({ strokeWidth: 1.4 });
    } else {
      series.strokes.template.setAll({ strokeWidth: 1 });
    }
    //series.fills.template.setAll({ fillOpacity: 0.2, visible: true });
    yRenderer.grid.template.set("strokeOpacity", 0.05);
    const axisLineColor = getComputedStyle(document.body).getPropertyValue("--dark")
    yRenderer.labels.template.set("fill", axisLineColor);
    yRenderer.setAll({
      stroke: axisLineColor,
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
      if (root  !== undefined) {
        if (root.dom.id === "revenue") {
          root.dispose();
        }
      }
    
    });

    let root = am5.Root.new("revenue");

    this.setState({root});

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        focusable: false,
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
        // maxTooltipDistance:0,
        // pinchZoomX:true,
        layout: root.verticalLayout,
      })
    );


    const nemgloStyle = getComputedStyle(document.body);
    let myColors = { 
      "Total": nemgloStyle.getPropertyValue('--dark'),
      "Energy": nemgloStyle.getPropertyValue('--nemglo-load'),
      "H2": nemgloStyle.getPropertyValue('--nemglo-h2'),
      "PPA 1": nemgloStyle.getPropertyValue('--nemglo-ppa1'),
      "PPA 2": nemgloStyle.getPropertyValue('--nemglo-ppa2'),
      "Market RECs": nemgloStyle.getPropertyValue('--nemglo-rec'),
    }
    const myColorsText = {
      "Total": nemgloStyle.getPropertyValue('--light'),
      "Energy": nemgloStyle.getPropertyValue('--light'),
      "H2": nemgloStyle.getPropertyValue('--light'),
      "PPA 1": nemgloStyle.getPropertyValue('--light'),
      "PPA 2": nemgloStyle.getPropertyValue('--light'),
      "Market RECs": nemgloStyle.getPropertyValue('--light'),
    }

    let easing = am5.ease.linear;
    // Create axis
    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxDeviation: 0.1,
        groupData: false,
        baseInterval: {
          timeUnit: "minute",
          count: 30,
        },
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
    let yRenderer = am5xy.AxisRendererY.new(root, {
      opposite: false,
    });
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 1,
        renderer: yRenderer,
      })
    );
    yAxis.children.unshift(
      am5.Label.new(root, {
        rotation: -90,
        text: "Cost ($)",
        y: am5.p50,
        centerX: am5.p50,
      })
    );
    for (let i = 0; i < seriesSettings.length; i++) {
      let seriesSetting = seriesSettings[i];
      // Match the designated color for this line series
      let lineColor = myColors[seriesSetting.valueYField];
      let lineColorText = myColorsText[seriesSetting.valueYField];
      this.createAxisAndSeries( chart,
        xAxis,
        yAxis,
        data,
        seriesSetting.valueYField,
        root,
        seriesSetting.tooltip,
        lineColor,
        lineColorText,
        yRenderer)
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

  componentDidMount() {
    this.updateChart();
  }

  componentWillUnmount() {
    if (this.root) {
      this.root.dispose();
    }
  }

  render() {
    return <div id="revenue" style={{ width: "100%", height: "500px" }}></div>;
  }
}

export default RevenueChart;
