"use client";
import RequestsChart from "@/components/requestChart";
import json from "/uploads/log_data.json";
import HttpDistributionChart from "@/components/httpDistributionChart";
import HttpDistributionAnswerCodes from "@/components/httpDistributionCodes";
import HttpDistributionAnswerSize from "@/components/httpDistributionAnswerSize";
import FileLoader from "@/components/fileLoader";
import { useState } from "react";
export default function Home() {
  const [data, setData] = useState(json ?? null);

  const handleFileUpload = (fileData) => {
    setData(fileData);
  };
  return (
    <main className="flex flex-col w-full items-center space-y-5">
      {/* Import file into the server */}
      <FileLoader onFileUpload={handleFileUpload} />
      {/* Render http chart */}
      <div className="h-2/3 w-2/3">
        <RequestsChart data={data} title="Distribution of HTTP Methods" />
      </div>
      {/* Render Distribution of HTTP methods (GET, POST, HEAD,...) */}
      <div className="h-2/3 w-2/3">
        <HttpDistributionChart
          data={data}
          title="Distribution of HTTP Methods"
        />
      </div>
      {/* Render Distribution of HTTP answer codes */}
      <div className="h-2/3 w-2/3">
        <HttpDistributionAnswerCodes
          data={data}
          title="Distribution of HTTP Methods"
        />
      </div>
      {/* Render Distribution of HTTP answer size */}
      <div className="h-2/3 w-2/3">
        <HttpDistributionAnswerSize
          data={data}
          title="Distribution of HTTP Methods"
        />
      </div>
    </main>
  );
}
