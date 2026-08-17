# IMPLEMENTATION PLAYBOOK

## Recommended app structure
Organize code by product domain rather than one massive screen folder.

Example:
src/
  app/
  navigation/
  theme/
  components/
  features/
    onboarding/
    shop/
    product/
    cart/
    checkout/
    orders/
    discover/
    farmers/
    account/
    farmerPortal/
  services/
  state/
  assets/
  utils/

## Data model concepts
Consumer:
- User
- Address
- PaymentMethod
- SavedItem
- Notification

Commerce:
- Product
- ProductVariant
- Inventory
- Farmer
- Category
- Cart
- CartItem
- Order
- OrderItem
- Delivery
- DeliverySlot
- Payment
- Refund

Content:
- Recipe
- RecipeIngredient
- Bundle
- Subscription

Farmer:
- FarmerProfile
- Farm
- FarmerProduct
- FarmerOrder
- LedgerEntry
- Payout

## API integration boundaries
Keep external services behind service interfaces.

Examples:
- authService
- catalogService
- farmerService
- cartService
- checkoutService
- paymentService
- deliveryService
- notificationService
- recipeService
- subscriptionService

Do not scatter payment or logistics provider logic throughout UI components.

## State management
Represent explicit states rather than inferred UI booleans.

Example:
OrderStatus =
- pending_payment
- paid
- preparing
- picked_up
- out_for_delivery
- delivered
- cancelled
- issue_reported

## Network behavior
The mobile app should:
- show loading states
- tolerate slow networks
- retry safely
- avoid duplicate checkout submissions
- preserve cart where possible
- communicate stale data for inventory/price-sensitive items

## Variable-weight flow
1. User chooses estimated quantity.
2. UI displays estimated price/range.
3. Order is created with expected weight.
4. Picker confirms final weight.
5. Final amount is reconciled before/around capture according to payment implementation.
6. User sees final weight and price clearly.

## Delivery
Expose:
- delivery address
- GhanaPostGPS
- available slots
- delivery fee
- live status where supported

## Farmer experience
Keep farmer screens simpler:
- large readable totals
- low-bandwidth image upload options
- concise forms
- clear stock controls
- straightforward payout ledger
