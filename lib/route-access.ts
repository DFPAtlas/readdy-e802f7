export function protectedArea(path: string): 'admin' | 'staff' | 'portal' | 'uat' | 'pbx' | null {
  for (const area of ['admin', 'staff', 'portal', 'uat', 'pbx'] as const) {
    if (path === `/${area}` || path.startsWith(`/${area}/`)) return area;
  }
  if (path === '/account/earnings' || path === '/account/uat' || path.startsWith('/account/uat/')) return 'uat';
  return null;
}

export function publicAuthPath(path: string): boolean {
  return [
    '/admin/login', '/admin/recovery', '/admin/reset-password',
    '/staff/login', '/portal/login', '/uat/login',
  ].includes(path);
}
