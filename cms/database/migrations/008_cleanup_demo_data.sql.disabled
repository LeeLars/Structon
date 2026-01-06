-- ============================================
-- CLEANUP DEMO DATA
-- ============================================
-- This migration removes all demo/seed data
-- so only real CMS data remains.
-- ============================================

-- Delete demo products (those with 'prod-' prefix IDs)
-- Cast UUID to text for LIKE operator
DELETE FROM products WHERE id::text LIKE 'prod-%';

-- Delete demo brands (those with 'brand-' prefix IDs)
DELETE FROM brands WHERE id::text LIKE 'brand-%';

-- Delete demo categories (those with 'cat-' prefix IDs)
DELETE FROM categories WHERE id::text LIKE 'cat-%';

-- Log cleanup
DO $$
BEGIN
  RAISE NOTICE '🧹 Demo data cleanup complete!';
  RAISE NOTICE 'All seed/demo data has been removed.';
  RAISE NOTICE 'Only CMS-entered data remains.';
END $$;
