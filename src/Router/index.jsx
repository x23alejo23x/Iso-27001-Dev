import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";
import LoginView from "../pages/Login/views";
import DashboardView from "../pages/Dashboard/views";
import ChecklistView from "../pages/Checklist/views";
import AdminView from "../pages/Admin/views";
import SettingsView from "../pages/Settings/views";

function ProtectedRoute({ children }) {
  const { isAuthenticated, ready } = useAuth();

  if (!ready) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardView />} />
        <Route path="checklist" element={<ChecklistView />} />
        <Route path="admin" element={<AdminView />} />
        <Route path="settings" element={<SettingsView />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
