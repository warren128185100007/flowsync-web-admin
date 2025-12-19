// middleware.ts (at project root) - SIMPLE VERSION
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('admin-session')?.value;
  
  console.log(`Middleware checking: ${pathname}`);
  
  // ONLY protect dashboard routes
  if (pathname.startsWith('/dashboard') && !token) {
    console.log('No auth, redirecting to login');
    return NextResponse.redirect(new URL('/auth/super-admin', request.url));
  }
  
  return NextResponse.next();
}

// Only protect dashboard routes
export const config = {
  matcher: '/dashboard/:path*',
};