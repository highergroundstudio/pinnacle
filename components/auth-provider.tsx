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
  const [user, setUser] = useState<User | null>(() => {
    // Check localStorage for saved user data
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const signIn = async (email: string, password: string) => {
    // Simple authentication logic
    if (password === 'admin123') {
      const user = { email, name: email.split('@')[0] };
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
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