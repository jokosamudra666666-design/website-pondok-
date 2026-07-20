import React, { createContext, useContext, useState, useEffect } from "react";
import { apiService, clearAuthToken, getAuthToken } from "../../services/api";
import { IAdmin, ISettings } from "../../types";

export interface ToastMessage {
  id: string;
  text: string;
  type: "success" | "error" | "warning" | "info";
}

interface AppContextType {
  settings: ISettings | null;
  admin: IAdmin | null;
  loadingAdmin: boolean;
  toasts: ToastMessage[];
  showToast: (text: string, type?: ToastMessage["type"]) => void;
  removeToast: (id: string) => void;
  login: (credentials: any) => Promise<boolean>;
  logout: () => void;
  refreshSettings: () => Promise<void>;
  refreshAdmin: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ISettings | null>(null);
  const [admin, setAdmin] = useState<IAdmin | null>(null);
  const [loadingAdmin, setLoadingAdmin] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Fetch settings on startup
  useEffect(() => {
    refreshSettings();
    checkAuth();
  }, []);

  const refreshSettings = async () => {
    try {
      const res = await apiService.getSettings();
      if (res.success) {
        setSettings(res.data);
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    }
  };

  const checkAuth = async () => {
    if (!getAuthToken()) {
      setLoadingAdmin(false);
      return;
    }
    try {
      const res = await apiService.getCurrentUser();
      if (res.success) {
        setAdmin(res.data);
      } else {
        clearAuthToken();
      }
    } catch {
      clearAuthToken();
    } finally {
      setLoadingAdmin(false);
    }
  };

  const refreshAdmin = async () => {
    await checkAuth();
  };

  const showToast = (text: string, type: ToastMessage["type"] = "success") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const login = async (credentials: any) => {
    try {
      const res = await apiService.login(credentials);
      if (res.success && res.data?.admin) {
        setAdmin(res.data.admin);
        showToast("Login berhasil! Selamat datang di Dashboard.", "success");
        return true;
      }
      return false;
    } catch (err: any) {
      showToast(err.message || "Gagal masuk. Coba cek email atau password.", "error");
      return false;
    }
  };

  const logout = () => {
    apiService.logout();
    setAdmin(null);
    showToast("Anda telah keluar secara aman.", "info");
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        admin,
        loadingAdmin,
        toasts,
        showToast,
        removeToast,
        login,
        logout,
        refreshSettings,
        refreshAdmin,
      }}
    >
      {children}

      {/* Global Toast Container */}
      <div className="fixed bottom-6 right-6 z-100 flex flex-col gap-3 max-w-md w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-lg border flex items-center justify-between transition-all duration-300 transform translate-y-0 scale-100 bg-white ${
              t.type === "success"
                ? "border-green-200 text-green-800 bg-green-50/95"
                : t.type === "error"
                ? "border-red-200 text-red-800 bg-red-50/95"
                : t.type === "warning"
                ? "border-yellow-200 text-yellow-800 bg-yellow-50/95"
                : "border-blue-200 text-blue-800 bg-blue-50/95"
            }`}
          >
            <div className="flex items-center gap-3">
              {t.type === "success" && (
                <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {t.type === "error" && (
                <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {t.type === "warning" && (
                <svg className="w-5 h-5 text-yellow-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
              {t.type === "info" && (
                <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <p className="text-sm font-medium">{t.text}</p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="ml-4 text-gray-400 hover:text-gray-600 transition-colors pointer-events-auto"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};
