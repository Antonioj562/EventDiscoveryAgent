import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface TopBarProps {
  variant?: "auth" | "app";
}

function ClerkMiddlewarePlaceholder() {
  return (
    <div className="clerk-slot" aria-label="Clerk middleware placeholder">
      <span className="clerk-slot-dot" />
      <span>Clerk slot</span>
    </div>
  );
}

export function TopBar({ variant = "app" }: TopBarProps) {
  const { user, logout } = useAuth();
  const isAuth = variant === "auth";

  return (
    <header className={`top-bar top-bar-${variant}`}>
      <Link to="/" className="brand-mark" aria-label="Event Discovery Agent home">
        <span className="brand-icon">ED</span>
        <span>Event Discovery</span>
      </Link>

      <nav className="top-nav" aria-label={isAuth ? "Authentication page" : "Application"}>
        {isAuth ? (
          <>
            <a href="#how-it-works">How it works</a>
            <a href="#features">Features</a>
            <a href="#use-cases">Use cases</a>
          </>
        ) : (
          <>
            <NavLink
              to="/recommended"
              className={({ isActive }) => (isActive ? "top-nav-link active" : "top-nav-link")}
            >
              Recommended
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) => (isActive ? "top-nav-link active" : "top-nav-link")}
            >
              History
            </NavLink>
          </>
        )}
      </nav>

      <div className="top-actions">
        {isAuth ? (
          <>
            <Link to="/login" className="ghost-button top-auth-link">
              Login
            </Link>
            <Link to="/register" className="primary-button signup-button">
              Sign up
            </Link>
          </>
        ) : (
          <>
            <ClerkMiddlewarePlaceholder />
            <div className="user-pill" title={user?.email}>
              <span>{user?.name || "User"}</span>
            </div>
            <button className="ghost-button" onClick={logout}>
              Log out
            </button>
          </>
        )}
      </div>
    </header>
  );
}
