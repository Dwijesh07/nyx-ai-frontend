import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import nodemailer from "nodemailer";
import summarizeRoute from "./routes/summarize.js";
import chatRoute from "./routes/chat.js";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔵 Starting server...");

// Load .env
const envPath = path.resolve(__dirname, '.env');
console.log("Loading .env from:", envPath);

dotenv.config({ path: envPath });

console.log("✅ .env loaded");

const app = express();

// Simple health check endpoint (MUST be first)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Basic CORS
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all requests
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
});

// Configure email transporter
let transporter;
try {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_PASS
    },
    tls: { rejectUnauthorized: false }
  });
  console.log("✅ Email transporter configured");
} catch (error) {
  console.log("❌ Email transporter error:", error.message);
}

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// Test email endpoint
app.get("/api/test-email", async (req, res) => {
  console.log("\n🧪 TESTING EMAIL...");
  try {
    if (!transporter) throw new Error("Email not configured");
    await transporter.verify();
    res.json({ success: true, message: "Email configured correctly" });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Data directory setup
let dataDir;
try {
  dataDir = path.join(__dirname, 'data');
  await fs.mkdir(dataDir, { recursive: true });
  console.log("✅ Data directory ready at:", dataDir);
} catch (err) {
  console.log("⚠️ Data directory error:", err.message);
  dataDir = '/tmp/nyx-data';
  await fs.mkdir(dataDir, { recursive: true });
  console.log("✅ Using /tmp directory at:", dataDir);
}

// Simple waitlist endpoint (temporary)
app.post("/api/waitlist", async (req, res) => {
  try {
    const { email, name } = req.body;
    console.log("Waitlist submission:", email, name);
    res.json({ success: true, message: "Thanks for joining!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// View waitlist (temporary)
app.get("/api/waitlist", (req, res) => {
  res.send("<h1>Waitlist Admin</h1><p>Working!</p>");
});

// Mount routes
console.log("📝 Mounting routes...");
app.use("/api/summarize", summarizeRoute);
app.use("/api/chat", chatRoute);
console.log("✅ Routes mounted");

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Nyx AI Backend is running 🚀" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;

console.log(`🟡 Attempting to listen on port ${PORT}...`);

const server = app.listen(PORT, () => {
  console.log(`🟢 Server running on port ${PORT}`);
  console.log(`✅ Health check: /health`);
  console.log(`✅ Test: /api/test`);
  console.log(`✅ Test email: /api/test-email`);
});

server.on('error', (error) => {
  console.error('🔴 Server error:', error);
});

process.on('uncaughtException', (err) => {
  console.error('🔴 Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('🔴 Unhandled Rejection:', err);
});

console.log("🟢 Server initialization complete");