import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  console.log(`🛡️ Middleware checking: ${pathname}`);
  
  // Skip auth for login page
  if (pathname.startsWith('/auth')) {
    return NextResponse.next();
  }
  
  // Check for admin user cookie
  const adminCookie = request.cookies.get('admin_user');
  const hasLocalStorage = request.headers.get('x-admin-user');
  
  // If no auth and trying to access dashboard, redirect to login
  if (pathname.startsWith('/dashboard')) {
    if (!adminCookie && !hasLocalStorage) {
      console.log('🔒 No auth found, redirecting to login');
      return NextResponse.redirect(new URL('/auth/super-admin', request.url));
    }
    
    // Check role for super-admin-only routes
    const superAdminRoutes = [
      '/dashboard/admin',
      '/dashboard/access-control',
      '/dashboard/audit-logs',
      '/dashboard/database',
      '/dashboard/system-health'
    ];
    
    const isSuperAdminRoute = superAdminRoutes.some(route => 
      pathname.startsWith(route)
    );
    
    if (isSuperAdminRoute) {
      let userRole = 'admin';
      
      if (adminCookie) {
        try {
          const adminData = JSON.parse(decodeURIComponent(adminCookie.value));
          userRole = adminData.role || 'admin';
        } catch (error) {
          console.error('Error parsing admin cookie:', error);
        }
      }
      
      if (userRole !== 'super_admin') {
        console.log(`⛔ Access denied: ${userRole} trying to access ${pathname}`);
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*'
  ]
};