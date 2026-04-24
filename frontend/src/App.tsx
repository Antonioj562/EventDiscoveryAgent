import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell, ProtectedRoute } from "./components/AppShell";
import { useAuth } from "./context/AuthContext";
import { HistoryPage } from "./pages/HistoryPage";
import { LoginPage } from "./pages/LoginPage";
import { RecommendedPage } from "./pages/RecommendedPage";
import { RegisterPage } from "./pages/RegisterPage";

function RootRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? "/recommended" : "/login"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/recommended" element={<RecommendedPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
