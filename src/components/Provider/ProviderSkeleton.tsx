// src/components/Provider/ProviderSkeleton.tsx

const ProviderSkeleton = () => {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -800px 0; }
          100% { background-position: 800px 0; }
        }

        .sk-shimmer {
          background: linear-gradient(
            90deg,
            #f0f0f0 0px,
            #fafafa 40%,
            #e8e8e8 80%,
            #f0f0f0 100%
          );
          background-size: 800px 100%;
          animation: shimmer 1.6s ease-in-out infinite;
          border-radius: 6px;
        }

        .sk-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
          align-items: start;
        }

        /* ── LEFT CARD ── */
        .sk-card {
          background: #fff;
          border: 1.5px solid #ebebeb;
          border-radius: 20px;
          overflow: hidden;
        }

        .sk-hero {
          width: 100%;
          height: 300px;
        }

        .sk-identity {
          padding: 18px 20px 16px;
          border-bottom: 1px solid #f0f0f0;
        }

        .sk-name-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 10px;
        }

        .sk-name {
          height: 26px;
          width: 55%;
        }

        .sk-price {
          height: 26px;
          width: 22%;
        }

        .sk-tagline {
          height: 14px;
          width: 40%;
          margin-bottom: 12px;
        }

        .sk-stars-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .sk-stars {
          height: 14px;
          width: 80px;
        }

        .sk-rating-num {
          height: 14px;
          width: 28px;
        }

        .sk-rating-ct {
          height: 14px;
          width: 64px;
        }

        .sk-chips {
          display: flex;
          gap: 8px;
        }

        .sk-chip {
          height: 28px;
          width: 76px;
          border-radius: 6px;
        }

        .sk-btns {
          padding: 14px 20px;
          border-bottom: 1px solid #f0f0f0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .sk-btn {
          height: 46px;
          border-radius: 10px;
        }

        .sk-body {
          padding: 18px 20px 22px;
        }

        .sk-section-label {
          height: 11px;
          width: 70px;
          margin-bottom: 10px;
        }

        .sk-detail-row {
          height: 54px;
          border-radius: 10px;
          margin-bottom: 8px;
        }

        .sk-areas-label {
          height: 11px;
          width: 90px;
          margin: 14px 0 8px;
        }

        .sk-areas {
          display: flex;
          gap: 8px;
        }

        .sk-area-tag {
          height: 26px;
          width: 90px;
          border-radius: 999px;
        }

        /* ── RIGHT PANEL ── */
        .sk-panel {
          background: #fff;
          border: 1.5px solid #ebebeb;
          border-radius: 20px;
          overflow: hidden;
        }

        .sk-tabs {
          display: flex;
          background: #fafafa;
          border-bottom: 1.5px solid #ebebeb;
          padding: 0 20px;
          gap: 8px;
          align-items: center;
          height: 54px;
        }

        .sk-tab {
          height: 16px;
          width: 60px;
          border-radius: 4px;
        }

        .sk-panel-body {
          padding: 28px;
        }

        .sk-heading {
          height: 18px;
          width: 45%;
          margin-bottom: 18px;
        }

        .sk-para-line {
          height: 13px;
          margin-bottom: 9px;
          border-radius: 4px;
        }

        .sk-para-line:nth-child(1) { width: 100%; }
        .sk-para-line:nth-child(2) { width: 95%; }
        .sk-para-line:nth-child(3) { width: 88%; }
        .sk-para-line:nth-child(4) { width: 60%; }

        .sk-divider { height: 1px; background: #f0f0f0; margin: 24px 0; }

        .sk-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 24px;
          margin-top: 18px;
        }

        .sk-info-box {
          height: 62px;
          border-radius: 10px;
        }

        .sk-services-heading {
          height: 18px;
          width: 40%;
          margin-bottom: 14px;
        }

        .sk-services-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
          margin-bottom: 24px;
        }

        .sk-service-card {
          height: 52px;
          border-radius: 10px;
        }

        .sk-pricing-heading {
          height: 18px;
          width: 25%;
          margin-bottom: 14px;
        }

        .sk-pricing-box {
          height: 68px;
          border-radius: 10px;
        }

        @keyframes sk-fade-out {
          from { opacity: 1; }
          to   { opacity: 0; pointer-events: none; }
        }

        .sk-fade-out {
          animation: sk-fade-out 0.4s ease forwards;
        }

        @media (max-width: 1024px) {
          .sk-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 640px) {
          .sk-hero { height: 200px; }
          .sk-btns { grid-template-columns: 1fr; }
          .sk-panel-body { padding: 16px; }
          .sk-services-grid { grid-template-columns: 1fr; }
          .sk-info-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="sk-grid">
        {/* LEFT CARD */}
        <div className="sk-card">
          <div className="sk-hero sk-shimmer" />

          <div className="sk-identity">
            <div className="sk-name-row">
              <div className="sk-name sk-shimmer" />
              <div className="sk-price sk-shimmer" />
            </div>
            <div className="sk-tagline sk-shimmer" />
            <div className="sk-stars-row">
              <div className="sk-stars sk-shimmer" />
              <div className="sk-rating-num sk-shimmer" />
              <div className="sk-rating-ct sk-shimmer" />
            </div>
            <div className="sk-chips">
              <div className="sk-chip sk-shimmer" />
              <div className="sk-chip sk-shimmer" />
            </div>
          </div>

          <div className="sk-btns">
            <div className="sk-btn sk-shimmer" />
            <div className="sk-btn sk-shimmer" />
          </div>

          <div className="sk-body">
            <div className="sk-section-label sk-shimmer" />
            <div className="sk-detail-row sk-shimmer" />
            <div className="sk-areas-label sk-shimmer" />
            <div className="sk-areas">
              <div className="sk-area-tag sk-shimmer" />
              <div className="sk-area-tag sk-shimmer" />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="sk-panel">
          <div className="sk-tabs">
            <div className="sk-tab sk-shimmer" />
            <div className="sk-tab sk-shimmer" />
            <div className="sk-tab sk-shimmer" />
          </div>

          <div className="sk-panel-body">
            <div className="sk-heading sk-shimmer" />
            <div className="sk-para-line sk-shimmer" />
            <div className="sk-para-line sk-shimmer" />
            <div className="sk-para-line sk-shimmer" />
            <div className="sk-para-line sk-shimmer" />

            <div className="sk-info-grid">
              <div className="sk-info-box sk-shimmer" />
              <div className="sk-info-box sk-shimmer" />
            </div>

            <div className="sk-divider" />

            <div className="sk-services-heading sk-shimmer" />
            <div className="sk-services-grid">
              <div className="sk-service-card sk-shimmer" />
              <div className="sk-service-card sk-shimmer" />
              <div className="sk-service-card sk-shimmer" />
              <div className="sk-service-card sk-shimmer" />
            </div>

            <div className="sk-divider" />

            <div className="sk-pricing-heading sk-shimmer" />
            <div className="sk-pricing-box sk-shimmer" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProviderSkeleton;
