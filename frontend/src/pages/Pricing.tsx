import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function Pricing() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (planType: 'premium' | 'pro') => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to subscribe to a plan",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planType },
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');

    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for trying out Vista Forge",
      features: [
        "10 AI-generated 2D images",
        "Basic style presets",
        "Standard image quality",
        "Email support",
        "Community access"
      ],
      isPopular: false,
      action: "Current Plan",
      disabled: true
    },
    {
      name: "Premium",
      price: "$19.99",
      period: "/month",
      description: "Best for regular users and small businesses",
      features: [
        "Unlimited 2D image generations",
        "3D visualization access",
        "ROI calculator with AI analysis", 
        "Custom style prompts",
        "HD image quality",
        "Priority support",
        "Advanced AI assistant",
        "Export to multiple formats"
      ],
      isPopular: true,
      action: "Start Premium",
      planType: 'premium' as const
    },
    {
      name: "Pro",
      price: "$49.99", 
      period: "/month",
      description: "For professionals and agencies",
      features: [
        "Everything in Premium",
        "Unlimited 3D generations",
        "Advanced ROI analytics",
        "White-label solutions",
        "API access",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 priority support"
      ],
      isPopular: false,
      action: "Start Pro",
      planType: 'pro' as const
    }
  ];

  const faqItems = [
    {
      question: "What's included in the free plan?",
      answer: "The free plan includes 10 AI-generated 2D images with basic style presets and standard quality. It's perfect for trying out our platform."
    },
    {
      question: "Can I upgrade or downgrade my plan anytime?",
      answer: "Yes, you can upgrade or downgrade your subscription at any time through your account settings. Changes will be reflected in your next billing cycle."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express) and process payments securely through Stripe."
    },
    {
      question: "Is there a refund policy?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team for a full refund."
    },
    {
      question: "Do you offer custom enterprise solutions?",
      answer: "Yes, we offer custom enterprise solutions with advanced features, dedicated support, and flexible pricing. Contact our sales team to discuss your needs."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold gradient-text mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the perfect plan to transform your real estate visualization workflow
          </p>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.isPopular ? 'border-primary shadow-lg scale-105' : ''}`}>
                {plan.isPopular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    <Crown className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.isPopular ? 'premium-button' : ''}`}
                    variant={plan.isPopular ? "default" : "outline"}
                    disabled={plan.disabled || isLoading}
                    onClick={() => plan.planType && handleSubscribe(plan.planType)}
                  >
                    {plan.isPopular && <Zap className="w-4 h-4 mr-2" />}
                    {plan.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about our pricing and plans</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqItems.map((item, index) => (
              <div key={index} className="space-y-3">
                <h3 className="font-semibold text-lg">{item.question}</h3>
                <p className="text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">&copy; 2024 Vista Forge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}