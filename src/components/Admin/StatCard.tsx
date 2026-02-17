// src/components/Admin/StatCard.tsx
import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: "orange" | "green" | "red" | "blue" | "purple" | "yellow";
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = ({
  label,
  value,
  icon: Icon,
  iconColor,
  trend,
}: StatCardProps) => {
  const colorMap = {
    orange: {
      light: { bg: "#FFF4ED", color: "#FF6B35", hover: "#FFE9DD" },
      dark: {
        bg: "rgba(255, 107, 53, 0.15)",
        color: "#FF8A5B",
        hover: "rgba(255, 107, 53, 0.25)",
      },
    },
    green: {
      light: { bg: "#DCFCE7", color: "#15803D", hover: "#C6F6D5" },
      dark: {
        bg: "rgba(21, 128, 61, 0.15)",
        color: "#4ADE80",
        hover: "rgba(21, 128, 61, 0.25)",
      },
    },
    red: {
      light: { bg: "#FEE2E2", color: "#DC2626", hover: "#FECACA" },
      dark: {
        bg: "rgba(220, 38, 38, 0.15)",
        color: "#F87171",
        hover: "rgba(220, 38, 38, 0.25)",
      },
    },
    blue: {
      light: { bg: "#EFF6FF", color: "#2563EB", hover: "#DBEAFE" },
      dark: {
        bg: "rgba(37, 99, 235, 0.15)",
        color: "#60A5FA",
        hover: "rgba(37, 99, 235, 0.25)",
      },
    },
    purple: {
      light: { bg: "#F3E8FF", color: "#7C3AED", hover: "#E9D5FF" },
      dark: {
        bg: "rgba(124, 58, 237, 0.15)",
        color: "#A78BFA",
        hover: "rgba(124, 58, 237, 0.25)",
      },
    },
    yellow: {
      light: { bg: "#FEF7E0", color: "#8f5d00", hover: "#FEF3C7" },
      dark: {
        bg: "rgba(143, 93, 0, 0.15)",
        color: "#FCD34D",
        hover: "rgba(143, 93, 0, 0.25)",
      },
    },
  };

  const colors = colorMap[iconColor];

  return (
    <>
      <style>{`
        .stat-card {
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 14px;
          padding: 24px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, ${colors.light.color} 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .dark-mode .stat-card::before {
          background: linear-gradient(90deg, ${colors.dark.color} 0%, transparent 100%);
        }

        .stat-card:hover {
          border-color: ${colors.light.color};
          box-shadow: 0 8px 24px ${colors.light.color}1A, 0 2px 8px ${colors.light.color}14;
          transform: translateY(-4px);
        }

        .dark-mode .stat-card:hover {
          border-color: ${colors.dark.color};
          box-shadow: 0 8px 24px ${colors.dark.color}40, 0 2px 8px ${colors.dark.color}30;
        }

        .stat-card:hover::before {
          opacity: 1;
        }

        .stat-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 4px;
        }

        .stat-icon-wrapper {
          position: relative;
        }

        .stat-icon {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${colors.light.bg};
          color: ${colors.light.color};
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px ${colors.light.color}20;
        }

        .dark-mode .stat-icon {
          background: ${colors.dark.bg};
          color: ${colors.dark.color};
          box-shadow: 0 4px 12px ${colors.dark.color}30;
        }

        .stat-card:hover .stat-icon {
          background: ${colors.light.hover};
          transform: scale(1.08) rotate(5deg);
        }

        .dark-mode .stat-card:hover .stat-icon {
          background: ${colors.dark.hover};
        }

        .stat-icon-pulse {
          position: absolute;
          inset: -4px;
          border-radius: 14px;
          background: ${colors.light.color};
          opacity: 0;
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .dark-mode .stat-icon-pulse {
          background: ${colors.dark.color};
        }

        @keyframes pulse-ring {
          0%, 100% {
            opacity: 0;
            transform: scale(0.95);
          }
          50% {
            opacity: 0.15;
            transform: scale(1.05);
          }
        }

        .stat-content {
          flex: 1;
          min-width: 0;
        }

        .stat-label {
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 600;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value-row {
          display: flex;
          align-items: baseline;
          gap: 12px;
          flex-wrap: wrap;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1;
          letter-spacing: -0.5px;
          font-variant-numeric: tabular-nums;
        }

        .stat-trend {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 700;
          padding: 5px 10px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .stat-trend.positive {
          background: linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%);
          color: #15803D;
        }

        .dark-mode .stat-trend.positive {
          background: linear-gradient(135deg, rgba(21, 128, 61, 0.2) 0%, rgba(34, 197, 94, 0.2) 100%);
          color: #4ADE80;
        }

        .stat-trend.negative {
          background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%);
          color: #DC2626;
        }

        .dark-mode .stat-trend.negative {
          background: linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(239, 68, 68, 0.2) 100%);
          color: #F87171;
        }

        .trend-icon {
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        /* Light mode variables */
        :root {
          --card-bg: #ffffff;
          --border-color: #e5e7eb;
          --text-primary: #111827;
          --text-secondary: #6b7280;
        }

        /* Dark mode variables */
        .dark-mode {
          --card-bg: #1f2937;
          --border-color: #374151;
          --text-primary: #f9fafb;
          --text-secondary: #9ca3af;
        }

        @media (max-width: 768px) {
          .stat-card {
            padding: 20px;
          }

          .stat-icon {
            width: 44px;
            height: 44px;
          }

          .stat-value {
            font-size: 26px;
          }

          .stat-label {
            font-size: 11px;
          }
        }
      `}</style>

      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon-wrapper">
            <div className="stat-icon-pulse"></div>
            <div className="stat-icon">
              <Icon size={24} strokeWidth={2.5} />
            </div>
          </div>
          <div className="stat-content">
            <div className="stat-label">{label}</div>
            <div className="stat-value-row">
              <div className="stat-value">
                {typeof value === "number" ? value.toLocaleString() : value}
              </div>
              {trend && (
                <span
                  className={`stat-trend ${trend.isPositive ? "positive" : "negative"}`}
                >
                  {trend.isPositive ? (
                    <TrendingUp
                      size={14}
                      strokeWidth={2.5}
                      className="trend-icon"
                    />
                  ) : (
                    <TrendingDown
                      size={14}
                      strokeWidth={2.5}
                      className="trend-icon"
                    />
                  )}
                  {Math.abs(trend.value)}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatCard;
