"use client";

import { signIn, signOut, useSession } from "@/lib/auth-client";
import { FALLBACK_AVATAR } from "@/lib/constants";
import type { AuthUser } from "@/lib/types";

function toAuthUser(user: {
  name: string;
  email: string;
  image?: string | null;
  createdAt: Date | string;
}): AuthUser {
  return {
    name: user.name,
    email: user.email,
    avatar: user.image || FALLBACK_AVATAR,
    memberSince: new Date(user.createdAt).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
  };
}

export function useAuth() {
  const { data: session, isPending } = useSession();

  const user = session?.user ? toAuthUser(session.user) : null;

  async function login(email: string, password: string) {
    const { data, error } = await signIn.email({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      throw new Error(
        error.message || "We couldn't sign you in. Please try again.",
      );
    }

    if (!data?.user) {
      throw new Error("We couldn't sign you in. Please try again.");
    }

    return toAuthUser(data.user);
  }

  async function loginWithGoogle(callbackURL = "/") {
    const { error } = await signIn.social({
      provider: "google",
      callbackURL,
    });

    if (error) {
      throw new Error(error.message || "Google sign-in failed.");
    }
  }

  async function logout() {
    const { error } = await signOut();

    if (error) {
      throw new Error(
        error.message || "We couldn't sign you out. Please try again.",
      );
    }
  }

  return {
    user,
    isReady: !isPending,
    login,
    loginWithGoogle,
    logout,
  };
}
