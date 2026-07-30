import { getAllAssets } from '@/lib/assets';
import HomePageClient from '@/components/HomePageClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const assets = await getAllAssets(false);
  return <HomePageClient initialAssets={assets} />;
}
