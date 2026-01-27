-- Extend quotes table with additional fields for complete quote submissions
-- Including B2B fields, machine info, and cart items

-- Add company/B2B fields
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS vat_number VARCHAR(50);

-- Add request type
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS request_type VARCHAR(50);

-- Add machine info
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS machine_brand VARCHAR(100);
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS machine_model VARCHAR(100);
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS attachment_type VARCHAR(50);

-- Add product details
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS product_category VARCHAR(100);
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS product_slug VARCHAR(255);

-- Add cart items as JSONB for multiple products
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS cart_items JSONB;

-- Add tracking fields
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS source_page TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS industry VARCHAR(100);
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS brand VARCHAR(100);

-- Add reference number
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS reference VARCHAR(50);

-- Create index on reference for quick lookups
CREATE INDEX IF NOT EXISTS idx_quotes_reference ON quotes(reference);
