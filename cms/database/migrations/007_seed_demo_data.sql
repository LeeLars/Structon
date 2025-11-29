-- ============================================
-- SEED DEMO DATA FOR STRUCTON CMS
-- This migration adds demo products, categories, and brands
-- ============================================

-- First, check if we already have data
DO $$
BEGIN
  -- Only seed if tables are empty
  IF NOT EXISTS (SELECT 1 FROM categories LIMIT 1) THEN
    
    -- ============================================
    -- INSERT CATEGORIES
    -- ============================================
    INSERT INTO categories (id, title, slug, description, sort_order, is_active, seo_title, seo_description) VALUES
    ('cat-slotenbakken', 'Slotenbakken', 'slotenbakken', 'Professionele slotenbakken voor graafmachines', 1, true, 'Slotenbakken voor Graafmachines | Structon', 'Hoogwaardige slotenbakken voor alle merken graafmachines. Diverse breedtes en koppelingen beschikbaar.'),
    ('cat-graafbakken', 'Graafbakken', 'graafbakken', 'Zware graafbakken voor grote projecten', 2, true, 'Graafbakken | Structon', 'Robuuste graafbakken voor zware grondverzet werkzaamheden.'),
    ('cat-sloopgrijpers', 'Sloop- en sorteergrijpers', 'sloop-sorteergrijpers', 'Grijpers voor sloop en recycling', 3, true, 'Sloop- en Sorteergrijpers | Structon', 'Veelzijdige grijpers voor sloop, recycling en sorteerwerkzaamheden.'),
    ('cat-overige', 'Overige', 'overige', 'Overige graafmachine aanbouwdelen', 4, true, 'Overige Aanbouwdelen | Structon', 'Diverse aanbouwdelen voor graafmachines.');

    -- ============================================
    -- INSERT BRANDS
    -- ============================================
    INSERT INTO brands (id, title, slug, is_active) VALUES
    ('brand-structon', 'Structon', 'structon', true),
    ('brand-caterpillar', 'Caterpillar', 'caterpillar', true),
    ('brand-volvo', 'Volvo', 'volvo', true),
    ('brand-komatsu', 'Komatsu', 'komatsu', true),
    ('brand-hitachi', 'Hitachi', 'hitachi', true),
    ('brand-jcb', 'JCB', 'jcb', true);

    -- ============================================
    -- INSERT PRODUCTS
    -- ============================================
    INSERT INTO products (
      id, title, slug, description, category_id, brand_id,
      width, volume, weight, attachment_type,
      excavator_weight_min, excavator_weight_max,
      stock_quantity, price_excl_vat, is_active, is_featured
    ) VALUES
    -- Slotenbakken
    (
      'prod-slotenbak-600', 
      'Slotenbak 600mm CW30', 
      'slotenbak-600mm-cw30',
      'Professionele slotenbak voor graafmachines van 8-15 ton. Ideaal voor precisiewerk bij rioleringen en kabels. Vervaardigd uit hoogwaardig staal met verstevigde slijtplaten.',
      'cat-slotenbakken',
      'brand-structon',
      600, 120, 85, 'CW30',
      8000, 15000,
      5, 2450.00, true, true
    ),
    (
      'prod-slotenbak-400',
      'Slotenbak 400mm CW20',
      'slotenbak-400mm-cw20',
      'Compacte slotenbak voor kleine tot middelgrote graafmachines. Perfect voor werk in krappe ruimtes en nauwkeurig graafwerk.',
      'cat-slotenbakken',
      'brand-structon',
      400, 75, 55, 'CW20',
      5000, 10000,
      8, 1875.00, true, true
    ),
    (
      'prod-rioolbak-300',
      'Rioolbak 300mm CW20',
      'rioolbak-300mm-cw20',
      'Smalle rioolbak speciaal ontworpen voor precisiewerk. Ideaal voor rioolwerkzaamheden en kabelleggen.',
      'cat-slotenbakken',
      'brand-volvo',
      300, 60, 55, 'CW20',
      5000, 10000,
      3, 1650.00, true, false
    ),
    
    -- Graafbakken
    (
      'prod-graafbak-1200',
      'Graafbak 1200mm CW40',
      'graafbak-1200mm-cw40',
      'Zware graafbak voor grote graafmachines. Geschikt voor grondverzet en funderingswerkzaamheden. Extra verstevigde constructie voor intensief gebruik.',
      'cat-graafbakken',
      'brand-structon',
      1200, 450, 280, 'CW40',
      15000, 25000,
      3, 2945.00, true, true
    ),
    (
      'prod-graafbak-1500',
      'Graafbak 1500mm CW50',
      'graafbak-1500mm-cw50',
      'Extra brede graafbak voor maximale productiviteit. Ideaal voor grote grondverzetprojecten.',
      'cat-graafbakken',
      'brand-caterpillar',
      1500, 650, 380, 'CW50',
      20000, 35000,
      2, 3850.00, true, true
    ),
    
    -- Sloop- en sorteergrijpers
    (
      'prod-sorteergrijper-800',
      'Sorteergrijper 800mm',
      'sorteergrijper-800mm',
      'Veelzijdige sorteergrijper voor sloop en recycling. Hydraulisch aangedreven met 360° rotatie. Perfect voor het sorteren van puin, hout en metaal.',
      'cat-sloopgrijpers',
      'brand-caterpillar',
      800, NULL, 450, 'S50',
      15000, 25000,
      2, 3200.00, true, true
    ),
    (
      'prod-sloopgrijper-1000',
      'Sloopgrijper 1000mm',
      'sloopgrijper-1000mm',
      'Krachtige sloopgrijper voor zware sloopwerkzaamheden. Extra sterke tanden en hydraulische cilinders.',
      'cat-sloopgrijpers',
      'brand-volvo',
      1000, NULL, 520, 'S60',
      20000, 30000,
      1, 4250.00, true, false
    ),
    
    -- Overige
    (
      'prod-plantenbak-400',
      'Plantenbak 400mm CW10',
      'plantenbak-400mm-cw10',
      'Compacte plantenbak voor kleine graafmachines. Ideaal voor groenvoorziening en landschapsarchitectuur.',
      'cat-overige',
      'brand-structon',
      400, 45, 35, 'CW10',
      3000, 8000,
      6, 1450.00, true, false
    ),
    (
      'prod-kantelb ak-600',
      'Kantelbak 600mm CW30',
      'kantelbak-600mm-cw30',
      'Hydraulisch kantelbare bak voor talud- en greppelwerk. 45° kanteling voor optimale werkhoek.',
      'cat-overige',
      'brand-komatsu',
      600, 110, 95, 'CW30',
      8000, 15000,
      4, 2750.00, true, true
    ),
    (
      'prod-profielbak-800',
      'Profielbak 800mm CW30',
      'profielbak-800mm-cw30',
      'Profielbak met verstelbare zijkanten voor het maken van taluds en profielen. Hydraulisch verstelbaar.',
      'cat-overige',
      'brand-hitachi',
      800, 150, 125, 'CW30',
      10000, 18000,
      3, 3150.00, true, false
    );

    -- Log success
    RAISE NOTICE 'Demo data seeded successfully!';
    RAISE NOTICE '- Categories: 4';
    RAISE NOTICE '- Brands: 6';
    RAISE NOTICE '- Products: 10';
    
  ELSE
    RAISE NOTICE 'Data already exists, skipping seed';
  END IF;
END $$;
