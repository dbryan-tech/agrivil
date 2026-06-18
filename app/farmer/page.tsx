import { FarmerPortal } from '@/components/golden-acres/farmer/farmer-portal'
import { RouteGuard } from '@/components/golden-acres/auth/route-guard'

export default function FarmerPage() {
  return (
    <RouteGuard role="farmer" loginPath="/farmer/login">
      <FarmerPortal />
    </RouteGuard>
  )
}
