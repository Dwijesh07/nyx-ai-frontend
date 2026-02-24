import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [joined, setJoined] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    // Basic validation
    if (!email) {
      setMessage({ text: "Email is required", type: "error" });
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setMessage({ text: "Please enter a valid email", type: "error" });
      setLoading(false);
      return;
    }

    const payload = { 
      email: email.trim(), 
      name: name.trim() || "Anonymous" 
    };

    try {
      const response = await fetch("http://nyxai.pxxl.click/api/waitlist", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      let data;
      const responseText = await response.text();
      
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        data = { error: "Server returned invalid response" };
      }

      if (response.ok) {
        setJoined(true);
        setMessage({ 
          text: "✅ Success! Check your email for confirmation.", 
          type: "success" 
        });
      } else {
        setMessage({ 
          text: data.error || `Error ${response.status}: Please try again`, 
          type: "error" 
        });
      }
    } catch (error) {
      setMessage({ 
        text: `Connection error. Please try again.`, 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="section-container text-center">
          {/* Early Access Badge */}
          <div className="inline-block bg-accent-blue/20 text-accent-blue px-4 py-2 rounded-full text-sm font-semibold mb-6">
            🚀 Early Access • Limited Spots
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            {!joined ? "Get Early Access to Nyx AI" : "You're on the List! 🎉"}
          </h2>
          
          <p className="text-xl text-body mb-8 max-w-3xl mx-auto">
            {!joined 
              ? "Be among the first to try 25+ AI-powered study tools. Free during beta." 
              : "Thanks for joining! We'll notify you when we launch."
            }
          </p>

          {/* Social Proof */}
          {!joined && (
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex -space-x-2">
                {[1,2,3,4].map((i) => (
                  <div 
                    key={i} 
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple border-2 border-primary-dark"
                  ></div>
                ))}
              </div>
              <p className="text-body">
                <span className="text-headline font-semibold">100+</span> students already joined
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Form Side */}
          <div className="premium-card p-8 interactive-glow">
            {!joined ? (
              <>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2 text-headline">
                    Join the Waitlist
                  </h3>
                  <p className="text-body">
                    Get notified when we launch. No spam, just one email.
                  </p>
                </div>

                {message.text && (
                  <div className={`p-4 rounded-lg mb-6 ${
                    message.type === "success" 
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" 
                      : "bg-red-500/20 text-red-300 border border-red-500/30"
                  }`}>
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-body mb-2">
                      Full Name <span className="text-body/60">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="input-field"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-body mb-2">
                      Email Address <span className="text-accent-blue">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="input-field"
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
                        Joining...
                      </span>
                    ) : (
                      "Join Waitlist →"
                    )}
                  </button>

                  <p className="text-xs text-body/60 text-center">
                    By joining, you'll be first to know when we launch
                  </p>
                </form>
              </>
            ) : (
              // Success State
              <div className="text-center py-8">
                <div className="text-6xl mb-6">✨</div>
                <h3 className="text-2xl font-bold mb-3 text-headline">
                  You're on the list!
                </h3>
                <p className="text-body mb-4">
                  We sent a confirmation to <br />
                  <span className="text-accent-blue font-semibold">{email}</span>
                </p>
                <div className="bg-primary-light/30 p-4 rounded-lg mb-6">
                  <p className="text-sm text-body">
                    <span className="text-headline font-semibold">What's next?</span><br />
                    We'll email you when Nyx AI launches. Early access means free during beta!
                  </p>
                </div>
                <button
                  onClick={() => navigate("/")}
                  className="btn-secondary text-sm py-2 px-6"
                >
                  Back to Home
                </button>
              </div>
            )}

            {/* Bonus: Referral area */}
            {!joined && (
              <div className="mt-8 pt-6 border-t border-primary-light/30">
                <p className="text-xs text-body/60 text-center">
                  🔗 Share with friends to move up the list
                </p>
              </div>
            )}
          </div>

          {/* Info Side - Benefits */}
          <div className="premium-card p-8 interactive-glow">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2 text-headline">Why Join Early?</h3>
              <p className="text-body">What you get as an early adopter</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-primary-light/30 rounded-lg">
                <div className="text-2xl">🎁</div>
                <div>
                  <h4 className="font-semibold mb-1 text-headline">Free During Beta</h4>
                  <p className="text-sm text-body">All 25+ tools free while we build</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-primary-light/30 rounded-lg">
                <div className="text-2xl">⚡</div>
                <div>
                  <h4 className="font-semibold mb-1 text-headline">Early Feature Access</h4>
                  <p className="text-sm text-body">Try new tools before anyone else</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-primary-light/30 rounded-lg">
                <div className="text-2xl">💬</div>
                <div>
                  <h4 className="font-semibold mb-1 text-headline">Shape the Product</h4>
                  <p className="text-sm text-body">Your feedback directly influences development</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-primary-light/30 rounded-lg">
                <div className="text-2xl">💰</div>
                <div>
                  <h4 className="font-semibold mb-1 text-headline">Lifetime Discount</h4>
                  <p className="text-sm text-body">Early users get special pricing forever</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-primary-light/30 rounded-lg">
                <div className="text-2xl">🚀</div>
                <div>
                  <h4 className="font-semibold mb-1 text-headline">Priority Support</h4>
                  <p className="text-sm text-body">Direct line to the founders</p>
                </div>
              </div>
            </div>

            {/* Launch Timeline */}
            <div className="mt-8 p-4 bg-accent-blue/10 border border-accent-blue/30 rounded-lg">
              <h4 className="font-semibold mb-3 text-headline">📅 Launch Timeline</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-sm text-body">Beta Launch: Coming soon</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent-blue rounded-full"></div>
                  <span className="text-sm text-body">Early access emails sent</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent-blue rounded-full"></div>
                  <span className="text-sm text-body">Full public launch: TBD</span>
                </div>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="mt-6 text-center">
              <p className="text-xs text-body/40">
                🔒 No spam • Unsubscribe anytime • 100+ early adopters
              </p>
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
            <h3 className="font-semibold mb-2 text-headline">When will Nyx AI launch?</h3>
            <p className="text-sm text-body">We're launching beta soon. Early access users will be first to know!</p>
          </div>
          <div className="premium-card p-6 interactive-glow">
            <h3 className="font-semibold mb-2 text-headline">Is it really free?</h3>
            <p className="text-sm text-body">Yes! All tools are free during beta. Early adopters get special pricing later.</p>
          </div>
          <div className="premium-card p-6 interactive-glow">
            <h3 className="font-semibold mb-2 text-headline">What tools are included?</h3>
            <p className="text-sm text-body">25+ tools including summarizer, code explainer, flashcards, and more.</p>
          </div>
          <div className="premium-card p-6 interactive-glow">
            <h3 className="font-semibold mb-2 text-headline">How will I know when you launch?</h3>
            <p className="text-sm text-body">We'll email you at the address you provide. No spam, promise!</p>
          </div>
        </div>
      </section>
    </>
  );
}