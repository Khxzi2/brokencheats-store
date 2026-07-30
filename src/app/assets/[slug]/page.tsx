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
      title: 'Asset Not Found | BrokenCheats Free Store',
      robots: { index: false },
    };
  }

  const assetUrl = `https://free.brokencheats.store/assets/${asset.slug}`;
  const imageUrl = asset.image_url || '/og-image.png';
  const desc = `Download free ${asset.title} — ${asset.category} verified by BrokenCheats. ${asset.download_count.toLocaleString()} downloads. Win 10/11 safe, zero delay.`;

  return {
    title: `${asset.title} — Free Download | BrokenCheats`,
    description: desc,
    keywords: [asset.title, asset.category, 'free download', 'game optimizer', 'brokencheats', asset.slug],
    alternates: { canonical: assetUrl },
    openGraph: {
      type: 'article',
      url: assetUrl,
      title: `${asset.title} — Free Download | BrokenCheats`,
      description: desc,
      siteName: 'BrokenCheats Free Store',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: asset.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${asset.title} — Free Download`,
      description: desc,
      images: [imageUrl],
    },
  };
}

export const revalidate = 0;

export default async function AssetProductCardPageRoute(
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
