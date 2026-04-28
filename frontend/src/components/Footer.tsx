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

        <nav className="footer-links" aria-label="Footer">
          {user ? (
            <>
              <Link to="/recommended">Recommended</Link>
              <Link to="/history">History</Link>
            </>
          ) : (
            <>
              <a href="#features">Features</a>
              <a href="#about">About</a>
              <a href="#faq">FAQ</a>
            </>
          )}
          <a href="mailto:support@eventdiscovery.local">Support</a>
        </nav>
      </div>
    </footer>
  );
}
