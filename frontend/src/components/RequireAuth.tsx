import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { tokenStore } from "@/features/auth/tokenStore";
import { refresh } from "@/features/auth/api";

export function RequireAuth() {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(() => !tokenStore.get());
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(tokenStore.get()),
  );

  useEffect(() => {
    if (tokenStore.get()) {
      setIsAuthenticated(true);
      setIsChecking(false);
      return;
    }

    let cancelled = false;

    async function restoreSession() {
      try {
        const data = await refresh();
        tokenStore.set(data.access);

        if (!cancelled) {
          setIsAuthenticated(true);
        }
      } catch {
        tokenStore.clear();

        if (!cancelled) {
          setIsAuthenticated(false);
        }
      } finally {
        if (!cancelled) {
          setIsChecking(false);
        }
      }
    }

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isChecking) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
