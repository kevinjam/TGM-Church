/**
 * Server-only entry point for the CMS data layer.
 *
 *   import { connectToDatabase, EventModel, type EventDoc } from "@/lib/db";
 *
 * NEVER import this from a client component — it depends on server
 * environment variables and the MongoDB driver.
 */
export * from "./constants";
export { connectToDatabase, isDatabaseConfigured } from "./connection";
export * from "./models";
