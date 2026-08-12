import { NextRequest, NextResponse } from 'next/server'

/** Known page/API prefixes. Everything else goes home. */
const ALLOWED = [
  '/s2s',
  '/inquiry',
  '/book-one',
  '/orbs',
  '/gigi',
  '/order',
  '/privacy',
  '/terms',
  '/books',
  '/about-the-book',
  '/about-gigi',
  '/about',
  '/enter',
  '/preorder',
  '/thank-you-preorder',
  '/codex',
  '/source-field',
  '/console',
  '/contact',
  '/writings',
  '/subscribe',
  '/newsletter',
  '/api',
]

function isAllowed(pathname: string): boolean {
  if (pathname === '/') return true
  return ALLOWED.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isAllowed(pathname)) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = '/'
  url.search = ''
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|favicon\\.png|apple-touch-icon\\.png|icon\\.png|robots\\.txt|sitemap\\.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?|css|js|map)$).*)',
  ],
}
