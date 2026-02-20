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
        /* Fonts loaded globally via index.css (Plus Jakarta Sans) */

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        /* ── Page shell ───────────────────────────────────────────────────── */
        .pl-page {
          min-height: 100vh;
          display: flex;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #F7F6F3;
        }

        /* ── LEFT PANEL ───────────────────────────────────────────────────── */
        .pl-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 52px 60px;
          background: #0E1320;
          position: relative;
          overflow: hidden;
          min-height: 100vh;
        }

        /* Soft orange glow — top-left only, no bottom blob */
        .pl-left::before {
          content: '';
          position: absolute;
          top: -80px;
          left: -80px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(255,107,53,0.14) 0%, transparent 65%);
          pointer-events: none;
        }

        /* Dot-grid texture */
        .pl-left::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
        }

        /* Architectural corner decoration — replaces ugly orange blob */
        .pl-deco {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 320px;
          height: 320px;
          border-top: 1px solid rgba(255,107,53,0.12);
          border-left: 1px solid rgba(255,107,53,0.08);
          border-radius: 100% 0 0 0;
          pointer-events: none;
        }

        /* ── Brand logo row ── */
        .pl-logo-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 64px;
          position: relative;
          z-index: 1;
          animation: plUp 0.6s ease both;
        }

        @keyframes plUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .pl-logo-box {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #FF6B35, #D94E1F);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #fff;
          box-shadow: 0 6px 20px rgba(255,107,53,0.4);
          flex-shrink: 0;
        }

        .pl-logo-name {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.5px;
          line-height: 1;
        }
        .pl-logo-name span { color: #FF6B35; }

        .pl-logo-badge {
          margin-top: 4px;
          font-size: 10px;
          font-weight: 600;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        /* ── Hero copy — fills the middle space ── */
        .pl-hero {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          animation: plUp 0.6s ease 0.1s both;
        }

        .pl-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 700;
          color: #FF6B35;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 20px;
        }

        .pl-eyebrow-line {
          width: 28px;
          height: 2px;
          background: #FF6B35;
          border-radius: 2px;
          flex-shrink: 0;
        }

        .pl-headline {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 54px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -2.5px;
          line-height: 1.0;
          margin-bottom: 24px;
        }

        .pl-headline em {
          font-style: normal;
          color: #FF6B35;
          position: relative;
        }

        .pl-headline em::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #FF6B35, transparent);
          border-radius: 2px;
        }

        .pl-lead {
          font-size: 15px;
          font-weight: 400;
          color: rgba(255,255,255,0.5);
          line-height: 1.75;
          max-width: 360px;
          margin-bottom: 44px;
        }

        /* ── Stat chips — now clearly legible ── */
        .pl-chips {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 44px;
        }

        .pl-chip {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 9px 16px 9px 10px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.13);
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.88);
          transition: all 0.2s ease;
          animation: plUp 0.6s ease both;
        }

        .pl-chip:nth-child(1) { animation-delay: 0.15s; }
        .pl-chip:nth-child(2) { animation-delay: 0.22s; }
        .pl-chip:nth-child(3) { animation-delay: 0.29s; }

        .pl-chip:hover {
          background: rgba(255,107,53,0.15);
          border-color: rgba(255,107,53,0.35);
          color: #fff;
        }

        .pl-chip-icon {
          width: 26px;
          height: 26px;
          background: rgba(255,107,53,0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FF6B35;
          flex-shrink: 0;
        }

        /* ── Feature list — card style ── */
        .pl-features {
          display: flex;
          flex-direction: column;
          gap: 10px;
          animation: plUp 0.6s ease 0.25s both;
        }

        .pl-feat {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 13px 18px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          transition: all 0.25s ease;
        }

        .pl-feat:hover {
          background: rgba(255,107,53,0.07);
          border-color: rgba(255,107,53,0.2);
          transform: translateX(4px);
        }

        .pl-feat-dot {
          width: 7px;
          height: 7px;
          background: #FF6B35;
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 8px rgba(255,107,53,0.5);
        }

        .pl-feat-text {
          font-size: 13.5px;
          font-weight: 500;
          color: rgba(255,255,255,0.6);
          line-height: 1.4;
        }

        .pl-feat-text strong {
          color: rgba(255,255,255,0.9);
          font-weight: 600;
        }

        /* ── Bottom "apply" row — properly separated from features ── */
        .pl-bottom {
          position: relative;
          z-index: 1;
          margin-top: 44px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          animation: plUp 0.6s ease 0.35s both;
        }

        .pl-bottom-label {
          font-size: 13px;
          color: rgba(255,255,255,0.35);
        }

        .pl-apply-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 16px;
          background: transparent;
          border: 1px solid rgba(255,107,53,0.35);
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          color: #FF6B35;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .pl-apply-link:hover {
          background: rgba(255,107,53,0.1);
          border-color: rgba(255,107,53,0.55);
          gap: 10px;
        }

        /* ── RIGHT PANEL ───────────────────────────────────────────────────── */
        .pl-right {
          width: 520px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 52px 56px;
          background: #FAFAF7;
          position: relative;
          border-left: 1px solid #ECEAE4;
        }

        .pl-right::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 280px;
          height: 280px;
          background: radial-gradient(ellipse at top right, rgba(255,107,53,0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        .pl-form-wrap {
          width: 100%;
          max-width: 380px;
          animation: plUp 0.6s ease 0.2s both;
          position: relative;
          z-index: 1;
        }

        /* ── Portal badge ── */
        .pl-portal-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 14px;
          background: #fff;
          border: 1.5px solid #ECEAE4;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          color: #555;
          margin-bottom: 28px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          letter-spacing: 0.2px;
        }

        .pl-portal-dot {
          width: 8px;
          height: 8px;
          background: #FF6B35;
          border-radius: 50%;
          animation: plPulse 2s ease infinite;
        }

        @keyframes plPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(0.7); opacity: 0.5; }
        }

        /* ── Welcome heading ── */
        .pl-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 40px;
          font-weight: 800;
          color: #0E1320;
          letter-spacing: -1.8px;
          line-height: 1.08;
          margin-bottom: 10px;
        }

        .pl-subtitle {
          font-size: 15px;
          color: #9A9690;
          font-weight: 400;
          margin-bottom: 36px;
          line-height: 1.5;
        }

        /* ── Form fields — clean white with real border ── */
        .pl-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .pl-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .pl-label {
          font-size: 11px;
          font-weight: 700;
          color: #0E1320;
          text-transform: uppercase;
          letter-spacing: 0.9px;
        }

        .pl-input-wrap {
          position: relative;
        }

        .pl-input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #C8C5BE;
          pointer-events: none;
          transition: color 0.2s;
          z-index: 1;
        }

        .pl-input-wrap:focus-within .pl-input-icon {
          color: #FF6B35;
        }

        .pl-input {
          width: 100%;
          padding: 14px 48px;
          background: #fff;
          border: 1.5px solid #E4E2DC;
          border-radius: 11px;
          font-size: 14.5px;
          font-weight: 400;
          color: #0E1320;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
          font-family: 'Plus Jakarta Sans', sans-serif;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        .pl-input::placeholder { color: #C0BDB6; }

        .pl-input:focus {
          border-color: #FF6B35;
          box-shadow: 0 0 0 3.5px rgba(255,107,53,0.12), 0 1px 3px rgba(0,0,0,0.04);
        }

        .pl-input:disabled {
          background: #F5F4F0;
          color: #aaa;
          cursor: not-allowed;
        }

        .pl-eye {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #C0BDB6;
          padding: 5px;
          border-radius: 7px;
          display: flex;
          align-items: center;
          transition: all 0.2s;
        }

        .pl-eye:hover {
          color: #FF6B35;
          background: rgba(255,107,53,0.08);
        }

        /* ── Error ── */
        .pl-error {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 13px 15px;
          background: #FFF5F5;
          border: 1.5px solid #FECACA;
          border-left: 3px solid #EF4444;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 500;
          color: #B91C1C;
          animation: plShake 0.35s ease;
        }

        @keyframes plShake {
          0%, 100% { transform: translateX(0); }
          30%       { transform: translateX(-6px); }
          70%       { transform: translateX(6px); }
        }

        .pl-error svg { flex-shrink: 0; margin-top: 1px; }

        /* ── Submit button ── */
        .pl-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #FF6B35 0%, #D94E1F 100%);
          color: #fff;
          border: none;
          border-radius: 11px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 6px 20px rgba(255,107,53,0.35), 0 1px 3px rgba(0,0,0,0.1);
          margin-top: 4px;
          position: relative;
          overflow: hidden;
          letter-spacing: -0.2px;
        }

        .pl-submit::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 55%);
          opacity: 0;
          transition: opacity 0.25s;
        }

        .pl-submit:hover:not(:disabled)::before { opacity: 1; }

        .pl-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(255,107,53,0.42), 0 2px 6px rgba(0,0,0,0.12);
        }

        .pl-submit:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 4px 12px rgba(255,107,53,0.3);
        }

        .pl-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .pl-submit svg {
          transition: transform 0.2s;
          flex-shrink: 0;
        }

        .pl-submit:hover:not(:disabled) svg { transform: translateX(3px); }

        .pl-spinner {
          width: 17px;
          height: 17px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: plSpin 0.65s linear infinite;
          flex-shrink: 0;
        }

        @keyframes plSpin { to { transform: rotate(360deg); } }

        /* ── Divider ── */
        .pl-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 24px 0 20px;
        }

        .pl-divider-line { flex: 1; height: 1px; background: #E4E2DC; }

        .pl-divider-text {
          font-size: 12px;
          color: #B8B4AC;
          font-weight: 500;
          white-space: nowrap;
        }

        /* ── Secondary apply button ── */
        .pl-apply-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 13px;
          background: #fff;
          color: #444;
          border: 1.5px solid #E4E2DC;
          border-radius: 11px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        .pl-apply-btn:hover {
          border-color: #FF6B35;
          color: #FF6B35;
          background: #FFFAF7;
          box-shadow: 0 2px 10px rgba(255,107,53,0.1);
        }

        /* ── Footer note ── */
        .pl-note {
          margin-top: 18px;
          padding: 13px 15px;
          background: #F2F0EB;
          border-radius: 10px;
          font-size: 12.5px;
          color: #9A9690;
          line-height: 1.65;
          text-align: center;
        }

        .pl-note strong { color: #444; font-weight: 600; }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .pl-left { padding: 44px 48px; }
          .pl-headline { font-size: 44px; }
          .pl-right { width: 480px; padding: 44px 48px; }
        }

        @media (max-width: 900px) {
          .pl-left { display: none; }
          .pl-right { width: 100%; border-left: none; padding: 48px 28px; }
        }

        @media (max-width: 480px) {
          .pl-right { padding: 36px 20px; }
          .pl-title { font-size: 32px; letter-spacing: -1.2px; }
        }
      `}</style>

      <div className="pl-page">
        {/* ── LEFT PANEL ── */}
        <div className="pl-left">
          <div className="pl-deco" />

          <div className="pl-logo-row">
            <div className="pl-logo-box">Z</div>
            <div>
              <div className="pl-logo-name">
                Zim<span>Serv</span>
              </div>
              <div className="pl-logo-badge">Provider Portal</div>
            </div>
          </div>

          <div className="pl-hero">
            <div className="pl-eyebrow">
              <div className="pl-eyebrow-line" />
              For Service Professionals
            </div>

            <div className="pl-lead">
              Manage bookings, connect with customers, and track your earnings —
              all in one powerful dashboard built for service professionals.
            </div>

            <div className="pl-chips">
              {[
                {
                  icon: <Briefcase size={13} strokeWidth={2.5} />,
                  label: "Manage Jobs",
                },
                {
                  icon: <Star size={13} strokeWidth={2.5} />,
                  label: "Build Reviews",
                },
                {
                  icon: <TrendingUp size={13} strokeWidth={2.5} />,
                  label: "Track Earnings",
                },
              ].map((c) => (
                <div key={c.label} className="pl-chip">
                  <div className="pl-chip-icon">{c.icon}</div>
                  {c.label}
                </div>
              ))}
            </div>

            <div className="pl-features">
              {[
                {
                  title: "Real-time job notifications",
                  desc: "Never miss a booking request",
                },
                {
                  title: "Customer messaging",
                  desc: "Communicate directly in-app",
                },
                {
                  title: "Profile & portfolio control",
                  desc: "Showcase your best work",
                },
              ].map((f) => (
                <div key={f.title} className="pl-feat">
                  <div className="pl-feat-dot" />
                  <div className="pl-feat-text">
                    <strong>{f.title}</strong> — {f.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Properly separated from feature list */}
          <div className="pl-bottom">
            <span className="pl-bottom-label">Not yet a provider?</span>
            <button
              className="pl-apply-link"
              onClick={() => navigate("/become-provider")}
            >
              Apply to join ZimServ
              <ArrowRight size={13} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="pl-right">
          <div className="pl-form-wrap">
            <div className="pl-portal-badge">
              <div className="pl-portal-dot" />
              Provider Portal
            </div>

            <div className="pl-title">
              Welcome
              <br />
              back 👋
            </div>
            <div className="pl-subtitle">
              Sign in to manage your services and bookings
            </div>

            <form className="pl-form" onSubmit={handleSubmit}>
              {error && (
                <div className="pl-error">
                  <svg
                    width="15"
                    height="15"
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

              <div className="pl-field">
                <label className="pl-label">Email Address</label>
                <div className="pl-input-wrap">
                  <Mail size={16} className="pl-input-icon" strokeWidth={2} />
                  <input
                    type="email"
                    className="pl-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="pl-field">
                <label className="pl-label">Password</label>
                <div className="pl-input-wrap">
                  <Lock size={16} className="pl-input-icon" strokeWidth={2} />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="pl-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="pl-eye"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff size={16} strokeWidth={2} />
                    ) : (
                      <Eye size={16} strokeWidth={2} />
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="pl-submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="pl-spinner" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In to Dashboard{" "}
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </>
                )}
              </button>
            </form>

            <div className="pl-divider">
              <div className="pl-divider-line" />
              <span className="pl-divider-text">New to ZimServ?</span>
              <div className="pl-divider-line" />
            </div>

            <button
              className="pl-apply-btn"
              onClick={() => navigate("/become-provider")}
            >
              <Briefcase size={15} strokeWidth={2} />
              Apply to become a provider
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProviderLogin;
