import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Crown, 
  RefreshCw,
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

interface UsageData {
  generations_used: number;
  is_premium: boolean;
  subscription_status?: string;
}

const UsageTracker = () => {
  const { user } = useAuth();
  const [usage, setUsage] = useState<UsageData>({ generations_used: 0, is_premium: false });
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsage = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_usage')
        .select('generations_used, is_premium, subscription_status')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
      }

      setUsage(data || { generations_used: 0, is_premium: false });
    } catch (error) {
      console.error('Error fetching usage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, [user]);

  const freeGenerationsRemaining = Math.max(0, 10 - usage.generations_used);
  const usagePercentage = (usage.generations_used / 10) * 100;

  const handleUpgrade = async () => {
    // This will be implemented with Stripe checkout
    toast.info('Subscription system coming soon! Please check back later.');
  };

  if (isLoading) {
    return (
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`shadow-card ${usage.is_premium ? 'border-yellow-500/50 bg-gradient-to-br from-yellow-50/50 to-amber-50/50 dark:from-yellow-950/20 dark:to-amber-950/20' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {usage.is_premium ? (
            <>
              <Crown className="h-5 w-5 text-yellow-500" />
              Premium Plan
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Free Plan
            </>
          )}
        </CardTitle>
        <CardDescription>
          {usage.is_premium 
            ? 'Unlimited AI-powered generations and premium features'
            : `${freeGenerationsRemaining} free generations remaining`
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!usage.is_premium && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>Generations Used</span>
                <span>{usage.generations_used} / 10</span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
            </div>
            
            {freeGenerationsRemaining <= 3 && (
              <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                    Running Low on Generations
                  </span>
                </div>
                <p className="text-xs text-orange-700 dark:text-orange-300">
                  Upgrade to Premium for unlimited generations and advanced features.
                </p>
              </div>
            )}
          </>
        )}

        <div className="space-y-2">
          <h4 className="font-medium text-sm">
            {usage.is_premium ? 'Premium Features' : 'Available Features'}
          </h4>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span>2D Image Generation</span>
              <Badge variant={usage.is_premium ? 'default' : freeGenerationsRemaining > 0 ? 'secondary' : 'destructive'}>
                {usage.is_premium ? 'Unlimited' : freeGenerationsRemaining > 0 ? `${freeGenerationsRemaining} left` : 'Upgrade needed'}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>3D Generation</span>
              <Badge variant={usage.is_premium ? 'default' : 'outline'}>
                {usage.is_premium ? 'Available' : 'Premium Only'}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>Advanced ROI Analysis</span>
              <Badge variant={usage.is_premium ? 'default' : 'outline'}>
                {usage.is_premium ? 'Available' : 'Premium Only'}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>AI Assistant</span>
              <Badge variant="default">Always Free</Badge>
            </div>
          </div>
        </div>

        {!usage.is_premium && (
          <Button 
            onClick={handleUpgrade}
            className="w-full luxury-gradient"
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Premium
          </Button>
        )}

        {usage.is_premium && (
          <div className="text-center">
            <Badge variant="default" className="bg-yellow-500 text-white">
              <Crown className="h-3 w-3 mr-1" />
              Premium Active
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsageTracker;