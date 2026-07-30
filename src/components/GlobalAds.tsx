'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

export default function GlobalAds() {
  const pathname = usePathname();

  // Disable ads in the admin panel
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* Monetag */}
      <script 
        src="https://quge5.com/88/tag.min.js" 
        data-zone="265211" 
        async 
        data-cfasync="false"
      />
      {/* effectivecpmnetwork */}
      <Script src="https://pl30597086.effectivecpmnetwork.com/38/5d/82/385d8299b6d84847a8cea3a4bdc0d71f.js" strategy="beforeInteractive" />
      <Script src="https://pl30597089.effectivecpmnetwork.com/b1/7f/f9/b17ff9088a90087b4f7bbb4f851f5395.js" strategy="lazyOnload" />
    </>
  );
}
