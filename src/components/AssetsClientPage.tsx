'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Download, Sparkles, ShieldCheck, Zap, Layers, Filter, Search,
  ArrowRight, Star, Cpu, Lock, CheckCircle2, ChevronRight
} from 'lucide-react';
import { Asset } from '@/lib/types/asset';

interface AssetsClientPageProps {
  initialAssets: Asset[];
}

export default function AssetsClientPage({ initialAssets }: AssetsClientPageProps) {
  const [assets] = useState<Asset[]>(initialAssets);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Game Optimizer', 'Network Utility', 'Latency Patch', 'Windows Tweak'];

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asset.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || 
                            asset.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 relative overflow-hidden py-10 px-4 md:px-8">
      {/* Cyber Ambient Glow Backgrounds */}
      <div className="absolute top-10 left-1/4 -translate-x-1/2 w-[700px] h-[700px] bg-blue-600/10 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute top-40 right-1/4 translate-x-1/2 w-[600px] h-[600px] bg-cyan-600/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        

        {/* SEARCH & CATEGORY FILTER BAR */}
        <div className="glass-card-brokencheats p-4 md:p-6 rounded-3xl space-y-4 border border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search assets by title or keyword..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* ASSET PRODUCT CARDS CATALOG GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset, index) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              {/* Product Card Container — entire card opens product page */}
              <Link
                href={`/assets/${asset.slug}`}
                className="glass-card-brokencheats p-6 rounded-3xl flex flex-col justify-between block group border border-slate-800/80 hover:border-blue-500/50 relative overflow-hidden h-full"
              >
                {/* Visual Header Banner inside card */}
                <div className="space-y-4">
                  {asset.image_url && (
                    <div className="w-full h-40 rounded-2xl overflow-hidden relative border border-slate-800">
                      <img 
                        src={asset.image_url} 
                        alt={asset.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0e1017] via-transparent to-transparent opacity-60" />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/10 border border-blue-500/30 text-blue-400">
                      {asset.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>VirusTotal Clean</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                      {asset.title}
                    </h3>
                    <p className="text-xs font-mono text-blue-400/80 mt-1">
                      free.brokencheats.store/{asset.slug}
                    </p>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    Verified performance tweak designed to lower latency, eliminate stutter, and optimize gaming frame rates.
                  </p>

                  {/* Micro Specs */}
                  <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-medium text-slate-300">
                    <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/50 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-blue-400" />
                      <span>0ms Delay Target</span>
                    </div>
                    <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/50 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Win 10/11 Safe</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="pt-5 mt-5 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Download className="w-3.5 h-3.5 text-blue-400" />
                    <span>{asset.download_count.toLocaleString()} downloads</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 text-xs font-black text-blue-400 group-hover:text-blue-300 uppercase tracking-wider">
                    <span>Open Product Card</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredAssets.length === 0 && (
          <div className="text-center py-16 glass-card-brokencheats rounded-3xl space-y-3 border border-slate-800">
            <Layers className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-lg font-bold text-slate-300">No matching assets found</h4>
            <p className="text-xs text-slate-500">Try adjusting your search query or category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
