"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { pb, type AuthModel } from "@/lib/pocketbase";
import { useRouter, usePathname } from "next/navigation";

type AuthContextType = {
  user: AuthModel | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthModel | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if we have a valid session
    const model = pb.authStore.model as AuthModel | null;
    setUser(model);

    // Subscribe to auth state changes
    pb.authStore.onChange(() => {
      setUser(pb.authStore.model as AuthModel | null);
    });
  }, []);

  useEffect(() => {
    if (!user && !pathname.startsWith("/auth")) {
      router.push("/auth/login");
    }
  }, [user, pathname, router]);

  const signIn = async (email: string, password: string) => {
    await pb.collection("users").authWithPassword(email, password);
    router.push("/");
  };

  const signOut = () => {
    pb.authStore.clear();
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};