import { Link, Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div style={{ fontFamily: "system-ui" }}>
      <header
        style={{
          padding: 16,
          borderBottom: "1px solid #eee",
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <strong>DevBoard</strong>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/boards">Boards</Link>
        </nav>
      </header>

      <main style={{ padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}
