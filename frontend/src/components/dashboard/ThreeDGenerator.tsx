import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Box, Mail, Star, Camera, Users, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const ThreeDGenerator = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleWaitlistSignup = async () => {
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email,
          is_active: true
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already Subscribed",
            description: "You're already on our waitlist!"
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Welcome to the Waitlist!",
          description: "We'll notify you when 3D rendering is available"
        });
        setEmail('');
      }
    } catch (error) {
      console.error('Waitlist signup error:', error);
      toast({
        title: "Signup Failed",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const demoFeatures = [
    {
      icon: Box,
      title: "Interactive 3D Models",
      description: "Navigate through photorealistic 3D environments with smooth controls"
    },
    {
      icon: Camera,
      title: "Virtual Walkthroughs",
      description: "Create immersive property tours for clients and stakeholders"
    },
    {
      icon: Star,
      title: "High-Quality Rendering",
      description: "Professional-grade visualization with realistic lighting and materials"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Box className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">3D Rendering & Visualization</h1>
        </div>
        <Badge variant="secondary" className="px-4 py-2">
          Coming Soon
        </Badge>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform your property blueprints and photos into stunning 3D models and virtual walkthroughs
        </p>
      </div>


      {/* Features Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {demoFeatures.map((feature, index) => (
          <Card key={index}>
            <CardContent className="p-6 text-center">
              <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Waitlist Signup */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Join the Early Access Waitlist</CardTitle>
          <CardDescription>
            Be the first to experience next-generation 3D property visualization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-md mx-auto space-y-4">
            <div className="space-y-2">
              <Label htmlFor="waitlist-email">Email Address</Label>
              <Input
                id="waitlist-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleWaitlistSignup()}
              />
            </div>
            <Button 
              onClick={handleWaitlistSignup} 
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Mail className="h-4 w-4 mr-2 animate-pulse" />
                  Joining Waitlist...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Join Waitlist
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};