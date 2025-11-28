-- Drop existing tables if they exist (for clean re-run)
DROP TABLE IF EXISTS quotes CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

-- Create Quotes table
CREATE TABLE IF NOT EXISTS quotes (
    id SERIAL PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255), -- Fallback if product deleted
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    message TEXT,
    status VARCHAR(50) DEFAULT 'new', -- new, processing, quoted, lost, won
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    total_amount DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'pending', -- pending, paid, shipped, completed, cancelled
    items JSONB, -- Store order items as JSON for simplicity
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_created_at ON quotes(created_at);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
