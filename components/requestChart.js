"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const LineChart = dynamic(() => import("./lineChart"), { ssr: false });

const RequestsChart = ({ data }) => {
  const [chartData, setChartData] = useState(null);
  const prepareChartData = (data) => {
    const requestsPerMinute = {};
    if (!data || data.length === 0) {
      return { labels: [], dataPoints: [] };
    }
    data.forEach((entry) => {
      const { datetime } = entry;
      const { day, hour, minute } = datetime;

      if (!requestsPerMinute[day]) {
        requestsPerMinute[day] = {};
      }
      if (!requestsPerMinute[day][hour]) {
        requestsPerMinute[day][hour] = {};
      }

      if (requestsPerMinute[day][hour][minute]) {
        requestsPerMinute[day][hour][minute]++;
      } else {
        requestsPerMinute[day][hour][minute] = 1;
      }
    });

    const labels = [];
    const dataPoints = [];

    for (const day in requestsPerMinute) {
      for (const hour in requestsPerMinute[day]) {
        for (const minute in requestsPerMinute[day][hour]) {
          labels.push(`Day:${day} - ${hour}:${minute}`);
          dataPoints.push(requestsPerMinute[day][hour][minute]);
        }
      }
    }

    return {
      labels: labels,
      dataPoints: dataPoints,
    };
  };
  useEffect(() => {
    setChartData(prepareChartData(data));
  }, [data]);

  return (
    <div className="h-full w-full border border-gray-300">
      {chartData ? (
        <LineChart
          data={chartData.dataPoints}
          labels={chartData.labels}
          title={"Requests per minute"}
        />
      ) : (
        <p>Loading chart data...</p> // Add loading indicator or error handling here
      )}
    </div>
  );
};

export default RequestsChart;
