/**
 * Bootstrap the first admin user (idempotent).
 *
 * Usage:
 *   npm run seed:admin
 *
 * Reads ADMIN_EMAIL / ADMIN_PASSWORD from the environment. For local
 * development it falls back to loading the project's .env file so the
 * same values the app uses apply here.
 *
 * DEVELOPMENT TOOL — never point this at production with weak defaults.
 */
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";

const DEFAULT_EMAIL = "admin@tgmchurch.org";
const DEFAULT_PASSWORD = "ChangeMe123!";

/** Minimal .env loader (KEY=VALUE + comments). Fills only keys not already set. */
function loadLocalEnvFile(): void {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, "utf8");
  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

async function main(): Promise<void> {
  loadLocalEnvFile();

  // Dynamic imports so the connection/auth modules read the environment
  // after the .env file above has been loaded.
  const { connectToDatabase, UserModel } = await import("@/lib/db");
  const { hashPassword } = await import("@/lib/auth/password");

  const email = (process.env.ADMIN_EMAIL ?? DEFAULT_EMAIL).trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? DEFAULT_PASSWORD;

  const usingDefaults = !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD;
  if (usingDefaults) {
    console.warn(
      "⚠️  ADMIN_EMAIL / ADMIN_PASSWORD not set — using development defaults. " +
        "Set them before deploying to production."
    );
  }
  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters.");
  }

  await connectToDatabase();

  const existing = await UserModel.findOne({ email });
  if (existing) {
    console.log(`Admin "${email}" already exists — updating password hash.`);
  } else {
    console.log(`Creating admin "${email}"...`);
  }

  const passwordHash = await hashPassword(password);
  const user = await UserModel.findOneAndUpdate(
    { email },
    {
      $set: {
        email,
        name: process.env.ADMIN_NAME ?? "Church Administrator",
        passwordHash,
        role: "admin",
      },
    },
    { returnDocument: "after", upsert: true, runValidators: true }
  );

  console.log("✅ Admin user ready:");
  console.log(`   id:    ${user?._id?.toString() ?? "n/a"}`);
  console.log(`   email: ${email}`);
  console.log(`   role:  admin`);
  console.log("   Passwords are stored as bcrypt hashes only.");
}

main()
  .then(() => {
    process.exitCode = 0;
  })
  .catch((error: unknown) => {
    console.error("❌ Seed failed:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });
