'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_COOKIE } from '@/lib/auth';

export async function login(formData) {
  const password = formData.get('password');
  const next = formData.get('next') || '/';

  if (password && process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD) {
    cookies().set(AUTH_COOKIE, 'ok', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 días
    });
    redirect(next);
  }

  const params = new URLSearchParams({ error: '1' });
  if (next !== '/') params.set('next', next);
  redirect(`/login?${params.toString()}`);
}

export async function logout() {
  cookies().delete(AUTH_COOKIE);
  redirect('/');
}
