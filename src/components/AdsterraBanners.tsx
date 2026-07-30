'use client';

import { useEffect, useRef, useState } from 'react';
import { Sparkles, ExternalLink, Zap } from 'lucide-react';

type AdFormat = 'native' | '728x90' | '300x250' | '160x600' | '468x60' | '160x300' | '320x50';

interface AdsterraBannersProps {
  format: AdFormat;
  className?: string;
}

export default function AdsterraBanners({ format, className = '' }: AdsterraBannersProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear existing ad content on re-render to prevent duplicates
    containerRef.current.innerHTML = '';
    setAdLoaded(false);

    if (format === 'native') {
      const script = document.createElement('script');
      script.async = true;
      script.dataset.cfasync = 'false';
      script.src = 'https://pl30597087.effectivecpmnetwork.com/ab0ef1399f51a6b6e9b4e1ff48f5a874/invoke.js';

      const div = document.createElement('div');
      div.id = 'container-ab0ef1399f51a6b6e9b4e1ff48f5a874';

      containerRef.current.appendChild(script);
      containerRef.current.appendChild(div);
      setAdLoaded(true);
      return;
    }

    // Banner Configurations
    const configs: Record<string, { key: string; height: number; width: number }> = {
      '728x90': { key: '0c03bc46c2f5a35ab6ac7c26c25a68a9', height: 90, width: 728 },
      '300x250': { key: '3ec2cadd6d6e3a5ce8796e231ee0dacf', height: 250, width: 300 },
      '160x600': { key: '124e052aac04b4e28d8cc0b2de8c2e13', height: 600, width: 160 },
      '468x60': { key: 'b2a6fcae633dd0581cf768356b05e195', height: 60, width: 468 },
      '160x300': { key: '017849486e7c5671dee6a1f50f0d99f2', height: 300, width: 160 },
      '320x50': { key: 'dbd8d6003467fe400779ff44c04970aa', height: 50, width: 320 },
    };

    const config = configs[format];
    if (config) {
      const confScript = document.createElement('script');
      confScript.type = 'text/javascript';
      confScript.innerHTML = `
        atOptions = {
          'key' : '${config.key}',
          'format' : 'iframe',
          'height' : ${config.height},
          'width' : ${config.width},
          'params' : {}
        };
      `;
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = `https://www.highperformanceformat.com/${config.key}/invoke.js`;

      containerRef.current.appendChild(confScript);
      containerRef.current.appendChild(invokeScript);
      setAdLoaded(true);
    }
  }, [format]);

  return (
    <div className={`ad-container flex flex-col items-center justify-center overflow-hidden my-4 relative ${className}`}>
      {/* Real Adsterra Script Container */}
      <div ref={containerRef} className="w-full flex justify-center min-h-[90px]" />

      {/* High-converting Fallback Banner for Localhost / Adblock Environments */}
      <div className="w-full max-w-3xl glass-card-brokencheats p-4 rounded-2xl border border-blue-500/30 flex items-center justify-between gap-4 mt-2 bg-gradient-to-r from-blue-950/40 via-blue-950/30 to-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest block">
              SPONSORED PARTNER AD
            </span>
            <p className="text-xs font-bold text-white">
              Unlock Ultra FPS & Ring-0 Latency Engine Pro
            </p>
          </div>
        </div>

        <a
          href="https://omg10.com/4/11455896"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90 transition-all shrink-0 flex items-center gap-1.5 shadow-lg shadow-blue-600/25"
        >
          <span>Claim Offer</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
