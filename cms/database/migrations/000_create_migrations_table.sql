-- ============================================
-- MIGRATION TRACKING TABLE
-- ============================================
-- This table tracks which migrations have been applied
-- to prevent re-running migrations on every server restart.
-- ============================================

CREATE TABLE IF NOT EXISTS _migrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Log creation
DO $$
BEGIN
  RAISE NOTICE '✅ Migration tracking table created';
END $$;
