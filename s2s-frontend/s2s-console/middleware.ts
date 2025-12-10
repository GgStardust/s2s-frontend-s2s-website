import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Redirect root path to diagnostic
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/diagnostic', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/',
}



