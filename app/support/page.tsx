import { OpsConsole } from '@/components/golden-acres/ops/ops-console'
import { RouteGuard } from '@/components/golden-acres/auth/route-guard'

export default function OpsPage() {
  return (
    <RouteGuard role="staff" loginPath="/support/login">
      <OpsConsole />
    </RouteGuard>
  )
}
