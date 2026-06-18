CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp,
	"refreshTokenExpiresAt" timestamp,
	"scope" text,
	"password" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "addresses" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"label" text NOT NULL,
	"recipient" text NOT NULL,
	"phone" text NOT NULL,
	"ghanaPostGPS" text NOT NULL,
	"area" text NOT NULL,
	"region" text NOT NULL,
	"isDefault" boolean DEFAULT false NOT NULL,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bundles" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"image" text NOT NULL,
	"type" text NOT NULL,
	"items" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"price" real DEFAULT 0 NOT NULL,
	"frequency" text DEFAULT 'one-time' NOT NULL,
	"serves" text DEFAULT '' NOT NULL,
	"popular" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bundles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "farmers" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"farmName" text NOT NULL,
	"photo" text NOT NULL,
	"cover" text,
	"bio" text NOT NULL,
	"story" text NOT NULL,
	"methods" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"certifications" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"region" text NOT NULL,
	"town" text NOT NULL,
	"pickupGPS" text NOT NULL,
	"location" jsonb NOT NULL,
	"farmToHubRadiusKm" real DEFAULT 0 NOT NULL,
	"rating" real DEFAULT 0 NOT NULL,
	"reviewCount" integer DEFAULT 0 NOT NULL,
	"baselineRating" real DEFAULT 0 NOT NULL,
	"baselineReviewCount" integer DEFAULT 0 NOT NULL,
	"joinedYear" integer NOT NULL,
	"onTimeRate" real DEFAULT 0 NOT NULL,
	"momoProvider" text,
	"momoNumber" text,
	"ownerUserId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "farmers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "ledger_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"farmerId" text NOT NULL,
	"date" text NOT NULL,
	"orderRef" text NOT NULL,
	"grossSales" real DEFAULT 0 NOT NULL,
	"commission" real DEFAULT 0 NOT NULL,
	"sopPenalty" real DEFAULT 0 NOT NULL,
	"netPayout" real DEFAULT 0 NOT NULL,
	"payoutStatus" text DEFAULT 'scheduled' NOT NULL,
	"payoutTimestamp" text NOT NULL,
	"payoutProvider" text,
	"payoutNumber" text,
	"payoutRef" text,
	"batchId" text,
	"paidAt" text,
	"failureReason" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"forPhone" text NOT NULL,
	"userId" text,
	"kind" text NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"href" text,
	"read" boolean DEFAULT false NOT NULL,
	"dedupeKey" text,
	"channel" text DEFAULT 'in-app' NOT NULL,
	"smsStatus" text,
	"smsTo" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"reference" text NOT NULL,
	"userId" text,
	"customerName" text NOT NULL,
	"customerPhone" text NOT NULL,
	"items" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" text DEFAULT 'placed' NOT NULL,
	"placedAt" text NOT NULL,
	"payment" jsonb NOT NULL,
	"address" jsonb NOT NULL,
	"slot" jsonb NOT NULL,
	"subtotalEstimate" real DEFAULT 0 NOT NULL,
	"subtotalFinal" real,
	"deliveryFee" real DEFAULT 0 NOT NULL,
	"total" real DEFAULT 0 NOT NULL,
	"threePL" jsonb NOT NULL,
	"fault" text DEFAULT 'None' NOT NULL,
	"refunds" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"stripeSessionId" text,
	"orderRating" integer,
	"riderRating" integer,
	"tip" real DEFAULT 0 NOT NULL,
	"feedbackComment" text,
	"feedbackAt" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "payout_batches" (
	"id" text PRIMARY KEY NOT NULL,
	"runBy" text,
	"status" text DEFAULT 'completed' NOT NULL,
	"entryCount" integer DEFAULT 0 NOT NULL,
	"paidCount" integer DEFAULT 0 NOT NULL,
	"failedCount" integer DEFAULT 0 NOT NULL,
	"totalPaid" real DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"farmerId" text NOT NULL,
	"image" text NOT NULL,
	"unit" text NOT NULL,
	"variableWeight" boolean DEFAULT false NOT NULL,
	"estWeightKg" real DEFAULT 0 NOT NULL,
	"pricePerKg" real DEFAULT 0 NOT NULL,
	"priceMin" real DEFAULT 0 NOT NULL,
	"priceMax" real DEFAULT 0 NOT NULL,
	"refrigerationRequired" boolean DEFAULT false NOT NULL,
	"shelfLifeDays" integer DEFAULT 0 NOT NULL,
	"expiryDate" text NOT NULL,
	"stockKg" real DEFAULT 0 NOT NULL,
	"lowStockThreshold" real DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'in-stock' NOT NULL,
	"organic" boolean DEFAULT false NOT NULL,
	"season" text DEFAULT '' NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"reviewStatus" text DEFAULT 'live' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"image" text NOT NULL,
	"time" text DEFAULT '' NOT NULL,
	"productIds" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"authorName" text NOT NULL,
	"productId" text,
	"farmerId" text,
	"orderRef" text,
	"rating" integer NOT NULL,
	"title" text,
	"body" text DEFAULT '' NOT NULL,
	"verifiedPurchase" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'live' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"bundleId" text NOT NULL,
	"bundleName" text NOT NULL,
	"frequency" text NOT NULL,
	"price" real DEFAULT 0 NOT NULL,
	"nextDelivery" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_tickets" (
	"id" text PRIMARY KEY NOT NULL,
	"reference" text NOT NULL,
	"userId" text,
	"customerName" text NOT NULL,
	"customerPhone" text,
	"customerEmail" text,
	"orderRef" text,
	"category" text NOT NULL,
	"subject" text NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"priority" text DEFAULT 'normal' NOT NULL,
	"messages" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"assignedTo" text,
	"lastMessageAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "support_tickets_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" text DEFAULT 'customer' NOT NULL,
	"phone" text,
	"avatarColor" text,
	"loyaltyPoints" integer DEFAULT 0 NOT NULL,
	"farmerId" text,
	"farmName" text,
	"staffRole" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wishlist" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"productId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;