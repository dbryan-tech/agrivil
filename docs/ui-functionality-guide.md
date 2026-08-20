# AGRIVIL — END-TO-END UI & FUNCTIONAL ENGINEERING GUIDE

## Purpose

This guide is a standalone engineering contract for the Agrivil AI build agent.

The rule is simple:

> **Every visible UI element that looks actionable must actually work end-to-end.**

A screen is not complete because it looks correct. It is complete when the user can perform the intended task and the frontend, application state, API/service layer, database and external integrations behave correctly.

This document applies to the entire mobile app:

```text
ONBOARDING
SHOP
PRODUCT
CART / CHECKOUT
ORDERS / DELIVERY
DISCOVER
FARMERS
ACCOUNT
SELLER / FARMER PORTAL
```

---

# 1. NO FAKE INTERACTIONS

Do not ship:

```ts
onClick={() => console.log('coming soon')}
```

or:

```ts
onClick={() => setOpen(true)}
```

when the resulting panel has no real functionality.

Do not use fake counters, fake success messages, placeholder orders, hard-coded balances or local-only cart behavior where a backend-backed feature is required.

Temporary mocks are permitted **only behind an explicit service/repository boundary** and must be easy to replace with the real implementation.

---

# 2. THE END-TO-END CONTRACT

Every important action follows this chain:

```text
USER ACTION
   ↓
UI EVENT
   ↓
DOMAIN ACTION / HOOK
   ↓
SERVICE / REPOSITORY
   ↓
API REQUEST
   ↓
BACKEND AUTHORIZATION + VALIDATION
   ↓
DATABASE / EXTERNAL PROVIDER
   ↓
NORMALIZED RESPONSE
   ↓
CLIENT STATE UPDATE
   ↓
UI FEEDBACK / NAVIGATION
```

A component is not functionally complete until the chain is implemented or the missing backend capability is explicitly abstracted and tracked.

---

# 3. INSPECT THE EXISTING REPOSITORY BEFORE ADDING NEW LOGIC

The existing Agrivil repository is a Next.js project bootstrapped with v0 and already contains mobile routes/components and domain data. Reuse existing utilities, data models and components where appropriate instead of creating parallel implementations.

Before implementing a feature, identify:

- existing route
- existing component
- existing API/service
- existing context/state
- existing type/model
- existing validation
- existing backend route
- existing test coverage

Do not create duplicate cart, auth, product or order state merely because the current screen needs it.

---

# 4. RECOMMENDED DOMAIN BOUNDARIES

Use clear service boundaries:

```text
authService
catalogService
categoryService
farmerService
cartService
checkoutService
paymentService
deliveryService
orderService
recipeService
bundleService
subscriptionService
accountService
notificationService
sellerService
inventoryService
earningsService
supportService
```

UI components should call these services/hooks. They should not contain raw business rules and scattered `fetch()` calls.

---

# 5. UI STATE MODEL

Remote features should explicitly model:

```text
idle
loading
success
empty
error
retrying
refreshing
stale
```

Mutation features should additionally model:

```text
submitting
success
failure
```

Never treat `[]` as both "still loading" and "no results".

---

# 6. ERROR CONTRACT

Normalize backend/network failures.

Example:

```ts
type AppError = {
  code: string
  message: string
  userMessage: string
  retryable: boolean
  fieldErrors?: Record<string, string>
}
```

Typical codes:

```text
AUTH_REQUIRED
INVALID_CREDENTIALS
NETWORK_UNAVAILABLE
PRODUCT_OUT_OF_STOCK
PRICE_CHANGED
DELIVERY_UNAVAILABLE
INVALID_GHANAPOSTGPS
PAYMENT_FAILED
PAYMENT_PENDING
ORDER_NOT_FOUND
PERMISSION_DENIED
SUBSCRIPTION_UPDATE_FAILED
```

Never expose raw backend errors or stack traces to users.

---

# 7. AUTHENTICATION

## Sign up

Frontend:
- validate fields
- show field-level errors
- prevent duplicate submit
- submit to auth service
- show loading state
- handle existing account
- handle verification requirements
- store/restore session
- navigate only after successful auth

Backend:
- validate again
- hash passwords securely
- create user
- create authenticated session/token
- return only safe user/session data
- rate-limit authentication endpoints

## Login

Frontend:
- validate
- submit
- disable repeated submission
- handle bad credentials
- handle network failure
- restore session after success

Backend:
- validate credentials
- authorize
- issue session/token
- return safe user information

## Session restoration

On app start, resolve:

```text
unknown → authenticated
unknown → unauthenticated
```

Do not render protected application data before authentication state is known.

---

# 8. ONBOARDING FUNCTIONALITY

## Welcome

`Get started` → begin onboarding.

`I already have an account` → login.

## Location

`Use my location` must:
- request device permission
- handle granted
- handle denied
- handle permanently denied
- handle unavailable location
- resolve coordinates/address where supported

`Enter manually` → manual address/GhanaPostGPS flow.

## GhanaPostGPS

The field must:
- validate input
- show invalid-format feedback
- persist the address draft
- resolve locality where supported
- allow correction

## Delivery area

The backend decides pilot-zone eligibility.

Supported:
- save location
- continue onboarding

Unsupported:
- explain that Agrivil is not yet available in the area
- offer waitlist/interest capture where implemented

Do not perform final geofence authorization solely on the client.

---

# 9. HOME / SHOP

## Search

- input updates search state
- debounce network calls where appropriate
- show suggestions
- preserve submitted query
- navigate to results
- support empty/error/loading

## Categories

Every category affordance must navigate or filter a real product source.

## Quick add

`+` or `Add to cart` must:
- validate auth where required
- check current availability
- send the mutation through `cartService`
- update cart state from the authoritative response
- show success feedback
- handle price/stock conflict

Do not increment a badge locally and assume the backend succeeded.

---

# 10. PRODUCT DETAILS

Actions:

### Add to cart
Real cart mutation.

### Quantity
Real validation and state mutation.

### Save
Persist account-level saved state where supported.

### Farmer
Navigate to the real farmer profile.

### Related product
Navigate to the selected product.

### Out of stock
Disable/replace purchase action and present useful alternatives.

---

# 11. VARIABLE-WEIGHT PRODUCTS

Products such as yam/meat may not have a single fixed final weight.

The implementation must distinguish:

```text
requested / estimated quantity
        ↓
estimated price / price range
        ↓
cart line
        ↓
actual measured weight
        ↓
final reconciled amount
```

Never hide estimated values as if they were final values.

The backend remains authoritative for final price/weight reconciliation.

---

# 12. CART

The cart must stay synchronized with the authoritative cart source.

Actions:

- increase quantity
- decrease quantity
- remove item
- update address
- refresh delivery fee
- continue checkout

Every mutation must:
- show immediate appropriate feedback
- avoid duplicate submission
- handle out-of-stock
- handle changed price
- update totals from the server response

The client must never be the final authority for order totals.

---

# 13. CHECKOUT

Recommended flow:

```text
Address
 ↓
Delivery date
 ↓
Time slot
 ↓
Payment
 ↓
Review
 ↓
Place order
 ↓
Confirmation
```

The user must be able to move backward without losing valid entered information.

## Address

- load saved addresses
- create/edit address
- validate GhanaPostGPS
- verify delivery eligibility

## Delivery

- request available delivery slots
- disable unavailable slots
- calculate/display delivery fee
- show delivery estimate

## Payment

Supported methods from the product requirements include Mobile Money and Visa/Mastercard.

Frontend:
- create payment session/intent through backend
- launch provider flow where required
- handle pending/success/failure
- recover from cancellation

Backend:
- recalculate totals
- validate currency and amount
- authorize user/order
- verify payment with provider where supported
- create/confirm order according to payment rules
- handle provider callbacks/webhooks idempotently

Never trust the client for payment success.

---

# 14. PLACE ORDER / DUPLICATE PROTECTION

This is a high-risk mutation.

Implementation:

```text
User taps Place order
        ↓
Disable submission
        ↓
Generate idempotency/request key
        ↓
Backend receives request
        ↓
Backend checks duplicate request
        ↓
Order/payment workflow
        ↓
Single authoritative result
        ↓
UI confirmation
```

A double tap must not create two orders.

---

# 15. ORDERS

Use backend-backed order state.

Suggested normalized statuses:

```text
pending_payment
paid
preparing
picked_up
out_for_delivery
delivered
cancelled
issue_reported
refunded
```

Order list:
- fetch real orders
- filter by status
- navigate to order detail

Order detail:
- show authoritative totals
- show address
- show delivery slot
- show current status
- show tracking reference where available

---

# 16. DELIVERY / 3PL

The project requirements call for delivery-status synchronization with a logistics provider, tracking information, delivery estimates and proof-of-delivery support.

Architecture:

```text
3PL provider
   ↓
backend integration
   ↓
normalized delivery state
   ↓
mobile API
   ↓
mobile UI
```

Do not expose direct logistics-provider credentials in the client.

The client consumes normalized Agrivil delivery states.

---

# 17. TRACKING

The tracking screen must show real state rather than a decorative animation.

Use:
- current status
- timestamp history
- delivery estimate
- tracking/reference number
- map only where useful
- driver/partner details when available

Use polling, realtime events or websocket/subscription mechanisms only where supported by the backend.

---

# 18. PROOF OF DELIVERY

If proof is available:
- fetch via secure API/reference
- enforce authorization
- show timestamp/details
- present the proof asset safely

Do not expose internal storage URLs or privileged provider URLs.

---

# 19. FARMERS

## Farmer discovery

- real farmer data
- location/proximity when supported
- filter/search
- open farmer profile

## Farmer profile

Display:
- identity
- location
- story
- growing methods
- gallery
- products
- reviews when available

Every product listed on a farmer profile must link to the real product record.

---

# 20. RECIPES

Recipe detail:
- load actual recipe
- show ingredients
- show preparation information

`Shop ingredients`:
- resolve recipe ingredients to current catalog products
- identify unavailable matches
- add valid items to cart
- explain skipped/unavailable ingredients

Do not assume text equality between recipe ingredient names and product names.

---

# 21. BUNDLES

Bundle detail must load:
- contents
- price
- availability
- cadence where relevant

Adding a bundle must create a valid cart representation and validate current inventory.

---

# 22. SUBSCRIPTIONS

Every subscription action must be backend-confirmed.

Supported UI actions where implemented:

```text
start
pause
resume
skip
change cadence
cancel
```

States:

```text
active
paused
scheduled
cancelled
payment_failed
action_pending
```

Do not show a subscription as cancelled/paused until the backend confirms it.

---

# 23. ACCOUNT

## Profile

Edit → validate → save → update authoritative profile state.

## Addresses

Support where implemented:
- create
- edit
- delete
- set default

## Payment methods

Use provider tokens/references. Do not store raw card details in the Agrivil app/backend unless explicitly required by the payment architecture.

## Notifications

- load real notifications
- mark read
- deep-link to the relevant object

## Settings

Every toggle/action shown must persist to the correct source of truth.

---

# 24. SAVED ITEMS

Saved products/farmers/recipes should be persistent account relationships when the feature is account-based.

Implement:

```text
save
unsave
load saved
empty saved state
failure rollback
```

Optimistic UI is acceptable only with reliable rollback.

---

# 25. SELLER / FARMER PORTAL

## Seller onboarding

Capture required:
- identity/basic information
- farm details
- location/GhanaPostGPS
- verification information

Backend must determine onboarding/verification status.

## Seller dashboard

Metrics come from real data:
- sales
- pending orders
- inventory alerts
- earnings
- payouts

Do not leave demo numbers in production.

## Products

Support real:
- add
- edit
- publish/unpublish
- pricing
- inventory
- variable-weight rules
- image upload

## Inventory

Represent real states:

```text
available
low_stock
out_of_stock
reserved
```

## Seller orders

Use canonical order state and authorized seller operations.

## Earnings / ledger

Show authoritative server-calculated:
- sales
- fees/commission
- adjustments
- penalties when applicable
- net payout
- payout status

Never calculate an authoritative seller balance solely in frontend code.

---

# 26. FILE / IMAGE UPLOADS

For product/farmer imagery:

Frontend:
- file type validation
- size validation
- preview
- upload progress
- retry/cancel

Backend/storage:
- signed upload or controlled upload endpoint
- validate content type/size
- create asset record
- return safe asset ID

Do not send huge base64 payloads through normal API requests.

---

# 27. ROLE & AUTHORIZATION

Typical roles may include:

```text
customer
farmer
admin
support
```

Client-side route guards are UX only.

Backend authorization is mandatory for every protected operation.

Never trust a role supplied by the browser.

---

# 28. DEEP LINKS

Important entities should have routable paths, for example:

```text
/m/product/[slug]
/m/farmers/[id]
/m/recipes/[id]
/m/orders/[id]
/m/bundles/[id]
```

A deep link must still work when the user did not arrive through the Home screen.

Handle:
- loading
- not found
- deleted/unavailable entity
- unauthorized entity
- missing previous navigation context

---

# 29. CACHING / SERVER STATE

Use a consistent server-state strategy.

Good cache candidates:
- categories
- products
- farmers
- recipes
- static configuration

Mutations must invalidate/update related cached resources.

Do not treat cached data as authoritative for:
- payment
- order creation
- inventory-sensitive checkout
- seller payout

---

# 30. NETWORK FAILURE

The app must remain understandable under weak connectivity.

Requirements:
- preserve entered form data where safe
- show retry
- avoid duplicate mutations
- indicate stale/refreshing data where relevant
- recover safely after reconnection

Idempotency is required for critical mutations.

---

# 31. ACCESSIBILITY

Every actionable element needs:
- accessible name
- meaningful role
- adequate hit target
- readable contrast
- state communicated independently of color

Examples:

Bad:
`green dot = delivered`

Good:
`Delivered` + status indicator

Bad:
icon-only button with no accessible label

Good:
accessible label `Add tomatoes to cart`

---

# 32. ANALYTICS

Track meaningful product events where analytics is part of the project.

Examples:

```text
onboarding_started
onboarding_completed
search_submitted
product_viewed
product_added_to_cart
checkout_started
payment_started
payment_succeeded
payment_failed
order_created
order_delivered
farmer_viewed
recipe_viewed
bundle_added
subscription_started
subscription_cancelled
```

Analytics must never block the core action.

---

# 33. COMPONENT ACCEPTANCE

A reusable component is complete only when all relevant states exist.

## Button

```text
default
pressed
disabled
loading
success/error where meaningful
```

## Input

```text
empty
focused
filled
error
disabled
valid
```

## Product

```text
loading
available
low_stock
out_of_stock
price_changed
unavailable
error
```

## Remote list

```text
loading
success
empty
error
refreshing
load_more if applicable
```

---

# 34. TESTING STANDARD

## Consumer critical journey

```text
launch
→ onboarding
→ location
→ GhanaPostGPS
→ sign up/login
→ browse
→ search
→ product
→ quantity
→ cart
→ checkout
→ address
→ delivery slot
→ payment
→ confirmation
→ order
→ tracking
→ delivery
→ proof of delivery
```

## Seller critical journey

```text
seller onboarding
→ verification
→ dashboard
→ add product
→ inventory
→ order
→ fulfillment/update
→ earnings
```

These journeys must be executable against real services or clearly isolated development fixtures.

---

# 35. AUTOMATED TESTS

At minimum cover:

### Frontend
- form validation
- navigation
- auth guards
- cart mutations
- quantity changes
- loading/error states
- checkout persistence
- duplicate submit protection
- order rendering
- deep links
- role-based UI

### Backend/integration
- authentication
- authorization
- product availability
- variable-weight pricing
- cart validation
- authoritative totals
- payment callback/webhook handling
- delivery updates
- inventory mutations
- seller permissions
- subscription state transitions

---

# 36. UI → API CONTRACT DOCUMENTATION

For every major mutation, document:

```text
Screen
Action
Frontend state
Service method
HTTP method + endpoint
Request schema
Response schema
Error codes
Auth requirement
Side effects
Cache invalidation
Analytics event
```

Example:

```text
Screen: Product Details
Action: Add to cart

Frontend:
idle → submitting → success/error

Service:
cartService.addItem()

API:
POST /api/cart/items

Request:
{
  productId,
  quantity,
  unit,
  clientRequestId
}

Response:
{
  cart,
  cartCount,
  warnings
}

Errors:
PRODUCT_OUT_OF_STOCK
PRICE_CHANGED
AUTH_REQUIRED

Side effects:
cart state updated
cart badge updated
analytics event emitted
```

---

# 37. BACKEND GAP PROTOCOL

When a frontend action depends on a backend feature that does not yet exist:

1. define the TypeScript/domain contract,
2. define a repository/service interface,
3. implement a development-only mock repository if required,
4. keep the mock outside presentation components,
5. create the real API/backend task,
6. make replacing mock → API a single dependency change.

Example:

```ts
interface CartRepository {
  getCart(): Promise<Cart>
  addItem(input: AddCartItemInput): Promise<Cart>
  updateItem(input: UpdateCartItemInput): Promise<Cart>
  removeItem(itemId: string): Promise<Cart>
}
```

Implementations:

```text
MockCartRepository
ApiCartRepository
```

The UI consumes `CartRepository`, not the mock implementation directly.

---

# 38. SECURITY RULE

The browser is never authoritative for:

- product price
- discount
- delivery fee
- inventory
- final order amount
- payment result
- seller payout
- user role
- order ownership

The backend must revalidate every authoritative value.

---

# 39. PERFORMANCE RULES

Do not sacrifice product behavior for visual effects.

Avoid:
- unnecessary network requests
- repeated full-page fetches
- expensive image payloads
- duplicated state subscriptions
- animations that delay interaction

Prefer:
- incremental loading
- appropriate caching
- debounced search
- compressed/responsive imagery
- optimistic UI only for low-risk actions
- server-confirmed UI for high-risk actions

---

# 40. FINAL DEFINITION OF DONE

## Component

A component is done when:

- visual reference matched
- action works
- state transitions work
- loading/error states work
- backend/service boundary exists
- accessibility is handled
- tests cover important behavior
- no fake interaction remains

## Screen

A screen is done when:

- every visible actionable element works
- data is real or explicitly behind a typed development fixture
- navigation works
- server state is synchronized
- edge cases are handled
- keyboard/safe areas work
- accessibility works
- the UI matches the approved reference

## Feature

A feature is done when:

```text
UI
+
state
+
service
+
API
+
backend rules
+
permissions
+
error handling
+
analytics where required
+
tests
```

all represent the same behavior.

---

# 41. AGENT EXECUTION LOOP

For every screen, the agent must perform this sequence:

```text
1. Open the approved visual reference.
2. Inventory every interactive element.
3. Write the intended user journey.
4. Identify data/backend dependencies.
5. Inspect existing repository code and APIs.
6. Reuse existing domain logic where possible.
7. Create/extend the service boundary.
8. Implement loading/success/error/empty states.
9. Connect every interaction to real domain behavior.
10. Implement navigation and server-state synchronization.
11. Test with realistic data.
12. Test failure/retry/edge cases.
13. Run relevant automated tests.
14. Compare implementation against the design reference.
15. Remove any remaining fake or dead UI.
16. Only then mark the screen complete.
```

---

# 42. ABSOLUTE RULE

> **Do not confuse visual feedback with functionality.**
>
> A button that animates is not necessarily a working button.
>
> A cart badge that increments is not necessarily a working cart.
>
> A progress bar that moves is not necessarily real delivery tracking.
>
> A payment success screen is not proof of a successful payment.
>
> A completed-looking dashboard is not a real farmer dashboard.

For Agrivil, the standard is:

**visible intent → real action → real state → real service → real backend behavior → real confirmation.**
