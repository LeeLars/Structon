-- Add viewed tracking for quotes, orders, and requests
-- Allows notification badges for unviewed items

-- Add viewed column to quotes
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS viewed BOOLEAN DEFAULT FALSE;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS viewed_at TIMESTAMP WITH TIME ZONE;

-- Add viewed column to orders (if table exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'orders') THEN
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS viewed BOOLEAN DEFAULT FALSE;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS viewed_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_quotes_viewed ON quotes(viewed);
CREATE INDEX IF NOT EXISTS idx_orders_viewed ON orders(viewed) WHERE EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'orders');

-- Note: Requests/aanvragen table will be created separately if needed
