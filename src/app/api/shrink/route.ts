import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  if (!url) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Fallback to token if not in env
  const apiToken = process.env.SHRINKME_API_TOKEN || 'dc472a785fb5b600bd86c1b40d8759b888a3998c';
  const shrinkMeUrl = `https://shrinkme.io/api?api=${apiToken}&url=${encodeURIComponent(url)}&format=text`;

  try {
    const res = await fetch(shrinkMeUrl);
    const shortUrl = await res.text();
    
    // Validate we got a valid URL back
    if (shortUrl && shortUrl.startsWith('http')) {
      return NextResponse.redirect(shortUrl);
    }
  } catch (error) {
    console.error('ShrinkMe API error:', error);
  }

  // Fallback to original URL if shrinkme fails
  return NextResponse.redirect(url);
}
