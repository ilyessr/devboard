import { Navigate, Outlet } from "react-router-dom";
import { tokenStore } from "@/features/auth/tokenStore";

export function RequireGuest() {
  const token = tokenStore.get();

  if (token) {
    return <Navigate to="/boards" replace />;
  }

  return <Outlet />;
}
