# COMPONENT SPECIFICATION

## ProductTile
Contains:
- image
- optional badge
- favorite affordance
- farmer name/avatar when useful
- product name
- price
- unit
- rating/stock when relevant
- quick add

Avoid putting every possible field into the tile.

## ProductRow
Use for search results, farmer lists and related items.
Prefer compact, scan-friendly rows.

## SectionHeader
Pattern:
Title + optional short descriptor + View all

## SearchField
Should support:
- clear
- search icon
- filter/sort affordance
- recent searches

## BottomNav
Five destinations:
Home
Categories
Farmers
Orders
Account

## QuantityControl
Accessible minus / value / plus control.
Support unit-aware values such as:
1 kg
0.5 kg
1 bunch
1 tray

## StatusBadge
Use colour sparingly.
Status text must remain understandable without colour.

## DeliveryTimeline
Use:
status → timestamp → next step
Keep the structure readable even without the map.

## FilterSheet
Group filters logically:
Category
Price range
Farmer/location
Stock
Farm type
Optional additional filters

## Modal / Bottom Sheet
Use only when the user needs a focused decision without losing context.
Do not turn routine content into modal interactions.
