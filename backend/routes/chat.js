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

// In-memory conversation storage
const conversations = new Map();

// Knowledge cutoff date - December 2023
const KNOWLEDGE_CUTOFF = "December 2023";

// Helper: Check if question is about recent events or after cutoff
function isRecentEventQuestion(question) {
  const lowerQuestion = question.toLowerCase();
  
  // Keywords indicating recent events or news
  const recentKeywords = [
    'today', 'yesterday', 'this week', 'this month', 'latest', 'news', 'current',
    'recent', 'happening now', 'just happened', 'breaking', 'update', 'new',
    '2024', '2025', '2026', 'score', 'results', 'won', 'lost', 'match',
    'game', 'election', 'president', 'prime minister', 'champions', 'winner'
  ];
  
  const timeKeywords = ['what happened', 'who won', 'what is the score', 'what are the results'];
  
  return recentKeywords.some(keyword => lowerQuestion.includes(keyword)) ||
         timeKeywords.some(keyword => lowerQuestion.includes(keyword));
}

// Helper: Check if question is about sports results
function isSportsScoreQuestion(question) {
  const lowerQuestion = question.toLowerCase();
  const sportsKeywords = ['score', 'result', 'won', 'lost', 'match', 'game', 'goal', 'points', 'champions', 'final'];
  const teamsKeywords = ['liverpool', 'man city', 'arsenal', 'chelsea', 'man united', 'real madrid', 'barcelona', 'bayern'];
  
  return sportsKeywords.some(keyword => lowerQuestion.includes(keyword)) &&
         teamsKeywords.some(team => lowerQuestion.includes(team));
}

// Helper: Check if question is education-related
function isEducationQuestion(question) {
  const lowerQuestion = question.toLowerCase();
  
  const educationKeywords = [
    'homework', 'study', 'learn', 'explain', 'what is', 'how does', 'how to',
    'math', 'science', 'history', 'english', 'essay', 'solve', 'calculate',
    'define', 'meaning', 'help with', 'understand', 'equation', 'formula',
    'theory', 'concept', 'analysis', 'summary', 'research', 'write', 'edit',
    'grammar', 'spelling', 'vocabulary', 'algebra', 'calculus', 'physics',
    'chemistry', 'biology', 'geography', 'philosophy', 'literature'
  ];
  
  return educationKeywords.some(keyword => lowerQuestion.includes(keyword));
}

// Helper: read file text
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

// Helper: fetch URL text
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
        content: `Hi! I'm Nyx, your AI study assistant. I'm here to help with homework, studying, and educational questions. My knowledge goes up to ${KNOWLEDGE_CUTOFF}. What subject can I help you with today?`,
        timestamp: new Date().toISOString()
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  conversations.set(conversationId, conversation);
  res.json({ conversationId, conversation });
});

// 2. Get all conversations
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
  
  if (req.file) {
    try {
      const fileText = await extractFileText(req.file);
      userMessage = userMessage ? userMessage + "\n\n[File attached]\n" + fileText : fileText;
    } catch (err) {
      console.error("File processing error:", err);
    }
  }

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

  // Check for recent events or non-educational questions BEFORE sending to AI
  if (isRecentEventQuestion(userMessage) || isSportsScoreQuestion(userMessage)) {
    const aiResponse = `I'm designed to help with educational topics and studying. My knowledge goes up to ${KNOWLEDGE_CUTOFF}, so I don't have information about recent events, live scores, or current news. 📚\n\nIs there something you're learning about that I can help with? I'm great at explaining concepts, helping with homework, and breaking down difficult topics!`;
    
    conversation.messages.push({
      role: "user",
      content: userMessage,
      timestamp: new Date().toISOString()
    });
    
    conversation.messages.push({
      role: "assistant",
      content: aiResponse,
      timestamp: new Date().toISOString()
    });
    
    if (conversation.messages.length === 2 || conversation.title === "New Conversation") {
      conversation.title = userMessage.substring(0, 30) + (userMessage.length > 30 ? "..." : "");
    }
    
    conversation.updatedAt = new Date().toISOString();
    conversations.set(conversationId, conversation);
    
    return res.json({
      success: true,
      conversationId,
      response: aiResponse,
      conversation: conversation
    });
  }

  conversation.messages.push({
    role: "user",
    content: userMessage,
    timestamp: new Date().toISOString()
  });

  if (conversation.messages.length === 1 || conversation.title === "New Conversation") {
    conversation.title = userMessage.substring(0, 30) + (userMessage.length > 30 ? "..." : "");
  }

  try {
    const messagesForAI = [
      {
        role: "system",
        content: `You are Nyx, an AI study assistant designed to help students with their educational questions.

IMPORTANT RULES:
1. ONLY answer questions related to education, studying, homework, academic subjects, and learning.
2. Your knowledge cutoff is ${KNOWLEDGE_CUTOFF}. You DO NOT have information about events after this date.
3. If someone asks about recent events, sports scores, current news, or anything after ${KNOWLEDGE_CUTOFF}, politely say: "I'm designed to help with educational topics and my knowledge goes up to ${KNOWLEDGE_CUTOFF}. I don't have information about recent events or current scores. Is there something you're studying that I can help with?"
4. If someone asks about non-educational topics (gossip, personal advice, politics, entertainment news), redirect them to educational topics.
5. Keep responses helpful, concise, and focused on learning.
6. Be encouraging and supportive to students.
7. If you're unsure about something, it's better to say you don't know rather than guess.`
      },
      ...conversation.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: messagesForAI,
      temperature: 0.7,
      max_tokens: 2000
    });

    let aiResponse = completion.choices[0].message.content;

    conversation.messages.push({
      role: "assistant",
      content: aiResponse,
      timestamp: new Date().toISOString()
    });

    conversation.updatedAt = new Date().toISOString();
    conversations.set(conversationId, conversation);

    res.json({
      success: true,
      conversationId,
      response: aiResponse,
      conversation: conversation
    });

  } catch (error) {
    console.error("Groq API error:", error);
    
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
