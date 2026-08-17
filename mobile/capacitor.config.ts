import type { CapacitorConfig } from '@capacitor/cli'

/**
 * AgriVil Mobile App Capacitor Configuration
 *
 * Configured for Android APK & iOS build pipelines.
 * Loads the production deployed Vercel site at /m (mobile app surface)
 * with native hardware safe areas, splash screen, and offline fallbacks.
 */
const config: CapacitorConfig = {
  appId: 'com.agrivil.marketplace',
  appName: 'AgriVil',
  webDir: '../out',
  server: {
    // Vercel live production URL serving the mobile app route /m
    url: process.env.CAPACITOR_SERVER_URL || 'https://agrivil1.vercel.app/m',
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: '#1E5D3B',
      showSpinner: false,
      androidScaleType: 'CENTER',
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      backgroundColor: '#F4F1EA',
      style: 'DARK',
    },
  },
}

export default config
