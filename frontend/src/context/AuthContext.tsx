import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { AuthUser, UserAccount } from "../types";

const USERS_KEY = "eda.accounts";
const CURRENT_USER_KEY = "eda.currentUser";

interface AuthContextValue {
  user: AuthUser | null;
  register: (account: UserAccount) => { ok: boolean; message?: string };
  login: (email: string, password: string) => { ok: boolean; message?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function normalizeSessionId(email: string) {
  return email.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function readAccounts(): UserAccount[] {
  const raw = window.localStorage.getItem(USERS_KEY);
  return raw ? (JSON.parse(raw) as UserAccount[]) : [];
}

function writeAccounts(accounts: UserAccount[]) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(accounts));
}

function readCurrentUser(): AuthUser | null {
  const raw = window.localStorage.getItem(CURRENT_USER_KEY);
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(readCurrentUser());
  }, []);

  const value: AuthContextValue = {
    user,
    register(account) {
      const accounts = readAccounts();
      const exists = accounts.some(
        (entry) => entry.email.toLowerCase() === account.email.toLowerCase(),
      );

      if (exists) {
        return { ok: false, message: "That email is already registered." };
      }

      writeAccounts([...accounts, account]);

      const nextUser: AuthUser = {
        name: account.name,
        email: account.email,
        sessionId: normalizeSessionId(account.email),
      };
      window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(nextUser));
      setUser(nextUser);

      return { ok: true };
    },
    login(email, password) {
      const account = readAccounts().find(
        (entry) =>
          entry.email.toLowerCase() === email.toLowerCase() &&
          entry.password === password,
      );

      if (!account) {
        return { ok: false, message: "Email or password is incorrect." };
      }

      const nextUser: AuthUser = {
        name: account.name,
        email: account.email,
        sessionId: normalizeSessionId(account.email),
      };
      window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(nextUser));
      setUser(nextUser);

      return { ok: true };
    },
    logout() {
      window.localStorage.removeItem(CURRENT_USER_KEY);
      setUser(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return value;
}
