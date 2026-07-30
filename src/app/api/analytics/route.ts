import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

    // Insert into Supabase
    // If the database connection fails or table doesn't exist, this will gracefully catch
    const { error } = await supabase
      .from('asset_analytics')
      .insert([
        {
          asset_slug,
          event_type,
          country,
        }
      ]);

    if (error) {
      console.error('Analytics DB Error:', error.message);
      // We don't necessarily want to fail the user request just because analytics failed
      return NextResponse.json({ success: false, error: 'Failed to record analytics', details: error.message }, { status: 200 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Analytics Route Error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
