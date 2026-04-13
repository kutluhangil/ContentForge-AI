-- RPC function for atomic usage increment
-- Called by the worker after a successful conversion

CREATE OR REPLACE FUNCTION increment_usage(
  p_user_id UUID,
  p_period_start DATE
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO usage (user_id, period_start, conversions_used)
  VALUES (p_user_id, p_period_start, 1)
  ON CONFLICT (user_id, period_start)
  DO UPDATE SET
    conversions_used = usage.conversions_used + 1,
    updated_at = NOW();
END;
$$;
