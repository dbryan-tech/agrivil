# NAVIGATION RULES

## Consumer
Bottom navigation is persistent on high-level browsing screens:
Home | Categories | Farmers | Orders | Account

Hide bottom navigation on:
- onboarding
- authentication
- product details when focus is purchase
- cart
- checkout
- payment
- confirmation
- delivery tracking
- modal/sheet states

## Back behavior
- Preserve previous scroll position when possible.
- Return users to the exact discovery context after closing product details.
- Do not unexpectedly reset filters.
- Keep cart contents persistent across browsing.

## Search
Search should support:
- products
- farmers
- recipes/content where applicable
- recent searches
- suggested searches

## Shop Local
The local experience should use the user's delivery location/GhanaPostGPS and proximity information to surface relevant farmers/products.
