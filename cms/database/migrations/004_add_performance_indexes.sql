-- Performance Indexes Migration
-- Adds indexes to improve query performance

-- Products table indexes
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_subcategory_id ON products(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Composite index for common queries (active products by category)
CREATE INDEX IF NOT EXISTS idx_products_active_category ON products(is_active, category_id) WHERE is_active = true;

-- Composite index for featured products
CREATE INDEX IF NOT EXISTS idx_products_featured_active ON products(is_featured, is_active) WHERE is_featured = true AND is_active = true;

-- Excavator weight range index for filtering
CREATE INDEX IF NOT EXISTS idx_products_weight_range ON products(excavator_weight_min, excavator_weight_max);

-- Categories indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);

-- Subcategories indexes
CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_slug ON subcategories(slug);
CREATE INDEX IF NOT EXISTS idx_subcategories_tonnage ON subcategories(tonnage_min, tonnage_max);

-- Brands indexes
CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);
CREATE INDEX IF NOT EXISTS idx_brands_is_active ON brands(is_active);

-- Product prices indexes
CREATE INDEX IF NOT EXISTS idx_product_prices_product_id ON product_prices(product_id);
CREATE INDEX IF NOT EXISTS idx_product_prices_user_id ON product_prices(visible_for_user_id);
CREATE INDEX IF NOT EXISTS idx_product_prices_created_at ON product_prices(created_at DESC);

-- Composite index for getting latest price per product
CREATE INDEX IF NOT EXISTS idx_product_prices_latest ON product_prices(product_id, visible_for_user_id, created_at DESC);

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Product sectors junction table
CREATE INDEX IF NOT EXISTS idx_product_sectors_product_id ON product_sectors(product_id);
CREATE INDEX IF NOT EXISTS idx_product_sectors_sector_id ON product_sectors(sector_id);

-- Full text search indexes (for future search functionality)
CREATE INDEX IF NOT EXISTS idx_products_title_search ON products USING gin(to_tsvector('dutch', title));
CREATE INDEX IF NOT EXISTS idx_products_description_search ON products USING gin(to_tsvector('dutch', description));

-- Analyze tables to update statistics
ANALYZE products;
ANALYZE categories;
ANALYZE subcategories;
ANALYZE brands;
ANALYZE product_prices;
ANALYZE users;
ANALYZE product_sectors;
