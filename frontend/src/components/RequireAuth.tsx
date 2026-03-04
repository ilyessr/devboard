import { Navigate, Outlet } from "react-router-dom";
import { tokenStore } from "@/features/auth/tokenStore";

export function RequireAuth() {
  const token = tokenStore.get();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
