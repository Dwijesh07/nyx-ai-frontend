import React from "react";
import { Link } from "react-router-dom";

export default function TermsAndConditions() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="section-container text-center">
          <div className="inline-block bg-accent-blue/20 text-accent-blue px-4 py-2 rounded-full text-sm font-semibold mb-6">
            📜 Legal
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Terms and Conditions
          </h2>
          
          <p className="text-xl text-body mb-8 max-w-3xl mx-auto">
            Please read these terms carefully before using Nyx AI.
          </p>

          <div className="inline-block premium-card px-6 py-3">
            <span className="text-sm text-body">
              Last Updated: February 24, 2026
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-container">
        <div className="max-w-4xl mx-auto">
          <div className="premium-card p-8 md:p-12 interactive-glow">
            
            {/* Agreement to Terms */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-headline">1. Agreement to Terms</h3>
              <p className="text-body mb-4">
                By accessing or using Nyx AI ("the Service"), you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access the Service.
              </p>
              <p className="text-body">
                These terms apply to all users of the Service, including but not limited to students, tutors, and visitors.
              </p>
            </div>

            {/* Description of Service */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-headline">2. Description of Service</h3>
              <p className="text-body mb-4">
                Nyx AI provides AI-powered educational tools including but not limited to:
              </p>
              <ul className="list-disc list-inside text-body space-y-2 mb-4">
                <li>Text summarization and paraphrasing</li>
                <li>Grammar checking and improvement</li>
                <li>Code explanation and debugging assistance</li>
                <li>Flashcard and quiz generation</li>
                <li>Study notes and outline creation</li>
                <li>AI chat assistance for learning</li>
              </ul>
              <p className="text-body">
                We reserve the right to modify, suspend, or discontinue any part of the Service at any time without notice.
              </p>
            </div>

            {/* User Accounts */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-headline">3. User Accounts</h3>
              <p className="text-body mb-4">
                To access certain features, you may need to create an account. You are responsible for:
              </p>
              <ul className="list-disc list-inside text-body space-y-2 mb-4">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Providing accurate and complete information</li>
              </ul>
              <p className="text-body">
                We reserve the right to suspend or terminate accounts that violate these terms.
              </p>
            </div>

            {/* Subscription and Payments */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-headline">4. Subscription and Payments</h3>
              <p className="text-body mb-4">
                <span className="text-accent-blue font-semibold">Free Tier:</span> Basic features are available at no cost.
              </p>
              <p className="text-body mb-4">
                <span className="text-accent-blue font-semibold">Premium Tier:</span> Advanced features require a paid subscription.
              </p>
              <ul className="list-disc list-inside text-body space-y-2 mb-4">
                <li>Subscriptions are billed monthly or annually</li>
                <li>Payments are non-refundable except as required by law</li>
                <li>We may change prices with 30 days notice</li>
                <li>You can cancel anytime through your account settings</li>
              </ul>
            </div>

            {/* Acceptable Use */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-headline">5. Acceptable Use Policy</h3>
              <p className="text-body mb-4">You agree NOT to use Nyx AI to:</p>
              <ul className="list-disc list-inside text-body space-y-2 mb-4">
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Submit false or misleading information</li>
                <li>Attempt to bypass our security measures</li>
                <li>Use the Service for cheating or academic dishonesty</li>
                <li>Harass, abuse, or harm others</li>
                <li>Upload malicious code or viruses</li>
                <li>Scrape or data-mine the Service</li>
              </ul>
              <p className="text-body">
                We reserve the right to review and remove any content that violates these terms.
              </p>
            </div>

            {/* Intellectual Property */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-headline">6. Intellectual Property Rights</h3>
              <p className="text-body mb-4">
                The Service and its original content, features, and functionality are owned by Nyx AI and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p className="text-body">
                Our name, logo, and all related graphics are trademarks of Nyx AI. You may not use them without prior written permission.
              </p>
            </div>

            {/* User Content */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-headline">7. Your Content</h3>
              <p className="text-body mb-4">
                By submitting content to Nyx AI, you grant us a non-exclusive, royalty-free license to use, store, and process that content solely for the purpose of providing the Service to you.
              </p>
              <p className="text-body mb-4">
                You retain all ownership rights to your content. We do not claim ownership over any content you submit.
              </p>
            </div>

            {/* Privacy */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-headline">8. Privacy</h3>
              <p className="text-body mb-4">
                Your use of Nyx AI is also governed by our Privacy Policy. Please review our <Link to="/privacy" className="text-accent-blue hover:underline">Privacy Policy</Link> to understand our practices.
              </p>
            </div>

            {/* Third-Party Links */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-headline">9. Third-Party Links</h3>
              <p className="text-body">
                Our Service may contain links to third-party websites or services that are not owned or controlled by Nyx AI. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites.
              </p>
            </div>

            {/* Termination */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-headline">10. Termination</h3>
              <p className="text-body mb-4">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including without limitation if you breach the Terms.
              </p>
              <p className="text-body">
                Upon termination, your right to use the Service will immediately cease. You may simply discontinue using the Service if you wish to terminate.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-headline">11. Limitation of Liability</h3>
              <p className="text-body mb-4">
                To the maximum extent permitted by law, Nyx AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc list-inside text-body space-y-2 mb-4">
                <li>Your use or inability to use the Service</li>
                <li>Any unauthorized access to or use of our servers</li>
                <li>Any interruption or cessation of transmission</li>
                <li>Any bugs, viruses, or the like</li>
              </ul>
            </div>

            {/* Disclaimer of Warranties */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-headline">12. Disclaimer of Warranties</h3>
              <p className="text-body mb-4">
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Nyx AI makes no representations or warranties of any kind, express or implied, regarding the operation or availability of the Service.
              </p>
              <p className="text-body">
                We do not guarantee that the Service will be error-free, secure, or uninterrupted, or that any defects will be corrected.
              </p>
            </div>

            {/* Governing Law */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-headline">13. Governing Law</h3>
              <p className="text-body">
                These Terms shall be governed and construed in accordance with the laws of Victoria, Australia, without regard to its conflict of law provisions.
              </p>
            </div>

            {/* Changes to Terms */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-headline">14. Changes to Terms</h3>
              <p className="text-body mb-4">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
              </p>
              <p className="text-body">
                By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </div>

            {/* Contact Information */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-headline">15. Contact Us</h3>
              <p className="text-body mb-4">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="bg-primary-light/30 p-6 rounded-lg">
                <p className="text-body mb-2">
                  <span className="text-accent-blue font-semibold">Email:</span>{' '}
                  <a href="mailto:adnyxaiau@gmail.com" className="hover:text-accent-blue transition-colors">
                    adnyxaiau@gmail.com
                  </a>
                </p>
                <p className="text-body mb-2">
                  <span className="text-accent-blue font-semibold">Address:</span>{' '}
                  24 Wakefield St, SPW, Hawthorn VIC 3122, Australia
                </p>
              </div>
            </div>

            {/* Acknowledgement */}
            <div className="border-t border-primary-light/30 pt-8 mt-8">
              <p className="text-body text-sm italic">
                By using Nyx AI, you acknowledge that you have read and understood these Terms and Conditions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}