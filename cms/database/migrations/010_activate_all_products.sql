-- Migration 010: Activate all products
-- This fixes the issue where products were created without is_active = true

-- Activate all existing products
UPDATE products SET is_active = true WHERE is_active IS NULL OR is_active = false;

-- Also ensure the default value for is_active is true
ALTER TABLE products ALTER COLUMN is_active SET DEFAULT true;

-- Verify
SELECT COUNT(*) as total_products, 
       COUNT(*) FILTER (WHERE is_active = true) as active_products
FROM products;
