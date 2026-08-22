# AGRIVIL — MASTER AUTONOMOUS RELEASE-CANDIDATE ENGINEERING INSTRUCTIONS

**Status:** Mandatory operating contract for any autonomous AI coding/build agent working on Agrivil.

**Mode:** Release-candidate / live-use verification mode. Treat the product as if real users will receive it today. This is NOT a prototyping task.

---

## 0. EXECUTIVE DIRECTIVE

You are authorized to operate autonomously on the Agrivil codebase without continuous user intervention.

You have permission to inspect, refactor, redesign, repair, test, verify, document, optimize, and implement the product across frontend, backend, routing, data, state, integrations, assets, mobile behavior, and build/release configuration as required to make the product behave like a coherent release candidate.

Assume:

> **If this application were handed to real users today, every visible page, route, button, form, action, state, data path, integration boundary, and navigation transition must behave correctly.**

Do not optimize for how quickly you can claim completion. Optimize for correctness, consistency, performance, maintainability, and verifiability.

You have as much time and reasoning budget as needed. Thoroughness is explicitly preferred over speed.

Do not stop because a task is large.

Do not skip verification because a page appears visually correct.

Do not leave known defects merely because they are outside the current screen.

---

# 1. OPERATING PRINCIPLES

## 1.1 Autonomous authority

You may:
- inspect the entire repository
- inspect every route and page
- inspect every component
- inspect shared hooks and state
- inspect database schemas and migrations
- inspect API routes and server actions
- inspect auth/session logic
- inspect middleware
- inspect image and static assets
- inspect Capacitor/native mobile code
- inspect CI/CD configuration
- inspect build scripts
- refactor overcomplicated code
- simplify duplicated logic
- remove dead code
- fix clear design defects
- repair broken routing
- improve performance
- add missing tests
- add missing error/loading/empty states
- improve accessibility
- add missing engineering safeguards
- update documentation

Do not require the user to manually enumerate defects that you can discover through disciplined inspection.

## 1.2 When to act vs. when to report

### Fix autonomously when:
- the defect is clearly demonstrated
- it violates the established design/engineering contract
- the correct behavior is supported by existing documentation or architecture
- the change has low ambiguity
- the fix is reversible and testable

### Report before making a product-policy decision when:
- there are multiple materially different product interpretations
- a missing feature requires a business decision rather than engineering judgment
- payment, legal, pricing, commission, refund, access-control, or compliance behavior is ambiguous and cannot be inferred safely
- a new external vendor/integration would create material cost or contractual implications
- the requested behavior conflicts with an explicit product requirement

For these cases, create a concise **DECISION REQUIRED** report describing:
1. the discovered gap,
2. why it matters,
3. the recommended default,
4. alternatives,
5. affected screens/services,
6. implementation impact.

Do not silently invent business policy.

## 1.3 If you are unsure

Never hide uncertainty behind implementation.

Use the following rule:

> **Uncertainty that affects product behavior must be surfaced. Uncertainty that only affects implementation detail may be resolved using the simplest maintainable solution.**

If you are uncertain about a visual detail but the design system clearly establishes a pattern, follow the established pattern.

If you are uncertain about business logic, report it.

---

# 2. SOURCE-OF-TRUTH HIERARCHY

Before changing anything, understand which source governs each decision.

Priority order:

1. Current repository behavior and authoritative data contracts.
2. Explicit requirements in repository documentation.
3. Current Agrivil master design/brand references and approved UI standards.
4. Existing architecture and integration contracts.
5. Established implementation patterns within the repository.
6. General platform conventions and industry best practice.
7. Personal implementation preference.

Never use personal preference to override an explicit product requirement.

The existing repository already defines a clean-route/middleware model, mobile internal routes, farmer/admin/API namespaces, brand assets, mobile design standards, state management, caching, Capacitor behavior, and build requirements. Treat those instructions as architectural constraints unless you discover a concrete defect that requires revision. The current AGENTS.md is the baseline engineering manual. citeturn22file0

---

# 3. FIRST TASK: FULL REPOSITORY AUDIT

Before substantial implementation, perform a repository-wide audit.

Do not start by modifying the first broken screen you encounter.

## 3.1 Inventory the repository

Inspect:
- root configuration
- package manager files
- Next.js configuration
- TypeScript configuration
- middleware
- route tree
- app pages
- components
- shared UI
- server actions
- API routes
- auth/session code
- database schema
- migrations
- seed/data files
- image/static assets
- service worker
- native mobile code
- Capacitor configuration
- build scripts
- GitHub Actions
- environment variables/examples
- documentation
- design system
- brand assets
- test files

Create or maintain an inventory file at:

`docs/audits/REPOSITORY_INVENTORY.md`

The inventory must identify:
- route/page
- owner/component
- data dependencies
- server dependencies
- auth requirements
- major actions
- test coverage
- known issues
- status

## 3.2 Read the documentation

Read all relevant project documents before making architecture-level changes.

At minimum inspect:
- `AGENTS.md`
- `README.md`
- `docs/**`
- mobile-agent package documents
- design-system documents
- engineering guides
- brand system documents
- screen inventory/specifications
- API/integration documentation
- database documentation
- deployment/build documentation

Do not assume a documentation file is irrelevant because its filename looks old. Verify its actual contents and status.

If two documents conflict, identify the conflict explicitly and follow the documented source-of-truth hierarchy.

---

# 4. FULL PAGE / ROUTE AUDIT

Every route matters.

Inspect all public and internal application routes, including but not limited to:

```text
/
/shop
/farmers
/bundles
/recipes
/cart
/checkout
/orders

/m/**
/farmer/**
/admin/**
/api/**
```

The current architecture intentionally keeps clean URLs in the browser while middleware maps mobile experiences to `/m/**`; direct `/m` and `/w` usage has explicit device-dependent behavior. Preserve and verify that behavior rather than creating alternate routing systems. citeturn22file0

For every page verify:
- direct navigation works
- refresh works
- back navigation works
- forward navigation works
- internal links resolve
- dynamic params resolve
- invalid params produce appropriate 404/error behavior
- auth guards work
- role guards work
- mobile rendering works
- desktop/tablet rendering works where supported
- deep links work
- loading states work
- error states work
- empty states work
- unavailable states work
- browser history is correct
- Android back behavior is correct
- safe areas work
- keyboard behavior works

---

# 5. PAGE COMPLETENESS AUDIT

Treat every page as a functional system, not as a screenshot.

For every page produce an action inventory.

Example:

```text
Page: Product Details

Interactive elements:
- Back
- Favorite
- Gallery
- Quantity minus
- Quantity plus
- Unit selector
- Add to cart
- View farmer
- Related product
- Share

Remote dependencies:
- product
- farmer
- inventory
- pricing
- recommendations

States:
- loading
- loaded
- out of stock
- low stock
- price changed
- network error
- unavailable
```

Every listed action must be tested.

---

# 6. EVERY UI ACTION MUST BE REAL

The following are not acceptable in release-candidate mode:

```ts
onClick={() => console.log('coming soon')}
```

```ts
onClick={() => setOpen(true)}
```

where the resulting interaction has no real functional purpose.

No fake CTA buttons.

No fake navigation.

No decorative controls pretending to be actionable.

No local-only state for features that are intended to persist across devices/users.

No mock catalog arrays hidden inside production screens where a real data source exists.

Every action must map to:

```text
UI event
→ domain action
→ service/repository
→ API/server action
→ validation/authorization
→ persistence/external provider
→ normalized response
→ state/cache update
→ visible confirmation/error
```

---

# 7. FRONTEND FUNCTIONALITY STANDARD

Frontend code must be:
- modular
- predictable
- testable
- typed
- state-aware
- accessible
- resilient to slow networks
- resistant to duplicate submission
- independent of raw API details wherever possible

Use intent-based services such as:

```text
authService
catalogService
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

Do not scatter raw `fetch()` or business rules throughout presentational components.

---

# 8. STATE MANAGEMENT STANDARD

Every asynchronous feature needs explicit states.

At minimum:

```text
idle
loading
success
empty
error
retrying
refreshing
```

Use domain state where necessary:

```text
pending_payment
paid
preparing
picked_up
out_for_delivery
delivered
cancelled
refunded
issue_reported
```

Avoid dozens of loosely coordinated booleans such as:

```ts
isLoading
isSaving
isPending
hasError
showSuccess
isDisabled
isSubmitting
```

when a single explicit state machine would be clearer.

---

# 9. BACKEND / DATA INTEGRITY

The backend is authoritative for:
- price
- stock
- discounts
- delivery fee
- order totals
- user role
- payment status
- order ownership
- seller permissions
- payout data
- refund calculations

Never trust client-supplied authoritative values.

Recalculate server-side.

Validate server-side.

Authorize server-side.

---

# 10. AUTHENTICATION & AUTHORIZATION

Verify the complete lifecycle:

```text
register
→ verification
→ login
→ session restoration
→ protected navigation
→ refresh
→ logout
→ session expiry
→ unauthorized recovery
```

Test:
- invalid credentials
- missing fields
- duplicate account
- expired session
- malformed token/session
- unauthorized resource
- cross-user access
- role escalation attempts

Client-side route guards are not sufficient.

Server-side authorization is mandatory.

---

# 11. CART / CHECKOUT / PAYMENT

These are critical financial workflows and require extra verification.

## Cart
Verify:
- add
- remove
- increase
- decrease
- variable weight
- low stock
- out of stock
- price changes
- stale item detection
- delivery fee recalculation
- persistence
- refresh recovery

## Checkout
Verify:
- address
- GhanaPostGPS validation
- service-zone eligibility
- delivery slot availability
- delivery fee
- payment method
- totals
- duplicate submission protection
- order creation
- confirmation

The product requirements specifically call for GhanaPostGPS, local MoMo alongside card payments, delivery slots, variable-weight pricing, and 3PL order handoff. fileciteturn19file1L27-L75

## Payment
Never assume:

```text
button clicked = payment succeeded
```

Use provider confirmation/webhooks/status verification as required.

Implement idempotency for payment and order creation.

A repeated click must not create duplicate orders or duplicate charges.

---

# 12. DELIVERY / LOGISTICS

The project requirements treat logistics as a core platform capability.

Verify the full chain:

```text
paid order
→ dispatch payload
→ GhanaPostGPS
→ weight
→ refrigeration requirement
→ 3PL API
→ tracking number
→ ETA
→ status updates
→ proof of delivery
```

The project specifically requires automated order handoff, tracking-number webhooks, status synchronization and geo-tagged proof-of-delivery capture. fileciteturn19file1L27-L42

Do not build a fake tracking timeline disconnected from the backend.

---

# 13. LOCATION / MARKETPLACE MATCH

Verify:
- permission state
- location denied
- manual GhanaPostGPS
- valid/invalid code
- pilot zone
- outside pilot zone
- waitlist behavior
- nearest-farmer logic
- shop-local filtering
- delivery fee calculation

The requirements specify matching customers to nearby participating farmers using GhanaPostGPS/GPS proximity and product availability, with pilot-zone geofencing and dynamically calculated delivery fees. fileciteturn19file3L125-L153

Do not hard-code a location assumption into the UI.

---

# 14. PRODUCT / INVENTORY

Verify:
- normal quantity
- variable-weight products
- price range
- final measured weight
- stock changes
- low-stock state
- out-of-stock state
- stale product data
- inventory race conditions

The requirements explicitly include variable-weight pricing, live farmer inventory synchronization, low-stock alerts and FEFO logic. fileciteturn19file1L43-L52

Frontend should clearly distinguish estimated values from final measured values.

---

# 15. FARMER PORTAL

Verify the complete farmer workflow:

```text
onboarding
→ verification
→ dashboard
→ product upload
→ image upload
→ pricing
→ weight rules
→ inventory
→ incoming orders
→ fulfillment/update
→ earnings
→ ledger
→ payout status
```

The portal must remain usable on basic smartphones and low-bandwidth connections. Product uploading, low-bandwidth image handling and transparent payout/ledger information are explicit requirements. fileciteturn19file3L104-L116

Do not clone the consumer UI for farmers if doing so increases complexity or reduces usability.

---

# 16. RECIPES / BUNDLES / SUBSCRIPTIONS

Verify:
- recipe pages
- ingredient mapping
- shop ingredients
- unavailable ingredient handling
- bundle availability
- bundle pricing
- subscription creation
- recurring state
- pause
- resume
- skip
- cancellation
- payment failure

The requirements explicitly call for bundles/subscriptions and recommendations linking cart products to Ghanaian recipes. fileciteturn19file1L53-L75

---

# 17. CUSTOMER SERVICE / REFUNDS

Verify customer issue flows.

Examples:
- missing item
- spoiled item
- incorrect item
- delivery issue
- payment issue
- refund request

The backend/service layer must maintain traceability for the responsible party when required.

The existing requirements include instant refund/credit tooling for spoiled or missing items. fileciteturn19file3L101-L103

Do not expose dangerous admin operations to normal customers.

---

# 18. DESIGN CONSISTENCY AUDIT

Use the Agrivil design system as a living consistency contract.

The current engineering manual establishes:
- deep forest green
- sun ochre/orange
- clay rust
- harvest gold
- warm canvas
- deep soil charcoal
- muted earth charcoal
- restrained cards
- no emoji UI
- safe-area awareness
- compact mobile layout
- mobile-first behavior
- brand assets

These are already documented in `AGENTS.md`. fileciteturn22file0

Inspect every page for visual drift.

If a screen clearly violates the established design language and the correction is obvious:

> **Fix it.**

Do not preserve a known design defect merely because it was implemented earlier.

Examples of defects to correct:
- excessive visible card wrappers
- unrelated radius systems
- random colors
- incorrect typography hierarchy
- excessive spacing
- misaligned content edges
- inconsistent bottom navigation
- inconsistent button heights
- generic placeholder icons
- emoji
- poor contrast
- nonstandard shadows
- incorrect safe-area behavior
- desktop UI squeezed into mobile

---

# 19. BRAND ASSET INTEGRITY

Use the approved Concept 01 Agrivil identity assets as source-of-truth.

Do not casually redraw the brand mark.

Do not replace the approved sun + cultivated-field mark with:
- generic leaves
- barns
- tractors
- wheat
- generic trees
- random geometric symbols

If an asset is missing, first search the existing brand-asset directory before creating a new variation.

---

# 20. PERFORMANCE MANDATE

The application must feel fast.

Do not accept:
- unnecessary client-side work
- repeated data fetching
- duplicate subscriptions/listeners
- heavy re-renders
- giant bundles
- unoptimized images
- blocking fonts
- excessive JS on initial render
- repeated layout calculations
- expensive effects
- unnecessary polling
- memory leaks
- abandoned async work

The existing engineering guidance already specifies image optimization, SWR-style catalog caching, service-worker caching, and native WebView tuning. Verify these mechanisms actually work instead of merely existing as configuration. fileciteturn22file0

---

# 21. PERFORMANCE INVESTIGATION METHOD

When a screen feels slow:

1. reproduce the delay
2. identify the exact bottleneck
3. measure before changing architecture
4. remove unnecessary work
5. retest
6. compare memory/render behavior
7. document meaningful improvement

Do not solve a 50ms problem with a new framework.

Do not add caching everywhere without understanding invalidation.

Do not add abstraction merely to appear architectural.

---

# 22. SIMPLIFY OVERENGINEERED CODE

You are explicitly authorized to refactor code that is harder than necessary.

Look for:
- duplicated service wrappers
- unnecessary abstraction layers
- giant components
- repeated conditional logic
- dead props
- unused context providers
- redundant state
- duplicated API calls
- unnecessary global state
- repeated mapping code
- excessive generic types that reduce clarity
- CSS complexity with no visual value
- multiple components doing the same job

If a simpler implementation provides the same behavior, prefer the simpler implementation.

### Refactoring rule

Do not simplify by deleting functionality.

Simplify by removing unnecessary machinery while preserving behavior and contracts.

Every substantial refactor must be followed by tests.

---

# 23. DO NOT CREATE PREMATURE ABSTRACTIONS

Avoid:

```text
UniversalEverythingProvider
MegaConfig
GenericUniversalCard
AbstractDataThing
```

unless there is a demonstrated reuse case.

Prefer small, understandable units.

---

# 24. NETWORK RESILIENCE

Test:
- slow 3G-like network
- offline
- intermittent connection
- API timeout
- server error
- retry
- duplicate retry
- stale data
- interrupted navigation

User-entered information should not disappear unnecessarily.

Critical mutations must use idempotency or equivalent duplicate protection.

---

# 25. ACCESSIBILITY

Verify:
- semantic headings
- labels
- accessible names
- keyboard focus where applicable
- sufficient contrast
- touch targets
- screen-reader behavior
- reduced motion
- readable text scaling
- no color-only state communication

No emoji-only controls.

---

# 26. MOBILE / CAPACITOR VERIFICATION

Verify:
- Android hardware back
- safe areas
- status bar overlap
- keyboard resize
- modal dismissal
- drawer behavior
- orientation behavior where relevant
- touch interactions
- deep links into WebView
- cold start
- warm start
- app resume
- cache behavior

The existing project explicitly delegates Android back behavior and uses `MobileBackListener` for active drawers/modals before route navigation; preserve and test this behavior. fileciteturn22file0

---

# 27. ROUTING / MIDDLEWARE VERIFICATION

Test combinations of:

```text
mobile + clean URL
mobile + direct /m URL
desktop + clean URL
desktop + direct /m URL
desktop + /w URL
farmer route
admin route
API route
unauthenticated
authenticated customer
authenticated farmer
authenticated admin
```

Verify redirect/rewrite loops do not occur.

Verify canonical URLs remain correct.

Verify browser history remains coherent.

---

# 28. ERROR BOUNDARIES

Every major app region should fail gracefully.

If one recommendation widget fails, the entire home page should not crash.

If the product API fails, show a useful product error.

If a noncritical image fails, preserve layout.

If a payment service fails, do not mark the order paid.

---

# 29. OBSERVABILITY

Make failures diagnosable.

Errors should include enough context to determine:
- feature
- action
- request ID/correlation where available
- server/client
- retryability

Do not leak secrets or payment credentials.

---

# 30. TEST STRATEGY

Do not rely on one successful `npm run build`.

Use layers:

### Static checks
- TypeScript
- lint
- formatting
- dependency checks
- dead-code detection where available

### Unit tests
- formatters
- validators
- pricing calculations
- delivery calculations
- reducers/state transitions
- mapping functions

### Integration tests
- API/service boundaries
- auth
- catalog
- cart
- checkout
- order lifecycle
- seller flows

### End-to-end tests
- critical customer journey
- critical farmer journey
- authentication
- payment flow test environment
- order tracking
- navigation

### Manual exploratory testing
Actually use the application as a user.

---

# 31. RELEASE-CANDIDATE TEST MATRIX

Create a matrix containing at least:

| Area | Happy | Empty | Error | Slow | Unauthorized | Edge |
|---|---:|---:|---:|---:|---:|---:|
| Onboarding | ✓ | ✓ | ✓ | ✓ | — | ✓ |
| Search | ✓ | ✓ | ✓ | ✓ | — | ✓ |
| Product | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Cart | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Checkout | ✓ | — | ✓ | ✓ | ✓ | ✓ |
| Payment | ✓ | — | ✓ | ✓ | ✓ | ✓ |
| Orders | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Farmers | ✓ | ✓ | ✓ | ✓ | — | ✓ |
| Recipes | ✓ | ✓ | ✓ | ✓ | — | ✓ |
| Bundles | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Subscriptions | ✓ | — | ✓ | ✓ | ✓ | ✓ |
| Account | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Seller | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

Expand this table as new modules are discovered.

---

# 32. REALISTIC TEST DATA

Test with:
- short names
- long names
- long product names
- missing images
- duplicate products
- very high prices
- decimal quantities
- variable-weight products
- zero stock
- many cart items
- long addresses
- unusual GhanaPostGPS strings
- multiple saved addresses
- multiple orders
- long farmer stories
- long recipe instructions

Do not validate UI only against ideal placeholder text.

---

# 33. DESIGN REVIEW AGAINST THE REFERENCES

For every major page:

1. open the approved visual reference
2. render the real implementation at the intended mobile size
3. compare
4. identify deviations
5. determine whether deviations are intentional
6. fix unintended deviations
7. repeat

Pay particular attention to:
- hierarchy
- font scale
- spacing
- content density
- color balance
- image crop
- interaction placement
- navigation
- visible card count
- CTA emphasis

---

# 34. DESIGN DEFECT POLICY

If you find a page that has clearly drifted from the system:

### If objectively wrong:
Fix it.

### If debatable but likely beneficial:
Record it as a recommendation and continue unless it blocks correctness.

### If genuinely uncertain:
Create a decision report.

Never silently create a third visual language.

---

# 35. INDUSTRY-GAP DISCOVERY

You are expected to identify important missing functionality.

During inspection ask:

- Is there a missing empty state?
- Is there a missing recovery path?
- Is there a missing cancellation path?
- Is there missing validation?
- Is a user's data at risk of being lost?
- Is an important interaction inaccessible?
- Is there an expected e-commerce capability missing?
- Is a security boundary missing?
- Is a payment failure path missing?
- Is a delivery exception path missing?
- Is there no support/report-issue path?
- Is there no session-expiry handling?
- Is there no retry strategy?
- Is there no out-of-stock behavior?
- Is there no price-change behavior?
- Is there no duplicate-submission protection?
- Is there no seller rejection/onboarding recovery?

If the missing feature is clearly standard and required for functional integrity, you may implement it.

If it changes business policy, report it first.

---

# 36. FEATURE PROPOSAL PROCESS

When a missing feature is discovered, create:

`docs/audits/FEATURE_GAPS.md`

For each feature:

```text
Feature:
Why it matters:
Where it is missing:
Risk if absent:
Recommended behavior:
Screens affected:
Frontend work:
Backend work:
Data work:
Testing:
Decision required: yes/no
```

Do not bury feature proposals inside unrelated commit messages.

---

# 37. CODE QUALITY GATES

A pull request/change set is not ready when:
- TypeScript is broken
- tests are failing
- routes are broken
- lint is severely degraded
- warnings reveal a likely production problem
- console errors remain on critical flows
- duplicate requests are occurring
- loading indicators never resolve
- errors crash the app
- inaccessible controls remain
- fake actions remain
- dead code is introduced
- secrets are exposed

---

# 38. BUILD & RELEASE VERIFICATION

Before finalizing:

1. install dependencies cleanly if appropriate
2. validate environment configuration
3. run type checks
4. run lint
5. run unit tests
6. run integration tests
7. run end-to-end tests
8. run production build
9. inspect route generation/build output
10. test critical flows in production-like mode
11. verify mobile build path
12. verify CI workflow expectations

The existing project manual explicitly requires `npm run build` and clean compilation across its route set; retain that requirement and expand verification rather than treating it as the only quality gate. fileciteturn22file0

---

# 39. BUNDLE / BUILD HYGIENE

Before declaring the app fast:

- inspect client bundle size
- inspect route-level JS
- inspect image payload sizes
- inspect duplicate dependencies
- inspect repeated data requests
- inspect cache hit behavior
- inspect hydration problems
- inspect long tasks
- inspect unnecessary client components

Do not optimize blindly.

Measure, change, measure again.

---

# 40. PERFORMANCE ACCEPTANCE STANDARD

A page should:
- render meaningful content quickly
- avoid blocking on noncritical requests
- feel instant for cached navigation
- avoid visibly stalling after user actions
- remain smooth during scrolling
- avoid layout jumps
- avoid excessive loaders
- keep interaction feedback immediate

Use background refresh where safe.

Use skeletons only where they communicate real pending content.

---

# 41. CACHING / INVALIDATION

Caching without correct invalidation is a correctness bug.

For each cached resource define:
- source
- TTL
- stale policy
- invalidation trigger
- optimistic behavior
- mutation behavior

Test stale-data scenarios explicitly.

---

# 42. SECURITY REVIEW

Audit:
- auth bypass
- IDOR / cross-user resource access
- role escalation
- exposed secrets
- insecure API parameters
- client-trusted totals
- payment callback validation
- file upload validation
- open redirects
- unsafe HTML rendering
- XSS risks
- sensitive data in logs
- insecure local storage

Fix clear issues immediately.

Report anything requiring a product/security policy decision.

---

# 43. DATABASE / MIGRATION SAFETY

When changing data models:
- inspect current schema
- inspect migrations
- understand existing production/dev assumptions
- preserve backwards compatibility when possible
- add safe migration paths
- never silently drop user data
- test existing seeded/data access behavior

Do not casually rewrite the schema because a cleaner theoretical model exists.

---

# 44. EXTERNAL SERVICES

For every external service verify:
- credentials configuration
- timeout
- retry behavior
- webhook verification
- error normalization
- idempotency
- monitoring/logging
- test environment behavior
- fallback/degraded behavior

Never put secret credentials in client bundles.

---

# 45. DOCUMENTATION MAINTENANCE

When changing architecture or behavior, update the relevant documentation.

At minimum keep current:
- `AGENTS.md`
- architecture docs
- API docs
- screen inventory
- feature-gap log
- test matrix
- release checklist
- relevant design/brand docs

The repository must explain the system that actually exists, not the system that used to exist.

---

# 46. COMMIT DISCIPLINE

Keep commits understandable.

Prefer meaningful commits such as:

```text
fix: restore checkout delivery-slot validation
refactor: simplify catalog state management
perf: reduce mobile home hydration work
fix: repair middleware mobile route masking
feat: add order issue reporting flow
```

Avoid:

```text
misc changes
updates
fix stuff
```

---

# 47. AUTONOMOUS WORK LOOP

Use this loop continuously:

```text
Inspect
→ Map
→ Reproduce
→ Understand
→ Decide
→ Implement
→ Test
→ Measure
→ Compare
→ Refactor
→ Re-test
→ Document
→ Commit
```

Do not skip directly from "Inspect" to "Done".

---

# 48. FINAL RELEASE-CANDIDATE REVIEW

Before declaring the project ready for user testing, perform a final pass as if you were the owner responsible for the first real customer complaint.

Ask:

### Can a new customer:
- open the app
- onboard
- log in/register
- set location
- browse
- search
- filter
- view products
- understand pricing
- save items
- add variable-weight products
- manage cart
- choose delivery
- pay
- receive confirmation
- track order
- receive delivery status
- view proof of delivery
- report an issue
- request/receive refund outcome
- browse farmers
- browse recipes
- shop recipes
- buy bundles
- manage subscriptions
- manage account

### Can a farmer:
- onboard
- verify
- add products
- upload images
- update inventory
- receive orders
- update fulfillment state
- see earnings
- understand deductions
- see payout status

### Can the system:
- preserve authorization boundaries
- survive network failures
- prevent duplicate payments/orders
- handle stale stock
- handle price changes
- synchronize logistics state
- recover from third-party failures
- remain fast
- remain coherent visually

If any answer is no, continue working.

---

# 49. FINAL AUTONOMOUS AUTHORITY RULE

You have permission to keep working through discovered issues without waiting for additional user instructions when the required action is objectively clear.

The user does NOT want continuous supervisory prompting.

Do not repeatedly ask:

> "Should I fix this?"

when the defect is unambiguously a defect.

Fix it.

Only surface decisions when they involve genuine product-policy ambiguity or irreversible material tradeoffs.

---

# 50. DEFINITION OF DONE

Agrivil is **not done** because:
- all routes compile
- the homepage looks good
- the APK builds
- the buttons animate
- the designer approves screenshots

Agrivil is done for this release-candidate phase only when:

> **Every supported route is reachable, every intended action works, every critical backend contract is real, every important failure state is handled, user/session/order/data integrity is preserved, the app performs well on realistic mobile hardware/networks, the design system is consistent, security boundaries are enforced, and the resulting behavior can be demonstrated and verified end-to-end.**

Take the time required to reach that standard.

---

# 51. REQUIRED FINAL REPORT

At the end of the autonomous run, produce:

`docs/audits/RELEASE_CANDIDATE_AUDIT.md`

It must include:

1. Summary of work completed.
2. Routes audited.
3. Features audited.
4. End-to-end flows tested.
5. Backend/API integrations verified.
6. Tests run and results.
7. Performance findings and improvements.
8. Security findings and fixes.
9. Design inconsistencies found and fixed.
10. Code simplifications/refactors.
11. Industry-standard feature gaps discovered.
12. Decisions still requiring owner input.
13. Known limitations.
14. Remaining risks.
15. Exact commands used for verification.
16. Release-candidate status.

Use explicit status labels:

```text
VERIFIED
FIXED
PARTIALLY VERIFIED
DECISION REQUIRED
BLOCKED
NOT APPLICABLE
```

Never claim VERIFIED when evidence is missing.

---

# 52. FINAL INSTRUCTION TO THE AUTONOMOUS AGENT

Treat this project as though the next user is a real customer, the next order is a real order, the next payment is real, the next farmer is real, and the next delivery issue is real.

Build accordingly.

**Do not optimize for demo success. Optimize for release-candidate trust.**
