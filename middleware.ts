import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const pathname = url.pathname

  // Only handle root '/' route for automatic device detection
  if (pathname === '/') {
    // Check for explicit query parameter override (e.g. ?view=desktop or ?view=mobile)
    const viewParam = url.searchParams.get('view')
    if (viewParam === 'mobile') {
      url.pathname = '/m'
      return NextResponse.redirect(url)
    }
    if (viewParam === 'desktop') {
      url.pathname = '/w'
      return NextResponse.redirect(url)
    }

    const userAgent = request.headers.get('user-agent') || ''
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent)

    if (isMobile) {
      url.pathname = '/m'
      return NextResponse.redirect(url)
    } else {
      url.pathname = '/w'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/'],
}
