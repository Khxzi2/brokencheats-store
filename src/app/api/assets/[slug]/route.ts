import { NextResponse } from 'next/server';
import { getAssetBySlug, incrementDownloadCount, toggleAssetStatus } from '@/lib/assets';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const asset = await getAssetBySlug(slug);

  if (!asset) {
    return NextResponse.json({ success: false, error: 'Asset not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, asset });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await request.json();

  if (body.action === 'increment_download') {
    const updatedCount = await incrementDownloadCount(slug);
    return NextResponse.json({ success: true, download_count: updatedCount });
  }

  if (body.action === 'toggle_status') {
    const success = await toggleAssetStatus(slug, body.status);
    return NextResponse.json({ success });
  }

  return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
}
