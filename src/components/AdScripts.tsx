'use client';

import { usePathname } from 'next/navigation';

export default function AdScripts() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return null;
  }

  return (
    <script src="https://quge5.com/88/tag.min.js" data-zone="265248" async data-cfasync="false"></script>
  );
}
