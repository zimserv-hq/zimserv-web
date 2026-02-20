// src/components/Breadcrumb/Breadcrumb.tsx
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  path?: string; // If no path, it's the current page (not clickable)
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .breadcrumb-wrapper {
          width: 100%;
          background: var(--color-bg-section);
          border-bottom: 1px solid var(--color-border);
          margin-top: 93px;
        }

        .breadcrumb-container {
          max-width: var(--container-max-width);
          margin: 0 auto;
          padding: 0 var(--container-padding);
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 24px 0 20px;
          font-size: 14px;
          color: var(--color-text-secondary);
          font-family: var(--font-primary);
        }

        .breadcrumb-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .breadcrumb-link {
          color: var(--color-text-secondary);
          text-decoration: none;
          transition: color var(--transition-fast);
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          font-family: inherit;
          font-size: inherit;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .breadcrumb-link:hover {
          color: var(--color-accent);
        }

        .breadcrumb-separator {
          color: var(--color-border);
          user-select: none;
        }

        .breadcrumb-current {
          color: var(--color-accent);
          font-weight: 600;
        }

        /* Home Icon */
        .breadcrumb-home-icon {
          color: var(--color-text-secondary);
          transition: color var(--transition-fast);
        }

        .breadcrumb-link:hover .breadcrumb-home-icon {
          color: var(--color-accent);
        }

        /* Responsive */
        @media (max-width: 920px) {
          .breadcrumb-wrapper {
            margin-top: 93px;
            margin-bottom: -10px
          }

          .breadcrumb-container {
            padding: 0 20px;
          }

          .breadcrumb {
            padding: 16px 0 16px;
            font-size: 13px;
            gap: 6px;
          }
        }

        @media (max-width: 640px) {
          .breadcrumb-wrapper {
            margin-top: 80px;
          }

          .breadcrumb-container {
            padding: 0 16px;
          }

          .breadcrumb {
            font-size: 12px;
            flex-wrap: wrap;
          }

          /* Hide text on mobile, show only icons and current page */
          .breadcrumb-link-text {
            display: none;
          }
        }
      `}</style>

      <div className="breadcrumb-wrapper">
        <div className="breadcrumb-container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            {/* Home Link */}
            <div className="breadcrumb-item">
              <button
                className="breadcrumb-link"
                onClick={() => navigate("/")}
                aria-label="Home"
              >
                <Home
                  size={16}
                  className="breadcrumb-home-icon"
                  strokeWidth={2}
                />
                <span className="breadcrumb-link-text">Home</span>
              </button>
            </div>

            {/* Dynamic Items */}
            {items.map((item, index) => {
              const isLast = index === items.length - 1;

              return (
                <div key={index} className="breadcrumb-item">
                  <span className="breadcrumb-separator">/</span>
                  {isLast || !item.path ? (
                    <span className="breadcrumb-current">{item.label}</span>
                  ) : (
                    <button
                      className="breadcrumb-link"
                      onClick={() => item.path && navigate(item.path)}
                    >
                      <span className="breadcrumb-link-text">{item.label}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Breadcrumb;
