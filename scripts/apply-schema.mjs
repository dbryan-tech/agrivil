// Applies drizzle/0000_init.sql to the database via pg, safe to re-run
// (uses IF NOT EXISTS / CREATE TABLE ... guards built into the DDL).
import pg from "pg"
import { readFileSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const sql = readFileSync(join(__dirname, "../drizzle/0000_init.sql"), "utf8")

// Split on the drizzle statement-breakpoint marker
const statements = sql
  .split(/--> statement-breakpoint/)
  .map((s) => s.trim())
  .filter(Boolean)

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

let applied = 0
let skipped = 0

for (const stmt of statements) {
  try {
    await pool.query(stmt)
    applied++
  } catch (err) {
    if (
      err.message.includes("already exists") ||
      err.message.includes("duplicate")
    ) {
      skipped++
    } else {
      console.error("Error on statement:", stmt.slice(0, 80))
      console.error(err.message)
    }
  }
}

await pool.end()
console.log(`Schema applied — ${applied} statements executed, ${skipped} already existed.`)
