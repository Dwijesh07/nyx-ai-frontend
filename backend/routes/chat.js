// backend/routes/chat.js
import express from "express";
import Groq from "groq-sdk";
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
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
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
      messages: [],
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
  if (conversation.messages.length === 1 || conversation.title === "New Conversation") {
    conversation.title = userMessage.substring(0, 30) + (userMessage.length > 30 ? "..." : "");
  }

  try {
    // Prepare messages for AI (format for Groq)
    const messagesForAI = conversation.messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Get AI response from Groq
    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: messagesForAI,
      temperature: 0.7,
      max_tokens: 2000
    });

    const aiResponse = completion.choices[0].message.content;

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
    console.error("Groq API error:", error);
    
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