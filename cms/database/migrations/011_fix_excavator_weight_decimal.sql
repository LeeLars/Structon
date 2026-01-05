-- ============================================
-- FIX EXCAVATOR WEIGHT COLUMNS TO DECIMAL
-- Change from INTEGER to DECIMAL(5,2) to support values like 1.5, 2.5 ton
-- ============================================

-- Alter excavator_weight_min to DECIMAL
ALTER TABLE products 
ALTER COLUMN excavator_weight_min TYPE DECIMAL(5,2);

-- Alter excavator_weight_max to DECIMAL
ALTER TABLE products 
ALTER COLUMN excavator_weight_max TYPE DECIMAL(5,2);
