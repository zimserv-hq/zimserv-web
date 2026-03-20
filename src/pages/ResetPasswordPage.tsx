// src/pages/ResetPasswordPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 2500);
    }

    setLoading(false);
  };

  return (
    <>
      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg-section);
          padding: 24px 16px;
          font-family: var(--font-primary);
        }

        .auth-card {
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg);
          padding: 48px 44px;
          width: 100%;
          max-width: 440px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .auth-logo-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 32px;
          cursor: pointer;
          transition: transform var(--transition-fast), opacity var(--transition-fast);
        }

        .auth-logo-wrap:hover {
          transform: translateY(-1px);
          opacity: 0.88;
        }

        .auth-logo-img {
          height: 40px;
          width: auto;
          display: block;
        }

        .auth-logo-text {
          font-family: var(--font-primary);
          font-size: 22px;
          font-weight: 800;
          color: var(--color-primary);
          letter-spacing: -0.6px;
          line-height: 1;
        }

        .auth-logo-accent { color: var(--color-accent); }

        .auth-heading {
          font-size: 26px;
          font-weight: 800;
          color: var(--color-primary);
          letter-spacing: -0.8px;
          line-height: 1.2;
          text-align: center;
          margin-bottom: 8px;
        }

        .auth-subheading {
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text-secondary);
          text-align: center;
          margin-bottom: 36px;
          line-height: 1.5;
        }

        .auth-subheading span {
          color: var(--color-accent);
          font-weight: 700;
        }

        .auth-field {
          width: 100%;
          margin-bottom: 16px;
        }

        .auth-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: var(--color-primary);
          margin-bottom: 6px;
          letter-spacing: 0.1px;
        }

        .auth-input {
          width: 100%;
          padding: 13px 16px;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--color-border);
          background: var(--color-bg);
          font-family: var(--font-primary);
          font-size: 15px;
          color: var(--color-primary);
          outline: none;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
          box-sizing: border-box;
        }

        .auth-input:focus {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.12);
        }

        .auth-input::placeholder {
          color: var(--color-text-secondary);
          opacity: 0.7;
        }

        .auth-error {
          width: 100%;
          background: #fff1ee;
          border: 1.5px solid #ffd0c2;
          border-radius: var(--radius-md);
          padding: 12px 16px;
          font-size: 13px;
          font-weight: 500;
          color: #c0392b;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .auth-success {
          width: 100%;
          background: #f0fdf4;
          border: 1.5px solid #bbf7d0;
          border-radius: var(--radius-md);
          padding: 12px 16px;
          font-size: 13px;
          font-weight: 500;
          color: #166534;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .auth-submit-btn {
          width: 100%;
          padding: 14px 20px;
          border-radius: var(--radius-md);
          border: none;
          background: var(--color-accent);
          color: #ffffff;
          font-family: var(--font-primary);
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.1px;
          transition:
            background var(--transition-fast),
            box-shadow var(--transition-fast),
            transform var(--transition-fast);
          margin-top: 4px;
          margin-bottom: 28px;
        }

        .auth-submit-btn:hover:not(:disabled) {
          background: var(--color-accent-dark, #e55a25);
          box-shadow: 0 4px 16px rgba(255, 107, 53, 0.28);
          transform: translateY(-1px);
        }

        .auth-submit-btn:active:not(:disabled) { transform: scale(0.98); }

        .auth-submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .auth-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          margin-bottom: 24px;
        }

        .auth-divider-line {
          flex: 1;
          height: 1px;
          background: var(--color-border);
        }

        .auth-divider-text {
          font-size: 12px;
          font-weight: 600;
          color: var(--color-text-secondary);
          white-space: nowrap;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .auth-terms {
          font-size: 12px;
          color: var(--color-text-secondary);
          text-align: center;
          line-height: 1.6;
          padding: 0 8px;
        }

        .auth-terms a {
          color: var(--color-accent);
          text-decoration: none;
          font-weight: 600;
          cursor: pointer;
          transition: opacity var(--transition-fast);
        }

        .auth-terms a:hover { opacity: 0.75; }

        @media (max-width: 480px) {
          .auth-card {
            padding: 36px 24px;
            border-radius: var(--radius-lg);
          }
          .auth-heading { font-size: 22px; }
        }
      `}</style>

      <div className="auth-page">
        <div style={{ width: "100%", maxWidth: "440px" }}>
          <div className="auth-card">
            {/* Logo */}
            <div
              className="auth-logo-wrap"
              onClick={() => navigate("/")}
              role="button"
              aria-label="ZimServ home"
            >
              <img
                src="/assets/log.png"
                alt="ZimServ"
                className="auth-logo-img"
              />
              <span className="auth-logo-text">
                ZIM<span className="auth-logo-accent">SERV</span>
              </span>
            </div>

            {/* Heading */}
            <h1 className="auth-heading">Set a new password</h1>
            <p className="auth-subheading">
              Choose a <span>strong password</span> for your account
            </p>

            {/* Feedback banners */}
            {error && (
              <div className="auth-error">
                <span>⚠️</span> {error}
              </div>
            )}
            {success && (
              <div className="auth-success">
                <span>✅</span> Password updated! Redirecting you...
              </div>
            )}

            {/* Form */}
            {!success && (
              <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                <div className="auth-field">
                  <label className="auth-label" htmlFor="password">
                    New Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="auth-input"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div className="auth-field">
                  <label className="auth-label" htmlFor="confirm">
                    Confirm Password
                  </label>
                  <input
                    id="confirm"
                    type="password"
                    className="auth-input"
                    placeholder="Repeat your new password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Password →"}
                </button>
              </form>
            )}

            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">Secure & Private</span>
              <div className="auth-divider-line" />
            </div>

            <p className="auth-terms">
              Remember your password?{" "}
              <a onClick={() => navigate("/signin")}>Sign in instead</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
