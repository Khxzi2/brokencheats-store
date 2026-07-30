import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ success: false, error: 'Missing slug' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('asset_reviews')
      .select('*')
      .eq('asset_slug', slug)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, reviews: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { asset_slug, reviewer_name, rating, comment } = body;

    if (!asset_slug || !reviewer_name || !rating) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('asset_reviews')
      .insert([
        {
          asset_slug,
          reviewer_name,
          rating,
          comment: comment || null
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, review: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
