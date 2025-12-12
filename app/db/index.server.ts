import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing from .env");
}

// Global variable to prevent multiple connections in dev hot-reload
const globalForDb = globalThis as unknown as {
  pool: pg.Pool | undefined;
};

const pool = globalForDb.pool ?? new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
}

export const db = drizzle(pool);
