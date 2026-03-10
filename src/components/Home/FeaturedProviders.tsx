// src/components/Home/FeaturedProviders.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  CheckCircle,
  ArrowRight,
  Phone,
  MessageCircle,
  Clock,
} from "lucide-react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { supabase } from "../../lib/supabaseClient";

type FeaturedProvider = {
  id: string;
  slug: string;
  name: string;
  category: string;
  tagline: string;
  city: string;
  areas: string[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  image: string;
  yearsExperience: number;
  pricing: string;
  phone: string;
  whatsapp: string;
};

const FeaturedProviders = () => {
  const navigate = useNavigate();
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollReveal();

  const [providers, setProviders] = useState<FeaturedProvider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        console.log("[FeaturedProviders] Starting fetch...");

        const { data: providersData, error } = await supabase
          .from("providers")
          .select(
            "id, slug, business_name, primary_category, city, years_experience, avg_rating, total_reviews, profile_image_url, pricing_model, phone_number, whatsapp_number, verification_level, bio",
          )
          .eq("status", "active")
          .order("avg_rating", { ascending: false })
          .limit(8);

        console.log("[FeaturedProviders] providers query result:", {
          providersData,
          error,
        });

        if (error || !providersData) {
          console.warn(
            "[FeaturedProviders] No data or error, setting empty:",
            error,
          );
          setProviders([]);
          return;
        }

        const providerIds = providersData.map((p: any) => p.id);
        console.log("[FeaturedProviders] provider IDs:", providerIds);

        const { data: areasData, error: areasError } = await supabase
          .from("provider_service_areas")
          .select("provider_id, city, suburb")
          .in("provider_id", providerIds);

        console.log("[FeaturedProviders] areas result:", {
          areasData,
          areasError,
        });

        const mapped: FeaturedProvider[] = providersData.map((p: any) => {
          const displayName = p.business_name ?? "ZimServ Provider";
          const slug =
            p.slug ??
            displayName
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "");

          const areas = (areasData ?? [])
            .filter((a: any) => a.provider_id === p.id)
            .map((a: any) => a.suburb || a.city)
            .filter(Boolean)
            .filter(
              (v: string, i: number, arr: string[]) => arr.indexOf(v) === i,
            )
            .slice(0, 3);

          const rawPricing = (p.pricing_model || "").trim();
          const pricingMap: Record<string, string> = {
            hourly: "Hourly Rate",
            "hourly rate": "Hourly Rate",
            fixed: "Fixed Price",
            "fixed price": "Fixed Price",
            quote: "Quote-based",
            "quote-based": "Quote-based",
            "quote based": "Quote-based",
            negotiable: "Negotiable",
            daily: "Daily Rate",
            "daily rate": "Daily Rate",
            monthly: "Monthly Rate",
            "monthly rate": "Monthly Rate",
          };
          const pricingKey = rawPricing.toLowerCase();
          // If it's a dollar amount or pure number, ignore it
          const looksLikePrice = /^\$?\d/.test(rawPricing);
          const pricing = looksLikePrice
            ? "Quote-based"
            : pricingMap[pricingKey] || rawPricing || "Quote-based";

          return {
            id: p.id,
            slug,
            name: displayName,
            category: p.primary_category,
            tagline: p.bio || `${p.primary_category} specialist`,
            city: p.city,
            areas,
            rating: p.avg_rating ?? 0,
            reviewCount: p.total_reviews ?? 0,
            verified: p.verification_level !== "Basic",
            image: p.profile_image_url || "",
            yearsExperience: p.years_experience ?? 0,
            pricing,
            phone: p.phone_number || "",
            whatsapp: p.whatsapp_number || p.phone_number || "",
          };
        });

        console.log("[FeaturedProviders] mapped providers:", mapped);
        setProviders(mapped);
      } catch (err) {
        console.error("[FeaturedProviders] Unexpected error:", err);
        setProviders([]);
      } finally {
        setLoading(false);
        console.log("[FeaturedProviders] fetch complete, loading set to false");
      }
    };

    fetchProviders();
  }, []);

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
          font-size: 25px;
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

        /* ── SKELETON ─────────────────────────────────────── */
        @keyframes fp-shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }

        .fp-shimmer {
          background: linear-gradient(90deg, #f0f0f0 0px, #fafafa 40%, #e8e8e8 80%, #f0f0f0 100%);
          background-size: 600px 100%;
          animation: fp-shimmer 1.6s ease-in-out infinite;
          border-radius: 8px;
        }

        .fp-skeleton-card {
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 24px;
          display: flex;
          gap: 20px;
        }

        .fp-skeleton-img {
          width: 120px;
          height: 120px;
          border-radius: var(--radius-lg);
          flex-shrink: 0;
        }

        .fp-skeleton-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-top: 4px;
        }

        /* ── COMING SOON ──────────────────────────────────── */
        .fp-coming-soon {
          text-align: center;
          padding: 64px 24px;
          background: var(--color-bg);
          border: 1.5px dashed var(--color-border);
          border-radius: var(--radius-lg);
          margin-bottom: 48px;
        }

        .fp-coming-soon-icon {
          width: 72px;
          height: 72px;
          background: var(--color-accent-soft);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: var(--color-accent);
        }

        .fp-coming-soon-title {
          font-size: 22px;
          font-weight: 800;
          color: var(--color-primary);
          margin-bottom: 8px;
          letter-spacing: -0.4px;
        }

        .fp-coming-soon-text {
          font-size: 15px;
          color: var(--color-text-secondary);
          line-height: 1.6;
          max-width: 400px;
          margin: 0 auto;
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

        .fp-card:hover::before { transform: scaleX(1); }

        /* ── IMAGE ────────────────────────────────────────── */
        .fp-img-wrap {
          width: 120px;
          height: 120px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          flex-shrink: 0;
          background: var(--color-bg-section);
          position: relative;
        }

        .fp-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          transition: transform 0.4s ease;
          z-index: 1;
        }

        .fp-card:hover .fp-img { transform: scale(1.08); }

        .fp-verified-badge {
          position: absolute;
          bottom: 6px;
          right: 6px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--color-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--color-bg);
          z-index: 2;
        }

        .fp-verified-badge svg { color: #fff; }

        .fp-img-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-accent-soft);
          color: var(--color-accent);
          font-size: 40px;
          font-weight: 800;
          font-family: var(--font-primary);
          letter-spacing: -1px;
        }

        /* ── CONTENT ──────────────────────────────────────── */
        .fp-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

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
          font-size: 18px;
          font-weight: 800;
          color: var(--color-accent);
          letter-spacing: -0.5px;
          line-height: 1.2;
          margin-top: 2px;
        }

        .fp-price-quote {
          font-size: 12px;
          font-weight: 700;
          color: var(--color-text-secondary);
          margin-top: 4px;
        }

        .fp-tagline {
          font-size: 13px;
          color: var(--color-text-secondary);
          line-height: 1.4;
          margin-top: 10px;
          margin-bottom: 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .fp-meta {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }

        .fp-rating {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
          font-weight: 600;
          color: var(--color-primary);
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
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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
        .fp-footer { text-align: center; }

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
        .fp-view-all svg { transition: transform var(--transition-fast); }
        .fp-view-all:hover svg { transform: translateX(3px); }

        /* ── RESPONSIVE ───────────────────────────────────── */
        @media (max-width: 1200px) {
          .fp-section { padding: 72px 0; }
          .fp-grid { gap: 24px; }
          .fp-title { font-size: 22px; }
        }

        @media (max-width: 1024px) {
          .fp-container { padding: 0 32px; }
          .fp-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 900px) {
          .fp-section { padding: 60px 0; }
          .fp-container { padding: 0 24px; }
          .fp-grid { grid-template-columns: 1fr; gap: 20px; }
          .fp-title { font-size: 22px; }
          .fp-subtitle { font-size: 15px; }
          .fp-header { margin-bottom: 40px; }
        }

        @media (max-width: 640px) {
          .fp-section { padding: 52px 0; }
          .fp-container { padding: 0 20px; }
          .fp-title { font-size: 20px; letter-spacing: -0.5px; }
          .fp-subtitle { font-size: 14px; }
          .fp-header { margin-bottom: 32px; }
          .fp-card { flex-direction: column; padding: 20px; }
          .fp-img-wrap { width: 100%; height: 250px; }
          .fp-img-placeholder { font-size: 56px; }
          .fp-meta { gap: 12px; }
          .fp-actions { flex-wrap: wrap; }
          .fp-btn-primary, .fp-btn-secondary { flex: 1; min-width: calc(50% - 4px); }
          .fp-btn-profile { flex-basis: 100%; width: 100%; }
          .fp-header-row { gap: 8px; }
          .fp-price-amount { font-size: 16px; }
        }

        @media (max-width: 480px) {
          .fp-section { padding: 44px 0; }
          .fp-container { padding: 0 16px; }
          .fp-title { font-size: 20px; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation: none !important; transition: none !important; }
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

          {/* Skeleton */}
          {loading && (
            <div className="fp-grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="fp-skeleton-card">
                  <div className="fp-shimmer fp-skeleton-img" />
                  <div className="fp-skeleton-body">
                    <div
                      className="fp-shimmer"
                      style={{ height: 20, width: "65%" }}
                    />
                    <div
                      className="fp-shimmer"
                      style={{ height: 14, width: "90%" }}
                    />
                    <div
                      className="fp-shimmer"
                      style={{ height: 14, width: "50%" }}
                    />
                    <div
                      className="fp-shimmer"
                      style={{ height: 12, width: "75%" }}
                    />
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <div
                        className="fp-shimmer"
                        style={{ height: 36, flex: 1, borderRadius: 8 }}
                      />
                      <div
                        className="fp-shimmer"
                        style={{ height: 36, flex: 1, borderRadius: 8 }}
                      />
                      <div
                        className="fp-shimmer"
                        style={{ height: 36, width: 80, borderRadius: 8 }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Coming Soon */}
          {!loading && providers.length === 0 && (
            <div className="fp-coming-soon">
              <div className="fp-coming-soon-icon">
                <Clock size={32} strokeWidth={1.5} />
              </div>
              <h3 className="fp-coming-soon-title">Providers Coming Soon</h3>
              <p className="fp-coming-soon-text">
                We're onboarding top professionals in your area. Check back soon
                or be the first to{" "}
                <span
                  style={{
                    color: "var(--color-accent)",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                  onClick={() => navigate("/become-provider")}
                >
                  join as a provider
                </span>
                .
              </p>
            </div>
          )}

          {/* Grid */}
          {!loading && providers.length > 0 && (
            <div className="fp-grid">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className="fp-card"
                  onClick={() => navigate(`/providers/${provider.slug}`)}
                  role="button"
                  aria-label={`View ${provider.name} profile`}
                >
                  {/* Image with blur backdrop */}
                  <div className="fp-img-wrap">
                    {provider.image ? (
                      <img
                        src={provider.image}
                        alt={provider.name}
                        className="fp-img"
                        loading="lazy"
                      />
                    ) : (
                      <div className="fp-img-placeholder">
                        {provider.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {provider.verified && (
                      <div className="fp-verified-badge">
                        <CheckCircle size={12} strokeWidth={2.5} />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="fp-content">
                    <div className="fp-header-row">
                      <h3 className="fp-name">{provider.name}</h3>
                      <span className="fp-price-quote">{provider.pricing}</span>
                    </div>

                    <p className="fp-tagline">{provider.tagline}</p>

                    <div className="fp-meta">
                      <div className="fp-rating">
                        <Star size={14} fill="#F59E0B" strokeWidth={0} />
                        <span>{provider.rating.toFixed(1)}</span>
                        <span className="fp-rating-count">
                          ({provider.reviewCount})
                        </span>
                      </div>
                      <div className="fp-location">
                        <MapPin
                          size={13}
                          strokeWidth={2}
                          style={{ color: "var(--color-accent)" }}
                        />
                        <span>{provider.city}</span>
                      </div>
                      <span className="fp-category-badge">
                        {provider.category}
                      </span>
                    </div>

                    {provider.areas.length > 0 && (
                      <p className="fp-areas">
                        Serves: {provider.areas.join(", ")}
                      </p>
                    )}

                    <div className="fp-actions">
                      <button
                        className="fp-btn fp-btn-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (provider.phone)
                            window.location.href = `tel:${provider.phone}`;
                        }}
                      >
                        <Phone size={14} strokeWidth={2.5} />
                        Contact
                      </button>
                      <button
                        className="fp-btn fp-btn-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (provider.whatsapp)
                            window.open(
                              `https://wa.me/${provider.whatsapp.replace(/\D/g, "")}`,
                              "_blank",
                            );
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
                        View
                        <ArrowRight size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

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
