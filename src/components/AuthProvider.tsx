"use client";

import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authAPI.verify();
        const userData = response.data;

        setUser({ ...userData, token });
      } catch (error) {
        localStorage.removeItem("token");
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [setUser, setLoading, logout]);

  return children;
}
