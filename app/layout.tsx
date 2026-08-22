import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import {
  Geist,
  Geist_Mono,
  Source_Serif_4,
  Plus_Jakarta_Sans,
} from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { SessionProvider } from '@/components/golden-acres/auth/session-context'
import { DataStoreProvider } from '@/components/golden-acres/store/data-store'
import { RecentlyViewedProvider } from '@/components/golden-acres/store/recently-viewed'
import { ServiceWorkerRegister } from '@/components/service-worker-register'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})
const sourceSerif = Source_Serif_4({
  variable: '--font-source-serif',
  subsets: ['latin'],
  display: 'swap',
  preload: false,
})
const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL('https://agrivil.com'),
  title: "AgriVil — Farm Fresh. Market Smart. Delivered with care.",
  description:
    "AgriVil is Ghana's premier virtual farmers' market connecting consumers directly to smallholder farmers with transparent cold-chain distribution, FEFO batching, and fair farmer pricing.",
  generator: 'AgriVil',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: "AgriVil — Farm Fresh. Market Smart.",
    description:
      "Ghana's premier cold-chain virtual farmers' marketplace. 100% verified local harvest delivered fresh.",
    url: 'https://agrivil.com',
    siteName: 'AgriVil',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AgriVil — Farm Fresh. Market Smart.',
      },
    ],
    locale: 'en_GH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "AgriVil — Farm Fresh. Market Smart.",
    description: "Ghana's premier cold-chain virtual farmers' marketplace.",
    images: ['/og-image.jpg'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0B3B25' },
    { media: '(prefers-color-scheme: dark)', color: '#072618' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} ${jakarta.variable}`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SessionProvider>
            <DataStoreProvider>
              <RecentlyViewedProvider>
                {children}
                <ServiceWorkerRegister />
              </RecentlyViewedProvider>
            </DataStoreProvider>
          </SessionProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
