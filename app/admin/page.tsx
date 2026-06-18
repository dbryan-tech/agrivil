import { BiDashboard } from '@/components/golden-acres/dashboard/bi-dashboard'
import { RouteGuard } from '@/components/golden-acres/auth/route-guard'

export default function DashboardPage() {
  return (
    <RouteGuard role="staff" loginPath="/support/login">
      <BiDashboard />
    </RouteGuard>
  )
}
