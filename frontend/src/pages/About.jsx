import React from "react";

export default function About() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="section-container text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Our Story & Mission
          </h2>
          <p className="text-xl text-body mb-8 max-w-3xl mx-auto">
            From a small startup in Melbourne to a global AI platform - dedicated to democratizing 
            AI assistance for everyone.
          </p>
          <div className="inline-block premium-card px-6 py-3 interactive-glow">
            <span className="text-sm font-semibold text-accent-blue">Made with ❤️ in Melbourne • 24/7 Support • Global Vision</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-container">
        {/* Our Story */}
        <div className="premium-card p-8 mb-12 interactive-glow">
          <h2 className="text-3xl font-bold mb-6 text-center text-headline">Who We Are</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-accent-blue">Our Humble Beginning</h3>
              <p className="text-body mb-4">
                Nyx AI was born in a small Melbourne apartment in 2023, where a team of passionate engineers, 
                educators, and AI enthusiasts came together with a shared vision.
              </p>
              <p className="text-body">
                What started as late-night coding sessions fueled by coffee and passion has grown into a platform 
                serving thousands of students, professionals, and lifelong learners worldwide.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-accent-blue">Our Philosophy</h3>
              <blockquote className="border-l-4 border-accent-blue pl-4 italic text-headline mb-4">
                "Technology should empower, not intimidate. AI should serve, not replace. Education should 
                be accessible, not exclusive."
              </blockquote>
              <p className="text-body">
                This philosophy guides every feature we build, every line of code we write, and every 
                interaction with our users.
              </p>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center text-headline">Our Mission & Vision</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="feature-card interactive-glow">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold mb-2 text-headline">Our Mission</h3>
              <p className="text-body text-sm">
                To democratize AI-powered education and productivity tools for everyone, everywhere.
              </p>
            </div>
            <div className="feature-card interactive-glow">
              <div className="text-4xl mb-4">🔭</div>
              <h3 className="text-lg font-semibold mb-2 text-headline">Our Vision</h3>
              <p className="text-body text-sm">
                A world where AI empowers every individual to learn faster and achieve their potential.
              </p>
            </div>
            <div className="feature-card interactive-glow">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-lg font-semibold mb-2 text-headline">Our Values</h3>
              <p className="text-body text-sm">
                Integrity, Innovation, Accessibility, and User-Centric design.
              </p>
            </div>
            <div className="feature-card interactive-glow">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-lg font-semibold mb-2 text-headline">Global Reach</h3>
              <p className="text-body text-sm">
                Based in Melbourne, serving the world. Great ideas have no borders.
              </p>
            </div>
          </div>
        </div>

        {/* The Team */}
        <div className="premium-card p-8 mb-12 interactive-glow">
          <h2 className="text-3xl font-bold mb-8 text-center text-headline">Meet Our Team</h2>
          <p className="text-body mb-8 text-center max-w-3xl mx-auto">
            A diverse group of engineers, educators, and innovators working to make AI accessible.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="feature-card interactive-glow">
              <div className="text-4xl mb-4">👨‍💻</div>
              <h3 className="text-lg font-semibold mb-2 text-headline">AI Engineers</h3>
              <p className="text-body text-sm">
                Working round the clock to fine-tune our AI models for accurate and helpful responses.
              </p>
            </div>
            
            <div className="feature-card interactive-glow">
              <div className="text-4xl mb-4">👩‍🏫</div>
              <h3 className="text-lg font-semibold mb-2 text-headline">Education Experts</h3>
              <p className="text-body text-sm">
                Former teachers ensuring our study tools are pedagogically sound and actually help learning.
              </p>
            </div>
            
            <div className="feature-card interactive-glow">
              <div className="text-4xl mb-4">👨‍🔧</div>
              <h3 className="text-lg font-semibold mb-2 text-headline">DevOps Team</h3>
              <p className="text-body text-sm">
                Keeping Nyx running smoothly 24/7, ensuring your AI assistant is always available.
              </p>
            </div>
            
            <div className="feature-card interactive-glow">
              <div className="text-4xl mb-4">👩‍💼</div>
              <h3 className="text-lg font-semibold mb-2 text-headline">Support Team</h3>
              <p className="text-body text-sm">
                Real humans ready to help with any questions or issues. We believe in human-first support.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-accent-blue/10 to-accent-blue/5 border border-accent-blue/30 
                        text-white py-12 text-center rounded-xl interactive-glow">
          <h2 className="text-3xl font-bold mb-4 text-headline">Stay Tuned for More</h2>
          <p className="mb-6 text-body text-lg">
            We're just getting started. More features, more tools, and more ways to help you 
            learn and grow are coming.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://eliteacademy-1t6i.onrender.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary interactive-glow"
            >
              Visit Our Tutoring Platform
            </a>
            <button className="btn-secondary interactive-glow">
              Join Our Newsletter
            </button>
          </div>
          <p className="mt-6 text-sm text-body">
            Follow our journey as we continue to innovate and expand.
          </p>
        </div>
      </section>
    </>
  );
}