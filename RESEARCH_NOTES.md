# Research & Architecture Notes: Cyberpunk Digital Asset Platform (free.brokencheats.store)

**Timestamp:** 2026-07-30T00:20:00Z  
**Project Objective:** Build a high-performance, visually striking distribution landing page and web platform dedicated to sharing custom digital game assets, patch optimizations, and utility configurations.

---

## 1. Domain & Business Objectives Analysis
- **Domain Context:** `free.brokencheats.store` (subdomain targeting gaming optimization utilities, low-latency registry tweaks, custom game configs, patch updates).
- **Core Value Proposition:** Deliver 100% free community utility downloads while maximizing traffic monetization via integrated ad placement spaces, link locker pass-through (Linkvertise, AdMaven, etc.), overlay pop-unders, and countdown timers to increase ad viewability/engagement.
- **Key Experience Requirements:**
  - Dark Cyberpunk / Gaming aesthetic (dark greys, `#0b0c10` pitch background, vibrant neon red `#ef4444`, neon purple `#a855f7`, glassmorphic backdrop filters, custom glows).
  - Heavy usage of smooth animations via `framer-motion` and micro-interactions.
  - Micro countdown exposure timer on individual asset pages (`/download/[slug]`) to keep visitors engaged while ad banners load.
  - Protected admin panel for staff to publish assets, auto-generate short clean URL slugs, toggle visibility, and track real-time download analytics.

---

## 2. Technical Stack Selection
- **Framework:** Next.js 14+ (App Router, TypeScript) for SSR/SSG efficiency, SEO optimization, fast route navigation, and server API routes.
- **Styling:** Tailwind CSS v4 + Custom Cyberpunk Tokens (`globals.css`) with custom CSS utilities for glassmorphism, animated gradients, neon glows, and dark cyberpunk themes.
- **UI & Icons:** Lucide React icons for crisp gaming & administrative UI elements.
- **Animations:** Framer Motion (`framer-motion`) for smooth card entry, modal transitions, timer countdown rings, and hover states.
- **Database / BaaS:** Supabase PostgreSQL with `assets` table, custom indexes, RLS policies, and `increment_asset_download` stored procedure (RPC).
- **Fallback Resilience:** Full in-memory mock data store layer within `src/lib/assets.ts` allowing instant zero-config client execution and seamless fallback if Supabase environment variables are missing or transitioning.

---

## 3. Database Schema Design (PostgreSQL / Supabase)
```sql
CREATE TABLE IF NOT EXISTS public.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT DEFAULT 'Game Optimizer',
    slug TEXT UNIQUE NOT NULL,
    direct_download_url TEXT NOT NULL,
    ad_fly_link TEXT,
    download_count INT DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for instant lookup by slug & status filtering
CREATE INDEX IF NOT EXISTS idx_assets_slug ON public.assets(slug);
CREATE INDEX IF NOT EXISTS idx_assets_status ON public.assets(status);

-- Atomic RPC function for counting downloads safely
CREATE OR REPLACE FUNCTION increment_asset_download(asset_slug TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE public.assets
    SET download_count = download_count + 1
    WHERE slug = asset_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 4. Application Architecture & File Structure
```
e:/uplaodbc/
├── public/
│   ├── favicon.ico
│   └── og-image.png
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.tsx                     # Protected Admin Dashboard
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   └── login/route.ts           # Staff Admin Auth API
│   │   │   └── assets/
│   │   │       ├── route.ts                 # List & Create Assets API
│   │   │       └── [slug]/
│   │   │           └── route.ts             # Get Asset, Increment & Toggle Status API
│   │   ├── assets/
│   │   │   └── page.tsx                     # Full Asset Catalog Browse Page
│   │   ├── download/
│   │   │   └── [slug]/
│   │   │       └── page.tsx                 # Dynamic Asset Download & Timer Page
│   │   ├── globals.css                      # Cyberpunk Theme Tokens & Utilities
│   │   ├── layout.tsx                       # Root Layout & Ad Script Containers
│   │   └── page.tsx                         # Cyberpunk Landing Page
│   ├── components/
│   │   ├── AdminDashboardClient.tsx         # Admin Asset & Ad Engine Management UI
│   │   ├── AdSpaces.tsx                     # Banner, Interstitial, & Pop-Under Ad Engine
│   │   ├── AssetsClientPage.tsx             # Interactive Asset Explorer UI
│   │   ├── DownloadClientPage.tsx           # Countdown Micro-Timer & Unlock Trigger UI
│   │   ├── HomePageClient.tsx               # Main Landing Page Client Component
│   │   └── Navbar.tsx                       # Neon Cyberpunk Header & Navigation
│   └── lib/
│       ├── assets.ts                        # Data Layer (Supabase + In-Memory Fallback)
│       ├── supabase.ts                      # Supabase Client Credentials
│       ├── supabase/
│       │   └── assets_schema.sql            # PostgreSQL DDL & RLS Policies
│       └── types/
│           └── asset.ts                     # TypeScript Type Definitions
├── BUILD_LOG.md
├── RESEARCH_NOTES.md
├── package.json
└── tsconfig.json
```

---

## 5. Monetization & Ad Placement Flow
1. **Header & Sidebar Ad Slots:** Non-intrusive banner spaces for high CTR.
2. **Dynamic Countdown Micro-Timer:** 10-15s timer on `/download/[slug]` page that engages users before the download trigger unlocks.
3. **Monetized Pass-Through Button:** Optional `ad_fly_link` button (Linkvertise, AdMaven) to monetize external clicks.
4. **Direct Download Trigger:** Unlocked direct download link that fires an asynchronous POST request to increment `download_count`.
5. **Pop-Under Injection Container:** Dedicated space in `<AdSpaces />` component for inserting third-party pop-under scripts (e.g. PropellerAds, PopAds).
