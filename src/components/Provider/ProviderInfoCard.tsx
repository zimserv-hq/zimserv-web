// src/components/Provider/ProviderInfoCard.tsx
import { Phone, MessageCircle, MapPin, Star, CheckCircle } from "lucide-react";
import type { ProviderPublic } from "../../types/provider";

interface ProviderInfoCardProps {
  provider: ProviderPublic;
  currentUser: any;
  onContactClick: (action: () => void) => void;
}

const ProviderInfoCard = ({
  provider,
  onContactClick,
}: ProviderInfoCardProps) => {
  const handleCall = () => {
    if (!provider.contact.phone) return;
    window.location.href = `tel:${provider.contact.phone}`;
  };

  const handleWhatsApp = () => {
    const raw = provider.contact.whatsapp || provider.contact.phone;
    if (!raw) return;
    const phone = raw.replace(/\D/g, "");
    window.open(`https://wa.me/${phone}`, "_blank");
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
          /* ✅ FIX: overflow:hidden on the card clips the hero image correctly
             and prevents the card from ever bleeding outside grid bounds */
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04);
          transition: box-shadow 0.3s ease;
          /* ✅ FIX: ensure the card respects its grid column width on all sizes */
          min-width: 0;
          width: 100%;
          box-sizing: border-box;
        }

        .pic:hover {
          box-shadow: 0 8px 40px rgba(0,0,0,0.11), 0 2px 8px rgba(0,0,0,0.06);
        }

        /* ── HERO IMAGE ── */
        .pic-hero {
          position: relative;
          /* ✅ FIX: Use aspect-ratio instead of fixed height so it scales
             proportionally on every screen size without overflow */
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #f5f4f2;
          /* Remove the old fixed heights entirely — aspect-ratio handles it */
        }

        .pic-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .pic:hover .pic-hero-img {
          transform: scale(1.04);
        }

        .pic-hero-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.18) 100%);
          pointer-events: none;
        }

        .pic-hero-top {
          position: absolute;
          top: 14px;
          left: 14px;
          right: 14px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          z-index: 2;
        }

        .pic-cat-badge {
          padding: 6px 14px;
          background: var(--color-accent);
          color: #fff;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          box-shadow: 0 2px 12px rgba(236,111,22,0.4);
        }

        .pic-verified-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          background: rgba(10,10,10,0.45);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: #fff;
          border-radius: 999px;
          font-size: 10.5px;
          font-weight: 700;
          border: 1px solid rgba(255,255,255,0.18);
          letter-spacing: 0.3px;
        }

        .pic-verified-pill svg { color: #4ade80; }

        .pic-hero-rating {
          position: absolute;
          bottom: 12px;
          right: 12px;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 7px 13px;
          background: rgba(10,10,10,0.45);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: #fff;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 800;
          border: 1px solid rgba(255,255,255,0.18);
        }

        .pic-hero-rating-ct {
          font-size: 11px;
          font-weight: 400;
          opacity: 0.72;
        }

        /* ── IDENTITY ── */
        .pic-identity {
          padding: 18px 20px 16px;
          border-bottom: 1.5px solid var(--color-border);
        }

        .pic-name {
          font-family: var(--font-primary);
          font-size: 21px;
          font-weight: 800;
          color: var(--color-primary);
          letter-spacing: -0.4px;
          line-height: 1.2;
          margin-bottom: 4px;
          /* ✅ FIX: prevent long business names from overflowing the card */
          overflow-wrap: break-word;
          word-break: break-word;
        }

        .pic-tagline {
          font-size: 13px;
          color: var(--color-text-secondary);
          font-weight: 500;
        }

        /* ── STATS ROW ── */
        .pic-stats-strip {
          display: flex;
          align-items: stretch;
          border-bottom: 1.5px solid var(--color-border);
        }

        .pic-stat-cell {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 13px 10px;
          gap: 2px;
          position: relative;
          /* ✅ FIX: prevent stat cells from overflowing their flex container */
          min-width: 0;
        }

        .pic-stat-cell + .pic-stat-cell::before {
          content: '';
          position: absolute;
          left: 0;
          top: 20%;
          height: 60%;
          width: 1px;
          background: var(--color-border);
        }

        .pic-stat-val {
          font-size: 15px;
          font-weight: 800;
          color: var(--color-primary);
          letter-spacing: -0.3px;
          line-height: 1;
        }

        .pic-stat-label {
          font-size: 10px;
          font-weight: 600;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 3px;
        }

        .pic-stat-cell svg {
          color: var(--color-accent);
          margin-bottom: 1px;
        }

        /* ── CONTACT BUTTONS ── */
        .pic-contact {
          padding: 16px 18px;
          border-bottom: 1.5px solid var(--color-border);
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .pic-btn-call {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          width: 100%;
          padding: 14px 20px;
          border-radius: 12px;
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          border: none;
          background: var(--color-accent);
          color: #fff;
          letter-spacing: 0.2px;
          box-shadow: 0 4px 16px rgba(236,111,22,0.36), 0 1px 4px rgba(236,111,22,0.2);
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
        }

        .pic-btn-call::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
          pointer-events: none;
        }

        .pic-btn-call:hover:not(:disabled) {
          background: var(--color-accent-hover, #d4610e);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(236,111,22,0.46), 0 2px 8px rgba(236,111,22,0.24);
        }

        .pic-btn-call:active:not(:disabled) { transform: scale(0.98); }

        .pic-btn-call:disabled {
          opacity: 0.45;
          cursor: default;
          transform: none;
          box-shadow: none;
        }

        .pic-btn-wa {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          width: 100%;
          padding: 13px 20px;
          border-radius: 12px;
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          background: transparent;
          border: 1.5px solid var(--color-border);
          color: var(--color-primary);
          transition: all 0.2s ease;
          letter-spacing: 0.1px;
          box-sizing: border-box;
        }

        .pic-btn-wa:hover:not(:disabled) {
          background: #f0fdf4;
          border-color: #16a34a;
          color: #16a34a;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(22,163,74,0.15);
        }

        .pic-btn-wa:active:not(:disabled) { transform: scale(0.98); }

        .pic-btn-wa:disabled {
          opacity: 0.45;
          cursor: default;
        }

        .pic-wa-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #16a34a;
          animation: wa-pulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }

        @keyframes wa-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(22,163,74,0.4); }
          50%       { box-shadow: 0 0 0 5px rgba(22,163,74,0); }
        }

        /* ── DETAILS BODY ── */
        .pic-body {
          padding: 18px 18px 22px;
        }

        .pic-location-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 10px;
        }

        .pic-location-label {
          font-size: 10px;
          font-weight: 700;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.9px;
        }

        .pic-location-line {
          flex: 1;
          height: 1px;
          background: var(--color-border);
        }

        .pic-city-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 14px;
          background: var(--color-bg-section);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          margin-bottom: 10px;
          transition: border-color 0.2s, background 0.2s;
        }

        .pic-city-row:hover {
          border-color: rgba(236,111,22,0.3);
          background: var(--color-accent-soft);
        }

        .pic-city-icon {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: var(--color-accent-soft);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-accent);
          flex-shrink: 0;
        }

        .pic-city-meta { flex: 1; }

        .pic-city-lbl {
          font-size: 10px;
          font-weight: 700;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.4px;
          margin-bottom: 1px;
        }

        .pic-city-val {
          font-size: 13.5px;
          color: var(--color-primary);
          font-weight: 600;
        }

        .pic-areas-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 700;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin-bottom: 8px;
          margin-top: 14px;
        }

        .pic-areas-label svg { color: var(--color-accent); }

        .pic-areas {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .pic-area-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 11px;
          background: var(--color-bg);
          border-radius: 999px;
          border: 1px solid var(--color-border);
          font-size: 12px;
          font-weight: 600;
          color: var(--color-text-secondary);
          transition: border-color 0.2s, background 0.2s, color 0.2s;
        }

        .pic-area-tag:hover {
          border-color: var(--color-accent);
          background: var(--color-accent-soft);
          color: var(--color-accent);
        }

        .pic-area-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-accent);
          flex-shrink: 0;
        }

        .pic-area-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* ✅ FIX: Removed fixed pixel heights entirely.
           aspect-ratio on .pic-hero handles proportional sizing on all screens. */
        @media (max-width: 640px) {
          .pic-name { font-size: 18px; }
          .pic-btn-call, .pic-btn-wa { font-size: 13px; padding: 12px 16px; }
          .pic-stats-strip { gap: 0; }
          .pic-identity { padding: 14px 16px 12px; }
          .pic-contact { padding: 12px 14px; }
          .pic-body { padding: 14px 14px 18px; }
        }
      `}</style>

      <div className="pic">
        {/* Hero */}
        <div className="pic-hero">
          <img
            src={provider.heroImageUrl || provider.gallery[0]?.url}
            alt={provider.name}
            className="pic-hero-img"
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

          <div className="pic-hero-rating">
            <Star size={13} fill="#F59E0B" strokeWidth={0} />
            {provider.rating.toFixed(1)}
            <span className="pic-hero-rating-ct">({provider.reviewCount})</span>
          </div>
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
          <div className="pic-stat-cell">
            <Star size={13} strokeWidth={0} fill="#F59E0B" />
            <div className="pic-stat-val">{provider.rating.toFixed(1)}</div>
            <div className="pic-stat-label">Rating</div>
          </div>
          <div className="pic-stat-cell">
            <MessageCircle
              size={13}
              strokeWidth={2}
              style={{ color: "var(--color-accent)" }}
            />
            <div className="pic-stat-val">{provider.reviewCount}</div>
            <div className="pic-stat-label">Reviews</div>
          </div>
          <div className="pic-stat-cell">
            <CheckCircle
              size={13}
              strokeWidth={2}
              style={{ color: "var(--color-accent)" }}
            />
            <div className="pic-stat-val">
              {provider.stats?.jobsCompleted || 0}
            </div>
            <div className="pic-stat-label">Jobs Done</div>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="pic-contact">
          <button
            className="pic-btn-call"
            onClick={() => onContactClick(handleCall)}
            disabled={!hasPhone}
          >
            <Phone size={16} strokeWidth={2.5} />
            {hasPhone ? "Call Now" : "No Phone Listed"}
          </button>
          {/* ✅ FIX: removed stray {hasWhatsapp} boolean render */}
          <button
            className="pic-btn-wa"
            onClick={() => onContactClick(handleWhatsApp)}
            disabled={!hasWhatsapp}
          >
            <MessageCircle size={15} strokeWidth={2.5} />
            WhatsApp
          </button>
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
