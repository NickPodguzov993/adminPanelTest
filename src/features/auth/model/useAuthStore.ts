import { create } from "zustand";
import { clearToken, getToken, saveToken } from "../lib/storage";

type AuthState = {
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (token: string, remember: boolean) => void;
    logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    token: getToken(),
    isAuthenticated: !!getToken(),

    setAuth: (token, remember) => {
        saveToken(token, remember);
        set({ token, isAuthenticated: true });
    },

    logout: () => {
        clearToken();
        set({ token: null, isAuthenticated: false });
    },
}));