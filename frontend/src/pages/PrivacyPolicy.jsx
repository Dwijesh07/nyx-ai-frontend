import React from "react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="section-container text-center">
          <div className="inline-block bg-accent-blue/20 text-accent-blue px-4 py-2 rounded-full text-sm font-semibold mb-6">
            🔒 Privacy
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Privacy Policy
          </h2>
          
          <p className="text-xl text-body mb-8 max-w-3xl mx-auto">
            How we collect, use, and protect your data in compliance with Australian law
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
            
            {/* Introduction */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-headline">1. Introduction</h3>
              <p className="text-body mb-4">
                At Nyx AI ("we," "our," or "us"), we respect your privacy and are committed to protecting your personal data in accordance with the <span className="text-accent-blue font-semibold">Privacy Act 1988 (Cth)</span> and the Australian Privacy Principles (APPs).
              </p>
              <p className="text-body">
                Please read this policy carefully. By accessing or using our Service, you acknowledge that you have read and understood this Privacy Policy.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-headline">2. Information We Collect</h3>
              
              <h4 className="text-xl font-semibold mb-3 text-headline">2.1 Personal Information</h4>
              <p className="text-body mb-4">As defined under Australian law, we may collect the following personal information:</p>
              <ul className="list-disc list-inside text-body space-y-2 mb-4">
                <li>Name and contact information (email address, phone number)</li>
                <li>Account credentials (username and password)</li>
                <li>Billing and payment information (processed securely through third-party providers)</li>
                <li>Profile information and preferences</li>
                <li>Student status and educational background (if provided)</li>
              </ul>

              <h4 className="text-xl font-semibold mb-3 text-headline">2.2 Usage Data</h4>
              <p className="text-body mb-4">We automatically collect certain information when you use our Service:</p>
              <ul className="list-disc list-inside text-body space-y-2 mb-4">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent on pages</li>
                <li>Features used and interactions</li>
                <li>Search queries and content submitted</li>
              </ul>

              <h4 className="text-xl font-semibold mb-3 text-headline">2.3 Cookies and Tracking</h4>
              <p className="text-body">
                We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. Under Australian law, we obtain your consent where required.
              </p>
            </div>

            {/* How We Use Your Information */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-headline">3. How We Use Your Information</h3>
              <p className="text-body mb-4">We use the information we collect for various purposes, in compliance with Australian Privacy Principles:</p>
              <ul className="list-disc list-inside text-body space-y-2 mb-4">
                <li>To provide and maintain our Service</li>
                <li>To improve, personalize, and expand our Service</li>
                <li>To process your transactions and manage your account</li>
                <li>To communicate with you about updates, offers, and support</li>
                <li>To analyze usage patterns and optimize user experience</li>
                <li>To detect, prevent, and address technical issues</li>
                <li>To comply with legal obligations under Australian law</li>
              </ul>
            </div>

            {/* AI and Data Processing */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-headline">4. AI and Data Processing</h3>
              <p className="text-body mb-4">
                Nyx AI uses artificial intelligence to provide our services. When you submit content to our AI tools:
              </p>
              <ul className="list-disc list-inside text-body space-y-2 mb-4">
                <li>Your content is processed by our AI models to generate responses</li>
                <li>We may use de-identified data to improve our AI models</li>
                <li>We do not use your personal content to train AI models for other users</li>
                <li>You retain ownership of your content</li>
              </ul>
              <p className="text-body">
                For more information about how we handle your content, please see our <Link to="/terms" className="text-accent-blue hover:underline">Terms and Conditions</Link>.
              </p>
            </div>

            {/* Disclosure of Personal Information */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-headline">5. Disclosure of Personal Information</h3>
              <p className="text-body mb-4">We may disclose your personal information in the following circumstances, in accordance with APP 6:</p>
              
              <h4 className="text-xl font-semibold mb-3 text-headline">5.1 Service Providers</h4>
              <p className="text-body mb-4">
                We may engage third-party companies to facilitate our Service, provide services on our behalf, or assist us in analyzing how our Service is used. These third parties have access to your personal information only to perform these tasks and are contractually obligated not to disclose or use it for any other purpose.
              </p>

              <h4 className="text-xl font-semibold mb-3 text-headline">5.2 Legal Requirements</h4>
              <p className="text-body mb-4">
                We may disclose your information if required to do so by Australian law or in response to a valid request by an Australian court, law enforcement agency, or other government authority.
              </p>

              <h4 className="text-xl font-semibold mb-3 text-headline">5.3 Business Transfers</h4>
              <p className="text-body">
                If we are involved in a merger, acquisition, or asset sale, your personal information may be transferred. We will provide notice before your personal information becomes subject to a different privacy policy.
              </p>
            </div>

            {/* Overseas Disclosure */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-headline">6. Overseas Disclosure</h3>
              <p className="text-body mb-4">
                In providing our services, your personal information may be transferred to, and stored on, servers located outside of Australia, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-body space-y-2 mb-4">
                <li>United States (for AI processing via Groq)</li>
                <li>Various locations for cloud infrastructure</li>
              </ul>
              <p className="text-body">
                By providing your personal information to us, you consent to this overseas disclosure. We take reasonable steps to ensure that any overseas recipient complies with the Australian Privacy Principles or is subject to a similar privacy regime.
              </p>
            </div>

            {/* Data Security */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-headline">7. Data Security</h3>
              <p className="text-body mb-4">
                We take reasonable steps to protect your personal information from misuse, interference, loss, unauthorized access, modification, or disclosure, in accordance with APP 11. These steps include:
              </p>
              <ul className="list-disc list-inside text-body space-y-2 mb-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and monitoring</li>
                <li>Access controls and authentication procedures</li>
                <li>Secure data storage on Australian and international servers</li>
                <li>Staff training on privacy obligations</li>
              </ul>
              <p className="text-body">
                However, no method of transmission over the Internet or method of electronic storage is 100% secure. If we become aware of a data breach that is likely to result in serious harm, we will notify you and the Office of the Australian Information Commissioner (OAIC) as required by the Notifiable Data Breaches scheme.
              </p>
            </div>

            {/* Data Retention and Destruction */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-headline">8. Data Retention and Destruction</h3>
              <p className="text-body mb-4">
                We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy, or as required by Australian law. When personal information is no longer needed, we take reasonable steps to destroy or de-identify it.
              </p>
              <p className="text-body">
                If you delete your account, we will delete or anonymize your personal information within 30 days, except where we are required to retain it for legal or business purposes.
              </p>
            </div>

            {/* Access and Correction */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-headline">9. Access and Correction</h3>
              <p className="text-body mb-4">
                Under Australian Privacy Principle 12 and 13, you have the right to:
              </p>
              <ul className="list-disc list-inside text-body space-y-2 mb-4">
                <li><span className="text-accent-blue font-semibold">Access:</span> Request access to the personal information we hold about you</li>
                <li><span className="text-accent-blue font-semibold">Correction:</span> Request correction of inaccurate or outdated information</li>
              </ul>
              <p className="text-body">
                To exercise these rights, please contact us using the details below. We will respond to your request within 30 days, as required by Australian law.
              </p>
            </div>

            {/* Making a Complaint */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-headline">10. Making a Complaint</h3>
              <p className="text-body mb-4">
                If you believe we have breached the Australian Privacy Principles or this Privacy Policy, please contact us to discuss your concerns. We will investigate and respond to your complaint within a reasonable period.
              </p>
              <p className="text-body mb-4">
                If you are not satisfied with our response, you may make a complaint to the Office of the Australian Information Commissioner (OAIC):
              </p>
              <div className="bg-primary-light/30 p-4 rounded-lg mb-4">
                <p className="text-body text-sm">
                  <strong>OAIC Website:</strong> www.oaic.gov.au<br />
                  <strong>Phone:</strong> 1300 363 992<br />
                  <strong>Email:</strong> enquiries@oaic.gov.au
                </p>
              </div>
            </div>

            {/* Children's Privacy */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-headline">11. Children's Privacy</h3>
              <p className="text-body mb-4">
                Our Service is intended for use by students of all ages, but we require users under 18 to have parental consent. We do not knowingly collect personal information from children under 13 without parental consent. If we become aware that a child under 13 has provided us with personal information without parental consent, we will take steps to delete such information.
              </p>
              <p className="text-body">
                If you are a parent or guardian and you believe your child has provided us with personal information without your consent, please contact us.
              </p>
            </div>

            {/* Anonymity and Pseudonymity */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-headline">12. Anonymity and Pseudonymity</h3>
              <p className="text-body">
                Where practicable, you have the option to deal with us anonymously or using a pseudonym. However, for most of our services, we require your name and contact information to provide you with access to your account and personalized features.
              </p>
            </div>

            {/* Third-Party Services */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-headline">13. Third-Party Services</h3>
              <p className="text-body mb-4">
                Our Service may contain links to third-party websites or services. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services.
              </p>
              <p className="text-body">
                We use the following third-party services, which have their own privacy policies:
              </p>
              <ul className="list-disc list-inside text-body space-y-2 mt-4">
                <li>Google Analytics (analytics)</li>
                <li>Stripe/PayPal (payment processing)</li>
                <li>Groq (AI processing)</li>
                <li>Gmail/Google Workspace (email communications)</li>
              </ul>
            </div>

            {/* Cookies Policy */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-headline">14. Cookies Policy</h3>
              <p className="text-body mb-4">We use cookies for the following purposes:</p>
              <ul className="list-disc list-inside text-body space-y-2 mb-4">
                <li><span className="text-accent-blue font-semibold">Essential cookies:</span> Required for the website to function</li>
                <li><span className="text-accent-blue font-semibold">Preference cookies:</span> Remember your settings and preferences</li>
                <li><span className="text-accent-blue font-semibold">Analytics cookies:</span> Understand how visitors interact with our site</li>
                <li><span className="text-accent-blue font-semibold">Marketing cookies:</span> Deliver relevant advertisements (with your consent)</li>
              </ul>
              <p className="text-body">
                Under Australian law, we obtain your consent for non-essential cookies. You can manage your cookie preferences through our cookie banner or your browser settings.
              </p>
            </div>

            {/* Changes to Privacy Policy */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-headline">15. Changes to This Privacy Policy</h3>
              <p className="text-body mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top.
              </p>
              <p className="text-body">
                You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </div>

            {/* Contact Information */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-headline">16. Contact Us</h3>
              <p className="text-body mb-4">
                If you have any questions about this Privacy Policy or wish to access or correct your personal information, please contact our Privacy Officer:
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
                  24 Wakefield St, SPW<br />
                  Hawthorn VIC 3122<br />
                  Australia
                </p>
                <p className="text-body mb-2">
                  <span className="text-accent-blue font-semibold">Privacy Officer:</span>{' '}
                  Nathaniel Richards
                </p>
                <p className="text-body">
                  <span className="text-accent-blue font-semibold">ABN:</span> Coming soon
                </p>
              </div>
            </div>

            {/* Consent */}
            <div className="border-t border-primary-light/30 pt-8 mt-8">
              <p className="text-body text-sm italic">
                By using Nyx AI, you consent to this Privacy Policy and acknowledge that we handle your personal information in accordance with Australian privacy law.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}