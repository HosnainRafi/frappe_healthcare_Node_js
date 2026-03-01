import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI, patientAPI } from "../services/api";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login(credentials);
          const { token, user } = response.data.data || response.data;

          localStorage.setItem("token", token);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || "Login failed";
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register(data);
          const { token, user } = response.data.data || response.data;

          localStorage.setItem("token", token);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true };
        } catch (error) {
          const message =
            error.response?.data?.message || "Registration failed";
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      logout: () => {
        localStorage.removeItem("token");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      fetchProfile: async () => {
        try {
          const response = await patientAPI.getProfile();
          const userData = response.data.data || response.data;
          set({ user: userData });
          return { success: true, data: userData };
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          return { success: false };
        }
      },

      updateProfile: async (data) => {
        set({ isLoading: true });
        try {
          const response = await patientAPI.updateProfile(data);
          const userData = response.data.data || response.data;
          set({ user: userData, isLoading: false });
          return { success: true, data: userData };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.response?.data?.message };
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export default useAuthStore;
