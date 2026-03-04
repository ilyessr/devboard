import { apiClient } from "@/lib/apiClient";

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthResponse = {
  access: string;
};

export type Me = {
  id: number;
  email: string;
};

export async function login(data: LoginInput): Promise<AuthResponse> {
  const res = await apiClient.post("auth/login/", data);
  return res.data;
}

export async function getMe(): Promise<Me> {
  const res = await apiClient.get("auth/me/");
  return res.data;
}
