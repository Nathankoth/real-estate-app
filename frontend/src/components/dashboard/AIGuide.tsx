import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  Lightbulb, 
  TrendingUp,
  Home,
  Palette
} from 'lucide-react';
import { guideApi } from '@/lib/api';
import { toast } from 'sonner';

const AIGuide = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{type: 'user' | 'ai', content: string}>>([
    {
      type: 'ai',
      content: "Hello! I'm your Vista Forge AI assistant. I can help you with interior design guidance, real estate investment advice, and platform features. What would you like to know?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    {
      icon: Palette,
      title: "Style Recommendations",
      prompt: "What interior design styles would work well for a small apartment?",
      category: "Design"
    },
    {
      icon: TrendingUp,
      title: "ROI Analysis Help",
      prompt: "How do I interpret my ROI calculation results?",
      category: "Investment"
    },
    {
      icon: Home,
      title: "Space Optimization", 
      prompt: "Tips for making a small living room appear larger",
      category: "Design"
    },
    {
      icon: Lightbulb,
      title: "Platform Features",
      prompt: "How do I get the best results from the 2D image generator?",
      category: "Platform"
    }
  ];

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || message;
    if (!textToSend.trim()) return;

    setMessage('');
    setIsLoading(true);
    
    // Add user message to conversation
    const newConversation = [...conversation, { type: 'user' as const, content: textToSend }];
    setConversation(newConversation);

    try {
      const response = await guideApi.getGuide(textToSend);

      // Add AI response to conversation
      setConversation(prev => [
        ...prev,
        { type: 'ai', content: response.steps }
      ]);

    } catch (error: any) {
      console.error('Error calling AI assistant:', error);
      toast.error('Failed to get AI response. Please try again.');
      
      // Add error message to conversation
      setConversation(prev => [
        ...prev,
        { type: 'ai', content: 'Sorry, I encountered an error. Please try again or rephrase your question.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Bot className="h-8 w-8" />
          AI Guide & Assistant
        </h1>
        <p className="text-muted-foreground">
          Get personalized guidance on interior design, real estate investment, and platform features.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Chat Interface */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                AI Conversation
              </CardTitle>
              <CardDescription>
                Ask questions about design, investment analysis, or platform usage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Conversation Display */}
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {conversation.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.type === 'user'
                          ? 'bg-primary text-primary-foreground ml-4'
                          : 'bg-muted mr-4'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {msg.type === 'ai' && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted mr-4 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 animate-pulse" />
                        <p className="text-sm text-muted-foreground">AI is thinking...</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about interior design, ROI analysis, or platform features..."
                  className="min-h-[60px]"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!message.trim() || isLoading}
                  className="luxury-gradient"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Prompts & Info */}
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Quick Questions</CardTitle>
              <CardDescription>
                Click to ask common questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left p-4 h-auto"
                  onClick={() => handleQuickPrompt(prompt.prompt)}
                  disabled={isLoading}
                >
                  <div className="flex items-start gap-3 w-full">
                    <prompt.icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{prompt.title}</span>
                        <Badge variant="secondary" className="text-xs">
                          {prompt.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground text-left">
                        {prompt.prompt}
                      </p>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-card border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-accent" />
                AI Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1">Interior Design</h4>
                  <p className="text-xs text-muted-foreground">
                    Style recommendations, color schemes, space optimization, and trend insights
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Investment Analysis</h4>
                  <p className="text-xs text-muted-foreground">
                    ROI interpretation, market insights, risk assessment, and strategy advice
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Platform Guidance</h4>
                  <p className="text-xs text-muted-foreground">
                    Feature explanations, best practices, and workflow optimization
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIGuide;