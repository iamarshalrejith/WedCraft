import { cookies } from "next/headers";
import { SessionUser } from "@/types/user";
import { getDb } from "@/lib/mongodb";

const SESSION_COOKIE = "wedcraft_session";

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  provider: "email" | "google";
  role: "user" | "admin";
  passwordHash?: string;
  createdAt: string;
  purchases: string[];
}

export function hashPassword(password: string): string {
  return Buffer.from(password + (process.env.AUTH_SECRET || "wedcraft_secret")).toString("base64");
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const db = await getDb();
  const user = await db.collection<StoredUser>("users").findOne({ email }, { projection: { _id: 0 } });
  return user || null;
}

export async function findUserById(id: string): Promise<StoredUser | null> {
  const db = await getDb();
  const user = await db.collection<StoredUser>("users").findOne({ id }, { projection: { _id: 0 } });
  return user || null;
}

export async function createUser(user: StoredUser): Promise<void> {
  const db = await getDb();
  await db.collection("users").insertOne(user);
}

export async function updateUser(id: string, update: Partial<StoredUser>): Promise<void> {
  const db = await getDb();
  await db.collection("users").updateOne({ id }, { $set: update });
}

export async function ensureAdminExists(): Promise<void> {
  const existing = await findUserByEmail("admin@wedcraft.in");
  if (!existing) {
    await createUser({
      id: "admin-001",
      email: "admin@wedcraft.in",
      name: "WedCraft Admin",
      provider: "email",
      role: "admin",
      passwordHash: hashPassword("admin123"),
      createdAt: new Date().toISOString(),
      purchases: [],
    });
  }
}

export function encodeSession(user: SessionUser): string {
  const payload = { ...user, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 };
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

export function decodeSession(token: string): SessionUser | null {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64url").toString("utf-8"));
    if (payload.exp < Date.now()) return null;
    return { id: payload.id, email: payload.email, name: payload.name, avatarUrl: payload.avatarUrl, role: payload.role };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return decodeSession(token);
}

export { SESSION_COOKIE };