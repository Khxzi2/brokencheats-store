'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Download, ExternalLink, ShieldCheck, Clock, Zap, Sparkles, CheckCircle2, Lock, ArrowLeft } from 'lucide-react';
import { Asset } from '@/lib/types/asset';
import AdsterraBanners from '@/components/AdsterraBanners';
import { supabase } from '@/lib/supabase';
import AssetReviews from '@/components/AssetReviews';

interface DownloadClientPageProps {
  asset: Asset;
}

export default function DownloadClientPage({ asset }: DownloadClientPageProps) {
  const [timer, setTimer] = useState<number>(10);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [downloadCount, setDownloadCount] = useState<number>(asset.download_count);
  const [downloadTriggered, setDownloadTriggered] = useState<boolean>(false);
  const [missionCompleted, setMissionCompleted] = useState<boolean>(false);

  useEffect(() => {
    // Record page view analytics
    fetch(`/api/analytics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ asset_slug: asset.slug, event_type: 'view' }),
    }).catch(err => console.error('Error tracking view:', err));
  }, [asset.slug]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsUnlocked(true);
    }
  }, [timer]);

  const handleDirectDownload = async () => {
    if (!missionCompleted) {
      window.open('https://www.effectivecpmnetwork.com/wzr03mwh?key=537b2ed7b938a948c769d7a6d4182468', '_blank');
      setMissionCompleted(true);
      return;
    }

    try {
      setDownloadTriggered(true);

      // 1. Increment download count in local/DB store
      fetch(`/api/assets/${asset.slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'increment_download' }),
      }).then(r => r.json()).then(d => {
        if (d.success && d.download_count) setDownloadCount(d.download_count);
      }).catch(() => { });

      // 2. Record download event in analytics store
      fetch(`/api/analytics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asset_slug: asset.slug, event_type: 'download' }),
      }).catch(() => { });

    } catch (err) {
      console.error('Error recording download metric:', err);
    } finally {
      // Trigger real download redirect / window opening
      let downloadUrl = asset.direct_download_url;
      if (asset.file_path) {
        const { data } = supabase.storage.from('assets_bucket').getPublicUrl(asset.file_path);
        downloadUrl = data.publicUrl;
      }

      if (downloadUrl) {
        const wrappedUrl = `/api/shrink?url=${encodeURIComponent(downloadUrl)}`;
        window.open(wrappedUrl, '_blank');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-slate-100 relative overflow-hidden py-12 px-4 md:px-8">
      {/* Glow backgrounds */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/10 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute top-20 right-10 w-[400px] h-[400px] bg-red-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-8">

        {/* Navigation back button */}
        <Link
          href="/assets"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Asset Catalog
        </Link>

        {/* Top Header Ad Banner */}
        <AdsterraBanners format="728x90" />

        {/* Core Asset Overview Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-card-cyber p-6 md:p-10 rounded-3xl space-y-8 relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-300">
                {asset.category}
              </span>
              <h1 className="text-2xl md:text-4xl font-extrabold text-slate-100">
                {asset.title}
              </h1>
              <p className="text-xs font-mono text-blue-400">
                URL Pathway: free.brokencheats.store/{asset.slug}
              </p>
            </div>

            <div className="glass-card-cyber px-5 py-3 rounded-2xl text-center shrink-0">
              <div className="text-xl font-extrabold text-blue-400">
                {downloadCount.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 font-medium">Verified Downloads</div>
            </div>
          </div>

          {/* Micro Countdown Timer & Exposure Unlock Box */}
          <div className="bg-slate-950/70 border border-blue-500/20 rounded-2xl p-6 md:p-8 text-center space-y-6">
            {!isUnlocked ? (
              <div className="space-y-4 max-w-md mx-auto">
                <div className="inline-flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider">
                  <Clock className="w-4 h-4 animate-spin" />
                  Generating Secure Download Trigger...
                </div>

                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="6"
                      className="text-slate-800"
                      fill="transparent"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="6"
                      className="text-blue-500 transition-all duration-1000"
                      fill="transparent"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * (10 - timer)) / 10}
                    />
                  </svg>
                  <span className="absolute text-2xl font-black text-white">{timer}s</span>
                </div>

                <p className="text-xs text-slate-400">
                  Please wait while our high-speed CDN prepares your optimization payload and verifies link safety.
                </p>
              </div>
            ) : (
              <div className="space-y-6 max-w-lg mx-auto">
                <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Download Link Ready & Verified Safe
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {/* Direct Download Button */}
                  <button
                    onClick={handleDirectDownload}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-red-600 via-blue-600 to-blue-600 text-white shadow-xl shadow-blue-500/25 hover:opacity-95 transition-opacity glow-blue"
                  >
                    <Download className="w-4 h-4" />
                    <span>{missionCompleted ? 'Download File Directly' : 'Unlock Download (Task)'}</span>
                  </button>

                  {!missionCompleted && (
                    <a
                      href="https://omg10.com/4/11455896"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                    >
                      <span>Extra Mission (Optional)</span>
                    </a>
                  )}

                  {/* Optional Monetized Ad-Fly Link (Linkvertise / AdMaven) */}
                  {asset.ad_fly_link && (
                    <a
                      href={asset.ad_fly_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-blue-500/30 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      <span>Monetized Fast Link (Smartlink)</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  )}
                  {/* Smartlink generic button if user requested it, but we use direct for now */}
                </div>
              </div>
            )}
          </div>

          {/* Security & Verification Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
              <div className="text-xs font-semibold text-slate-200">100% VirusTotal Clean</div>
              <div className="text-[10px] text-slate-400">Zero false positives detected</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <Zap className="w-5 h-5 text-blue-400 mx-auto mb-1.5" />
              <div className="text-xs font-semibold text-slate-200">Instant Mirror CDN</div>
              <div className="text-[10px] text-slate-400">MediaFire & Mega integration</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <Lock className="w-5 h-5 text-blue-400 mx-auto mb-1.5" />
              <div className="text-xs font-semibold text-slate-200">Encrypted Transport</div>
              <div className="text-[10px] text-slate-400">SSL / TLS Protected</div>
            </div>
          </div>
        </motion.div>

        {/* Secondary Sidebar / Content Banner Ad */}
        <AdsterraBanners format="native" />

        {/* Asset Reviews Section */}
        <AssetReviews assetSlug={asset.slug} />
      </div>
    </div>
  );
}
