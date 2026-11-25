import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;
const COST = 1 << 15; // 32 MiB scrypt cost; production login is rate-limited.
const BLOCK_SIZE = 8;
const PARALLELIZATION = 1;

function derive(password: string, salt: Buffer, cost = COST): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, { N: cost, r: BLOCK_SIZE, p: PARALLELIZATION, maxmem: 64 * 1024 * 1024 }, (error, key) => {
      if (error) reject(error); else resolve(key as Buffer);
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await derive(password, salt);
  return `scrypt$${COST}$${BLOCK_SIZE}$${PARALLELIZATION}$${salt.toString("base64url")}$${derived.toString("base64url")}`;
}

export async function verifyPassword(password: string, encoded: string): Promise<boolean> {
  try {
    const parts = encoded.split("$");
    if (parts.length !== 6 || parts[0] !== "scrypt") return false;
    const cost = Number(parts[1]); const r = Number(parts[2]); const p = Number(parts[3]);
    // Refuse unsupported/extreme stored parameters; never let a corrupted hash trigger unbounded work.
    if (cost < (1 << 14) || cost > (1 << 16) || r !== BLOCK_SIZE || p !== PARALLELIZATION) return false;
    const salt = Buffer.from(parts[4], "base64url"); const expected = Buffer.from(parts[5], "base64url");
    if (salt.length < 16 || expected.length !== KEY_LENGTH) return false;
    const actual = await derive(password, salt, cost);
    return timingSafeEqual(actual, expected);
  } catch { return false; }
}
