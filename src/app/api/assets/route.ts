import { NextResponse } from 'next/server';
import { getAllAssets, createAsset } from '@/lib/assets';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeHidden = searchParams.get('includeHidden') === 'true';
  const assets = await getAllAssets(includeHidden);
  return NextResponse.json({ success: true, count: assets.length, assets });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, slug, direct_download_url, file_path, ad_fly_link, status } = body;

    if (!title || !slug || (!direct_download_url && !file_path)) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, slug, and either direct_download_url or file_path' },
        { status: 400 }
      );
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

    const newAsset = await createAsset({
      title,
      category: category || 'Game Optimizer',
      slug: cleanSlug,
      direct_download_url: direct_download_url || null,
      file_path: file_path || null,
      ad_fly_link: ad_fly_link || null,
      status: status || 'active'
    });

    return NextResponse.json({ success: true, asset: newAsset }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
