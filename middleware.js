import { NextResponse } from 'next/server';

export function middleware(request) {
  const authCookie = request.cookies.get('biblioteca_auth');
  if (authCookie?.value === 'ok') {
    return NextResponse.next();
  }

  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('next', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/libros/:path*'],
};
