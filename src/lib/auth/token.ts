import { SignJWT, jwtVerify } from "jose";

/**
 * Session token helpers (JWT, HS256).
 *
 * This module is intentionally free of Next.js request/response imports so
 * it can run both in edge middleware and in Node route handlers.
 */
export const SESSION_COOKIE_NAME = "tgm_session";
const SESSION_ALG = "HS256";
export const DEFAULT_SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
}

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.trim().length < 16) {
    throw new Error(
      "AUTH_SECRET is not configured. Add a strong secret (min 16 chars) to your environment. " +
        "See .env.example — generate one with: openssl rand -base64 32"
    );
  }
  return new TextEncoder().encode(secret);
}

function sessionTtlSeconds(): number {
  const configured = Number(process.env.AUTH_SESSION_TTL);
  if (Number.isFinite(configured) && configured > 0) return configured;
  return DEFAULT_SESSION_TTL_SECONDS;
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({
    email: payload.email,
    name: payload.name,
    role: payload.role,
  })
    .setProtectedHeader({ alg: SESSION_ALG })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + sessionTtlSeconds())
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: [SESSION_ALG],
    });
    if (
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      typeof payload.role !== "string"
    ) {
      return null;
    }
    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    return null;
  }
}
