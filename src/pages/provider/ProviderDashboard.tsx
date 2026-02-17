// src/pages/provider/ProviderDashboard.tsx
import { useState } from "react";
import {
  Star,
  MousePointerClick,
  CheckCircle,
  Phone,
  Eye,
  MessageCircle,
  ArrowUpRight,
  Plus,
  Briefcase,
} from "lucide-react";
import StatCard from "../../components/Admin/StatCard";
import { useNavigate } from "react-router-dom";

// Mock data - Replace with real API data filtered by provider ID
const DASHBOARD_STATS = {
  totalViews: 1847,
  totalLeads: 234,
  clickToCall: 89,
  clickToWhatsApp: 125,
  avgRating: 4.8,
  totalReviews: 47,
  pendingReviews: 3,
  activeJobs: 12,
  completedJobs: 156,
};

const RECENT_REVIEWS = [
  {
    id: "1",
    customerName: "John from Borrowdale",
    rating: 5,
    comment: "Excellent service! Fixed my geyser quickly and professionally.",
    timestamp: "2 hours ago",
    hasReply: true,
  },
  {
    id: "2",
    customerName: "Sarah M.",
    rating: 4,
    comment:
      "Good work but took longer than expected. Still satisfied overall.",
    timestamp: "5 hours ago",
    hasReply: false,
  },
  {
    id: "3",
    customerName: "Mike T.",
    rating: 5,
    comment: "Amazing service. Very thorough and professional work.",
    timestamp: "1 day ago",
    hasReply: true,
  },
];

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState("7days");

  return (
    <>
      <style>{`
        .provider-dashboard {
          padding: 24px;
          max-width: 1600px;
          margin: 0 auto;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        /* Time Filter */
        .page-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          gap: 16px;
        }

        .page-title {
          font-size: 22px;
          font-weight: 400;
          color: #202124;
          letter-spacing: 0;
        }

        .title-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .new-job-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: #FF6B35;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .new-job-btn:hover {
          background: #E85A28;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        }

        .time-filter {
          display: inline-flex;
          gap: 4px;
          padding: 3px;
          background: #f1f3f4;
          border-radius: 8px;
        }

        .filter-btn {
          padding: 6px 14px;
          border-radius: 6px;
          border: none;
          background: transparent;
          color: #5f6368;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .filter-btn.active {
          background: #fff;
          color: #FF6B35;
          font-weight: 500;
          box-shadow: 0 1px 2px rgba(60, 64, 67, 0.15), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
        }

        .filter-btn:hover:not(.active) {
          background: rgba(255, 255, 255, 0.5);
        }

        /* Dashboard Grid */
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        /* Card Style */
        .dashboard-card {
          background: #fff;
          border: 1px solid #e3e5e8;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .dashboard-card:hover {
          border-color: #d0d3d7;
          box-shadow: 0 1px 3px rgba(60, 64, 67, 0.12), 0 4px 8px 3px rgba(60, 64, 67, 0.08);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #f1f3f4;
        }

        .card-title {
          font-size: 15px;
          font-weight: 500;
          color: #202124;
          letter-spacing: 0;
        }

        .card-link {
          font-size: 13px;
          color: #1a73e8;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 4px;
          transition: background 0.15s;
        }

        .card-link:hover {
          background: #e8f0fe;
        }

        /* Recent Reviews */
        .reviews-list {
          display: grid;
          gap: 0;
        }

        .review-item {
          padding: 16px 20px;
          border-bottom: 1px solid #f1f3f4;
          cursor: pointer;
          transition: background 0.15s;
        }

        .review-item:last-child {
          border-bottom: none;
        }

        .review-item:hover {
          background: #fafbfc;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .reviewer-name {
          font-size: 14px;
          font-weight: 500;
          color: #202124;
        }

        .review-rating {
          display: flex;
          gap: 2px;
        }

        .review-comment {
          font-size: 13px;
          color: #5f6368;
          line-height: 1.5;
          margin-bottom: 8px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .review-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .review-timestamp {
          font-size: 12px;
          color: #80868b;
        }

        .reply-status {
          font-size: 12px;
          padding: 3px 8px;
          border-radius: 4px;
          font-weight: 500;
        }

        .reply-status.replied {
          background: #e6f4ea;
          color: #137333;
        }

        .reply-status.pending {
          background: #fef7e0;
          color: #8f5d00;
        }

        /* Quick Actions */
        .quick-actions {
          display: grid;
          gap: 0;
        }

        .action-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 20px;
          border-bottom: 1px solid #f1f3f4;
          cursor: pointer;
          transition: background 0.15s;
        }

        .action-item:last-child {
          border-bottom: none;
        }

        .action-item:hover {
          background: #fafbfc;
        }

        .action-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .action-content {
          flex: 1;
          min-width: 0;
        }

        .action-title {
          font-size: 14px;
          font-weight: 500;
          color: #202124;
          margin-bottom: 3px;
        }

        .action-count {
          font-size: 13px;
          color: #5f6368;
          font-weight: 400;
        }

        .action-badge {
          background: #ea4335;
          color: #fff;
          font-size: 12px;
          font-weight: 500;
          padding: 3px 8px;
          border-radius: 10px;
          min-width: 22px;
          text-align: center;
        }

        /* Recent Lead Events */
        .events-list {
          display: flex;
          flex-direction: column;
        }

        .event-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 20px;
          border-bottom: 1px solid #f1f3f4;
          transition: background 0.15s;
        }

        .event-item:last-child {
          border-bottom: none;
        }

        .event-item:hover {
          background: #fafbfc;
        }

        .event-icon {
          width: 40px;
          height: 40px;
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

        .event-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .event-customer {
          font-size: 14px;
          font-weight: 500;
          color: #202124;
        }

        .event-action {
          font-size: 13px;
          color: #5f6368;
        }

        .event-location {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #80868b;
        }

        .event-time {
          font-size: 12px;
          color: #80868b;
          white-space: nowrap;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .provider-dashboard {
            padding: 16px;
          }

          .page-title-row {
            flex-direction: column;
            align-items: stretch;
            margin-bottom: 16px;
          }

          .page-title {
            font-size: 20px;
          }

          .title-actions {
            flex-direction: column;
          }

          .new-job-btn {
            width: 100%;
            justify-content: center;
          }

          .time-filter {
            width: 100%;
            justify-content: center;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 16px;
          }

          .card-header {
            padding: 14px 16px;
          }

          .card-title {
            font-size: 14px;
          }

          .reviews-list .review-item,
          .quick-actions .action-item,
          .events-list .event-item {
            padding: 12px 16px;
          }

          .event-time {
            display: none;
          }

          .dashboard-grid {
            gap: 12px;
            margin-bottom: 12px;
          }

          .action-icon,
          .event-icon {
            width: 36px;
            height: 36px;
          }

          .action-title,
          .event-customer {
            font-size: 13px;
          }

          .action-count,
          .event-action,
          .event-location {
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          .provider-dashboard {
            padding: 12px;
          }

          .page-title {
            font-size: 18px;
          }

          .stats-grid {
            gap: 10px;
          }
        }
      `}</style>

      <div className="provider-dashboard">
        {/* Page Title with Actions */}
        <div className="page-title-row">
          <h1 className="page-title">Dashboard</h1>
          <div className="title-actions">
            <button
              className="new-job-btn"
              onClick={() => navigate("/provider/jobs")}
            >
              <Plus size={18} strokeWidth={2.5} />
              New Job
            </button>
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
        </div>

        {/* Stats Grid */}
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
            value={DASHBOARD_STATS.totalLeads.toLocaleString()}
            icon={MousePointerClick}
            iconColor="orange"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            label="Calls Received"
            value={DASHBOARD_STATS.clickToCall}
            icon={Phone}
            iconColor="green"
            trend={{ value: 15, isPositive: true }}
          />
          <StatCard
            label="WhatsApp Clicks"
            value={DASHBOARD_STATS.clickToWhatsApp}
            icon={MessageCircle}
            iconColor="purple"
            trend={{ value: 22, isPositive: true }}
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Recent Reviews */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">Recent reviews</h2>
              <span
                className="card-link"
                onClick={() => navigate("/provider/reviews")}
              >
                View all
                <ArrowUpRight size={12} />
              </span>
            </div>
            <div className="reviews-list">
              {RECENT_REVIEWS.map((review) => (
                <div
                  key={review.id}
                  className="review-item"
                  onClick={() => navigate("/provider/reviews")}
                >
                  <div className="review-header">
                    <span className="reviewer-name">{review.customerName}</span>
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < review.rating ? "#f9ab00" : "none"}
                          stroke={i < review.rating ? "#f9ab00" : "#dadce0"}
                          strokeWidth={2}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <div className="review-footer">
                    <span className="review-timestamp">{review.timestamp}</span>
                    <span
                      className={`reply-status ${review.hasReply ? "replied" : "pending"}`}
                    >
                      {review.hasReply ? "Replied" : "Needs reply"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Overview */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">Performance overview</h2>
            </div>
            <div className="quick-actions">
              <div
                className="action-item"
                onClick={() => navigate("/provider/reviews")}
              >
                <div
                  className="action-icon"
                  style={{ background: "#fef7e0", color: "#8f5d00" }}
                >
                  <MessageCircle size={18} />
                </div>
                <div className="action-content">
                  <div className="action-title">New reviews</div>
                  <div className="action-count">Respond to customers</div>
                </div>
                <span className="action-badge">
                  {DASHBOARD_STATS.pendingReviews}
                </span>
              </div>

              <div
                className="action-item"
                onClick={() => navigate("/provider/jobs")}
              >
                <div
                  className="action-icon"
                  style={{ background: "#e8f0fe", color: "#1a73e8" }}
                >
                  <Briefcase size={18} />
                </div>
                <div className="action-content">
                  <div className="action-title">Active jobs</div>
                  <div className="action-count">In progress</div>
                </div>
                <span
                  className="action-badge"
                  style={{ background: "#1a73e8" }}
                >
                  {DASHBOARD_STATS.activeJobs}
                </span>
              </div>

              <div
                className="action-item"
                onClick={() => navigate("/provider/jobs")}
              >
                <div
                  className="action-icon"
                  style={{ background: "#e6f4ea", color: "#137333" }}
                >
                  <CheckCircle size={18} />
                </div>
                <div className="action-content">
                  <div className="action-title">Completed jobs</div>
                  <div className="action-count">
                    {DASHBOARD_STATS.completedJobs} total
                  </div>
                </div>
              </div>

              <div
                className="action-item"
                onClick={() => navigate("/provider/reviews")}
              >
                <div
                  className="action-icon"
                  style={{ background: "#fef7e0", color: "#f9ab00" }}
                >
                  <Star size={18} />
                </div>
                <div className="action-content">
                  <div className="action-title">Your rating</div>
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

export default ProviderDashboard;
