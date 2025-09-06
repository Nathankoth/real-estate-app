-- Create user_usage table for tracking generations
CREATE TABLE public.user_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  generations_used INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT false,
  subscription_id TEXT,
  subscription_status TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own usage" ON public.user_usage
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage" ON public.user_usage
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service can manage user usage" ON public.user_usage
FOR ALL USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_user_usage_updated_at
BEFORE UPDATE ON public.user_usage
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();