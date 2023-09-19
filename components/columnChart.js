"use client";
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import Zoom from "chartjs-plugin-zoom";
import { colors } from "./chartColors";

Chart.register(Zoom);

// Function to prepare chart data

// Function to create and destroy the chart
const createChart = (canvasEl, data, labels) => {
  if (!canvasEl) return null;

  const ctx = canvasEl.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 16, 0, 600);
  gradient.addColorStop(0, colors.purple.half);
  gradient.addColorStop(0.65, colors.purple.quarter);
  gradient.addColorStop(1, colors.purple.zero);

  const chartData = {
    labels: labels,
    datasets: [
      {
        backgroundColor: gradient,
        label: "epa-HTTP",
        data: data,
        borderWidth: 2,
        borderColor: colors.purple.default,
      },
    ],
  };

  const chartConfig = {
    type: "bar",
    data: chartData,
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
            pinch: {
              enabled: false,
            },
            mode: "xy",
          },
        },
      },
    },
  };

  return new Chart(ctx, chartConfig);
};

// HttpDistributionChart component
const ColumnChart = ({ data, labels, title }) => {
  const canvasEl = useRef(null);
  var myBarChart = null;
  const resetZoom = () => {
    myBarChart.resetZoom();
  };
  useEffect(() => {
    myBarChart = createChart(canvasEl.current, data, labels);

    return function cleanup() {
      myBarChart?.destroy();
    };
  }, [data]);

  return (
    <div className="h-full w-full border border-gray-300">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <canvas ref={canvasEl} className="w-full h-full" />
      <button
        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={resetZoom}
      >
        Reset zoom
      </button>
    </div>
  );
};

export default ColumnChart;
