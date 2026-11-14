import { Navigate, Route, Routes } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import { adminRegistrationEnabled } from "./lib/registration";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./styles/admin.css";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      {adminRegistrationEnabled ? (
        <Route path="register" element={<Register />} />
      ) : (
        <Route
          path="register"
          element={<Navigate to="/admin/login" replace />}
        />
      )}
      <Route
        path=""
        element={
          <RequireAuth>
            {(admin) => <Dashboard admin={admin} />}
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
