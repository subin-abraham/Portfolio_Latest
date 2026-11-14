import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPassword } from "../lib/auth-client";
import { adminRegistrationEnabled } from "../lib/registration";
import HoneypotField from "./HoneypotField";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const form = e.currentTarget;
    const honeypot =
      (form.elements.namedItem("website") as HTMLInputElement | null)?.value ??
      "";

    const result = await signInWithPassword({
      email,
      password,
      website: honeypot,
    });
    setPending(false);

    if (!result.ok) {
      setError(result.error || "Invalid email or password.");
      return;
    }

    navigate("/admin", { replace: true });
  }

  return (
    <form className="admin-form" onSubmit={onSubmit} noValidate>
      <HoneypotField />

      <label className="admin-field">
        <span>Email</span>
        <input
          type="email"
          name="email"
          autoComplete="username"
          required
          maxLength={254}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={pending}
        />
      </label>

      <label className="admin-field">
        <span>Password</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          maxLength={128}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={pending}
        />
      </label>

      {error ? (
        <p className="admin-error" role="alert">
          {error}
        </p>
      ) : null}

      <button className="admin-submit" type="submit" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>

      {adminRegistrationEnabled ? (
        <p className="admin-switch">
          Need an account?{" "}
          <Link to="/admin/register">Create admin account</Link>
        </p>
      ) : null}
    </form>
  );
};

export default LoginForm;
