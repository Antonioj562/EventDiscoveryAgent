import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AuthScrollSections } from "../components/AuthScrollSections";
import { Footer } from "../components/Footer";
import { TopBar } from "../components/TopBar";
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
    <div className="site-page auth-screen">
      <TopBar variant="auth" />

      <main className="auth-main">
        <section className="auth-landing" aria-labelledby="login-title">
          <div className="auth-story">
            <p className="eyebrow">Live event discovery</p>
            <h1 id="login-title">
              Find the next night out without digging through{" "}
              <span className="gradient-text">listings.</span>
            </h1>
            <p>
              Event Discovery turns a casual prompt into a curated shortlist,
              then keeps improving as you save, skip, and attend events.
            </p>

            <div className="hero-proof-row" aria-label="Audience examples">
              <span>Campus nights</span>
              <span>Conference travel</span>
              <span>Weekend plans</span>
            </div>

          </div>

          <div className="auth-visual" aria-hidden="true">
            <div className="visual-block visual-block-blue" />
            <div className="visual-block visual-block-green" />
            <div className="visual-ticket ticket-main">
              <span>Tonight</span>
              <strong>Indie Rooftop Set</strong>
              <small>92% taste match</small>
            </div>
            <div className="visual-ticket ticket-small">
              <span>Saved</span>
              <strong>Acoustic Session</strong>
            </div>
          </div>

          <section className="auth-card" aria-label="Sign in">
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
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </label>

              {error ? <p className="form-error" role="alert">{error}</p> : null}

              <button type="submit" className="primary-button">
                Sign in
              </button>
            </form>

            <p className="auth-switch">
              Need an account? <Link to="/register">Create one</Link>
            </p>
          </section>
        </section>

        <AuthScrollSections />
      </main>

      <Footer />
    </div>
  );
}
