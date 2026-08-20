/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: '.',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Hide the Next.js dev indicator (the floating "N") for clean local previews.
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },
}

export default nextConfig
