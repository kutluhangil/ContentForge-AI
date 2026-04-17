import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/middleware';

const intlMiddleware = createMiddleware(routing);

const PROTECTED_PATHS = ['/dashboard', '/repurpose', '/history', '/templates', '/settings'];

function isProtectedPath(pathname: string): boolean {
  // Remove locale prefix before checking
  const withoutLocale = pathname.replace(/^\/(tr|en)/, '');
  return PROTECTED_PATHS.some((path) => withoutLocale.startsWith(path));
}

const API_PUBLIC_PATHS = ['/api/webhooks/', '/api/health'];

function isApiPublic(pathname: string): boolean {
  return API_PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/fonts/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // API routes — skip i18n, apply auth where needed
  if (pathname.startsWith('/api/')) {
    if (isApiPublic(pathname)) {
      return NextResponse.next();
    }
    // Protected API routes get session check
    const { supabaseResponse, user } = await updateSession(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return supabaseResponse;
  }

  // Run intl middleware first for all page routes
  const intlResponse = intlMiddleware(request);

  // For protected paths, check auth
  if (isProtectedPath(pathname)) {
    const { supabaseResponse, user } = await updateSession(request);

    if (!user) {
      const locale = pathname.split('/')[1] || 'tr';
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Merge supabase cookies into intl response
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      intlResponse.cookies.set(cookie.name, cookie.value);
    });

    return intlResponse;
  }

  // Public pages — still refresh session cookies if present
  const { supabaseResponse } = await updateSession(request);
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });

  return intlResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
