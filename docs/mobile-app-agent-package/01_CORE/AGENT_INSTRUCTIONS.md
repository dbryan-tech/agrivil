# AGRIVIL MOBILE APP — MASTER AGENT INSTRUCTIONS

You are building Agrivil as a production-quality mobile marketplace, not a template or a generic grocery clone.

## 1. Follow the visual language exactly
Use the approved Agrivil reference images as the primary visual authority.

The experience should feel:
- quiet
- premium
- warm
- trustworthy
- agricultural
- contemporary
- information-rich without looking crowded

Avoid:
- excessive glassmorphism
- heavy blur
- excessive rounded cards
- excessive floating containers
- giant gradients
- emoji as primary UI
- ornamental iconography
- unnecessary drop shadows
- dense dashboard-style layouts in the consumer app

## 2. Design hierarchy
Prefer this order:
1. strong typography
2. photography
3. whitespace
4. thin dividers / subtle surfaces
5. restrained borders
6. green primary actions
7. secondary accent only when useful

## 3. Component philosophy
Create components that can be reused across the product:
- AppBar
- SearchField
- BottomNav
- SectionHeader
- ProductTile
- ProductRow
- FarmerTile
- FarmerRow
- QuantityControl
- PriceBlock
- Rating
- FilterChip
- FilterSheet
- PrimaryButton
- SecondaryButton
- InlineNotice
- StatusBadge
- DeliveryTimeline
- AddressBlock
- PaymentOption
- EmptyState
- ErrorState
- LoadingSkeleton
- ImageGallery
- RecipeCard
- BundleCard
- SubscriptionCard

## 4. Do not invent new visual patterns screen by screen
Once a pattern is approved, reuse it consistently.

Example:
If product quantity selection uses the Agrivil +/- control, use the same control everywhere unless there is a documented reason to change it.

## 5. Real marketplace behavior matters
Support:
- variable-weight pricing
- stock states
- dynamic delivery fee
- GhanaPostGPS
- delivery time slots
- MoMo and card payments
- order tracking
- proof of delivery
- farmer profiles
- local/nearby matching
- subscriptions
- bundle orders
- recipe-to-cart journeys

## 6. Ghana-first UX
Use GH₵ currency.
Use GhanaPostGPS as an explicit delivery address field.
Use Ghanaian delivery wording and local context.
Do not use US-centric checkout assumptions.

## 7. Content should sound human
Copy must be short, clear, confident and warm.

Avoid:
"Discover our revolutionary ecosystem..."
Prefer:
"Fresh from local farmers, delivered to your door."

## 8. Responsive implementation
Design mobile-first.
Support Android screen sizes first, while keeping iOS compatibility where practical.
Do not hard-code one device width.

## 9. Image treatment
Use high-quality food/farm photography.
Prefer natural lighting and real-looking produce.
Do not over-round photos.
Do not place every image inside a floating card.

## 10. Accessibility
Maintain strong text contrast, readable body text, clear tap targets, visible focus/pressed states and meaningful labels.

## 11. State completeness
Every important flow must include:
- loading
- success
- failure
- empty
- unavailable
- low stock / out of stock
- network error
- retry
- confirmation

## 12. Shipping and logistics
The technical blueprint requires real-time order handoff and status synchronization with a 3PL, tracking numbers, delivery time estimates and proof-of-delivery capture. Build the front end so these states can be represented cleanly.

## 13. Output quality bar
Before declaring a screen complete, compare it against the matching mockup and verify:
- typography hierarchy
- spacing
- button placement
- image proportions
- navigation
- copy
- status treatment
- visual density
- colour use

Never add UI just because it is common in another app.
