// src/components/Admin/PageHeader.tsx
import { type LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
}

const PageHeader = ({
  title,
  subtitle,
  icon: Icon,
  action,
}: PageHeaderProps) => {
  return (
    <>
      <style>{`
        .page-header-container {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1.5px solid var(--border-color);
        }

        .page-header-left {
          flex: 1;
          min-width: 0;
        }

        .page-header-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .page-header-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--header-icon-bg-start), var(--header-icon-bg-end));
          color: var(--header-icon-color);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px var(--header-icon-shadow);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .page-header-icon:hover {
          transform: translateY(-2px) rotate(5deg);
          box-shadow: 0 8px 24px var(--header-icon-shadow);
        }

        .page-header-title {
          font-size: 28px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.8px;
          line-height: 1.2;
        }

        .page-header-subtitle {
          font-size: 15px;
          color: var(--text-secondary);
          line-height: 1.5;
          font-weight: 500;
        }

        .page-header-action {
          flex-shrink: 0;
        }

        .action-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          background: linear-gradient(135deg, #FF6B35 0%, #E85A28 100%);
          color: #fff;
          box-shadow: 0 4px 16px rgba(255, 107, 53, 0.3);
          position: relative;
          overflow: hidden;
        }

        .action-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }

        .action-button:hover::before {
          left: 100%;
        }

        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 107, 53, 0.4);
        }

        .action-button:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
        }

        .dark-mode .action-button {
          background: linear-gradient(135deg, #FF8A5B 0%, #FF6B35 100%);
          box-shadow: 0 4px 16px rgba(255, 138, 91, 0.4);
        }

        .dark-mode .action-button:hover {
          box-shadow: 0 8px 24px rgba(255, 138, 91, 0.5);
        }

        /* Light mode variables */
        :root {
          --border-color: #e5e7eb;
          --text-primary: #111827;
          --text-secondary: #6b7280;
          --header-icon-bg-start: #FFF4ED;
          --header-icon-bg-end: #FFE9DD;
          --header-icon-color: #FF6B35;
          --header-icon-shadow: rgba(255, 107, 53, 0.2);
        }

        /* Dark mode variables */
        .dark-mode {
          --border-color: #374151;
          --text-primary: #f9fafb;
          --text-secondary: #9ca3af;
          --header-icon-bg-start: rgba(255, 107, 53, 0.2);
          --header-icon-bg-end: rgba(255, 107, 53, 0.15);
          --header-icon-color: #FF8A5B;
          --header-icon-shadow: rgba(255, 138, 91, 0.3);
        }

        @media (max-width: 768px) {
          .page-header-container {
            flex-direction: column;
            align-items: stretch;
            margin-bottom: 24px;
            padding-bottom: 20px;
          }

          .page-header-title {
            font-size: 24px;
          }

          .page-header-subtitle {
            font-size: 14px;
          }

          .page-header-icon {
            width: 42px;
            height: 42px;
          }

          .action-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="page-header-container">
        <div className="page-header-left">
          <div className="page-header-title-row">
            {Icon && (
              <div className="page-header-icon">
                <Icon size={24} strokeWidth={2.5} />
              </div>
            )}
            <h1 className="page-header-title">{title}</h1>
          </div>
          {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
        </div>
        {action && (
          <div className="page-header-action">
            <button className="action-button" onClick={action.onClick}>
              {action.icon && <action.icon size={18} strokeWidth={2.5} />}
              {action.label}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default PageHeader;
