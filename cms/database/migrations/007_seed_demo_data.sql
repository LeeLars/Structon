-- ============================================
-- SEED DATA DISABLED
-- ============================================
-- Demo data is no longer needed.
-- All data should come from the CMS admin panel.
-- 
-- This file is kept for migration history but does nothing.
-- ============================================

DO $$
BEGIN
  RAISE NOTICE 'Seed data migration skipped - using CMS data only';
END $$;
