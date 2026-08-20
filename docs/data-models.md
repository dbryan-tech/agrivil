# AgriVil Data Models & Domain Schemas

> **Location**: Defined in [`lib/golden-acres/types.ts`](file:///c:/Users/HP/Desktop/agrivil/lib/golden-acres/types.ts) and populated in [`lib/golden-acres/data.ts`](file:///c:/Users/HP/Desktop/agrivil/lib/golden-acres/data.ts).

---

## 1. Product Schema (`Product`)

```typescript
export interface Product {
  id: string                    // Unique ID, e.g. 'p1', 'p19', 'p20'
  name: string                  // e.g. 'Roma Tomatoes', 'Volta Perfumed Rice (5kg)'
  slug: string                  // URL-friendly slug, e.g. 'roma-tomatoes'
  category: string              // 'Vegetables' | 'Roots & Tubers' | 'Fruits' | 'Grains & Legumes' | 'Herbs & Spices'
  priceMin: number              // Minimum price in GHS
  priceMax: number              // Maximum price in GHS
  unit: string                  // e.g. '1 kg basket', '5kg bag', '1L bottle'
  pricePerKg?: number           // Normalized per-kg price
  farmerId: string              // Reference to Farmer.id
  farmerName: string            // Farmer display name
  rating: number                // Rating (e.g. 4.9)
  reviewCount: number           // Review count
  image: string                 // Produce image asset path
  organic: boolean              // 100% organic certification flag
  refrigerationRequired: boolean// Cold-chain van requirement flag
  variableWeight: boolean       // True if priced by weight post-picking
  harvestDate?: string          // e.g. '2026-08-19'
  shelfLifeDays?: number        // FEFO shelf life in days
  expiryDate?: string           // Calculated FEFO expiry date
  description: string           // Product summary
}
```

---

## 2. Farmer Schema (`Farmer`)

```typescript
export interface Farmer {
  id: string                    // e.g. 'f1', 'f2'
  name: string                  // e.g. 'Auntie Ama Serwaa'
  farmName: string              // e.g. "Auntie Ama's Organic Plots"
  slug: string                  // e.g. 'auntie-ama'
  region: string                // e.g. 'Ashanti', 'Eastern', 'Volta'
  town: string                  // e.g. 'Ejisu', 'Aburi'
  distanceKm: number            // Distance to KNUST/Accra distribution hub
  photo: string                 // Farmer portrait image path
  rating: number                // Overall grower rating
  reviewCount: number           // Total verified reviews
  joinedYear: number            // Year joined collective
  bio: string                   // Farmer background & farming techniques
  certifications: string[]      // e.g. ['GhanaGAP', 'Organic Certified']
}
```

---

## 3. Recipe Schema (`Recipe`)

```typescript
export interface Recipe {
  id: string                    // e.g. 'r1', 'r2'
  name: string                  // e.g. 'Classic Ghana Jollof Rice'
  category: string              // e.g. 'Traditional Ghanaian', 'Stews & Soups'
  time: string                  // e.g. '45 mins'
  serves: string                // e.g. 'Serves 4–6'
  difficulty: string            // 'Easy' | 'Medium' | 'Advanced'
  image: string                 // Recipe dish image
  description: string           // Authentic cultural background
  productIds: string[]          // Mapped store product IDs (e.g. ['p19', 'p1', 'p13', 'p2', 'p18'])
  instructions: string[]        // Step-by-step cooking instructions
}
```

---

## 4. Bundle Schema (`Bundle`)

```typescript
export interface Bundle {
  id: string                    // e.g. 'b1', 'b2'
  name: string                  // e.g. 'Weekly Family Veg Box'
  description: string           // Box contents summary
  price: number                 // Total bundle price in GHS
  frequency: string              // e.g. 'Weekly Delivery', 'Bi-Weekly'
  image: string                 // Box showcase image
  items: {
    productId: string
    qty: number
  }[]
}
```
