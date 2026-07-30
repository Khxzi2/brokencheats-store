import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { recordEventLocal } from '@/lib/analytics';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { asset_slug, event_type } = await request.json();

    if (!asset_slug || !event_type) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    if (event_type !== 'view' && event_type !== 'download') {
      return NextResponse.json({ success: false, error: 'Invalid event type' }, { status: 400 });
    }

    // Try to get country from Vercel or Cloudflare headers
    const country = request.headers.get('x-vercel-ip-country') || 
                    request.headers.get('cf-ipcountry') || 
                    'Unknown';

    let insertError = null;
    try {
      const { error } = await supabase
        .from('asset_analytics')
        .insert([
          {
            asset_slug,
            event_type,
            country,
          }
        ]);
      insertError = error;
    } catch (e: any) {
      insertError = e;
    }

    if (insertError) {
      console.warn('Analytics DB Error (falling back to local):', insertError.message || insertError);
    }
    
    // Always write to local store as a reliable fallback / dual-write
    recordEventLocal(asset_slug, event_type as 'view' | 'download', country);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Analytics Route Error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
