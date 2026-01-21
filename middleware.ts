import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define role permissions
const rolePermissions: Record<string, string[]> = {
  admin: ['*'], // Admin has access to everything
  dokter: ['/dashboard', '/emr'],
  kasir: ['/dashboard', '/kasir'],
  farmasi: ['/dashboard', '/farmasi'],
  perawat: ['/dashboard', '/emr'],
};

export function middleware(request: NextRequest) {
  // Allow login page always
  if (request.nextUrl.pathname === '/login') {
    return NextResponse.next();
  }

  // For dashboard pages, we'll handle role check on client side
  // since middleware runs on server and can't access localStorage
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
