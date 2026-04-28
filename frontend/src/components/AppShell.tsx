import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Footer } from "./Footer";
import { TopBar } from "./TopBar";

export function ProtectedRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function AppShell() {
  return (
    <div className="app-shell">
      <TopBar variant="app" />
      <main className="main-panel">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
