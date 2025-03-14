import { create } from "zustand";
import { User } from "../types";
import { auth } from "../utils/api";
import { ApiError } from "../utils/api";

interface AuthState {
  isAuthenticated: boolean;
  error: string | null;
  userRole: "Admin" | "User" | null;
  signin: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string, role: "Admin" | "User") => Promise<void>;
  signout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  error: null,
  userRole: null,
  signin: async (username: string, password: string) => {
    try {
      const data = await auth.signin(username, password);
      const token = data.accessToken; 
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log(payload);
        console.log(payload.role);
        set({ isAuthenticated: true, error: null, userRole: payload.role });
      }
    } catch (error) {
      const errorMessage = error instanceof ApiError
        ? error.message
        : "An unexpected error occurred. Please try again.";
      set({ error: errorMessage });
      throw error;
    }
  },
  signup: async (username: string, password: string, role: "Admin" | "User") => {
    try {
      const data = await auth.signup(username, password, role);
      set({ isAuthenticated: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof ApiError
        ? error.message
        : "An unexpected error occurred. Please try again.";
      set({ error: errorMessage });
      throw error;
    }
  },
  signout: () => {
    auth.signout();
    set({ isAuthenticated: false, error: null, userRole: null });
  },
  clearError: () => set({ error: null })
}));
