// src/components/Provider/ProviderInfoCard.tsx
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Award,
  Users,
  Star,
  CheckCircle,
} from "lucide-react";

interface ProviderInfoCardProps {
  provider: any; // Replace with proper type
}

const ProviderInfoCard = ({ provider }: ProviderInfoCardProps) => {
  const handleCall = () => {
    window.location.href = `tel:${provider.contact.phone}`;
  };

  const handleWhatsApp = () => {
    const phone = provider.contact.whatsapp.replace(/\D/g, "");
    window.open(`https://wa.me/${phone}`, "_blank");
  };

  return (
    <>
      <style>{`
        .provider-info-card {
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          position: sticky;
          top: 92px;
          box-shadow: var(--shadow-sm);
        }

        /* Header with image LEFT and basic info RIGHT */
        .info-header {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 16px;
          padding: 24px;
          border-bottom: 1px solid var(--color-divider);
          align-items: center;
        }

        /* LEFT: Image */
        .info-image-wrap {
          position: relative;
        }

        .info-image {
          width: 120px;
          height: 120px;
          border-radius: var(--radius-lg);
          object-fit: cover;
          border: 3px solid var(--color-border);
        }

        .info-verified-badge {
          position: absolute;
          bottom: -8px;
          right: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: var(--color-accent);
          color: #fff;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
          border: 3px solid var(--color-bg);
        }

        /* RIGHT: Info */
        .info-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .info-name {
          font-family: var(--font-primary);
          font-size: 20px;
          font-weight: 700;
          color: var(--color-primary);
          line-height: 1.3;
          letter-spacing: -0.4px;
          margin-bottom: 4px;
        }

        .info-tagline {
          font-size: 13px;
          color: var(--color-text-secondary);
          line-height: 1.4;
          margin-bottom: 8px;
        }

        .info-rating {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 15px;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 8px;
        }

        .info-rating-count {
          font-size: 13px;
          font-weight: 400;
          color: var(--color-text-secondary);
        }

        .badges-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .badge {
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 11px;
          font-weight: 700;
        }

        .badge-category {
          background: var(--color-accent-soft);
          color: var(--color-accent);
        }

        .badge-price {
          background: #DCFCE7;
          color: #15803D;
        }

        /* Contact Buttons - GRID on desktop */
        .contact-buttons {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          padding: 24px;
          border-bottom: 1px solid var(--color-divider);
        }

        .contact-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          border: none;
          border-radius: var(--radius-md);
          font-family: var(--font-primary);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .contact-btn-primary {
          background: var(--color-accent);
          color: #fff;
          box-shadow: 0 2px 12px rgba(37, 99, 235, 0.3);
        }

        .contact-btn-primary:hover {
          background: var(--color-accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(37, 99, 235, 0.4);
        }

        .contact-btn-secondary {
          background: var(--color-bg-section);
          color: var(--color-accent);
          border: 1.5px solid var(--color-accent-light);
        }

        .contact-btn-secondary:hover {
          background: var(--color-accent-soft);
          border-color: var(--color-accent);
        }

        .contact-btn-outline {
          background: transparent;
          color: var(--color-text-secondary);
          border: 1.5px solid var(--color-border);
        }

        .contact-btn-outline:hover {
          background: var(--color-bg-section);
          border-color: var(--color-accent);
          color: var(--color-accent);
        }

        /* Full width buttons for last row */
        .contact-btn.full-width {
          grid-column: 1 / -1;
        }

        /* Details Sections */
        .info-body {
          padding: 24px;
        }

        .info-section {
          margin-bottom: 24px;
        }

        .info-section:last-child {
          margin-bottom: 0;
        }

        .info-section-title {
          font-family: var(--font-primary);
          font-size: 13px;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 10px;
          padding: 10px;
          background: var(--color-bg-section);
          border-radius: var(--radius-md);
        }

        .detail-item:last-child {
          margin-bottom: 0;
        }

        .detail-icon {
          color: var(--color-accent);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .detail-content {
          flex: 1;
          min-width: 0;
        }

        .detail-label {
          font-size: 11px;
          font-weight: 600;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin-bottom: 3px;
        }

        .detail-value {
          font-size: 14px;
          color: var(--color-primary);
          font-weight: 500;
        }

        .areas-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;
        }

        .area-tag {
          padding: 4px 10px;
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
          font-size: 11px;
          color: var(--color-text-secondary);
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .provider-info-card {
            position: static;
            top: auto;
          }
        }

        @media (max-width: 640px) {
          .info-header {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 12px;
          }

          .info-image-wrap {
            margin: 0 auto;
          }

          .info-details {
            align-items: center;
          }

          .badges-row {
            justify-content: center;
          }

          .info-rating {
            justify-content: center;
          }

          /* Stack buttons vertically on mobile */
          .contact-buttons {
            grid-template-columns: 1fr;
          }

          .contact-btn.full-width {
            grid-column: 1;
          }
        }
      `}</style>

      <div className="provider-info-card">
        {/* Header: Image LEFT | Info RIGHT */}
        <div className="info-header">
          {/* LEFT: Image */}
          <div className="info-image-wrap">
            <img
              src={provider.gallery[0]}
              alt={provider.name}
              className="info-image"
            />
            {provider.verified && (
              <div className="info-verified-badge">
                <CheckCircle size={14} strokeWidth={2.5} />
              </div>
            )}
          </div>

          {/* RIGHT: Info */}
          <div className="info-details">
            <h2 className="info-name">{provider.name}</h2>
            <p className="info-tagline">{provider.tagline}</p>
            <div className="info-rating">
              <Star size={16} fill="#F59E0B" strokeWidth={0} />
              <span>{provider.rating}</span>
              <span className="info-rating-count">
                ({provider.reviewCount})
              </span>
            </div>
            <div className="badges-row">
              <span className="badge badge-category">{provider.category}</span>
              <span className="badge badge-price">{provider.pricing}</span>
            </div>
          </div>
        </div>

        {/* Contact Buttons - 2x2 Grid on Desktop */}
        <div className="contact-buttons">
          <button
            className="contact-btn contact-btn-primary"
            onClick={handleCall}
          >
            <Phone size={16} strokeWidth={2.5} />
            Call
          </button>
          <button
            className="contact-btn contact-btn-secondary"
            onClick={handleWhatsApp}
          >
            <MessageCircle size={16} strokeWidth={2.5} />
            WhatsApp
          </button>
        </div>

        {/* Details Body */}
        <div className="info-body">
          {/* Location Details */}
          <div className="info-section">
            <h3 className="info-section-title">Location</h3>
            <div className="detail-item">
              <MapPin size={18} className="detail-icon" strokeWidth={2} />
              <div className="detail-content">
                <div className="detail-label">Based in</div>
                <div className="detail-value">{provider.city}</div>
              </div>
            </div>
            <div className="areas-list">
              {provider.areas.map((area: string, index: number) => (
                <span key={index} className="area-tag">
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Working Hours */}
          <div className="info-section">
            <h3 className="info-section-title">Working Hours</h3>
            <div className="detail-item">
              <Clock size={18} className="detail-icon" strokeWidth={2} />
              <div className="detail-content">
                <div className="detail-label">Weekdays</div>
                <div className="detail-value">
                  {provider.workingHours.weekdays}
                </div>
              </div>
            </div>
            <div className="detail-item">
              <Clock size={18} className="detail-icon" strokeWidth={2} />
              <div className="detail-content">
                <div className="detail-label">Weekends</div>
                <div className="detail-value">
                  {provider.workingHours.weekends}
                </div>
              </div>
            </div>
            {provider.workingHours.emergency && (
              <div className="detail-item">
                <Clock size={18} className="detail-icon" strokeWidth={2} />
                <div className="detail-content">
                  <div className="detail-label">Emergency</div>
                  <div className="detail-value">
                    {provider.workingHours.emergency}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Facts */}
          <div className="info-section">
            <h3 className="info-section-title">Quick Facts</h3>
            <div className="detail-item">
              <Award size={18} className="detail-icon" strokeWidth={2} />
              <div className="detail-content">
                <div className="detail-label">Experience</div>
                <div className="detail-value">
                  {provider.yearsExperience} years
                </div>
              </div>
            </div>
            <div className="detail-item">
              <Users size={18} className="detail-icon" strokeWidth={2} />
              <div className="detail-content">
                <div className="detail-label">Languages</div>
                <div className="detail-value">
                  {provider.languages.join(", ")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProviderInfoCard;
