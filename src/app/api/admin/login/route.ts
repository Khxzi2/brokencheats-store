import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let username = '';
  let password = '';
  try {
    const body = await request.json().catch(() => ({}));
    username = body.username || '';
    password = body.password || '';

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Username and password required' }, { status: 400 });
    }

    let isValid = false;

    // Check hardcoded fallback first
    const adminPass = process.env.ADMIN_PASSWORD;
    if ((username === 'brkn' || username === 'admin') && password === adminPass) {
      isValid = true;
    } else {
      try {
        const { data: admin, error } = await supabase
          .from('admins')
          .select('*')
          .eq('username', username)
          .eq('password', password)
          .single();
        if (!error && admin) isValid = true;
      } catch { }
    }

    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const res = NextResponse.json({ success: true, message: 'Authentication successful', admin: { username, role: 'admin' } });
    // Set session cookie (httpOnly, 7 days)
    res.cookies.set('admin_session', Buffer.from(`${username}:${Date.now()}`).toString('base64'), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });
    return res;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ success: false, error: 'Authentication error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/admin_session=([^;]+)/);
  if (match) {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}
