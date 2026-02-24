import express from "express";
import fs from "fs/promises";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure email transporter (using Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail from .env
    pass: process.env.EMAIL_PASS  // Your App Password from .env
  }
});

// Verify email connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email error:', error);
  } else {
    console.log('✅ Email server ready to send messages');
  }
});

// POST /api/waitlist - Join waitlist
router.post("/", async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' });
    }

    const userName = name || 'Future Nyx User';
    
    // Path to waitlist.json
    const waitlistPath = path.join(__dirname, '..', 'data', 'waitlist.json');
    
    // Ensure data directory exists
    try {
      await fs.mkdir(path.join(__dirname, '..', 'data'));
    } catch (err) {
      // Directory might already exist
    }
    
    // Read existing waitlist
    let users = [];
    try {
      const data = await fs.readFile(waitlistPath, 'utf8');
      users = JSON.parse(data);
    } catch (err) {
      // File doesn't exist, start with empty array
    }
    
    // Check if email exists
    if (users.some(user => user.email === email)) {
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
    
    // Also save to CSV for easy viewing
    const csvPath = path.join(__dirname, '..', 'data', 'waitlist.csv');
    const csvLine = `${new Date().toISOString()},${email},${userName}\n`;
    await fs.appendFile(csvPath, csvLine).catch(() => {});

    // 1. SEND WELCOME EMAIL TO USER
    const welcomeEmail = {
      from: `Nyx AI <${process.env.EMAIL_USER}>`,
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
            <h2 style="color: #667eea; margin-top: 0; font-size: 18px;">✨ What's included:</h2>
            <ul style="color: #e0e0e0; padding-left: 20px;">
              <li style="margin-bottom: 10px;">📝 AI Summarizer - Condense long texts</li>
              <li style="margin-bottom: 10px;">💻 Code Explainer - Understand programming</li>
              <li style="margin-bottom: 10px;">🃏 Flashcard Generator - Study smarter</li>
              <li style="margin-bottom: 10px;">✅ Grammar Checker - Perfect your writing</li>
              <li style="margin-bottom: 10px;">➕ And 20+ more tools!</li>
            </ul>
          </div>
          
          <div style="background: #16213e; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
            <p style="color: #e0e0e0; margin: 0;">Your spot on the waitlist:</p>
            <div style="font-size: 36px; font-weight: bold; color: #667eea; margin: 10px 0;">#${users.length}</div>
            <p style="color: #888; font-size: 14px; margin: 0;">Out of ${users.length} early adopters</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #e0e0e0;">Share with friends to move up the list!</p>
            <div style="margin-top: 15px;">
              <a href="#" style="display: inline-block; background: #1DA1F2; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin: 0 5px;">Twitter</a>
              <a href="#" style="display: inline-block; background: #0077B5; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin: 0 5px;">LinkedIn</a>
            </div>
          </div>
          
          <hr style="border: 1px solid #1a1a2e; margin: 30px 0;">
          
          <p style="color: #888; font-size: 12px; text-align: center;">
            You received this because you joined the Nyx AI waitlist at nyxai.com<br>
            If this wasn't you, please ignore this email.
          </p>
        </div>
      `
    };

    // 2. SEND NOTIFICATION TO YOURSELF
    const notificationEmail = {
      from: `Nyx AI <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Your email for notifications
      subject: '🎉 NEW WAITLIST SIGNUP!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #e0e0e0; padding: 40px 20px; border-radius: 10px;">
          <h1 style="color: #667eea; text-align: center; margin-bottom: 30px;">New User Joined! 🎉</h1>
          
          <div style="background: #1a1a2e; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong style="color: #667eea;">Email:</strong> ${email}</p>
            <p><strong style="color: #667eea;">Name:</strong> ${userName}</p>
            <p><strong style="color: #667eea;">Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong style="color: #667eea;">Total Signups:</strong> ${users.length}</p>
          </div>
          
          <div style="background: #16213e; padding: 20px; border-radius: 8px;">
            <h3 style="color: #667eea; margin-top: 0; font-size: 16px;">📋 Recent signups:</h3>
            <ul style="margin-top: 10px; padding-left: 20px;">
              ${users.slice(-5).reverse().map(u => `
                <li style="margin-bottom: 8px; color: #e0e0e0;">
                  ${u.email} - ${new Date(u.joinedAt).toLocaleString()}
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      `
    };

    // Send both emails
    try {
      await transporter.sendMail(welcomeEmail);
      console.log(`✅ Welcome email sent to ${email}`);
      
      await transporter.sendMail(notificationEmail);
      console.log(`📧 Notification sent to you`);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Still return success for the signup even if email fails
    }

    res.json({ 
      success: true, 
      message: 'Thanks for joining! Check your email for confirmation.' 
    });
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// GET /api/waitlist - View waitlist (simple admin page)
router.get("/", async (req, res) => {
  try {
    const waitlistPath = path.join(__dirname, '..', 'data', 'waitlist.json');
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
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0a0a0f; 
            color: #e0e0e0; 
            padding: 40px 20px;
          }
          .container { max-width: 1000px; margin: 0 auto; }
          h1 { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 20px;
          }
          .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
          }
          .stat-card {
            background: #1a1a2e;
            padding: 20px;
            border-radius: 10px;
            border: 1px solid #2a2a3e;
          }
          .stat-number {
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
          }
          .stat-label {
            color: #888;
            margin-top: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            background: #1a1a2e;
            border-radius: 10px;
            overflow: hidden;
            border: 1px solid #2a2a3e;
          }
          th {
            background: #16213e;
            color: #667eea;
            font-weight: 600;
            padding: 15px;
            text-align: left;
          }
          td {
            padding: 12px 15px;
            border-bottom: 1px solid #2a2a3e;
          }
          tr:last-child td { border-bottom: none; }
          .badge {
            background: #667eea20;
            color: #667eea;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            border: 1px solid #667eea40;
          }
          .export-btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            margin-bottom: 20px;
          }
          .export-btn:hover { background: #5a6fd8; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>📋 Nyx AI Waitlist Dashboard</h1>
          
          <div class="stats">
            <div class="stat-card">
              <div class="stat-number">${users.length}</div>
              <div class="stat-label">Total Signups</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${users.filter(u => u.name !== 'Future Nyx User').length}</div>
              <div class="stat-label">With Names</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${new Date().toLocaleDateString()}</div>
              <div class="stat-label">Last Updated</div>
            </div>
          </div>
          
          <button class="export-btn" onclick="exportCSV()">📥 Export to CSV</button>
          
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Email</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              ${users.map((user, index) => `
                <tr>
                  <td><span class="badge">${index + 1}</span></td>
                  <td>${new Date(user.joinedAt).toLocaleString()}</td>
                  <td>${user.email}</td>
                  <td>${user.name}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <script>
          function exportCSV() {
            const users = ${JSON.stringify(users)};
            const csv = ['Date,Email,Name'];
            users.forEach(u => {
              csv.push(\`"\${u.joinedAt}","\${u.email}","\${u.name}"\`);
            });
            
            const blob = new Blob([csv.join('\\n')], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'nyx-waitlist.csv';
            a.click();
          }
        </script>
      </body>
      </html>
    `;
    
    res.send(html);
  } catch (error) {
    res.status(500).send('Error loading waitlist');
  }
});

export default router;