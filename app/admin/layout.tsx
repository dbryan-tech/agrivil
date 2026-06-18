import type { ReactNode } from 'react'

export const metadata = {
  title: 'AgriVil — Business Intelligence',
  description:
    'KPIs, unit economics, on-time delivery, spoilage, and demand forecasting for AgriVil.',
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <div className="ga-root min-h-screen bg-background">{children}</div>
}
