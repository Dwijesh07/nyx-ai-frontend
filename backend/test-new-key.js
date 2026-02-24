// test-new-key.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function test() {
  console.log("=== TESTING NEW GEMINI API KEY ===");
  
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("API Key (first 15 chars):", apiKey?.substring(0, 15) + "...");
  
  if (!apiKey || apiKey.includes("AIzaSyBngrtLkiKDzZqfUDtnIky8E-QdFis1qQg")) {
    console.log("\n⚠️  You're still using the DEFAULT/DEMO key!");
    console.log("Get a real key from: https://aistudio.google.com/apikey");
    console.log("Then update your .env file");
    return;
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Try the most common models
  const testModels = [
    "gemini-1.5-flash",  // Free tier
    "gemini-1.5-pro",    // Better but might have limits
    "gemini-1.0-pro",    // Older but reliable
  ];
  
  for (const modelName of testModels) {
    try {
      console.log(`\n🔍 Testing: ${modelName}`);
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: { maxOutputTokens: 100 }
      });
      
      const result = await model.generateContent("Say 'Hello World'");
      const response = result.response.text();
      
      console.log(`✅ SUCCESS with ${modelName}!`);
      console.log(`   Response: ${response}`);
      console.log(`\n💡 Use this in chat.js: model: "${modelName}"`);
      return modelName;
      
    } catch (err) {
      console.log(`❌ ${modelName} failed: ${err.message.split('\n')[0]}`);
    }
  }
  
  console.log("\n⚠️  No models worked. Try creating a new API key.");
}

test();