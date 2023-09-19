"use server";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
export const uploadFile = async (file) => {
  // Initialize an empty array to store log entries as objects
  const logEntries = [];

  // Split the file into lines and parse each line into columns
  const lines = file.split("\n");
  lines.forEach((line) => {
    // Check if the line matches the provided format, including carriage return
    const match = line
      .trim()
      .match(/^(.*?) \[(.*?)\] "(.*?)" (\d+) (-|\d+)\r?$/);
    if (match) {
      try {
        const [, host, timestamp, request, replyCode, bytesReply] = match;
        // Clean any uncommon characters from the request
        const cleanedRequest = request.replace(/[^\x20-\x7E]+/g, ""); // Removes non-ASCII characters
        // Parse timestamp into day, hour, minute, and second
        const [day, hour, minute, second] = timestamp.split(":");
        logEntries.push({
          host,
          datetime: {
            day,
            hour,
            minute,
            second,
          },
          request: {
            method: cleanedRequest.split(" ")[0] ?? "ERROR",
            url: cleanedRequest.split(" ")[1] ?? "ERROR",
            protocol: cleanedRequest.split(" ")[2]?.split("/")[0] ?? "ERROR", //Some protocols missing so we are just skipping them if they don't exist
            protocol_version:
              cleanedRequest.split(" ")[2]?.split("/")[1] ?? "ERROR",
          },
          response_code: parseInt(replyCode),
          document_size: bytesReply === "-" ? null : parseInt(bytesReply), // Handle the dash
        });
      } catch (e) {
        console.log("Error during parsing: ", e);
      }
    } else {
      console.warn("Skipping line due to invalid format:", line);
    }
  });
  const jsonString = await JSON.stringify(logEntries);
  // Check if logEntries is not empty before writing it as JSON
  if (logEntries.length > 0) {
    const publicDirectoryPath = path.resolve(__dirname, "../public");
    console.log(publicDirectoryPath);

    try {
      await fs.writeFile(
        path.resolve(
          path.join(path.join(process.cwd(), "uploads"), "log_data.json")
        ),
        JSON.stringify(logEntries, null, 4),
        "utf8"
      );
      console.log("JSON file saved successfully.");
    } catch (err) {
      console.error("Error writing JSON file:", err);
    }
  }

  // Return the logEntries as a JSON response
  return logEntries;
};
