const fs = require("fs");

// Initialize an empty array to store log entries as objects
const logEntries = [];

// Read and parse the epa-http.txt file
fs.readFile("epa-http.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  // Split the file into lines and parse each line into columns
  const lines = data.split("\n");
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
        console.log(cleanedRequest);
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

  // Write the structured data as a JSON array to a new file
  fs.writeFile(
    "log_data.json",
    JSON.stringify(logEntries, null, 4),
    "utf8",
    (err) => {
      if (err) {
        console.error("Error writing JSON file:", err);
      } else {
        console.log("JSON file saved successfully.");
      }
    }
  );
});
