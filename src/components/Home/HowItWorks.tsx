// src/components/Home/HowItWorks.tsx
import { Search, Users, MessageCircle, CheckCircle } from "lucide-react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const STEPS = [
  {
    number: "01",
    title: "Search Services",
    description: "Tell us what service you need and where you're located",
    icon: Search,
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    number: "02",
    title: "Compare Providers",
    description: "Browse verified professionals, check ratings and reviews",
    icon: Users,
    color: "#10B981",
    bg: "#D1FAE5",
  },
  {
    number: "03",
    title: "Contact & Discuss",
    description: "Reach out directly, get quotes, and ask questions",
    icon: MessageCircle,
    color: "#F59E0B",
    bg: "#FEF3C7",
  },
  {
    number: "04",
    title: "Hire & Review",
    description: "Choose your provider and leave a review after the job",
    icon: CheckCircle,
    color: "#8B5CF6",
    bg: "#EDE9FE",
  },
];

const HowItWorks = () => {
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { elementRef: stepsRef, isVisible: stepsVisible } = useScrollReveal({
    threshold: 0.05,
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        /* ── SECTION ──────────────────────────────────────── */
        .hiw-section {
          width: 100%;
          background: var(--color-bg-section);
          padding: 88px 0;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* subtle background blobs */
        .hiw-section::before,
        .hiw-section::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }

        .hiw-section::before {
          top: -80px;
          right: -80px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.06) 0%, transparent 70%);
        }

        .hiw-section::after {
          bottom: -100px;
          left: -100px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%);
        }

        .hiw-container {
          max-width: var(--container-max-width);
          margin: 0 auto;
          padding: 0 var(--container-padding);
          position: relative;
          z-index: 1;
        }

        /* ── HEADER ───────────────────────────────────────── */
        .hiw-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .hiw-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: var(--color-bg);
          border: 1.5px solid var(--color-accent);
          color: var(--color-accent);
          padding: 6px 16px;
          border-radius: var(--radius-full);
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          margin-bottom: 16px;
          transition: all var(--transition-fast);
        }

        .hiw-eyebrow:hover {
          background: var(--color-accent-soft);
        }

        .hiw-title {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-size: 40px;
          font-weight: 800;
          color: var(--color-primary);
          margin-bottom: 14px;
          line-height: 1.15;
          letter-spacing: -1px;
        }

        .hiw-subtitle {
          font-size: 16px;
          color: var(--color-text-secondary);
          max-width: 560px;
          margin: 0 auto;
          line-height: 1.65;
        }

        /* ── STEPS GRID ───────────────────────────────────── */
        .hiw-steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          position: relative;
        }

        /* connecting line between cards (desktop only) */
        .hiw-line {
          position: absolute;
          top: 62px;
          left: 12%;
          right: 12%;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            var(--color-border) 15%,
            var(--color-accent-light) 50%,
            var(--color-border) 85%,
            transparent 100%
          );
          z-index: 0;
          display: block;
        }

        /* ── STEP CARD ────────────────────────────────────── */
        .hiw-card {
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 48px 20px 32px;
          text-align: center;
          position: relative;
          z-index: 1;
          transition:
            transform var(--transition-base),
            border-color var(--transition-base),
            box-shadow var(--transition-base);
        }

        .hiw-card:hover {
          border-color: var(--sc);
          transform: translateY(-8px);
          box-shadow: 0 20px 48px rgba(15, 23, 42, 0.1);
        }

        /* number badge floating above */
        .hiw-number {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 48px;
          height: 48px;
          background: var(--sc);
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 800;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          transition: transform var(--transition-base);
          border: 3px solid var(--color-bg);
        }

        .hiw-card:hover .hiw-number {
          transform: translateX(-50%) scale(1.12) rotate(360deg);
        }

        /* icon circle */
        .hiw-icon-wrap {
          width: 72px;
          height: 72px;
          margin: 0 auto 20px;
          background: var(--sbg);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition:
            transform var(--transition-base),
            box-shadow var(--transition-base);
        }

        .hiw-card:hover .hiw-icon-wrap {
          transform: scale(1.1);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }

        .hiw-icon {
          color: var(--sc);
          transition: transform var(--transition-fast);
        }

        .hiw-card:hover .hiw-icon {
          transform: scale(1.05);
        }

        /* text */
        .hiw-step-title {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 10px;
          letter-spacing: -0.3px;
        }

        .hiw-step-desc {
          font-size: 13.5px;
          color: var(--color-text-secondary);
          line-height: 1.6;
          font-weight: 400;
        }

        /* ── RESPONSIVE ───────────────────────────────────── */
        @media (max-width: 1200px) {
          .hiw-section { padding: 72px 0; }
          .hiw-steps   { gap: 20px; }
          .hiw-title   { font-size: 36px; }
        }

        @media (max-width: 1024px) {
          .hiw-container { padding: 0 32px; }
          .hiw-line { left: 10%; right: 10%; }
        }

        /* 2x2 grid on tablet */
        @media (max-width: 900px) {
          .hiw-section   { padding: 60px 0; }
          .hiw-container { padding: 0 24px; }
          .hiw-steps     { grid-template-columns: repeat(2, 1fr); gap: 40px 20px; }
          .hiw-line      { display: none; }
          .hiw-title     { font-size: 32px; }
          .hiw-subtitle  { font-size: 15px; }
          .hiw-header    { margin-bottom: 48px; }
        }

        @media (max-width: 640px) {
          .hiw-section { padding: 52px 0; }
          .hiw-container { padding: 0 20px; }
          .hiw-title { font-size: 28px; letter-spacing: -0.5px; }
          .hiw-subtitle { font-size: 14px; }
          .hiw-header { margin-bottom: 40px; }

          .hiw-card { padding: 40px 18px 28px; }
          .hiw-step-title { font-size: 15.5px; }
          .hiw-step-desc  { font-size: 13px; }
        }

        /* single column on small mobile */
        @media (max-width: 480px) {
          .hiw-section   { padding: 44px 0; }
          .hiw-container { padding: 0 16px; }
          .hiw-steps     { grid-template-columns: 1fr; gap: 36px; }
          .hiw-title     { font-size: 26px; }

          .hiw-card      { padding: 36px 20px 28px; }
          .hiw-icon-wrap { width: 64px; height: 64px; margin-bottom: 16px; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <section className="hiw-section">
        <div className="hiw-container">
          {/* Header */}
          <div
            ref={headerRef as any}
            className={`hiw-header scroll-reveal ${headerVisible ? "visible" : ""}`}
          >
            <div className="hiw-eyebrow">
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
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8" />
                <path d="M8 12h8" />
              </svg>
              How It Works
            </div>
            <h2 className="hiw-title">Getting Started is Easy</h2>
            <p className="hiw-subtitle">
              Find and hire trusted service providers in just four simple steps
            </p>
          </div>

          {/* Steps */}
          <div ref={stepsRef as any} className="hiw-steps">
            <div className="hiw-line" aria-hidden="true" />

            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className={`hiw-card scroll-reveal-stagger ${stepsVisible ? "visible" : ""}`}
                  style={
                    {
                      "--sc": step.color,
                      "--sbg": step.bg,
                    } as React.CSSProperties
                  }
                >
                  <div className="hiw-number">{step.number}</div>
                  <div className="hiw-icon-wrap">
                    <Icon size={30} className="hiw-icon" strokeWidth={2} />
                  </div>
                  <h3 className="hiw-step-title">{step.title}</h3>
                  <p className="hiw-step-desc">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default HowItWorks;
