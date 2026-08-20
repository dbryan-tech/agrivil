# AgriVil Agent Workspace Instructions

See root [`AGENTS.md`](file:///c:/Users/HP/Desktop/agrivil/AGENTS.md) and [`docs/`](file:///c:/Users/HP/Desktop/agrivil/docs) for full details.

## Quick Agent Guidelines
1. **Design System**: Use `#0B3B25` (Forest Green), `#7A3F1C` (Clay Rust), `#FAF9F6` (Canvas), `#211A12` (Charcoal).
2. **Spacing**: Standardize mobile margins to `px-1.5` (~10% of standard padding) and `gap-1.5`. Halve top section vertical spacings.
3. **Cards**: Avoid wrapping raw text in cards. Canvas-first approach. Only use cards for product items, farm ingredient bundles, and farmer profiles.
4. **Icons**: STRICT NO EMOJIS. Always use Lucide icons.
5. **Mobile**: Android `onBackPressed()` is bridged to `goBack()`. Safe area insets on all sticky bars. Zero scrollbars globally.
6. **Build**: Verify changes with `npm run build` (`BypassSandbox: true`).
