import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (user) {
    return <Navigate to="/recommended" replace />;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = login(email, password);

    if (!result.ok) {
      setError(result.message ?? "Unable to log in.");
      return;
    }

    navigate("/recommended");
  }

  return (
    <div className="auth-page auth-login">
      <section className="auth-hero">
        <p className="eyebrow">Live Music Discovery</p>
        <h1>Find the next show that feels picked for you.</h1>
        <p>
          A sharper concert discovery flow with memory, recommendation logic, and
          visible agent behavior.
        </p>
      </section>

      <section className="auth-card">
        <div className="section-heading">
          <p className="eyebrow">Welcome back</p>
          <h2>Sign in to your account</h2>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="alex@indienights.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button type="submit" className="primary-button">
            Sign in
          </button>
        </form>

        <p className="auth-switch">
          Need an account? <Link to="/register">Create one</Link>
        </p>
      </section>
    </div>
  );
}
