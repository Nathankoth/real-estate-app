-- Add credits tracking to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 3;

-- Create ROI monthly entries table
CREATE TABLE IF NOT EXISTS public.roi_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_name TEXT,
  month DATE NOT NULL,
  income NUMERIC,
  expenses NUMERIC,
  roi NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on roi_entries
ALTER TABLE public.roi_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for roi_entries
CREATE POLICY "Users can view their own ROI entries" 
ON public.roi_entries 
FOR SELECT 
USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create their own ROI entries" 
ON public.roi_entries 
FOR INSERT 
WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own ROI entries" 
ON public.roi_entries 
FOR UPDATE 
USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own ROI entries" 
ON public.roi_entries 
FOR DELETE 
USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_roi_entries_user_month ON public.roi_entries (user_id, month);

-- Create market analytics cache table
CREATE TABLE IF NOT EXISTS public.analytics_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on analytics_cache (public read for now)
ALTER TABLE public.analytics_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read analytics cache" 
ON public.analytics_cache 
FOR SELECT 
USING (true);

CREATE POLICY "Service can manage analytics cache" 
ON public.analytics_cache 
FOR ALL 
USING (true);

-- Create trigger to update profiles updated_at
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profiles_updated_at();