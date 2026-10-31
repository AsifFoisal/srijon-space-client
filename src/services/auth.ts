import { DEMO_PASSWORD, DEMO_USER, FALLBACK_AVATAR } from "@/lib/constants";
import {
  readJSON,
  removeKey,
  STORAGE_KEYS,
  writeJSON,
} from "@/lib/storage";
import type { AuthUser, RegisterInput } from "@/lib/types";

interface StoredUser extends AuthUser {
  password: string;
}

function getUsers(): StoredUser[] {
  const stored = readJSON<StoredUser[]>(STORAGE_KEYS.users, []);
  const demo: StoredUser = { ...DEMO_USER, password: DEMO_PASSWORD };
  return [
    demo,
    ...stored.filter(
      (user) => user.email.toLowerCase() !== demo.email.toLowerCase(),
    ),
  ];
}

function toAuthUser(user: StoredUser): AuthUser {
  return {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    memberSince: user.memberSince,
  };
}

export async function loginWithEmail(
  email: string,
  password: string,
): Promise<AuthUser> {
    const normalized = email.trim().toLowerCase();
  const user = getUsers().find(
    (candidate) => candidate.email.toLowerCase() === normalized,
  );

  if (!user) {
    throw new Error("We couldn't find an account with that email address.");
  }

  if (user.password !== password) {
    throw new Error("That password doesn't match our records. Please try again.");
  }

  const authUser = toAuthUser(user);
  writeJSON(STORAGE_KEYS.auth, authUser);
  return authUser;
}

export async function registerAccount(
  input: RegisterInput,
): Promise<AuthUser> {
    const email = input.email.trim().toLowerCase();
  const existing = getUsers().find(
    (user) => user.email.toLowerCase() === email,
  );

  if (existing) {
    throw new Error(
      "An account with this email already exists. Try signing in instead.",
    );
  }

  const user: StoredUser = {
    name: input.name.trim(),
    email,
    password: input.password,
    avatar: input.avatar.trim() || FALLBACK_AVATAR,
    memberSince: new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
  };

  const stored = readJSON<StoredUser[]>(STORAGE_KEYS.users, []);
  writeJSON(STORAGE_KEYS.users, [...stored, user]);
  return toAuthUser(user);
}

export async function loginWithGoogle(): Promise<AuthUser> {
    const user: AuthUser = {
    name: "Avery Stone",
    email: "avery.stone@gmail.com",
    avatar: "/images/avatars/reviewer-1.jpg",
    memberSince: "October 2026",
  };
  writeJSON(STORAGE_KEYS.auth, user);
  return user;
}

export function getStoredAuth(): AuthUser | null {
  return readJSON<AuthUser | null>(STORAGE_KEYS.auth, null);
}

export async function logoutUser() {
    removeKey(STORAGE_KEYS.auth);
}
