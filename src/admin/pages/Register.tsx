import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import {
  adminRegistrationEnabled,
  fetchRegistrationEnabled,
} from "../lib/registration";

const Register = () => {
  const [allowed, setAllowed] = useState<boolean | null>(
    adminRegistrationEnabled ? null : false
  );

  useEffect(() => {
    if (!adminRegistrationEnabled) {
      setAllowed(false);
      return;
    }

    let alive = true;
    fetchRegistrationEnabled().then((enabled) => {
      if (alive) setAllowed(enabled);
    });

    return () => {
      alive = false;
    };
  }, []);

  if (allowed === false) {
    return <Navigate to="/admin/login" replace />;
  }

  if (allowed === null) {
    return (
      <div className="admin-shell">
        <p className="admin-muted">Checking registration…</p>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <div aria-hidden className="admin-glow" />
      <div className="admin-panel anim-fade-up">
        <p className="admin-eyebrow">Admin</p>
        <h1 className="admin-title">Register</h1>
        <p className="admin-lede">
          Create the first admin account for the portfolio control panel.
        </p>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
