import { useMutation, useQuery } from "@tanstack/react-query";
import { login, getMe, type LoginInput } from "./api";
import { tokenStore } from "./tokenStore";

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

export function logout() {
  tokenStore.clear();
}
