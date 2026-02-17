// src/pages/admin/AdminDashboard.tsx
import { useState } from "react";
import {
  Star,
  MousePointerClick,
  Clock,
  CheckCircle,
  Phone,
  Eye,
  MessageCircle,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  TrendingUp,
} from "lucide-react";
import StatCard from "../../components/Admin/StatCard";
import { useNavigate } from "react-router-dom";

const DASHBOARD_STATS = {
  totalProviders: 156,
  activeProviders: 142,
  totalViews: 12847,
  totalLeadEvents: 3456,
  clickToCall: 892,
  clickToWhatsApp: 1654,
  clickToMap: 454,
  avgRating: 4.7,
  pendingReviews: 23,
  pendingProviders: 8,
  totalReviews: 847,
};

const TOP_PROVIDERS_BY_LEADS = [
  {
    id: "1",
    name: "ABC Plumbing",
    category: "Plumbing",
    totalLeads: 234,
    calls: 89,
    whatsapp: 125,
    views: 1240,
    trend: 15,
  },
  {
    id: "2",
    name: "Elite Electrical",
    category: "Electrical",
    totalLeads: 198,
    calls: 72,
    whatsapp: 98,
    views: 1089,
    trend: 8,
  },
  {
    id: "3",
    name: "Sparkle Cleaning",
    category: "Cleaning",
    totalLeads: 187,
    calls: 65,
    whatsapp: 102,
    views: 956,
    trend: -3,
  },
];

const RECENT_LEAD_EVENTS = [
  {
    id: "1",
    provider: "ABC Plumbing",
    eventType: "click_to_call",
    timestamp: "2m ago",
    city: "Harare",
  },
  {
    id: "2",
    provider: "Elite Electrical",
    eventType: "click_to_whatsapp",
    timestamp: "5m ago",
    city: "Bulawayo",
  },
  {
    id: "3",
    provider: "Sparkle Cleaning",
    eventType: "profile_view",
    timestamp: "8m ago",
    city: "Harare",
  },
  {
    id: "4",
    provider: "Tech Solutions",
    eventType: "click_to_call",
    timestamp: "12m ago",
    city: "Harare",
  },
  {
    id: "5",
    provider: "ABC Plumbing",
    eventType: "click_to_whatsapp",
    timestamp: "15m ago",
    city: "Borrowdale",
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState("7days");

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "click_to_call":
        return <Phone size={14} />;
      case "click_to_whatsapp":
        return <MessageCircle size={14} />;
      case "profile_view":
        return <Eye size={14} />;
      default:
        return <MousePointerClick size={14} />;
    }
  };

  const getEventLabel = (eventType: string) => {
    switch (eventType) {
      case "click_to_call":
        return "Call";
      case "click_to_whatsapp":
        return "WhatsApp";
      case "profile_view":
        return "View";
      default:
        return eventType.replace("_", " ");
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case "click_to_call":
        return { light: "#10b981", dark: "#4ADE80" };
      case "click_to_whatsapp":
        return { light: "#25D366", dark: "#34D399" };
      case "profile_view":
        return { light: "#6b7280", dark: "#9CA3AF" };
      default:
        return { light: "#FF6B35", dark: "#FF8A5B" };
    }
  };

  return (
    <>
      <style>{`
        .admin-dashboard {
          padding: 28px;
          max-width: 1600px;
          margin: 0 auto;
        }

        /* Page Title */
        .page-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .page-title {
          font-size: 25px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.8px;
        }

        /* Time Filter */
        .time-filter {
          display: inline-flex;
          gap: 6px;
          padding: 4px;
          background: var(--filter-bg);
          border-radius: 10px;
          border: 1.5px solid var(--border-color);
        }

        .filter-btn {
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .filter-btn.active {
          background: var(--filter-active-bg);
          color: var(--orange-primary);
          box-shadow: 0 2px 8px var(--orange-shadow);
        }

        .filter-btn:hover:not(.active) {
          background: var(--filter-hover-bg);
          color: var(--text-primary);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
          margin-bottom: 28px;
        }

        /* Dashboard Grid */
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        /* Card */
        .dashboard-card {
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 14px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .dashboard-card:hover {
          border-color: var(--border-hover);
          box-shadow: 0 8px 24px var(--card-shadow);
          transform: translateY(-2px);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1.5px solid var(--border-color);
        }

        .card-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.3px;
        }

        .card-link {
          font-size: 13px;
          color: var(--orange-primary);
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .card-link:hover {
          background: var(--orange-light-bg);
        }

        /* Providers List */
        .providers-list {
          display: flex;
          flex-direction: column;
        }

        .provider-item {
          display: grid;
          grid-template-columns: 1fr auto auto;
          align-items: center;
          gap: 20px;
          padding: 18px 24px;
          border-bottom: 1px solid var(--border-color);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .provider-item:last-child {
          border-bottom: none;
        }

        .provider-item:hover {
          background: var(--hover-bg);
        }

        .provider-info {
          min-width: 0;
        }

        .provider-name {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .provider-category {
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .provider-stats {
          display: flex;
          gap: 12px;
        }

        .stat-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: var(--chip-bg);
          border-radius: 8px;
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .stat-value {
          color: var(--text-primary);
          font-weight: 700;
        }

        .trend-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 700;
          padding: 6px 10px;
          border-radius: 8px;
          white-space: nowrap;
        }

        .trend-badge.positive {
          background: var(--trend-positive-bg);
          color: var(--trend-positive-color);
        }

        .trend-badge.negative {
          background: var(--trend-negative-bg);
          color: var(--trend-negative-color);
        }

        /* Quick Actions */
        .quick-actions {
          display: flex;
          flex-direction: column;
        }

        .action-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 24px;
          border-bottom: 1px solid var(--border-color);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-item:last-child {
          border-bottom: none;
        }

        .action-item:hover {
          background: var(--hover-bg);
        }

        .action-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .action-item:hover .action-icon {
          transform: scale(1.08);
        }

        .action-content {
          flex: 1;
          min-width: 0;
        }

        .action-title {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .action-count {
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .action-badge {
          background: linear-gradient(135deg, #ef4444 0%, #DC2626 100%);
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 12px;
          min-width: 24px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
        }

        /* Events List */
        .events-list {
          display: flex;
          flex-direction: column;
        }

        .event-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 24px;
          border-bottom: 1px solid var(--border-color);
          transition: background 0.2s ease;
        }

        .event-item:last-child {
          border-bottom: none;
        }

        .event-item:hover {
          background: var(--hover-bg);
        }

        .event-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .event-content {
          flex: 1;
          min-width: 0;
        }

        .event-provider {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .event-meta {
          font-size: 13px;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .event-type-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
        }

        .event-separator {
          color: var(--text-tertiary);
        }

        .event-time {
          font-size: 13px;
          color: var(--text-tertiary);
          white-space: nowrap;
        }

        /* CSS Variables */
        :root {
          --text-primary: #111827;
          --text-secondary: #6b7280;
          --text-tertiary: #9ca3af;
          --card-bg: #ffffff;
          --border-color: #e5e7eb;
          --border-hover: #d1d5db;
          --card-shadow: rgba(0, 0, 0, 0.1);
          --hover-bg: #f9fafb;
          --chip-bg: #f3f4f6;
          --filter-bg: #f9fafb;
          --filter-hover-bg: rgba(255, 107, 53, 0.1);
          --filter-active-bg: #ffffff;
          --orange-primary: #FF6B35;
          --orange-light-bg: #FFF4ED;
          --orange-shadow: rgba(255, 107, 53, 0.15);
          --trend-positive-bg: #DCFCE7;
          --trend-positive-color: #15803D;
          --trend-negative-bg: #FEE2E2;
          --trend-negative-color: #DC2626;
        }

        .dark-mode {
          --text-primary: #f9fafb;
          --text-secondary: #d1d5db;
          --text-tertiary: #9ca3af;
          --card-bg: #1f2937;
          --border-color: #374151;
          --border-hover: #4b5563;
          --card-shadow: rgba(0, 0, 0, 0.5);
          --hover-bg: #374151;
          --chip-bg: #374151;
          --filter-bg: #374151;
          --filter-hover-bg: rgba(255, 138, 91, 0.15);
          --filter-active-bg: #1f2937;
          --orange-primary: #FF8A5B;
          --orange-light-bg: rgba(255, 107, 53, 0.15);
          --orange-shadow: rgba(255, 138, 91, 0.25);
          --trend-positive-bg: rgba(21, 128, 61, 0.2);
          --trend-positive-color: #4ADE80;
          --trend-negative-bg: rgba(220, 38, 38, 0.2);
          --trend-negative-color: #F87171;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .admin-dashboard {
            padding: 20px 16px;
          }

          .page-title {
            font-size: 24px;
          }

          .time-filter {
            display: none;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 20px;
          }

          .provider-stats {
            display: none;
          }

          .provider-item {
            grid-template-columns: 1fr auto;
            padding: 14px 16px;
          }

          .card-header {
            padding: 16px 18px;
          }

          .event-time {
            display: none;
          }

          .dashboard-grid {
            gap: 16px;
          }
        }
      `}</style>

      <div className="admin-dashboard">
        <div className="page-title-row">
          <h1 className="page-title">Admin Dashboard</h1>
          <div className="time-filter">
            {["Today", "7 Days", "30 Days", "90 Days"].map((filter) => (
              <button
                key={filter}
                className={`filter-btn ${timeFilter === filter.toLowerCase().replace(" ", "") ? "active" : ""}`}
                onClick={() =>
                  setTimeFilter(filter.toLowerCase().replace(" ", ""))
                }
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="stats-grid">
          <StatCard
            label="Profile Views"
            value={DASHBOARD_STATS.totalViews.toLocaleString()}
            icon={Eye}
            iconColor="blue"
            trend={{ value: 18, isPositive: true }}
          />
          <StatCard
            label="Total Leads"
            value={DASHBOARD_STATS.totalLeadEvents.toLocaleString()}
            icon={MousePointerClick}
            iconColor="orange"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            label="Calls"
            value={DASHBOARD_STATS.clickToCall}
            icon={Phone}
            iconColor="green"
            trend={{ value: 15, isPositive: true }}
          />
          <StatCard
            label="WhatsApp"
            value={DASHBOARD_STATS.clickToWhatsApp}
            icon={MessageCircle}
            iconColor="purple"
            trend={{ value: 22, isPositive: true }}
          />
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">Top Performers</h2>
              <span
                className="card-link"
                onClick={() => navigate("/admin/providers")}
              >
                View all
                <ArrowUpRight size={14} strokeWidth={2.5} />
              </span>
            </div>
            <div className="providers-list">
              {TOP_PROVIDERS_BY_LEADS.map((provider) => (
                <div
                  key={provider.id}
                  className="provider-item"
                  onClick={() => navigate(`/admin/providers/${provider.id}`)}
                >
                  <div className="provider-info">
                    <div className="provider-name">{provider.name}</div>
                    <div className="provider-category">{provider.category}</div>
                  </div>
                  <div className="provider-stats">
                    <div className="stat-chip">
                      <Phone size={14} strokeWidth={2} />
                      <span className="stat-value">{provider.calls}</span>
                    </div>
                    <div className="stat-chip">
                      <Eye size={14} strokeWidth={2} />
                      <span className="stat-value">{provider.views}</span>
                    </div>
                  </div>
                  <div
                    className={`trend-badge ${provider.trend > 0 ? "positive" : "negative"}`}
                  >
                    {provider.trend > 0 ? (
                      <ArrowUpRight size={12} strokeWidth={2.5} />
                    ) : (
                      <ArrowDownRight size={12} strokeWidth={2.5} />
                    )}
                    {Math.abs(provider.trend)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">Needs Attention</h2>
            </div>
            <div className="quick-actions">
              <div
                className="action-item"
                onClick={() => navigate("/admin/reviews")}
              >
                <div
                  className="action-icon"
                  style={{
                    background: "var(--orange-light-bg)",
                    color: "var(--orange-primary)",
                  }}
                >
                  <MessageCircle size={20} strokeWidth={2.5} />
                </div>
                <div className="action-content">
                  <div className="action-title">Pending Reviews</div>
                  <div className="action-count">Awaiting moderation</div>
                </div>
                <span className="action-badge">
                  {DASHBOARD_STATS.pendingReviews}
                </span>
              </div>

              <div
                className="action-item"
                onClick={() => navigate("/admin/providers")}
              >
                <div
                  className="action-icon"
                  style={{
                    background: "rgba(37, 99, 235, 0.1)",
                    color: "#2563EB",
                  }}
                >
                  <Clock size={20} strokeWidth={2.5} />
                </div>
                <div className="action-content">
                  <div className="action-title">New Providers</div>
                  <div className="action-count">Pending approval</div>
                </div>
                <span className="action-badge">
                  {DASHBOARD_STATS.pendingProviders}
                </span>
              </div>

              <div className="action-item">
                <div
                  className="action-icon"
                  style={{
                    background: "rgba(21, 128, 61, 0.1)",
                    color: "#15803D",
                  }}
                >
                  <CheckCircle size={20} strokeWidth={2.5} />
                </div>
                <div className="action-content">
                  <div className="action-title">Active Providers</div>
                  <div className="action-count">
                    {DASHBOARD_STATS.activeProviders} on platform
                  </div>
                </div>
              </div>

              <div className="action-item">
                <div
                  className="action-icon"
                  style={{
                    background: "rgba(234, 179, 8, 0.1)",
                    color: "#EAB308",
                  }}
                >
                  <Star size={20} strokeWidth={2.5} />
                </div>
                <div className="action-content">
                  <div className="action-title">Platform Rating</div>
                  <div className="action-count">
                    {DASHBOARD_STATS.avgRating}/5.0 •{" "}
                    {DASHBOARD_STATS.totalReviews} reviews
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
