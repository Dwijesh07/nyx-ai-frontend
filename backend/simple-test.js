// simple-test.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function test() {
  console.log("Testing Gemini API...");
  
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("API Key exists:", !!apiKey);
  
  if (!apiKey) {
    console.error("Add GEMINI_API_KEY to .env");
    return;
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Try the most common free model
  try {
    console.log("\nTrying: gemini-1.5-flash");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Say hello in one word");
    console.log("✓ SUCCESS! Response:", result.response.text());
    console.log("✅ Use 'gemini-1.5-flash' in your chat.js");
  } catch (err) {
    console.log("✗ gemini-1.5-flash failed:", err.message);
    
    // Try alternative
    try {
      console.log("\nTrying: gemini-pro");
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent("Say hello in one word");
      console.log("✓ SUCCESS! Response:", result.response.text());
      console.log("✅ Use 'gemini-pro' in your chat.js");
    } catch (err2) {
      console.log("✗ gemini-pro failed:", err2.message);
      console.log("\n❌ Check your API key at: https://makersuite.google.com/app/apikey");
    }
  }
}

test();