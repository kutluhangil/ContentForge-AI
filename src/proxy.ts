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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes and static files
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/fonts/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Run intl middleware first
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

    return supabaseResponse;
  }

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
