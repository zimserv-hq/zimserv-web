// src/components/Provider/ProviderContent.tsx
import { useState } from "react";
import { Star, CheckCircle } from "lucide-react";

interface ProviderContentProps {
  provider: any; // Replace with proper type
}

const ProviderContent = ({ provider }: ProviderContentProps) => {
  const [activeTab, setActiveTab] = useState<"about" | "reviews" | "gallery">(
    "about",
  );

  return (
    <>
      <style>{`
        .provider-content {
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 32px;
          box-shadow: var(--shadow-sm);
        }

        /* Stats Bar */
        .stats-bar {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          padding: 24px;
          background: var(--color-bg-section);
          border-radius: var(--radius-md);
          margin-bottom: 32px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          font-family: var(--font-primary);
          font-size: 32px;
          font-weight: 800;
          color: var(--color-accent);
          margin-bottom: 6px;
          line-height: 1;
        }

        .stat-label {
          font-size: 13px;
          color: var(--color-text-secondary);
          font-weight: 500;
        }

        /* Tabs */
        .tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 28px;
          border-bottom: 2px solid var(--color-divider);
        }

        .tab-btn {
          padding: 12px 24px;
          background: transparent;
          border: none;
          border-bottom: 3px solid transparent;
          color: var(--color-text-secondary);
          font-family: var(--font-primary);
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition-fast);
          margin-bottom: -2px;
        }

        .tab-btn.active {
          color: var(--color-accent);
          border-bottom-color: var(--color-accent);
        }

        .tab-btn:hover:not(.active) {
          color: var(--color-primary);
        }

        /* Content Sections */
        .section-title {
          font-family: var(--font-primary);
          font-size: 22px;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 16px;
          letter-spacing: -0.4px;
        }

        .description-text {
          font-size: 15px;
          color: var(--color-text-secondary);
          line-height: 1.8;
          margin-bottom: 28px;
        }

        /* Services Grid */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 28px;
        }

        .service-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: var(--color-bg-section);
          border-radius: var(--radius-md);
          font-size: 14px;
          color: var(--color-text-primary);
          transition: all var(--transition-fast);
        }

        .service-item:hover {
          background: var(--color-accent-soft);
          transform: translateX(4px);
        }

        .service-check {
          color: var(--color-accent);
          flex-shrink: 0;
        }

        /* Pricing Info */
        .pricing-box {
          padding: 20px;
          background: var(--color-bg-section);
          border-left: 4px solid var(--color-accent);
          border-radius: var(--radius-md);
          margin-bottom: 28px;
        }

        .pricing-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .pricing-text {
          font-size: 15px;
          color: var(--color-primary);
          line-height: 1.6;
        }

        /* Reviews */
        .reviews-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .review-card {
          padding: 20px;
          background: var(--color-bg-section);
          border-radius: var(--radius-md);
          margin-bottom: 16px;
          transition: all var(--transition-fast);
        }

        .review-card:hover {
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
          transform: translateY(-2px);
        }

        .review-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .review-author {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .review-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--color-accent-soft);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-accent);
          font-weight: 700;
          font-size: 16px;
        }

        .review-author-info {
          flex: 1;
        }

        .review-author-name {
          font-weight: 700;
          color: var(--color-primary);
          font-size: 15px;
          margin-bottom: 3px;
        }

        .review-date {
          font-size: 12px;
          color: var(--color-text-secondary);
        }

        .review-rating {
          display: flex;
          gap: 3px;
        }

        .review-comment {
          font-size: 14px;
          color: var(--color-text-secondary);
          line-height: 1.7;
        }

        /* Gallery */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .gallery-item {
          aspect-ratio: 4/3;
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: pointer;
          position: relative;
          border: 2px solid var(--color-border);
          transition: all var(--transition-base);
        }

        .gallery-item:hover {
          border-color: var(--color-accent);
          transform: scale(1.02);
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
        }

        .gallery-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .gallery-item:hover .gallery-img {
          transform: scale(1.1);
        }

        /* Responsive */
        @media (max-width: 900px) {
          .provider-content {
            padding: 24px;
          }

          .stats-bar {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .services-grid {
            grid-template-columns: 1fr;
          }

          .tabs {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          .tab-btn {
            white-space: nowrap;
          }
        }

        @media (max-width: 640px) {
          .provider-content {
            padding: 20px;
          }

          .gallery-grid {
            grid-template-columns: 1fr;
          }

          .stat-value {
            font-size: 24px;
          }
        }
      `}</style>

      <div className="provider-content">
        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "about" ? "active" : ""}`}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
          <button
            className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews ({provider.reviewCount})
          </button>
          <button
            className={`tab-btn ${activeTab === "gallery" ? "active" : ""}`}
            onClick={() => setActiveTab("gallery")}
          >
            Gallery
          </button>
        </div>

        {/* About Tab */}
        {activeTab === "about" && (
          <>
            <h2 className="section-title">About {provider.name}</h2>
            <p className="description-text">{provider.description}</p>

            <h3 className="section-title">Services Offered</h3>
            <div className="services-grid">
              {provider.services.map((service: string, index: number) => (
                <div key={index} className="service-item">
                  <CheckCircle
                    size={18}
                    className="service-check"
                    strokeWidth={2.5}
                  />
                  <span>{service}</span>
                </div>
              ))}
            </div>

            <h3 className="section-title">Pricing</h3>
            <div className="pricing-box">
              <div className="pricing-label">Rate Details</div>
              <p className="pricing-text">{provider.priceDetails}</p>
            </div>
          </>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <>
            <div className="reviews-header">
              <h2 className="section-title" style={{ marginBottom: 0 }}>
                Customer Reviews
              </h2>
            </div>
            {provider.reviews.map((review: any) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="review-author">
                    <div className="review-avatar">
                      {review.author.charAt(0)}
                    </div>
                    <div className="review-author-info">
                      <div className="review-author-name">{review.author}</div>
                      <div className="review-date">{review.date}</div>
                    </div>
                  </div>
                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < review.rating ? "#F59E0B" : "none"}
                        stroke={i < review.rating ? "#F59E0B" : "#D1D5DB"}
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </>
        )}

        {/* Gallery Tab */}
        {activeTab === "gallery" && (
          <>
            <h2 className="section-title">Work Gallery</h2>
            <div className="gallery-grid">
              {provider.gallery.map((image: string, index: number) => (
                <div key={index} className="gallery-item">
                  <img
                    src={image}
                    alt={`Work ${index + 1}`}
                    className="gallery-img"
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProviderContent;
