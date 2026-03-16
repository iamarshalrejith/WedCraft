export type AuthProvider = "email" | "google";
export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  provider: AuthProvider;
  role: UserRole;
  createdAt: string;
  // purchases: array of invite slugs they own
  purchases: string[];
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
}