import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function AppShell() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const subtitle =
    location.pathname === "/history"
      ? "Track how the model is learning from your signals."
      : "Find concerts that actually feel like your scene.";

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Event Discovery Agent</p>
          <h1>Concert taste, with memory.</h1>
          <p className="sidebar-copy">{subtitle}</p>
        </div>

        <nav className="nav-links">
          <NavLink
            to="/recommended"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            Recommended
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            History
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div>
            <p className="sidebar-user">{user?.name}</p>
            <p className="sidebar-email">{user?.email}</p>
          </div>
          <button className="ghost-button" onClick={logout}>
            Log out
          </button>
        </div>
      </aside>

      <main className="main-panel">
        <Outlet />
      </main>
    </div>
  );
}
