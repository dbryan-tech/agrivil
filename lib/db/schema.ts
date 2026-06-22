import {
  pgTable,
  text,
  boolean,
  integer,
  real,
  timestamp,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core"

// ---------------------------------------------------------------------------
// Better Auth tables (camelCase column names match Better Auth defaults)
// ---------------------------------------------------------------------------

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  // Golden Acres additional fields
  role: text("role").notNull().default("customer"),
  phone: text("phone"),
  avatarColor: text("avatarColor"),
  loyaltyPoints: integer("loyaltyPoints").notNull().default(0),
  farmerId: text("farmerId"),
  farmName: text("farmName"),
  staffRole: text("staffRole"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// ---------------------------------------------------------------------------
// Golden Acres domain tables
// ---------------------------------------------------------------------------

export const farmers = pgTable("farmers", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  farmName: text("farmName").notNull(),
  photo: text("photo").notNull(),
  cover: text("cover"),
  bio: text("bio").notNull(),
  story: text("story").notNull(),
  methods: jsonb("methods").notNull().default([]),
  certifications: jsonb("certifications").notNull().default([]),
  region: text("region").notNull(),
  town: text("town").notNull(),
  pickupGPS: text("pickupGPS").notNull(),
  location: jsonb("location").notNull(),
  farmToHubRadiusKm: real("farmToHubRadiusKm").notNull().default(0),
  rating: real("rating").notNull().default(0),
  reviewCount: integer("reviewCount").notNull().default(0),
  // Seeded reputation captured at onboarding. The live `rating`/`reviewCount`
  // above blend these baselines with reviews collected on the platform so new
  // verified reviews never wipe a farmer's established standing.
  baselineRating: real("baselineRating").notNull().default(0),
  baselineReviewCount: integer("baselineReviewCount").notNull().default(0),
  joinedYear: integer("joinedYear").notNull(),
  onTimeRate: real("onTimeRate").notNull().default(0),
  momoProvider: text("momoProvider"), // 'MTN' | 'Vodafone' | 'AirtelTigo'
  momoNumber: text("momoNumber"), // MoMo payout destination
  ownerUserId: text("ownerUserId"),
  // ---- KYC / seller verification (admin-gated onboarding) ----
  // 'verified' = approved & listable, 'pending' = awaiting admin review,
  // 'rejected' = declined. Seeded farmers default to 'verified'.
  kycStatus: text("kycStatus").notNull().default("verified"),
  kycSubmittedAt: text("kycSubmittedAt"),
  kycReviewedAt: text("kycReviewedAt"),
  kycNotes: text("kycNotes"),
  // Applicant contact captured on the public "Sell on AgriVil" form.
  applicantEmail: text("applicantEmail"),
  applicantPhone: text("applicantPhone"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  farmerId: text("farmerId").notNull(),
  image: text("image").notNull(),
  unit: text("unit").notNull(),
  variableWeight: boolean("variableWeight").notNull().default(false),
  estWeightKg: real("estWeightKg").notNull().default(0),
  pricePerKg: real("pricePerKg").notNull().default(0),
  priceMin: real("priceMin").notNull().default(0),
  priceMax: real("priceMax").notNull().default(0),
  refrigerationRequired: boolean("refrigerationRequired").notNull().default(false),
  shelfLifeDays: integer("shelfLifeDays").notNull().default(0),
  expiryDate: text("expiryDate").notNull(),
  stockKg: real("stockKg").notNull().default(0),
  lowStockThreshold: real("lowStockThreshold").notNull().default(0),
  status: text("status").notNull().default("in-stock"),
  organic: boolean("organic").notNull().default(false),
  season: text("season").notNull().default(""),
  tags: jsonb("tags").notNull().default([]),
  description: text("description").notNull().default(""),
  reviewStatus: text("reviewStatus").notNull().default("live"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const bundles = pgTable("bundles", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  image: text("image").notNull(),
  type: text("type").notNull(),
  items: jsonb("items").notNull().default([]),
  price: real("price").notNull().default(0),
  frequency: text("frequency").notNull().default("one-time"),
  serves: text("serves").notNull().default(""),
  popular: boolean("popular").notNull().default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const recipes = pgTable("recipes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image").notNull(),
  time: text("time").notNull().default(""),
  productIds: jsonb("productIds").notNull().default([]),
  // ---- Enriched recipe content (additive; defaults keep old rows valid) ----
  description: text("description").notNull().default(""),
  category: text("category").notNull().default("Stews & soups"),
  serves: text("serves").notNull().default(""),
  difficulty: text("difficulty").notNull().default("Easy"),
  // ingredients: [{ productId, qty, note? }]
  ingredients: jsonb("ingredients").notNull().default([]),
  // steps: ordered string[] cooking method
  steps: jsonb("steps").notNull().default([]),
  tip: text("tip").notNull().default(""),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  userId: text("userId"),
  customerName: text("customerName").notNull(),
  customerPhone: text("customerPhone").notNull(),
  items: jsonb("items").notNull().default([]),
  status: text("status").notNull().default("placed"),
  placedAt: text("placedAt").notNull(),
  payment: jsonb("payment").notNull(),
  address: jsonb("address").notNull(),
  slot: jsonb("slot").notNull(),
  subtotalEstimate: real("subtotalEstimate").notNull().default(0),
  subtotalFinal: real("subtotalFinal"),
  deliveryFee: real("deliveryFee").notNull().default(0),
  total: real("total").notNull().default(0),
  threePL: jsonb("threePL").notNull(),
  fault: text("fault").notNull().default("None"),
  refunds: jsonb("refunds").notNull().default([]),
  stripeSessionId: text("stripeSessionId"),
  // Post-delivery feedback (Step 2). Null until the customer rates the order.
  orderRating: integer("orderRating"),
  riderRating: integer("riderRating"),
  tip: real("tip").notNull().default(0),
  feedbackComment: text("feedbackComment"),
  feedbackAt: text("feedbackAt"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const addresses = pgTable("addresses", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  label: text("label").notNull(),
  recipient: text("recipient").notNull(),
  phone: text("phone").notNull(),
  ghanaPostGPS: text("ghanaPostGPS").notNull(),
  area: text("area").notNull(),
  region: text("region").notNull(),
  isDefault: boolean("isDefault").notNull().default(false),
  notes: text("notes"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  bundleId: text("bundleId").notNull(),
  bundleName: text("bundleName").notNull(),
  frequency: text("frequency").notNull(),
  price: real("price").notNull().default(0),
  nextDelivery: text("nextDelivery").notNull(),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const wishlist = pgTable("wishlist", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  productId: text("productId").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  forPhone: text("forPhone").notNull(),
  userId: text("userId"),
  kind: text("kind").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  href: text("href"),
  read: boolean("read").notNull().default(false),
  // Idempotency: a stable key (e.g. "GA-123:out-for-delivery") so the same
  // event fanned out more than once never creates duplicate notifications.
  dedupeKey: text("dedupeKey"),
  // Delivery channel + simulated SMS dispatch outcome.
  channel: text("channel").notNull().default("in-app"),
  smsStatus: text("smsStatus"),
  smsTo: text("smsTo"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
}, (table) => ({
  // Full unique index on dedupeKey so createNotification can use a bare
  // ON CONFLICT ("dedupeKey") DO NOTHING for idempotency. Postgres treats
  // multiple NULLs as distinct, so ad-hoc notifications (no dedupeKey) never
  // collide. NOTE: a *partial* index can't serve a bare ON CONFLICT arbiter,
  // so this must remain a full unique index.
  dedupeKeyUnique: uniqueIndex("notifications_dedupeKey_unique").on(
    table.dedupeKey,
  ),
}))

export const supportTickets = pgTable("support_tickets", {
  id: text("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  userId: text("userId"),
  customerName: text("customerName").notNull(),
  customerPhone: text("customerPhone"),
  customerEmail: text("customerEmail"),
  orderRef: text("orderRef"),
  category: text("category").notNull(),
  subject: text("subject").notNull(),
  status: text("status").notNull().default("open"),
  priority: text("priority").notNull().default("normal"),
  // Message bodies are stored AES-256-GCM encrypted at rest (see lib/golden-acres/crypto.ts).
  messages: jsonb("messages").notNull().default([]),
  // Staff member (user id or display name) the ticket is assigned to, if any.
  assignedTo: text("assignedTo"),
  // Timestamp of the most recent message, used to sort the live queue.
  lastMessageAt: timestamp("lastMessageAt"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  authorName: text("authorName").notNull(),
  productId: text("productId"),
  farmerId: text("farmerId"),
  orderRef: text("orderRef"),
  rating: integer("rating").notNull(),
  title: text("title"),
  body: text("body").notNull().default(""),
  verifiedPurchase: boolean("verifiedPurchase").notNull().default(false),
  status: text("status").notNull().default("live"),
  // Public reply from the farmer/seller to a review (additive — null until set).
  farmerReply: text("farmerReply"),
  farmerReplyAt: text("farmerReplyAt"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const ledgerEntries = pgTable("ledger_entries", {
  id: text("id").primaryKey(),
  farmerId: text("farmerId").notNull(),
  date: text("date").notNull(),
  orderRef: text("orderRef").notNull(),
  grossSales: real("grossSales").notNull().default(0),
  commission: real("commission").notNull().default(0),
  sopPenalty: real("sopPenalty").notNull().default(0),
  netPayout: real("netPayout").notNull().default(0),
  payoutStatus: text("payoutStatus").notNull().default("scheduled"),
  payoutTimestamp: text("payoutTimestamp").notNull(),
  // ---- MoMo settlement metadata (Step 3) ----
  payoutProvider: text("payoutProvider"), // 'MTN' | 'Vodafone' | 'AirtelTigo'
  payoutNumber: text("payoutNumber"), // masked MoMo number the payout was sent to
  payoutRef: text("payoutRef"), // simulated provider transaction id
  batchId: text("batchId"), // settlement run that paid this entry
  paidAt: text("paidAt"), // ISO timestamp the payout settled
  failureReason: text("failureReason"), // populated when payoutStatus = 'failed'
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// A settlement run. Each "Run payouts" click in Ops creates one batch that
// settles all due (scheduled) ledger entries through the simulated MoMo seam.
export const payoutBatches = pgTable("payout_batches", {
  id: text("id").primaryKey(),
  runBy: text("runBy"), // staff/user id that triggered the run
  status: text("status").notNull().default("completed"), // 'completed' | 'partial'
  entryCount: integer("entryCount").notNull().default(0),
  paidCount: integer("paidCount").notNull().default(0),
  failedCount: integer("failedCount").notNull().default(0),
  totalPaid: real("totalPaid").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// Marketing promotions / discount codes managed from the Admin console and
// redeemed at checkout. Discount is either a percentage of the order subtotal
// or a flat cedi amount, optionally gated by a minimum spend and a usage cap.
export const promotions = pgTable(
  "promotions",
  {
    id: text("id").primaryKey(),
    // Stored uppercased; the checkout normalises user input before matching.
    code: text("code").notNull(),
    description: text("description").notNull().default(""),
    // 'percent' => value is 0-100; 'flat' => value is a cedi amount.
    kind: text("kind").notNull().default("percent"),
    value: real("value").notNull().default(0),
    // Minimum order subtotal (GH₵) required for the code to apply.
    minSubtotal: real("minSubtotal").notNull().default(0),
    // Optional ceiling on the discount granted by a percentage code (GH₵).
    maxDiscount: real("maxDiscount"),
    // Optional total redemption cap; null = unlimited. usedCount tracks usage.
    usageLimit: integer("usageLimit"),
    usedCount: integer("usedCount").notNull().default(0),
    active: boolean("active").notNull().default(true),
    // Optional ISO expiry date (yyyy-mm-dd); null = never expires.
    expiresAt: text("expiresAt"),
    createdBy: text("createdBy"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (t) => ({
    codeUnique: uniqueIndex("promotions_code_unique").on(t.code),
  }),
)

// Site-wide announcement banners shown across the storefront, managed from the
// Admin console. The most recent active banner is rendered at the top of the
// storefront (customers can dismiss it for their session).
export const announcements = pgTable("announcements", {
  id: text("id").primaryKey(),
  message: text("message").notNull(),
  // Optional call-to-action rendered as a link at the end of the banner.
  ctaLabel: text("ctaLabel"),
  ctaHref: text("ctaHref"),
  // Visual tone: 'info' | 'promo' | 'warning'.
  tone: text("tone").notNull().default("info"),
  active: boolean("active").notNull().default(true),
  createdBy: text("createdBy"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})
