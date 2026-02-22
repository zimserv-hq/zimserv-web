import { useState } from "react";
import {
  Star,
  CheckCircle,
  ImageOff,
  MessageSquare,
  DollarSign,
  Award,
  Users,
  Globe,
} from "lucide-react";
import type { ProviderPublic } from "../../types/provider";

interface ProviderContentProps {
  provider: ProviderPublic;
}

const ProviderContent = ({ provider }: ProviderContentProps) => {
  const [activeTab, setActiveTab] = useState<"about" | "reviews" | "gallery">(
    "about",
  );

  const hasServices = provider.services && provider.services.length > 0;
  const hasGallery = provider.gallery && provider.gallery.length > 0;

  return (
    <>
      <style>{`
        /* ══════════════════════════════════════════
           PROVIDER CONTENT
        ══════════════════════════════════════════ */
        .pc-wrap {
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }

        /* ── TABS ── */
        .pc-tabs {
          display: flex;
          background: var(--color-bg-section);
          border-bottom: 1.5px solid var(--color-border);
          padding: 0 4px;
        }

        .pc-tab {
          position: relative;
          padding: 16px 22px;
          background: transparent;
          border: none;
          color: var(--color-text-secondary);
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.2s;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .pc-tab::after {
          content: '';
          position: absolute;
          bottom: -1.5px;
          left: 14px;
          right: 14px;
          height: 2.5px;
          background: var(--color-accent);
          border-radius: 2px 2px 0 0;
          transform: scaleX(0);
          transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .pc-tab.active {
          color: var(--color-accent);
          font-weight: 700;
        }

        .pc-tab.active::after {
          transform: scaleX(1);
        }

        .pc-tab:hover:not(.active) {
          color: var(--color-primary);
        }

        .pc-tab-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          height: 20px;
          padding: 0 5px;
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          color: var(--color-text-secondary);
          border-radius: 999px;
          font-size: 11px;
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
          font-size: 15px;
          font-weight: 700;
          color: var(--color-primary);
          letter-spacing: -0.2px;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .pc-section-title::before {
          content: '';
          display: inline-block;
          width: 3px;
          height: 16px;
          background: var(--color-accent);
          border-radius: 2px;
          flex-shrink: 0;
        }

        .pc-description {
          font-size: 14.5px;
          color: var(--color-text-secondary);
          line-height: 1.8;
          margin-bottom: 20px;
        }

        .pc-divider {
          height: 1px;
          background: var(--color-border);
          margin: 24px 0;
        }

        /* Small detail rows in About card */
        .pc-about-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 24px;
        }

        .pc-about-item {
          display: flex;
          gap: 8px;
          padding: 10px 11px;
          border-radius: var(--radius-md);
          background: var(--color-bg-section);
          border: 1px solid var(--color-border);
        }

        .pc-about-icon {
          width: 26px;
          height: 26px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: var(--color-bg);
          color: var(--color-accent);
        }

        .pc-about-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          color: var(--color-text-secondary);
          margin-bottom: 2px;
        }

        .pc-about-value {
          font-size: 13px;
          color: var(--color-primary);
          font-weight: 500;
        }

        .pc-about-value a {
          color: var(--color-accent);
          text-decoration: none;
        }

        .pc-about-value a:hover {
          text-decoration: underline;
        }

        /* ── SERVICES ── */
        .pc-services-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 9px;
          margin-bottom: 24px;
        }

        .pc-service-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          background: var(--color-bg-section);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          transition: all 0.2s ease;
          cursor: default;
        }

        .pc-service-item:hover {
          border-color: rgba(236,111,22,0.35);
          background: var(--color-accent-soft);
          transform: translateX(3px);
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
        }

        .pc-service-item:hover .pc-service-icon {
          background: var(--color-accent);
          color: #fff;
        }

        .pc-service-name {
          flex: 1;
          font-size: 13px;
          font-weight: 600;
          color: var(--color-primary);
          min-width: 0;
          line-height: 1.3;
        }

        .pc-service-price {
          font-size: 11.5px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: var(--radius-full);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .pc-service-price.has-price {
          color: var(--color-accent);
          background: var(--color-accent-soft);
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
          padding: 16px 18px;
          background: var(--color-bg-section);
          border: 1px solid var(--color-border);
          border-left: 3px solid var(--color-accent);
          border-radius: 0 var(--radius-md) var(--radius-md) 0;
        }

        .pc-pricing-icon {
          width: 34px;
          height: 34px;
          background: var(--color-accent-soft);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-accent);
          flex-shrink: 0;
        }

        .pc-pricing-label {
          font-size: 10.5px;
          font-weight: 700;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .pc-pricing-text {
          font-size: 14px;
          color: var(--color-primary);
          line-height: 1.6;
          font-weight: 500;
        }

        /* ── REVIEWS ── */
        .pc-reviews-panel {
          display: flex;
          background: var(--color-bg-section);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          margin-bottom: 16px;
        }

        .pc-reviews-score-col {
          padding: 20px 24px;
          text-align: center;
          border-right: 1px solid var(--color-border);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-width: 120px;
        }

        .pc-reviews-big {
          font-size: 48px;
          font-weight: 800;
          color: var(--color-primary);
          letter-spacing: -3px;
          line-height: 1;
        }

        .pc-reviews-stars {
          display: flex;
          gap: 3px;
          justify-content: center;
        }

        .pc-reviews-ct {
          font-size: 12px;
          color: var(--color-text-secondary);
          font-weight: 500;
        }

        .pc-reviews-meta-col {
          flex: 1;
          padding: 20px 22px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          justify-content: center;
        }

        .pc-reviews-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
        }

        .pc-reviews-meta-row span:first-child {
          color: var(--color-text-secondary);
        }

        .pc-reviews-meta-row strong {
          color: var(--color-primary);
          font-weight: 700;
        }

        .pc-coming-soon {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 18px;
          background: var(--color-bg-section);
          border: 1px dashed var(--color-border);
          border-radius: var(--radius-md);
        }

        .pc-coming-soon-icon {
          width: 36px;
          height: 36px;
          background: var(--color-bg);
          border-radius: 50%;
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
          line-height: 1.5;
        }

        /* ── GALLERY ── */
        .pc-gallery-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .pc-gallery-grid .pc-gal-item:first-child {
          grid-column: 1 / -1;
          aspect-ratio: 16/7;
        }

        .pc-gal-item {
          aspect-ratio: 4/3;
          border-radius: var(--radius-md);
          overflow: hidden;
          position: relative;
          border: 1.5px solid var(--color-border);
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .pc-gal-item:hover {
          border-color: var(--color-accent);
          transform: scale(1.015);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }

        .pc-gal-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.45s ease;
        }

        .pc-gal-item:hover .pc-gal-img {
          transform: scale(1.07);
        }

        .pc-gal-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 55%);
          opacity: 0;
          transition: opacity 0.25s ease;
        }

        .pc-gal-item:hover .pc-gal-overlay { opacity: 1; }

        .pc-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 36px 20px;
          gap: 8px;
        }

        .pc-empty-icon {
          width: 44px;
          height: 44px;
          background: var(--color-bg-section);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-secondary);
          margin-bottom: 4px;
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
          .pc-gallery-grid .pc-gal-item:first-child {
            grid-column: auto;
            aspect-ratio: 4/3;
          }
          .pc-about-grid { grid-template-columns: 1fr; }
          .pc-reviews-panel { flex-direction: column; }
          .pc-reviews-score-col {
            border-right: none;
            border-bottom: 1px solid var(--color-border);
            flex-direction: row;
            gap: 16px;
            padding: 16px 20px;
            min-width: auto;
          }
          .pc-reviews-big { font-size: 36px; letter-spacing: -1px; }
        }

        @media (max-width: 640px) {
          .pc-body { padding: 16px; }
          .pc-tab { padding: 14px 14px; font-size: 13px; }
          .pc-section-title { font-size: 14px; }
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
              <span className="pc-tab-count">{provider.gallery.length}</span>
            )}
          </button>
        </div>

        <div className="pc-body">
          {/* ABOUT */}
          {activeTab === "about" && (
            <>
              <div className="pc-section-title">About {provider.name}</div>
              <p className="pc-description">
                {provider.description || "No description provided yet."}
              </p>

              <div className="pc-about-grid">
                <div className="pc-about-item">
                  <div className="pc-about-icon">
                    <Award size={15} strokeWidth={2} />
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
                      <Users size={15} strokeWidth={2} />
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
                      <Globe size={15} strokeWidth={2} />
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

              <div className="pc-section-title">Services Offered</div>
              {hasServices ? (
                <div className="pc-services-grid">
                  {provider.services.map((service, index) => (
                    <div key={index} className="pc-service-item">
                      <div className="pc-service-icon">
                        <CheckCircle size={14} strokeWidth={2.5} />
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

          {/* REVIEWS */}
          {activeTab === "reviews" && (
            <>
              <div className="pc-section-title">Customer Reviews</div>

              <div className="pc-reviews-panel">
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
                          s <= Math.floor(provider.rating) ? "#F59E0B" : "none"
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
                    <span>Jobs completed</span>
                    <strong>{provider.stats.jobsCompleted}</strong>
                  </div>
                  <div className="pc-reviews-meta-row">
                    <span>Response time</span>
                    <strong>{provider.stats.responseTime}</strong>
                  </div>
                  <div className="pc-reviews-meta-row">
                    <span>Verification</span>
                    <strong>{provider.verificationLevel || "Basic"}</strong>
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

          {/* GALLERY */}
          {activeTab === "gallery" && (
            <>
              <div className="pc-section-title">Work Gallery</div>
              {hasGallery ? (
                <div className="pc-gallery-grid">
                  {provider.gallery.map((image) => (
                    <div key={image.id} className="pc-gal-item">
                      <img
                        src={image.url}
                        alt="Work sample"
                        className="pc-gal-img"
                        loading="lazy"
                      />
                      <div className="pc-gal-overlay" />
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
    </>
  );
};

export default ProviderContent;
