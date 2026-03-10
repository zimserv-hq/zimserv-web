// src/components/Provider/ProviderContent.tsx
import { useState, useEffect } from "react";
import {
  Star,
  CheckCircle,
  ImageOff,
  MessageSquare,
  DollarSign,
  Award,
  Users,
  Globe,
  TrendingUp,
  Clock,
  ShieldCheck,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from "lucide-react";
import type { ProviderPublic } from "../../types/provider";

interface ProviderContentProps {
  provider: ProviderPublic;
}

const ProviderContent = ({ provider }: ProviderContentProps) => {
  const [activeTab, setActiveTab] = useState<"about" | "reviews" | "gallery">(
    "about",
  );
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Only treat gallery as populated if it has real portfolio images (not just the fallback profile pic)
  const realGallery =
    provider.gallery?.filter((img) => img.id !== "primary") ?? [];
  const hasGallery = realGallery.length > 0;
  const hasServices = provider.services && provider.services.length > 0;

  // Close lightbox on Escape, navigate with arrow keys
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight")
        setLightboxIndex((i) =>
          i !== null ? (i + 1) % realGallery.length : null,
        );
      if (e.key === "ArrowLeft")
        setLightboxIndex((i) =>
          i !== null ? (i - 1 + realGallery.length) % realGallery.length : null,
        );
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, realGallery.length]);

  return (
    <>
      <style>{`
        /* ══════════════════════════════════════════
           PROVIDER CONTENT — PREMIUM REDESIGN
        ══════════════════════════════════════════ */
        .pc-wrap {
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04);
        }

        /* ── TABS ── */
        .pc-tabs {
          display: flex;
          background: var(--color-bg-section);
          border-bottom: 1.5px solid var(--color-border);
          padding: 0 8px;
          gap: 2px;
        }

        .pc-tab {
          position: relative;
          padding: 16px 20px 14px;
          background: transparent;
          border: none;
          color: var(--color-text-secondary);
          font-family: var(--font-primary);
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.2s;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 7px;
          letter-spacing: 0.1px;
        }

        .pc-tab::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 16px;
          right: 16px;
          height: 2.5px;
          background: var(--color-accent);
          border-radius: 2px 2px 0 0;
          transform: scaleX(0);
          transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .pc-tab.active {
          color: var(--color-accent);
          font-weight: 800;
        }

        .pc-tab.active::after {
          transform: scaleX(1);
        }

        .pc-tab:hover:not(.active) {
          color: var(--color-primary);
          background: rgba(0,0,0,0.025);
          border-radius: 10px 10px 0 0;
        }

        .pc-tab-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          height: 20px;
          padding: 0 6px;
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          color: var(--color-text-secondary);
          border-radius: 999px;
          font-size: 10.5px;
          font-weight: 700;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }

        .pc-tab.active .pc-tab-count {
          background: var(--color-accent);
          color: #fff;
          border-color: var(--color-accent);
        }

        /* ── BODY ── */
        .pc-body {
          padding: 28px;
        }

        .pc-section-title {
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 800;
          color: var(--color-primary);
          letter-spacing: -0.1px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pc-section-title::before {
          display: none;
        }

        .pc-description {
          font-size: 14px;
          color: var(--color-text-secondary);
          line-height: 1.85;
          margin-bottom: 24px;
          padding: 16px 18px;
          background: var(--color-bg-section);
          border-radius: 12px;
          border: 1px solid var(--color-border);
          overflow-wrap: break-word;
          word-break: break-word;
          overflow: hidden;
          min-width: 0;
        }

        .pc-divider {
          height: 1px;
          background: var(--color-border);
          margin: 24px 0;
        }

        /* Info stat boxes */
        .pc-about-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 28px;
        }

        .pc-about-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 12px;
          background: var(--color-bg-section);
          border: 1px solid var(--color-border);
          transition: all 0.2s ease;
        }

        .pc-about-item:hover {
          border-color: rgba(236,111,22,0.3);
          background: var(--color-accent-soft);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(236,111,22,0.08);
        }

        .pc-about-icon {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: var(--color-accent-soft);
          color: var(--color-accent);
          border: 1px solid rgba(236,111,22,0.15);
        }

        .pc-about-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: var(--color-text-secondary);
          margin-bottom: 3px;
        }

        .pc-about-value {
          font-size: 13px;
          color: var(--color-primary);
          font-weight: 600;
          line-height: 1.35;
        }

        .pc-about-value a {
          color: var(--color-accent);
          text-decoration: none;
          font-weight: 600;
        }

        .pc-about-value a:hover {
          text-decoration: underline;
        }

        /* ── SERVICES ── */
        .pc-services-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-bottom: 28px;
        }

        .pc-service-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          background: var(--color-bg-section);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          transition: all 0.22s ease;
          cursor: default;
          position: relative;
          overflow: hidden;
        }

        .pc-service-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 0;
          background: var(--color-accent);
          transition: width 0.2s ease;
          border-radius: 0 2px 2px 0;
        }

        .pc-service-item:hover::before {
          width: 3px;
        }

        .pc-service-item:hover {
          border-color: rgba(236,111,22,0.35);
          background: var(--color-accent-soft);
          transform: translateX(2px);
          box-shadow: 0 2px 10px rgba(236,111,22,0.09);
        }

        .pc-service-icon {
          width: 28px;
          height: 28px;
          background: var(--color-accent-soft);
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--color-accent);
          transition: background 0.2s, color 0.2s;
          border: 1px solid rgba(236,111,22,0.12);
        }

        .pc-service-item:hover .pc-service-icon {
          background: var(--color-accent);
          color: #fff;
          border-color: var(--color-accent);
        }

        .pc-service-name {
          flex: 1;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--color-primary);
          min-width: 0;
          line-height: 1.3;
        }

        .pc-service-price {
          font-size: 13px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 999px;
          white-space: nowrap;
          flex-shrink: 0;
          letter-spacing: 0.2px;
        }

        .pc-service-price.has-price {
          color: var(--color-primary);
          background: var(--color-accent-soft);
          border: 1px solid rgba(236,111,22,0.2);
        }

        .pc-service-price.no-price {
          color: var(--color-text-secondary);
          background: var(--color-bg);
          border: 1px solid var(--color-border);
        }

        /* ── PRICING BOX ── */
        .pc-pricing-box {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          padding: 18px 20px;
          background: var(--color-bg-section);
          border: 1px solid var(--color-border);
          border-radius: 14px;
          position: relative;
          overflow: hidden;
        }

        .pc-pricing-box::before {
          display: none;
        }

        .pc-pricing-icon {
          width: 38px;
          height: 38px;
          background: var(--color-accent-soft);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-accent);
          flex-shrink: 0;
          border: 1px solid rgba(236,111,22,0.15);
        }

        .pc-pricing-label {
          font-size: 10px;
          font-weight: 800;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.7px;
          margin-bottom: 5px;
        }

        .pc-pricing-text {
          font-size: 14px;
          color: black;
          line-height: 1.6;
          font-weight: 600;
        }

        /* ── REVIEWS ── */
        .pc-reviews-panel {
          border: 1px solid var(--color-border);
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .pc-reviews-header {
          display: flex;
          align-items: stretch;
        }

        .pc-reviews-score-col {
          padding: 22px 26px;
          text-align: center;
          background: var(--color-bg-section);
          border-right: 1px solid var(--color-border);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          min-width: 120px;
        }

        .pc-reviews-big {
          font-size: 52px;
          font-weight: 800;
          color: var(--color-primary);
          letter-spacing: -4px;
          line-height: 1;
        }

        .pc-reviews-stars {
          display: flex;
          gap: 3px;
          justify-content: center;
        }

        .pc-reviews-ct {
          font-size: 11.5px;
          color: var(--color-text-secondary);
          font-weight: 500;
          margin-top: 1px;
        }

        .pc-reviews-meta-col {
          flex: 1;
          padding: 18px 22px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          justify-content: center;
        }

        .pc-reviews-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          padding: 6px 10px;
          border-radius: 8px;
          transition: background 0.15s;
        }

        .pc-reviews-meta-row:hover {
          background: var(--color-bg-section);
        }

        .pc-reviews-meta-row-icon {
          display: flex;
          align-items: center;
          gap: 7px;
          color: var(--color-text-secondary);
        }

        .pc-reviews-meta-row-icon svg {
          color: var(--color-accent);
        }

        .pc-reviews-meta-row strong {
          color: var(--color-primary);
          font-weight: 700;
          font-size: 13px;
        }

        .pc-coming-soon {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 20px;
          background: var(--color-bg-section);
          border: 1px dashed var(--color-border);
          border-radius: 12px;
        }

        .pc-coming-soon-icon {
          width: 38px;
          height: 38px;
          background: var(--color-bg);
          border-radius: 10px;
          border: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-secondary);
          flex-shrink: 0;
        }

        .pc-coming-soon p {
          font-size: 13px;
          color: var(--color-text-secondary);
          margin: 0;
          line-height: 1.55;
        }

        /* ── GALLERY ── */
        .pc-gallery-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .pc-gal-item {
          aspect-ratio: 4/3;
          border-radius: 14px;
          overflow: hidden;
          position: relative;
          border: 1.5px solid var(--color-border);
          cursor: pointer;
          transition: all 0.25s ease;
          background: var(--color-bg-section);
        }

        .pc-gal-item:hover {
          border-color: var(--color-accent);
          transform: scale(1.015);
          box-shadow: 0 8px 28px rgba(0,0,0,0.13);
        }

        .pc-gal-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.5s ease;
          display: block;
        }

        .pc-gal-item:hover .pc-gal-img {
          transform: scale(1.07);
        }

        .pc-gal-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 55%);
          opacity: 0;
          transition: opacity 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pc-gal-item:hover .pc-gal-overlay { opacity: 1; }

        .pc-gal-zoom-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary);
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        /* ── LIGHTBOX ── */
        .pc-lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.92);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pc-lb-fade 0.2s ease;
          backdrop-filter: blur(6px);
        }

        @keyframes pc-lb-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .pc-lightbox-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
          z-index: 2;
        }
        .pc-lightbox-close:hover { background: rgba(255,255,255,0.22); }

        .pc-lightbox-counter {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255,255,255,0.7);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .pc-lightbox-img-wrap {
          max-width: 90vw;
          max-height: 82vh;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pc-lb-scale 0.2s cubic-bezier(0.22,1,0.36,1);
        }

        @keyframes pc-lb-scale {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }

        .pc-lightbox-img {
          max-width: 90vw;
          max-height: 82vh;
          object-fit: contain;
          border-radius: 10px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.6);
          display: block;
        }

        .pc-lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
          z-index: 2;
        }
        .pc-lightbox-nav:hover { background: rgba(255,255,255,0.22); }
        .pc-lightbox-nav.prev { left: 16px; }
        .pc-lightbox-nav.next { right: 16px; }

        .pc-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 40px 20px;
          gap: 8px;
          border: 1px dashed var(--color-border);
          border-radius: 14px;
          background: var(--color-bg-section);
        }

        .pc-empty-icon {
          width: 48px;
          height: 48px;
          background: var(--color-bg);
          border-radius: 12px;
          border: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-secondary);
          margin-bottom: 6px;
        }

        .pc-empty p {
          font-size: 14px;
          color: var(--color-text-secondary);
          margin: 0;
        }

        @media (max-width: 900px) {
          .pc-body { padding: 20px; }
          .pc-services-grid { grid-template-columns: 1fr; }
          .pc-gallery-grid { grid-template-columns: 1fr; }
          .pc-about-grid { grid-template-columns: 1fr; }
          .pc-reviews-header { flex-direction: column; }
          .pc-reviews-score-col {
            border-right: none;
            border-bottom: 1px solid var(--color-border);
            flex-direction: row;
            gap: 16px;
            padding: 16px 20px;
            min-width: auto;
          }
          .pc-reviews-big { font-size: 40px; letter-spacing: -2px; }
        }

        @media (max-width: 640px) {
          .pc-body { padding: 16px; }
          .pc-tab { padding: 14px 12px; font-size: 12.5px; }
          .pc-section-title { font-size: 13.5px; }
        }
      `}</style>

      <div className="pc-wrap">
        {/* Tabs */}
        <div className="pc-tabs">
          <button
            className={`pc-tab ${activeTab === "about" ? "active" : ""}`}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
          <button
            className={`pc-tab ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
            <span className="pc-tab-count">{provider.reviewCount}</span>
          </button>
          <button
            className={`pc-tab ${activeTab === "gallery" ? "active" : ""}`}
            onClick={() => setActiveTab("gallery")}
          >
            Gallery
            {hasGallery && (
              <span className="pc-tab-count">{realGallery.length}</span>
            )}
          </button>
        </div>

        <div className="pc-body">
          {/* ── ABOUT ── */}
          {activeTab === "about" && (
            <>
              <div className="pc-section-title">About {provider.name}</div>
              <p className="pc-description">
                {provider.description || "No description provided yet."}
              </p>

              <div className="pc-about-grid">
                <div className="pc-about-item">
                  <div className="pc-about-icon">
                    <Award size={14} strokeWidth={2} />
                  </div>
                  <div>
                    <div className="pc-about-label">Experience</div>
                    <div className="pc-about-value">
                      {provider.yearsExperience} years in the field
                    </div>
                  </div>
                </div>

                {provider.languages.length > 0 && (
                  <div className="pc-about-item">
                    <div className="pc-about-icon">
                      <Users size={14} strokeWidth={2} />
                    </div>
                    <div>
                      <div className="pc-about-label">Languages</div>
                      <div className="pc-about-value">
                        {provider.languages.join(", ")}
                      </div>
                    </div>
                  </div>
                )}

                {provider.contact.website && (
                  <div className="pc-about-item">
                    <div className="pc-about-icon">
                      <Globe size={14} strokeWidth={2} />
                    </div>
                    <div>
                      <div className="pc-about-label">Website</div>
                      <div className="pc-about-value">
                        <a
                          href={
                            provider.contact.website.startsWith("http")
                              ? provider.contact.website
                              : `https://${provider.contact.website}`
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          {provider.contact.website}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pc-divider" />

              <div className="pc-section-title">Services Offered</div>
              {hasServices ? (
                <div className="pc-services-grid">
                  {provider.services.map((service, index) => (
                    <div key={index} className="pc-service-item">
                      <div className="pc-service-icon">
                        <CheckCircle size={13} strokeWidth={2.5} />
                      </div>
                      <span className="pc-service-name">{service.name}</span>
                      <span
                        className={`pc-service-price ${
                          service.price != null ? "has-price" : "no-price"
                        }`}
                      >
                        {service.price != null ? `$${service.price}` : "Quote"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--color-text-secondary)",
                    marginBottom: 24,
                  }}
                >
                  No services listed yet.
                </p>
              )}

              <div className="pc-divider" />

              <div className="pc-section-title">Pricing</div>
              <div className="pc-pricing-box">
                <div className="pc-pricing-icon">
                  <DollarSign size={16} strokeWidth={2} />
                </div>
                <div>
                  <div className="pc-pricing-label">Rate Details</div>
                  <div className="pc-pricing-text">
                    {provider.pricingSummary ||
                      "Contact this provider for a detailed quote based on your specific job requirements."}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── REVIEWS ── */}
          {activeTab === "reviews" && (
            <>
              <div className="pc-section-title">Customer Reviews</div>

              <div className="pc-reviews-panel">
                <div className="pc-reviews-header">
                  <div className="pc-reviews-score-col">
                    <div className="pc-reviews-big">
                      {provider.rating.toFixed(1)}
                    </div>
                    <div className="pc-reviews-stars">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={13}
                          fill={
                            s <= Math.floor(provider.rating)
                              ? "#F59E0B"
                              : "none"
                          }
                          stroke="#F59E0B"
                          strokeWidth={1.5}
                        />
                      ))}
                    </div>
                    <div className="pc-reviews-ct">
                      {provider.reviewCount} review
                      {provider.reviewCount !== 1 ? "s" : ""}
                    </div>
                  </div>

                  <div className="pc-reviews-meta-col">
                    <div className="pc-reviews-meta-row">
                      <div className="pc-reviews-meta-row-icon">
                        <TrendingUp size={14} strokeWidth={2} />
                        Jobs completed
                      </div>
                      <strong>{provider.stats.jobsCompleted}</strong>
                    </div>
                    <div className="pc-reviews-meta-row">
                      <div className="pc-reviews-meta-row-icon">
                        <Clock size={14} strokeWidth={2} />
                        Response time
                      </div>
                      <strong>{provider.stats.responseTime}</strong>
                    </div>
                    <div className="pc-reviews-meta-row">
                      <div className="pc-reviews-meta-row-icon">
                        <ShieldCheck size={14} strokeWidth={2} />
                        Verification
                      </div>
                      <strong>{provider.verificationLevel || "Basic"}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pc-coming-soon">
                <div className="pc-coming-soon-icon">
                  <MessageSquare size={18} strokeWidth={1.5} />
                </div>
                <p>
                  Detailed reviews will appear here once the review system is
                  live.
                </p>
              </div>
            </>
          )}

          {/* ── GALLERY ── */}
          {activeTab === "gallery" && (
            <>
              <div className="pc-section-title">Work Gallery</div>
              {hasGallery ? (
                <div className="pc-gallery-grid">
                  {realGallery.map((image, index) => (
                    <div
                      key={image.id}
                      className="pc-gal-item"
                      onClick={() => setLightboxIndex(index)}
                    >
                      <img
                        src={image.url}
                        alt={`Work sample ${index + 1}`}
                        className="pc-gal-img"
                        loading="lazy"
                      />
                      <div className="pc-gal-overlay">
                        <div className="pc-gal-zoom-icon">
                          <ZoomIn size={16} strokeWidth={2} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="pc-empty">
                  <div className="pc-empty-icon">
                    <ImageOff size={20} strokeWidth={1.5} />
                  </div>
                  <p>No photos uploaded yet.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── LIGHTBOX ── */}
      {lightboxIndex !== null && (
        <div
          className="pc-lightbox-overlay"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="pc-lightbox-close"
            onClick={() => setLightboxIndex(null)}
          >
            <X size={18} strokeWidth={2.5} />
          </button>

          {realGallery.length > 1 && (
            <div className="pc-lightbox-counter">
              {lightboxIndex + 1} / {realGallery.length}
            </div>
          )}

          {realGallery.length > 1 && (
            <button
              className="pc-lightbox-nav prev"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(
                  (lightboxIndex - 1 + realGallery.length) % realGallery.length,
                );
              }}
            >
              <ChevronLeft size={22} strokeWidth={2} />
            </button>
          )}

          <div
            className="pc-lightbox-img-wrap"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={realGallery[lightboxIndex].url}
              alt={`Work sample ${lightboxIndex + 1}`}
              className="pc-lightbox-img"
            />
          </div>

          {realGallery.length > 1 && (
            <button
              className="pc-lightbox-nav next"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((lightboxIndex + 1) % realGallery.length);
              }}
            >
              <ChevronRight size={22} strokeWidth={2} />
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default ProviderContent;
