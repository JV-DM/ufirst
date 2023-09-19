"use client";
import React, { useState } from "react";
import { uploadFile } from "./uploadFile";

const FileLoader = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) return;

    try {
      let textData = await file.text();
      const res = await uploadFile(textData);
      // Call the parent component's callback with the uploaded file data
      onFileUpload(res);
    } catch (e) {
      // Handle errors here
      console.error(e);
    }
  };

  return (
    <div className="h-full w-full border border-gray-300 p-4">
      <h2 className="text-lg font-semibold mb-4">Upload file to change data</h2>
      <input
        type="file"
        id="file"
        name="file"
        accept=".txt"
        onChange={handleFileChange}
      />
      <button
        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={handleFileUpload}
      >
        Upload File
      </button>
    </div>
  );
};

export default FileLoader;
