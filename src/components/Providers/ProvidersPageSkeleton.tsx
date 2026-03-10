// src/components/Providers/ProvidersPageSkeleton.tsx

type Props = {
  count?: number;
};

const ProvidersPageSkeleton = ({ count = 6 }: Props) => {
  return (
    <>
      <style>{`
        @keyframes pps-shimmer {
          0%   { background-position: -800px 0; }
          100% { background-position:  800px 0; }
        }

        .pps-shimmer {
          background: linear-gradient(
            90deg,
            #f0f0f0 0px,
            #fafafa 40%,
            #e8e8e8 80%,
            #f0f0f0 100%
          );
          background-size: 800px 100%;
          animation: pps-shimmer 1.6s ease-in-out infinite;
          border-radius: 6px;
        }

        .pps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 48px;
        }

        .pps-card {
          background: #fff;
          border: 1.5px solid #ebebeb;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        /* Image */
        .pps-img {
          width: 100%;
          height: 240px;
          border-radius: 0;
        }

        /* Body */
        .pps-body {
          padding: 18px 20px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* Name row */
        .pps-name-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .pps-name {
          height: 22px;
          width: 55%;
        }

        .pps-price {
          height: 22px;
          width: 22%;
        }

        /* Tagline */
        .pps-tagline {
          height: 14px;
          width: 70%;
        }

        /* Chips */
        .pps-chips {
          display: flex;
          gap: 8px;
        }

        .pps-chip {
          height: 26px;
          width: 80px;
          border-radius: 8px;
        }

        /* Areas */
        .pps-areas {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .pps-area-label {
          height: 14px;
          width: 44px;
        }

        .pps-area-tag {
          height: 22px;
          width: 64px;
          border-radius: 6px;
        }

        /* Stars row */
        .pps-stars-row {
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .pps-stars {
          height: 14px;
          width: 80px;
          border-radius: 4px;
        }

        .pps-rating {
          height: 14px;
          width: 32px;
        }

        /* Description lines */
        .pps-desc-line {
          height: 12px;
        }

        .pps-desc-line:last-child {
          width: 60%;
        }

        /* Divider */
        .pps-divider {
          height: 1px;
          background: #f0f0f0;
          border-radius: 0;
          animation: none;
        }

        /* Actions */
        .pps-actions {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 8px;
        }

        .pps-btn {
          height: 42px;
          border-radius: 10px;
        }

        .pps-btn-icon {
          height: 42px;
          width: 42px;
          border-radius: 10px;
          flex-shrink: 0;
        }

        /* Responsive — mirrors ProvidersPage breakpoints */
        @media (max-width: 1200px) {
          .pps-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
        }

        @media (max-width: 768px) {
          .pps-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 640px) {
          .pps-img { height: 200px; }
        }
      `}</style>

      <div className="pps-grid">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="pps-card">
            {/* Image */}
            <div className="pps-shimmer pps-img" />

            <div className="pps-body">
              {/* Name + price */}
              <div className="pps-name-row">
                <div className="pps-shimmer pps-name" />
                <div className="pps-shimmer pps-price" />
              </div>

              {/* Tagline */}
              <div className="pps-shimmer pps-tagline" />

              {/* Chips */}
              <div className="pps-chips">
                <div className="pps-shimmer pps-chip" />
                <div className="pps-shimmer pps-chip" />
              </div>

              {/* Service areas */}
              <div className="pps-areas">
                <div className="pps-shimmer pps-area-label" />
                <div className="pps-shimmer pps-area-tag" />
                <div className="pps-shimmer pps-area-tag" />
              </div>

              {/* Stars */}
              <div className="pps-stars-row">
                <div className="pps-shimmer pps-stars" />
                <div className="pps-shimmer pps-rating" />
              </div>

              {/* Description */}
              <div
                className="pps-shimmer pps-desc-line"
                style={{ width: "100%" }}
              />
              <div className="pps-shimmer pps-desc-line" />

              {/* Divider */}
              <div className="pps-divider" />

              {/* Action buttons */}
              <div className="pps-actions">
                <div className="pps-shimmer pps-btn" />
                <div className="pps-shimmer pps-btn" />
                <div className="pps-shimmer pps-btn-icon" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProvidersPageSkeleton;
