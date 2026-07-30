'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Download, Shield, ArrowRight, Zap, Cpu, Activity, Lock, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Asset } from '@/lib/types/asset';
import AdsterraBanners from '@/components/AdsterraBanners';

interface HomePageClientProps {
  initialAssets: Asset[];
}

export default function HomePageClient({ initialAssets }: HomePageClientProps) {
  const featuredAssets = initialAssets.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 relative overflow-hidden">

      {/* Subtle Ambient Background Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/10 blur-[180px] pointer-events-none rounded-full" />

      {/* 1. Hero Section */}
      <section className="relative pt-20 pb-24 px-4 md:px-8 max-w-7xl mx-auto text-center space-y-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-6 max-w-4xl mx-auto"
        >


          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">
            DOMINATE <br />
            <span className="text-gradient-blue">EVERY GAME.</span>
          </h1>

          <p className="text-slate-400 text-base md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            100% Free Verified Custom Tweaks, Ultra-Low Latency Configurations, and System Patches. Totally safe, streamproof, and zero input delay.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/assets"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-xs font-black tracking-widest uppercase bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-xl shadow-blue-600/25 glow-blue"
            >
              <Download className="w-4 h-4" />
              <span>ACCESS FREE STORE</span>
            </Link>

          </div>
        </motion.div>
      </section>

      {/* 2. Infinite Ticker Marquee */}
      <div className="w-full border-y border-slate-800/80 bg-slate-950/60 py-3 overflow-hidden">
        <div className="animate-marquee flex whitespace-nowrap gap-12 font-mono text-xs font-bold text-slate-400 uppercase tracking-widest">
          <span>• 100% UNDETECTED & SAFE</span>
          <span className="text-blue-400">• 0MS INPUT LATENCY</span>
          <span>• RING-0 CLOAKED CONFIGS</span>
          <span className="text-blue-400">• VIRUSTOTAL CLEAN</span>
          <span>• MEDIAFIRE & MEGA MIRRORS</span>
          <span>• 100% UNDETECTED & SAFE</span>
          <span className="text-blue-400">• 0MS INPUT LATENCY</span>
          <span>• RING-0 CLOAKED CONFIGS</span>
        </div>
      </div>

      {/* 3. Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20 space-y-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">COMMUNITY RELEASES</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase text-white">AVAILABLE OPTIMIZATIONS</h2>
          </div>
          <Link href="/assets" className="text-xs font-bold tracking-widest text-blue-400 hover:text-blue-300 flex items-center gap-1">
            VIEW ALL PRODUCTS <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredAssets.map((asset) => (
            <div key={asset.id} className="glass-card-brokencheats p-8 rounded-2xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex justify-end">
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {asset.download_count.toLocaleString()} DOWNLOADS
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white tracking-tight leading-snug">
                  {asset.title}
                </h3>
                <p className="text-xs font-mono text-slate-500">
                  free.brokencheats.store/{asset.slug}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                  <Shield className="w-4 h-4" /> VERIFIED SAFE
                </span>
                <Link
                  href={`/download/${asset.slug}`}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-600/20"
                >
                  GET FREE
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Global Ad Placement Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <AdsterraBanners format="728x90" />
      </div>

      {/* 5. Command Center / Process Step Layout */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">SIMPLE WORKFLOW</span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase text-white">COMMAND CENTER</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card-brokencheats p-8 rounded-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-mono font-black text-blue-400 text-lg">
              1
            </div>
            <h4 className="text-lg font-bold text-white uppercase tracking-wider">SELECT TWEAK</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Browse our verified catalog of FPS boost configurations, network tweaks, and registry patches.
            </p>
          </div>

          <div className="glass-card-brokencheats p-8 rounded-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-mono font-black text-blue-400 text-lg">
              2
            </div>
            <h4 className="text-lg font-bold text-white uppercase tracking-wider">MICRO-TIMER PASS</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Pass through our quick 10-second verification timer to ensure secure link generation.
            </p>
          </div>

          <div className="glass-card-brokencheats p-8 rounded-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-mono font-black text-blue-400 text-lg">
              3
            </div>
            <h4 className="text-lg font-bold text-white uppercase tracking-wider">APPLY & DOMINATE</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Apply your optimization file instantly and enjoy zero input lag and maximum FPS stability.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
