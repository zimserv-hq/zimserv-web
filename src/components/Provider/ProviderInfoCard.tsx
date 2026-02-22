// src/components/Provider/ProviderInfoCard.tsx
import {
  Phone,
  MessageCircle,
  MapPin,
  Star,
  CheckCircle,
  Briefcase,
} from "lucide-react";
import type { ProviderPublic } from "../../types/provider";

interface ProviderInfoCardProps {
  provider: ProviderPublic;
}

const ProviderInfoCard = ({ provider }: ProviderInfoCardProps) => {
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
        /* ══════════════════════════════════════════
           PROVIDER INFO CARD
        ══════════════════════════════════════════ */
        .pic {
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }

        /* ── HERO IMAGE ── */
        .pic-hero {
          position: relative;
          height: 300px;
          overflow: hidden;
          background: var(--color-bg-soft);
        }

        .pic-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
          transition: transform 0.5s ease;
        }

        .pic:hover .pic-hero-img {
          transform: scale(1.03);
        }

        .pic-hero::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 30%,
            rgba(15, 12, 9, 0.55) 100%
          );
          pointer-events: none;
        }

        .pic-hero-badges {
          position: absolute;
          top: 12px;
          left: 12px;
          right: 12px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          z-index: 2;
        }

        .pic-cat-badge {
          padding: 5px 12px;
          background: var(--color-accent);
          color: #fff;
          border-radius: var(--radius-full);
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.6px;
          text-transform: uppercase;
        }

        .pic-verified-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          background: rgba(15, 12, 9, 0.5);
          backdrop-filter: blur(8px);
          color: #fff;
          border-radius: var(--radius-full);
          font-size: 10.5px;
          font-weight: 600;
          border: 1px solid rgba(255,255,255,0.15);
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
          padding: 6px 12px;
          background: rgba(15, 12, 9, 0.5);
          backdrop-filter: blur(8px);
          color: #fff;
          border-radius: var(--radius-full);
          font-size: 13px;
          font-weight: 700;
          border: 1px solid rgba(255,255,255,0.15);
        }

        .pic-hero-rating-ct {
          font-size: 11px;
          font-weight: 400;
          opacity: 0.75;
        }

        /* ── IDENTITY ── */
        .pic-identity {
          padding: 18px 20px 16px;
          border-bottom: 1px solid var(--color-border);
        }

        .pic-name-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 4px;
        }

        .pic-name {
          font-family: var(--font-primary);
          font-size: 20px;
          font-weight: 800;
          color: var(--color-primary);
          line-height: 1.2;
          letter-spacing: -0.4px;
          flex: 1;
        }

        .pic-price-block {
          text-align: right;
          flex-shrink: 0;
        }

        .pic-price-from {
          display: block;
          font-size: 9.5px;
          font-weight: 600;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          line-height: 1;
        }

        .pic-price-val {
          display: block;
          font-size: 20px;
          font-weight: 800;
          color: var(--color-accent);
          letter-spacing: -0.5px;
          line-height: 1.2;
          margin-top: 1px;
        }

        .pic-tagline {
          font-size: 13px;
          color: var(--color-text-secondary);
          line-height: 1.45;
          margin-bottom: 12px;
        }

        .pic-stars-row {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 12px;
        }

        .pic-stars { display: flex; gap: 2px; }

        .pic-rating-num {
          font-size: 14px;
          font-weight: 700;
          color: var(--color-primary);
        }

        .pic-rating-ct {
          font-size: 12px;
          color: var(--color-text-secondary);
        }

        .pic-stats {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .pic-stat-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          background: var(--color-bg-section);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          font-size: 12px;
          font-weight: 600;
          color: var(--color-text-secondary);
          transition: border-color 0.2s, background 0.2s;
        }

        .pic-stat-chip svg { color: var(--color-accent); }

        /* ── CONTACT BUTTONS ── */
        .pic-contact {
          padding: 14px 20px;
          border-bottom: 1px solid var(--color-border);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .pic-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 12px 14px;
          border-radius: var(--radius-md);
          font-family: var(--font-primary);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition:
            background var(--transition-fast),
            transform var(--transition-fast),
            box-shadow var(--transition-fast),
            border-color var(--transition-fast),
            color var(--transition-fast);
          white-space: nowrap;
        }

        .pic-btn:disabled {
          opacity: 0.45;
          cursor: default;
          transform: none !important;
          box-shadow: none !important;
        }

        .pic-btn-call {
          background: var(--color-accent);
          color: #fff;
          box-shadow: 0 3px 12px rgba(236,111,22,0.32);
        }

        .pic-btn-call:hover:not(:disabled) {
          background: var(--color-accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(236,111,22,0.44);
        }

        .pic-btn-call:active:not(:disabled) { transform: scale(0.97); }

        .pic-btn-wa {
          background: var(--color-bg-section);
          color: var(--color-primary);
          border: 1.5px solid var(--color-border);
        }

        .pic-btn-wa:hover:not(:disabled) {
          background: #f0fdf4;
          border-color: #16a34a;
          color: #16a34a;
          transform: translateY(-2px);
        }

        /* ── DETAILS BODY ── */
        .pic-body {
          padding: 18px 20px 20px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .pic-section-label {
          font-size: 10.5px;
          font-weight: 700;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .pic-section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--color-border);
        }

        .pic-detail-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 12px;
          background: var(--color-bg-section);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          margin-bottom: 6px;
          transition: border-color 0.2s, background 0.2s;
        }

        .pic-detail-row:last-child { margin-bottom: 0; }

        .pic-detail-row:hover {
          border-color: rgba(236,111,22,0.3);
          background: var(--color-accent-soft);
        }

        .pic-detail-row svg {
          color: var(--color-accent);
          flex-shrink: 0;
          margin-top: 1px;
        }

        .pic-detail-label {
          font-size: 10.5px;
          font-weight: 600;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin-bottom: 2px;
        }

        .pic-detail-value {
          font-size: 13.5px;
          color: var(--color-primary);
          font-weight: 500;
          line-height: 1.4;
        }

        /* Service areas block */
        .pic-areas-wrap {
          margin-top: 10px;
        }

        .pic-areas-label-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }

        .pic-areas-label {
          font-size: 10.5px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--color-text-secondary);
        }

        .pic-areas {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .pic-area-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          background: var(--color-bg);
          border-radius: 999px;
          border: 1px solid var(--color-border);
          font-size: 11.5px;
          font-weight: 600;
          color: var(--color-text-secondary);
          max-width: 100%;
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

        @media (max-width: 640px) {
          .pic-hero { height: 200px; }
          .pic-contact { grid-template-columns: 1fr; }
          .pic-name { font-size: 18px; }
          .pic-name-row { flex-wrap: wrap; }
        }
      `}</style>

      <div className="pic">
        {/* Hero image */}
        <div className="pic-hero">
          <img
            src={provider.gallery[0]?.url}
            alt={provider.name}
            className="pic-hero-img"
          />

          <div className="pic-hero-badges">
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
          <div className="pic-name-row">
            <h2 className="pic-name">{provider.name}</h2>
            {provider.pricing && (
              <div className="pic-price-block">
                {/* Reserved for future “from USD xx” */}
              </div>
            )}
          </div>

          {provider.tagline && (
            <p className="pic-tagline">{provider.tagline}</p>
          )}

          <div className="pic-stars-row">
            <div className="pic-stars">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={13}
                  fill={s <= Math.floor(provider.rating) ? "#F59E0B" : "none"}
                  stroke="#F59E0B"
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <span className="pic-rating-num">{provider.rating.toFixed(1)}</span>
            <span className="pic-rating-ct">
              ({provider.reviewCount} reviews)
            </span>
          </div>

          <div className="pic-stats">
            <span className="pic-stat-chip">
              <Briefcase size={12} strokeWidth={2} />
              {provider.yearsExperience}yr exp
            </span>
            {provider.stats?.jobsCompleted > 0 && (
              <span className="pic-stat-chip">
                <CheckCircle size={12} strokeWidth={2} />
                {provider.stats.jobsCompleted} jobs
              </span>
            )}
          </div>
        </div>

        {/* Contact buttons */}
        <div className="pic-contact">
          <button
            className="pic-btn pic-btn-call"
            onClick={handleCall}
            disabled={!hasPhone}
          >
            <Phone size={15} strokeWidth={2.5} />
            {hasPhone ? "Call Now" : "No Phone"}
          </button>
          <button
            className="pic-btn pic-btn-wa"
            onClick={handleWhatsApp}
            disabled={!hasWhatsapp}
          >
            <MessageCircle size={15} strokeWidth={2.5} />
            WhatsApp
          </button>
        </div>

        {/* Details body – location + neatly formatted service areas */}
        <div className="pic-body">
          <div>
            <div className="pic-section-label">Location</div>
            <div className="pic-detail-row">
              <MapPin size={15} strokeWidth={2} />
              <div>
                <div className="pic-detail-label">Based in</div>
                <div className="pic-detail-value">{provider.city}</div>
              </div>
            </div>

            {provider.areas.length > 0 && (
              <div className="pic-areas-wrap">
                <div className="pic-areas-label-row">
                  <MapPin size={12} strokeWidth={2} />
                  <span className="pic-areas-label">Service areas</span>
                </div>
                <div className="pic-areas">
                  {provider.areas.map((area, i) => (
                    <span key={i} className="pic-area-tag">
                      <span className="pic-area-dot" />
                      <span className="pic-area-name">{area}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProviderInfoCard;
