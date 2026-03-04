import axios from "axios";
import { tokenStore } from "@/features/auth/tokenStore";
import { handleAuthRefresh } from "@/lib/authRefresh";

export const apiClient = axios.create({
  baseURL: "/api/",
  withCredentials: true,
  timeout: 10_000,
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => handleAuthRefresh(apiClient, error),
);
