import React from "react";
import { useNavigate } from "react-router-dom";

export default function Pricing() {
  const navigate = useNavigate();

  const handleSubscribe = (plan) => {
    navigate(`/account?plan=${plan}`);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="section-container text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-body mb-8 max-w-3xl mx-auto">
            Choose the perfect plan for your needs. No hidden fees, cancel anytime. 
            Get access to our complete suite of AI-powered tools.
          </p>
          <div className="inline-block premium-card px-6 py-3 interactive-glow">
            <span className="text-sm font-semibold text-accent-blue">30-day guarantee • No credit card required • 25+ AI tools</span>
          </div>
        </div>
      </section>

      {/* Main Pricing Section */}
      <section className="section-container">
        {/* Features Grid */}
        <div className="premium-card p-8 mb-10 interactive-glow">
          <h2 className="text-2xl font-bold mb-6 text-center text-headline">Everything You Get with Nyx AI</h2>
          <p className="text-body mb-8 text-center">All plans include these core features</p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="tool-card interactive-glow">
              <div>🤖</div>
              <div className="font-semibold text-headline">Nyx AI Chat</div>
              <p className="text-xs mt-1 text-body">Unlimited conversations</p>
            </div>

            <div className="tool-card interactive-glow">
              <div>📚</div>
              <div className="font-semibold text-headline">25+ Study Tools</div>
              <p className="text-xs mt-1 text-body">Summaries to flashcards</p>
            </div>

            <div className="tool-card interactive-glow">
              <div>💼</div>
              <div className="font-semibold text-headline">Professional Tools</div>
              <p className="text-xs mt-1 text-body">Documents & analysis</p>
            </div>

            <div className="tool-card interactive-glow">
              <div>🔒</div>
              <div className="font-semibold text-headline">Privacy First</div>
              <p className="text-xs mt-1 text-body">Protected and secure</p>
            </div>

            <div className="tool-card interactive-glow">
              <div>🌐</div>
              <div className="font-semibold text-headline">24/7 Access</div>
              <p className="text-xs mt-1 text-body">Always available</p>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <div className="pricing-card interactive-glow">
            <div className="pricing-card-header text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 text-headline">Free Plan</h3>
              <p className="text-body text-sm">12 Essential AI Tools</p>
            </div>
            
            <div className="pricing-price text-center mb-8">
              <span className="text-5xl font-bold text-headline">$0</span>
              <span className="text-body ml-2">/forever</span>
            </div>

            <button 
              onClick={() => navigate("/tools")}
              className="btn-secondary w-full mb-8 interactive-glow"
            >
              Start Free
            </button>

            <div className="space-y-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-emerald-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-body">Unlimited AI Chat</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-emerald-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-body">12 Core AI Tools</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-emerald-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-body">Text, URL & File support</span>
              </div>
              <div className="flex items-center opacity-50">
                <svg className="w-5 h-5 text-primary-light mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-body">13 Premium Tools</span>
              </div>
            </div>
          </div>

          {/* Premium Monthly - Featured */}
          <div className="pricing-card featured interactive-glow">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-accent-blue to-accent-blue-dark text-white 
                              px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>
            <div className="pricing-card-header text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 text-headline">Premium Monthly</h3>
              <p className="text-body text-sm">All 25+ AI Tools</p>
            </div>
            
            <div className="pricing-price text-center mb-8">
              <span className="text-5xl font-bold text-headline">$9.99</span>
              <span className="text-body ml-2">/month</span>
            </div>

            <button 
              onClick={() => handleSubscribe('monthly')}
              className="btn-primary w-full mb-8 interactive-glow"
            >
              Get All 25+ Tools
            </button>

            <div className="space-y-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-accent-blue mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-body"><strong>Everything in Free Plan</strong></span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-accent-blue mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-body">All 25+ AI Tools</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-accent-blue mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-body">8 Discipline Tools</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-accent-blue mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-body">Priority support</span>
              </div>
            </div>
          </div>

          {/* Premium Yearly */}
          <div className="pricing-card interactive-glow">
            <div className="pricing-card-header text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 text-headline">Premium Yearly</h3>
              <p className="text-body text-sm">Best Value • Save 17%</p>
            </div>
            
            <div className="pricing-price text-center mb-8">
              <span className="text-5xl font-bold text-headline">$99.99</span>
              <span className="text-body ml-2">/year</span>
              <div className="text-sm text-emerald-400 font-medium mt-2">Save $20 annually</div>
            </div>

            <button 
              onClick={() => handleSubscribe('yearly')}
              className="btn-secondary w-full mb-8 interactive-glow"
            >
              Save 17% Yearly
            </button>

            <div className="space-y-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-accent-blue mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-body"><strong>Everything in Monthly</strong></span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-accent-blue mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-body">Code Explainer</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-accent-blue mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-body">Legal & Medical tools</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-accent-blue mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-body">AI Tutor & Research</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="premium-card p-8 mt-12 interactive-glow">
          <h2 className="text-2xl font-bold mb-6 text-center text-headline">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-primary-light/30 rounded-lg">
              <h3 className="font-semibold mb-2 text-headline">Can I cancel anytime?</h3>
              <p className="text-body text-sm">Yes, cancel any time. No questions asked.</p>
            </div>
            <div className="p-4 bg-primary-light/30 rounded-lg">
              <h3 className="font-semibold mb-2 text-headline">Do you offer student discounts?</h3>
              <p className="text-body text-sm">Yes! Students get 50% off all paid plans.</p>
            </div>
            <div className="p-4 bg-primary-light/30 rounded-lg">
              <h3 className="font-semibold mb-2 text-headline">What payment methods?</h3>
              <p className="text-body text-sm">Credit cards, PayPal, bank transfers.</p>
            </div>
            <div className="p-4 bg-primary-light/30 rounded-lg">
              <h3 className="font-semibold mb-2 text-headline">Is there a free trial?</h3>
              <p className="text-body text-sm">Free plan has 12 essential AI tools.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-accent-blue/10 to-accent-blue/5 border border-accent-blue/30 
                        text-white mt-12 py-12 text-center rounded-xl interactive-glow">
          <h2 className="text-3xl font-bold mb-4 text-headline">Ready to Access All 25+ AI Tools?</h2>
          <p className="mb-6 text-body">Join thousands using Nyx AI to save time</p>
          <button
            onClick={() => navigate("/pricing#Premium Monthly")}
            className="btn-primary text-lg interactive-glow"
          >
            Choose Your Plan Now
          </button>
          <p className="mt-4 text-sm text-body">No credit card required for free plan</p>
        </div>
      </section>
    </>
  );
}