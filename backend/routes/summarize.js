// backend/routes/summarize.js
import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import Groq from "groq-sdk"; 
import axios from "axios";
import * as cheerio from "cheerio";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParseModule = require("pdf-parse");
const pdfParse = pdfParseModule.default || pdfParseModule;

import { readFile } from "fs/promises";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Helper: read file text based on type
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
      // Placeholder
      text = "DOCX parsing coming soon";
    } else {
      text = `Unsupported file type: ${ext}`;
    }
  } catch (err) {
    console.error("File extraction error:", err);
    text = `Error reading file: ${err.message}`;
  } finally {
    // Cleanup
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting temp file:", err);
    });
  }

  return text;
}

// Helper: fetch page text from URL
async function fetchUrlText(url) {
  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept: "text/html",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(res.data);
    const bodyText = $("body").text().trim();

    if (!bodyText) {
      throw new Error("No text found on this page.");
    }

    return bodyText;
  } catch (err) {
    if (err.response) {
      const status = err.response.status;
      if (status === 403 || status === 401 || status === 429) {
        throw new Error(
          "This website blocks automated access. Please paste the text directly or try another link."
        );
      }
      throw new Error(`URL fetch failed with status code ${status}`);
    }

    throw new Error(`Unable to reach this URL: ${err.message}`);
  }
}

router.post("/", upload.single("file"), async (req, res) => {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  let { text, url } = req.body;

  try {
    // Extract file text if uploaded
    if (req.file) {
      const fileText = await extractFileText(req.file);
      text = text ? text + "\n" + fileText : fileText;
    }

    // Fetch URL text if provided
    if (url) {
      try {
        const urlText = await fetchUrlText(url);
        text = text ? text + "\n" + urlText : urlText;
      } catch (err) {
        console.error("URL fetch error:", err.message);
        text = text
          ? text + `\n[Could not fetch URL: ${err.message}]`
          : `[Could not fetch URL: ${err.message}]`;
      }
    }

    if (!text) return res.status(400).json({ error: "No content provided" });

    // ⚡ AI processing block
    let summary = "";
    try {
      const { tool = "summarize", summaryType = "paragraph", summaryLength = 50 } = req.body;

      // Build prompt based on selected tool
      let prompt = "";
      switch (tool) {
        // === CORE TEXT TOOLS ===
        case "summarize":
          prompt = `Summarize this text:\n\n${text}\n\nPlease summarize as ${summaryType} with approximately ${summaryLength}% length.`;
          break;
        case "humanize":
          prompt = `Rewrite this text in a more natural, human-like way:\n\n${text}`;
          break;
        case "plagiarism":
          prompt = `Check the following text for plagiarism and provide a short report:\n\n${text}`;
          break;
        case "keywords":
          prompt = `Extract key keywords and phrases from the following text:\n\n${text}`;
          break;
        case "grammar":
          prompt = `Check and correct grammar, spelling, and punctuation in this text. Return the corrected version:\n\n${text}`;
          break;
        case "paraphrase":
          prompt = `Paraphrase this text while keeping the original meaning:\n\n${text}`;
          break;
        case "tone":
          prompt = `Rewrite this text in a ${summaryType} tone:\n\n${text}`;
          break;
        case "expand":
          prompt = `Expand this text to be more detailed (make it ${summaryLength}% longer):\n\n${text}`;
          break;
        case "simplify":
          prompt = `Simplify this text for easier understanding:\n\n${text}`;
          break;

        // === STUDY & ACADEMIC ===
        case "citation":
          prompt = `Generate ${summaryType} style citations for these sources:\n\n${text}`;
          break;
        case "flashcards":
          prompt = `Create ${summaryLength} flashcards from this text. Format as: FRONT: [question] BACK: [answer]\n\n${text}`;
          break;
        case "quiz":
          prompt = `Create a ${summaryLength}-question ${summaryType} quiz from this material. Include answers at the end:\n\n${text}`;
          break;
        case "exam":
          prompt = `Create exam preparation material from this text including ${summaryLength} key concepts:\n\n${text}`;
          break;
        case "outline":
          prompt = `Create a detailed essay outline from this text:\n\n${text}`;
          break;
        case "notes":
          prompt = `Create organized study notes from this text:\n\n${text}`;
          break;
        case "vocab":
          prompt = `Extract ${summaryLength} important vocabulary words with definitions from:\n\n${text}`;
          break;

        // === DISCIPLINE SPECIALIZED ===
        case "code":
          prompt = `Explain this code in simple terms:\n\n${text}`;
          break;
        case "legal":
          prompt = `Summarize this legal document in plain English:\n\n${text}`;
          break;
        case "medical":
          prompt = `Explain this medical terminology in simple terms:\n\n${text}`;
          break;
        case "business":
          prompt = `Analyze this business case study:\n\n${text}`;
          break;
        case "math":
          prompt = `Solve this math problem step by step:\n\n${text}`;
          break;
        case "science":
          prompt = `Explain this science concept:\n\n${text}`;
          break;
        case "literature":
          prompt = `Analyze this literary text:\n\n${text}`;
          break;
        case "history":
          prompt = `Provide historical context for:\n\n${text}`;
          break;

        // === PREMIUM POWER TOOLS ===
        case "tutor":
          prompt = `Act as a personal tutor. The user asks: "${text}"\n\nProvide clear explanation, examples, and practice questions.`;
          break;
        case "research":
          prompt = `For this topic: "${text}"\n\nFind and suggest relevant academic resources and links.`;
          break;
        case "compare":
          prompt = `Compare these two documents/texts:\n\n${text}`;
          break;
        case "presentation":
          prompt = `Create a presentation script for:\n\n${text}`;
          break;
        case "resume":
          prompt = `Improve this resume text:\n\n${text}`;
          break;
        case "scholarship":
          prompt = `Help write a scholarship essay about:\n\n${text}`;
          break;
        case "group":
          prompt = `Create a group project plan for:\n\n${text}`;
          break;

        default:
          prompt = `Process this text for ${tool}:\n\n${text}`;
      }

      const completion = await client.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
      });

      summary = completion.choices[0].message.content;
    } catch (aiErr) {
      console.error("OpenAI API error:", aiErr);
      summary = `AI processing failed: ${aiErr.message}`;
    }

    res.json({ summary });
  } catch (err) {
    console.error("Backend route error:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

export default router;