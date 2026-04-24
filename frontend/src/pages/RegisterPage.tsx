import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (user) {
    return <Navigate to="/recommended" replace />;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = register({ name, email, password });

    if (!result.ok) {
      setError(result.message ?? "Unable to register.");
      return;
    }

    navigate("/recommended");
  }

  return (
    <div className="auth-page auth-register">
      <section className="auth-hero">
        <p className="eyebrow">Taste Profile</p>
        <h1>Build a listener profile the agent can actually learn from.</h1>
        <p>
          Registration is lightweight for now, but it gives each session a stable
          identity for recommendations and feedback history.
        </p>
      </section>

      <section className="auth-card">
        <div className="section-heading">
          <p className="eyebrow">Create account</p>
          <h2>Start your discovery loop</h2>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Alex Rivera"
              required
            />
          </label>

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
              placeholder="Create a password"
              required
            />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button type="submit" className="primary-button">
            Create account
          </button>
        </form>

        <p className="auth-switch">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </div>
  );
}
