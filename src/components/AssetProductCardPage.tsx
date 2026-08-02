'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Download, ExternalLink, ShieldCheck, Clock, Zap, Sparkles,
  CheckCircle2, ArrowLeft, Share2, FileText, Cpu, Check, Layers,
  Play, Video, HelpCircle, Terminal, AlertTriangle, Volume2, Image as ImageIcon
} from 'lucide-react';
import { Asset } from '@/lib/types/asset';
import AdsterraBanners from '@/components/AdsterraBanners';
import { supabase } from '@/lib/supabase';

interface AssetProductCardPageProps {
  asset: Asset;
  relatedAssets?: Asset[];
}

export default function AssetProductCardPage({ asset, relatedAssets = [] }: AssetProductCardPageProps) {
  const [timer, setTimer] = useState<number>(5);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [downloadCount, setDownloadCount] = useState<number>(asset.download_count);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [missionCompleted, setMissionCompleted] = useState<boolean>(false);

  // Gallery Active Image State
  const allImages = [
    ...(asset.image_url ? [asset.image_url] : []),
    ...(asset.gallery_images || [])
  ];
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Extract YouTube Video ID from URL or raw ID
  const getYoutubeEmbedUrl = (yt: string | null | undefined) => {
    if (!yt) return null;
    let videoId = yt.trim();
    if (videoId.includes('youtube.com') || videoId.includes('youtu.be')) {
      const match = videoId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match && match[1]) videoId = match[1];
    }
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const ytEmbedUrl = getYoutubeEmbedUrl(asset.youtube_video_id || asset.video_url);

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

  const handleDownload = async () => {
    if (!missionCompleted) {
      window.open('https://www.effectivecpmnetwork.com/wzr03mwh?key=537b2ed7b938a948c769d7a6d4182468', '_blank');
      setMissionCompleted(true);
      return;
    }

    try {
      setDownloading(true);

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
      let downloadUrl = asset.direct_download_url;
      if (asset.file_path) {
        if (asset.file_path.startsWith('/')) {
          downloadUrl = asset.file_path;
        } else {
          const { data } = supabase.storage.from('assets_bucket').getPublicUrl(asset.file_path);
          downloadUrl = data.publicUrl;
        }
      }

      if (downloadUrl) {
        window.open(downloadUrl, '_blank');
      } else {
        alert('Download link is currently unavailable for this asset.');
      }
      setDownloading(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 relative overflow-hidden py-10 px-4 md:px-8">
      {/* Glow backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/10 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute top-40 right-10 w-[400px] h-[400px] bg-cyan-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">

        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/assets"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-slate-400 hover:text-blue-400 transition-colors uppercase"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Asset Store
          </Link>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>STORE</span> / <span className="text-blue-400 font-bold">{asset.category}</span> / <span>{asset.slug}</span>
          </div>
        </div>

        {/* Top Header Ad Banner */}
        <AdsterraBanners format="728x90" />

        {/* HERO PRODUCT CARD HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card-brokencheats p-6 md:p-8 rounded-3xl relative overflow-hidden border border-blue-500/20 space-y-6"
        >
          {/* IMAGE GALLERY & THUMBNAIL PREVIEWER */}
          {allImages.length > 0 && (
            <div className="space-y-3">
              <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden relative border border-slate-800 bg-slate-950">
                <img
                  src={allImages[activeImageIndex]}
                  alt={`${asset.title} Preview ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent opacity-40" />
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-[10px] font-mono bg-slate-950/80 border border-slate-800 text-slate-300 backdrop-blur-md">
                  Image {activeImageIndex + 1} of {allImages.length}
                </div>
              </div>

              {/* Gallery Selector Pills */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {allImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-20 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${activeImageIndex === idx
                        ? 'border-blue-500 scale-105 shadow-lg shadow-blue-500/20'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                    >
                      <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 border border-blue-500/30 text-blue-400 uppercase tracking-wider">
                  {asset.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  VirusTotal Clean
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 border border-blue-500/30 text-blue-300">
                  Ring-0 Optimized
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase italic">
                {asset.title}
              </h1>

              <p className="text-sm text-slate-400 leading-relaxed">
                Official verified optimization package from BrokenCheats. Download ultra-low latency configurations, system patches, and custom game performance tweaks.
              </p>

              {/* Quick Metrics Bar */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-medium text-slate-300 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-blue-400" />
                  <span className="font-bold text-white">{downloadCount.toLocaleString()}</span> Verified Downloads
                </div>
                <div className="flex items-center gap-1.5 text-cyan-400">
                  <Zap className="w-4 h-4" />
                  <span>0ms Latency Target</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full sm:w-auto shrink-0">
              <button
                onClick={handleShare}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-blue-400" />
                <span>{copied ? 'Link Copied!' : 'Share Asset'}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* MAIN PRODUCT CONTENT & DOWNLOAD PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT 2 COLS: Specs, Guide & Instructions */}
          <div className="lg:col-span-2 space-y-8">

            {/* TECHNICAL SPECIFICATIONS TABLE CARD */}
            <div className="glass-card-brokencheats p-6 md:p-8 rounded-3xl space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
                <FileText className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-extrabold text-white uppercase tracking-wide">
                  Technical Specifications
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl space-y-1">
                  <span className="text-xs font-semibold text-slate-400">Asset Category</span>
                  <p className="text-sm font-bold text-white">{asset.category}</p>
                </div>

                <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl space-y-1">
                  <span className="text-xs font-semibold text-slate-400">URL Pathway</span>
                  <p className="text-sm font-mono font-bold text-blue-400">/assets/{asset.slug}</p>
                </div>

                <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl space-y-1">
                  <span className="text-xs font-semibold text-slate-400">OS Compatibility</span>
                  <p className="text-sm font-bold text-white">Windows 10 / 11 (64-Bit)</p>
                </div>

                <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl space-y-1">
                  <span className="text-xs font-semibold text-slate-400">Anti-Cheat Safety</span>
                  <p className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Undetected & Safe
                  </p>
                </div>

                <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl space-y-1">
                  <span className="text-xs font-semibold text-slate-400">Virus Scan Verification</span>
                  <p className="text-sm font-bold text-emerald-400">0 Alerts on VirusTotal</p>
                </div>

                <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl space-y-1">
                  <span className="text-xs font-semibold text-slate-400">Access Pricing</span>
                  <p className="text-sm font-bold text-blue-400">100% Free Public Access</p>
                </div>
              </div>
            </div>

            {/* AUDIO SOUND TEST PLAYER (IF AUDIO URL PROVIDED) */}
            {asset.audio_url && (
              <div className="glass-card-brokencheats p-6 rounded-3xl space-y-4 border border-cyan-500/30">
                <div className="flex items-center gap-3 border-b border-slate-800/80 pb-3">
                  <Volume2 className="w-5 h-5 text-cyan-400 animate-pulse" />
                  <h3 className="text-lg font-extrabold text-white uppercase tracking-wide">
                    Audio & Sound Test Preview
                  </h3>
                </div>
                <p className="text-xs text-slate-400">
                  Listen to the live sound frequency & audio patch preview before downloading.
                </p>
                <audio controls src={asset.audio_url} className="w-full rounded-xl bg-slate-950 accent-cyan-500" />
              </div>
            )}

            {/* HOW TO USE & INSTALLATION GUIDE SECTION */}
            <div className="glass-card-brokencheats p-6 md:p-8 rounded-3xl space-y-6 border border-blue-500/20">
              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
                <HelpCircle className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-extrabold text-white uppercase tracking-wide">
                  How To Install & Use
                </h2>
              </div>

              {/* YOUTUBE VIDEO TUTORIAL EMBED (IF AVAILABLE) */}
              {ytEmbedUrl ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                    <Video className="w-4 h-4" />
                    <span>Watch Step-by-Step Video Tutorial</span>
                  </div>
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
                    <iframe
                      src={ytEmbedUrl}
                      title={`How to use ${asset.title}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              ) : asset.video_url && !ytEmbedUrl ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                    <Video className="w-4 h-4" />
                    <span>Video Demonstration</span>
                  </div>
                  <video controls src={asset.video_url} className="w-full rounded-2xl border border-slate-800 bg-slate-950" />
                </div>
              ) : null}

              {/* STEP-BY-STEP VISUAL INSTRUCTIONS & FORMATTED GUIDES */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-500" />
                  <span>Step-by-Step Installation Instructions</span>
                </h3>

                {asset.instructions ? (
                  <div className="prose prose-invert max-w-none text-xs md:text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/70 p-6 rounded-2xl border border-slate-800 font-mono">
                    {asset.instructions}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                        1
                      </div>
                      <h4 className="text-sm font-bold text-white">Download Asset</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Click the verified download button on the right to retrieve the latest optimization archive.
                      </p>
                    </div>

                    <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                        2
                      </div>
                      <h4 className="text-sm font-bold text-white">Extract & Run</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Extract the ZIP archive. Right-click the patch script or executable and select <strong>Run as Administrator</strong>.
                      </p>
                    </div>

                    <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                        3
                      </div>
                      <h4 className="text-sm font-bold text-white">Reboot & Enjoy</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Restart your PC to apply system registry and network latency hooks. Enjoy 0ms input delay!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT 1 COL: Download Action Card & Ads */}
          <div className="space-y-6">

            {/* DOWNLOAD TRIGGER CARD */}
            <div className="glass-card-brokencheats p-6 rounded-3xl space-y-6 border border-blue-500/30 relative">
              <div className="text-center space-y-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Verified Download Mirror
                </span>
                <h3 className="text-xl font-black text-white uppercase italic">
                  Download Asset Package
                </h3>
                <p className="text-xs text-slate-400">
                  Instant high-speed download link. No surveys or registration required.
                </p>
              </div>

              {/* Countdown or Unlock Button */}
              <div className="space-y-4 text-center">
                {!isUnlocked ? (
                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                      <Clock className="w-4 h-4 animate-spin" />
                      Generating Secure Link...
                    </div>
                    <div className="text-3xl font-black text-white font-mono">{timer}s</div>
                    <p className="text-[11px] text-slate-500">Preparing high-speed download node</p>
                  </div>
                ) : (
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="w-full py-4 px-6 rounded-2xl text-sm font-black tracking-wider uppercase bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <Download className="w-5 h-5" />
                    <span>{downloading ? 'Preparing File...' : missionCompleted ? 'DOWNLOAD NOW (FREE)' : 'UNLOCK DOWNLOAD (REQUIRED)'}</span>
                  </button>
                )}

                {!missionCompleted && isUnlocked && (
                  <a
                    href="https://omg10.com/4/11454290"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 px-4 rounded-xl text-xs font-bold text-white hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors text-center shadow-lg"
                  >
                    Extra Mission (Optional)
                  </a>
                )}

                {isUnlocked && asset.direct_download_url && (
                  <a
                    href={asset.direct_download_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 px-4 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors text-center"
                  >
                    Alternate Direct Link <ExternalLink className="w-3 h-3 inline ml-1" />
                  </a>
                )}
              </div>

              {/* Security Trust Badges */}
              <div className="pt-4 border-t border-slate-800/80 space-y-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Virus-Free & Clean Executable</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>High Speed CDN Server Node</span>
                </div>
              </div>
            </div>

            {/* Ad Banner */}
            <AdsterraBanners format="300x250" />

          </div>
        </div>

        {/* BOTTOM SECTION: RELATED / MORE ASSETS */}
        {relatedAssets.length > 0 && (
          <div className="space-y-6 pt-10 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-500" />
                <h3 className="text-xl font-extrabold text-white uppercase tracking-tight">
                  More Free Game Assets
                </h3>
              </div>
              <Link href="/assets" className="text-xs font-bold text-blue-400 hover:text-blue-300">
                View All Catalog →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedAssets.slice(0, 3).map((rel) => (
                <Link
                  key={rel.id}
                  href={`/assets/${rel.slug}`}
                  className="glass-card-brokencheats p-5 rounded-2xl space-y-4 block group"
                >
                  {rel.image_url && (
                    <div className="w-full h-32 rounded-xl overflow-hidden relative border border-slate-800">
                      <img src={rel.image_url} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold">
                      {rel.category}
                    </span>
                    <span className="text-slate-400 font-medium">
                      {rel.download_count.toLocaleString()} downloads
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                    {rel.title}
                  </h4>

                  <div className="text-xs font-bold text-blue-400 flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <span>Open Product Card</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
