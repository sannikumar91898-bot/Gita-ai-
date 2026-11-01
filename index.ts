// db/index.ts (ya index.ts)
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema"; // 🔥 Schema import karein taaki relations kaam karein

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

// 🔥 Production-Ready Pool Configuration 🔥
export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    max: 10, // Ek time par max 10 connections (Render/Serverless ke liye safe)
    idleTimeoutMillis: 30000, // 30 sec tak inactive rahe toh connection band kar do
    connectionTimeoutMillis: 10000, // Agar DB 10 sec mein connect na ho toh error do
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

// 🔥 Drizzle initialize karein schema ke saath 🔥
export const db = drizzle(pool, { schema });