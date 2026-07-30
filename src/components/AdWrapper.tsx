'use client';

import { usePathname } from 'next/navigation';

export default function AdWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="flex justify-center w-full py-4 max-w-7xl mx-auto">
        {/* We can dynamically inject ad scripts here if needed, or assume they are in layout */}
      </div>
      {children}
    </>
  );
}
