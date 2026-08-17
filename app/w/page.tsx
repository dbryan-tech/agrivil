import StoreLayout from '@/app/(store)/layout'
import HomePage from '@/app/(store)/page'

export const metadata = {
  title: 'AgriVil — Fresh From Ghana\'s Farms, To Your Door',
  description:
    "AgriVil is Ghana's virtual farmers' market. Order fresh, perishable produce direct from local farmers with scheduled delivery, Mobile Money checkout, and farm-to-door reliability.",
}

export default function WebStorefrontPage() {
  return (
    <StoreLayout>
      <HomePage />
    </StoreLayout>
  )
}
