import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  Play, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Menu,
  X,
  Eye,
  Sparkles,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';
import './App.css';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Real Estate Agent",
      company: "Premier Properties",
      content: "Vista Forge transformed how I present properties. My closing rate increased by 45% in just 3 months.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Property Developer", 
      company: "Urban Ventures",
      content: "The ROI calculator alone pays for the subscription. Invaluable for investment decisions.",
      rating: 5
    },
    {
      name: "Lisa Rodriguez",
      role: "Marketing Director",
      company: "Elite Realty", 
      content: "Our team productivity skyrocketed. The AI visualizations are simply incredible.",
      rating: 5
    }
  ];

  const features = [
    {
      icon: <Eye className="w-8 h-8" />,
      title: "AI-Powered Visualization",
      description: "Transform any property into stunning 2D and 3D visualizations using advanced AI technology."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Smart ROI Analysis", 
      description: "Get comprehensive investment analysis with market predictions and risk assessments."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Results",
      description: "Generate professional property presentations in minutes, not hours."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Market Intelligence",
      description: "Access real-time market data and trends to make informed decisions."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-icon">
              <Eye className="w-6 h-6" />
            </div>
            <span>Vista Forge</span>
          </div>
          
          <div className={`nav-links ${isMenuOpen ? 'nav-links-open' : ''}`}>
            <a href="#features">Features</a>
            <a href="#benefits">Benefits</a>
            <a href="#pricing">Pricing</a>
          </div>
          
          <div className="nav-buttons">
            <button className="sign-in-btn">Sign In</button>
            <button className="get-started-btn">
              Get Started <ChevronRight className="w-4 h-4" />
            </button>
            <button 
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
        </div>
        
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-badge"
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered Real Estate Platform
          </motion.div>
          
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Visualize Properties <span className="highlight">Beyond Reality</span>
          </motion.h1>
          
          <motion.p 
            className="hero-description"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Transform ordinary properties into extraordinary visual experiences with AI-powered visualization technology that reveals the hidden potential in every space.
          </motion.p>
          
          <motion.div 
            className="hero-actions"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button className="trial-btn">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </button>
            <button className="demo-btn">
              <Play className="w-4 h-4" />
              Watch Demo
            </button>
          </motion.div>
          
          <motion.div 
            className="trial-features"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="feature-item">
              <CheckCircle className="w-4 h-4" />
              No credit card required
            </div>
            <div className="feature-item">
              <CheckCircle className="w-4 h-4" />
              14-day free trial
            </div>
            <div className="feature-item">
              <CheckCircle className="w-4 h-4" />
              Cancel anytime
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust-section">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          Trusted by 10,000+ visionary real estate professionals
        </motion.p>
        <motion.div 
          className="rating"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>
          <span>4.9/5 from 2,000+ reviews</span>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="features-container">
          <motion.div 
            className="features-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="features-title">
              Proven Results That <span className="highlight">Transform Visions</span>
            </h2>
            <p className="features-description">
              Join thousands of successful agents who've transformed their business with Vista Forge. Our platform reveals the hidden potential in every property.
            </p>
          </motion.div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="features-actions"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <button className="get-started-today-btn">
              Get Started Today <ArrowRight className="w-5 h-5" />
            </button>
            <button className="view-pricing-btn">View Pricing</button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <motion.div 
            className="stats-grid"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
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
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="benefits" className="testimonials-section">
        <div className="testimonials-container">
          <motion.div 
            className="testimonials-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="testimonials-title">
              What Our <span className="highlight">Visionaries</span> Say
            </h2>
            <p className="testimonials-description">
              Don't just take our word for it. See how Vista Forge is revolutionizing property visualization worldwide.
            </p>
          </motion.div>

          <div className="testimonials-carousel">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                className="testimonial-card"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <div className="testimonial-stars">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <div className="testimonial-quote">
                  "{testimonials[currentTestimonial].content}"
                </div>
                <div className="testimonial-author">
                  <div className="author-name">{testimonials[currentTestimonial].name}</div>
                  <div className="author-role">{testimonials[currentTestimonial].role}</div>
                  <div className="author-company">{testimonials[currentTestimonial].company}</div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`testimonial-dot ${index === currentTestimonial ? 'active' : ''}`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="newsletter-title">Stay Ahead of the Market</h2>
            <p className="newsletter-description">
              Get weekly insights, market trends, and exclusive tips from top-performing real estate professionals.
            </p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="email-input" 
              />
              <button className="subscribe-btn">Subscribe</button>
            </div>
            <p className="newsletter-disclaimer">Join 15,000+ subscribers. Unsubscribe anytime.</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <div className="footer-logo">
              <div className="logo-icon">
                <Eye className="w-6 h-6" />
              </div>
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