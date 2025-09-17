-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  display_name TEXT
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT[] NOT NULL DEFAULT '{}',
  total_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  added_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  image_url TEXT,
  verified BOOLEAN DEFAULT FALSE
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, product_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products USING GIN(category);
CREATE INDEX IF NOT EXISTS idx_products_total_votes ON products(total_votes DESC);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_product_id ON votes(product_id);
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON products USING gin (name gin_trgm_ops);

-- Enable full text search
CREATE INDEX IF NOT EXISTS idx_products_fts ON products USING gin(to_tsvector('english', name || ' ' || description));

-- Function to update product vote count
CREATE OR REPLACE FUNCTION update_product_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE products
    SET total_votes = total_votes + 1,
        updated_at = NOW()
    WHERE id = NEW.product_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE products
    SET total_votes = total_votes - 1,
        updated_at = NOW()
    WHERE id = OLD.product_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically update vote counts
DROP TRIGGER IF EXISTS trigger_update_product_vote_count ON votes;
CREATE TRIGGER trigger_update_product_vote_count
  AFTER INSERT OR DELETE ON votes
  FOR EACH ROW EXECUTE FUNCTION update_product_vote_count();

-- Function to update category product counts
CREATE OR REPLACE FUNCTION update_category_product_count()
RETURNS TRIGGER AS $$
DECLARE
  cat TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    FOREACH cat IN ARRAY NEW.category
    LOOP
      UPDATE categories
      SET product_count = product_count + 1
      WHERE slug = cat;
    END LOOP;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    FOREACH cat IN ARRAY OLD.category
    LOOP
      UPDATE categories
      SET product_count = GREATEST(product_count - 1, 0)
      WHERE slug = cat;
    END LOOP;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle category changes
    FOREACH cat IN ARRAY OLD.category
    LOOP
      IF NOT (cat = ANY(NEW.category)) THEN
        UPDATE categories
        SET product_count = GREATEST(product_count - 1, 0)
        WHERE slug = cat;
      END IF;
    END LOOP;

    FOREACH cat IN ARRAY NEW.category
    LOOP
      IF NOT (cat = ANY(OLD.category)) THEN
        UPDATE categories
        SET product_count = product_count + 1
        WHERE slug = cat;
      END IF;
    END LOOP;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically update category counts
DROP TRIGGER IF EXISTS trigger_update_category_product_count ON products;
CREATE TRIGGER trigger_update_category_product_count
  AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW EXECUTE FUNCTION update_category_product_count();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, email_verified)
  VALUES (NEW.id, NEW.email, NEW.email_confirmed_at IS NOT NULL);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Products policies
CREATE POLICY "Products are viewable by everyone." ON products FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert products." ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own products." ON products FOR UPDATE USING (auth.uid() = added_by);

-- Votes policies
CREATE POLICY "Users can view their own votes." ON votes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own votes." ON votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own votes." ON votes FOR DELETE USING (auth.uid() = user_id);

-- Categories policies
CREATE POLICY "Categories are viewable by everyone." ON categories FOR SELECT USING (true);

-- Insert some initial categories
INSERT INTO categories (name, slug, description) VALUES
('Electronics', 'electronics', 'Electronic devices and gadgets'),
('Home & Kitchen', 'home-kitchen', 'Home appliances and kitchen tools'),
('Sports & Outdoors', 'sports-outdoors', 'Sports equipment and outdoor gear'),
('Books', 'books', 'Books and literature'),
('Automotive', 'automotive', 'Car accessories and automotive products'),
('Health & Beauty', 'health-beauty', 'Health and beauty products'),
('Toys & Games', 'toys-games', 'Toys, games, and entertainment'),
('Clothing', 'clothing', 'Apparel and fashion'),
('Food & Beverage', 'food-beverage', 'Food and drink products'),
('Office', 'office', 'Office supplies and equipment')
ON CONFLICT (slug) DO NOTHING;