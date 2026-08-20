import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Mobile device detection helper.
 * Returns true for mobile phones and mobile WebViews (Android, iOS).
 * Returns false for desktop PCs, laptops, and large screens/tablets (iPad, Desktop Mac/Windows/Linux).
 */
function isMobileDevice(request: NextRequest): boolean {
  const url = request.nextUrl
  const viewParam = url.searchParams.get('view')
  if (viewParam === 'mobile') return true
  if (viewParam === 'desktop') return false

  const viewCookie = request.cookies.get('agrivil_view_mode')?.value
  if (viewCookie === 'mobile') return true
  if (viewCookie === 'desktop') return false

  const secChUaMobile = request.headers.get('sec-ch-ua-mobile')
  if (secChUaMobile === '?1') return true

  const ua = request.headers.get('user-agent') || ''

  // Exclude common desktop platforms unless they explicitly identify as Mobile/Capacitor
  if (/Windows NT|Macintosh(?!.*iPhone)|X11; Linux x86_64/i.test(ua) && !/Mobile|Android.*Mobile|Capacitor/i.test(ua)) {
    return false
  }

  // Treat iPad and tablet as desktop/larger screen
  if (/iPad|Tablet/i.test(ua) && !/Mobile/i.test(ua)) {
    return false
  }

  // Check for mobile phone user agents
  return /Android.*Mobile|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Capacitor|com\.agrivil\.marketplace/i.test(ua)
}

/**
 * Maps a desktop/clean URL to its corresponding mobile route inside `app/m/**`
 */
function mapDesktopToMobileRoute(pathname: string): string | null {
  if (pathname === '/' || pathname === '') return '/m'
  if (pathname === '/shop' || pathname === '/categories') return '/m/categories'
  if (pathname.startsWith('/categories/')) {
    return '/m' + pathname
  }
  if (pathname.startsWith('/shop/')) {
    const slug = pathname.replace('/shop/', '')
    return `/m/product/${slug}`
  }
  if (pathname.startsWith('/product/')) {
    return '/m' + pathname
  }
  if (pathname === '/farmers') return '/m/farmers'
  if (pathname.startsWith('/farmers/')) {
    return '/m' + pathname
  }
  if (pathname === '/recipes') return '/m/recipes'
  if (pathname.startsWith('/recipes/')) {
    return '/m' + pathname
  }
  if (pathname === '/bundles') return '/m/bundles'
  if (pathname === '/cart') return '/m/cart'
  if (pathname === '/checkout') return '/m/checkout'
  if (pathname.startsWith('/checkout/')) {
    return '/m' + pathname
  }
  if (pathname === '/orders') return '/m/orders'
  if (pathname.startsWith('/orders/')) {
    const rest = pathname.replace('/orders/', '')
    if (rest === 'track') return '/m/orders/track'
    return `/m/orders/${rest}`
  }
  if (pathname === '/account') return '/m/account'
  if (pathname.startsWith('/account/')) {
    return '/m' + pathname
  }
  if (pathname === '/search') return '/m/search'
  if (pathname === '/local') return '/m/local'
  if (pathname === '/splash') return '/m/splash'
  if (pathname.startsWith('/onboarding')) return '/m' + pathname
  if (pathname === '/login' || pathname === '/auth/login') return '/m/auth/login'
  if (pathname === '/signup' || pathname === '/auth/signup') return '/m/auth/signup'

  return null
}

/**
 * Maps an `/m/**` route back to its clean desktop equivalent
 */
function mapMobileToDesktopRoute(pathname: string): string {
  if (pathname === '/m' || pathname === '/m/') return '/'
  if (pathname === '/m/categories') return '/shop'
  if (pathname.startsWith('/m/categories/')) {
    const slug = pathname.replace('/m/categories/', '')
    return `/shop/${slug}`
  }
  if (pathname.startsWith('/m/product/')) {
    const slug = pathname.replace('/m/product/', '')
    return `/shop/${slug}`
  }
  if (pathname === '/m/farmers') return '/farmers'
  if (pathname.startsWith('/m/farmers/')) {
    return pathname.replace('/m', '')
  }
  if (pathname === '/m/recipes') return '/recipes'
  if (pathname.startsWith('/m/recipes/')) {
    return pathname.replace('/m', '')
  }
  if (pathname === '/m/bundles') return '/bundles'
  if (pathname === '/m/cart') return '/shop'
  if (pathname === '/m/checkout') return '/checkout'
  if (pathname.startsWith('/m/checkout/')) {
    return pathname.replace('/m', '')
  }
  if (pathname === '/m/orders') return '/orders'
  if (pathname.startsWith('/m/orders/')) {
    return pathname.replace('/m', '')
  }
  if (pathname === '/m/account') return '/account'
  if (pathname.startsWith('/m/account/')) {
    return pathname.replace('/m', '')
  }
  if (pathname === '/m/search') return '/shop'
  if (pathname === '/m/local') return '/local'
  if (pathname === '/m/auth/login') return '/login'
  if (pathname === '/m/auth/signup') return '/signup'
  if (pathname.startsWith('/m/onboarding') || pathname === '/m/splash') return '/'

  // Default fallback: strip /m
  const stripped = pathname.replace(/^\/m/, '')
  return stripped || '/'
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const pathname = url.pathname

  // 1. Bypass internal and portal routes
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/farmer') ||
    pathname.startsWith('/preview') ||
    pathname.startsWith('/emu') ||
    pathname.startsWith('/support') ||
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next()
  }

  const isMobile = isMobileDevice(request)

  // 2. Redirect legacy /w routes to clean desktop URLs (preventing /w from being visible)
  if (pathname === '/w' || pathname.startsWith('/w/')) {
    const cleanPath = pathname.replace(/^\/w/, '') || '/'
    url.pathname = cleanPath
    return NextResponse.redirect(url, { status: 307 })
  }

  // 3. Desktop / Tablet / Large Screen routing
  if (!isMobile) {
    // If a desktop user intentionally visits /m or /m/**, redirect to clean desktop route
    if (pathname === '/m' || pathname.startsWith('/m/')) {
      const desktopPath = mapMobileToDesktopRoute(pathname)
      url.pathname = desktopPath
      return NextResponse.redirect(url, { status: 307 })
    }

    // If desktop visits /categories, redirect to /shop
    if (pathname === '/categories') {
      url.pathname = '/shop'
      return NextResponse.redirect(url, { status: 307 })
    }

    // Clean desktop routes are served directly
    return NextResponse.next()
  }

  // 4. Mobile routing (Smart internal rewriting to keep URL clean without /m)
  if (isMobile) {
    // If mobile user visits clean URL (e.g. /, /shop, /farmers, /recipes),
    // rewrite internally to the matching /m/** route so the URL stays clean in the address bar
    if (!pathname.startsWith('/m')) {
      const mobileTarget = mapDesktopToMobileRoute(pathname)
      if (mobileTarget) {
        url.pathname = mobileTarget
        return NextResponse.rewrite(url)
      }
    }

    // Direct /m visits (e.g. from Capacitor Android app) are served directly
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt, manifest.webmanifest
     * - static image and media assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|robots.txt|sitemap.xml|golden-acres|.*\\.(?:png|jpg|jpeg|gif|webp|svg|mp4|webm|ico|txt|xml|json|css|js|woff|woff2|ttf|eot)$).*)',
  ],
}
