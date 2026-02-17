// src/pages/Auth/VerifyEmail.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Mail, RefreshCw } from "lucide-react";
import { auth } from "../../config/firebase.config";
import { sendEmailVerification } from "firebase/auth";
import { useToast } from "../../contexts/ToastContext";

const VerifyEmail = () => {
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError } = useToast();

  const email = location.state?.email || "your email";

  useEffect(() => {
    // Countdown timer for resend button
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleResendEmail = async () => {
    // Note: User must be signed in to resend
    // You might need to adjust this based on your flow
    setResending(true);
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser, {
          url: `${window.location.origin}/dashboard`,
          handleCodeInApp: true,
        });
        showSuccess(
          "Email Sent!",
          "Verification email has been resent. Please check your inbox.",
        );
        setCountdown(60);
        setCanResend(false);
      } else {
        showError("Error", "Please log in to resend verification email.");
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Resend error:", error);
      if (error.code === "auth/too-many-requests") {
        showError(
          "Too Many Attempts",
          "Please wait a few minutes before trying again.",
        );
      } else {
        showError(
          "Failed to Send",
          "Could not resend verification email. Please try again later.",
        );
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <style>{`
        .verify-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(233, 30, 140, 0.05) 0%, rgba(247, 181, 0, 0.05) 100%);
          padding: 24px;
        }

        .verify-card {
          background: var(--white);
          border-radius: 24px;
          padding: 48px;
          max-width: 560px;
          width: 100%;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
          text-align: center;
        }

        .verify-icon {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-gold));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: var(--white);
        }

        .verify-title {
          font-size: 32px;
          font-weight: 700;
          color: var(--neutral-dark);
          margin-bottom: 12px;
        }

        .verify-email {
          font-size: 16px;
          color: var(--primary-pink);
          font-weight: 600;
          margin-bottom: 24px;
        }

        .verify-message {
          font-size: 16px;
          color: var(--neutral-medium);
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .verify-steps {
          background: var(--neutral-light);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 32px;
          text-align: left;
        }

        .verify-step {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
        }

        .verify-step:last-child {
          margin-bottom: 0;
        }

        .step-number {
          width: 28px;
          height: 28px;
          background: var(--primary-pink);
          color: var(--white);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          flex-shrink: 0;
        }

        .step-text {
          flex: 1;
          font-size: 15px;
          color: var(--neutral-dark);
          line-height: 1.5;
          padding-top: 4px;
        }

        .verify-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .resend-btn {
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-gold));
          color: var(--white);
          border: none;
          padding: 16px 24px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .resend-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(233, 30, 140, 0.3);
        }

        .resend-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .login-btn {
          background: var(--white);
          color: var(--primary-pink);
          border: 2px solid var(--primary-pink);
          padding: 16px 24px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }

        .login-btn:hover {
          background: var(--primary-pink);
          color: var(--white);
        }

        .help-text {
          font-size: 14px;
          color: var(--neutral-medium);
          margin-top: 24px;
        }

        .help-link {
          color: var(--primary-pink);
          font-weight: 600;
          text-decoration: none;
        }

        .help-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          .verify-card {
            padding: 32px 24px;
          }

          .verify-title {
            font-size: 28px;
          }

          .verify-icon {
            width: 80px;
            height: 80px;
          }
        }
      `}</style>

      <div className="verify-container">
        <div className="verify-card">
          <div className="verify-icon">
            <Mail size={48} />
          </div>

          <h1 className="verify-title">Verify Your Email</h1>
          <p className="verify-email">{email}</p>
          <p className="verify-message">
            We've sent a verification link to your email address. Please check
            your inbox (and spam folder) to activate your account.
          </p>

          <div className="verify-steps">
            <div className="verify-step">
              <div className="step-number">1</div>
              <div className="step-text">
                Check your email inbox for a message from Seach Printing
              </div>
            </div>
            <div className="verify-step">
              <div className="step-number">2</div>
              <div className="step-text">
                Click the verification link in the email
              </div>
            </div>
            <div className="verify-step">
              <div className="step-number">3</div>
              <div className="step-text">
                Return to this page and log in to your account
              </div>
            </div>
          </div>

          <div className="verify-actions">
            <button
              onClick={handleResendEmail}
              disabled={!canResend || resending}
              className="resend-btn"
            >
              {resending ? (
                <>
                  <RefreshCw size={20} className="spinning" />
                  Sending...
                </>
              ) : canResend ? (
                <>
                  <RefreshCw size={20} />
                  Resend Verification Email
                </>
              ) : (
                <>
                  <RefreshCw size={20} />
                  Resend in {countdown}s
                </>
              )}
            </button>

            <Link to="/login">
              <button className="login-btn">Go to Login</button>
            </Link>
          </div>

          <p className="help-text">
            Didn't receive the email? Check your spam folder or{" "}
            <a href="/contact" className="help-link">
              contact support
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
