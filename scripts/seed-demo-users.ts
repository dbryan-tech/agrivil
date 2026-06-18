import { Pool } from "pg"
import { betterAuth } from "better-auth"
import { eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/node-postgres"
import { pgTable, text, integer, boolean, timestamp } from "drizzle-orm/pg-core"

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error("DATABASE_URL is required")
  process.exit(1)
}

const pool = new Pool({ connectionString })

const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET || "seed-only-placeholder-secret-not-used-for-sessions",
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer", input: true },
      phone: { type: "string", required: false, input: true },
      avatarColor: { type: "string", required: false, input: true },
      loyaltyPoints: { type: "number", required: false, defaultValue: 0, input: true },
      farmerId: { type: "string", required: false, input: true },
      farmName: { type: "string", required: false, input: true },
      staffRole: { type: "string", required: false, input: true },
    },
  },
})

const userTable = pgTable("user", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  role: text("role"),
  phone: text("phone"),
  avatarColor: text("avatarColor"),
  loyaltyPoints: integer("loyaltyPoints"),
  farmerId: text("farmerId"),
  farmName: text("farmName"),
  staffRole: text("staffRole"),
  emailVerified: boolean("emailVerified"),
  name: text("name"),
  image: text("image"),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
})
const farmersTable = pgTable("farmers", {
  id: text("id").primaryKey(),
  ownerUserId: text("ownerUserId"),
})
const db = drizzle(pool, { schema: { user: userTable, farmers: farmersTable } })

async function ensure(
  email: string,
  password: string,
  name: string,
  extra: Record<string, unknown>,
) {
  const existing = await db.select().from(userTable).where(eq(userTable.email, email)).limit(1)
  if (existing.length) {
    await db.update(userTable).set(extra).where(eq(userTable.email, email))
    console.log(`  exists: ${email}`)
    return existing[0].id
  }
  await auth.api.signUpEmail({ body: { email, password, name } })
  const created = await db.select().from(userTable).where(eq(userTable.email, email)).limit(1)
  if (created.length) {
    await db.update(userTable).set(extra).where(eq(userTable.email, email))
    console.log(`  created: ${email}`)
    return created[0].id
  }
  console.log(`  FAILED: ${email}`)
  return null
}

async function main() {
  console.log("Seeding demo users...")
  await ensure("nana@example.com", "freshfood123", "Nana Adwoa", {
    role: "customer",
    phone: "024 555 0101",
    avatarColor: "var(--ga-field)",
    loyaltyPoints: 340,
  })
  await ensure("ama@goldenacres.gh", "goldenacres123", "Ama Boateng", {
    role: "staff",
    phone: "024 555 0202",
    avatarColor: "var(--ga-gold)",
    staffRole: "operations",
  })
  const farmerPhone = "024 551 1137"
  const farmerEmail = `farmer+${farmerPhone.replace(/\D/g, "")}@phone.agrivil.gh`
  const farmerId = "f1"
  await ensure(farmerEmail, "agrivil-pin-1234", "Kwame Mensah", {
    role: "farmer",
    phone: farmerPhone,
    avatarColor: "var(--ga-leaf)",
    farmerId,
    farmName: "Mensah Family Farm",
  })
  const fu = await db.select().from(userTable).where(eq(userTable.email, farmerEmail)).limit(1)
  if (fu.length) {
    await db.update(farmersTable).set({ ownerUserId: fu[0].id }).where(eq(farmersTable.id, farmerId))
    console.log(`  linked farmer f1 -> ${fu[0].id}`)
  }
  console.log("Done.")
  await pool.end()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
