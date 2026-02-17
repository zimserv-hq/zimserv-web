// src/components/Home/ProviderCTA.tsx
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Users,
  DollarSign,
} from "lucide-react";

const BENEFITS = [
  {
    icon: Users,
    title: "Get More Customers",
    description:
      "Connect with thousands of people looking for your services every day",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    description:
      "Build your reputation with verified reviews and showcase your best work",
  },
  {
    icon: DollarSign,
    title: "Increase Your Income",
    description:
      "Receive quality leads and book more jobs with our trusted platform",
  },
];

const ProviderCTA = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        /* ── SECTION ──────────────────────────────────────── */
        .pcta-section {
          width: 100%;
          background: var(--color-bg);
          padding: 88px 0;
          font-family: var(--font-primary);
          position: relative;
          overflow: hidden;
        }

        /* decorative elements */
        .pcta-section::before,
        .pcta-section::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .pcta-section::before {
          width: 600px;
          height: 600px;
          top: -300px;
          right: -200px;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, transparent 70%);
        }

        .pcta-section::after {
          width: 400px;
          height: 400px;
          bottom: -200px;
          left: -100px;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.03) 0%, transparent 70%);
        }

        /* top/bottom border lines */
        .pcta-section::after {
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
          bottom: 0;
        }

        .pcta-container {
          max-width: var(--container-max-width);
          margin: 0 auto;
          padding: 0 var(--container-padding);
          position: relative;
          z-index: 1;
        }

        .pcta-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        /* ── LEFT CONTENT ─────────────────────────────────── */
        .pcta-content {
          color: var(--color-text-primary);
        }

        .pcta-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: var(--color-accent-soft);
          color: var(--color-accent);
          padding: 6px 16px;
          border-radius: var(--radius-full);
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .pcta-headline {
          font-family: var(--font-primary);
          font-size: 48px;
          font-weight: 800;
          color: var(--color-primary);
          line-height: 1.1;
          margin-bottom: 20px;
          letter-spacing: -1.5px;
        }

        .pcta-subtext {
          font-size: 18px;
          color: var(--color-text-secondary);
          line-height: 1.65;
          margin-bottom: 36px;
          font-weight: 400;
        }

        .pcta-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .pcta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 32px;
          border: none;
          border-radius: var(--radius-full);
          font-family: var(--font-primary);
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.2px;
          transition:
            transform var(--transition-fast),
            box-shadow var(--transition-fast),
            background var(--transition-fast);
          white-space: nowrap;
        }

        .pcta-btn-primary {
          background: var(--color-accent);
          color: #fff;
          box-shadow: 0 4px 16px rgba(37, 99, 235, 0.28);
        }

        .pcta-btn-primary:hover {
          background: var(--color-accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(37, 99, 235, 0.38);
        }

        .pcta-btn-primary:active {
          transform: scale(0.98);
        }

        .pcta-btn-secondary {
          background: transparent;
          color: var(--color-primary);
          border: 1.5px solid var(--color-border);
        }

        .pcta-btn-secondary:hover {
          background: var(--color-accent-soft);
          border-color: var(--color-accent);
          color: var(--color-accent);
        }

        /* ── RIGHT BENEFITS ───────────────────────────────── */
        .pcta-benefits {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .pcta-benefit {
          background: var(--color-bg-section);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 28px 24px;
          display: flex;
          gap: 20px;
          align-items: flex-start;
          transition:
            transform var(--transition-base),
            background var(--transition-base),
            box-shadow var(--transition-base),
            border-color var(--transition-base);
        }

        .pcta-benefit:hover {
          background: var(--color-bg);
          transform: translateX(8px);
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
          border-color: var(--color-accent-light);
        }

        .pcta-benefit-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background: var(--color-accent-soft);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--color-accent);
          transition: transform var(--transition-fast);
        }

        .pcta-benefit:hover .pcta-benefit-icon {
          transform: scale(1.1);
        }

        .pcta-benefit-content {
          flex: 1;
        }

        .pcta-benefit-title {
          font-family: var(--font-primary);
          font-size: 18px;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 6px;
          letter-spacing: -0.3px;
        }

        .pcta-benefit-desc {
          font-size: 14px;
          color: var(--color-text-secondary);
          line-height: 1.6;
        }

        /* ── STATS BAR ────────────────────────────────────── */
        .pcta-stats {
          display: flex;
          gap: 48px;
          margin-top: 32px;
          padding-top: 32px;
          border-top: 1px solid var(--color-divider);
        }

        .pcta-stat {
          text-align: center;
        }

        .pcta-stat-number {
          font-family: var(--font-primary);
          font-size: 32px;
          font-weight: 800;
          color: var(--color-primary);
          line-height: 1;
          margin-bottom: 6px;
          letter-spacing: -0.5px;
        }

        .pcta-stat-number span {
          color: var(--color-accent);
        }

        .pcta-stat-label {
          font-size: 13px;
          color: var(--color-text-secondary);
          font-weight: 500;
        }

        /* ── RESPONSIVE ───────────────────────────────────── */
        @media (max-width: 1200px) {
          .pcta-section { padding: 72px 0; }
          .pcta-inner { gap: 60px; }
          .pcta-headline { font-size: 42px; }
        }

        @media (max-width: 1024px) {
          .pcta-container { padding: 0 32px; }
          .pcta-inner { gap: 48px; }
        }

        @media (max-width: 900px) {
          .pcta-section { padding: 60px 0; }
          .pcta-container { padding: 0 24px; }
          .pcta-inner {
            grid-template-columns: 1fr;
            gap: 48px;
            text-align: center;
          }

          .pcta-eyebrow { margin: 0 auto 20px; }
          .pcta-headline { font-size: 38px; }
          .pcta-buttons { justify-content: center; }
          .pcta-stats { justify-content: center; }
        }

        @media (max-width: 640px) {
          .pcta-section { padding: 52px 0; }
          .pcta-container { padding: 0 20px; }
          .pcta-headline { font-size: 32px; letter-spacing: -1px; }
          .pcta-subtext { font-size: 16px; margin-bottom: 28px; }

          .pcta-buttons {
            flex-direction: column;
            width: 100%;
          }

          .pcta-btn {
            width: 100%;
            justify-content: center;
            padding: 14px 24px;
          }

          .pcta-benefit {
            padding: 20px;
            flex-direction: column;
            text-align: center;
          }

          .pcta-benefit:hover {
            transform: translateX(0) translateY(-4px);
          }

          .pcta-benefit-icon {
            margin: 0 auto;
          }

          .pcta-stats {
            flex-direction: column;
            gap: 24px;
          }
        }

        @media (max-width: 480px) {
          .pcta-section { padding: 44px 0; }
          .pcta-container { padding: 0 16px; }
          .pcta-headline { font-size: 28px; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <section className="pcta-section">
        <div className="pcta-container">
          <div className="pcta-inner">
            {/* ── LEFT CONTENT ─────────────────────────────── */}
            <div className="pcta-content">
              <div className="pcta-eyebrow">
                <CheckCircle size={12} strokeWidth={2.5} />
                For Service Providers
              </div>

              <h2 className="pcta-headline">Grow Your Business with ZimServ</h2>

              <p className="pcta-subtext">
                Join hundreds of trusted professionals already using ZimServ to
                find new customers and build their reputation across Zimbabwe.
              </p>

              <div className="pcta-buttons">
                <button
                  className="pcta-btn pcta-btn-primary btn-magnetic"
                  onClick={() => navigate("/become-provider")}
                >
                  Get Started Free
                  <ArrowRight size={18} strokeWidth={2.5} />
                </button>
                <button
                  className="pcta-btn pcta-btn-secondary"
                  onClick={() => navigate("/how-it-works")}
                >
                  Learn More
                </button>
              </div>

              {/* Stats */}
              <div className="pcta-stats">
                <div className="pcta-stat">
                  <div className="pcta-stat-number">500+</div>
                  <div className="pcta-stat-label">Active Providers</div>
                </div>
                <div className="pcta-stat">
                  <div className="pcta-stat-number">10K+</div>
                  <div className="pcta-stat-label">Customer Searches</div>
                </div>
                <div className="pcta-stat">
                  <div className="pcta-stat-number">4.8★</div>
                  <div className="pcta-stat-label">Avg Provider Rating</div>
                </div>
              </div>
            </div>

            {/* ── RIGHT BENEFITS ──────────────────────────── */}
            <div className="pcta-benefits">
              {BENEFITS.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="pcta-benefit">
                    <div className="pcta-benefit-icon">
                      <Icon size={24} strokeWidth={2} />
                    </div>
                    <div className="pcta-benefit-content">
                      <h3 className="pcta-benefit-title">{benefit.title}</h3>
                      <p className="pcta-benefit-desc">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProviderCTA;
