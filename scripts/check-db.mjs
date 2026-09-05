#!/usr/bin/env node
/**
 * Quick MongoDB connectivity check for the CMS data layer.
 *
 * Usage:
 *   npm run db:check
 *
 * Reads the same environment variables the app uses:
 *   MONGODB_URI  (defaults to mongodb://127.0.0.1:27017)
 *   MONGODB_DB   (defaults to tgm_cms)
 */
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGODB_DB ?? "tgm_cms";

const started = Date.now();

try {
  await mongoose.connect(uri, {
    dbName,
    serverSelectionTimeoutMS: 6000,
  });

  const db = mongoose.connection.db;
  const ping = await db.admin().command({ ping: 1 });
  const collections = await db.listCollections().toArray();

  console.log(`✅ MongoDB connection OK (${Date.now() - started}ms)`);
  console.log(`   Database: "${db.databaseName}"  (ping ok: ${JSON.stringify(ping.ok === 1)})`);
  console.log(
    `   Collections: ${collections.length ? collections.map((c) => c.name).join(", ") : "(none yet — seed comes in a later stage)"}`
  );
  process.exitCode = 0;
} catch (error) {
  console.error("❌ MongoDB connection FAILED");
  console.error(`   ${error instanceof Error ? error.message : String(error)}`);
  console.error(
    "   Tip: set MONGODB_URI (and optional MONGODB_DB) in your environment, or run a local mongod on 27017."
  );
  process.exitCode = 1;
} finally {
  await mongoose.disconnect().catch(() => {});
}
