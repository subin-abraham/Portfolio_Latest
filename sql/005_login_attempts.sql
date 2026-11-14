-- Audit trail for login attempts (success + failure). Useful for abuse review.

CREATE TABLE IF NOT EXISTS login_attempts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_attempted TEXT,
  ip_address    TEXT,
  user_agent    TEXT,
  success       BOOLEAN NOT NULL DEFAULT FALSE,
  failure_reason TEXT,
  honeypot_triggered BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS login_attempts_created_at_idx
  ON login_attempts (created_at DESC);

CREATE INDEX IF NOT EXISTS login_attempts_ip_idx
  ON login_attempts (ip_address);

COMMENT ON TABLE login_attempts IS 'Security audit log for admin authentication attempts.';
