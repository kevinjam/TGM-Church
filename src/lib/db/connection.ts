import mongoose from "mongoose";

/**
 * MongoDB connection utility.
 *
 * Reads MONGODB_URI / MONGODB_DB from the environment (server-side only —
 * never expose these to the client via NEXT_PUBLIC_*).
 *
 * The connection is cached on `globalThis` so Next.js hot-reloading in
 * development does not create a new connection per request.
 */
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || undefined;

type MongooseInstance = typeof mongoose;

interface DbCache {
  conn: MongooseInstance | null;
  promise: Promise<MongooseInstance> | null;
}

const globalForDb = globalThis as unknown as {
  __tgmDbCache?: DbCache;
};

export async function connectToDatabase(): Promise<MongooseInstance> {
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not defined. Add it to your environment (.env file). " +
        "See .env.example for reference."
    );
  }

  const cache: DbCache =
    globalForDb.__tgmDbCache ?? (globalForDb.__tgmDbCache = { conn: null, promise: null });

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: MONGODB_DB,
        serverSelectionTimeoutMS: 10000,
      })
      .then((mongooseInstance) => {
        cache.conn = mongooseInstance;
        return mongooseInstance;
      })
      .catch((error: unknown) => {
        // Allow a retry on the next request instead of a permanently failed promise.
        cache.promise = null;
        throw error;
      });
  }

  await cache.promise;

  const mongooseInstance = cache.conn;
  if (!mongooseInstance) {
    throw new Error("MongoDB connection resolved without an active instance.");
  }
  return mongooseInstance;
}

/** Convenience guard for server-only call sites. */
export function isDatabaseConfigured(): boolean {
  return Boolean(MONGODB_URI);
}
