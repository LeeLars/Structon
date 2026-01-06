-- ============================================
-- CUSTOMER PROFILES TABLE
-- ============================================
-- Stores additional customer information for B2B accounts
-- Linked to users table via user_id

CREATE TABLE IF NOT EXISTS customer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Personal info
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    
    -- Company info
    company_name VARCHAR(255),
    vat_number VARCHAR(50),
    kvk_number VARCHAR(50),
    
    -- Address
    address VARCHAR(255),
    postal_code VARCHAR(20),
    city VARCHAR(100),
    country VARCHAR(2) DEFAULT 'BE',
    
    -- Preferences
    notification_quotes BOOLEAN DEFAULT true,
    notification_orders BOOLEAN DEFAULT true,
    notification_newsletter BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast lookup by user_id
CREATE INDEX IF NOT EXISTS idx_customer_profiles_user_id ON customer_profiles(user_id);

-- Log completion
DO $$
BEGIN
  RAISE NOTICE '✅ Customer profiles table created successfully!';
END $$;
