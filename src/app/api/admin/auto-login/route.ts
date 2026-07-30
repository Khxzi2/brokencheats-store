import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key');
  
  // This is the secret key that only the APK knows. 
  // Should ideally be an env variable but hardcoded here for speed.
  const AUTO_LOGIN_SECRET = process.env.APK_AUTO_LOGIN_KEY || 'brokencheats-admin-apk-secret-819203';

  if (key !== AUTO_LOGIN_SECRET) {
    return NextResponse.json({ success: false, error: 'Unauthorized APK access' }, { status: 401 });
  }

  // Generate a valid admin session cookie
  const username = 'brkn'; // We assume auto-login is the master admin
  const res = NextResponse.redirect(new URL('/admin', 'https://free.brokencheats.store'));
  
  res.cookies.set('admin_session', Buffer.from(`${username}:${Date.now()}`).toString('base64'), {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year session for APK
    sameSite: 'lax',
  });

  return res;
}
