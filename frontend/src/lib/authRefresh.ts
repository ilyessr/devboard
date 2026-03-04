import type { AxiosInstance } from "axios";
import { tokenStore } from "@/features/auth/tokenStore";

let isRefreshing = false;
let queue: Array<(token: string | null) => void> = [];

function processQueue(token: string | null) {
  queue.forEach((cb) => cb(token));
  queue = [];
}

/**
 * Handle a 401 by attempting a refresh (using httpOnly cookie),
 * then retrying the original request with the new access token.
 */
export async function handleAuthRefresh(
  apiClient: AxiosInstance,
  error: any,
): Promise<any> {
  const originalRequest = error.config;

  // Only handle 401
  if (error.response?.status !== 401) {
    return Promise.reject(error);
  }

  // Prevent infinite loops
  if (originalRequest?._retry) {
    return Promise.reject(error);
  }

  const url: string = originalRequest?.url ?? "";
  if (url.includes("auth/refresh")) {
    tokenStore.clear();
    return Promise.reject(error);
  }

  originalRequest._retry = true;

  // If refresh in progress, queue this request
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      queue.push((token) => {
        if (!token) return reject(error);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        resolve(apiClient(originalRequest));
      });
    });
  }

  isRefreshing = true;

  try {
    const resp = await apiClient.post<{ access: string }>("auth/refresh/", {});
    const newAccess = resp.data.access;

    tokenStore.set(newAccess);
    processQueue(newAccess);

    originalRequest.headers.Authorization = `Bearer ${newAccess}`;
    return apiClient(originalRequest);
  } catch (err) {
    tokenStore.clear();
    processQueue(null);
    return Promise.reject(err);
  } finally {
    isRefreshing = false;
  }
}
