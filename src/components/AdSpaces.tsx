'use client';

import { useEffect } from 'react';
import { ExternalLink, Sparkles, DollarSign } from 'lucide-react';

interface AdSpacesProps {
  type: 'banner' | 'sidebar' | 'interstitial' | 'popunder';
  className?: string;
  customTitle?: string;
}

export default function AdSpaces({ type, className = '', customTitle }: AdSpacesProps) {
  useEffect(() => {
    if (type === 'popunder') {
      // Register Monetag / 5gvci Service Worker dynamically
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then((reg) => {
          console.log('Monetag Service Worker registered successfully:', reg.scope);
        }).catch((err) => {
          console.warn('Monetag Service Worker registration failed:', err);
        });
      }
    }
  }, [type]);

  if (type === 'banner') {
    return (
      <div className={`w-full glass-card-ad p-4 md:p-6 rounded-2xl text-center relative overflow-hidden my-6 ${className}`}>
        <div className="absolute top-2 left-3 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-blue-400/80">
          <Sparkles className="w-3 h-3 text-blue-400" />
          <span>Sponsor Ad Network Space</span>
        </div>
        <div className="pt-4 pb-2 flex flex-col items-center justify-center min-h-[90px]">
          <h4 className="text-sm md:text-base font-bold text-slate-200">
            {customTitle || '⚡ Optimize Your Gaming Rig — Exclusive Hardware Upgrades'}
          </h4>
          <p className="text-xs text-slate-400 mt-1 max-w-lg">
            High refresh rate monitors, ultra-low latency RAM kits, and specialized liquid cooling.
          </p>
          <a
            href="https://linkvertise.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-blue-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Visit Sponsor <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  if (type === 'sidebar') {
    return (
      <div className={`glass-card-ad p-5 rounded-2xl space-y-4 text-center ${className}`}>
        <div className="flex items-center justify-between text-[10px] font-mono text-blue-400 uppercase tracking-wider border-b border-blue-500/20 pb-2">
          <span>Ad Unit (300x250)</span>
          <DollarSign className="w-3 h-3 text-emerald-400" />
        </div>
        <div className="py-6 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400 font-bold">
            AD
          </div>
          <h5 className="text-sm font-semibold text-slate-200">High-RPM VPN for Gaming</h5>
          <p className="text-xs text-slate-400 leading-relaxed">
            Reduce ping by up to 40ms with dedicated competitive routing.
          </p>
          <button className="w-full py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 text-xs font-semibold border border-blue-500/40 transition-colors">
            Check Deal
          </button>
        </div>
      </div>
    );
  }

  if (type === 'popunder') {
    return null;
  }

  return null;
}
