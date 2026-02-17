// src/pages/Auth/ForgotPassword.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({ email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const { showSuccess, showError } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({ email: "" });

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setErrors({ email: "Email is required" });
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setErrors({ email: "Please enter a valid email" });
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(trimmedEmail);
      setEmailSent(true);
      showSuccess(
        "Email Sent!",
        "Check your inbox for password reset instructions.",
      );
    } catch (error: any) {
      console.error("Password reset error:", error);

      let errorMessage = "Failed to send reset email";

      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please try again later";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrors({ email: errorMessage });
      showError("Reset Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .forgot-password-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #ecfbfdff 0%, #ffffff 100%);
          padding: 24px;
        }

        .forgot-password-card {
          background: var(--white);
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          max-width: 480px;
          width: 100%;
          padding: 48px 40px;
          position: relative;
        }

        .back-btn {
          position: absolute;
          top: 24px;
          left: 24px;
          background: var(--neutral-light);
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--neutral-dark);
          transition: var(--transition);
        }

        .back-btn:hover {
          background: var(--primary-pink);
          color: var(--white);
        }

        .forgot-icon-wrapper {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-gold));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: var(--white);
        }

        .forgot-title {
          font-size: 32px;
          font-weight: 700;
          color: var(--neutral-dark);
          text-align: center;
          margin-bottom: 12px;
        }

        .forgot-description {
          font-size: 15px;
          color: var(--neutral-medium);
          text-align: center;
          margin-bottom: 32px;
          line-height: 1.6;
        }

        .success-message {
          background: #f0fdf4;
          border: 2px solid #86efac;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .success-icon {
          color: #16a34a;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .success-content {
          flex: 1;
        }

        .success-title {
          font-size: 16px;
          font-weight: 700;
          color: #16a34a;
          margin-bottom: 6px;
        }

        .success-text {
          font-size: 14px;
          color: #15803d;
          line-height: 1.5;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--neutral-dark);
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .form-label svg {
          color: var(--primary-pink);
        }

        .form-input {
          width: 100%;
          padding: 16px 18px;
          border: 2px solid var(--neutral-light);
          border-radius: 12px;
          font-size: 15px;
          color: var(--neutral-dark);
          background: #ecfbfdff;
          transition: var(--transition);
          outline: none;
        }

        .form-input:focus {
          border-color: var(--primary-pink);
          background: var(--white);
          box-shadow: 0 0 0 4px rgba(233, 30, 140, 0.1);
        }

        .form-input.error {
          border-color: #ff4757;
          background: #fff5f5;
        }

        .form-error {
          font-size: 13px;
          color: #ff4757;
          margin-top: 8px;
          display: block;
        }

        .submit-btn {
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-gold));
          color: var(--white);
          border: none;
          padding: 18px;
          border-radius: 12px;
          font-size: 17px;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          margin-bottom: 20px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(233, 30, 140, 0.35);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .back-to-login {
          text-align: center;
          font-size: 15px;
          color: var(--neutral-dark);
        }

        .back-to-login a {
          color: var(--primary-pink);
          font-weight: 700;
          text-decoration: none;
          transition: var(--transition);
        }

        .back-to-login a:hover {
          color: var(--primary-gold);
          text-decoration: underline;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: var(--white);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 480px) {
          .forgot-password-card {
            padding: 40px 24px;
          }

          .forgot-title {
            font-size: 28px;
          }

          .forgot-description {
            font-size: 14px;
          }
        }
      `}</style>

      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <button
            className="back-btn"
            onClick={() => navigate("/login")}
            aria-label="Back to login"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="forgot-icon-wrapper">
            <Mail size={40} />
          </div>

          <h1 className="forgot-title">Forgot Password?</h1>
          <p className="forgot-description">
            {emailSent
              ? "We've sent a password reset link to your email address."
              : "Enter your email address and we'll send you a link to reset your password."}
          </p>

          {emailSent && (
            <div className="success-message">
              <CheckCircle size={24} className="success-icon" />
              <div className="success-content">
                <div className="success-title">Email Sent Successfully!</div>
                <div className="success-text">
                  Check your inbox and click the reset link. Don't forget to
                  check your spam folder.
                </div>
              </div>
            </div>
          )}

          {!emailSent && (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <Mail size={16} />
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`form-input ${errors.email ? "error" : ""}`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  autoComplete="email"
                  required
                  autoFocus
                />
                {errors.email && (
                  <span className="form-error">{errors.email}</span>
                )}
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="loading-spinner" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Mail size={20} />
                    <span>Send Reset Link</span>
                  </>
                )}
              </button>
            </form>
          )}

          <p className="back-to-login">
            Remember your password?
            <Link to="/login">Back to Login</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
