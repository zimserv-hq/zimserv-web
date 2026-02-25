// src/pages/SignUpPage.tsx
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const SignUpPage = () => {
  const navigate = useNavigate();

  const handleGoogleSignUp = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  };

  const handleAppleSignUp = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: { redirectTo: window.location.origin },
    });
  };

  return (
    <>
      <style>{`
        /* Reuses same .auth-* classes defined in SignInPage
           Only unique overrides needed here */

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

        .auth-logo-accent {
        color: var(--color-accent);
        }


        .auth-logo {
          height: 44px;
          width: auto;
          margin-bottom: 32px;
          cursor: pointer;
        }

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

        .auth-benefits {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 28px;
          background: var(--color-accent-soft);
          border-radius: var(--radius-md);
          padding: 16px 18px;
        }

        .auth-benefit-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 600;
          color: var(--color-primary);
        }

        .auth-benefit-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--color-accent);
          flex-shrink: 0;
        }

        .auth-btn-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          margin-bottom: 28px;
        }

        .auth-oauth-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          padding: 13px 20px;
          border-radius: var(--radius-md);
          font-family: var(--font-primary);
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition:
            background var(--transition-fast),
            border-color var(--transition-fast),
            box-shadow var(--transition-fast),
            transform var(--transition-fast);
          position: relative;
          overflow: hidden;
          letter-spacing: 0.1px;
        }

        .auth-oauth-btn:active { transform: scale(0.98); }

        .auth-google {
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          color: var(--color-primary);
          box-shadow: var(--shadow-sm);
        }

        .auth-google:hover {
          border-color: #4285F4;
          box-shadow: 0 4px 16px rgba(66,133,244,0.15);
          transform: translateY(-1px);
        }

        .auth-apple {
          background: #000;
          border: 1.5px solid #000;
          color: #fff;
          box-shadow: var(--shadow-sm);
        }

        .auth-apple:hover {
          background: #1a1a1a;
          box-shadow: 0 4px 16px rgba(0,0,0,0.22);
          transform: translateY(-1px);
        }

        .auth-oauth-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
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

        .auth-footer {
          font-size: 13px;
          color: var(--color-text-secondary);
          text-align: center;
          line-height: 1.6;
        }

        .auth-footer a {
          color: var(--color-accent);
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          transition: color var(--transition-fast);
        }

        .auth-footer a:hover { color: var(--color-accent-hover); }

        .auth-terms {
          font-size: 12px;
          color: var(--color-text-secondary);
          text-align: center;
          margin-top: 20px;
          line-height: 1.6;
          padding: 0 8px;
        }

        .auth-terms a {
          color: var(--color-text-secondary);
          text-decoration: underline;
          cursor: pointer;
          transition: color var(--transition-fast);
        }

        .auth-terms a:hover { color: var(--color-accent); }

        .auth-card-stripe {
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, var(--color-accent), var(--color-accent-light));
          border-radius: var(--radius-xl) var(--radius-xl) 0 0;
          margin-bottom: -4px;
        }

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
            <h1 className="auth-heading">Create your account</h1>
            <p className="auth-subheading">
              Join thousands using <span>ZimServ</span> to find trusted
              professionals
            </p>

            {/* OAuth Buttons */}
            <div className="auth-btn-group">
              <button
                className="auth-oauth-btn auth-google"
                onClick={handleGoogleSignUp}
              >
                <svg className="auth-oauth-icon" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign up with Google
              </button>

              <button
                className="auth-oauth-btn auth-apple"
                onClick={handleAppleSignUp}
              >
                <svg
                  className="auth-oauth-icon"
                  viewBox="0 0 24 24"
                  fill="#fff"
                >
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.42.07 2.4.83 3.22.84.92 0 2.65-.84 4.49-.72 1.27.09 4.04.7 4.04 3.58-.07.01-2.41 1.4-2.38 4.17.03 3.28 2.88 4.37 2.88 4.37-.28.79-.67 1.59-1.26 2.26-.71.84-1.44 1.66-2.49 1.38zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Sign up with Apple
              </button>
            </div>

            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">
                Already have an account?
              </span>
              <div className="auth-divider-line" />
            </div>

            <p className="auth-footer">
              Already a member?{" "}
              <a onClick={() => navigate("/signin")}>Sign in instead</a>
            </p>

            <p className="auth-terms">
              By creating an account, you agree to our{" "}
              <a onClick={() => navigate("/terms")}>Terms of Service</a> and{" "}
              <a onClick={() => navigate("/privacy")}>Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
