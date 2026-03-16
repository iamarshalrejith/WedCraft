import { cookies } from "next/headers";
import { SessionUser } from "@/types/user";

const SESSION_COOKIE = "wedcraft_session";

// Simple in-memory user store
// Replace with MongoDB / Supabase / PlanetScale in production
export interface StoredUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  provider: "email" | "google";
  role: "user" | "admin";
  passwordHash?: string; // only for email auth
  createdAt: string;
  purchases: string[];
}

// In-memory store (resets on server restart — swap with DB for production)
export const userStore = new Map<string, StoredUser>();

// Seed a default admin for development
userStore.set("admin@wedcraft.in", {
  id: "admin-001",
  email: "admin@wedcraft.in",
  name: "WedCraft Admin",
  provider: "email",
  role: "admin",
  passwordHash: hashPassword("admin123"), // change this!
  createdAt: new Date().toISOString(),
  purchases: [],
});


// Very simple password hashing (use bcrypt in production)
export function hashPassword(password: string): string {
  // Simple base64 encode — REPLACE WITH bcrypt in production
  return Buffer.from(password + process.env.AUTH_SECRET || "wedcraft_secret").toString("base64");
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Session: encode/decode as base64 JSON in a cookie
// In production use jose / jsonwebtoken for proper JWT

export function encodeSession(user: SessionUser): string {
  const payload = {
    ...user,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

export function decodeSession(token: string): SessionUser | null {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64url").toString("utf-8"));
    if (payload.exp < Date.now()) return null; // expired
    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      avatarUrl: payload.avatarUrl,
      role: payload.role,
    };
  } catch {
    return null;
  }
}


// Read current session from cookies (server-side)
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return decodeSession(token);
}

export { SESSION_COOKIE };