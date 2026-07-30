'use client';

import { usePathname } from 'next/navigation';
import AdsterraBanners from './AdsterraBanners';

export default function AdBannerWrapper() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return null;
  }

  return (
    <div className="flex justify-center w-full py-4 max-w-7xl mx-auto">
      <AdsterraBanners format="728x90" />
    </div>
  );
}
