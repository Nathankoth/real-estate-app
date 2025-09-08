import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Calculator, 
  ArrowRight, 
  Mail, 
  CheckCircle,
  TrendingUp,
  Zap,
  Shield,
  Users,
  Star,
  Quote,
  BarChart3,
  Palette,
  Camera,
  Home
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Navbar } from '@/components/Navbar';
import heroBackground from '@/assets/hero-background.jpg';

const Index = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);
      
      if (error) {
        if (error.code === '23505') {
          toast.error('Email already subscribed!');
        } else {
          throw error;
        }
      } else {
        toast.success('Successfully subscribed to newsletter!');
        setEmail('');
      }
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Visualization",
      description: "Transform property photos into stunning visualizations with advanced AI technology"
    },
    {
      icon: Calculator,
      title: "ROI Calculator",
      description: "Accurate investment calculations to help you make informed real estate decisions"
    },
    {
      icon: BarChart3,
      title: "Market Analytics",
      description: "Real-time market data and trends to stay ahead of the competition"
    },
    {
      icon: Palette,
      title: "Design Tools",
      description: "Professional-grade design tools for creating compelling property presentations"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee"
    },
    {
      icon: Camera,
      title: "3D Rendering",
      description: "Create immersive 3D property tours that wow your clients"
    }
  ];

  const benefits = [
    "Close deals 40% faster with stunning visualizations",
    "Increase property value perception by 25%",
    "Save 10+ hours per week on presentation prep",
    "Impress clients with professional-grade materials"
  ];

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/80 via-brand-navy/50 to-brand-gold/30" />
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <span className="ai-badge">
              <Sparkles className="w-4 h-4 mr-2 inline" />
              AI-Powered Real Estate Platform
            </span>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
              Visualize Properties 
              <span className="block text-gold-gradient">Beyond Reality</span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Transform ordinary properties into extraordinary visual experiences with AI-powered visualization technology that reveals the hidden potential in every space.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" className="bg-white text-brand-navy hover:bg-white/90 px-8 py-6 text-lg font-semibold shadow-luxury">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth">
                    <Button size="lg" className="bg-brand-gold text-brand-dark hover:bg-brand-gold/90 px-8 py-6 text-lg font-semibold shadow-luxury gold-glow">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
            
            <div className="flex items-center justify-center space-x-8 text-white/80 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-brand-gold" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-brand-gold" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-brand-gold" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 glass-effect border-y border-white/10">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-muted-foreground mb-8">Trusted by 10,000+ visionary real estate professionals</p>
            <div className="flex items-center justify-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-brand-gold text-brand-gold" />
              ))}
              <span className="ml-2 text-sm font-medium">4.9/5 from 2,000+ reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Everything You Need to 
              <span className="text-gold-gradient"> Visualize Success</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful tools designed specifically for real estate professionals who want to close more deals and increase revenue.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass-effect shadow-card hover:shadow-luxury transition-all duration-300 hover-scale border-white/10">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg luxury-gradient flex items-center justify-center mb-4 shadow-button">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 glass-effect border-y border-white/10">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                Proven Results That 
                <span className="text-gold-gradient">Transform Visions</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of successful agents who've transformed their business with Vista Forge. 
                Our platform reveals the hidden potential in every property.
              </p>
              
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-brand-gold flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="flex space-x-4">
                <Link to="/auth">
                  <Button size="lg" className="luxury-gradient shadow-button px-8">
                    Get Started Today
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="outline">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card className="glass-effect p-6 text-center shadow-card border-white/10">
                  <div className="text-3xl font-bold text-brand-gold mb-2">40%</div>
                  <div className="text-sm text-muted-foreground">Faster Deal Closing</div>
                </Card>
                <Card className="glass-effect p-6 text-center shadow-card border-white/10">
                  <div className="text-3xl font-bold text-brand-gold mb-2">10+</div>
                  <div className="text-sm text-muted-foreground">Hours Saved Weekly</div>
                </Card>
              </div>
              <div className="space-y-6 mt-8">
                <Card className="glass-effect p-6 text-center shadow-card border-white/10">
                  <div className="text-3xl font-bold text-brand-gold mb-2">25%</div>
                  <div className="text-sm text-muted-foreground">Value Increase</div>
                </Card>
                <Card className="glass-effect p-6 text-center shadow-card border-white/10">
                  <div className="text-3xl font-bold text-brand-gold mb-2">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              What Our <span className="text-gold-gradient">Visionaries Say</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Don't just take our word for it. See how Vista Forge is revolutionizing property visualization worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass-effect shadow-card hover:shadow-luxury transition-all duration-300 border-white/10">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-brand-gold text-brand-gold" />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-brand-gold mb-4" />
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-sm text-brand-gold">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 bg-brand-navy">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay Ahead of the Market
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Get weekly insights, market trends, and exclusive tips from top-performing real estate professionals.
            </p>
            
            <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="glass-effect flex-1 border-white/30 text-white placeholder:text-white/60"
              />
              <Button 
                type="submit" 
                disabled={isSubscribing}
                className="bg-brand-gold text-brand-navy hover:bg-brand-gold/90 font-semibold"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                <Mail className="ml-2 h-4 w-4" />
              </Button>
            </form>
            
            <p className="text-sm text-white/60 mt-4">
              Join 15,000+ subscribers. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-effect py-16 border-t border-white/10">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img 
                  src="/lovable-uploads/61161983-4a0b-4332-b563-2ea8738fa49b.png" 
                  alt="Vista Forge Logo" 
                  className="h-12 w-auto"
                />
                <span className="text-2xl font-bold text-gold-gradient">Vista Forge</span>
              </div>
              <p className="text-muted-foreground">
                Revealing the invisible potential in every property through revolutionary visualization technology.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact & Help</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Community</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Vista Forge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;