
-- Leaderboard submissions
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id TEXT NOT NULL,
  division TEXT NOT NULL CHECK (division IN ('A','B')),
  name TEXT NOT NULL,
  client_id TEXT NOT NULL,
  solved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (week_id, division, client_id)
);

CREATE INDEX submissions_week_div_idx ON public.submissions (week_id, division, solved_at);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Public can read leaderboard
CREATE POLICY "Anyone can view submissions"
  ON public.submissions FOR SELECT
  USING (true);

-- Inserts go through edge function only (uses service role); block direct inserts
-- Actually we'll allow anon inserts but validate via edge function. Use edge function approach:
-- No INSERT policy = no inserts via anon key. Edge function with service role bypasses RLS.
