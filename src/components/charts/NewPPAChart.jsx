import * as am5 from "@amcharts/amcharts5";
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5xy from "@amcharts/amcharts5/xy";
import React, { Component } from "react";

class NewPPAChart extends Component {
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
    isDispatchChart,
    valueYField,
    root,
    tooltip,
    lineColor,
    lineColorText,
    yRenderer,
  ) => {

    if (chart.yAxes.indexOf(yAxis) > 0) {
      yAxis.set("syncWithAxis", chart.yAxes.getIndex(0));
    }

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/

    let series = chart.series.push(
      am5xy.LineSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: valueYField,
        strokeDasharray: "1,4",
        valueXField: "timestamp",
        // tooltip: am5.Tooltip.new(root, {}),
        // tooltip: am5.Tooltip.new(root, {
        //   pointerOrientation: "horizontal",
        //   labelText: tooltip,
        // }),
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

    // if (tooltip.length > 0) {
    //   console.log("tooltip apply")
    //   console.log(valueYField)
    //   series.set({"tooltip":
    //    am5.Tooltip.new(root, {
    //     pointerOrientation: "horizontal",
    //     labelText: tooltip,
    //     })
    //   });
    // }

    //series.fills.template.setAll({ fillOpacity: 0.2, visible: true });
    if ((valueYField == "Combined Trace") | (valueYField == "Combined Cost")) {
      series.strokes.template.setAll({ strokeWidth: 1.4 });
    } else {
      series.strokes.template.setAll({ strokeWidth: 1 });
    }
    
    if (valueYField == "Electrolyser Nominal Load") {
      series.strokes.template.setAll({ strokeDasharray: [10,8] });
    }

    // yRenderer.line.stroke = am5.color("#3787ac");
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
    //   // am5.color(0x5aaa95), PPA1
    //   // am5.color(0x2A324B), PPA2
    //   // am5.color(0x86a873), Com
    //   // am5.color(0xbb9f06) Nomi
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
    const isDispatchChart = this.props.isDispatchChart;
    const {seriesSettings} = this.props;
    let yRenderer = am5xy.AxisRendererY.new(root, {
      opposite: false
    });

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 1,
        renderer: yRenderer
      })
    );
    let yaxislabel = ""
    if (isDispatchChart) {
      yaxislabel = "[#2A324B]PPA Variable Volume (MW)[/]"
    } else {
      yaxislabel = "[#2A324B]Cost ($)[/]"
    }

    yAxis.children.unshift(
      am5.Label.new(root, {
        rotation: -90,
        text: yaxislabel,
        y: am5.p50,
        centerX: am5.p50
      })
    );
    console.log("dispatchchart")
      console.log(isDispatchChart)


    // Color Styling
    const nemgloStyle = getComputedStyle(document.body);
    let myColors = { 
      "PPA 1": nemgloStyle.getPropertyValue('--nemglo-ppa1'),
      "PPA 1 Cost": nemgloStyle.getPropertyValue('--nemglo-ppa1'),
      "PPA 2": nemgloStyle.getPropertyValue('--nemglo-ppa2'),
      "PPA 2 Cost": nemgloStyle.getPropertyValue('--nemglo-ppa2'),
      "Combined Trace": nemgloStyle.getPropertyValue('--nemglo-comb'),
      "Combined Cost": nemgloStyle.getPropertyValue('--nemglo-comb'),
      "Electrolyser Nominal Load": nemgloStyle.getPropertyValue('--nemglo-load'),
    }
    const myColorsText = {
      "PPA 1": nemgloStyle.getPropertyValue('--light'),
      "PPA 1 Cost": nemgloStyle.getPropertyValue('--light'),
      "PPA 2": nemgloStyle.getPropertyValue('--light'),
      "PPA 2 Cost": nemgloStyle.getPropertyValue('--light'),
      "Combined Trace": nemgloStyle.getPropertyValue('--light'),
      "Combined Cost": nemgloStyle.getPropertyValue('--light'),
      "Electrolyser Nominal Load": nemgloStyle.getPropertyValue('--light'),
    }


    for (let i = 0; i < seriesSettings.length; i++) {
      let seriesSetting = seriesSettings[i];
      let lineColor = myColors[seriesSetting.valueYField];
      let lineColorText = myColorsText[seriesSetting.valueYField];
      this.createAxisAndSeries( chart,
        xAxis,
        yAxis,
        data,
        isDispatchChart,
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

  componentDidUpdate() {
    // console.log(this.props.data);
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

export default NewPPAChart;
