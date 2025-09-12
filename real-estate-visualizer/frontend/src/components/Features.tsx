import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  Calculator, 
  BarChart3, 
  Zap, 
  Shield, 
  Smartphone,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Features: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Eye,
      title: "AI-Powered Visualization",
      description: "Transform any property into stunning 3D visualizations with our advanced AI technology.",
      benefits: [
        "Real-time 3D rendering",
        "Multiple style options",
        "High-resolution output",
        "Mobile-optimized viewing"
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Calculator,
      title: "Smart ROI Analysis",
      description: "Get comprehensive investment analysis with AI-driven market insights and projections.",
      benefits: [
        "Automated calculations",
        "Market trend analysis",
        "Risk assessment",
        "Investment recommendations"
      ],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: BarChart3,
      title: "Market Intelligence",
      description: "Access real-time market data and trends to make informed investment decisions.",
      benefits: [
        "Live market data",
        "Comparative analysis",
        "Price predictions",
        "Location insights"
      ],
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Experience blazing-fast performance with our optimized rendering engine.",
      benefits: [
        "Sub-second rendering",
        "Cloud processing",
        "Auto-scaling",
        "99.9% uptime"
      ],
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Modern Real Estate
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to visualize, analyze, and optimize your real estate investments in one powerful platform.
          </p>
        </motion.div>

        {/* Feature Tabs */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {features.map((feature, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFeature(index)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeFeature === index
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <feature.icon className="w-5 h-5 inline mr-2" />
                {feature.title}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Active Feature Display */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Feature Content */}
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
              <div className={`w-16 h-16 bg-gradient-to-r ${features[activeFeature].color} rounded-2xl flex items-center justify-center mb-6`}>
                {React.createElement(features[activeFeature].icon, { className: "w-8 h-8 text-white" })}
              </div>

            <h3 className="text-3xl font-bold text-gray-900">
              {features[activeFeature].title}
            </h3>

            <p className="text-lg text-gray-600 leading-relaxed">
              {features[activeFeature].description}
            </p>

            <div className="space-y-3">
              {features[activeFeature].benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              Learn More
              <ArrowRight className="w-4 h-4 ml-2" />
            </motion.button>
          </motion.div>

          {/* Feature Visualization */}
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className={`w-full h-96 bg-gradient-to-br ${features[activeFeature].color} rounded-2xl shadow-2xl flex items-center justify-center relative overflow-hidden`}>
              {/* Animated Background Elements */}
              <div className="absolute inset-0">
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute top-4 right-4 w-20 h-20 bg-white/20 rounded-full"
                />
                <motion.div
                  animate={{ 
                    rotate: [360, 0],
                    scale: [1.2, 1, 1.2]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute bottom-4 left-4 w-16 h-16 bg-white/20 rounded-full"
                />
              </div>

              {/* Feature Icon */}
              <motion.div
                animate={{ 
                  y: [-10, 10, -10],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative z-10"
              >
                <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  {React.createElement(features[activeFeature].icon, { className: "w-16 h-16 text-white" })}
                </div>
              </motion.div>

              {/* Floating Stats */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-8 left-8 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg"
              >
                <div className="text-2xl font-bold text-gray-900">99.9%</div>
                <div className="text-xs text-gray-600">Uptime</div>
              </motion.div>

              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg"
              >
                <div className="text-2xl font-bold text-gray-900">2.5s</div>
                <div className="text-xs text-gray-600">Render Time</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Additional Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 grid md:grid-cols-3 gap-8"
        >
          <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
            <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
            <p className="text-gray-600">Enterprise-grade security with end-to-end encryption</p>
          </div>

          <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
            <Smartphone className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Mobile Optimized</h3>
            <p className="text-gray-600">Access your visualizations anywhere, anytime</p>
          </div>

          <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
            <Zap className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600">Optimized for speed with global CDN delivery</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
