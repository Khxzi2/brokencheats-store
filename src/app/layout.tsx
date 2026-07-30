import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/Navbar';
import GlobalAds from '@/components/GlobalAds';
import AdsterraBanners from '@/components/AdsterraBanners';
import AdScripts from '@/components/AdScripts';
import AdBannerWrapper from '@/components/AdBannerWrapper';

const inter = Inter({ subsets: ['latin'], display: 'swap', fallback: ['system-ui', 'sans-serif'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://free.brokencheats.store'),
  manifest: '/manifest.json',
  title: {
    default: 'BrokenCheats Free Store',
    template: '%s | BrokenCheats Free Store',
  },
  description: 'Download 100% free verified game optimization configs, ultra-low latency registry tweaks, FPS boosters, and network patches. Trusted by the BrokenCheats community.',
  keywords: [
    'brokencheats', 'free cheats', 'free fire cheats', 'free fire aimbot', 'free fire hacks',
    'panels', 'free panels', 'gaming panels', 'cheat panels', 'game optimizer', 'fps boost',
    'registry tweaks', 'low latency config', 'network tweak', 'windows optimizer',
    'gaming performance', 'latency patch', 'game configs', 'free gaming tools',
    'fps unlocker', 'ping reducer', 'free store', 'brokencheats store', 'roblox hacks',
    'roblox exploits', 'roblox scripts', 'krnl', 'synapse x free', 'script executor',
    'fivem cheats', 'fivem spoofer', 'hwid spoofer free', 'hwid changer', 'valorant cheats',
    'valorant triggerbot', 'valorant aimbot', 'cs2 cheats', 'cs2 wallhack', 'cs2 aimbot',
    'fortnite cheats', 'fortnite softaim', 'fortnite aimbot free', 'apex legends cheats',
    'apex aimbot', 'warzone cheats', 'warzone unlock tool', 'cod cheats', 'rust cheats',
    'rust scripts', 'rainbow six siege cheats', 'r6s cheats', 'tarkov cheats', 'eft cheats',
    'gta 5 mod menu', 'gta v mods', 'kiddion mod menu', 'stand mod menu', '2take1 free',
    'minecraft clients', 'vape v4 free', 'minecraft ghost client', 'lunar client fps boost',
    'badlion client', 'osu cheats', 'osu relax hack', 'genshin impact cheats', 'genshin mods',
    'bypass eac', 'bypass battleye', 'bypass vanguard', 'anti-cheat bypass', 'driver bypass',
    'ring0 bypass', 'kernel cheats', 'external aimbot', 'internal cheats', 'memory editor',
    'cheat engine bypass', 'undedected cheats', 'free undetected hacks', 'game hackers',
    'game hacking forum', 'cheating community', 'mod menu', 'aim assist', 'recoil macro',
    'no recoil script', 'bloody mouse macro', 'logitech macro', 'razer synapse macro',
    'aimlab rank up', 'mouse acceleration fix', 'markc mouse fix', 'timer resolution tool',
    'islc free', 'intelligent standby list cleaner', 'process lasso pro', 'tcp optimizer',
    'dns jumper', 'sg tcp optimizer', 'filterkeys setter', 'keyboard input lag fix',
    'monitor overclocking', 'cru utility', 'custom resolution utility', 'nvidia profile inspector',
    'amd radeon tweaks', 'gpu overclocking', 'msi afterburner', 'cpu unparking tool',
    'parkcontrol', 'windows 10 debloater', 'windows 11 debloater', 'revios', 'atlasos',
    'custom os gaming', 'custom windows iso', 'tweaked windows', 'dpc latency checker',
    'latencymon', 'interrupt affinity policy tool', 'msi mode utility', 'free tweaks'
  ],
  authors: [{ name: 'BrokenCheats', url: 'https://free.brokencheats.store' }],
  creator: 'BrokenCheats',
  publisher: 'BrokenCheats',
  category: 'gaming',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Open Graph (Facebook, WhatsApp, Discord, Telegram, LinkedIn)
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://free.brokencheats.store',
    siteName: 'BrokenCheats Free Store',
    title: 'BrokenCheats Free Store — Game Optimizers & Latency Tweaks',
    description: 'Download 100% free verified game tweaks, FPS boosters, and low-latency configs. Trusted by gamers worldwide.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BrokenCheats Free Store — Game Optimizers & Performance Tweaks',
        type: 'image/png',
      },
    ],
  },
  // Twitter / X Cards
  twitter: {
    card: 'summary_large_image',
    site: '@brokencheats',
    creator: '@brokencheats',
    title: 'BrokenCheats Free Store — Game Optimizers & FPS Boost Tools',
    description: 'Free verified game configs, ultra-low latency tweaks, and FPS boosters. Download now.',
    images: ['/og-image.jpg'],
  },
  // Icons / PWA
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.jpg', sizes: '180x180' }],
    shortcut: '/favicon.ico',
  },
  // Verification
  verification: {
    google: 'google-site-verification-placeholder',
  },
  // App links (WhatsApp / mobile deep link)
  appLinks: {
    web: {
      url: 'https://free.brokencheats.store',
      should_fallback: true,
    },
  },
  other: {
    // Discord embed color
    'theme-color': '#1e3a8a',
    // WhatsApp / general
    'application-name': 'BrokenCheats Free Store',
    // Mobile
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'BC Free Store',
    'format-detection': 'telephone=no',
    // MS Tiles
    'msapplication-TileColor': '#0b0c10',
    'msapplication-TileImage': '/icon-192.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#1e40af" />
        <meta name="color-scheme" content="dark" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "BrokenCheats Free Store",
              "url": "https://free.brokencheats.store",
              "description": "Free verified game optimization configs, latency tweaks, and FPS boosters",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://free.brokencheats.store/assets?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <AdScripts />
        {/* Register Service Worker for PWA */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.warn('SW registration failed:', err);
                  });
                });
              }
            `
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-[#0b0c10] text-slate-100 antialiased flex flex-col justify-between`}>
        <div>
          <Navbar />
          <AdBannerWrapper />
          <main className="min-h-[calc(100vh-4rem-5rem)]">
            {children}
          </main>
          <AdBannerWrapper />
        </div>

        {/* Global Footer */}
        <footer className="border-t border-blue-500/20 bg-[#0b0c10]/90 backdrop-blur-xl py-8 px-4 text-center">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-300">free.brokencheats.store</span>
              <span>— Community Digital Asset Distribution Engine</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 font-medium">
              <a href="/assets" className="hover:text-blue-400 transition-colors">Catalog</a>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400">100% Verified Safe</span>
            </div>
          </div>
        </footer>

        <GlobalAds />
      </body>
    </html>
  );
}
