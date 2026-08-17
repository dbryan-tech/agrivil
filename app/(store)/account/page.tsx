import { RouteGuard } from '@/components/golden-acres/auth/route-guard'
import { AccountDashboard } from '@/components/golden-acres/account/account-dashboard'

export const metadata = {
  title: 'My Account — AgriVil',
  description: 'Manage your profile, orders, addresses, and produce boxes.',
}

export default function AccountPage() {
  return (
    <RouteGuard role="customer" loginPath="/login">
      <AccountDashboard />
    </RouteGuard>
  )
}
