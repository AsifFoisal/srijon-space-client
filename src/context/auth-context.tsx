"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { signIn, signOut, useSession } from "@/lib/auth-client";
import { FALLBACK_AVATAR } from "@/lib/constants";
import type { AuthUser } from "@/lib/types";

interface AuthContextValue {
  user: AuthUser | null;
  isReady: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  loginWithGoogle: (callbackURL?: string) => Promise<void>;
  logout: () => Promise<void>;
}

type SessionUser = {
  name: string;
  email: string;
  image?: string | null;
  createdAt: Date | string;
};

function toAuthUser(user: SessionUser): AuthUser {
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

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession();
  const user = useMemo(
    () => (session?.user ? toAuthUser(session.user) : null),
    [session],
  );

  const login = useCallback(async (email: string, password: string) => {
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
  }, []);

  const googleLogin = useCallback(async (callbackURL = "/") => {
    const { error } = await signIn.social({
      provider: "google",
      callbackURL,
    });

    if (error) {
      throw new Error(error.message || "Google sign-in failed.");
    }
  }, []);

  const logout = useCallback(async () => {
    const { error } = await signOut();

    if (error) {
      throw new Error(
        error.message || "We couldn't sign you out. Please try again.",
      );
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isReady: !isPending,
      isAuthenticated: Boolean(user),
      login,
      loginWithGoogle: googleLogin,
      logout,
    }),
    [user, isPending, login, googleLogin, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }
  return context;
}
