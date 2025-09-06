import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Box, Sparkles, Clock, Mail } from 'lucide-react';

const ThreeDPlaceholder = () => {
  const upcomingFeatures = [
    {
      title: '3D Space Modeling',
      description: 'Convert 2D floor plans into immersive 3D models',
      status: 'In Development',
    },
    {
      title: 'Virtual Reality Tours',
      description: 'Create VR-ready property walkthroughs',
      status: 'Planned',
    },
    {
      title: 'Interactive Furniture Placement',
      description: 'Drag and drop furniture in 3D space',
      status: 'Planned',
    },
    {
      title: 'Lighting Simulation',
      description: 'Realistic lighting effects for different times of day',
      status: 'Research',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Box className="h-8 w-8" />
            3D Generator
          </h1>
          <Badge variant="secondary" className="luxury-gradient text-white">
            <Sparkles className="h-3 w-3 mr-1" />
            Coming Soon
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Create immersive 3D property experiences and virtual tours.
        </p>
      </div>

      {/* Main Card */}
      <Card className="shadow-luxury border-accent/20">
        <CardContent className="p-12 text-center space-y-8">
          <div className="space-y-4">
            <div className="w-24 h-24 luxury-gradient rounded-full flex items-center justify-center mx-auto">
              <Box className="h-12 w-12 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold">Revolutionary 3D Technology</h2>
            <p className="text-muted-foreground max-w-2xl">
              We're developing cutting-edge 3D generation capabilities that will transform how you showcase properties. 
              Create stunning virtual tours, interactive 3D models, and immersive experiences that will captivate your clients.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                What to Expect
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• AI-powered 3D space generation</li>
                <li>• Photorealistic rendering quality</li>
                <li>• Interactive virtual walkthroughs</li>
                <li>• Multi-platform compatibility</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent" />
                Timeline
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Beta testing: Q2 2024</li>
                <li>• Early access: Q3 2024</li>
                <li>• Full release: Q4 2024</li>
                <li>• Advanced features: 2025</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <Button className="luxury-gradient shadow-button px-8">
              <Mail className="h-4 w-4 mr-2" />
              Get Early Access
            </Button>
            <p className="text-sm text-muted-foreground">
              Be among the first to experience our 3D generation technology
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Feature Preview */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Upcoming Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {upcomingFeatures.map((feature, index) => (
            <Card key={index} className="shadow-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <Badge 
                    variant={
                      feature.status === 'In Development' ? 'default' :
                      feature.status === 'Planned' ? 'secondary' : 'outline'
                    }
                  >
                    {feature.status}
                  </Badge>
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-center">Stay Updated</CardTitle>
          <CardDescription className="text-center">
            Subscribe to our newsletter for the latest updates on 3D generation features
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex max-w-sm mx-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-3 py-2 border border-input rounded-md text-sm"
            />
            <Button>Subscribe</Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Join 5,000+ professionals waiting for 3D features
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThreeDPlaceholder;