-- ============================================================
-- BROKENCHEATS STORE - ASSETS TABLE SCHEMA (PostgreSQL / Supabase)
-- Target Domain: free.brokencheats.store
-- ============================================================

-- 0. Drop existing tables if re-initializing
-- DROP TABLE IF EXISTS public.asset_reviews CASCADE;
-- DROP TABLE IF EXISTS public.asset_analytics CASCADE;
-- DROP TABLE IF EXISTS public.assets CASCADE;

-- 1. Create Assets Table
CREATE TABLE IF NOT EXISTS public.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT DEFAULT 'Game Optimizer',
    slug TEXT UNIQUE NOT NULL,
    direct_download_url TEXT,
    file_path TEXT,
    ad_fly_link TEXT,
    download_count INT DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (direct_download_url IS NOT NULL OR file_path IS NOT NULL)
);

-- 2. Indexes for High-Performance Queries
CREATE INDEX IF NOT EXISTS idx_assets_slug ON public.assets(slug);
CREATE INDEX IF NOT EXISTS idx_assets_status ON public.assets(status);
CREATE INDEX IF NOT EXISTS idx_assets_category ON public.assets(category);

-- 3. Analytics Table
CREATE TABLE IF NOT EXISTS public.asset_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_slug TEXT NOT NULL REFERENCES public.assets(slug) ON DELETE CASCADE,
    country TEXT,
    event_type TEXT CHECK (event_type IN ('view', 'download')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_analytics_asset_slug ON public.asset_analytics(asset_slug);

-- 4. Reviews Table
CREATE TABLE IF NOT EXISTS public.asset_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_slug TEXT NOT NULL REFERENCES public.assets(slug) ON DELETE CASCADE,
    reviewer_name TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_reviews_asset_slug ON public.asset_reviews(asset_slug);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.asset_reviews(created_at DESC);

-- 5. RPC Function for Safe Atomic Download Count Incrementing
CREATE OR REPLACE FUNCTION increment_asset_download(asset_slug TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE public.assets
    SET download_count = download_count + 1
    WHERE slug = asset_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Storage Bucket Configuration
-- We must insert the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('assets_bucket', 'assets_bucket', true)
ON CONFLICT (id) DO NOTHING;

-- 7. Storage Policies
-- Allow public read access to all files in assets_bucket
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'assets_bucket');

-- Allow anon/authenticated uploads (In a real production app, limit this to authenticated admins)
CREATE POLICY "Allow public uploads" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'assets_bucket');

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_reviews ENABLE ROW LEVEL SECURITY;

-- 9. Public Policies
CREATE POLICY "Allow public read active assets" ON public.assets FOR SELECT USING (true);
CREATE POLICY "Allow service role full access assets" ON public.assets FOR ALL USING (true);

CREATE POLICY "Allow public insert analytics" ON public.asset_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service role read analytics" ON public.asset_analytics FOR SELECT USING (true);

CREATE POLICY "Allow public insert reviews" ON public.asset_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read reviews" ON public.asset_reviews FOR SELECT USING (true);

