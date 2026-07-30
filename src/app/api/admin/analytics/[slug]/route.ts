import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    // We can run two queries or one grouped query.
    // Easiest is to just fetch all events for this slug and group in memory, or use Supabase counts.
    // For simplicity, we fetch all for this slug. If scale is large, we should use an RPC function or group by.
    const { data, error } = await supabase
      .from('asset_analytics')
      .select('event_type, country')
      .eq('asset_slug', slug);

    if (error) {
      console.error('Analytics Fetch Error:', error.message);
      // Return empty data if DB connection fails
      return NextResponse.json({
        success: true,
        stats: { views: 0, downloads: 0, countries: {} }
      });
    }

    const stats = {
      views: 0,
      downloads: 0,
      countries: {} as Record<string, number>
    };

    if (data) {
      for (const row of data) {
        if (row.event_type === 'view') stats.views++;
        if (row.event_type === 'download') stats.downloads++;

        const country = row.country || 'Unknown';
        if (row.event_type === 'view') {
          stats.countries[country] = (stats.countries[country] || 0) + 1;
        }
      }
    }

    return NextResponse.json({ success: true, stats });
  } catch (err: any) {
    console.error('Analytics Route Error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
