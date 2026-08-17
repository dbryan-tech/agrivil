# AGRIVIL MOBILE APP — DESIGN SYSTEM

## Visual principle
Agrivil should look like a premium agricultural marketplace, not a generic e-commerce template.

### Working brand palette
These are working implementation tokens derived from the supplied references and approved mockups. Treat them as the current UI token set; validate against production brand CSS when the live design system becomes available.

| Token | Hex | Intended use |
|---|---|---|
| Forest Green | #1E5D3B | Primary CTA, active states, key accents |
| Deep Brown | #2B1F17 | Main headings, dark sections, primary text |
| Warm Cream | #F4F1EA | Main app background |
| Earth Gold | #8A6B3D | Secondary agricultural accent |
| Harvest Orange | #E67A2E | Small highlights, warnings, seasonal accents |
| Soft Sage | #DDE4C5 | Tinted surfaces, subtle backgrounds |
| White | #FFFFFF | Cards/sheets where needed |
| Muted Text | #6E6A63 | Secondary copy |

## Colour rules
- Green is the primary action colour.
- Brown anchors typography and selected dark compositions.
- Orange is a restrained accent, never the default CTA.
- Cream should dominate the background.
- Do not create additional saturated accent colours without approval.
- Avoid green gradients.

## Typography
Primary recommendation:
- Headings: Quistial/Quistial-like display family if legally available; otherwise use a clean modern sans such as Manrope, Inter, or Geist.
- Body/UI: Inter or equivalent neutral sans.

Hierarchy:
- Display: 32–40
- Screen title: 24–28
- Section heading: 18–22
- Card/title: 15–17
- Body: 14–16
- Supporting/meta: 11–13

Use weight and spacing before adding colour for hierarchy.

## Shape language
- Small/medium corner radii.
- Avoid turning every element into a pill.
- Use full-width sections and rows where possible.
- Cards are reserved for products, selected content modules, and important grouped information.
- Inputs may be rounded, but not overly inflated.

## Spacing
Use a 4px base rhythm:
4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48

Use generous vertical whitespace between content sections.

## Buttons
Primary:
- solid Forest Green
- white label
- medium corner radius
- clear pressed state

Secondary:
- transparent/cream
- green or brown text
- subtle border where needed

Destructive:
- reserved for delete/cancel/refund-impacting actions
- use restrained red only where meaning requires it

## Icons
Use a single consistent icon family.
Prefer simple outline icons.
No emoji icons in the product UI.

## Photography
Food:
- natural textures
- realistic produce
- appetizing but not over-processed

Farmers:
- authentic, documentary feel
- natural environment
- avoid generic corporate stock-photo aesthetics

## Navigation
Recommended consumer bottom navigation:
Home / Categories / Farmers / Orders / Account

For checkout and detail flows, use contextual back navigation rather than forcing bottom navigation on every screen.

## Motion
Use subtle motion:
- 150–250ms for micro-interactions
- 250–400ms for page transitions
- avoid excessive spring/bouncy motion
- use motion to communicate state change, not decoration
