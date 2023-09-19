import React from "react";
import dynamic from "next/dynamic";
const ColumnChart = dynamic(() => import("./columnChart"), { ssr: false });

const HttpDistributionChart = async ({ data }) => {
  const prepareChartData = (data) => {
    if (!data) return null;

    const httpMethodCounts = {};

    data.forEach((entry) => {
      const { request } = entry;
      const { method } = request;
      if (
        method != "GET" &&
        method != "POST" &&
        method != "PUT" &&
        method != "DELETE" &&
        method != "HEAD"
      ) {
        //If it's not a valid method we will set it as invalid
        httpMethodCounts["INVALID"]
          ? httpMethodCounts["INVALID"]++
          : (httpMethodCounts["INVALID"] = 1);
      } else if (httpMethodCounts[method]) {
        httpMethodCounts[method]++;
      } else {
        httpMethodCounts[method] = 1;
      }
    });

    const labels = Object.keys(httpMethodCounts);
    const dataPoints = Object.values(httpMethodCounts);

    return {
      labels: labels,
      dataPoints: dataPoints,
    };
  };

  const chartData = await prepareChartData(data);

  return (
    <div className="h-full w-full border border-gray-300">
      {chartData ? (
        <ColumnChart
          data={chartData.dataPoints}
          labels={chartData.labels}
          title={"HTTP Method distribution chart"}
        />
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};

export default HttpDistributionChart;
