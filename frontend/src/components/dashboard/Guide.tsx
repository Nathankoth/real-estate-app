import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  TrendingUp, 
  MapPin, 
  DollarSign, 
  Home, 
  Building,
  ExternalLink,
  Lightbulb
} from 'lucide-react';

const 

Guide = () => {
  const guideTopics = [
    {
      title: 'Market Analysis Fundamentals',
      description: 'Understanding local market trends and property valuation methods',
      icon: TrendingUp,
      difficulty: 'Beginner',
      estimatedTime: '15 min read',
    },
    {
      title: 'Location Intelligence',
      description: 'How location affects property value and investment potential',
      icon: MapPin,
      difficulty: 'Intermediate',
      estimatedTime: '20 min read',
    },
    {
      title: 'Investment Strategies',
      description: 'Different approaches to real estate investment and ROI optimization',
      icon: DollarSign,
      difficulty: 'Advanced',
      estimatedTime: '25 min read',
    },
    {
      title: 'Property Types Guide',
      description: 'Residential, commercial, and mixed-use property considerations',
      icon: Home,
      difficulty: 'Beginner',
      estimatedTime: '18 min read',
    },
    {
      title: 'Development Projects',
      description: 'Managing development projects from concept to completion',
      icon: Building,
      difficulty: 'Advanced',
      estimatedTime: '30 min read',
    },
  ];

  const quickTips = [
    {
      title: 'Using the ROI Calculator',
      description: 'Input accurate property prices and rental estimates for best results',
      icon: Lightbulb,
    },
    {
      title: '2D Image Generation Tips',
      description: 'Use high-quality reference images for better AI-generated outputs',
      icon: Lightbulb,
    },
    {
      title: 'Project Organization',
      description: 'Create folders and tag projects for easy navigation and management',
      icon: Lightbulb,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BookOpen className="h-8 w-8" />
          Real Estate Guide
        </h1>
        <p className="text-muted-foreground">
          Learn real estate fundamentals, market analysis, and get the most out of our platform tools.
        </p>
      </div>

      {/* Quick Tips */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Quick Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickTips.map((tip, index) => (
            <Card key={index} className="shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <tip.icon className="h-5 w-5 text-accent" />
                  <CardTitle className="text-sm">{tip.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Guide Topics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Learning Topics</h2>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            API Documentation
          </Button>
        </div>
        
        <div className="grid gap-6">
          {guideTopics.map((topic, index) => (
            <Card key={index} className="group hover:shadow-luxury transition-all duration-300 cursor-pointer shadow-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 luxury-gradient rounded-lg flex items-center justify-center">
                      <topic.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="space-y-2">
                      <CardTitle className="text-lg group-hover:text-accent transition-colors">
                        {topic.title}
                      </CardTitle>
                      <CardDescription>{topic.description}</CardDescription>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={topic.difficulty === 'Beginner' ? 'secondary' : topic.difficulty === 'Intermediate' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {topic.difficulty}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{topic.estimatedTime}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    Read More
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* API Integration Section */}
      <Card className="shadow-luxury border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            API Integration
          </CardTitle>
          <CardDescription>
            Connect your external systems and automate workflows with our comprehensive API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Available Endpoints</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Property data management</li>
                <li>• ROI calculation automation</li>
                <li>• Image generation API</li>
                <li>• Project management</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Getting Started</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Generate API keys</li>
                <li>• Review authentication</li>
                <li>• Test endpoints</li>
                <li>• Implement webhooks</li>
              </ul>
            </div>
          </div>
          <Button className="luxury-gradient shadow-button">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Full Documentation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Guide;