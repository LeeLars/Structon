-- Migration 003: Create subcategories table
-- Voor tonnage-gebaseerde indeling van kraanbakken

-- ============================================
-- SUBCATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS subcategories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Tonnage range voor filtering
    tonnage_min DECIMAL(4, 1), -- bijv. 1.0 ton
    tonnage_max DECIMAL(4, 1), -- bijv. 2.5 ton
    
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Unieke combinatie van category + slug
    UNIQUE(category_id, slug)
);

-- ============================================
-- UPDATE PRODUCTS TABLE
-- ============================================
-- Voeg subcategory_id toe aan products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL;

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_subcategories_category ON subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_slug ON subcategories(slug);
CREATE INDEX IF NOT EXISTS idx_subcategories_active ON subcategories(is_active);
CREATE INDEX IF NOT EXISTS idx_subcategories_tonnage ON subcategories(tonnage_min, tonnage_max);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE TRIGGER update_subcategories_updated_at 
BEFORE UPDATE ON subcategories 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
