import { MetadataRoute } from 'next';
import { getAllAssets } from '@/lib/assets';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const assets = await getAllAssets();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: 'https://free.brokencheats.store',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://free.brokencheats.store/assets',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
  ];

  const assetPages: MetadataRoute.Sitemap = assets
    .filter(a => a.status === 'active')
    .map(asset => ({
      url: `https://free.brokencheats.store/assets/${asset.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  return [...staticPages, ...assetPages];
}
