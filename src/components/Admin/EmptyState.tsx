// src/components/Admin/EmptyState.tsx
import { type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) => {
  return (
    <>
      <style>{`
        .empty-state {
          padding: 80px 20px;
          text-align: center;
          border: 2px dashed var(--border-color);
          border-radius: 16px;
          background: var(--empty-bg);
          transition: all 0.3s ease;
        }

        .empty-state:hover {
          border-color: var(--border-hover);
          background: var(--empty-hover-bg);
        }

        .empty-icon-wrapper {
          display: inline-flex;
          margin-bottom: 24px;
          position: relative;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          background: var(--icon-bg);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--icon-color);
          box-shadow: 0 8px 24px var(--icon-shadow);
          animation: float 3s ease-in-out infinite;
          position: relative;
          overflow: hidden;
        }

        .empty-icon::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
          animation: shimmer 3s linear infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shimmer {
          0%, 100% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          50% {
            transform: translate(-50%, -50%) rotate(180deg);
          }
        }

        .empty-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
          letter-spacing: -0.3px;
        }

        .empty-description {
          font-size: 15px;
          color: var(--text-secondary);
          margin-bottom: 28px;
          line-height: 1.6;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        .empty-action {
          padding: 13px 28px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 700;
          background: linear-gradient(135deg, var(--orange-primary) 0%, var(--orange-hover) 100%);
          color: #fff;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 16px var(--orange-shadow);
          position: relative;
          overflow: hidden;
        }

        .empty-action::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }

        .empty-action:hover::before {
          left: 100%;
        }

        .empty-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px var(--orange-shadow-hover);
        }

        .empty-action:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px var(--orange-shadow);
        }

        /* CSS Variables */
        :root {
          --empty-bg: #fafbfc;
          --empty-hover-bg: #f9fafb;
          --border-color: #e5e7eb;
          --border-hover: #d1d5db;
          --text-primary: #111827;
          --text-secondary: #6b7280;
          --icon-bg: #f3f4f6;
          --icon-color: #9ca3af;
          --icon-shadow: rgba(0, 0, 0, 0.05);
          --orange-primary: #FF6B35;
          --orange-hover: #E85A28;
          --orange-shadow: rgba(255, 107, 53, 0.3);
          --orange-shadow-hover: rgba(255, 107, 53, 0.4);
        }

        .dark-mode {
          --empty-bg: #1f2937;
          --empty-hover-bg: #374151;
          --border-color: #374151;
          --border-hover: #4b5563;
          --text-primary: #f9fafb;
          --text-secondary: #d1d5db;
          --icon-bg: #374151;
          --icon-color: #9ca3af;
          --icon-shadow: rgba(0, 0, 0, 0.3);
          --orange-primary: #FF8A5B;
          --orange-hover: #FF6B35;
          --orange-shadow: rgba(255, 138, 91, 0.4);
          --orange-shadow-hover: rgba(255, 138, 91, 0.5);
        }

        @media (max-width: 768px) {
          .empty-state {
            padding: 60px 20px;
          }

          .empty-icon {
            width: 64px;
            height: 64px;
          }

          .empty-title {
            font-size: 18px;
          }

          .empty-description {
            font-size: 14px;
          }

          .empty-action {
            width: 100%;
            max-width: 280px;
          }
        }
      `}</style>

      <div className="empty-state">
        <div className="empty-icon-wrapper">
          <div className="empty-icon">
            <Icon size={36} strokeWidth={2} />
          </div>
        </div>
        <h3 className="empty-title">{title}</h3>
        <p className="empty-description">{description}</p>
        {action && (
          <button className="empty-action" onClick={action.onClick}>
            {action.label}
          </button>
        )}
      </div>
    </>
  );
};

export default EmptyState;
