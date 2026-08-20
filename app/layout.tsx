import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import {
  Geist,
  Geist_Mono,
  Source_Serif_4,
  Onest,
  JetBrains_Mono,
  Archivo,
  IBM_Plex_Mono,
  Space_Grotesk,
  Nunito,
  Fraunces,
  Plus_Jakarta_Sans,
} from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { SessionProvider } from '@/components/golden-acres/auth/session-context'
import { DataStoreProvider } from '@/components/golden-acres/store/data-store'
import { RecentlyViewedProvider } from '@/components/golden-acres/store/recently-viewed'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const sourceSerif = Source_Serif_4({
  variable: '--font-source-serif',
  subsets: ['latin'],
  display: 'swap',
})
const onest = Onest({
  variable: '--font-onest',
  subsets: ['latin'],
  display: 'swap',
})
const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  display: 'swap',
})
const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
})
const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600', '700'],
})
const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})
const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
})
const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
})
const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: "AgriVil — Fresh From Ghana's Farms, To Your Door",
  description:
    "AgriVil, managed under Golden Acres Ghana, is Ghana's virtual farmers' market. Order fresh, perishable produce direct from local farmers with scheduled delivery, Mobile Money checkout, and farm-to-door reliability.",
  generator: 'v0.app',
  openGraph: {
    title: "AgriVil — Fresh From Ghana's Farms",
    description:
      "Ghana's virtual farmers' market. Fresh produce, direct from local farmers.",
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0f7a47' },
    { media: '(prefers-color-scheme: dark)', color: '#08160f' },
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
      className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} ${onest.variable} ${jetbrainsMono.variable} ${archivo.variable} ${ibmPlexMono.variable} ${spaceGrotesk.variable} ${nunito.variable} ${fraunces.variable} ${jakarta.variable}`}
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
              </RecentlyViewedProvider>
            </DataStoreProvider>
          </SessionProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
