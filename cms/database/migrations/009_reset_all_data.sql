-- ============================================
-- RESET ALL DATA - CLEAN SLATE
-- ============================================
-- This migration removes ALL data from the database
-- so you can start fresh with only CMS-entered data.
-- 
-- WARNING: This deletes EVERYTHING!
-- ============================================

-- Disable foreign key checks temporarily
SET session_replication_role = 'replica';

-- Delete all products first (has foreign keys)
DELETE FROM products;

-- Delete all subcategories
DELETE FROM subcategories;

-- Delete all categories
DELETE FROM categories;

-- Delete all brands
DELETE FROM brands;

-- Delete quotes if they exist
DELETE FROM quotes WHERE true;

-- Re-enable foreign key checks
SET session_replication_role = 'origin';

-- Log cleanup
DO $$
BEGIN
  RAISE NOTICE '🔥 COMPLETE DATABASE RESET!';
  RAISE NOTICE 'All products, categories, brands, and subcategories have been deleted.';
  RAISE NOTICE 'Please add your data via the CMS admin panel.';
END $$;
