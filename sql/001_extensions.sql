-- Run in Neon SQL Editor (or via neonctl) before app tables.
-- Enables UUID generation used by admin auth tables.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
