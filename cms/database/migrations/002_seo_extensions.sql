-- Structon SEO Extensions
-- Migration 002: Add SEO fields and new tables

-- ============================================
-- SEO PAGES TABLE (for static/landing pages)
-- ============================================
CREATE TABLE IF NOT EXISTS seo_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    page_type VARCHAR(50) NOT NULL, -- 'category', 'brand', 'sector', 'landing'
    
    -- SEO Meta
    title_tag VARCHAR(70),
    meta_description VARCHAR(160),
    og_title VARCHAR(70),
    og_description VARCHAR(200),
    og_image_url VARCHAR(500),
    canonical_url VARCHAR(500),
    
    -- Content
    h1 VARCHAR(255),
    intro_text TEXT,
    long_content TEXT,
    
    -- Structured Data (JSON-LD)
    structured_data JSONB DEFAULT '{}'::jsonb,
    
    -- Status
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MACHINE BRANDS (for SEO landing pages)
-- Separate from product brands - these are excavator manufacturers
-- ============================================
CREATE TABLE IF NOT EXISTS machine_brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    logo_url VARCHAR(500),
    description TEXT,
    
    -- SEO
    seo_title VARCHAR(70),
    seo_description VARCHAR(160),
    seo_content TEXT,
    
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PRODUCT-MACHINE BRAND COMPATIBILITY
-- ============================================
CREATE TABLE IF NOT EXISTS product_machine_brands (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    machine_brand_id UUID REFERENCES machine_brands(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, machine_brand_id)
);

-- ============================================
-- ADD SEO FIELDS TO EXISTING TABLES
-- ============================================

-- Categories SEO fields
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS seo_title VARCHAR(70),
ADD COLUMN IF NOT EXISTS seo_description VARCHAR(160),
ADD COLUMN IF NOT EXISTS seo_h1 VARCHAR(255),
ADD COLUMN IF NOT EXISTS seo_intro TEXT,
ADD COLUMN IF NOT EXISTS seo_content TEXT,
ADD COLUMN IF NOT EXISTS og_image_url VARCHAR(500);

-- Products SEO fields
ALTER TABLE products
ADD COLUMN IF NOT EXISTS seo_title VARCHAR(70),
ADD COLUMN IF NOT EXISTS seo_description VARCHAR(160),
ADD COLUMN IF NOT EXISTS seo_content TEXT;

-- Sectors SEO fields
ALTER TABLE sectors
ADD COLUMN IF NOT EXISTS seo_title VARCHAR(70),
ADD COLUMN IF NOT EXISTS seo_description VARCHAR(160),
ADD COLUMN IF NOT EXISTS seo_h1 VARCHAR(255),
ADD COLUMN IF NOT EXISTS seo_intro TEXT,
ADD COLUMN IF NOT EXISTS seo_content TEXT;

-- Brands SEO fields (product brands)
ALTER TABLE brands
ADD COLUMN IF NOT EXISTS seo_title VARCHAR(70),
ADD COLUMN IF NOT EXISTS seo_description VARCHAR(160),
ADD COLUMN IF NOT EXISTS description TEXT;

-- ============================================
-- REDIRECTS TABLE (for SEO)
-- ============================================
CREATE TABLE IF NOT EXISTS redirects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_path VARCHAR(500) NOT NULL,
    to_path VARCHAR(500) NOT NULL,
    redirect_type INTEGER DEFAULT 301, -- 301 or 302
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_redirects_from ON redirects(from_path);

-- ============================================
-- INDEXES FOR SEO TABLES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_seo_pages_slug ON seo_pages(slug);
CREATE INDEX IF NOT EXISTS idx_seo_pages_type ON seo_pages(page_type);
CREATE INDEX IF NOT EXISTS idx_machine_brands_slug ON machine_brands(slug);

-- ============================================
-- TRIGGERS
-- ============================================
CREATE TRIGGER update_seo_pages_updated_at BEFORE UPDATE ON seo_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
