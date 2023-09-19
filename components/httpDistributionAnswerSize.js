import React from "react";
import dynamic from "next/dynamic";
const ColumnChart = dynamic(() => import("./columnChart"), { ssr: false });

const HttpDistributionAnswerSize = async ({ data }) => {
  const prepareChartData = (data, binSize) => {
    const maxFileSize = 1000;
    if (!data) return null;

    const httpSizeCounts = {};
    // Assuming a maximum size of 1000 bytes we will divide the graph in bins
    const maxBin = Math.ceil(maxFileSize / binSize);

    data.forEach((entry) => {
      const { document_size, response_code } = entry;
      if (document_size < maxFileSize && response_code === 200) {
        //Divide the data into the correct bin
        const binIndex = Math.floor(document_size / binSize);

        if (httpSizeCounts[binIndex]) {
          httpSizeCounts[binIndex]++;
        } else {
          httpSizeCounts[binIndex] = 1;
        }
      }
    });

    const labels = [...Array(maxBin).keys()].map(
      (binIndex) =>
        `${binIndex * binSize}-${(binIndex + 1) * binSize - 1} bytes`
    );
    const dataPoints = [...Array(maxBin).keys()].map(
      (binIndex) => httpSizeCounts[binIndex] || 0
    );

    return {
      labels: labels,
      dataPoints: dataPoints,
    };
  };

  const chartData = await prepareChartData(data, 50);

  return (
    <div className="h-full w-full border border-gray-300">
      {chartData ? (
        <ColumnChart
          data={chartData.dataPoints}
          labels={chartData.labels}
          title={"Request answer size"}
        />
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};

export default HttpDistributionAnswerSize;
