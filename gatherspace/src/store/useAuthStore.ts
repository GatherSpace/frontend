import { create } from "zustand";
import { User } from "../types";
import { auth } from "../utils/api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  signin: (username: string, password: string) => Promise<void>;
  signup: (
    username: string,
    password: string,
    role: "Admin" | "User"
  ) => Promise<void>;
  signout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  signin: async (username: string, password: string) => {
    try {
      const data = await auth.signin(username, password);
      set({ isAuthenticated: true, user: data.user });
    } catch (error) {
      console.error("Signin failed:", error);
      throw error;
    }
  },
  signup: async (
    username: string,
    password: string,
    role: "Admin" | "User"
  ) => {
    try {
      const data = await auth.signup(username, password, role);
      set({ user: { userId: data.userId, username, role } });
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  },
  signout: () => {
    auth.signout();
    set({ user: null, isAuthenticated: false });
  },
}));
