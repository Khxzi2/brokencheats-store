import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/Navbar';
import GlobalAds from '@/components/GlobalAds';
import AdsterraBanners from '@/components/AdsterraBanners';

const inter = Inter({ subsets: ['latin'], display: 'swap', fallback: ['system-ui', 'sans-serif'] });

export const metadata: Metadata = {
  title: 'BrokenCheats Assets | Free High-Performance Game Configs & Patches',
  description: 'Download verified custom game tweaks, ultra-low latency registry optimizers, and frame pacing patches. Hosted on free.brokencheats.store.',
  keywords: ['game optimization', 'fps boost', 'registry tweaks', 'low latency', 'free tweaks', 'brokencheats'],
  other: {
    monetag: 'd9c8d0f52cbcec36f3a1278fafd65345',
  },
  openGraph: {
    title: 'BrokenCheats Free Assets & Game Optimizers',
    description: 'High-performance game configs, registry tweaks, and low-latency scripts.',
    url: 'https://free.brokencheats.store',
    siteName: 'BrokenCheats Store',
    type: 'website',
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
        <meta name="monetag" content="d9c8d0f52cbcec36f3a1278fafd65345" />
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
