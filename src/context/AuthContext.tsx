import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getCurrentUserFromToken, logout as hardLogout } from "../services/auth";

export type Role = "CANDIDATE" | "COMPANY" | "ADMIN" | null;

export type User = {
  id: number;
  username: string;
  email?: string;
  role: Role;
} | null;

type AuthContextValue = {
  user: User;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("accessToken")
  );
  const [user, setUser] = useState<User>(() => {
    const decoded = getCurrentUserFromToken();
    return decoded
      ? {
          id: decoded.user_id,
          username: decoded.username,
          email: decoded.email,
          role: decoded.role ?? null,
        }
      : null;
  });
  const [loading] = useState(false);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    const decoded = getCurrentUserFromToken();
    if (decoded) {
      setUser({
        id: decoded.user_id,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role ?? null,
      });
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (accessToken: string, newUser: User) => {
    localStorage.setItem("accessToken", accessToken);
    setToken(accessToken);
    setUser(newUser);
  };
  const logout = () => {
    hardLogout(); // quita access/refresh de localStorage
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
