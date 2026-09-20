import "server-only";
import bcrypt from "bcryptjs";

// bcryptjs is pure JavaScript, so it installs on any Node.js host without
// native compilation (unlike argon2 / bcrypt). Cost 12 ≈ 250 ms per hash.
const COST = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, COST);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

let dummyHash: Promise<string> | undefined;

/**
 * Compare against a throw-away hash when the account does not exist, so
 * response time does not reveal which emails are registered.
 */
export async function verifyAgainstDummy(password: string): Promise<void> {
  dummyHash ??= bcrypt.hash("not-a-real-password", COST);
  await bcrypt.compare(password, await dummyHash);
}

/** Policy for admin passwords set via the seed or CLI script. */
export function validatePasswordStrength(password: string): string | null {
  if (password.length < 12) return "Use at least 12 characters.";
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    return "Include upper-case letters, lower-case letters and a number.";
  }
  return null;
}
