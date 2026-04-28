import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Footer() {
  const { user } = useAuth();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="brand-icon">ED</span>
          <div>
            <p>Event Discovery</p>
            <span>Simple recommendations for better nights out.</span>
          </div>
        </div>

        <div className="footer-columns">
          <nav className="footer-column" aria-label="Product">
            <p>Product</p>
            {user ? (
              <>
                <Link to="/recommended">Recommended</Link>
                <Link to="/history">History</Link>
              </>
            ) : (
              <>
                <a href="#how-it-works">How it works</a>
                <a href="#features">Features</a>
                <a href="#use-cases">Use cases</a>
                <a href="#faq">FAQ</a>
              </>
            )}
          </nav>

          <nav className="footer-column" aria-label="Account">
            <p>Account</p>
            {user ? (
              <>
                <Link to="/recommended">Open app</Link>
                <Link to="/history">Feedback history</Link>
              </>
            ) : (
              <>
                <Link to="/login">Sign in</Link>
                <Link to="/register">Create account</Link>
              </>
            )}
          </nav>

          <div className="footer-column footer-status">
            <p>Status</p>
            <span>Local demo auth active</span>
            <a href="mailto:support@eventdiscovery.local">support@eventdiscovery.local</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
