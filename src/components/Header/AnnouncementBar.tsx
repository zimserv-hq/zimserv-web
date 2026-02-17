import { useState } from "react";
import { X } from "lucide-react";

const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        .announcement-bar {
          width: 100%;
          background: linear-gradient(135deg, var(--primary-pink) 0%, #D81B60 50%, var(--primary-gold) 100%);
          color: var(--white);
          padding: 10px 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 11;
          font-size: 14px;
          font-weight: 500;
          box-shadow: 0 2px 8px rgba(233, 30, 99, 0.15);
        }

        .announcement-text {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .announcement-highlight {
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: rgba(255, 255, 255, 0.25);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .close-announcement {
          position: absolute;
          right: 16px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: var(--white);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
          flex-shrink: 0;
        }

        .close-announcement:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        /* TABLET */
        @media (max-width: 1024px) {
          .announcement-bar {
            padding: 10px 32px;
          }
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .announcement-bar {
            padding: 10px 16px;
            font-size: 13px;
          }

          .announcement-text {
            padding-right: 32px;
          }

          .close-announcement {
            right: 12px;
            width: 26px;
            height: 26px;
          }
        }

        @media (max-width: 480px) {
          .announcement-bar {
            padding: 8px 12px;
            font-size: 10px;
          }

          .announcement-text {
            gap: 4px;
            padding-right: 28px;
          }

          .announcement-highlight {
            padding: 2px 6px;
            font-size: 11px;
          }

          .close-announcement {
            width: 24px;
            height: 24px;
          }
        }

        @media (max-width: 375px) {
          .announcement-bar {
            font-size: 9px;
            padding: 7px 10px;
          }

          .announcement-text {
            gap: 4px;
          }
        }

        @media (max-width: 320px) {
          .announcement-bar {
            font-size: 8px;
            padding: 6px 8px;
          }

          .announcement-highlight {
            padding: 1px 5px;
          }

          .close-announcement {
            width: 22px;
            height: 22px;
            right: 8px;
          }
        }
      `}</style>

      <div className="announcement-bar">
        <div className="announcement-text">
          <span>🎉 Free Shipping on orders over R5000 Use code: WELCOME26</span>
        </div>

        <button
          className="close-announcement"
          onClick={() => setIsVisible(false)}
          aria-label="Close announcement"
        >
          <X size={16} />
        </button>
      </div>
    </>
  );
};

export default AnnouncementBar;
