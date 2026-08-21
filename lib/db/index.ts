import { drizzle } from "drizzle-orm/node-postgres"
import { Pool, type PoolConfig } from "pg"
import * as schema from "./schema"

const rawConnectionString = process.env.DATABASE_URL
const isLocal =
  !rawConnectionString ||
  rawConnectionString.includes("localhost") ||
  rawConnectionString.includes("127.0.0.1")

// Strip sslmode from the URL so pg doesn't override rejectUnauthorized
const connectionString = rawConnectionString
  ? rawConnectionString.replace(/[?&]sslmode=[^&]+/, "")
  : undefined

const poolConfig: PoolConfig = {
  connectionString,
  ssl: isLocal ? false : { rejectUnauthorized: false },
  max: process.env.NODE_ENV === "production" ? 10 : 5,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
}

const globalForDb = globalThis as unknown as { pool?: Pool }

export const pool = globalForDb.pool ?? new Pool(poolConfig)

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool
}

pool.on("error", (err) => {
  console.error("Unexpected Postgres pool error:", err.message)
})

export const db = drizzle(pool, { schema })
