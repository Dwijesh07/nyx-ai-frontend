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

// Load .env
const envPath = path.resolve(__dirname, '.env');
console.log("Loading .env from:", envPath);

// Check if file exists
try {
  await fs.access(envPath);
  console.log("✅ .env file found");
} catch {
  console.log("❌ .env file NOT found at:", envPath);
}

// Load .env
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.log("❌ Error loading .env:", result.error.message);
} else {
  console.log("✅ .env loaded successfully");
}

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

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
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

// ========== WAITLIST ENDPOINT ==========
app.post("/api/waitlist", async (req, res) => {
  console.log("\n📝 NEW WAITLIST SUBMISSION");
  console.log("Request body:", req.body);
  
  try {
    const { email, name } = req.body;
    console.log("Email:", email);
    console.log("Name:", name);
    
    if (!email || !email.includes('@')) {
      console.log("❌ Invalid email");
      return res.status(400).json({ error: 'Valid email required' });
    }

    const userName = name || 'Future Nyx User';
    console.log("User name set to:", userName);
    
    // Ensure data directory exists
    const dataDir = path.join(__dirname, 'data');
    await fs.mkdir(dataDir, { recursive: true });
    console.log("✅ Data directory ready");
    
    // Read existing waitlist
    const waitlistPath = path.join(dataDir, 'waitlist.json');
    let users = [];
    try {
      const data = await fs.readFile(waitlistPath, 'utf8');
      users = JSON.parse(data);
      console.log(`📊 Existing users: ${users.length}`);
    } catch (err) {
      console.log("📂 New waitlist file will be created");
    }
    
    // Check if email exists
    if (users.some(user => user.email === email)) {
      console.log("❌ Email already exists:", email);
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Add to waitlist
    const newUser = {
      email,
      name: userName,
      joinedAt: new Date().toISOString(),
      id: Date.now().toString()
    };
    
    users.push(newUser);
    await fs.writeFile(waitlistPath, JSON.stringify(users, null, 2));
    console.log("✅ User saved to waitlist.json");
    
    // Save to CSV
    const csvPath = path.join(dataDir, 'waitlist.csv');
    const csvLine = `${new Date().toISOString()},${email},${userName}\n`;
    await fs.appendFile(csvPath, csvLine).catch(() => {});
    console.log("✅ User saved to waitlist.csv");

    if (process.env.MY_EMAIL && process.env.MY_PASS) {
      console.log("📧 Attempting to send welcome email to:", email);
      
      // 1. Send welcome email to user
      try {
        console.log("Preparing welcome email...");
        const welcomeResult = await transporter.sendMail({
          from: `Nyx AI <${process.env.MY_EMAIL}>`,
          to: email,
          subject: '🎉 Welcome to Nyx AI Waitlist!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #e0e0e0; padding: 40px 20px; border-radius: 10px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #667eea; margin: 0;">Welcome to Nyx AI!</h1>
                <p style="color: #888; margin-top: 10px;">Your AI-powered study companion</p>
              </div>
              
              <p style="font-size: 16px; line-height: 1.6;">Hi ${userName}! 👋</p>
              
              <p style="font-size: 16px; line-height: 1.6;">Thanks for joining the waitlist! You're now part of an exclusive group of early adopters who will get first access to our AI-powered tools for students.</p>
              
              <div style="background: #1a1a2e; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <h2 style="color: #667eea; margin-top: 0; font-size: 18px;">✨ What's coming:</h2>
                <ul style="color: #e0e0e0; padding-left: 20px;">
                  <li style="margin-bottom: 10px;">📝 AI Summarizer</li>
                  <li style="margin-bottom: 10px;">💻 Code Explainer</li>
                  <li style="margin-bottom: 10px;">🃏 Flashcard Generator</li>
                  <li style="margin-bottom: 10px;">✅ Grammar Checker</li>
                  <li style="margin-bottom: 10px;">➕ And 20+ more tools!</li>
                </ul>
              </div>
              
              <div style="background: #16213e; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
                <p style="color: #e0e0e0; margin: 0;">Your spot on the waitlist:</p>
                <div style="font-size: 36px; font-weight: bold; color: #667eea; margin: 10px 0;">#${users.length}</div>
              </div>
              
              <hr style="border: 1px solid #1a1a2e; margin: 30px 0;">
              <p style="color: #888; font-size: 12px; text-align: center;">You received this because you joined the Nyx AI waitlist.</p>
            </div>
          `
        });
        console.log("✅ Welcome email sent successfully!");
      } catch (emailError) {
        console.log('❌ Welcome email failed:', emailError.message);
      }

      // 2. Send notification to yourself
      try {
        console.log("📧 Attempting to send notification to admin:", process.env.MY_EMAIL);
        
        await transporter.sendMail({
          from: `Nyx AI <${process.env.MY_EMAIL}>`,
          to: process.env.MY_EMAIL,
          subject: '🎉 NEW WAITLIST SIGNUP!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #e0e0e0; padding: 40px 20px; border-radius: 10px;">
              <h1 style="color: #667eea; text-align: center;">New User Joined! 🎉</h1>
              <div style="background: #1a1a2e; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Name:</strong> ${userName}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Total Signups:</strong> ${users.length}</p>
              </div>
            </div>
          `
        });
        console.log("✅ Notification email sent successfully!");
      } catch (notifyError) {
        console.log('❌ Notification email failed:', notifyError.message);
      }
    }

    console.log("✅ Sending success response to client");
    res.json({ 
      success: true, 
      message: 'Thanks for joining! Check your email for confirmation.' 
    });
    
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
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

    // Ensure data directory exists
    const dataDir = path.join(__dirname, 'data');
    await fs.mkdir(dataDir, { recursive: true });
    
    // Save to JSON file
    const contactPath = path.join(dataDir, 'contact.json');
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
    const csvPath = path.join(dataDir, 'contact.csv');
    const csvLine = `${new Date().toISOString()},${name},${email},${phone || 'N/A'},${subject || 'General'},${message.replace(/,/g, ';')}\n`;
    await fs.appendFile(csvPath, csvLine).catch(() => {});

    // Send email notification to yourself
    if (process.env.MY_EMAIL && process.env.MY_PASS) {
      try {
        await transporter.sendMail({
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
        console.log("✅ Contact form email sent to admin");
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📧 Test email: http://localhost:${PORT}/api/test-email`);
  console.log(`📧 Waitlist POST: http://localhost:${PORT}/api/waitlist`);
  console.log(`📊 Waitlist Admin: http://localhost:${PORT}/api/waitlist`);
  console.log(`📬 Contact POST: http://localhost:${PORT}/api/contact`);
  console.log(`📋 Contact Admin: http://localhost:${PORT}/api/contact`);
});