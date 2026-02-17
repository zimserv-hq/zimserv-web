// src/pages/Auth/Login.tsx
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  LogIn,
  ShoppingBag,
  Truck,
  Shield,
  Tag,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();

  // ✅ Get redirect info from location state
  const from = (location.state as any)?.from || "/";
  const redirectMessage = (location.state as any)?.message;

  // ✅ Show message if redirected from cart, uniform page, or another page
  useEffect(() => {
    if (redirectMessage) {
      showError("Login Required", redirectMessage);
    }
  }, [redirectMessage, showError]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({ email: "", password: "" });

    let hasError = false;
    const newErrors = { email: "", password: "" };

    // Trim email to prevent whitespace issues
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      newErrors.email = "Email is required";
      hasError = true;
    } else if (!validateEmail(trimmedEmail)) {
      newErrors.email = "Please enter a valid email";
      hasError = true;
    }

    if (!trimmedPassword) {
      newErrors.password = "Password is required";
      hasError = true;
    } else if (trimmedPassword.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Use trimmed values for login
      await login(trimmedEmail, trimmedPassword);

      showSuccess("Welcome Back!", "You have successfully logged in.");

      // ✅ Redirect to the page user came from (or home if no redirect)
      console.log("🔄 Redirecting to:", from);
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Login error:", error);

      let errorMessage = "Invalid email or password";

      // ✅ Handle email not verified error
      if (error.code === "auth/email-not-verified") {
        errorMessage =
          error.message || "Please verify your email before logging in.";
        showError("Email Not Verified", errorMessage);

        // Redirect to verification page with email
        navigate("/verify-email", { state: { email: trimmedEmail } });
        setIsLoading(false);
        return;
      }

      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email";
        newErrors.email = errorMessage;
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password";
        newErrors.password = errorMessage;
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password";
        newErrors.password = errorMessage;
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later";
        newErrors.password = errorMessage;
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "This account has been disabled";
        newErrors.email = errorMessage;
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrors(newErrors);
      showError("Login Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        /* Your existing styles - keep them all */
        .login-container {
          min-height: 100vh;
          display: flex;
          background: var(--white);
          position: relative;
        }

        /* CLOSE BUTTON - Fixed at top-right */
        .close-btn {
          position: fixed;
          top: 24px;
          right: 24px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: var(--neutral-light);
          color: var(--neutral-dark);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
          font-size: 24px;
          font-weight: 300;
          z-index: 100;
        }

        .close-btn:hover {
          background: var(--primary-pink);
          color: var(--white);
          transform: rotate(90deg);
        }

        /* LEFT SIDE - FORM (Scrollable) */
        .login-form-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--white);
          overflow-y: auto;
          overflow-x: hidden;
        }

        .login-form-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 60px 60px;
        }

        .login-form-content {
          max-width: 480px;
          width: 100%;
        }

        .login-title {
          font-size: 40px;
          font-weight: 700;
          color: var(--neutral-dark);
          margin-bottom: 8px;
          text-align: center;
        }

        .login-subtitle {
          font-size: 16px;
          color: var(--neutral-medium);
          margin-bottom: 40px;
          text-align: center;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .form-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--neutral-dark);
          display: flex;
          align-items: center;
          gap: 8px;
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
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: -4px;
        }

        .form-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: -4px;
        }

        .remember-me {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: var(--neutral-dark);
          cursor: pointer;
          user-select: none;
        }

        .remember-me input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
          accent-color: var(--primary-pink);
        }

        .forgot-password {
          font-size: 14px;
          color: var(--primary-pink);
          text-decoration: none;
          font-weight: 600;
          transition: var(--transition);
        }

        .forgot-password:hover {
          color: var(--primary-gold);
          text-decoration: underline;
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
          margin-top: 12px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(233, 30, 140, 0.35);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .signup-link {
          text-align: center;
          margin-top: 36px;
          font-size: 15px;
          color: var(--neutral-dark);
        }

        .signup-link a {
          color: var(--primary-pink);
          font-weight: 700;
          text-decoration: none;
          margin-left: 6px;
          transition: var(--transition);
        }

        .signup-link a:hover {
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

        /* RIGHT SIDE - PROMOTIONAL (Fixed, with background image) */
        .login-promo-section {
          flex: 1;
          background: linear-gradient(135deg, rgba(233, 30, 140, 0.50) 0%, rgba(247, 181, 0, 0.45) 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 60px 50px;
          color: var(--white);
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          max-height: 115vh;
        }

        /* Background Image */
        .promo-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url('/assets/vid.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 0;
        }

        /* Gradient overlay on background */
        .promo-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(233, 30, 140, 0.65) 0%, rgba(247, 181, 0, 0.60) 100%);
          z-index: 1;
        }

        .promo-pattern {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.08;
          background-image: 
            radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.4) 0%, transparent 50%);
          z-index: 2;
        }

        .promo-content {
          position: relative;
          z-index: 3;
          max-width: 500px;
          width: 100%;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: -90px;
        }

        .promo-icon {
          width: 110px;
          height: 110px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 28px;
          backdrop-filter: blur(10px);
          border: 3px solid rgba(255, 255, 255, 0.4);
          flex-shrink: 0;
        }

        .promo-icon svg {
          width: 56px;
          height: 56px;
        }

        .promo-title {
          font-size: 44px;
          font-weight: 800;
          margin-bottom: 16px;
          line-height: 1.1;
          letter-spacing: -0.5px;
          flex-shrink: 0;
        }

        .promo-description {
          font-size: 17px;
          opacity: 0.96;
          margin-bottom: 36px;
          line-height: 1.6;
          flex-shrink: 0;
        }

        .promo-features {
          display: flex;
          flex-direction: column;
          gap: 14px;
          width: 100%;
        }

        .promo-feature {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(255, 255, 255, 0.18);
          padding: 18px 20px;
          border-radius: 14px;
          backdrop-filter: blur(10px);
          transition: var(--transition);
          border: 1px solid rgba(255, 255, 255, 0.25);
        }

        .promo-feature:hover {
          background: rgba(255, 255, 255, 0.28);
          transform: translateX(8px);
          border-color: rgba(255, 255, 255, 0.45);
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          background: var(--white);
          color: var(--primary-pink);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .feature-text {
          text-align: left;
          flex: 1;
        }

        .feature-title {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 3px;
        }

        .feature-description {
          font-size: 13px;
          opacity: 0.92;
          line-height: 1.3;
        }

        /* RESPONSIVE */
        @media (max-width: 1200px) {
          .login-form-wrapper {
            padding: 70px 40px 50px;
          }

          .login-promo-section {
            padding: 50px 40px;
          }

          .promo-title {
            font-size: 38px;
          }

          .promo-description {
            font-size: 16px;
          }

          .promo-icon {
            width: 100px;
            height: 100px;
          }

          .promo-icon svg {
            width: 50px;
            height: 50px;
          }
        }

        @media (max-width: 1024px) {
          .login-form-wrapper {
            padding: 70px 32px 50px;
          }

          .login-title {
            font-size: 36px;
          }

          .promo-title {
            font-size: 36px;
          }

          .promo-description {
            font-size: 15px;
            margin-bottom: 32px;
          }

          .feature-title {
            font-size: 15px;
          }

          .feature-description {
            font-size: 12px;
          }
        }

        @media (max-width: 768px) {
          .login-container {
            flex-direction: column;
          }

          .login-promo-section {
            display: none;
          }

          .close-btn {
            top: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
          }

          .login-form-wrapper {
            padding: 80px 24px 40px;
            min-height: 100vh;
          }

          .login-form-content {
            max-width: 100%;
          }

          .login-title {
            font-size: 32px;
          }

          .login-subtitle {
            font-size: 15px;
          }
        }

        @media (max-width: 480px) {
          .login-form-wrapper {
            padding: 70px 20px 32px;
          }

          .login-title {
            font-size: 28px;
          }

          .login-subtitle {
            font-size: 14px;
            margin-bottom: 32px;
          }

          .form-input {
            padding: 14px 16px;
            font-size: 14px;
          }

          .submit-btn {
            padding: 16px;
            font-size: 16px;
          }

          .close-btn {
            width: 38px;
            height: 38px;
            font-size: 22px;
          }
        }

        /* Custom scrollbar for left section */
        .login-form-section::-webkit-scrollbar {
          width: 8px;
        }

        .login-form-section::-webkit-scrollbar-track {
          background: var(--neutral-light);
        }

        .login-form-section::-webkit-scrollbar-thumb {
          background: var(--primary-pink);
          border-radius: 4px;
        }

        .login-form-section::-webkit-scrollbar-thumb:hover {
          background: var(--primary-gold);
        }
      `}</style>

      <div className="login-container">
        <button
          className="close-btn"
          onClick={() => navigate("/")}
          aria-label="Close and return home"
        >
          ×
        </button>

        <div className="login-form-section">
          <div className="login-form-wrapper">
            <div className="login-form-content">
              <h1 className="login-title">Welcome Back!</h1>
              <p className="login-subtitle">
                Sign in to continue your shopping experience
              </p>

              {/* ✅ Added autoComplete="on" to enable browser password manager */}
              <form
                className="auth-form"
                onSubmit={handleSubmit}
                autoComplete="on"
              >
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    <Mail size={16} />
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email" // ✅ Added name attribute (required for password manager)
                    type="email"
                    className={`form-input ${errors.email ? "error" : ""}`}
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    autoComplete="email"
                    required
                  />
                  {errors.email && (
                    <span className="form-error">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    <Lock size={16} />
                    Password
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="password"
                      name="password" // ✅ Added name attribute (required for password manager)
                      type={showPassword ? "text" : "password"}
                      className={`form-input ${errors.password ? "error" : ""}`}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="form-error">{errors.password}</span>
                  )}
                </div>

                <div className="form-actions">
                  <label className="remember-me">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember Me</span>
                  </label>
                  <Link to="/forgot-password" className="forgot-password">
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner" />
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={20} />
                      <span>Login</span>
                    </>
                  )}
                </button>
              </form>

              <p className="signup-link">
                Don't have an account?
                <Link to="/signup">Sign Up</Link>
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - PROMOTIONAL */}
        <div className="login-promo-section">
          <div className="promo-background"></div>
          <div className="promo-overlay"></div>
          <div className="promo-pattern"></div>

          <div className="promo-content">
            <div className="promo-icon">
              <ShoppingBag size={56} />
            </div>

            <h2 className="promo-title">Seach Printing</h2>
            <p className="promo-description">
              Your ultimate destination for custom printing and branded
              merchandise. Experience seamless shopping with exclusive deals.
            </p>

            <div className="promo-features">
              <div className="promo-feature">
                <div className="feature-icon">
                  <Truck size={24} />
                </div>
                <div className="feature-text">
                  <div className="feature-title">Fast & Free Delivery</div>
                  <div className="feature-description">
                    Get your orders delivered quickly
                  </div>
                </div>
              </div>

              <div className="promo-feature">
                <div className="feature-icon">
                  <Shield size={24} />
                </div>
                <div className="feature-text">
                  <div className="feature-title">Secure Payments</div>
                  <div className="feature-description">
                    100% safe and encrypted transactions
                  </div>
                </div>
              </div>

              <div className="promo-feature">
                <div className="feature-icon">
                  <Tag size={24} />
                </div>
                <div className="feature-text">
                  <div className="feature-title">Exclusive Deals Daily</div>
                  <div className="feature-description">
                    Special offers just for you
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
