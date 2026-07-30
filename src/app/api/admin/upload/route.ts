import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// POST /api/admin/upload — server-side file upload to Supabase Storage & local disk fallback
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const slug = formData.get('slug') as string | null;

    if (!file || !slug) {
      return NextResponse.json(
        { success: false, error: 'file and slug are required' },
        { status: 400 }
      );
    }

    const fileExt = file.name.split('.').pop() || 'bin';
    const fileName = `${slug}-${Date.now()}.${fileExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Try Supabase Storage first
    try {
      const { data: buckets } = await supabaseAdmin.storage.listBuckets();
      const bucketExists = buckets?.some(b => b.name === 'assets_bucket');
      if (!bucketExists) {
        await supabaseAdmin.storage.createBucket('assets_bucket', { public: true });
      }

      const { data, error } = await supabaseAdmin.storage
        .from('assets_bucket')
        .upload(fileName, buffer, {
          contentType: file.type || 'application/octet-stream',
          upsert: true,
        });

      if (!error && data?.path) {
        const { data: publicUrlData } = supabaseAdmin.storage
          .from('assets_bucket')
          .getPublicUrl(data.path);
        
        return NextResponse.json({ success: true, filePath: publicUrlData.publicUrl });
      }
    } catch (sbErr) {
      console.warn('Supabase storage upload error, falling back to local storage:', sbErr);
    }

    // Local Disk Fallback in public/uploads/
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const localFilePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(localFilePath, buffer);

    return NextResponse.json({ success: true, filePath: `/uploads/${fileName}` });
  } catch (err: any) {
    console.error('Upload Error:', err);
    return NextResponse.json({ success: false, error: err.message || 'File upload failed' }, { status: 500 });
  }
}

