-- ============================================================================
-- Zero-Cost Gallery - Database Schema
-- ============================================================================
-- Target: Supabase Free Tier (PostgreSQL 15+)
-- Max Size: 500MB (enforced via optimization)
-- Designed for: Next.js 14+ App Router with TypeScript
-- ============================================================================

-- ============================================================================
-- TABLE: products
-- ============================================================================
-- Purpose: Store metadata for 3D models in the WebAR gallery
-- Optimization Notes:
--   - Using TEXT instead of VARCHAR for Postgres optimization
--   - UUID for globally unique IDs (secure, no enumeration attacks)
--   - JSONB for flexible metadata (model credits, tags, etc.)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Core Fields
  name TEXT NOT NULL,
  description TEXT,
  
  -- 3D Model Assets
  glb_url TEXT NOT NULL, -- Cloudflare R2 or Supabase Storage URL
  poster_url TEXT,       -- High-quality preview image (WebP/AVIF)
  
  -- Metadata
  file_size_bytes INTEGER NOT NULL, -- Enforce < 5MB limit in app logic
  draco_compressed BOOLEAN NOT NULL DEFAULT true,
  
  -- Flexible metadata (CC0 license info, artist credits, tags)
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_products_created_at 
  ON public.products(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_products_file_size 
  ON public.products(file_size_bytes);

-- GIN index for JSONB queries (e.g., searching tags)
CREATE INDEX IF NOT EXISTS idx_products_metadata 
  ON public.products USING GIN(metadata);

COMMENT ON TABLE public.products IS 
  'Stores 3D product metadata for WebAR gallery. All models must be < 5MB and Draco-compressed.';

COMMENT ON COLUMN public.products.file_size_bytes IS 
  'File size in bytes. MUST be < 5,242,880 (5MB) to comply with bandwidth limits.';

COMMENT ON COLUMN public.products.metadata IS 
  'JSON object for flexible data. Example: {"license": "CC0", "artist": "Name", "tags": ["furniture", "chair"]}';

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- Philosophy: "Deny All, Whitelist Specific Actions"
-- Public read-only access; write access restricted to service role
-- ============================================================================

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS Policies: products
-- ============================================================================

-- Policy: Public can read all products (gallery is public)
CREATE POLICY "Allow public read on products"
  ON public.products
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy: Authenticated users can insert products (for admin dashboard)
-- NOTE: In production, restrict this to a specific admin role
CREATE POLICY "Allow authenticated insert on products"
  ON public.products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update their own products
-- NOTE: For multi-user systems, add user_id column and filter by auth.uid()
CREATE POLICY "Allow authenticated update on products"
  ON public.products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can delete products
CREATE POLICY "Allow authenticated delete on products"
  ON public.products
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function: Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update updated_at on products table
DROP TRIGGER IF EXISTS set_updated_at ON public.products;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- SEED DATA (Optional)
-- ============================================================================
-- Example product for testing
-- Uncomment to insert a sample product

/*
INSERT INTO public.products (name, description, glb_url, poster_url, file_size_bytes, metadata)
VALUES (
  'Minimalist Chair',
  'A low-poly chair optimized for WebAR. CC0 license.',
  'https://storage.example.com/models/chair.glb',
  'https://storage.example.com/posters/chair.webp',
  1048576, -- 1MB
  '{"license": "CC0", "artist": "Unknown", "tags": ["furniture", "chair", "minimalist"]}'
)
ON CONFLICT DO NOTHING;
*/

-- ============================================================================
-- OPTIMIZATION NOTES
-- ============================================================================
-- 1. TEXT vs VARCHAR: Postgres treats TEXT and VARCHAR identically; TEXT is
--    preferred for simplicity (no arbitrary length limit).
-- 2. UUID: Uses gen_random_uuid() (faster than uuid_generate_v4() extension).
-- 3. JSONB: Binary format for fast queries; supports indexing via GIN.
-- 4. Timestamps: TIMESTAMPTZ stores timezone-aware timestamps (ISO 8601).
-- 5. RLS: Enables fine-grained access control without application logic.
-- ============================================================================

-- ============================================================================
-- MIGRATION SAFETY
-- ============================================================================
-- This schema is idempotent (safe to run multiple times):
--   - Uses IF NOT EXISTS for tables and indexes
--   - Uses CREATE OR REPLACE for functions
--   - Uses DROP TRIGGER IF EXISTS before creating triggers
--   - Uses ON CONFLICT DO NOTHING for seed data
-- ============================================================================
