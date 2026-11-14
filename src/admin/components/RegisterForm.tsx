import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import HoneypotField from "./HoneypotField";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
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

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: name.trim() || undefined,
          website: honeypot,
        }),
      });

      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        signedIn?: boolean;
      };

      setPending(false);

      if (!res.ok || json.ok === false) {
        if (res.status === 404) {
          setError("Registration is disabled.");
          return;
        }
        setError(json.error || "Registration failed.");
        return;
      }

      if (honeypot.trim().length > 0) {
        navigate("/admin", { replace: true });
        return;
      }

      if (json.signedIn) {
        navigate("/admin", { replace: true });
        return;
      }

      navigate("/admin/login", { replace: true });
    } catch {
      setPending(false);
      setError("Cannot reach the admin API. Is the server running?");
    }
  }

  return (
    <form className="admin-form" onSubmit={onSubmit} noValidate>
      <HoneypotField />

      <label className="admin-field">
        <span>Name</span>
        <input
          type="text"
          name="name"
          autoComplete="name"
          maxLength={120}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={pending}
        />
      </label>

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
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={128}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={pending}
        />
        <em className="admin-hint">At least 8 characters</em>
      </label>

      {error ? (
        <p className="admin-error" role="alert">
          {error}
        </p>
      ) : null}

      <button className="admin-submit" type="submit" disabled={pending}>
        {pending ? "Creating account…" : "Create admin account"}
      </button>

      <p className="admin-switch">
        Already have an account? <Link to="/admin/login">Sign in</Link>
      </p>
    </form>
  );
};

export default RegisterForm;
