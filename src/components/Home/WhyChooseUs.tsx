// src/components/Home/WhyChooseUs.tsx
import { ShieldCheck, Zap, Star, MapPin, Lock, Headphones } from "lucide-react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Verified Professionals",
    description:
      "All service providers are thoroughly vetted and verified for your safety and peace of mind",
    color: "#10B981",
    bg: "#D1FAE5",
  },
  {
    icon: Star,
    title: "Trusted Reviews",
    description:
      "Real customer reviews and ratings help you make informed decisions about service providers",
    color: "#F59E0B",
    bg: "#FEF3C7",
  },
  {
    icon: Zap,
    title: "Instant Quotes",
    description:
      "Get quick responses and competitive quotes from multiple providers in minutes",
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    icon: MapPin,
    title: "Local Experts",
    description:
      "Connect with experienced professionals in your area who understand your local needs",
    color: "#EC4899",
    bg: "#FCE7F3",
  },
  {
    icon: Lock,
    title: "Secure Platform",
    description:
      "Your personal information is protected with industry-standard security measures",
    color: "#8B5CF6",
    bg: "#EDE9FE",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Our customer support team is always ready to help you with any questions or concerns",
    color: "#06B6D4",
    bg: "#CFFAFE",
  },
];

const WhyChooseUs = () => {
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { elementRef: gridRef, isVisible: gridVisible } = useScrollReveal({
    threshold: 0.05,
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        /* ── SECTION ──────────────────────────────────────── */
        .wcu-section {
          width: 100%;
          background: var(--color-bg);
          padding: 88px 0;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          position: relative;
        }

        .wcu-section::before,
        .wcu-section::after {
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
        .wcu-section::before { top: 0; }
        .wcu-section::after  { bottom: 0; }

        .wcu-container {
          max-width: var(--container-max-width);
          margin: 0 auto;
          padding: 0 var(--container-padding);
        }

        /* ── HEADER ───────────────────────────────────────── */
        .wcu-header {
          text-align: center;
          margin-bottom: 56px;
        }

        .wcu-eyebrow {
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

        .wcu-title {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-size: 40px;
          font-weight: 800;
          color: var(--color-primary);
          margin-bottom: 14px;
          line-height: 1.15;
          letter-spacing: -1px;
        }

        .wcu-subtitle {
          font-size: 16px;
          color: var(--color-text-secondary);
          max-width: 580px;
          margin: 0 auto;
          line-height: 1.65;
        }

        /* ── GRID ─────────────────────────────────────────── */
        .wcu-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        /* ── CARD ─────────────────────────────────────────── */
        .wcu-card {
          background: var(--color-bg-section);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 32px 28px;
          position: relative;
          overflow: hidden;
          transition:
            transform var(--transition-base),
            border-color var(--transition-base),
            box-shadow var(--transition-base);
        }

        /* top color bar */
        .wcu-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--fc);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
          border-radius: 0 0 2px 2px;
        }

        .wcu-card:hover {
          border-color: var(--fc);
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.1);
        }

        .wcu-card:hover::before {
          transform: scaleX(1);
        }

        /* ── ICON ─────────────────────────────────────────── */
        .wcu-icon-wrap {
          width: 64px;
          height: 64px;
          background: var(--fbg);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          transition:
            transform var(--transition-base),
            box-shadow var(--transition-base);
          flex-shrink: 0;
        }

        .wcu-card:hover .wcu-icon-wrap {
          transform: scale(1.1) rotate(-4deg);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .wcu-icon {
          color: var(--fc);
        }

        /* ── TEXT ─────────────────────────────────────────── */
        .wcu-card-title {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 10px;
          line-height: 1.3;
          letter-spacing: -0.3px;
        }

        .wcu-card-desc {
          font-size: 13.5px;
          color: var(--color-text-secondary);
          line-height: 1.65;
          font-weight: 400;
        }

        /* ── RESPONSIVE ───────────────────────────────────── */
        @media (max-width: 1200px) {
          .wcu-section { padding: 72px 0; }
          .wcu-grid    { gap: 20px; }
          .wcu-title   { font-size: 36px; }
        }

        @media (max-width: 1024px) {
          .wcu-container { padding: 0 32px; }
        }

        /* 2 columns on tablet */
        @media (max-width: 900px) {
          .wcu-section   { padding: 60px 0; }
          .wcu-container { padding: 0 24px; }
          .wcu-grid      { grid-template-columns: repeat(2, 1fr); gap: 18px; }
          .wcu-title     { font-size: 32px; }
          .wcu-subtitle  { font-size: 15px; }
          .wcu-header    { margin-bottom: 44px; }
          .wcu-card      { padding: 28px 24px; }
        }

        @media (max-width: 640px) {
          .wcu-section { padding: 52px 0; }
          .wcu-container { padding: 0 20px; }
          .wcu-title { font-size: 28px; letter-spacing: -0.5px; }
          .wcu-subtitle { font-size: 14px; }
          .wcu-header { margin-bottom: 36px; }

          .wcu-card { padding: 24px 20px; }
          .wcu-icon-wrap { width: 56px; height: 56px; margin-bottom: 16px; }
          .wcu-card-title { font-size: 15.5px; }
          .wcu-card-desc { font-size: 13px; }
        }

        /* single column on small mobile */
        @media (max-width: 480px) {
          .wcu-section   { padding: 44px 0; }
          .wcu-container { padding: 0 16px; }
          .wcu-grid      { grid-template-columns: 1fr; gap: 16px; }
          .wcu-title     { font-size: 26px; }
          .wcu-card      { padding: 24px 18px; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <section className="wcu-section">
        <div className="wcu-container">
          {/* Header */}
          <div
            ref={headerRef as any}
            className={`wcu-header scroll-reveal ${headerVisible ? "visible" : ""}`}
          >
            <div className="wcu-eyebrow">
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
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Why ZimServ
            </div>
            <h2 className="wcu-title">Why Choose Us?</h2>
            <p className="wcu-subtitle">
              We connect you with the best service providers in Zimbabwe, making
              home services simple and reliable
            </p>
          </div>

          {/* Grid */}
          <div ref={gridRef as any} className="wcu-grid">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`wcu-card scroll-reveal-stagger ${gridVisible ? "visible" : ""}`}
                  style={
                    {
                      "--fc": feature.color,
                      "--fbg": feature.bg,
                    } as React.CSSProperties
                  }
                >
                  <div className="wcu-icon-wrap">
                    <Icon size={28} className="wcu-icon" strokeWidth={2} />
                  </div>
                  <h3 className="wcu-card-title">{feature.title}</h3>
                  <p className="wcu-card-desc">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default WhyChooseUs;
