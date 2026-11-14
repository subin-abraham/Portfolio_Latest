import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  fetchAdminSession,
  type AdminSessionUser,
} from "../lib/auth-client";

type Props = {
  children: (admin: AdminSessionUser) => ReactNode;
};

const RequireAuth = ({ children }: Props) => {
  const location = useLocation();
  const [admin, setAdmin] = useState<AdminSessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    fetchAdminSession().then((session) => {
      if (!alive) return;
      setAdmin(session);
      setLoading(false);
    });

    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="admin-shell">
        <p className="admin-muted">Checking session…</p>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <>{children(admin)}</>;
};

export default RequireAuth;
