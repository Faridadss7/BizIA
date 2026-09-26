"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useUser as useClerkUser, useClerk } from "@clerk/nextjs";
import * as authService from "@/services/auth";
import type { LoginPayload, SignupPayload, User } from "@/types/auth";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signup: (payload: SignupPayload) => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGoogleAccount: (profile: { email: string; name?: string }) => Promise<void>;
  loginWithClerk: () => void;
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (email: string, newPassword: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn: isClerkSignedIn } = useClerkUser();
  const clerk = useClerk();

  // 1. Initial local session restore
  useEffect(() => {
    authService
      .restoreSession()
      .then((session) => {
        if (session?.user) {
          setUser(session.user);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  // 2. Synchronize Clerk user when signed in with Clerk
  useEffect(() => {
    if (isClerkLoaded && isClerkSignedIn && clerkUser) {
      const email = clerkUser.primaryEmailAddress?.emailAddress;
      if (email) {
        const name = clerkUser.fullName || `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || undefined;
        authService
          .loginWithGoogleAccount({ email, name })
          .then((session) => setUser(session.user))
          .catch(() => undefined);
      }
    }
  }, [isClerkLoaded, isClerkSignedIn, clerkUser]);

  const signup = useCallback(async (payload: SignupPayload) => {
    const session = await authService.signup(payload);
    setUser(session.user);
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const session = await authService.login(payload);
    setUser(session.user);
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const session = await authService.loginWithGoogle();
    setUser(session.user);
  }, []);

  const loginWithGoogleAccount = useCallback(async (profile: { email: string; name?: string }) => {
    const session = await authService.loginWithGoogleAccount(profile);
    setUser(session.user);
  }, []);

  const loginWithClerk = useCallback(() => {
    try {
      clerk.openSignIn();
    } catch {
      // Fallback si Clerk modal non accessible
    }
  }, [clerk]);

  const requestPasswordReset = useCallback(async (email: string) => {
    return await authService.requestPasswordReset(email);
  }, []);

  const resetPassword = useCallback(async (email: string, newPassword: string) => {
    return await authService.resetPassword(email, newPassword);
  }, []);

  const logout = useCallback(async () => {
    try {
      if (clerk && isClerkSignedIn) {
        await clerk.signOut();
      }
    } catch {
      // Ignore
    }
    await authService.logout();
    setUser(null);
  }, [clerk, isClerkSignedIn]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      signup,
      login,
      loginWithGoogle,
      loginWithGoogleAccount,
      loginWithClerk,
      requestPasswordReset,
      resetPassword,
      logout,
    }),
    [
      user,
      isLoading,
      signup,
      login,
      loginWithGoogle,
      loginWithGoogleAccount,
      loginWithClerk,
      requestPasswordReset,
      resetPassword,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider.");
  }
  return ctx;
}
