import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isFullAdminRole, normaliseAdminRole } from '@/lib/admin-roles';
import { protectedArea, publicAuthPath } from '@/lib/route-access';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const area = protectedArea(path);
  // Webhooks, health checks, auth callbacks and public token links pass through.
  if (!area || publicAuthPath(path)) return NextResponse.next();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return new NextResponse('Authentication is unavailable.', { status: 503 });

  let response = NextResponse.next({ request });
  const client = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values) {
        for (const { name, value } of values) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of values) response.cookies.set(name, value, options);
      },
    },
  });
  const finish = (result: NextResponse) => {
    for (const cookie of response.cookies.getAll()) result.cookies.set(cookie);
    result.headers.set('Cache-Control', 'private, no-store');
    result.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return result;
  };
  const login = area === 'pbx' ? '/portal/login' : `/${area}/login`;
  const deny = () => finish(new NextResponse('Access denied.', { status: 403 }));
  try {
    const { data: { user }, error } = await client.auth.getUser();
    if (error || !user) {
      const destination = request.nextUrl.clone();
      destination.pathname = login;
      destination.search = '';
      // Keep password recovery / magic-link fragments: browsers inherit the
      // original fragment on a redirect; the public login completes the flow.
      return finish(NextResponse.redirect(destination));
    }
    if (area === 'admin') {
      const { data: profile, error: profileError } = await client.from('admin_profiles')
        .select('role, active, suspended_at, archived_at').eq('id', user.id).maybeSingle();
      const role = normaliseAdminRole(profile?.role);
      if (profileError) return finish(new NextResponse('Access verification unavailable.', { status: 503 }));
      if (!profile?.active || profile.suspended_at || profile.archived_at || !role || !isFullAdminRole(role)) return deny();
      if (!['/admin/mfa', '/admin/mfa/setup'].includes(path)) {
        const { data: aal, error: aalError } = await client.auth.mfa.getAuthenticatorAssuranceLevel();
        if (aalError || !aal) return deny();
        if (aal.currentLevel !== 'aal2') {
          const destination = request.nextUrl.clone();
          destination.pathname = aal.nextLevel === 'aal2' ? '/admin/mfa' : '/admin/mfa/setup';
          destination.search = '';
          return finish(NextResponse.redirect(destination));
        }
      }
    } else if (area === 'staff') {
      const { data: profile, error: profileError } = await client.from('staff_profiles')
        .select('role, active').eq('id', user.id).maybeSingle();
      if (profileError) return finish(new NextResponse('Access verification unavailable.', { status: 503 }));
      const role = normaliseAdminRole(profile?.role);
      if (!profile?.active || !role || !['staff', 'admin', 'super_admin'].includes(role)) return deny();
    } else if (area === 'portal') {
      const { data, error: membershipError } = await client.rpc('get_active_portal_membership');
      if (membershipError) return finish(new NextResponse('Access verification unavailable.', { status: 503 }));
      if (!data?.has_access || !data.client_id) return deny();
    }
    return finish(response);
  } catch {
    return finish(new NextResponse('Access verification unavailable.', { status: 503 }));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/staff/:path*', '/portal/:path*', '/uat/:path*', '/pbx/:path*', '/account/:path*'],
};
