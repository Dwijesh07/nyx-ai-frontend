import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [submitted, setSubmitted] = useState(false);
  
  // ADD THIS LINE:
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setMessage({ text: "Please fill in all required fields", type: "error" });
      setLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setMessage({ text: "Please enter a valid email", type: "error" });
      setLoading(false);
      return;
    }

    try {
      // CHANGE THIS LINE - use API_URL variable:
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setMessage({ 
          text: "✅ Message sent successfully! We'll get back to you soon.", 
          type: "success" 
        });
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
      } else {
        setMessage({ 
          text: data.error || "Something went wrong", 
          type: "error" 
        });
      }
    } catch (error) {
      setMessage({ 
        text: "Network error. Please try again.", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  // ... rest of your component remains exactly the same ...
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="section-container text-center">
          <div className="inline-block bg-accent-blue/20 text-accent-blue px-4 py-2 rounded-full text-sm font-semibold mb-6">
            📞 Get in Touch
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Contact Us
          </h2>
          
          <p className="text-xl text-body mb-8 max-w-3xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="premium-card p-8 interactive-glow">
            <h3 className="text-2xl font-bold mb-6 text-headline">Send us a Message</h3>

            {message.text && (
              <div className={`p-4 rounded-lg mb-6 ${
                message.type === "success" 
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" 
                  : "bg-red-500/20 text-red-300 border border-red-500/30"
              }`}>
                {message.text}
              </div>
            )}

            {submitted ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-6">✨</div>
                <h3 className="text-2xl font-bold mb-3 text-headline">Message Sent!</h3>
                <p className="text-body mb-6">
                  Thank you for reaching out. We'll get back to you within 24-48 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage({ text: "", type: "" });
                  }}
                  className="btn-secondary text-sm py-2 px-6"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-body mb-2">
                      Full Name <span className="text-accent-blue">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="input-field"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-body mb-2">
                      Email <span className="text-accent-blue">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="input-field"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-body mb-2">
                      Phone (optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+61 4XX XXX XXX"
                      className="input-field"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-body mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="General Inquiry"
                      className="input-field"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-body mb-2">
                    Message <span className="text-accent-blue">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    rows="6"
                    className="input-field resize-none"
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-3 text-lg interactive-glow"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="loading-spinner"></div>
                      Sending...
                    </span>
                  ) : (
                    "Send Message →"
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="premium-card p-8 interactive-glow">
              <h3 className="text-2xl font-bold mb-6 text-headline">Contact Information</h3>
              
              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="text-2xl text-accent-blue">📍</div>
                  <div>
                    <h4 className="font-semibold text-headline mb-2">Our Address</h4>
                    <p className="text-body">
                      24 Wakefield St<br />
                      SPW<br />
                      Hawthorn, VIC 3122<br />
                      Australia
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="text-2xl text-accent-blue">📧</div>
                  <div>
                    <h4 className="font-semibold text-headline mb-2">Email Us</h4>
                    <a 
                      href="mailto:adnyxaiau@gmail.com" 
                      className="text-body hover:text-accent-blue transition-colors"
                    >
                      adnyxaiau@gmail.com
                    </a>
                    <p className="text-sm text-body/60 mt-1">We reply within 24-48 hours</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="text-2xl text-accent-blue">📞</div>
                  <div>
                    <h4 className="font-semibold text-headline mb-2">Call Us</h4>
                    <p className="text-body">Coming Soon</p>
                    <p className="text-sm text-body/60 mt-1">Phone number will be available shortly</p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start gap-4">
                  <div className="text-2xl text-accent-blue">⏰</div>
                  <div>
                    <h4 className="font-semibold text-headline mb-2">Business Hours</h4>
                    <p className="text-body">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 2:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Preview */}
            <div className="premium-card p-6 interactive-glow">
              <h4 className="font-semibold text-headline mb-4">Find Us</h4>
              <div className="bg-primary-light/30 h-48 rounded-lg flex items-center justify-center text-body">
                <div className="text-center">
                  <div className="text-4xl mb-2">🗺️</div>
                  <p>Map coming soon</p>
                  <p className="text-sm text-body/60 mt-2">24 Wakefield St, SPW, Hawthorn VIC 3122</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="premium-card p-6 interactive-glow">
              <h4 className="font-semibold text-headline mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 rounded-full bg-primary-light/30 flex items-center justify-center text-2xl hover:text-accent-blue hover:bg-primary-light/50 transition-all">
                  𝕏
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-primary-light/30 flex items-center justify-center text-2xl hover:text-accent-blue hover:bg-primary-light/50 transition-all">
                  in
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-primary-light/30 flex items-center justify-center text-2xl hover:text-accent-blue hover:bg-primary-light/50 transition-all">
                  f
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-primary-light/30 flex items-center justify-center text-2xl hover:text-accent-blue hover:bg-primary-light/50 transition-all">
                  📷
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-container">
        <h2 className="text-3xl font-bold mb-8 text-center text-headline">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="premium-card p-6 interactive-glow">
            <h3 className="font-semibold mb-2 text-headline">How quickly do you respond?</h3>
            <p className="text-sm text-body">We aim to respond to all inquiries within 24-48 hours during business days.</p>
          </div>
          <div className="premium-card p-6 interactive-glow">
            <h3 className="font-semibold mb-2 text-headline">Do you offer phone support?</h3>
            <p className="text-sm text-body">Phone support is coming soon! For now, please email us and we'll get back to you promptly.</p>
          </div>
          <div className="premium-card p-6 interactive-glow">
            <h3 className="font-semibold mb-2 text-headline">Where are you located?</h3>
            <p className="text-sm text-body">We're based in Hawthorn, Melbourne. Our address is 24 Wakefield St, SPW, Hawthorn VIC 3122.</p>
          </div>
          <div className="premium-card p-6 interactive-glow">
            <h3 className="font-semibold mb-2 text-headline">Can I visit your office?</h3>
            <p className="text-sm text-body">Please contact us first to schedule an appointment. We'd love to meet you!</p>
          </div>
        </div>
      </section>
    </>
  );
}