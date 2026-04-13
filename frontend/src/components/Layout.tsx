import { Icon } from "@/components/Icon";
import { logout } from "@/features/auth/hooks";
import { tokenStore } from "@/features/auth/tokenStore";
import { useSyncExternalStore } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

export function Layout() {
  const navigate = useNavigate();
  const token = useSyncExternalStore(
    tokenStore.subscribe,
    tokenStore.get,
    tokenStore.get,
  );
  const isAuthenticated = Boolean(token);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container topbar__inner">
          <Link className="brand" to={isAuthenticated ? "/boards" : "/"}>
            <Icon name="spark" className="icon" />
            <span>DevBoard</span>
          </Link>
          <nav className="nav">
            {isAuthenticated && (
              <>
                <NavLink
                  to="/boards"
                  className={({ isActive }) =>
                    `nav-link${isActive ? " nav-link--active" : ""}`
                  }
                >
                  <Icon name="boards" className="icon" />
                  <span>Boards</span>
                </NavLink>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handleLogout}
                >
                  <Icon name="logout" className="icon" />
                  <span>Déconnexion</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="container main-content">
        <Outlet />
      </main>
    </div>
  );
}
