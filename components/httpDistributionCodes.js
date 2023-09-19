import React from "react";
import dynamic from "next/dynamic";
const ColumnChart = dynamic(() => import("./columnChart"), { ssr: false });

const HttpDistributionAnswerCodes = async ({ data }) => {
  const prepareChartData = (data) => {
    if (!data) return null;

    const httpCodeCounts = {};

    data.forEach((entry) => {
      const { response_code } = entry;

      if (httpCodeCounts[response_code]) {
        httpCodeCounts[response_code]++;
      } else {
        httpCodeCounts[response_code] = 1;
      }
    });

    const labels = Object.keys(httpCodeCounts);
    const dataPoints = Object.values(httpCodeCounts);

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

export default HttpDistributionAnswerCodes;
