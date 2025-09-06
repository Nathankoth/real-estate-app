import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Eye, 
  Zap, 
  Camera, 
  Wand2, 
  Sparkles,
  Upload,
  Download,
  Play,
  Square,
  RefreshCw,
  Settings,
  ChevronRight
} from 'lucide-react';

const AIVisualization = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const aiTools = [
    {
      title: 'Style Transfer',
      description: 'Apply artistic styles from one image to another using deep learning',
      icon: Wand2,
      type: 'Image Processing',
      accuracy: '95%',
      speed: 'Fast'
    },
    {
      title: 'Smart Upscaling',
      description: 'Enhance image resolution while preserving details using AI',
      icon: Eye,
      type: 'Enhancement',
      accuracy: '98%',
      speed: 'Medium'
    },
    {
      title: 'Scene Recognition',
      description: 'Automatically identify and categorize interior design elements',
      icon: Camera,
      type: 'Analysis',
      accuracy: '92%',
      speed: 'Fast'
    },
    {
      title: 'Neural Rendering',
      description: 'Generate photorealistic renders from simple sketches',
      icon: Brain,
      type: 'Generation',
      accuracy: '89%',
      speed: 'Slow'
    }
  ];

  const presetPrompts = [
    'Transform this living room into a modern Scandinavian style',
    'Add warm lighting and cozy elements to this bedroom',
    'Convert this space to a minimalist Japanese aesthetic',
    'Enhance this kitchen with industrial design elements',
    'Apply bohemian style with plants and warm textures',
    'Create a luxury hotel lobby atmosphere'
  ];

  const recentGenerations = [
    {
      title: 'Modern Living Room',
      style: 'Contemporary',
      timestamp: '2 minutes ago',
      status: 'completed'
    },
    {
      title: 'Cozy Bedroom Design',
      style: 'Scandinavian',
      timestamp: '15 minutes ago',
      status: 'completed'
    },
    {
      title: 'Industrial Kitchen',
      style: 'Industrial',
      timestamp: '1 hour ago',
      status: 'completed'
    }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);
    
    // Simulate AI processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold">AI-Powered Visualization</h1>
          <p className="text-muted-foreground">
            Advanced artificial intelligence tools for design visualization and enhancement
          </p>
        </div>
      </div>

      {/* AI Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {aiTools.map((tool, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <tool.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                    <Badge variant="outline" className="mt-1">{tool.type}</Badge>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex space-x-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Accuracy:</span>
                    <span className="ml-1 font-medium text-green-600">{tool.accuracy}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Speed:</span>
                    <span className="ml-1 font-medium">{tool.speed}</span>
                  </div>
                </div>
                <Button size="sm">Try Now</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span>AI Design Generator</span>
          </CardTitle>
          <CardDescription>
            Generate stunning interior designs using advanced AI algorithms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Upload Base Image</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag & drop an image or click to browse
                  </p>
                  <Button variant="outline" size="sm">Choose File</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ai-prompt">AI Prompt</Label>
                <Textarea
                  id="ai-prompt"
                  placeholder="Describe the style and changes you want to apply..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Quick Prompts</Label>
                <div className="grid grid-cols-1 gap-2">
                  {presetPrompts.slice(0, 4).map((prompt, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="justify-start text-left h-auto p-3 whitespace-normal"
                      size="sm"
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Generation Settings</Label>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Advanced
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Generation Progress */}
          {isGenerating && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Generating AI Visualization...</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="flex items-center space-x-2"
              >
                {isGenerating ? (
                  <Square className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                <span>{isGenerating ? 'Stop' : 'Generate'}</span>
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            <Badge variant="outline">
              <Zap className="h-3 w-3 mr-1" />
              AI Credits: 47 remaining
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Recent Generations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent AI Generations</CardTitle>
              <CardDescription>
                Your latest AI-powered design visualizations
              </CardDescription>
            </div>
            <Button variant="outline">View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentGenerations.map((generation, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Eye className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium">{generation.title}</h4>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{generation.style}</span>
                      <span>•</span>
                      <span>{generation.timestamp}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={generation.status === 'completed' ? 'default' : 'secondary'}
                  >
                    {generation.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIVisualization;