"use client";

import { createContext, useContext, useState } from "react";

type User = {
  email: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user] = useState<User | null>({
    email: "demo@example.com",
    name: "Demo User"
  });

  const signIn = async (email: string, password: string) => {
    // Mock authentication
    console.log("Mock sign in:", email, password);
  };

  const signOut = () => {
    // Mock sign out
    console.log("Mock sign out");
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