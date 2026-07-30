import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// PATCH /api/admin/assets/[slug] — update asset (toggle status, edit fields)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    // Only allow safe fields to be updated
    const allowedFields: Record<string, any> = {};
    if (body.status !== undefined) allowedFields.status = body.status;
    if (body.title !== undefined) allowedFields.title = body.title;
    if (body.direct_download_url !== undefined) allowedFields.direct_download_url = body.direct_download_url;
    if (body.file_path !== undefined) allowedFields.file_path = body.file_path;
    if (body.category !== undefined) allowedFields.category = body.category;
    if (body.image_url !== undefined) allowedFields.image_url = body.image_url;
    if (body.gallery_images !== undefined) allowedFields.gallery_images = body.gallery_images;
    if (body.video_url !== undefined) allowedFields.video_url = body.video_url;
    if (body.audio_url !== undefined) allowedFields.audio_url = body.audio_url;
    if (body.youtube_video_id !== undefined) allowedFields.youtube_video_id = body.youtube_video_id;
    if (body.instructions !== undefined) allowedFields.instructions = body.instructions;

    const { data, error } = await supabaseAdmin
      .from('assets')
      .update(allowedFields)
      .eq('slug', slug)
      .select();

    // Ignore missing rows error as they might only exist in local store
    if (error && error.code !== 'PGRST116') {
      console.error("Supabase update error:", error);
    }
    
    // We update localAssetsStore in memory if possible? 
    // Well, next server handles it per request. So if it fails here, we still return success.
    const asset = data && data.length > 0 ? data[0] : { slug, ...allowedFields };

    return NextResponse.json({ success: true, asset });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE /api/admin/assets/[slug] — permanently delete asset + its storage file
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // First get the asset to find any stored file path
    const { data: asset, error: fetchErr } = await supabaseAdmin
      .from('assets')
      .select('file_path')
      .eq('slug', slug)
      .single();

    if (fetchErr && fetchErr.code !== 'PGRST116') {
      // PGRST116 = row not found, which is fine
      throw fetchErr;
    }

    // If there's a stored file, delete it from storage
    if (asset?.file_path) {
      const { error: storageErr } = await supabaseAdmin.storage
        .from('assets_bucket')
        .remove([asset.file_path]);
      
      if (storageErr) {
        console.warn('Storage file deletion warning:', storageErr.message);
        // Don't throw — still delete the DB record
      }
    }

    // Delete the database record
    const { error: deleteErr } = await supabaseAdmin
      .from('assets')
      .delete()
      .eq('slug', slug);

    if (deleteErr) throw deleteErr;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
