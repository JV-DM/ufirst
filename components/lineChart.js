"use client";
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import Zoom from "chartjs-plugin-zoom";
import { colors } from "./chartColors";

Chart.register(Zoom);
const LineChart = ({ data, labels, title }) => {
  const canvasEl = useRef(null);

  const dat = data;
  var myLineChart = null;
  const resetZoom = () => {
    myLineChart.resetZoom();
  };
  useEffect(() => {
    const ctx = canvasEl.current.getContext("2d");

    myLineChart = createChart(ctx, data, labels);

    return function cleanup() {
      myLineChart.destroy();
    };
  }, [data]);

  const createChart = (ctx, chartData, labels) => {
    const gradient = ctx.createLinearGradient(0, 16, 0, 600);
    gradient.addColorStop(0, colors.purple.half);
    gradient.addColorStop(0.65, colors.purple.quarter);
    gradient.addColorStop(1, colors.purple.zero);

    const data = {
      labels: labels,
      datasets: [
        {
          backgroundColor: gradient,
          label: "epa-HTTP",
          data: chartData,
          fill: true,
          borderWidth: 2,
          borderColor: colors.purple.default,
          lineTension: 0.2,
          pointBackgroundColor: colors.purple.default,
          pointRadius: 1,
        },
      ],
    };

    const config = {
      type: "line",
      data: data,
      options: {
        plugins: {
          zoom: {
            zoom: {
              drag: {
                enabled: true,
              },
              wheel: {
                enabled: true,
              },
              mode: "xy",
            },
          },
        },
      },
    };

    return new Chart(ctx, config);
  };

  return (
    <div className="h-full w-full border border-gray-300">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <canvas id="myChart" ref={canvasEl} className="w-ful h-full" />
      <button
        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={resetZoom}
      >
        Reset zoom
      </button>
    </div>
  );
};

export default LineChart;
