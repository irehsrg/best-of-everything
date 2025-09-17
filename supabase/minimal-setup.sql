-- MINIMAL DATABASE SETUP FOR BEST OF EVERYTHING
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (CAREFUL - this deletes data!)
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Drop existing functions and triggers
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_product_vote_count() CASCADE;

-- Create profiles table (simpler version)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT[] NOT NULL DEFAULT '{}',
  total_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  added_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  image_url TEXT,
  verified BOOLEAN DEFAULT TRUE
);

-- Create votes table
CREATE TABLE votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_user_product_vote UNIQUE(user_id, product_id)
);

-- Create indexes
CREATE INDEX idx_products_votes ON products(total_votes DESC);
CREATE INDEX idx_products_created ON products(created_at DESC);
CREATE INDEX idx_votes_user ON votes(user_id);
CREATE INDEX idx_votes_product ON votes(product_id);

-- Simple vote count function
CREATE OR REPLACE FUNCTION update_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE products SET total_votes = total_votes + 1 WHERE id = NEW.product_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE products SET total_votes = GREATEST(total_votes - 1, 0) WHERE id = OLD.product_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for vote counting
CREATE TRIGGER vote_count_trigger
  AFTER INSERT OR DELETE ON votes
  FOR EACH ROW EXECUTE FUNCTION update_vote_count();

-- Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add products" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own products" ON products FOR UPDATE USING (auth.uid() = added_by);

CREATE POLICY "Users can view own votes" ON votes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own votes" ON votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own votes" ON votes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (true);

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
('Electronics', 'electronics', 'Gadgets and electronic devices'),
('Home & Kitchen', 'home-kitchen', 'Home and kitchen essentials'),
('Sports', 'sports-outdoors', 'Sports and outdoor equipment'),
('Books', 'books', 'Books and reading materials'),
('Automotive', 'automotive', 'Car and automotive products'),
('Health & Beauty', 'health-beauty', 'Health and beauty products'),
('Toys & Games', 'toys-games', 'Toys, games and entertainment'),
('Clothing', 'clothing', 'Clothing and fashion'),
('Food', 'food-beverage', 'Food and beverages'),
('Office', 'office', 'Office and work supplies');

-- Insert some sample products for testing
INSERT INTO products (name, description, category, verified) VALUES
('iPhone 15 Pro', 'Latest iPhone with amazing camera and performance', ARRAY['electronics'], true),
('Stanley Tumbler', 'Keep drinks cold for 24 hours, hot for 12 hours', ARRAY['home-kitchen'], true),
('Nike Air Max', 'Comfortable running shoes with great cushioning', ARRAY['sports-outdoors'], true),
('The Psychology of Money', 'Great book about financial psychology', ARRAY['books'], true),
('Tesla Model 3', 'Electric car with autopilot features', ARRAY['automotive'], true);

-- Final verification
SELECT 'Setup complete! Tables created:' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('profiles', 'products', 'votes', 'categories');