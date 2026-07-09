import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log("Using API Key:", apiKey?.substring(0, 10) + "...");

async function testRawFetch() {
  console.log("\n--- TEST: Raw Fetch with Authorization: Bearer ---");
  try {
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "User-Agent": "aistudio-build",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Hello, say raw fetch success" }] }]
      })
    });

    const data = await res.json();
    if (res.ok) {
      console.log("Raw Fetch SUCCESS:", JSON.stringify(data));
    } else {
      console.error("Raw Fetch FAILED with status", res.status, ":", JSON.stringify(data));
    }
  } catch (err: any) {
    console.error("Raw Fetch ERROR:", err.message || err);
  }
}

async function testRawFetchApiKeyHeader() {
  console.log("\n--- TEST: Raw Fetch with x-goog-api-key ---");
  try {
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey || "",
        "User-Agent": "aistudio-build",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Hello, say raw fetch api key success" }] }]
      })
    });

    const data = await res.json();
    if (res.ok) {
      console.log("Raw Fetch ApiKey SUCCESS:", JSON.stringify(data));
    } else {
      console.error("Raw Fetch ApiKey FAILED with status", res.status, ":", JSON.stringify(data));
    }
  } catch (err: any) {
    console.error("Raw Fetch ApiKey ERROR:", err.message || err);
  }
}

async function run() {
  await testRawFetch();
  await testRawFetchApiKeyHeader();
}

run();
