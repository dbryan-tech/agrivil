'use client'

import { useEffect, useRef, useState } from 'react'

const SCREENS = [
  { key: 'home', label: 'Home', route: '/preview/home' },
  { key: 'orders', label: 'Shipping / Orders', route: '/preview/orders' },
  { key: 'track', label: 'Live Tracking', route: '/preview/track' },
  { key: 'product', label: 'Product Details', route: '/preview/product' },
  { key: 'cart', label: 'Basket / Cart', route: '/preview/cart' },
  { key: 'checkout', label: 'Checkout & Pay', route: '/preview/checkout' },
  { key: 'wallet', label: 'Wallet', route: '/preview/wallet' },
  { key: 'account', label: 'Account', route: '/preview/account' },
  { key: 'categories', label: 'Categories', route: '/preview/categories' },
  { key: 'farmers', label: 'Farmers', route: '/preview/farmers' },
] as const

const DEVICES = {
  iphone15: { w: 393, h: 852, radius: 54, screenRadius: 46, name: 'iPhone 15 Pro (6.1")' },
  iphone15max: { w: 430, h: 932, radius: 56, screenRadius: 48, name: 'iPhone 15 Pro Max (6.7")' },
  compact: { w: 375, h: 812, radius: 48, screenRadius: 40, name: 'Compact (5.8")' },
  tablet: { w: 500, h: 920, radius: 44, screenRadius: 36, name: 'Large Screen (8.0")' },
} as const

export default function EmulatorPage() {
  const [device, setDevice] = useState<keyof typeof DEVICES>('iphone15')
  const [screen, setScreen] = useState<(typeof SCREENS)[number]['key']>('orders')
  const [clock, setClock] = useState('11:11')
  const frameRef = useRef<HTMLIFrameElement>(null)

  const d = DEVICES[device]

  useEffect(() => {
    const tick = () => {
      const n = new Date()
      let h = n.getHours()
      const m = n.getMinutes()
      h = h % 12 || 12
      setClock(`${h}:${String(m).padStart(2, '0')}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const current = SCREENS.find((s) => s.key === screen)!
  const deviceWidth = `min(${d.w}px, calc(100vw - 32px), calc((100dvh - 160px) * ${d.w / d.h}))`

  return (
    <div
      style={{
        minHeight: '100dvh',
        margin: 0,
        background:
          'radial-gradient(120% 120% at 50% 0%, #1c2026 0%, #0e1013 60%, #060708 100%)',
        color: '#e8eaed',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 14px 28px',
        boxSizing: 'border-box',
      }}
    >
      {/* Zero Scrollbar Styles */}
      <style jsx global>{`
        * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        *::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
      `}</style>

      {/* Emulator Header Controls */}
      <div
        style={{
          width: '100%',
          maxWidth: 1200,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
          marginBottom: 16,
          padding: '8px 12px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#0B3B25',
              boxShadow: '0 0 0 4px rgba(11,59,37,.25)',
            }}
          />
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-.01em', color: '#FFFFFF' }}>
              AgriVil Mobile Emulator
            </div>
            <div style={{ fontSize: 11.5, color: '#9aa0a6', fontWeight: 500 }}>
              Clean Bright Tan (#F7F5F0) · Premium Redesign Suite
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Device toggle */}
          <div
            style={{
              display: 'inline-flex',
              background: '#16191f',
              border: '1px solid #282c34',
              borderRadius: 999,
              padding: 3,
            }}
          >
            {Object.entries(DEVICES).map(([k, v]) => (
              <button
                key={k}
                onClick={() => setDevice(k as keyof typeof DEVICES)}
                style={{
                  border: 0,
                  background: device === k ? '#0B3B25' : 'transparent',
                  color: device === k ? '#FFFFFF' : '#9aa0a6',
                  fontSize: 11.5,
                  fontWeight: 600,
                  padding: '5px 11px',
                  borderRadius: 999,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {v.name}
              </button>
            ))}
          </div>

          {/* Screen switcher */}
          <div
            style={{
              display: 'inline-flex',
              background: '#16191f',
              border: '1px solid #282c34',
              borderRadius: 999,
              padding: 3,
              flexWrap: 'wrap',
              maxWidth: 580,
            }}
          >
            {SCREENS.map((s) => (
              <button
                key={s.key}
                onClick={() => setScreen(s.key)}
                style={{
                  border: 0,
                  background: screen === s.key ? '#0B3B25' : 'transparent',
                  color: screen === s.key ? '#FFFFFF' : '#9aa0a6',
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: 999,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Realistic Phone Bezel Frame */}
      <div
        style={{
          width: deviceWidth,
          aspectRatio: `${d.w} / ${d.h}`,
          maxHeight: 'calc(100dvh - 120px)',
          background: 'linear-gradient(145deg, #2b303c, #14171d)',
          borderRadius: d.radius,
          padding: 10,
          boxShadow:
            '0 0 0 1px rgba(255,255,255,0.12), 0 25px 60px -10px rgba(0,0,0,0.8), 0 50px 100px -20px rgba(0,0,0,0.9)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          transform: 'translateZ(0)',
        }}
      >
        {/* Inner Phone Screen Canvas */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: d.screenRadius,
            overflow: 'hidden',
            background: '#F7F5F0',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.2)',
          }}
        >
          {/* iOS Status Bar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 44,
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 24px',
              fontSize: 13,
              fontWeight: 700,
              color: '#211A12',
              pointerEvents: 'none',
            }}
          >
            <div>{clock}</div>

            {/* Dynamic Island */}
            <div
              style={{
                position: 'absolute',
                top: 10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 105,
                height: 28,
                background: '#000000',
                borderRadius: 20,
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
            />

            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {/* Cellular */}
              <svg width="15" height="11" viewBox="0 0 17 11" fill="currentColor">
                <rect x="0" y="8" width="3" height="3" rx="0.5" />
                <rect x="4.5" y="5.5" width="3" height="5.5" rx="0.5" />
                <rect x="9" y="3" width="3" height="8" rx="0.5" />
                <rect x="13.5" y="0.5" width="3" height="10.5" rx="0.5" />
              </svg>
              {/* Wifi */}
              <svg width="15" height="11" viewBox="0 0 16 12" fill="currentColor">
                <path d="M8 10.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                <path d="M4.5 6.5a5 5 0 017 0 .8.8 0 001.1-1.1 6.6 6.6 0 00-9.2 0 .8.8 0 001.1 1.1z" />
                <path d="M1.5 3.5a9.2 9.2 0 0113 0 .8.8 0 001.1-1.1 10.8 10.8 0 00-15.2 0 .8.8 0 001.1 1.1z" />
              </svg>
              {/* Battery */}
              <div
                style={{
                  width: 22,
                  height: 11,
                  border: '1.5px solid currentColor',
                  borderRadius: 3.5,
                  padding: 1.5,
                  position: 'relative',
                }}
              >
                <div style={{ width: '85%', height: '100%', background: 'currentColor', borderRadius: 1.5 }} />
                <div
                  style={{
                    position: 'absolute',
                    right: -3.5,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 2,
                    height: 4,
                    background: 'currentColor',
                    borderRadius: '0 1px 1px 0',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Iframe Loading the Active Preview Screen */}
          <iframe
            ref={frameRef}
            src={current.route}
            title={current.label}
            style={{
              width: '100%',
              height: '100%',
              border: 0,
              paddingTop: 36,
              background: '#F7F5F0',
              overflow: 'hidden',
            }}
          />

          {/* iOS Bottom Home Bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 128,
              height: 4.5,
              background: 'rgba(33,26,18,0.25)',
              borderRadius: 3,
              zIndex: 50,
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>
    </div>
  )
}
