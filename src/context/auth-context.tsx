"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AuthUser, RegisterInput } from "@/lib/types";
import {
  getStoredAuth,
  loginWithEmail,
  loginWithGoogle,
  logoutUser,
  registerAccount,
} from "@/services/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isReady: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  loginWithGoogle: () => Promise<AuthUser>;
  register: (input: RegisterInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  // localStorage only exists in the browser, so read the saved session after mount.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(getStoredAuth());
    setIsReady(true);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const nextUser = await loginWithEmail(email, password);
    setUser(nextUser);
    return nextUser;
  }, []);

  const googleLogin = useCallback(async () => {
    const nextUser = await loginWithGoogle();
    setUser(nextUser);
    return nextUser;
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    return registerAccount(input);
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isReady,
      isAuthenticated: Boolean(user),
      login,
      loginWithGoogle: googleLogin,
      register,
      logout,
    }),
    [user, isReady, login, googleLogin, register, logout],
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
