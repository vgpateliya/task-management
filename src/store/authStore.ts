import { AuthState, User } from "@/types";
import { create } from "zustand";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user: User | null) => set({ user, loading: false }),
  logout: () => set({ user: null, loading: false }),
  setLoading: (loading: boolean) => set({ loading }),
}));
