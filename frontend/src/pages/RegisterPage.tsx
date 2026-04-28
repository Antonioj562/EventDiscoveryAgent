import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AuthScrollSections } from "../components/AuthScrollSections";
import { Footer } from "../components/Footer";
import { TopBar } from "../components/TopBar";
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
    <div className="site-page auth-screen">
      <TopBar variant="auth" />

      <main className="auth-main">
        <section className="auth-landing" aria-labelledby="register-title">
          <div className="auth-story">
            <p className="eyebrow">Taste profile</p>
            <h1 id="register-title">
              Create a profile the event agent can{" "}
              <span className="gradient-text">learn from.</span>
            </h1>
            <p>
              Start with a lightweight account, then build a history of what you
              like, skip, and actually attend.
            </p>

            <div className="hero-proof-row" aria-label="Recommendation signals">
              <span>Interests</span>
              <span>Attendance</span>
              <span>Location</span>
            </div>

          </div>

          <div className="auth-visual" aria-hidden="true">
            <div className="visual-block visual-block-blue" />
            <div className="visual-block visual-block-green" />
            <div className="visual-ticket ticket-main">
              <span>Profile</span>
              <strong>Live music memory</strong>
              <small>Learning from feedback</small>
            </div>
            <div className="visual-ticket ticket-small">
              <span>Signal</span>
              <strong>Attended</strong>
            </div>
          </div>

          <section className="auth-card" aria-label="Create account">
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
                  onChange={(event) => {
                    setName(event.target.value);
                    if (error) {
                      setError("");
                    }
                  }}
                  placeholder="Alex Rivera"
                  autoComplete="name"
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) {
                      setError("");
                    }
                  }}
                  placeholder="alex@indienights.com"
                  autoComplete="email"
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (error) {
                      setError("");
                    }
                  }}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  required
                />
              </label>

              {error ? <p className="form-error" role="alert">{error}</p> : null}

              <button type="submit" className="primary-button">
                Create account
              </button>
            </form>

            <p className="auth-switch">
              Already registered? <Link to="/login">Sign in</Link>
            </p>
          </section>
        </section>

        <AuthScrollSections />
      </main>

      <Footer />
    </div>
  );
}
