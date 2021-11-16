import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { User } from "firebase/auth";
import flexFirebase from "../firebase/clientApp";

interface IContainsUser {
  user: User | null;
}

const AuthContext = createContext<IContainsUser>({ user: null });

export function GetAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribed = flexFirebase.auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => {
      unsubscribed();
    };
  }, []);

  return <AuthContext.Provider value={{ user: user }}>{children}</AuthContext.Provider>;
}
