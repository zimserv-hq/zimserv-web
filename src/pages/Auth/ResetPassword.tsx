// src/pages/Auth/ResetPassword.tsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [email, setEmail] = useState("");
  const [codeValid, setCodeValid] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const navigate = useNavigate();
  const { verifyResetCode, confirmPasswordReset } = useAuth();
  const { showSuccess, showError } = useToast();

  const oobCode = searchParams.get("oobCode");

  // Verify the reset code on mount
  useEffect(() => {
    const verifyCode = async () => {
      if (!oobCode) {
        showError("Invalid Link", "Password reset link is missing or invalid.");
        setIsVerifying(false);
        setCodeValid(false);
        return;
      }

      try {
        const userEmail = await verifyResetCode(oobCode);
        setEmail(userEmail);
        setCodeValid(true);
      } catch (error: any) {
        console.error("Code verification error:", error);
        let errorMessage = "Invalid or expired reset link";

        if (error.code === "auth/expired-action-code") {
          errorMessage =
            "This reset link has expired. Please request a new one.";
        } else if (error.code === "auth/invalid-action-code") {
          errorMessage =
            "This reset link is invalid. Please request a new one.";
        }

        showError("Invalid Link", errorMessage);
        setCodeValid(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyCode();
  }, [oobCode, verifyResetCode, showError]);

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({ password: "", confirmPassword: "" });

    const newErrors = { password: "", confirmPassword: "" };
    let hasError = false;

    const passwordError = validatePassword(password);
    if (passwordError) {
      newErrors.password = passwordError;
      hasError = true;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      hasError = true;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    if (!oobCode) {
      showError("Error", "Reset code is missing");
      return;
    }

    setIsLoading(true);
    try {
      await confirmPasswordReset(oobCode, password);
      setResetSuccess(true);
      showSuccess(
        "Password Reset Successful!",
        "You can now login with your new password.",
      );

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      console.error("Password reset error:", error);

      let errorMessage = "Failed to reset password";

      if (error.code === "auth/expired-action-code") {
        errorMessage = "This reset link has expired. Please request a new one.";
      } else if (error.code === "auth/invalid-action-code") {
        errorMessage = "This reset link is invalid. Please request a new one.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please use a stronger password.";
        newErrors.password = errorMessage;
      }

      setErrors(newErrors);
      showError("Reset Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="loading-state">
            <div className="loading-spinner-large"></div>
            <p>Verifying reset link...</p>
          </div>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  if (!codeValid) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="error-state">
            <AlertCircle size={64} className="error-icon" />
            <h1 className="error-title">Invalid Reset Link</h1>
            <p className="error-description">
              This password reset link is invalid or has expired. Please request
              a new one.
            </p>
            <button
              className="submit-btn"
              onClick={() => navigate("/forgot-password")}
            >
              Request New Link
            </button>
          </div>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="success-state">
            <CheckCircle size={64} className="success-icon" />
            <h1 className="success-title">Password Reset Successful!</h1>
            <p className="success-description">
              Your password has been reset. Redirecting to login...
            </p>
          </div>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="icon-wrapper">
            <Lock size={40} />
          </div>

          <h1 className="title">Reset Your Password</h1>
          <p className="description">
            Enter a new password for <strong>{email}</strong>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <Lock size={16} />
                New Password
              </label>
              <div className="input-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className={`form-input ${errors.password ? "error" : ""}`}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="new-password"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <span className="form-error">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                <Lock size={16} />
                Confirm Password
              </label>
              <div className="input-wrapper">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className={`form-input ${errors.confirmPassword ? "error" : ""}`}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="form-error">{errors.confirmPassword}</span>
              )}
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="loading-spinner" />
                  <span>Resetting Password...</span>
                </>
              ) : (
                <>
                  <Lock size={20} />
                  <span>Reset Password</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

const styles = `
  .reset-password-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #ecfbfdff 0%, #ffffff 100%);
    padding: 24px;
  }

  .reset-password-card {
    background: var(--white);
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    max-width: 480px;
    width: 100%;
    padding: 48px 40px;
  }

  .icon-wrapper {
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

  .title {
    font-size: 32px;
    font-weight: 700;
    color: var(--neutral-dark);
    text-align: center;
    margin-bottom: 12px;
  }

  .description {
    font-size: 15px;
    color: var(--neutral-medium);
    text-align: center;
    margin-bottom: 32px;
    line-height: 1.6;
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

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .form-input {
    width: 100%;
    padding: 16px 50px 16px 18px;
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

  .password-toggle {
    position: absolute;
    right: 14px;
    background: none;
    border: none;
    color: var(--neutral-medium);
    cursor: pointer;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
  }

  .password-toggle:hover {
    color: var(--primary-pink);
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
  }

  .submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(233, 30, 140, 0.35);
  }

  .submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .loading-spinner {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: var(--white);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .loading-spinner-large {
    width: 48px;
    height: 48px;
    border: 4px solid var(--neutral-light);
    border-top-color: var(--primary-pink);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 20px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .loading-state, .error-state, .success-state {
    text-align: center;
    padding: 40px 20px;
  }

  .error-icon {
    color: #ff4757;
    margin-bottom: 20px;
  }

  .success-icon {
    color: #16a34a;
    margin-bottom: 20px;
  }

  .error-title, .success-title {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 12px;
    color: var(--neutral-dark);
  }

  .error-description, .success-description {
    font-size: 15px;
    color: var(--neutral-medium);
    line-height: 1.6;
    margin-bottom: 32px;
  }

  @media (max-width: 480px) {
    .reset-password-card {
      padding: 40px 24px;
    }

    .title {
      font-size: 28px;
    }
  }
`;

export default ResetPassword;
