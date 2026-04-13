import { apiClient } from "@/lib/apiClient";
import type { AuthResponse, LoginInput, Me } from "./types";

export async function login(data: LoginInput): Promise<AuthResponse> {
  const res = await apiClient.post("auth/login/", data);
  return res.data;
}

export async function getMe(): Promise<Me> {
  const res = await apiClient.get("auth/me/");
  return res.data;
}

export async function logout(): Promise<void> {
  await apiClient.post("auth/logout/", {});
}

export async function refresh(): Promise<AuthResponse> {
  const res = await apiClient.post("auth/refresh/", null, {
    withCredentials: true,
  });
  return res.data;
}
