CREATE TABLE public.study_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  multiplier INTEGER NOT NULL,
  duration_minutes INTEGER NOT NULL,
  total_solved INTEGER NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT ON public.study_history TO anon;
GRANT SELECT, INSERT ON public.study_history TO authenticated;
GRANT ALL ON public.study_history TO service_role;
ALTER TABLE public.study_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view study history" ON public.study_history FOR SELECT USING (true);
CREATE POLICY "Anyone can add study history" ON public.study_history FOR INSERT WITH CHECK (multiplier BETWEEN 1 AND 10 AND duration_minutes IN (10, 15) AND total_solved >= 0);