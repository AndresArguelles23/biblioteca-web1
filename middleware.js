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

// Solo las rutas de gestión (crear, editar) requieren sesión. Consultar el
// catálogo, el detalle de un libro y el dashboard de estadísticas quedan
// siempre públicos, en modo solo lectura.
export const config = {
  matcher: ['/libros/nuevo', '/libros/:id/editar'],
};
