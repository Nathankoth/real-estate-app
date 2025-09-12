import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import PropertyRenderer from './components/PropertyRenderer';
import ROICalculator from './components/ROICalculator';

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster position="top-right" />
        
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Navbar />
              <Hero />
              <Features />
              <HowItWorks />
              <Pricing />
              <Testimonials />
              <CTA />
              <Footer />
            </motion.div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;