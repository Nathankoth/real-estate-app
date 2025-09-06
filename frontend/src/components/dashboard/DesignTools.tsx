import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, 
  Ruler, 
  Grid3X3, 
  Layers, 
  PaintBucket, 
  Scissors, 
  Move3D,
  Sparkles,
  Image as ImageIcon,
  Download,
  Upload,
  Wand2
} from 'lucide-react';

const DesignTools = () => {
  const [activeTab, setActiveTab] = useState('color-palette');

  const designTools = [
    {
      title: 'Color Palette Generator',
      description: 'Generate harmonious color schemes for your interior designs',
      icon: Palette,
      category: 'Colors',
      features: ['AI-powered combinations', 'Accessibility check', 'Export formats']
    },
    {
      title: 'Room Layout Planner',
      description: 'Design and optimize room layouts with precise measurements',
      icon: Grid3X3,
      category: 'Layout',
      features: ['Drag & drop furniture', 'Scale accuracy', '3D preview']
    },
    {
      title: 'Material Library',
      description: 'Browse and apply realistic materials and textures',
      icon: Layers,
      category: 'Materials',
      features: ['High-res textures', 'PBR materials', 'Custom uploads']
    },
    {
      title: 'Lighting Designer',
      description: 'Simulate natural and artificial lighting scenarios',
      icon: Sparkles,
      category: 'Lighting',
      features: ['Time-of-day simulation', 'Shadow analysis', 'Energy efficiency']
    },
    {
      title: 'Style Matcher',
      description: 'Match and blend different interior design styles',
      icon: Wand2,
      category: 'Styles',
      features: ['Style recognition', 'Blend recommendations', 'Trend analysis']
    },
    {
      title: 'Dimension Calculator',
      description: 'Calculate space dimensions and furniture sizing',
      icon: Ruler,
      category: 'Measurements',
      features: ['Room calculations', 'Furniture fitting', 'Scale conversion']
    }
  ];

  const colorPalettes = [
    {
      name: 'Modern Minimalist',
      colors: ['#F8F9FA', '#E9ECEF', '#6C757D', '#343A40', '#212529'],
      style: 'Contemporary'
    },
    {
      name: 'Warm Scandinavian',
      colors: ['#FEFEFE', '#F5E6D3', '#E4C29F', '#B08D57', '#8B4513'],
      style: 'Nordic'
    },
    {
      name: 'Urban Industrial',
      colors: ['#2F2F2F', '#5D5D5D', '#8A8A8A', '#B7B7B7', '#E5E5E5'],
      style: 'Industrial'
    },
    {
      name: 'Botanical Fresh',
      colors: ['#F0F8F0', '#C8E6C9', '#81C784', '#4CAF50', '#2E7D32'],
      style: 'Biophilic'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Design Tools</h1>
          <p className="text-muted-foreground">
            Professional design utilities for creating stunning interior spaces
          </p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {designTools.map((tool, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <tool.icon className="h-8 w-8 text-primary" />
                <Badge variant="outline">{tool.category}</Badge>
              </div>
              <CardTitle className="text-lg">{tool.title}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-1">
                  {tool.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm">
                      <div className="w-1 h-1 bg-primary rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full">Launch Tool</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Interactive Design Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Design Studio</CardTitle>
          <CardDescription>
            Quick access design tools for immediate creativity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="color-palette">Colors</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="layouts">Layouts</TabsTrigger>
              <TabsTrigger value="lighting">Lighting</TabsTrigger>
            </TabsList>
            
            <TabsContent value="color-palette" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Color Palettes</h3>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {colorPalettes.map((palette, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{palette.name}</h4>
                        <p className="text-sm text-muted-foreground">{palette.style}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex space-x-1">
                      {palette.colors.map((color, idx) => (
                        <div
                          key={idx}
                          className="flex-1 h-12 rounded border"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="materials" className="space-y-4">
              <div className="text-center py-8">
                <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Material Library</h3>
                <p className="text-muted-foreground mb-4">
                  Browse thousands of high-quality materials and textures
                </p>
                <Button>Browse Materials</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="layouts" className="space-y-4">
              <div className="text-center py-8">
                <Grid3X3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Layout Planner</h3>
                <p className="text-muted-foreground mb-4">
                  Design room layouts with precision and ease
                </p>
                <Button>Start Planning</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="lighting" className="space-y-4">
              <div className="text-center py-8">
                <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Lighting Designer</h3>
                <p className="text-muted-foreground mb-4">
                  Create perfect lighting scenarios for any space
                </p>
                <Button>Design Lighting</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common design tasks made simple and fast
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <PaintBucket className="h-6 w-6" />
              <span className="text-sm">Paint Visualizer</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Move3D className="h-6 w-6" />
              <span className="text-sm">Furniture Placer</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Scissors className="h-6 w-6" />
              <span className="text-sm">Image Cropper</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <ImageIcon className="h-6 w-6" />
              <span className="text-sm">Style Transfer</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignTools;