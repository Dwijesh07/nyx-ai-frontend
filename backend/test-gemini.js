// backend/routes/chat.js
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import multer from "multer";
import fs from "fs";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParseModule = require("pdf-parse");
const pdfParse = pdfParseModule.default || pdfParseModule;
import { readFile } from "fs/promises";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// In-memory conversation storage (use database later)
const conversations = new Map();

// Helper: read file text (same as summarize.js)
async function extractFileText(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  const filePath = file.path;
  let text = "";

  try {
    if (ext === ".txt") {
      text = await readFile(filePath, "utf-8");
    } else if (ext === ".pdf") {
      const dataBuffer = await readFile(filePath);
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text;
    } else if (ext === ".docx") {
      text = "DOCX parsing coming soon";
    } else {
      text = `Unsupported file type: ${ext}`;
    }
  } catch (err) {
    console.error("File extraction error:", err);
    text = `Error reading file: ${err.message}`;
  } finally {
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting temp file:", err);
    });
  }

  return text;
}

// Helper: fetch URL text (same as summarize.js)
async function fetchUrlText(url) {
  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept: "text/html",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(res.data);
    const bodyText = $("body").text().trim();
    return bodyText || "No text found on this page.";
  } catch (err) {
    throw new Error(`Unable to fetch URL: ${err.message}`);
  }
}

// Cache for working Gemini model
let cachedGeminiModel = null;

// Function to find working Gemini model
async function getWorkingGeminiModel() {
  if (cachedGeminiModel) return cachedGeminiModel;
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const testModels = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro",
    "gemini-1.0-pro",
    "gemini-1.5-flash-001",
    "gemini-1.5-pro-001"
  ];
  
  for (const modelName of testModels) {
    try {
      console.log(`Testing Gemini model: ${modelName}`);
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        }
      });
      
      // Quick test
      await model.generateContent("Hello");
      console.log(`✓ Gemini model ${modelName} works!`);
      cachedGeminiModel = { genAI, model, modelName };
      return cachedGeminiModel;
    } catch (err) {
      console.log(`✗ ${modelName} failed`);
      continue;
    }
  }
  
  throw new Error("No Gemini models worked with your API key");
}

// 1. Start new conversation
router.post("/new", (req, res) => {
  const conversationId = Date.now().toString();
  const conversation = {
    id: conversationId,
    title: "New Conversation",
    messages: [
      {
        role: "assistant",
        content: "Hi! I'm Nyx. How can I help you today?",
        timestamp: new Date().toISOString()
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  conversations.set(conversationId, conversation);
  res.json({ conversationId, conversation });
});

// 2. Get all conversations (for sidebar)
router.get("/", (req, res) => {
  const allConversations = Array.from(conversations.values())
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  res.json({ conversations: allConversations });
});

// 3. Get specific conversation
router.get("/:conversationId", (req, res) => {
  const conversation = conversations.get(req.params.conversationId);
  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found" });
  }
  res.json({ conversation });
});

// 4. Send message (main endpoint)
router.post("/message", upload.single("file"), async (req, res) => {
  const { conversationId, message, url } = req.body;
  
  if (!conversationId) {
    return res.status(400).json({ error: "conversationId is required" });
  }

  let conversation = conversations.get(conversationId);
  
  // Create conversation if it doesn't exist
  if (!conversation) {
    conversation = {
      id: conversationId,
      title: message ? (message.substring(0, 30) + (message.length > 30 ? "..." : "")) : "New Chat",
      messages: [
        {
          role: "assistant",
          content: "Hi! I'm Nyx. How can I help you today?",
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  let userMessage = message || "";
  
  // Process file if uploaded
  if (req.file) {
    try {
      const fileText = await extractFileText(req.file);
      userMessage = userMessage ? userMessage + "\n\n[File attached]\n" + fileText : fileText;
    } catch (err) {
      console.error("File processing error:", err);
    }
  }

  // Process URL if provided
  if (url) {
    try {
      const urlText = await fetchUrlText(url);
      userMessage = userMessage ? userMessage + "\n\n[URL content]\n" + urlText : urlText;
    } catch (err) {
      console.error("URL processing error:", err);
      userMessage = userMessage ? userMessage + `\n\n[Error fetching URL: ${err.message}]` : `[Error fetching URL: ${err.message}]`;
    }
  }

  if (!userMessage.trim()) {
    return res.status(400).json({ error: "Message cannot be empty" });
  }

  // Add user message to conversation
  conversation.messages.push({
    role: "user",
    content: userMessage,
    timestamp: new Date().toISOString()
  });

  // Update conversation title with first message
  if (conversation.messages.length === 2 || conversation.title === "New Conversation") {
    conversation.title = userMessage.substring(0, 30) + (userMessage.length > 30 ? "..." : "");
  }

  try {
    // Get working Gemini model
    const gemini = await getWorkingGeminiModel();
    console.log(`Using Gemini model: ${gemini.modelName}`);
    
    // Prepare messages for Gemini
    const allMessages = conversation.messages;
    
    // Build a simple prompt with conversation context
    let prompt = "";
    
    if (allMessages.length > 2) {
      // For continuing conversation, include previous context
      prompt = "Continue the conversation based on this context:\n\n";
      // Skip the welcome message for Gemini but keep it for the UI
      for (let i = 1; i < allMessages.length - 1; i++) {
        const msg = allMessages[i];
        prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n\n`;
      }
      prompt += `User: ${userMessage}\n\nAssistant:`;
    } else {
      // For first user message after welcome
      prompt = `You are Nyx, a helpful AI assistant. Respond to the user's message.\n\nUser: ${userMessage}\n\nAssistant:`;
    }

    // Generate response from Gemini
    console.log("Sending to Gemini...");
    const result = await gemini.model.generateContent(prompt);
    const aiResponse = result.response.text();
    console.log("Received from Gemini");

    // Add AI response to conversation
    conversation.messages.push({
      role: "assistant",
      content: aiResponse,
      timestamp: new Date().toISOString()
    });

    // Update and save conversation
    conversation.updatedAt = new Date().toISOString();
    conversations.set(conversationId, conversation);

    // Send response
    res.json({
      success: true,
      conversationId,
      response: aiResponse,
      conversation: conversation
    });

  } catch (error) {
    console.error("Gemini API error:", error.message);
    
    // Add error message to conversation
    conversation.messages.push({
      role: "assistant",
      content: "Sorry, I encountered an error. Please try again.",
      timestamp: new Date().toISOString()
    });
    
    conversations.set(conversationId, conversation);
    
    res.status(500).json({ 
      error: "AI processing failed", 
      details: error.message 
    });
  }
});

// 5. Delete conversation
router.delete("/:conversationId", (req, res) => {
  const deleted = conversations.delete(req.params.conversationId);
  res.json({ 
    success: deleted, 
    message: deleted ? "Conversation deleted" : "Conversation not found" 
  });
});

export default router;