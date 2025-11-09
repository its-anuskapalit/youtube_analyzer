-- Create table for storing video analysis logs
CREATE TABLE public.video_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id TEXT NOT NULL,
  video_url TEXT NOT NULL,
  title TEXT,
  summary TEXT,
  generated_image_url TEXT,
  sentiment_score NUMERIC,
  total_comments INTEGER DEFAULT 0,
  positive_count INTEGER DEFAULT 0,
  neutral_count INTEGER DEFAULT 0,
  negative_count INTEGER DEFAULT 0,
  sentiment_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.video_analyses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read analyses (public feature)
CREATE POLICY "Anyone can view video analyses" 
ON public.video_analyses 
FOR SELECT 
USING (true);

-- Create policy to allow anyone to create analyses (public feature)
CREATE POLICY "Anyone can create video analyses" 
ON public.video_analyses 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_video_analyses_updated_at
BEFORE UPDATE ON public.video_analyses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster video_id lookups
CREATE INDEX idx_video_analyses_video_id ON public.video_analyses(video_id);
CREATE INDEX idx_video_analyses_created_at ON public.video_analyses(created_at DESC);