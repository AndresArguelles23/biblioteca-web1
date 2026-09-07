import { cookies } from 'next/headers';

export const AUTH_COOKIE = 'biblioteca_auth';

export function isAuthenticated() {
  return cookies().get(AUTH_COOKIE)?.value === 'ok';
}
