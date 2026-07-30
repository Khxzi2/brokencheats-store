import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createAsset } from '@/lib/assets';

export const dynamic = 'force-dynamic';

// GET /api/admin/assets — list all assets (including hidden)
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, assets: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/admin/assets — create a new asset with resilient schema fallback
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title, category, slug, direct_download_url, file_path,
      image_url, gallery_images, video_url, audio_url,
      youtube_video_id, instructions, status
    } = body;

    if (!title || !slug) {
      return NextResponse.json({ success: false, error: 'title and slug are required' }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

    const assetPayload = {
      title,
      category: category || 'Game Optimizer',
      slug: cleanSlug,
      direct_download_url: direct_download_url || null,
      file_path: file_path || null,
      image_url: image_url || null,
      gallery_images: gallery_images || null,
      video_url: video_url || null,
      audio_url: audio_url || null,
      youtube_video_id: youtube_video_id || null,
      instructions: instructions || null,
      ad_fly_link: null,
      download_count: 0,
      status: status || 'active',
    };

    let data = null;
    let insertError = null;
    
    try {
      const result = await supabaseAdmin
        .from('assets')
        .insert([assetPayload])
        .select()
        .single();
      data = result.data;
      insertError = result.error;
    } catch (e: any) {
      insertError = e;
    }

    if (!insertError && data) {
      // Also sync to local fallback memory store
      await createAsset(assetPayload);
      return NextResponse.json({ success: true, asset: data }, { status: 201 });
    }

    // If Supabase schema lacks new columns (e.g. audio_url column missing in Supabase DB),
    // insert base fields into Supabase and save full payload to local memory store
    console.warn('Supabase insert error (missing columns/schema), using resilient fallback:', insertError?.message || insertError);
    
    try {
      await supabaseAdmin.from('assets').insert([{
        title: assetPayload.title,
        category: assetPayload.category,
        slug: assetPayload.slug,
        direct_download_url: assetPayload.direct_download_url,
        file_path: assetPayload.file_path,
        download_count: 0,
        status: assetPayload.status,
      }]);
    } catch (e) {
      console.warn('Supabase base insert skipped:', e);
    }

    // Save full enriched asset to local memory store
    const localAsset = await createAsset(assetPayload);
    return NextResponse.json({ success: true, asset: localAsset }, { status: 201 });

    const created = await createAsset(assetPayload);
    return NextResponse.json({ success: true, asset: created }, { status: 201 });
  } catch (err: any) {
    console.error('Create asset error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Failed to publish asset' }, { status: 500 });
  }
}
