-- ============================================
-- SEED BRANDS
-- ============================================
-- This migration adds the main excavator brands
-- matching the brand pages on the website.
-- ============================================

INSERT INTO brands (title, slug, is_active) VALUES
('Caterpillar', 'caterpillar', true),
('Volvo', 'volvo', true),
('Komatsu', 'komatsu', true),
('Hitachi', 'hitachi', true),
('Liebherr', 'liebherr', true),
('JCB', 'jcb', true),
('Kubota', 'kubota', true),
('Takeuchi', 'takeuchi', true),
('Yanmar', 'yanmar', true),
('Doosan', 'doosan', true),
('Case', 'case', true),
('Hyundai', 'hyundai', true),
('Kobelco', 'kobelco', true),
('Sany', 'sany', true),
('Wacker Neuson', 'wacker-neuson', true)
ON CONFLICT (slug) DO NOTHING;

-- Log completion
DO $$
BEGIN
  RAISE NOTICE '✅ Brands seeded successfully!';
END $$;
