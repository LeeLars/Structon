-- ============================================
-- SEED CATEGORIES AND SUBCATEGORIES
-- ============================================
-- This migration adds the main product categories
-- matching the header navigation structure.
-- ============================================

-- Main Categories
INSERT INTO categories (title, slug, description, sort_order, is_active) VALUES
('Graafbakken', 'graafbakken', 'Professionele graafbakken voor alle graafmachines', 1, true),
('Sloop- en Sorteergrijpers', 'sloop-sorteergrijpers', 'Sloop- en sorteergrijpers voor diverse toepassingen', 2, true),
('Adapters', 'adapters', 'Snelwissels en adapters voor graafmachines', 3, true),
('Overige', 'overige', 'Overige aanbouwdelen en accessoires', 4, true)
ON CONFLICT (slug) DO NOTHING;

-- Subcategories for Graafbakken
INSERT INTO subcategories (title, slug, category_id, sort_order, is_active)
SELECT 'Slotenbakken', 'slotenbakken', id, 1, true FROM categories WHERE slug = 'graafbakken'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO subcategories (title, slug, category_id, sort_order, is_active)
SELECT 'Dieplepelbakken', 'dieplepelbakken', id, 2, true FROM categories WHERE slug = 'graafbakken'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO subcategories (title, slug, category_id, sort_order, is_active)
SELECT 'Sleuvenbakken', 'sleuvenbakken', id, 3, true FROM categories WHERE slug = 'graafbakken'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO subcategories (title, slug, category_id, sort_order, is_active)
SELECT 'Kantelbakken', 'kantelbakken', id, 4, true FROM categories WHERE slug = 'graafbakken'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO subcategories (title, slug, category_id, sort_order, is_active)
SELECT 'Rioolbakken', 'rioolbakken', id, 5, true FROM categories WHERE slug = 'graafbakken'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO subcategories (title, slug, category_id, sort_order, is_active)
SELECT 'Trapezium Bakken', 'trapezium-bakken', id, 6, true FROM categories WHERE slug = 'graafbakken'
ON CONFLICT (slug) DO NOTHING;

-- Subcategories for Sloop- en Sorteergrijpers
INSERT INTO subcategories (title, slug, category_id, sort_order, is_active)
SELECT 'Sorteergrijpers', 'sorteergrijpers', id, 1, true FROM categories WHERE slug = 'sloop-sorteergrijpers'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO subcategories (title, slug, category_id, sort_order, is_active)
SELECT 'Sloopgrijpers', 'sloopgrijpers', id, 2, true FROM categories WHERE slug = 'sloop-sorteergrijpers'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO subcategories (title, slug, category_id, sort_order, is_active)
SELECT 'Puingrijpers', 'puingrijpers', id, 3, true FROM categories WHERE slug = 'sloop-sorteergrijpers'
ON CONFLICT (slug) DO NOTHING;

-- Subcategories for Adapters
INSERT INTO subcategories (title, slug, category_id, sort_order, is_active)
SELECT 'Snelwissels', 'snelwissels', id, 1, true FROM categories WHERE slug = 'adapters'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO subcategories (title, slug, category_id, sort_order, is_active)
SELECT 'Adapterplaten', 'adapterplaten', id, 2, true FROM categories WHERE slug = 'adapters'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO subcategories (title, slug, category_id, sort_order, is_active)
SELECT 'Rotators', 'rotators', id, 3, true FROM categories WHERE slug = 'adapters'
ON CONFLICT (slug) DO NOTHING;

-- Subcategories for Overige
INSERT INTO subcategories (title, slug, category_id, sort_order, is_active)
SELECT 'Ripper Tanden', 'ripper-tanden', id, 1, true FROM categories WHERE slug = 'overige'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO subcategories (title, slug, category_id, sort_order, is_active)
SELECT 'Hydraulische Hamers', 'hydraulische-hamers', id, 2, true FROM categories WHERE slug = 'overige'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO subcategories (title, slug, category_id, sort_order, is_active)
SELECT 'Egaliseerbalken', 'egaliseerbalken', id, 3, true FROM categories WHERE slug = 'overige'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO subcategories (title, slug, category_id, sort_order, is_active)
SELECT 'Verdichtingsplaten', 'verdichtingsplaten', id, 4, true FROM categories WHERE slug = 'overige'
ON CONFLICT (slug) DO NOTHING;

-- Log completion
DO $$
BEGIN
  RAISE NOTICE '✅ Categories and subcategories seeded successfully!';
END $$;
