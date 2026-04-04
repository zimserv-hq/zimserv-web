// src/components/Provider/ProviderInfoCard.tsx
import { useState, useEffect } from "react";
import {
  Phone,
  MessageCircle,
  MapPin,
  Star,
  CheckCircle,
  X,
} from "lucide-react";
import type { ProviderPublic } from "../../types/provider";
import { supabase } from "../../lib/supabaseClient";
import { useAnalytics } from "../../hooks/useAnalytics";

interface ProviderInfoCardProps {
  provider: ProviderPublic;
  onReviewsClick?: () => void;
}

const ProviderInfoCard = ({
  provider,
  onReviewsClick,
}: ProviderInfoCardProps) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const { track } = useAnalytics();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) =>
      setCurrentUser(session?.user ?? null),
    );
    return () => subscription.unsubscribe();
  }, []);

  const handleSignInRedirect = async () => {
    setSigningIn(true);
    sessionStorage.setItem("returnTo", window.location.pathname);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    setSigningIn(false);
  };

  const requireAuth = (
    action: () => void,
    eventType: "call_click" | "whatsapp_click",
  ) => {
    if (!currentUser) {
      setShowLoginPrompt(true);
      return;
    }
    track(eventType, provider.id);
    action();
  };

  const handleCall = () => {
    if (!provider.contact.phone) return;
    window.location.href = `tel:${provider.contact.phone}`;
  };

  const handleWhatsApp = () => {
    const raw = provider.contact.whatsapp || provider.contact.phone;
    if (!raw) return;
    const phone = raw.replace(/\D/g, "");
    const message = `Hi, I found you on ZimServ and I need your *${provider.category}* service. Are you available?`;
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  const hasPhone = Boolean(provider.contact.phone);
  const hasWhatsapp = Boolean(
    provider.contact.whatsapp || provider.contact.phone,
  );

  return (
    <>
      <style>{`
        .pic {
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04);
          transition: box-shadow 0.3s ease;
          min-width: 0; width: 100%; box-sizing: border-box;
        }
        .pic:hover {
          box-shadow: 0 8px 40px rgba(0,0,0,0.11), 0 2px 8px rgba(0,0,0,0.06);
        }

        /* ── HERO ── */
        .pic-hero {
          position: relative; aspect-ratio: 16 / 9;
          overflow: hidden; background: #f5f4f2;
        }
        .pic-hero-img {
          width: 100%; height: 100%; object-fit: cover; object-position: center top;
          display: block;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .pic:hover .pic-hero-img { transform: scale(1.04); }
        .pic-hero-gradient {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.18) 100%);
          pointer-events: none;
        }
        .pic-hero-top {
          position: absolute; top: 14px; left: 14px; right: 14px;
          display: flex; justify-content: space-between; align-items: flex-start; z-index: 2;
        }
        .pic-cat-badge {
          padding: 6px 14px; background: var(--color-accent); color: #fff;
          border-radius: 999px; font-size: 10px; font-weight: 800;
          letter-spacing: 1px; text-transform: uppercase;
          box-shadow: 0 2px 12px rgba(236,111,22,0.4);
        }
        .pic-verified-pill {
          display: flex; align-items: center; gap: 5px; padding: 6px 12px;
          background: rgba(10,10,10,0.45); backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px); color: #fff; border-radius: 999px;
          font-size: 10.5px; font-weight: 700;
          border: 1px solid rgba(255,255,255,0.18); letter-spacing: 0.3px;
        }
        .pic-verified-pill svg { color: #4ade80; }
        .pic-hero-rating {
          position: absolute; bottom: 12px; right: 12px; z-index: 2;
          display: flex; align-items: center; gap: 5px; padding: 7px 13px;
          background: rgba(10,10,10,0.45); backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px); color: #fff; border-radius: 999px;
          font-size: 13px; font-weight: 800; font-family: var(--font-primary);
          border: 1px solid rgba(255,255,255,0.18);
          cursor: pointer; transition: background 0.2s, transform 0.2s;
        }
        .pic-hero-rating:hover { background: rgba(236,111,22,0.7); transform: translateY(-1px); }
        .pic-hero-rating-ct { font-size: 11px; font-weight: 400; opacity: 0.72; }

        /* ── IDENTITY ── */
        .pic-identity { padding: 18px 20px 16px; border-bottom: 1.5px solid var(--color-border); }
        .pic-name {
          font-family: var(--font-primary); font-size: 21px; font-weight: 800;
          color: var(--color-primary); letter-spacing: -0.4px; line-height: 1.2;
          margin-bottom: 4px; overflow-wrap: break-word; word-break: break-word;
        }
        .pic-tagline { font-size: 13px; color: var(--color-text-secondary); font-weight: 500; }

        /* ── STATS ── */
        .pic-stats-strip { display: flex; align-items: stretch; border-bottom: 1.5px solid var(--color-border); }
        .pic-stat-cell {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 13px 10px; gap: 2px; position: relative; min-width: 0;
        }
        .pic-stat-cell + .pic-stat-cell::before {
          content: ''; position: absolute; left: 0; top: 20%;
          height: 60%; width: 1px; background: var(--color-border);
        }
        .pic-stat-val {
          font-size: 15px; font-weight: 800; color: var(--color-primary);
          letter-spacing: -0.3px; line-height: 1;
        }
        .pic-stat-label {
          font-size: 10px; font-weight: 600; color: var(--color-text-secondary);
          text-transform: uppercase; letter-spacing: 0.5px; margin-top: 3px;
        }
        .pic-stat-cell svg { color: var(--color-accent); margin-bottom: 1px; }
        .pic-stat-cell.clickable {
          cursor: pointer; background: none; border: none; outline: none;
          font-family: inherit; transition: background 0.2s;
        }
        .pic-stat-cell.clickable:hover { background: var(--color-accent-soft); }
        .pic-stat-cell.clickable:hover .pic-stat-val { color: var(--color-accent); }
        .pic-stat-cell.clickable:hover .pic-stat-label { color: var(--color-accent); }

        /* ── CONTACT ── */
        .pic-contact {
          padding: 16px 18px; border-bottom: 1.5px solid var(--color-border);
          display: flex; flex-direction: column; gap: 9px;
        }
        .pic-btn-call {
          display: flex; align-items: center; justify-content: center; gap: 9px;
          width: 100%; padding: 14px 20px; border-radius: 12px;
          font-family: var(--font-primary); font-size: 14px; font-weight: 800;
          cursor: pointer; border: none; background: var(--color-accent); color: #fff;
          letter-spacing: 0.2px;
          box-shadow: 0 4px 16px rgba(236,111,22,0.36), 0 1px 4px rgba(236,111,22,0.2);
          transition: all 0.2s ease; position: relative; overflow: hidden; box-sizing: border-box;
        }
        .pic-btn-call::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
          pointer-events: none;
        }
        .pic-btn-call:hover:not(:disabled) {
          background: var(--color-accent-hover, #d4610e); transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(236,111,22,0.46), 0 2px 8px rgba(236,111,22,0.24);
        }
        .pic-btn-call:active:not(:disabled) { transform: scale(0.98); }
        .pic-btn-call:disabled { opacity: 0.45; cursor: default; transform: none; box-shadow: none; }
        .pic-btn-wa {
          display: flex; align-items: center; justify-content: center; gap: 9px;
          width: 100%; padding: 13px 20px; border-radius: 12px;
          font-family: var(--font-primary); font-size: 14px; font-weight: 700;
          cursor: pointer; background: transparent; border: 1.5px solid var(--color-border);
          color: var(--color-primary); transition: all 0.2s ease;
          letter-spacing: 0.1px; box-sizing: border-box;
        }
        .pic-btn-wa:hover:not(:disabled) {
          background: #f0fdf4; border-color: #16a34a; color: #16a34a;
          transform: translateY(-1px); box-shadow: 0 4px 12px rgba(22,163,74,0.15);
        }
        .pic-btn-wa:active:not(:disabled) { transform: scale(0.98); }
        .pic-btn-wa:disabled { opacity: 0.45; cursor: default; }
        .pic-wa-dot {
          width: 8px; height: 8px; border-radius: 50%; background: #16a34a;
          animation: wa-pulse 2s ease-in-out infinite; flex-shrink: 0;
        }
        @keyframes wa-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(22,163,74,0.4); }
          50%       { box-shadow: 0 0 0 5px rgba(22,163,74,0); }
        }
        .pic-auth-hint {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          font-size: 11.5px; font-weight: 600; color: var(--color-text-secondary);
          padding: 4px 0 2px; margin: 0; letter-spacing: 0.1px;
        }

        /* ── BODY ── */
        .pic-body { padding: 18px 18px 22px; }
        .pic-location-header { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; }
        .pic-location-label {
          font-size: 10px; font-weight: 700; color: var(--color-text-secondary);
          text-transform: uppercase; letter-spacing: 0.9px;
        }
        .pic-location-line { flex: 1; height: 1px; background: var(--color-border); }
        .pic-city-row {
          display: flex; align-items: center; gap: 10px; padding: 11px 14px;
          background: var(--color-bg-section); border: 1px solid var(--color-border);
          border-radius: 12px; margin-bottom: 10px;
          transition: border-color 0.2s, background 0.2s;
        }
        .pic-city-row:hover { border-color: rgba(236,111,22,0.3); background: var(--color-accent-soft); }
        .pic-city-icon {
          width: 30px; height: 30px; border-radius: 8px; background: var(--color-accent-soft);
          display: flex; align-items: center; justify-content: center;
          color: var(--color-accent); flex-shrink: 0;
        }
        .pic-city-meta { flex: 1; }
        .pic-city-lbl {
          font-size: 10px; font-weight: 700; color: var(--color-text-secondary);
          text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 1px;
        }
        .pic-city-val { font-size: 13.5px; color: var(--color-primary); font-weight: 600; }
        .pic-areas-label {
          display: flex; align-items: center; gap: 6px;
          font-size: 10px; font-weight: 700; color: var(--color-text-secondary);
          text-transform: uppercase; letter-spacing: 0.6px;
          margin-bottom: 8px; margin-top: 14px;
        }
        .pic-areas-label svg { color: var(--color-accent); }
        .pic-areas { display: flex; flex-wrap: wrap; gap: 7px; }
        .pic-area-tag {
          display: inline-flex; align-items: center; gap: 6px; padding: 5px 11px;
          background: var(--color-bg); border-radius: 999px; border: 1px solid var(--color-border);
          font-size: 12px; font-weight: 600; color: var(--color-text-secondary);
          transition: border-color 0.2s, background 0.2s, color 0.2s;
        }
        .pic-area-tag:hover {
          border-color: var(--color-accent); background: var(--color-accent-soft); color: var(--color-accent);
        }
        .pic-area-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--color-accent); flex-shrink: 0; }
        .pic-area-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        /* ── LOGIN MODAL ── */
        .pic-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(28,25,23,0.55);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999; backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
          animation: pic-fade 0.2s ease;
        }
        @keyframes pic-fade { from { opacity: 0; } to { opacity: 1; } }
        .pic-modal {
          background: var(--color-bg); border-radius: 20px;
          padding: 44px 40px 40px; max-width: 380px; width: 90%;
          text-align: center; position: relative;
          border: 1.5px solid var(--color-border);
          box-shadow: 0 32px 80px rgba(0,0,0,0.18);
          animation: pic-up 0.28s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes pic-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pic-modal-close {
          position: absolute; top: 14px; right: 14px;
          background: transparent; border: none; cursor: pointer;
          color: var(--color-text-secondary);
          display: flex; align-items: center; justify-content: center;
          padding: 6px; border-radius: 6px; transition: all 0.15s;
        }
        .pic-modal-close:hover { color: var(--color-primary); background: var(--color-bg-section); }
        .pic-modal-icon { font-size: 40px; margin-bottom: 14px; }
        .pic-modal-title {
          font-family: var(--font-primary); font-size: 21px; font-weight: 800;
          color: var(--color-primary); letter-spacing: -0.4px; margin-bottom: 10px;
        }
        .pic-modal-text {
          font-size: 14px; color: var(--color-text-secondary);
          margin-bottom: 28px; line-height: 1.65;
        }
        .pic-modal-actions { display: flex; flex-direction: column; gap: 8px; }
        .pic-google-btn {
          display: flex; align-items: center; justify-content: center; gap: 12px;
          width: 100%; padding: 13px 20px; border-radius: 12px;
          font-family: var(--font-primary); font-size: 14px; font-weight: 700;
          cursor: pointer; background: var(--color-bg);
          border: 1.5px solid var(--color-border); color: var(--color-primary);
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
        }
        .pic-google-btn:hover { border-color: #4285F4; box-shadow: 0 4px 20px rgba(66,133,244,0.14); transform: translateY(-1px); }
        .pic-google-btn:active { transform: scale(0.98); }
        .pic-google-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .pic-cancel-btn {
          width: 100%; padding: 12px 20px; border-radius: 12px;
          font-family: var(--font-primary); font-size: 13.5px; font-weight: 600;
          cursor: pointer; background: transparent;
          border: 1px solid var(--color-border); color: var(--color-text-secondary);
          transition: all 0.15s;
        }
        .pic-cancel-btn:hover { background: var(--color-bg-section); color: var(--color-primary); }

        /* ── RESPONSIVE ── */
        @media (max-width: 640px) {
          .pic-name { font-size: 18px; }
          .pic-btn-call, .pic-btn-wa { font-size: 13px; padding: 12px 16px; }
          .pic-stats-strip { gap: 0; }
          .pic-identity { padding: 14px 16px 12px; }
          .pic-contact { padding: 12px 14px; }
          .pic-body { padding: 14px 14px 18px; }
          .pic-modal { padding: 36px 22px 28px; }
        }
      `}</style>

      {/* ── LOGIN MODAL ── */}
      {showLoginPrompt && (
        <div
          className="pic-modal-overlay"
          onClick={() => setShowLoginPrompt(false)}
        >
          <div className="pic-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="pic-modal-close"
              onClick={() => setShowLoginPrompt(false)}
              aria-label="Close"
            >
              <X size={18} strokeWidth={2} />
            </button>
            <div className="pic-modal-icon">🔒</div>
            <h2 className="pic-modal-title">Sign in to Contact</h2>
            <p className="pic-modal-text">
              Create a free account to call or WhatsApp{" "}
              <strong>{provider.name}</strong> directly.
            </p>
            <div className="pic-modal-actions">
              <button
                className="pic-google-btn"
                onClick={handleSignInRedirect}
                disabled={signingIn}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
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
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {signingIn ? "Redirecting…" : "Continue with Google"}
              </button>
              <button
                className="pic-cancel-btn"
                onClick={() => setShowLoginPrompt(false)}
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CARD ── */}
      <div className="pic">
        {/* Hero */}
        <div className="pic-hero">
          <img
            src={provider.heroImageUrl || provider.gallery?.[0]?.url}
            alt={provider.name}
            className="pic-hero-img"
            loading="lazy"
          />
          <div className="pic-hero-gradient" />
          <div className="pic-hero-top">
            <span className="pic-cat-badge">{provider.category}</span>
            {provider.verified && (
              <span className="pic-verified-pill">
                <CheckCircle size={11} strokeWidth={2.5} />
                Verified
              </span>
            )}
          </div>
          <button className="pic-hero-rating" onClick={onReviewsClick}>
            <Star size={13} fill="#F59E0B" strokeWidth={0} />
            {provider.rating.toFixed(1)}
            <span className="pic-hero-rating-ct">({provider.reviewCount})</span>
          </button>
        </div>

        {/* Identity */}
        <div className="pic-identity">
          <div className="pic-name">{provider.name}</div>
          {provider.tagline && (
            <div className="pic-tagline">{provider.tagline}</div>
          )}
        </div>

        {/* Stats strip */}
        <div className="pic-stats-strip">
          <button className="pic-stat-cell clickable" onClick={onReviewsClick}>
            <Star size={13} strokeWidth={0} fill="#F59E0B" />
            <div className="pic-stat-val">{provider.rating.toFixed(1)}</div>
            <div className="pic-stat-label">Rating</div>
          </button>
          <button className="pic-stat-cell clickable" onClick={onReviewsClick}>
            <MessageCircle
              size={13}
              strokeWidth={2}
              style={{ color: "var(--color-accent)" }}
            />
            <div className="pic-stat-val">{provider.reviewCount}</div>
            <div className="pic-stat-label">Reviews</div>
          </button>
        </div>

        {/* CTA buttons */}
        <div className="pic-contact">
          <button
            className="pic-btn-call"
            onClick={() => requireAuth(handleCall, "call_click")}
            disabled={!hasPhone}
          >
            <Phone size={16} strokeWidth={2.5} />
            {hasPhone ? "Call Now" : "No Phone Listed"}
          </button>
          <button
            className="pic-btn-wa"
            onClick={() => requireAuth(handleWhatsApp, "whatsapp_click")}
            disabled={!hasWhatsapp}
          >
            <MessageCircle size={15} strokeWidth={2.5} />
            WhatsApp
          </button>
          {!currentUser && (hasPhone || hasWhatsapp) && (
            <p className="pic-auth-hint">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Sign in to contact this provider
            </p>
          )}
        </div>

        {/* Location */}
        <div className="pic-body">
          <div className="pic-location-header">
            <span className="pic-location-label">Location</span>
            <div className="pic-location-line" />
          </div>
          <div className="pic-city-row">
            <div className="pic-city-icon">
              <MapPin size={14} strokeWidth={2} />
            </div>
            <div className="pic-city-meta">
              <div className="pic-city-lbl">Based in</div>
              <div className="pic-city-val">{provider.city}</div>
            </div>
          </div>
          {provider.areas.length > 0 && (
            <>
              <div className="pic-areas-label">
                <MapPin size={11} strokeWidth={2} />
                Service Areas
              </div>
              <div className="pic-areas">
                {provider.areas.map((area, i) => (
                  <span key={i} className="pic-area-tag">
                    <span className="pic-area-dot" />
                    <span className="pic-area-name">{area}</span>
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProviderInfoCard;
