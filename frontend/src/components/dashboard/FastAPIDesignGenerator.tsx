import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Palette, Loader2, Download, RefreshCw } from 'lucide-react';
import { designApi } from '../../lib/api';
import { toast } from 'sonner';

const FastAPIDesignGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const samplePrompts = [
    "Modern minimalist living room with white walls and wooden furniture",
    "Cozy bedroom with warm lighting and neutral colors",
    "Contemporary kitchen with marble countertops and stainless steel appliances",
    "Scandinavian style dining room with light wood and plants",
    "Industrial loft with exposed brick walls and metal fixtures"
  ];

  const handleGenerateDesign = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a design prompt');
      return;
    }

    setLoading(true);
    try {
      const response = await designApi.generateDesign(prompt);
      
      if (response.image_b64) {
        setGeneratedImage(response.image_b64);
        toast.success('Design generated successfully!');
      } else {
        toast.error('No image was generated');
      }
    } catch (error) {
      console.error('Design generation error:', error);
      toast.error('Failed to generate design. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSamplePrompt = (samplePrompt: string) => {
    setPrompt(samplePrompt);
  };

  const handleDownloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${generatedImage}`;
      link.download = 'generated-design.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Image downloaded successfully!');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Palette className="h-8 w-8" />
          AI Design Generator (FastAPI)
        </h1>
        <p className="text-muted-foreground">
          Generate stunning interior design visualizations using AI-powered image generation
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Design Prompt</CardTitle>
              <CardDescription>
                Describe the interior design you want to generate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your ideal interior design... (e.g., Modern minimalist living room with white walls and wooden furniture)"
                className="min-h-[120px]"
              />
              
              <Button 
                onClick={handleGenerateDesign} 
                disabled={loading || !prompt.trim()}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Design...
                  </>
                ) : (
                  <>
                    <Palette className="h-4 w-4 mr-2" />
                    Generate Design
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Sample Prompts */}
          <Card>
            <CardHeader>
              <CardTitle>Sample Prompts</CardTitle>
              <CardDescription>
                Click on a sample to get started quickly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {samplePrompts.map((samplePrompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => handleSamplePrompt(samplePrompt)}
                  disabled={loading}
                >
                  <span className="text-sm">{samplePrompt}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Generated Image */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Generated Design</CardTitle>
                  <CardDescription>
                    Your AI-generated interior design visualization
                  </CardDescription>
                </div>
                {generatedImage && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadImage}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGeneratedImage(null)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {generatedImage ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={`data:image/png;base64,${generatedImage}`}
                      alt="Generated design"
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">AI Generated</Badge>
                    <Badge variant="outline">1024x1024</Badge>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-muted/50 rounded-lg">
                  <Palette className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Design Generated</h3>
                  <p className="text-muted-foreground text-center">
                    Enter a design prompt and click "Generate Design" to create your visualization
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Design Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">For Best Results:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Be specific about style (modern, traditional, minimalist)</li>
                  <li>• Include color preferences and materials</li>
                  <li>• Mention room type and key furniture pieces</li>
                  <li>• Describe lighting and atmosphere</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Example Prompts:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• "Scandinavian living room with light wood and plants"</li>
                  <li>• "Industrial kitchen with exposed brick and metal fixtures"</li>
                  <li>• "Cozy bedroom with warm lighting and neutral colors"</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FastAPIDesignGenerator;
