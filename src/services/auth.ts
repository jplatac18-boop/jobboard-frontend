import api from "./api";
import { jwtDecode } from "jwt-decode";

export type AuthTokens = {
  access: string;
  refresh: string;
};

export type RegisterCandidatePayload = {
  username: string;
  full_name: string;
  email: string;
  password: string;
};

export type RegisterCompanyPayload = {
  username: string;
  company_name: string;
  email: string;
  password: string;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  role?: "CANDIDATE" | "COMPANY" | "ADMIN";
};

type DecodedToken = {
  user_id: number;
  username: string;
  email?: string;
  role?: "CANDIDATE" | "COMPANY" | "ADMIN";
  exp: number;
  iat: number;
};

export const login = async (username: string, password: string) => {
  const res = await api.post<AuthTokens>("/auth/login/", {
    username,
    password,
  });

  const tokens = res.data;
  localStorage.setItem("accessToken", tokens.access);
  localStorage.setItem("refreshToken", tokens.refresh);

  return tokens;
};

export const registerCandidate = async (payload: RegisterCandidatePayload) => {
  const res = await api.post("/auth/register/", {
    ...payload,
    role: "CANDIDATE",
  });
  return res.data;
};

export const registerCompany = async (payload: RegisterCompanyPayload) => {
  const res = await api.post("/auth/register/", {
    ...payload,
    role: "COMPANY",
  });
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("accessToken");
};

export const refreshAccessToken = async (): Promise<string | null> => {
  const refresh = localStorage.getItem("refreshToken");
  if (!refresh) return null;

  try {
    const res = await api.post<{ access: string }>("/auth/refresh/", {
      refresh,
    });
    const newAccess = res.data.access;
    localStorage.setItem("accessToken", newAccess);
    return newAccess;
  } catch {
    logout();
    return null;
  }
};

export const getCurrentUserFromToken = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch {
    return null;
  }
};

export const getCurrentUserRole = (): string | null => {
  const decoded = getCurrentUserFromToken();
  return decoded?.role ?? null;
};

export const isCompany = () => getCurrentUserRole() === "COMPANY";
export const isCandidate = () => getCurrentUserRole() === "CANDIDATE";
export const isAdmin = () => getCurrentUserRole() === "ADMIN";
