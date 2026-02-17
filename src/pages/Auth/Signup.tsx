// src/pages/Auth/Signup.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  UserPlus,
  ShoppingBag,
  Truck,
  Shield,
  Tag,
  User as UserIcon,
  Phone,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { signup } = useAuth();
  const { showSuccess, showError } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    // South African phone validation: +27 followed by 9 digits [web:20]
    const phoneRegex = /^\+27[0-9]{9}$/;
    return phoneRegex.test(phone);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    const newErrors = {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: "",
    };
    let hasError = false;

    // Validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      hasError = true;
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
      hasError = true;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      hasError = true;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
      hasError = true;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      hasError = true;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid South African phone number";
      hasError = true;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      hasError = true;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      hasError = true;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must include uppercase, lowercase, and number";
      hasError = true;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      hasError = true;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      hasError = true;
    }

    if (!acceptTerms) {
      newErrors.terms = "You must accept the terms and conditions";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    // Submit signup with Firebase and email verification
    setIsLoading(true);
    try {
      const result = await signup(
        formData.email.trim(),
        formData.password,
        formData.fullName.trim(),
        formData.phone, // Already includes +27
      );

      // Check if email verification is required
      if (result?.requiresVerification) {
        showSuccess(
          "Account Created Successfully! 🎉",
          `A verification email has been sent to ${formData.email}. Please check your inbox and verify your email before logging in.`,
        );

        // Redirect to verification page
        navigate("/verify-email", {
          state: { email: formData.email },
        });
      } else {
        // Fallback (shouldn't happen with current implementation)
        showSuccess(
          "Account Created!",
          "Welcome to Seach Printing. Please check your email.",
        );
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Signup error:", error);

      // Handle specific Firebase errors
      let errorMessage = "Failed to create account. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage =
          "This email is already registered. Please login instead.";
        newErrors.email = errorMessage;
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak";
        newErrors.password = errorMessage;
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
        newErrors.email = errorMessage;
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage = "Email/password accounts are not enabled";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrors(newErrors);
      showError("Signup Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .signup-container {
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
        .signup-form-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--white);
          overflow-y: auto;
          overflow-x: hidden;
        }

        .signup-form-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 60px 60px;
        }

        .signup-form-content {
          max-width: 520px;
          width: 100%;
        }

        .signup-title {
          font-size: 40px;
          font-weight: 700;
          color: var(--neutral-dark);
          margin-bottom: 8px;
          text-align: center;
        }

        .signup-subtitle {
          font-size: 16px;
          color: var(--neutral-medium);
          margin-bottom: 36px;
          text-align: center;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
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
          padding: 15px 18px;
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

        .password-strength {
          display: flex;
          gap: 4px;
          margin-top: -4px;
        }

        .strength-bar {
          flex: 1;
          height: 4px;
          background: var(--neutral-light);
          border-radius: 2px;
          transition: var(--transition);
        }

        .strength-bar.active {
          background: var(--primary-pink);
        }

        .strength-bar.medium {
          background: #ffa502;
        }

        .strength-bar.strong {
          background: #26de81;
        }

        .terms-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-top: 4px;
        }

        .terms-checkbox input[type="checkbox"] {
          width: 20px;
          height: 20px;
          margin-top: 2px;
          cursor: pointer;
          accent-color: var(--primary-pink);
          flex-shrink: 0;
        }

        .terms-text {
          font-size: 14px;
          color: var(--neutral-dark);
          line-height: 1.5;
        }

        .terms-link {
          color: var(--primary-pink);
          font-weight: 600;
          text-decoration: none;
          transition: var(--transition);
        }

        .terms-link:hover {
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

        .login-link {
          text-align: center;
          margin-top: 32px;
          font-size: 15px;
          color: var(--neutral-dark);
        }

        .login-link a {
          color: var(--primary-pink);
          font-weight: 700;
          text-decoration: none;
          margin-left: 6px;
          transition: var(--transition);
        }

        .login-link a:hover {
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
          to {
            transform: rotate(360deg);
          }
        }

        /* RIGHT SIDE - PROMOTIONAL (Fixed, with background image) */
        .signup-promo-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 60px 50px;
          color: var(--white);
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          max-height: 120vh;
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
          margin-top: -80px;
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
          .signup-form-wrapper {
            padding: 70px 40px 50px;
          }

          .signup-promo-section {
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
          .signup-form-wrapper {
            padding: 70px 32px 50px;
          }

          .signup-title {
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
          .signup-container {
            flex-direction: column;
          }

          .signup-promo-section {
            display: none;
          }

          .close-btn {
            top: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
          }

          .signup-form-wrapper {
            padding: 80px 24px 40px;
            min-height: 100vh;
          }

          .signup-form-content {
            max-width: 100%;
          }

          .signup-title {
            font-size: 32px;
          }

          .signup-subtitle {
            font-size: 15px;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        @media (max-width: 480px) {
          .signup-form-wrapper {
            padding: 70px 20px 32px;
          }

          .signup-title {
            font-size: 28px;
          }

          .signup-subtitle {
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
        .signup-form-section::-webkit-scrollbar {
          width: 8px;
        }

        .signup-form-section::-webkit-scrollbar-track {
          background: var(--neutral-light);
        }

        .signup-form-section::-webkit-scrollbar-thumb {
          background: var(--primary-pink);
          border-radius: 4px;
        }

        .signup-form-section::-webkit-scrollbar-thumb:hover {
          background: var(--primary-gold);
        }
      `}</style>

      <div className="signup-container">
        <button
          className="close-btn"
          onClick={() => navigate("/")}
          aria-label="Close and return home"
        >
          ×
        </button>

        <div className="signup-form-section">
          <div className="signup-form-wrapper">
            <div className="signup-form-content">
              <h1 className="signup-title">Create Account</h1>
              <p className="signup-subtitle">
                Join us and start your custom printing journey
              </p>

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="fullName" className="form-label">
                    <UserIcon size={16} />
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    className={`form-input ${errors.fullName ? "error" : ""}`}
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  {errors.fullName && (
                    <span className="form-error">{errors.fullName}</span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      <Mail size={16} />
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={`form-input ${errors.email ? "error" : ""}`}
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <span className="form-error">{errors.email}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      <Phone size={16} />
                      Phone
                    </label>
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: "18px",
                          color: "#666",
                          fontSize: "15px",
                          pointerEvents: "none",
                          zIndex: 1,
                        }}
                      >
                        +27
                      </span>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        className={`form-input ${errors.phone ? "error" : ""}`}
                        placeholder=""
                        value={formData.phone.replace(/^\+27/, "")}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setFormData((prev) => ({
                            ...prev,
                            phone: "+27" + value,
                          }));
                        }}
                        style={{ paddingLeft: "50px" }}
                        disabled={isLoading}
                        maxLength={9}
                      />
                    </div>
                    {errors.phone && (
                      <span className="form-error">{errors.phone}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    <Lock size={16} />
                    Password
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className={`form-input ${errors.password ? "error" : ""}`}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
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
                  {!errors.password && formData.password && (
                    <div className="password-strength">
                      <div
                        className={`strength-bar ${
                          formData.password.length >= 8 ? "active" : ""
                        }`}
                      ></div>
                      <div
                        className={`strength-bar ${
                          /(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)
                            ? "active medium"
                            : ""
                        }`}
                      ></div>
                      <div
                        className={`strength-bar ${
                          /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(
                            formData.password,
                          )
                            ? "active strong"
                            : ""
                        }`}
                      ></div>
                    </div>
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
                      className={`form-input ${
                        errors.confirmPassword ? "error" : ""
                      }`}
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
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

                <div className="form-group">
                  <div className="terms-checkbox">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      disabled={isLoading}
                    />
                    <label htmlFor="terms" className="terms-text">
                      I agree to the{" "}
                      <a
                        href="/legal/Terms-and-Conditions.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="terms-link"
                      >
                        Terms & Conditions
                      </a>{" "}
                      and{" "}
                      <a
                        href="/legal/Privacy-Policy.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="terms-link"
                      >
                        Privacy Policy
                      </a>{" "}
                    </label>
                  </div>
                  {errors.terms && (
                    <span className="form-error">{errors.terms}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} />
                      <span>Create Account</span>
                    </>
                  )}
                </button>
              </form>

              <p className="login-link">
                Already have an account?
                <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>

        <div className="signup-promo-section">
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

export default Signup;
