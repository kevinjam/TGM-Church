import { hash, compare } from "bcryptjs";

/**
 * Password hashing (bcrypt). Passwords are never stored or logged in
 * plain text — only the bcrypt hash is persisted in the users collection.
 */
const SALT_ROUNDS = 10;

export function hashPassword(plainPassword: string): Promise<string> {
  return hash(plainPassword, SALT_ROUNDS);
}

export function verifyPassword(
  plainPassword: string,
  passwordHash: string
): Promise<boolean> {
  return compare(plainPassword, passwordHash);
}
