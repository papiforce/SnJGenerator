import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { hashPassword } from "@/utils/hashPassword";

const SESSION_KEY = "sengoku_admin_auth";

interface AdminAuthValue {
  isAuthed: boolean;
  /** true si le login réussit. */
  authenticate: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthed, setIsAuthed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      return false;
    }
  });

  const authenticate = useCallback(async (password: string) => {
    const expected = import.meta.env.VITE_ADMIN_PASSWORD_HASH as
      | string
      | undefined;
    if (!expected) {
      console.warn(
        "VITE_ADMIN_PASSWORD_HASH non défini : accès admin impossible.",
      );
      return false;
    }
    const hash = await hashPassword(password);
    if (hash !== expected.trim().toLowerCase()) return false;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    setIsAuthed(true);
    return true;
  }, []);

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
    setIsAuthed(false);
  }, []);

  const value = useMemo(
    () => ({ isAuthed, authenticate, logout }),
    [isAuthed, authenticate, logout],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx)
    throw new Error("useAdminAuth doit être utilisé dans AdminAuthProvider");
  return ctx;
}
