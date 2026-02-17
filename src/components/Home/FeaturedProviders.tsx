// src/components/Home/FeaturedProviders.tsx
import { useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  CheckCircle,
  ArrowRight,
  Phone,
  MessageCircle,
} from "lucide-react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const FEATURED_PROVIDERS = [
  {
    id: "abc-plumbing",
    slug: "abc-plumbing-harare",
    name: "ABC Plumbing Services",
    category: "Plumbing",
    tagline: "24/7 Emergency Plumbing Experts",
    city: "Harare",
    areas: ["Borrowdale", "Mount Pleasant", "Avondale"],
    rating: 4.9,
    reviewCount: 127,
    verified: true,
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=400&fit=crop&q=80",
    yearsExperience: 8,
    pricing: "$25",
  },
  {
    id: "elite-electrical",
    slug: "elite-electrical-bulawayo",
    name: "Elite Electrical Solutions",
    category: "Electrical",
    tagline: "Certified & Insured Electricians",
    city: "Bulawayo",
    areas: ["Suburbs", "Hillside", "North End"],
    rating: 5.0,
    reviewCount: 94,
    verified: true,
    image:
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=400&fit=crop&q=80",
    yearsExperience: 12,
    pricing: "$30",
  },
  {
    id: "sparkle-cleaning",
    slug: "sparkle-cleaning-harare",
    name: "Sparkle Cleaning Co.",
    category: "Cleaning",
    tagline: "Professional Home & Office Cleaning",
    city: "Harare",
    areas: ["CBD", "Eastlea", "Glen Lorne"],
    rating: 4.8,
    reviewCount: 203,
    verified: true,
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop&q=80",
    yearsExperience: 5,
    pricing: "$20",
  },
  {
    id: "techfix-it",
    slug: "techfix-it-solutions-harare",
    name: "TechFix IT Solutions",
    category: "IT & Tech",
    tagline: "Expert Computer Repair & Networking",
    city: "Harare",
    areas: ["Newlands", "Highlands", "Greendale"],
    rating: 4.9,
    reviewCount: 156,
    verified: true,
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=80",
    yearsExperience: 10,
    pricing: "$35",
  },
];

const FeaturedProviders = () => {
  const navigate = useNavigate();
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { elementRef: gridRef, isVisible: gridVisible } = useScrollReveal({
    threshold: 0.05,
  });

  return (
    <>
      <style>{`
        /* ── SECTION ──────────────────────────────────────── */
        .fp-section {
          width: 100%;
          background: var(--color-bg-section);
          padding: 88px 0;
          font-family: var(--font-primary);
          position: relative;
        }

        .fp-section::before,
        .fp-section::after {
          content: '';
          position: absolute;
          left: 0; right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            var(--color-border) 20%,
            var(--color-border) 80%,
            transparent
          );
        }
        .fp-section::before { top: 0; }
        .fp-section::after  { bottom: 0; }

        .fp-container {
          max-width: var(--container-max-width);
          margin: 0 auto;
          padding: 0 var(--container-padding);
        }

        /* ── HEADER ───────────────────────────────────────── */
        .fp-header {
          text-align: center;
          margin-bottom: 56px;
        }

        .fp-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: var(--color-accent-soft);
          color: var(--color-accent);
          padding: 5px 14px;
          border-radius: var(--radius-full);
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .fp-title {
          font-family: var(--font-primary);
          font-size: 35px;
          font-weight: 800;
          color: var(--color-primary);
          margin-bottom: 12px;
          line-height: 1.15;
          letter-spacing: -1px;
        }

        .fp-subtitle {
          font-size: 16px;
          color: var(--color-text-secondary);
          max-width: 560px;
          margin: 0 auto;
          line-height: 1.65;
        }

        /* ── GRID ─────────────────────────────────────────── */
        .fp-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 28px;
          margin-bottom: 48px;
        }

        /* ── PROVIDER CARD ────────────────────────────────── */
        .fp-card {
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 24px;
          display: flex;
          gap: 20px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition:
            transform var(--transition-base),
            border-color var(--transition-base),
            box-shadow var(--transition-base);
        }

        .fp-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--color-accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }

        .fp-card:hover {
          transform: translateY(-4px);
          border-color: var(--color-accent-light);
          box-shadow: var(--shadow-lg);
        }

        .fp-card:hover::before {
          transform: scaleX(1);
        }

        /* ── IMAGE ────────────────────────────────────────── */
        .fp-img-wrap {
          width: 120px;
          height: 120px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          flex-shrink: 0;
          background: var(--color-bg-soft);
          position: relative;
        }

        .fp-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.4s ease;
        }

        .fp-card:hover .fp-img {
          transform: scale(1.08);
        }

        /* verified badge on image */
        .fp-verified-badge {
          position: absolute;
          bottom: 8px;
          right: 8px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--color-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--color-bg);
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
        }

        .fp-verified-badge svg {
          color: #fff;
        }

        /* ── CONTENT ──────────────────────────────────────── */
        .fp-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .fp-top {
          margin-bottom: 10px;
        }

        /* Header Row: Name + Price */
        .fp-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 4px;
        }

        .fp-name {
          font-family: var(--font-primary);
          font-size: 18px;
          font-weight: 700;
          color: var(--color-primary);
          line-height: 1.3;
          letter-spacing: -0.3px;
          flex: 1;
        }

        /* Price Display */
        .fp-price {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          flex-shrink: 0;
        }

        .fp-price-label {
          font-size: 10px;
          font-weight: 600;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          line-height: 1;
        }

        .fp-price-amount {
          font-size: 20px;
          font-weight: 800;
          color: var(--color-accent);
          letter-spacing: -0.5px;
          line-height: 1.2;
          margin-top: 2px;
        }

        .fp-tagline {
          font-size: 13px;
          color: var(--color-text-secondary);
          line-height: 1.4;
          margin-bottom: 10px;
        }

        .fp-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .fp-rating {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
          font-weight: 600;
          color: var(--color-primary);
        }

        .fp-rating-icon {
          color: #F59E0B;
        }

        .fp-rating-count {
          font-size: 13px;
          font-weight: 400;
          color: var(--color-text-secondary);
        }

        .fp-location {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          color: var(--color-text-secondary);
        }

        .fp-location-icon {
          color: var(--color-accent);
          flex-shrink: 0;
        }

        .fp-category-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          background: var(--color-accent-soft);
          color: var(--color-accent);
          border-radius: var(--radius-full);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.3px;
        }

        .fp-areas {
          font-size: 12px;
          color: var(--color-text-secondary);
          margin-bottom: 14px;
          line-height: 1.5;
        }

        /* ── ACTIONS ──────────────────────────────────────── */
        .fp-actions {
          display: flex;
          gap: 8px;
          margin-top: auto;
        }

        .fp-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 16px;
          border: none;
          border-radius: var(--radius-md);
          font-family: var(--font-primary);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition:
            background var(--transition-fast),
            transform var(--transition-fast),
            box-shadow var(--transition-fast),
            border-color var(--transition-fast),
            color var(--transition-fast);
          white-space: nowrap;
        }

        .fp-btn-primary {
          background: var(--color-accent);
          color: #fff;
          box-shadow: var(--shadow-sm);
          flex: 1;
        }

        .fp-btn-primary:hover {
          background: var(--color-accent-hover);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .fp-btn-secondary {
          background: var(--color-bg);
          color: var(--color-accent);
          border: 1.5px solid var(--color-accent-light);
          flex: 1;
        }

        .fp-btn-secondary:hover {
          background: var(--color-accent-soft);
          border-color: var(--color-accent);
        }

        .fp-btn-profile {
          background: transparent;
          color: var(--color-text-secondary);
          border: 1.5px solid var(--color-border);
          padding: 10px 20px;
        }

        .fp-btn-profile:hover {
          background: var(--color-bg-section);
          border-color: var(--color-accent);
          color: var(--color-accent);
        }

        /* ── FOOTER ───────────────────────────────────────── */
        .fp-footer {
          text-align: center;
        }

        .fp-view-all {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 32px;
          background: transparent;
          border: 1.5px solid var(--color-accent);
          border-radius: var(--radius-full);
          color: var(--color-accent);
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.2px;
          position: relative;
          overflow: hidden;
          transition:
            background var(--transition-fast),
            color var(--transition-fast),
            transform var(--transition-fast),
            box-shadow var(--transition-fast);
        }

        .fp-view-all::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }

        .fp-view-all:hover::after { left: 100%; }

        .fp-view-all:hover {
          background: var(--color-accent);
          color: #fff;
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .fp-view-all:active { transform: scale(0.98); }

        .fp-view-all svg {
          transition: transform var(--transition-fast);
        }
        .fp-view-all:hover svg {
          transform: translateX(3px);
        }

        /* ── RESPONSIVE ───────────────────────────────────── */
        @media (max-width: 1200px) {
          .fp-section { padding: 72px 0; }
          .fp-grid { gap: 24px; }
          .fp-title { font-size: 36px; }
        }

        @media (max-width: 1024px) {
          .fp-container { padding: 0 32px; }
        }

        @media (max-width: 900px) {
          .fp-section { padding: 60px 0; }
          .fp-container { padding: 0 24px; }
          .fp-grid { grid-template-columns: 1fr; gap: 20px; }
          .fp-title { font-size: 32px; }
          .fp-subtitle { font-size: 15px; }
          .fp-header { margin-bottom: 40px; }
        }

        @media (max-width: 640px) {
          .fp-section { padding: 52px 0; }
          .fp-container { padding: 0 20px; }
          .fp-title { font-size: 28px; letter-spacing: -0.5px; }
          .fp-subtitle { font-size: 14px; }
          .fp-header { margin-bottom: 32px; }

          .fp-card {
            flex-direction: column;
            padding: 20px;
          }

          .fp-img-wrap {
            width: 100%;
            height: 200px;
          }

          .fp-meta { gap: 12px; }
          
          .fp-actions { 
            flex-wrap: wrap;
          }
          
          .fp-btn-primary,
          .fp-btn-secondary {
            flex: 1;
            min-width: calc(50% - 4px);
          }
          
          .fp-btn-profile {
            flex-basis: 100%;
            width: 100%;
          }

          .fp-header-row {
            gap: 8px;
          }

          .fp-price-amount {
            font-size: 18px;
          }
        }

        @media (max-width: 480px) {
          .fp-section { padding: 44px 0; }
          .fp-container { padding: 0 16px; }
          .fp-title { font-size: 26px; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <section className="fp-section">
        <div className="fp-container">
          {/* Header */}
          <div
            ref={headerRef as any}
            className={`fp-header scroll-reveal ${headerVisible ? "visible" : ""}`}
          >
            <div className="fp-eyebrow">
              <Star size={12} strokeWidth={2.5} />
              Featured Professionals
            </div>
            <h2 className="fp-title">Top-Rated Service Providers</h2>
            <p className="fp-subtitle">
              Handpicked professionals with proven track records and excellent
              customer reviews
            </p>
          </div>

          {/* Grid */}
          <div ref={gridRef as any} className="fp-grid">
            {FEATURED_PROVIDERS.map((provider) => (
              <div
                key={provider.id}
                className={`fp-card scroll-reveal-stagger ${gridVisible ? "visible" : ""}`}
                onClick={() => navigate(`/providers/${provider.slug}`)}
                role="button"
                aria-label={`View ${provider.name} profile`}
              >
                {/* Image */}
                <div className="fp-img-wrap">
                  <img
                    src={provider.image}
                    alt={provider.name}
                    className="fp-img"
                    loading="lazy"
                  />
                  {provider.verified && (
                    <div className="fp-verified-badge">
                      <CheckCircle size={14} strokeWidth={2.5} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="fp-content">
                  <div className="fp-top">
                    {/* Header Row: Name + Price */}
                    <div className="fp-header-row">
                      <h3 className="fp-name">{provider.name}</h3>

                      {/* Price Display */}
                      <div className="fp-price">
                        <span className="fp-price-label">From</span>
                        <span className="fp-price-amount">
                          {provider.pricing}
                        </span>
                      </div>
                    </div>

                    <p className="fp-tagline">{provider.tagline}</p>
                  </div>

                  <div className="fp-meta">
                    <div className="fp-rating">
                      <Star
                        size={16}
                        className="fp-rating-icon"
                        fill="#F59E0B"
                        strokeWidth={0}
                      />
                      <span>{provider.rating}</span>
                      <span className="fp-rating-count">
                        ({provider.reviewCount})
                      </span>
                    </div>
                    <div className="fp-location">
                      <MapPin
                        size={14}
                        className="fp-location-icon"
                        strokeWidth={2}
                      />
                      <span>{provider.city}</span>
                    </div>
                    <span className="fp-category-badge">
                      {provider.category}
                    </span>
                  </div>

                  <p className="fp-areas">
                    Serves: {provider.areas.join(", ")}
                  </p>

                  {/* Actions */}
                  <div className="fp-actions">
                    <button
                      className="fp-btn fp-btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `tel:+263`;
                      }}
                    >
                      <Phone size={14} strokeWidth={2.5} />
                      Contact
                    </button>
                    <button
                      className="fp-btn fp-btn-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://wa.me/263`, "_blank");
                      }}
                    >
                      <MessageCircle size={14} strokeWidth={2.5} />
                      WhatsApp
                    </button>
                    <button
                      className="fp-btn fp-btn-profile"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/providers/${provider.slug}`);
                      }}
                    >
                      View Profile
                      <ArrowRight size={14} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="fp-footer">
            <button
              className="fp-view-all btn-magnetic"
              onClick={() => navigate("/providers")}
            >
              View All Providers
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturedProviders;
