import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getEventsLocal } from '@/lib/analytics';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    // Always include local analytics
    const localEvents = getEventsLocal(slug);

    // Try Supabase
    let supabaseEvents: { event_type: string; country: string }[] = [];
    try {
      const { data, error } = await supabase
        .from('asset_analytics')
        .select('event_type, country')
        .eq('asset_slug', slug);
      if (!error && data) supabaseEvents = data;
    } catch (e) {
      console.warn('Supabase analytics fetch failed, using local only');
    }

    // Merge: deduplicate by using local as ground truth (local is always written)
    const allEvents = [...supabaseEvents, ...localEvents];

    const stats = {
      views: 0,
      downloads: 0,
      countries: {} as Record<string, number>
    };

    for (const row of allEvents) {
      if (row.event_type === 'view') stats.views++;
      if (row.event_type === 'download') stats.downloads++;

      const country = row.country || 'Unknown';
      if (row.event_type === 'view') {
        stats.countries[country] = (stats.countries[country] || 0) + 1;
      }
    }

    return NextResponse.json({ success: true, stats });
  } catch (err: any) {
    console.error('Analytics Route Error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
