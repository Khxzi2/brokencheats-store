import { getAssetBySlug, getAllAssets } from '@/lib/assets';
import AssetProductCardPage from '@/components/AssetProductCardPage';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const asset = await getAssetBySlug(slug);

  if (!asset) {
    return {
      title: 'Asset Not Found | BrokenCheats Store',
    };
  }

  return {
    title: `Download ${asset.title} | BrokenCheats Store`,
    description: `Download verified free ${asset.category} (${asset.title}) on free.brokencheats.store. High-speed mirror download links.`,
  };
}

export const revalidate = 0;

export default async function DynamicDownloadPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const asset = await getAssetBySlug(slug);

  if (!asset || asset.status === 'hidden') {
    notFound();
  }

  const allAssets = await getAllAssets(false);
  const relatedAssets = allAssets.filter(a => a.slug !== slug);

  return <AssetProductCardPage asset={asset} relatedAssets={relatedAssets} />;
}

