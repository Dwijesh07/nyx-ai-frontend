import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import nodemailer from "nodemailer";
import summarizeRoute from "./routes/summarize.js";
import chatRoute from "./routes/chat.js";
import waitlistRoute from "./routes/waitlist.js";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
const envPath = path.resolve(__dirname, '.env');
console.log("Loading .env from:", envPath);

// Load .env (no await needed here)
dotenv.config({ path: envPath });

// Debug output
console.log("\n=== ENV VARIABLES ===");
console.log("GROQ_API_KEY exists:", process.env.GROQ_API_KEY ? "YES" : "NO");
console.log("MY_EMAIL:", process.env.MY_EMAIL || "❌ NOT SET");
console.log("MY_PASS exists:", process.env.MY_PASS ? "YES" : "NO");
if (process.env.MY_PASS) {
  console.log("MY_PASS length:", process.env.MY_PASS.length);
}
console.log("=====================\n");

const app = express();

// ========== HEALTH CHECK ENDPOINT (FIRST!) ==========
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Configure email transporter with better options
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.MY_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: true,
  logger: true
});

// Verify email connection
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email error:', error.message);
  } else {
    console.log('✅ Email server ready');
  }
});

// ==================== CORS CONFIGURATION ====================
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle preflight requests explicitly
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.sendStatus(200);
});

// Add headers to all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  next();
});
// ==================== END CORS ====================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
});

// Add temporary test endpoint
app.get("/api/chat-test", (req, res) => {
  res.json({ 
    message: "Chat routes are working", 
    routes: ["/api/chat/new", "/api/chat", "/api/chat/:id", "/api/chat/message"] 
  });
});

// ========== TEST EMAIL ENDPOINT ==========
app.get("/api/test-email", async (req, res) => {
  console.log("\n🧪 TESTING EMAIL SENDING...");
  
  try {
    console.log("1. Verifying transporter...");
    await transporter.verify();
    console.log("✅ Transporter verified");
    
    console.log("2. Sending test email...");
    console.log("From:", process.env.MY_EMAIL);
    console.log("To:", process.env.MY_EMAIL);
    
    const info = await transporter.sendMail({
      from: `"Nyx AI" <${process.env.MY_EMAIL}>`,
      to: process.env.MY_EMAIL,
      subject: "✅ Test Email from Nyx AI",
      text: "If you receive this, emails are working!",
      html: "<h1>Test Email</h1><p>Your email configuration is working!</p>"
    });
    
    console.log("3. ✅ Test email sent successfully!");
    console.log("Message ID:", info.messageId);
    
    res.json({ 
      success: true, 
      message: "Test email sent! Check your inbox (and spam folder)",
      messageId: info.messageId
    });
    
  } catch (error) {
    console.log("❌ Test email failed:", error.message);
    res.json({ 
      success: false, 
      error: error.message,
      code: error.code
    });
  }
});

// ========== VIEW WAITLIST (Admin) ==========
app.get("/api/waitlist", async (req, res) => {
  try {
    const waitlistPath = path.join(__dirname, 'data', 'waitlist.json');
    let users = [];
    
    try {
      const data = await fs.readFile(waitlistPath, 'utf8');
      users = JSON.parse(data);
    } catch (err) {
      // No file yet
    }
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Nyx AI - Waitlist Admin</title>
        <style>
          body { font-family: Arial; background: #0a0a0f; color: #e0e0e0; padding: 40px 20px; }
          .container { max-width: 1000px; margin: 0 auto; }
          h1 { color: #667eea; }
          .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
          .stat-card { background: #1a1a2e; padding: 20px; border-radius: 10px; }
          .stat-number { font-size: 32px; font-weight: bold; color: #667eea; }
          table { width: 100%; border-collapse: collapse; background: #1a1a2e; border-radius: 10px; }
          th { background: #16213e; color: #667eea; padding: 15px; text-align: left; }
          td { padding: 12px 15px; border-bottom: 1px solid #2a2a3e; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>📋 Nyx AI Waitlist</h1>
          <div class="stats">
            <div class="stat-card"><div class="stat-number">${users.length}</div><div>Total Signups</div></div>
            <div class="stat-card"><div class="stat-number">${users.filter(u => u.name !== 'Future Nyx User').length}</div><div>With Names</div></div>
            <div class="stat-card"><div class="stat-number">${new Date().toLocaleDateString()}</div><div>Last Updated</div></div>
          </div>
          <table>
            <tr><th>#</th><th>Date</th><th>Email</th><th>Name</th></tr>
            ${users.map((user, i) => `<tr><td>${i+1}</td><td>${new Date(user.joinedAt).toLocaleString()}</td><td>${user.email}</td><td>${user.name}</td></tr>`).join('')}
          </table>
        </div>
      </body>
      </html>
    `;
    
    res.send(html);
  } catch (error) {
    res.send('<h1>No signups yet</h1>');
  }
});

// ========== CONTACT FORM ENDPOINT ==========
app.post("/api/contact", async (req, res) => {
  console.log("\n📝 NEW CONTACT FORM SUBMISSION");
  console.log("Request body:", req.body);
  
  try {
    const { name, email, phone, subject, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required' });
    }

    // Save to JSON file
    const contactPath = path.join(__dirname, 'data', 'contact.json');
    let contacts = [];
    try {
      const data = await fs.readFile(contactPath, 'utf8');
      contacts = JSON.parse(data);
    } catch (err) {
      // File doesn't exist
    }
    
    const newContact = {
      id: Date.now().toString(),
      name,
      email,
      phone: phone || 'Not provided',
      subject: subject || 'General Inquiry',
      message,
      submittedAt: new Date().toISOString()
    };
    
    contacts.push(newContact);
    await fs.writeFile(contactPath, JSON.stringify(contacts, null, 2));
    
    // Save to CSV
    const csvPath = path.join(__dirname, 'data', 'contact.csv');
    const csvLine = `${new Date().toISOString()},${name},${email},${phone || 'N/A'},${subject || 'General'},${message.replace(/,/g, ';')}\n`;
    await fs.appendFile(csvPath, csvLine).catch(() => {});

    // Send email notification to yourself
    if (process.env.MY_EMAIL && process.env.MY_PASS) {
      try {
        const contactInfo = await transporter.sendMail({
          from: `"Nyx AI Contact" <${process.env.MY_EMAIL}>`,
          to: process.env.MY_EMAIL,
          subject: `📬 New Contact Form: ${subject || 'General Inquiry'}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #e0e0e0; padding: 40px 20px; border-radius: 10px;">
              <h1 style="color: #667eea; text-align: center;">New Contact Form Submission</h1>
              
              <div style="background: #1a1a2e; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong style="color: #667eea;">Name:</strong> ${name}</p>
                <p><strong style="color: #667eea;">Email:</strong> ${email}</p>
                <p><strong style="color: #667eea;">Phone:</strong> ${phone || 'Not provided'}</p>
                <p><strong style="color: #667eea;">Subject:</strong> ${subject || 'General Inquiry'}</p>
                <p><strong style="color: #667eea;">Message:</strong></p>
                <p style="background: #16213e; padding: 15px; border-radius: 8px;">${message}</p>
                <p><strong style="color: #667eea;">Time:</strong> ${new Date().toLocaleString()}</p>
              </div>
            </div>
          `
        });
        console.log("✅ Contact form email sent to admin. Message ID:", contactInfo.messageId);
      } catch (emailError) {
        console.log('❌ Contact email failed:', emailError.message);
      }
    }

    res.json({ 
      success: true, 
      message: 'Message sent successfully!' 
    });
    
  } catch (error) {
    console.error('❌ Contact form error:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// ========== VIEW CONTACT SUBMISSIONS (Admin) ==========
app.get("/api/contact", async (req, res) => {
  try {
    const contactPath = path.join(__dirname, 'data', 'contact.json');
    let contacts = [];
    
    try {
      const data = await fs.readFile(contactPath, 'utf8');
      contacts = JSON.parse(data);
    } catch (err) {
      // No file yet
    }
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Nyx AI - Contact Submissions</title>
        <style>
          body { font-family: Arial; background: #0a0a0f; color: #e0e0e0; padding: 40px 20px; }
          .container { max-width: 1200px; margin: 0 auto; }
          h1 { color: #667eea; }
          .stats { margin: 20px 0; padding: 20px; background: #1a1a2e; border-radius: 10px; }
          table { width: 100%; border-collapse: collapse; background: #1a1a2e; border-radius: 10px; }
          th { background: #16213e; color: #667eea; padding: 15px; text-align: left; }
          td { padding: 12px 15px; border-bottom: 1px solid #2a2a3e; }
          .message-preview { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>📬 Contact Form Submissions</h1>
          <div class="stats">Total Submissions: ${contacts.length}</div>
          <table>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Subject</th>
              <th>Message</th>
            </tr>
            ${contacts.reverse().map(c => `
              <tr>
                <td>${new Date(c.submittedAt).toLocaleString()}</td>
                <td>${c.name}</td>
                <td>${c.email}</td>
                <td>${c.phone}</td>
                <td>${c.subject}</td>
                <td class="message-preview">${c.message.substring(0, 50)}${c.message.length > 50 ? '...' : ''}</td>
              </tr>
            `).join('')}
          </table>
        </div>
      </body>
      </html>
    `;
    
    res.send(html);
  } catch (error) {
    res.send('<h1>No submissions yet</h1>');
  }
});

// Your existing routes
app.get("/", (req, res) => {
  res.json({ message: "Nyx AI Backend is running 🚀" });
});

app.use("/api/summarize", summarizeRoute);
app.use("/api/chat", chatRoute);
app.use("/api/waitlist", waitlistRoute);

// ========== ERROR HANDLING ==========
// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;

// Create data directory if it doesn't exist (non-blocking)
fs.mkdir(path.join(__dirname, 'data'), { recursive: true }).catch(() => {});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📧 Test email: http://localhost:${PORT}/api/test-email`);
  console.log(`📧 Waitlist POST: http://localhost:${PORT}/api/waitlist`);
  console.log(`📊 Waitlist Admin: http://localhost:${PORT}/api/waitlist`);
  console.log(`📬 Contact POST: http://localhost:${PORT}/api/contact`);
  console.log(`📋 Contact Admin: http://localhost:${PORT}/api/contact`);
  console.log(`🩺 Health check: http://localhost:${PORT}/health`);
});