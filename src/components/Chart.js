import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import { isEmpty } from "lodash";
import ElmoFire from "../resources/elmofire.png";
import FGM from "../resources/fgm.png";

const Chart = ({
  searchValue,
  apiData,
  generateValue,
  timeSeries,
  width,
  height,
}) => {
  const [chart, setChart] = useState(null);

  useEffect(() => {
    generateChart();

    return () => {
      d3.select("svg").remove();
    };
  }, [apiData]);

  const createChart = async (data) => {
    // This Candle Stick chart was created by Mike Bostock
    // For more information go here: https://observablehq.com/@d3/candlestick-chart
    // Code was modified to show daily (1 min) time frames

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const svg = d3
      .select("#svg-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const tooltip = d3
      .select("#svg-chart")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("width", "60px")
      .style("height", "28px")
      .style("padding", "2px")
      .style("visibility", "hidden");

    const x = d3
      .scaleTime()
      .rangeRound([width - margin.left, margin.right])
      .domain(
        d3
          .extent(data, function (d) {
            return d.date;
          })
          .reverse()
      );

    const y = d3
      .scaleLog()
      .domain([d3.min(data, (d) => d.low), d3.max(data, (d) => d.high)])
      .rangeRound([height - margin.bottom, margin.top]);

    const xAxis = (g) =>
      g
        .attr("transform", `translate(0,` + `${height - margin.bottom}` + ")")
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d %H:%M")))
        .selectAll("text")
        .attr("dy", ".15em")
        .attr("dx", ".15em")
        .attr("transform", "rotate(-65)");

    const yAxis = (g) =>
      g
        .attr("transform", `translate(${margin.left},0)`)
        .call(
          d3
            .axisLeft(y)
            .tickFormat(d3.format("$~f"))
            .tickValues(d3.scaleLinear().domain(y.domain()).ticks())
        )
        .call((g) =>
          g
            .selectAll(".tick line")
            .clone()
            .attr("stroke-opacity", 0.2)
            .attr("x2", width - margin.left - margin.right)
        )
        .call((g) => g.select(".domain").remove());

    svg.append("g").call(xAxis);

    svg.append("g").call(yAxis);

    const g = svg
      .append("g")
      .attr("stroke-linecap", "round")
      .attr("stroke", "black")
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("class", "g-node")
      .attr("transform", (d) => `translate(${x(d.date)},0)`);

    g.append("line")
      .attr("y1", (d) => y(d.low))
      .attr("y2", (d) => y(d.high));

    g.append("line")
      .attr("y1", (d) => y(d.open))
      .attr("y2", (d) => y(d.close))
      .attr("stroke-width", "5px")
      .attr("stroke", (d) =>
        d.open > d.close
          ? d3.schemeSet1[0]
          : d.close > d.open
          ? d3.schemeSet1[2]
          : d3.schemeSet1[8]
      );

    const size = d3.selectAll("line").size();

    g.append("svg:image")
      .attr("xlink:href", function (d) {
        return d.open > d.close ? ElmoFire : d.close > d.open ? FGM : null;
      })
      .attr("y", (d) => y(d.close))
      .attr("width", size < 500 ? 100 : 25)
      .attr("height", size < 500 ? 100 : 25)
      .on("mouseover", function (d) {
        tooltip
          .append("img")
          .attr(
            "src",
            d.open > d.close ? ElmoFire : d.close > d.open ? FGM : null
          )
          .attr("x", -8)
          .attr("y", -8)
          .attr("width", "150px")
          .attr("height", "150px");
        tooltip.style("visibility", "visible");
      })
      .on("mousemove", function () {
        return tooltip
          .style("top", d3.event.pageY - 10 + "px")
          .style("left", d3.event.pageX + 10 + "px");
      })
      .on("mouseout", function () {
        tooltip.select("img").remove();
        return tooltip.style("visibility", "hidden");
      });

    setChart(svg.node());
  };

  const generateChart = () => {
    if (!isEmpty(apiData)) {
      let iso = "";
      if (timeSeries.includes("INTRADAY")) {
        iso = d3.utcParse("%Y-%m-%d %H:%M:%S");
      } else {
        iso = d3.utcParse("%Y-%m-%d");
      }

      const chartData = [];

      for (let [key, value] of Object.entries(apiData)) {
        let date = iso(key);

        const open = value["1. open"];
        const high = value["2. high"];
        const low = value["3. low"];
        const close = value["4. close"];

        chartData.push({
          date: date,
          high: high,
          low: low,
          open: open,
          close: close,
        });
      }
      createChart(chartData);
    }
  };

  return (
    <React.Fragment>
      {generateValue && !chart && <div>Generating Chart...</div>}
      {chart && searchValue && <h2>{searchValue}</h2>}
      <div id='svg-chart'></div>
    </React.Fragment>
  );
};

export default Chart;
