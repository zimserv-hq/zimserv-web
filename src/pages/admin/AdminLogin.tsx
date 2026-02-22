// src/pages/admin/AdminLogin.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, Shield, Zap, BarChart3 } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useToast } from "../../contexts/ToastContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        throw signInError;
      }

      const userRole = data.user?.app_metadata?.role;
      const isAdmin = userRole === "admin" || userRole === "super_admin";

      if (!isAdmin) {
        await supabase.auth.signOut();
        setError("Access denied. Admin privileges required.");
        setIsLoading(false);
        return;
      }

      if (userRole === "super_admin") {
        showSuccess("Welcome Back", "Logged in as Super Administrator");
      } else {
        showSuccess("Welcome Back", "Logged in as Administrator");
      }

      navigate("/admin/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .admin-login-page {
          min-height: 100vh;
          display: flex;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%);
          position: relative;
          overflow: hidden;
        }

        /* Enhanced Animated Background */
        .login-bg {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 15% 20%, rgba(255, 107, 53, 0.12) 0%, transparent 45%),
            radial-gradient(circle at 85% 80%, rgba(255, 107, 53, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 60%);
          animation: bgPulse 25s ease-in-out infinite;
        }

        @keyframes bgPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.05); }
        }

        /* Enhanced Grid Pattern */
        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.025) 1.5px, transparent 1.5px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1.5px, transparent 1.5px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse 90% 60% at 50% 50%, black 30%, transparent 100%);
        }

        /* Floating Orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.4;
          animation: float 20s ease-in-out infinite;
        }

        .orb-1 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(255, 107, 53, 0.3), transparent);
          top: -100px;
          left: -100px;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.25), transparent);
          bottom: -80px;
          right: -80px;
          animation-delay: 10s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        /* Left Panel - Enhanced Branding */
        .login-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 70px;
          position: relative;
          z-index: 1;
        }

        .brand-section {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .brand-logo-wrapper {
          display: flex;
          align-items: center;
          gap: 18px;
          animation: fadeInUp 0.8s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .brand-logo {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #FF6B35 0%, #E85A28 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            0 10px 30px rgba(255, 107, 53, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.15) inset,
            0 20px 40px rgba(0, 0, 0, 0.2);
          position: relative;
          transition: transform 0.3s ease;
        }

        .brand-logo:hover {
          transform: translateY(-4px);
        }

        .brand-logo::before {
          content: '';
          position: absolute;
          inset: -3px;
          background: linear-gradient(135deg, #FF6B35, #E85A28);
          border-radius: 18px;
          z-index: -1;
          opacity: 0.5;
          filter: blur(16px);
        }

        .brand-logo-text {
          font-size: 32px;
          font-weight: 900;
          color: #fff;
          letter-spacing: -1px;
        }

        .brand-name {
          display: flex;
          align-items: baseline;
          gap: 3px;
          font-size: 36px;
          font-weight: 900;
          letter-spacing: -1.5px;
        }

        .brand-name-zim {
          color: #fff;
        }

        .brand-name-serv {
          color: #FF6B35;
        }

        .brand-tagline {
          font-size: 17px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
          letter-spacing: -0.3px;
          margin-top: -6px;
        }

        /* Enhanced Feature Cards */
        .feature-cards {
          display: flex;
          flex-direction: column;
          gap: 18px;
          margin-top: 20px;
        }

        .feature-card {
          padding: 28px;
          background: rgba(255, 255, 255, 0.04);
          border: 1.5px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          backdrop-filter: blur(20px);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: default;
          animation: fadeInUp 0.8s ease-out;
          animation-fill-mode: both;
        }

        .feature-card:nth-child(1) { animation-delay: 0.1s; }
        .feature-card:nth-child(2) { animation-delay: 0.2s; }
        .feature-card:nth-child(3) { animation-delay: 0.3s; }

        .feature-card:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 107, 53, 0.4);
          transform: translateX(8px) translateY(-2px);
          box-shadow: 
            0 10px 30px rgba(0, 0, 0, 0.2),
            0 0 0 1px rgba(255, 107, 53, 0.1) inset;
        }

        .feature-icon {
          width: 52px;
          height: 52px;
          background: rgba(255, 107, 53, 0.12);
          border: 1.5px solid rgba(255, 107, 53, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FF6B35;
          margin-bottom: 18px;
          transition: all 0.3s ease;
        }

        .feature-card:hover .feature-icon {
          background: rgba(255, 107, 53, 0.2);
          border-color: rgba(255, 107, 53, 0.4);
          transform: scale(1.05);
        }

        .feature-title {
          font-size: 17px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 8px;
          letter-spacing: -0.3px;
        }

        .feature-desc {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.55);
          line-height: 1.6;
        }

        .login-footer-left {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.4);
          animation: fadeInUp 0.8s ease-out 0.4s;
          animation-fill-mode: both;
        }

        /* Right Panel - Enhanced Form */
        .login-right {
          width: 560px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 70px;
          background: rgba(255, 255, 255, 0.03);
          border-left: 1.5px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(30px);
          position: relative;
          z-index: 1;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          animation: fadeInUp 0.8s ease-out 0.2s;
          animation-fill-mode: both;
        }

        .login-header {
          margin-bottom: 44px;
        }

        .login-shield {
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, rgba(255, 107, 53, 0.15) 0%, rgba(255, 107, 53, 0.08) 100%);
          border: 2px solid rgba(255, 107, 53, 0.25);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FF6B35;
          margin-bottom: 28px;
          box-shadow: 0 8px 24px rgba(255, 107, 53, 0.15);
          transition: transform 0.3s ease;
        }

        .login-shield:hover {
          transform: translateY(-2px);
        }

        .login-title {
          font-size: 36px;
          font-weight: 900;
          color: #fff;
          letter-spacing: -1.2px;
          margin-bottom: 10px;
        }

        .login-subtitle {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.55);
          font-weight: 500;
          letter-spacing: -0.2px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 26px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .form-label {
          font-size: 14px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.95);
          letter-spacing: -0.2px;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.35);
          z-index: 1;
          pointer-events: none;
          transition: color 0.3s ease;
        }

        .input-wrapper:focus-within .input-icon {
          color: #FF6B35;
        }

        .password-toggle {
          position: absolute;
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .password-toggle:hover {
          color: #FF6B35;
          background: rgba(255, 107, 53, 0.12);
        }

        .form-input {
          width: 100%;
          padding: 17px 56px;
          border-radius: 14px;
          border: 2px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.06);
          color: #fff;
          font-size: 15px;
          font-weight: 500;
          outline: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-sizing: border-box;
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        .form-input:focus {
          border-color: #FF6B35;
          background: rgba(255, 255, 255, 0.09);
          box-shadow: 
            0 0 0 4px rgba(255, 107, 53, 0.12),
            0 10px 30px rgba(0, 0, 0, 0.25);
          transform: translateY(-1px);
        }

        .form-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .error-message {
          padding: 16px 18px;
          background: rgba(239, 68, 68, 0.12);
          border: 1.5px solid rgba(239, 68, 68, 0.35);
          border-radius: 12px;
          color: #FCA5A5;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          animation: errorShake 0.5s ease;
        }

        @keyframes errorShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        .error-icon {
          flex-shrink: 0;
          margin-top: 1px;
        }

        .submit-btn {
          padding: 18px 28px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          font-size: 16px;
          font-weight: 700;
          background: linear-gradient(135deg, #FF6B35 0%, #E85A28 100%);
          color: #fff;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 
            0 10px 30px rgba(255, 107, 53, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.15) inset;
          position: relative;
          overflow: hidden;
          margin-top: 10px;
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .submit-btn:hover:not(:disabled)::before {
          opacity: 1;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 
            0 15px 40px rgba(255, 107, 53, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.25) inset;
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(-1px);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .loading-spinner {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2.5px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 10px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .security-notice {
          margin-top: 36px;
          padding: 18px 20px;
          background: rgba(255, 255, 255, 0.04);
          border: 1.5px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.7;
        }

        .security-notice strong {
          color: rgba(255, 255, 255, 0.75);
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .login-left {
            padding: 56px;
          }

          .login-right {
            width: 500px;
            padding: 56px;
          }

          .feature-cards {
            margin-top: 40px;
          }
        }

        @media (max-width: 1024px) {
          .login-left {
            display: none;
          }

          .login-right {
            width: 100%;
            border-left: none;
          }
        }

        @media (max-width: 640px) {
          .login-right {
            padding: 40px 28px;
          }

          .login-title {
            font-size: 30px;
          }

          .login-shield {
            width: 64px;
            height: 64px;
          }

          .form-input {
            padding: 15px 50px;
          }
        }
      `}</style>

      <div className="admin-login-page">
        <div className="login-bg"></div>
        <div className="grid-overlay"></div>
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>

        {/* Left Panel - Branding */}
        <div className="login-left">
          <div className="brand-section">
            <div className="brand-logo-wrapper">
              <div className="brand-logo">
                <span className="brand-logo-text">Z</span>
              </div>
              <div>
                <div className="brand-name">
                  <span className="brand-name-zim">ZIM</span>
                  <span className="brand-name-serv">SERV</span>
                </div>
                <div className="brand-tagline">Admin Control Center</div>
              </div>
            </div>

            <div className="feature-cards">
              <div className="feature-card">
                <div className="feature-icon">
                  <Shield size={24} strokeWidth={2.5} />
                </div>
                <div className="feature-title">Secure Access</div>
                <div className="feature-desc">
                  Enterprise-grade authentication protecting your platform's
                  administrative functions
                </div>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <Zap size={24} strokeWidth={2.5} />
                </div>
                <div className="feature-title">Full Platform Control</div>
                <div className="feature-desc">
                  Manage providers, monitor transactions, and oversee all
                  marketplace operations
                </div>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <BarChart3 size={24} strokeWidth={2.5} />
                </div>
                <div className="feature-title">Real-Time Analytics</div>
                <div className="feature-desc">
                  Track platform performance, user activity, and business
                  metrics instantly
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="login-right">
          <div className="login-card">
            <div className="login-header">
              <div className="login-shield">
                <Shield size={36} strokeWidth={2} />
              </div>
              <h1 className="login-title">Administrator Login</h1>
              <p className="login-subtitle">
                Access the ZimServ administrative dashboard
              </p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              {error && (
                <div className="error-message">
                  <svg
                    className="error-icon"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" strokeWidth={2.5} />
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" strokeWidth={2.5} />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff size={18} strokeWidth={2.5} />
                    ) : (
                      <Eye size={18} strokeWidth={2.5} />
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Authenticating...
                  </>
                ) : (
                  "Sign In to Dashboard"
                )}
              </button>
            </form>

            <div className="security-notice">
              <strong>🔒 Secure Connection:</strong> This is a protected
              administrative area. All login attempts are monitored and logged
              for security purposes.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
