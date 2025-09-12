import './App.css';

function App() {
  return (
    <div className="App">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-icon">👁️</div>
            <span>Vista Forge</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#benefits">Benefits</a>
            <a href="#pricing">Pricing</a>
          </div>
          <div className="nav-buttons">
            <button className="sign-in-btn">Sign In</button>
            <button className="get-started-btn">Get Started →</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">AI-Powered Real Estate Platform</div>
          <h1 className="hero-title">
            Visualize Properties <span className="highlight">Beyond Reality</span>
          </h1>
          <p className="hero-description">
            Transform ordinary properties into extraordinary visual experiences with AI-powered visualization technology that reveals the hidden potential in every space.
          </p>
          <button className="trial-btn">Start Free Trial →</button>
          <div className="trial-features">
            <div className="feature-item">✔ No credit card required</div>
            <div className="feature-item">✔ 14-day free trial</div>
            <div className="feature-item">✔ Cancel anytime</div>
          </div>
        </div>
        <div className="hero-background"></div>
      </section>

      {/* Trust Section */}
      <section className="trust-section">
        <p>Trusted by 10,000+ visionary real estate professionals</p>
        <div className="rating">
          <div className="stars">★★★★★</div>
          <span>4.9/5 from 2,000+ reviews</span>
        </div>
      </section>

      {/* Results Section */}
      <section className="results-section">
        <div className="results-container">
          <div className="results-content">
            <h2 className="results-title">
              Proven Results That <span className="highlight">Transform Visions</span>
            </h2>
            <p className="results-description">
              Join thousands of successful agents who've transformed their business with Vista Forge. Our platform reveals the hidden potential in every property.
            </p>
            <ul className="benefits-list">
              <li>✔ Close deals 40% faster with stunning visualizations</li>
              <li>✔ Increase property value perception by 25%</li>
              <li>✔ Save 10+ hours per week on presentation prep</li>
              <li>✔ Impress clients with professional-grade materials</li>
            </ul>
            <div className="results-buttons">
              <button className="get-started-today-btn">Get Started Today →</button>
              <button className="view-pricing-btn">View Pricing</button>
            </div>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">40%</div>
              <div className="stat-label">Faster Deal Closing</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">25%</div>
              <div className="stat-label">Value Increase</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">10+</div>
              <div className="stat-label">Hours Saved Weekly</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="testimonials-title">
          What Our <span className="highlight">Visionaries</span> Say
        </h2>
        <p className="testimonials-description">
          Don't just take our word for it. See how Vista Forge is revolutionizing property visualization worldwide.
        </p>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <div className="quote-mark">"</div>
            <p className="testimonial-text">
              Vista Forge transformed how I present properties. My closing rate increased by 45% in just 3 months.
            </p>
            <div className="testimonial-author">
              <div className="author-name">Sarah Johnson</div>
              <div className="author-title">Real Estate Agent</div>
              <div className="author-company">Premier Properties</div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <div className="quote-mark">"</div>
            <p className="testimonial-text">
              The ROI calculator alone pays for the subscription. Invaluable for investment decisions.
            </p>
            <div className="testimonial-author">
              <div className="author-name">Michael Chen</div>
              <div className="author-title">Property Developer</div>
              <div className="author-company">Urban Ventures</div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <div className="quote-mark">"</div>
            <p className="testimonial-text">
              Our team productivity skyrocketed. The AI visualizations are simply incredible.
            </p>
            <div className="testimonial-author">
              <div className="author-name">Lisa Rodriguez</div>
              <div className="author-title">Marketing Director</div>
              <div className="author-company">Elite Realty</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <h2 className="newsletter-title">Stay Ahead of the Market</h2>
          <p className="newsletter-description">
            Get weekly insights, market trends, and exclusive tips from top-performing real estate professionals.
          </p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email address" className="email-input" />
            <button className="subscribe-btn">Subscribe</button>
          </div>
          <p className="newsletter-disclaimer">Join 15,000+ subscribers. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <div className="footer-logo">
              <div className="logo-icon">👁️</div>
              <span>Vista Forge</span>
            </div>
            <p className="footer-tagline">
              Revealing the invisible potential in every property through revolutionary visualization technology.
            </p>
          </div>
          <div className="footer-section">
            <h3>Product</h3>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Company</h3>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#contact">Contact & Help</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              <li><a href="#docs">Documentation</a></li>
              <li><a href="#community">Community</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 Vista Forge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;