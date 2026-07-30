import { getAllAssets } from '@/lib/assets';
import AssetsClientPage from '@/components/AssetsClientPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Game Assets & FPS Optimizations | BrokenCheats Store',
  description: 'Download verified high-performance game configs, registry tweaks, and frame pacing optimization tools.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AssetsPage() {
  const assets = await getAllAssets(false);
  return <AssetsClientPage initialAssets={assets} />;
}
