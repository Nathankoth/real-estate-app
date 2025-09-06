import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Wand2, Image, CreditCard, Sparkles, Download, Loader2, Zap } from 'lucide-react';
import { useCredits } from '@/hooks/useCredits';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { credits, loading: creditsLoading, useCredit } = useCredits();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a description for your image",
        variant: "destructive"
      });
      return;
    }

    // Check credits first
    const creditResult = await useCredit();
    if (!creditResult.success) {
      setShowUpgradeModal(true);
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-2d-image', {
        body: { prompt }
      });

      if (error) throw error;
      
      setGeneratedImage(data.imageUrl);
      toast({
        title: "Image Generated!",
        description: `Successfully created your visualization. ${creditResult.credits} credits remaining.`
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planType: 'premium' }
      });

      if (error) throw error;
      
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Failed",
        description: "Unable to start checkout process. Please try again.",
        variant: "destructive"
      });
    }
  };

  const samplePrompts = [
    "Modern luxury apartment interior with floor-to-ceiling windows and city view",
    "Cozy suburban house exterior with landscaped garden and driveway",
    "Contemporary office space with glass walls and minimalist design",
    "Rustic cabin in the woods with wooden exterior and stone chimney"
  ];

  return (
    <div className="space-y-8">
      {/* Header with Credits */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Image Generator</h1>
          <p className="text-muted-foreground">
            Create stunning property visualizations with AI
          </p>
        </div>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm font-medium">Credits Remaining</div>
                <div className="text-lg font-bold">
                  {creditsLoading ? '...' : credits === 9999 ? '∞' : credits}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generator Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wand2 className="h-5 w-5" />
              <span>Generate Image</span>
            </CardTitle>
            <CardDescription>
              Describe the property or space you want to visualize
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="prompt">Image Description</Label>
              <Textarea
                id="prompt"
                placeholder="Describe the property, interior, or architectural style you want to visualize..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
              />
            </div>
            
            <Button 
              onClick={handleGenerate} 
              disabled={generating || credits <= 0}
              className="w-full"
              size="lg"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : credits <= 0 ? (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  No Credits - Upgrade
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Image (1 Credit)
                </>
              )}
            </Button>

            {credits <= 0 && (
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  Out of free credits? Upgrade for unlimited generations!
                </p>
                <Button variant="outline" onClick={() => setShowUpgradeModal(true)}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Upgrade Plan
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Image className="h-5 w-5" />
              <span>Generated Image</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
              {generating ? (
                <div className="text-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                  <p className="text-muted-foreground">Creating your visualization...</p>
                </div>
              ) : generatedImage ? (
                <div className="relative w-full h-full">
                  <img 
                    src={generatedImage} 
                    alt="Generated visualization" 
                    className="w-full h-full object-cover"
                  />
                  <Button
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = generatedImage;
                      link.download = 'property-visualization.png';
                      link.click();
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <Image className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">Your generated image will appear here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sample Prompts */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Prompts</CardTitle>
          <CardDescription>
            Get inspired with these example descriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {samplePrompts.map((samplePrompt, index) => (
              <div 
                key={index}
                className="p-4 border rounded-lg cursor-pointer hover:bg-muted transition-colors"
                onClick={() => setPrompt(samplePrompt)}
              >
                <p className="text-sm">{samplePrompt}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">AI-Powered</div>
            <div className="text-sm text-muted-foreground">Advanced generation</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">Fast</div>
            <div className="text-sm text-muted-foreground">Under 30 seconds</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Image className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">High Quality</div>
            <div className="text-sm text-muted-foreground">Professional results</div>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade to Continue</DialogTitle>
            <DialogDescription>
              You've used all your free credits. Upgrade to unlimited generations!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center p-6 border rounded-lg">
              <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Premium Plan</h3>
              <div className="text-3xl font-bold mb-2">$19.99<span className="text-sm text-muted-foreground">/month</span></div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Unlimited image generations</li>
                <li>✓ High-quality outputs</li>
                <li>✓ Priority processing</li>
                <li>✓ Advanced features</li>
              </ul>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowUpgradeModal(false)} className="flex-1">
                Maybe Later
              </Button>
              <Button onClick={handleUpgrade} className="flex-1">
                <CreditCard className="h-4 w-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageGenerator;