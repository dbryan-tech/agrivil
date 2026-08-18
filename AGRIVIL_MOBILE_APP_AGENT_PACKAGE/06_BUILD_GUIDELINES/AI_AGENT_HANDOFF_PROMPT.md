# AGRIVIL MOBILE APP — MASTER AI AGENT HANDOFF

## Mission
Build Agrivil as a production-quality mobile marketplace. The UI must look deliberately designed, not generated from a generic AI component template.

## Source-of-truth hierarchy
1. Current Agrivil code/data in the private GitHub repository.
2. Existing Agrivil website/brand direction.
3. Editable Figma master reference: https://www.figma.com/design/nyNeNpl6sFUGWacwMPyXGi
4. `09_SKILLS/agrivil-interface-craft/SKILL.md` — mandatory anti-slop quality gate.
5. Existing project requirements and architecture documents.

If sources disagree, preserve the most recent explicit product decision and do not invent a new visual language.

## Mandatory screen workflow
Before implementing each screen: inspect its Figma frame; inspect relevant code/data/assets; identify the primary task; map hierarchy and content density; implement with reusable primitives; render at a real mobile viewport; compare visually; correct spacing, typography, alignment, density and states.

## Design direction
Premium, modern, warm and agricultural without looking rustic or decorative. Warm cream canvas, deep forest green, earthy brown and restrained harvest orange. Photography is important. Typography and alignment carry most hierarchy.

## Typography
Primary UI family: Manrope. Editorial accent: Instrument Serif, rare and intentional. Do not default to Inter or generic system typography without a documented reason.

## Surface rules
No liquid glass at this stage. Do not wrap every section in a visible card. Prefer whitespace, alignment, typography, imagery and dividers. Shadows are rare and functional. Avoid gradients unless explicitly required later. No emoji as UI icons. No decorative blobs or generic AI illustrations.

## Geometry
390×844 reference viewport, implemented responsively. 4px base rhythm with contextual spacing. Keep horizontal content edges aligned. Avoid exaggerated top/bottom gaps.

## Product architecture
ONBOARDING: Welcome, Location, GhanaPostGPS, Sign Up, Login
SHOP: Home, Search, Categories, Products, Farmers, Nearby / Shop Local
PRODUCT: Product Details, Quantity, Farmer, Related Products
CART: Cart, Delivery, Address, Payment, Confirmation
ORDERS: Orders, Tracking, Delivery, Proof of Delivery
DISCOVER: Recipes, Bundles, Subscriptions
FARMERS: Farmer Discovery, Farmer Profile, Farmer Products
ACCOUNT: Profile, Saved, Addresses, Payments, Notifications, Settings
SELL: Farmer Onboarding, Dashboard, Products, Inventory, Orders, Earnings

## State completeness
Implement loading, empty, error, unavailable, low-stock, selected, disabled, validation and confirmation states where relevant. Do not stop at the happy path.

## Quality gate
A screen is not done until hierarchy is obvious, real content fits naturally, tap targets are usable, type is readable, spacing has rhythm, cards are justified, no anti-slop red flags remain, safe areas/keyboard work, reduced motion is respected, and the implementation visually matches its Figma reference.

## Do not lower the bar
If a framework default looks generic, customize or replace it. If exact reproduction is impossible, preserve design intent and document the tradeoff rather than silently reverting to a generic pattern.
