import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔵 Starting server...");
console.log("Current directory:", __dirname);

// Load .env
const envPath = path.resolve(__dirname, '.env');
console.log("Loading .env from:", envPath);

dotenv.config({ path: envPath });

console.log("✅ .env loaded");

const app = express();

// Simple health check endpoint
app.get('/health', (req, res) => {
  console.log("🩸 Health check received");
  res.status(200).send('OK');
});

// Basic test endpoint
app.get('/test', (req, res) => {
  res.json({ message: "Server is working!" });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: "Nyx AI Backend is running 🚀" });
});

const PORT = process.env.PORT || 5000;

console.log(`🟡 Attempting to listen on port ${PORT}...`);

const server = app.listen(PORT, () => {
  console.log(`🟢 Server is listening on port ${PORT}`);
  console.log(`✅ Health check at http://localhost:${PORT}/health`);
  console.log(`✅ Test endpoint at http://localhost:${PORT}/test`);
});

server.on('error', (error) => {
  console.error('🔴 Server error:', error);
});

// Handle process errors
process.on('uncaughtException', (err) => {
  console.error('🔴 Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('🔴 Unhandled Rejection:', err);
});

console.log("🟢 Server setup complete");