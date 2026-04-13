import { useMutation, useQuery } from "@tanstack/react-query";
import { login, getMe, logout as logoutRequest, refresh } from "./api";
import type { LoginInput } from "./types";
import { tokenStore } from "./tokenStore";
import { useEffect, useState } from "react";

export function useAuthInit() {
  const [isReady, setIsReady] = useState(() => Boolean(tokenStore.get()));

  useEffect(() => {
    if (tokenStore.get()) {
      return;
    }

    refresh()
      .then((data) => tokenStore.set(data.access))
      .catch(() => tokenStore.clear())
      .finally(() => setIsReady(true));
  }, []);

  return isReady;
}

export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const res = await login(data);
      tokenStore.set(res.access);
      return res;
    },
  });
}

export function useMe(enabled: boolean) {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled,
  });
}

export async function logout() {
  try {
    await logoutRequest();
  } finally {
    tokenStore.clear();
  }
}
