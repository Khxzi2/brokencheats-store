import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/Navbar';
import GlobalAds from '@/components/GlobalAds';
import AdsterraBanners from '@/components/AdsterraBanners';

const inter = Inter({ subsets: ['latin'], display: 'swap', fallback: ['system-ui', 'sans-serif'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://free.brokencheats.store'),
  title: {
    default: 'BrokenCheats Free Store — Game Optimizers, Latency Tweaks & FPS Boosters',
    template: '%s | BrokenCheats Free Store',
  },
  description: 'Download 100% free verified game optimization configs, ultra-low latency registry tweaks, FPS boosters, and network patches. Trusted by the BrokenCheats community.',
  keywords: [
    'free game optimizer', 'fps boost', 'registry tweaks', 'low latency config',
    'brokencheats', 'free cheats assets', 'network tweak', 'windows optimizer',
    'gaming performance', 'latency patch', 'game configs', 'free gaming tools',
    'fps unlocker', 'ping reducer', 'free store', 'brokencheats store'
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
    images: ['/og-image.png'],
  },
  // Icons / PWA
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: '/favicon.ico',
  },
  // PWA Manifest
  manifest: '/manifest.json',
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
        {/* JSON-LD Schema.org structured data */}
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
          <div className="flex justify-center w-full py-4 max-w-7xl mx-auto"><AdsterraBanners format="728x90" /></div>
          <main className="min-h-[calc(100vh-4rem-5rem)]">
            {children}
          </main>
          <div className="flex justify-center w-full py-4 max-w-7xl mx-auto"><AdsterraBanners format="728x90" /></div>
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
