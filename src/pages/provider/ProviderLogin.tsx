// src/pages/provider/ProviderLogin.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Briefcase,
  Star,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useToast } from "../../contexts/ToastContext";

const ProviderLogin = () => {
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
        await supabase.auth.signInWithPassword({ email, password });

      if (signInError) throw signInError;

      const { data: providerData, error: providerError } = await supabase
        .from("providers")
        .select("id, full_name, status")
        .eq("email", data.user?.email)
        .single();

      if (providerError || !providerData) {
        await supabase.auth.signOut();
        setError(
          "No provider account found. Please apply to become a provider first.",
        );
        setIsLoading(false);
        return;
      }

      showSuccess("Welcome Back", `Signed in as ${providerData.full_name}`);
      navigate("/provider/dashboard");
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
        .provider-login-page {
          min-height: 100vh;
          display: flex;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%);
          position: relative;
          overflow: hidden;
        }

        /* Animated Background */
        .pv-login-bg {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 15% 20%, rgba(255, 107, 53, 0.12) 0%, transparent 45%),
            radial-gradient(circle at 85% 80%, rgba(255, 107, 53, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 60%);
          animation: pvBgPulse 25s ease-in-out infinite;
        }

        @keyframes pvBgPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.05); }
        }

        /* Grid Pattern */
        .pv-grid-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.025) 1.5px, transparent 1.5px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1.5px, transparent 1.5px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse 90% 60% at 50% 50%, black 30%, transparent 100%);
        }

        /* Floating Orbs */
        .pv-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.4;
          animation: pvFloat 20s ease-in-out infinite;
        }

        .pv-orb-1 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(255, 107, 53, 0.3), transparent);
          top: -100px;
          left: -100px;
          animation-delay: 0s;
        }

        .pv-orb-2 {
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.25), transparent);
          bottom: -80px;
          right: -80px;
          animation-delay: 10s;
        }

        @keyframes pvFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        /* Left Panel */
        .pv-login-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 70px;
          position: relative;
          z-index: 1;
        }

        .pv-brand-section {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .pv-brand-logo-wrapper {
          display: flex;
          align-items: center;
          gap: 18px;
          animation: pvFadeInUp 0.8s ease-out;
        }

        @keyframes pvFadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .pv-brand-logo {
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

        .pv-brand-logo:hover {
          transform: translateY(-4px);
        }

        .pv-brand-logo::before {
          content: '';
          position: absolute;
          inset: -3px;
          background: linear-gradient(135deg, #FF6B35, #E85A28);
          border-radius: 18px;
          z-index: -1;
          opacity: 0.5;
          filter: blur(16px);
        }

        .pv-brand-logo-text {
          font-size: 32px;
          font-weight: 900;
          color: #fff;
          letter-spacing: -1px;
        }

        .pv-brand-name {
          display: flex;
          align-items: baseline;
          gap: 3px;
          font-size: 36px;
          font-weight: 900;
          letter-spacing: -1.5px;
        }

        .pv-brand-name-zim {
          color: #fff;
        }

        .pv-brand-name-serv {
          color: #FF6B35;
        }

        .pv-brand-tagline {
          font-size: 17px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
          letter-spacing: -0.3px;
          margin-top: -6px;
        }

        /* Feature Cards */
        .pv-feature-cards {
          display: flex;
          flex-direction: column;
          gap: 18px;
          margin-top: 20px;
        }

        .pv-feature-card {
          padding: 28px;
          background: rgba(255, 255, 255, 0.04);
          border: 1.5px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          backdrop-filter: blur(20px);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: default;
          animation: pvFadeInUp 0.8s ease-out;
          animation-fill-mode: both;
        }

        .pv-feature-card:nth-child(1) { animation-delay: 0.1s; }
        .pv-feature-card:nth-child(2) { animation-delay: 0.2s; }
        .pv-feature-card:nth-child(3) { animation-delay: 0.3s; }

        .pv-feature-card:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 107, 53, 0.4);
          transform: translateX(8px) translateY(-2px);
          box-shadow: 
            0 10px 30px rgba(0, 0, 0, 0.2),
            0 0 0 1px rgba(255, 107, 53, 0.1) inset;
        }

        .pv-feature-icon {
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

        .pv-feature-card:hover .pv-feature-icon {
          background: rgba(255, 107, 53, 0.2);
          border-color: rgba(255, 107, 53, 0.4);
          transform: scale(1.05);
        }

        .pv-feature-title {
          font-size: 17px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 8px;
          letter-spacing: -0.3px;
        }

        .pv-feature-desc {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.55);
          line-height: 1.6;
        }

        .pv-login-footer-left {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 13px;
          color: rgba(255, 255, 255, 0.4);
          animation: pvFadeInUp 0.8s ease-out 0.4s;
          animation-fill-mode: both;
        }

        .pv-apply-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 16px;
          background: transparent;
          border: 1px solid rgba(255, 107, 53, 0.35);
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          color: #FF6B35;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: none;
        }

        .pv-apply-link:hover {
          background: rgba(255, 107, 53, 0.1);
          border-color: rgba(255, 107, 53, 0.55);
        }

        /* Right Panel */
        .pv-login-right {
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

        .pv-login-card {
          width: 100%;
          max-width: 420px;
          animation: pvFadeInUp 0.8s ease-out 0.2s;
          animation-fill-mode: both;
        }

        .pv-login-header {
          margin-bottom: 44px;
        }

        .pv-login-badge {
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

        .pv-login-badge:hover {
          transform: translateY(-2px);
        }

        .pv-login-title {
          font-size: 36px;
          font-weight: 900;
          color: #fff;
          letter-spacing: -1.2px;
          margin-bottom: 10px;
        }

        .pv-login-subtitle {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.55);
          font-weight: 500;
          letter-spacing: -0.2px;
        }

        .pv-login-form {
          display: flex;
          flex-direction: column;
          gap: 26px;
        }

        .pv-form-group {
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .pv-form-label {
          font-size: 14px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.95);
          letter-spacing: -0.2px;
        }

        .pv-input-wrapper {
          position: relative;
        }

        .pv-input-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.35);
          z-index: 1;
          pointer-events: none;
          transition: color 0.3s ease;
        }

        .pv-input-wrapper:focus-within .pv-input-icon {
          color: #FF6B35;
        }

        .pv-password-toggle {
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

        .pv-password-toggle:hover {
          color: #FF6B35;
          background: rgba(255, 107, 53, 0.12);
        }

        .pv-form-input {
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
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .pv-form-input::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        .pv-form-input:focus {
          border-color: #FF6B35;
          background: rgba(255, 255, 255, 0.09);
          box-shadow: 
            0 0 0 4px rgba(255, 107, 53, 0.12),
            0 10px 30px rgba(0, 0, 0, 0.25);
          transform: translateY(-1px);
        }

        .pv-form-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pv-error-message {
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
          animation: pvErrorShake 0.5s ease;
        }

        @keyframes pvErrorShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        .pv-error-icon {
          flex-shrink: 0;
          margin-top: 1px;
        }

        .pv-submit-btn {
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
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          letter-spacing: -0.2px;
        }

        .pv-submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .pv-submit-btn:hover:not(:disabled)::before {
          opacity: 1;
        }

        .pv-submit-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 
            0 15px 40px rgba(255, 107, 53, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.25) inset;
        }

        .pv-submit-btn:hover:not(:disabled) .pv-arrow-icon {
          transform: translateX(3px);
        }

        .pv-arrow-icon {
          transition: transform 0.2s;
          flex-shrink: 0;
        }

        .pv-submit-btn:active:not(:disabled) {
          transform: translateY(-1px);
        }

        .pv-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .pv-loading-spinner {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2.5px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: pvSpin 0.7s linear infinite;
          flex-shrink: 0;
        }

        @keyframes pvSpin {
          to { transform: rotate(360deg); }
        }

        /* Divider */
        .pv-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 28px 0 20px;
        }

        .pv-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
        }

        .pv-divider-text {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.35);
          font-weight: 500;
          white-space: nowrap;
        }

        /* Secondary apply button */
        .pv-apply-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 16px;
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.7);
          border: 1.5px solid rgba(255, 255, 255, 0.12);
          border-radius: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: -0.2px;
        }

        .pv-apply-btn:hover {
          border-color: rgba(255, 107, 53, 0.4);
          color: #FF6B35;
          background: rgba(255, 107, 53, 0.08);
        }

        .pv-security-notice {
          margin-top: 36px;
          padding: 18px 20px;
          background: rgba(255, 255, 255, 0.04);
          border: 1.5px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.7;
        }

        .pv-security-notice strong {
          color: rgba(255, 255, 255, 0.75);
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .pv-login-left { padding: 56px; }
          .pv-login-right { width: 500px; padding: 56px; }
          .pv-feature-cards { margin-top: 40px; }
        }

        @media (max-width: 1024px) {
          .pv-login-left { display: none; }
          .pv-login-right { width: 100%; border-left: none; }
        }

        @media (max-width: 640px) {
          .pv-login-right { padding: 40px 28px; }
          .pv-login-title { font-size: 30px; }
          .pv-login-badge { width: 64px; height: 64px; }
          .pv-form-input { padding: 15px 50px; }
        }
      `}</style>

      <div className="provider-login-page">
        <div className="pv-login-bg"></div>
        <div className="pv-grid-overlay"></div>
        <div className="pv-orb pv-orb-1"></div>
        <div className="pv-orb pv-orb-2"></div>

        {/* Left Panel - Branding */}
        <div className="pv-login-left">
          <div className="pv-brand-section">
            <div className="pv-brand-logo-wrapper">
              <div className="pv-brand-logo">
                <span className="pv-brand-logo-text">Z</span>
              </div>
              <div>
                <div className="pv-brand-name">
                  <span className="pv-brand-name-zim">ZIM</span>
                  <span className="pv-brand-name-serv">SERV</span>
                </div>
                <div className="pv-brand-tagline">Provider Portal</div>
              </div>
            </div>

            <div className="pv-feature-cards">
              <div className="pv-feature-card">
                <div className="pv-feature-icon">
                  <Briefcase size={24} strokeWidth={2.5} />
                </div>
                <div className="pv-feature-title">Manage Jobs</div>
                <div className="pv-feature-desc">
                  Accept bookings, track your schedule, and manage all your
                  service requests in one place
                </div>
              </div>

              <div className="pv-feature-card">
                <div className="pv-feature-icon">
                  <Star size={24} strokeWidth={2.5} />
                </div>
                <div className="pv-feature-title">Build Your Reputation</div>
                <div className="pv-feature-desc">
                  Collect reviews, showcase your portfolio, and grow your
                  customer base on the platform
                </div>
              </div>

              <div className="pv-feature-card">
                <div className="pv-feature-icon">
                  <TrendingUp size={24} strokeWidth={2.5} />
                </div>
                <div className="pv-feature-title">Track Earnings</div>
                <div className="pv-feature-desc">
                  Monitor your revenue, view payout history, and get real-time
                  insights into your performance
                </div>
              </div>
            </div>
          </div>

          <div className="pv-login-footer-left">
            <span>Not yet a provider?</span>
            <button
              className="pv-apply-link"
              onClick={() => navigate("/become-provider")}
            >
              Apply to join ZimServ
              <ArrowRight size={13} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="pv-login-right">
          <div className="pv-login-card">
            <div className="pv-login-header">
              <div className="pv-login-badge">
                <Briefcase size={36} strokeWidth={2} />
              </div>
              <h1 className="pv-login-title">Provider Login</h1>
              <p className="pv-login-subtitle">
                Access your ZimServ provider dashboard
              </p>
            </div>

            <form className="pv-login-form" onSubmit={handleSubmit}>
              {error && (
                <div className="pv-error-message">
                  <svg
                    className="pv-error-icon"
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

              <div className="pv-form-group">
                <label className="pv-form-label">Email Address</label>
                <div className="pv-input-wrapper">
                  <Mail size={18} className="pv-input-icon" strokeWidth={2.5} />
                  <input
                    type="email"
                    className="pv-form-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="pv-form-group">
                <label className="pv-form-label">Password</label>
                <div className="pv-input-wrapper">
                  <Lock size={18} className="pv-input-icon" strokeWidth={2.5} />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="pv-form-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="pv-password-toggle"
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

              <button
                type="submit"
                className="pv-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="pv-loading-spinner"></span>
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In to Dashboard{" "}
                    <ArrowRight
                      size={16}
                      strokeWidth={2.5}
                      className="pv-arrow-icon"
                    />
                  </>
                )}
              </button>
            </form>

            <div className="pv-divider">
              <div className="pv-divider-line" />
              <span className="pv-divider-text">New to ZimServ?</span>
              <div className="pv-divider-line" />
            </div>

            <button
              className="pv-apply-btn"
              onClick={() => navigate("/become-provider")}
            >
              <Briefcase size={16} strokeWidth={2} />
              Apply to become a provider
            </button>

            <div className="pv-security-notice">
              <strong>🔒 Provider Portal:</strong> Sign in to manage your
              bookings, communicate with customers, and track your earnings in
              real time.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProviderLogin;
