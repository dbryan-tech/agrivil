# AGRIVIL — END-TO-END UI & FUNCTIONAL ENGINEERING GUIDE

## Purpose

This guide is a standalone engineering contract for the Agrivil AI build agent.

> **Every visible UI element that looks actionable must actually work end-to-end.**

A screen is not complete because it looks correct. It is complete when the user can perform the intended task and the frontend, application state, API/service layer, database and external integrations behave correctly.

## 1. No fake interactions

Do not ship placeholder behavior such as `console.log`, decorative toggles, fake counters, hard-coded balances, fake success states, or local-only cart behavior where a backend-backed feature is required. Temporary mocks are allowed only behind an explicit service/repository boundary and must be easy to replace.

## 2. End-to-end contract

Every important action should follow:

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

## 3. Inspect the existing repository first

Reuse existing routes, components, contexts, utilities, types, APIs and domain logic. Do not create parallel auth, cart, catalog or order state just because a screen needs it.

## 4. Service boundaries

Maintain explicit domain services such as:

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

UI components should call domain services/hooks, not scatter raw business logic and fetch calls across screens.

## 5. State model

Remote features must distinguish:

```text
idle / loading / success / empty / error / retrying / refreshing / stale
```

Mutations should expose submitting/success/failure where relevant.

## 6. Authentication

### Sign up

Frontend validates, submits through auth service, prevents duplicate submission, handles verification and errors, persists/restores session, and navigates only after successful authentication.

Backend validates again, hashes credentials securely, creates the user/session, rate-limits auth endpoints and returns safe session/user data only.

### Login

Frontend validates, submits, handles incorrect credentials/network failure and restores session. Backend authenticates and issues the session/token.

## 7. Onboarding

### Welcome

`Get started` begins onboarding. `Sign in` opens login.

### Location

`Use my location` must request native permission and handle granted, denied, permanently denied and unavailable states. Manual entry follows the GhanaPostGPS path.

### GhanaPostGPS

Validate, persist draft data, resolve locality where supported, allow correction, and return clear validation errors.

### Delivery area

Backend decides pilot-zone eligibility. Unsupported users see the not-yet-available state and waitlist/interest capture where implemented.

## 8. Shop / Home

Search must manage query state, debounce where appropriate, show suggestions and results, and handle empty/error/loading states.

Category controls must navigate/filter real data.

Quick add must validate auth, current stock and pricing, call `cartService`, update authoritative cart state and handle conflicts. Never fake the cart badge with a local counter only.

## 9. Product details

Every action must be real:

- add to cart
- quantity changes
- save/unsave
- open farmer
- related products
- availability changes

Out-of-stock and price-change states must be explicitly handled.

## 10. Variable-weight products

For products such as yam/meat, distinguish:

```text
estimated/requested quantity
        ↓
estimated price/range
        ↓
cart line
        ↓
actual measured weight
        ↓
final reconciled price
```

Backend remains authoritative for final weight and price.

## 11. Cart

Cart mutations must be synchronized with the authoritative cart source:

- increase
- decrease
- remove
- address update
- delivery-fee refresh
- checkout

Server response determines final totals. Handle stock and price changes explicitly.

## 12. Checkout

Use the sequence:

```text
Address → Delivery date → Time slot → Payment → Review → Place order → Confirmation
```

Preserve valid form state when navigating backwards.

### Address

Load saved addresses, create/edit, validate GhanaPostGPS and verify delivery eligibility.

### Delivery

Load available time slots, disable unavailable slots, display delivery fee and estimated arrival.

### Payment

Support the required Mobile Money and Visa/Mastercard paths through backend payment sessions/intents. Handle pending, success, failure and cancellation.

Backend must recalculate totals, validate amount/currency, verify provider callbacks/webhooks where supported, and protect against duplicate processing.

## 13. Place order / duplicate protection

Treat checkout submission as high risk. Disable repeated taps, use an idempotency/request key, let backend detect duplicates, and return one authoritative order result.

## 14. Orders and tracking

Normalize order states such as:

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

Order lists/details must use backend data. Tracking must show real status/timestamps/estimates/tracking references. Do not animate fake progress.

## 15. Delivery / 3PL

Use:

```text
3PL → backend integration → normalized Agrivil delivery state → mobile API → UI
```

Do not put 3PL credentials in the client. The mobile app consumes normalized Agrivil states.

## 16. Proof of delivery

Retrieve proof through authorized backend references and expose only safe assets/details.

## 17. Farmers

Farmer discovery and profiles must use real records. Farmer products should link to the real product entities. Save/follow operations must persist and support rollback when optimistic UI is used.

## 18. Recipes

`Shop ingredients` must map recipe ingredients to current catalog products, add valid items to the cart and explain unavailable items. Do not assume ingredient-name equality is sufficient for product matching.

## 19. Bundles and subscriptions

Bundles must validate current contents, inventory and price. Subscription actions such as start, pause, resume, skip and cancel must be backend-confirmed. Do not show a subscription as changed until confirmation is received.

## 20. Account

Profile, addresses, payments, notifications and settings must use persistent state where intended. Notification entries should deep-link to their target entity. Do not store raw card details in the app unless explicitly required by the approved payment architecture.

## 21. Seller / farmer portal

Seller onboarding must collect the required identity, farm, location and verification information. Dashboard metrics, products, inventory, orders and earnings must use real backend data.

Inventory states:

```text
available
low_stock
out_of_stock
reserved
```

Seller earnings/ledger must use server-authoritative calculations.

## 22. File/image uploads

Validate type/size, show preview and progress, support retry/cancel, and use secure signed upload or controlled upload endpoints. Store asset references rather than huge base64 payloads.

## 23. Roles and authorization

Typical roles may include customer, farmer, admin and support. Client-side guards are UX only. The backend must authorize every protected mutation and resource.

## 24. Deep links

Important entities should have direct routes such as:

```text
/m/product/[slug]
/m/farmers/[id]
/m/recipes/[id]
/m/orders/[id]
/m/bundles/[id]
```

Direct-entry routes must handle loading, not-found, deleted/unavailable and unauthorized states.

## 25. Caching / server state

Cache read-heavy data such as products/categories/farmers/recipes appropriately, but treat it as potentially stale. Invalidate or update related cache entries after mutations. Never treat cached payment/order/inventory-sensitive values as authoritative.

## 26. Network resilience

Preserve safe form input, expose retry, communicate stale data where useful, avoid duplicate mutations and make critical operations idempotent.

## 27. Accessibility

Every actionable element needs an accessible name, meaningful role, adequate hit target, readable contrast and state that is not communicated by color alone.

## 28. Analytics

Track meaningful business events where analytics is part of the product, e.g. onboarding_started, search_submitted, product_viewed, product_added_to_cart, checkout_started, payment_succeeded/failed, order_created/delivered, farmer_viewed, recipe_viewed, bundle_added and subscription actions. Analytics must never block the primary action.

## 29. Component acceptance standard

Buttons need default/pressed/disabled/loading and relevant success/error states. Fields need empty/focused/filled/error/disabled/valid states. Products need loading/available/low-stock/out-of-stock/price-changed/unavailable/error. Remote lists need loading/success/empty/error/refreshing and load-more where applicable.

## 30. Testing standard

### Consumer critical path

```text
launch → onboarding → location → GhanaPostGPS → auth → browse → search → product → quantity → cart → checkout → address → slot → payment → confirmation → order → tracking → delivery → proof of delivery
```

### Seller critical path

```text
seller onboarding → verification → dashboard → add product → inventory → order → fulfillment → earnings
```

These flows must be executable against real services or clearly isolated development fixtures.

## 31. UI ↔ API contract

Document each major mutation with:

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

## 32. Backend-gap protocol

When a backend capability does not exist yet:

1. define the domain contract,
2. define the repository/service interface,
3. add a development-only mock implementation if necessary,
4. keep mocks out of presentation components,
5. create the real backend task,
6. make the switch from mock → API a single dependency change.

Example:

```ts
interface CartRepository {
  getCart(): Promise<Cart>
  addItem(input: AddCartItemInput): Promise<Cart>
  updateItem(input: UpdateCartItemInput): Promise<Cart>
  removeItem(itemId: string): Promise<Cart>
}
```

## 33. Security

Never trust the browser for price, discount, delivery fee, inventory, final order amount, payment result, seller payout, user role or order ownership. Backend must revalidate authoritative values.

## 34. Performance

Avoid unnecessary network requests, duplicated state subscriptions, oversized image payloads and motion that blocks interaction. Prefer incremental loading, caching, debounced search and responsive imagery.

## 35. Definition of done

### Component

- visual reference matched
- action works
- state transitions work
- loading/error states work
- service/backend boundary exists
- accessibility handled
- important tests exist
- no fake interaction remains

### Screen

- every visible actionable element works
- data is real or explicitly behind a typed development fixture
- navigation works
- server state stays synchronized
- edge cases are handled
- keyboard/safe areas work
- accessibility works
- implementation matches approved reference

### Feature

```text
UI + state + service + API + backend rules + permissions + error handling + analytics where required + tests
```

all represent the same behavior.

## 36. Mandatory agent execution loop

For every screen:

```text
1. Open the approved visual reference.
2. Inventory every interactive element.
3. Define the user journey.
4. Identify data/backend dependencies.
5. Inspect existing repository code and APIs.
6. Reuse existing logic where possible.
7. Create/extend the service boundary.
8. Implement loading/success/error/empty states.
9. Connect every interaction to real domain behavior.
10. Implement navigation and server-state synchronization.
11. Test realistic data.
12. Test failure/retry/edge cases.
13. Run relevant automated tests.
14. Compare the implementation to the reference design.
15. Remove fake/dead UI.
16. Only then mark the screen complete.
```

## Final rule

**Visible intent → real action → real state → real service → real backend behavior → real confirmation.**

Do not confuse visual feedback with functionality.
