// src/pages/provider/ProviderDashboard.tsx
import { useState, useEffect } from "react";
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
  TrendingUp,
} from "lucide-react";
import StatCard from "../../components/Admin/StatCard";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

interface DashboardStats {
  totalViews: number;
  totalLeads: number;
  clickToCall: number;
  clickToWhatsApp: number;
  avgRating: number;
  totalReviews: number;
  pendingReviews: number;
  activeJobs: number;
  completedJobs: number;
}

interface RecentReview {
  id: string;
  customerNickname: string;
  rating: number;
  comment: string;
  createdAt: string;
  providerReply: string | null;
}

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState("7days");
  const [loading, setLoading] = useState(true);
  const [, setProviderId] = useState<string | null>(null);

  const [stats, setStats] = useState<DashboardStats>({
    totalViews: 0,
    totalLeads: 0,
    clickToCall: 0,
    clickToWhatsApp: 0,
    avgRating: 0,
    totalReviews: 0,
    pendingReviews: 0,
    activeJobs: 0,
    completedJobs: 0,
  });

  const [recentReviews, setRecentReviews] = useState<RecentReview[]>([]);

  useEffect(() => {
    fetchProviderAndData();
  }, [timeFilter]);

  const getDateFilter = () => {
    const now = new Date();
    switch (timeFilter) {
      case "today":
        return new Date(now.setHours(0, 0, 0, 0)).toISOString();
      case "7days":
        return new Date(Date.now() - 7 * 86400000).toISOString();
      case "30days":
        return new Date(Date.now() - 30 * 86400000).toISOString();
      case "90days":
        return new Date(Date.now() - 90 * 86400000).toISOString();
      default:
        return new Date(Date.now() - 7 * 86400000).toISOString();
    }
  };

  const fetchProviderAndData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: provider } = await supabase
        .from("providers")
        .select("id")
        .eq("email", user.email)
        .single();

      if (!provider) return;
      setProviderId(provider.id);
      await Promise.all([
        fetchStats(provider.id),
        fetchRecentReviews(provider.id),
      ]);
    } catch (error) {
      console.error("Error fetching provider data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (pid: string) => {
    const since = getDateFilter();
    try {
      const [
        { count: totalViews },
        { count: totalLeads },
        { count: clickToCall },
        { count: clickToWhatsApp },
        { data: reviewsData },
        { count: pendingReviews },
        { count: activeJobs },
        { count: completedJobs },
      ] = await Promise.all([
        supabase
          .from("provider_analytics")
          .select("*", { count: "exact", head: true })
          .eq("provider_id", pid)
          .eq("event_type", "view")
          .gte("created_at", since),
        supabase
          .from("provider_analytics")
          .select("*", { count: "exact", head: true })
          .eq("provider_id", pid)
          .in("event_type", ["call", "whatsapp"])
          .gte("created_at", since),
        supabase
          .from("provider_analytics")
          .select("*", { count: "exact", head: true })
          .eq("provider_id", pid)
          .eq("event_type", "call")
          .gte("created_at", since),
        supabase
          .from("provider_analytics")
          .select("*", { count: "exact", head: true })
          .eq("provider_id", pid)
          .eq("event_type", "whatsapp")
          .gte("created_at", since),
        supabase.from("reviews").select("rating").eq("provider_id", pid),
        supabase
          .from("reviews")
          .select("*", { count: "exact", head: true })
          .eq("provider_id", pid)
          .is("provider_reply", null),
        supabase
          .from("provider_jobs")
          .select("*", { count: "exact", head: true })
          .eq("provider_id", pid)
          .in("status", ["pending", "in_progress"]),
        supabase
          .from("provider_jobs")
          .select("*", { count: "exact", head: true })
          .eq("provider_id", pid)
          .eq("status", "completed"),
      ]);

      const avgRating = reviewsData?.length
        ? reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length
        : 0;

      setStats({
        totalViews: totalViews || 0,
        totalLeads: totalLeads || 0,
        clickToCall: clickToCall || 0,
        clickToWhatsApp: clickToWhatsApp || 0,
        avgRating: Math.round(avgRating * 10) / 10,
        totalReviews: reviewsData?.length || 0,
        pendingReviews: pendingReviews || 0,
        activeJobs: activeJobs || 0,
        completedJobs: completedJobs || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchRecentReviews = async (pid: string) => {
    try {
      const { data } = await supabase
        .from("reviews")
        .select(
          "id, customer_nickname, rating, comment, created_at, provider_reply",
        )
        .eq("provider_id", pid)
        .order("created_at", { ascending: false })
        .limit(4);

      if (data) {
        setRecentReviews(
          data.map((r) => ({
            id: r.id,
            customerNickname: r.customer_nickname,
            rating: r.rating,
            comment: r.comment,
            createdAt: r.created_at,
            providerReply: r.provider_reply,
          })),
        );
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const seconds = Math.floor(
      (Date.now() - new Date(dateString).getTime()) / 1000,
    );
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <>
      <style>{`
        .provider-dashboard {
          padding: 24px 28px;
          max-width: 1600px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
        }

        .page-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .page-title {
          font-size: 24px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.8px;
        }

        .title-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .new-job-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: linear-gradient(135deg, #FF6B35 0%, #E85A28 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.25);
        }

        .new-job-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(255, 107, 53, 0.35);
        }

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

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

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

        .card-link:hover { background: var(--orange-light-bg); }

        /* Reviews List */
        .reviews-list { display: flex; flex-direction: column; }

        .review-item {
          padding: 18px 24px;
          border-bottom: 1px solid var(--border-color);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .review-item:last-child { border-bottom: none; }
        .review-item:hover { background: var(--hover-bg); }

        .review-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .reviewer-name { font-size: 14px; font-weight: 600; color: var(--text-primary); }

        .review-rating { display: flex; gap: 2px; }

        .review-comment {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 10px;
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

        .review-timestamp { font-size: 12px; color: var(--text-tertiary); }

        .reply-status {
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 6px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .reply-status.replied { background: #dcfce7; color: #15803d; }
        .reply-status.pending { background: #fef7e0; color: #8f5d00; }

        .dark-mode .reply-status.replied { background: rgba(21,128,61,0.2); color: #4ade80; }
        .dark-mode .reply-status.pending { background: rgba(143,93,0,0.2); color: #fcd34d; }

        /* Quick Actions */
        .quick-actions { display: flex; flex-direction: column; }

        .action-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 24px;
          border-bottom: 1px solid var(--border-color);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-item:last-child { border-bottom: none; }
        .action-item:hover { background: var(--hover-bg); }

        .action-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .action-item:hover .action-icon { transform: scale(1.05); }

        .action-content { flex: 1; min-width: 0; }
        .action-title { font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 2px; }
        .action-count { font-size: 12px; color: var(--text-secondary); }

        .action-badge {
          background: var(--orange-primary);
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 8px;
          min-width: 28px;
          text-align: center;
        }

        /* Loading skeleton */
        .loading-skeleton {
          background: linear-gradient(90deg, var(--border-color) 25%, var(--hover-bg) 50%, var(--border-color) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1200px) {
          .dashboard-grid { grid-template-columns: 1fr; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .provider-dashboard { padding: 16px; }
          .page-title { font-size: 20px; }
          .page-title-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 16px;
          }
          .title-actions {
            flex-direction: row;
            width: 100%;
            flex-wrap: wrap;
          }
          .new-job-btn { flex: 1; justify-content: center; }
          .time-filter { display: none; }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 16px;
          }
          .dashboard-grid { gap: 12px; margin-bottom: 12px; }
          .card-header { padding: 14px 16px; }
          .card-title { font-size: 14px; }
          .review-item { padding: 12px 16px; }
          .action-item { padding: 12px 16px; gap: 12px; }
          .action-icon { width: 36px; height: 36px; border-radius: 10px; }
          .action-title { font-size: 13px; }
          .action-count { font-size: 11px; }
        }

        @media (max-width: 480px) {
          .provider-dashboard { padding: 12px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .page-title { font-size: 18px; }
        }
      `}</style>

      <div className="provider-dashboard">
        <div className="page-title-row">
          <h1 className="page-title">My Dashboard</h1>
          <div className="title-actions">
            <button
              className="new-job-btn"
              onClick={() => navigate("/provider/jobs")}
            >
              <Plus size={18} strokeWidth={2.5} />
              Add Job
            </button>
            <div className="time-filter">
              {[
                ["Today", "today"],
                ["7 Days", "7days"],
                ["30 Days", "30days"],
                ["90 Days", "90days"],
              ].map(([label, value]) => (
                <button
                  key={value}
                  className={`filter-btn ${timeFilter === value ? "active" : ""}`}
                  onClick={() => setTimeFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <StatCard
            label="Profile Views"
            value={stats.totalViews.toLocaleString()}
            icon={Eye}
            iconColor="blue"
            trend={{ value: 18, isPositive: true }}
          />
          <StatCard
            label="Total Leads"
            value={stats.totalLeads.toLocaleString()}
            icon={MousePointerClick}
            iconColor="orange"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            label="Calls Received"
            value={stats.clickToCall}
            icon={Phone}
            iconColor="green"
            trend={{ value: 15, isPositive: true }}
          />
          <StatCard
            label="WhatsApp Clicks"
            value={stats.clickToWhatsApp}
            icon={MessageCircle}
            iconColor="purple"
            trend={{ value: 22, isPositive: true }}
          />
        </div>

        <div className="dashboard-grid">
          {/* Recent Reviews */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">Recent Reviews</h2>
              <span
                className="card-link"
                onClick={() => navigate("/provider/reviews")}
              >
                View all <ArrowUpRight size={14} strokeWidth={2.5} />
              </span>
            </div>
            <div className="reviews-list">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "18px 24px",
                      borderBottom: "1px solid var(--border-color)",
                    }}
                  >
                    <div
                      className="loading-skeleton"
                      style={{ height: 14, width: "60%", marginBottom: 8 }}
                    />
                    <div
                      className="loading-skeleton"
                      style={{ height: 12, width: "90%" }}
                    />
                  </div>
                ))
              ) : recentReviews.length === 0 ? (
                <div
                  style={{
                    padding: "40px 24px",
                    textAlign: "center",
                    color: "var(--text-tertiary)",
                  }}
                >
                  <MessageCircle
                    size={32}
                    strokeWidth={1.5}
                    style={{ margin: "0 auto 12px", display: "block" }}
                  />
                  <p style={{ fontSize: 14 }}>No reviews yet</p>
                </div>
              ) : (
                recentReviews.map((review) => (
                  <div
                    key={review.id}
                    className="review-item"
                    onClick={() => navigate("/provider/reviews")}
                  >
                    <div className="review-item-header">
                      <span className="reviewer-name">
                        {review.customerNickname}
                      </span>
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
                      <span className="review-timestamp">
                        {getTimeAgo(review.createdAt)}
                      </span>
                      <span
                        className={`reply-status ${review.providerReply ? "replied" : "pending"}`}
                      >
                        {review.providerReply ? "Replied" : "Needs reply"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Performance Overview */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">Performance</h2>
            </div>
            <div className="quick-actions">
              <div
                className="action-item"
                onClick={() => navigate("/provider/reviews")}
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
                  <div className="action-count">Awaiting your response</div>
                </div>
                {stats.pendingReviews > 0 && (
                  <span className="action-badge">{stats.pendingReviews}</span>
                )}
              </div>

              <div
                className="action-item"
                onClick={() => navigate("/provider/jobs")}
              >
                <div
                  className="action-icon"
                  style={{
                    background: "rgba(37, 99, 235, 0.1)",
                    color: "#2563EB",
                  }}
                >
                  <Briefcase size={20} strokeWidth={2.5} />
                </div>
                <div className="action-content">
                  <div className="action-title">Active Jobs</div>
                  <div className="action-count">Currently in progress</div>
                </div>
                {stats.activeJobs > 0 && (
                  <span
                    className="action-badge"
                    style={{ background: "#2563EB" }}
                  >
                    {stats.activeJobs}
                  </span>
                )}
              </div>

              <div
                className="action-item"
                onClick={() => navigate("/provider/jobs")}
              >
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
                  <div className="action-title">Completed Jobs</div>
                  <div className="action-count">
                    {stats.completedJobs} total finished
                  </div>
                </div>
              </div>

              <div
                className="action-item"
                onClick={() => navigate("/provider/reviews")}
              >
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
                  <div className="action-title">Your Rating</div>
                  <div className="action-count">
                    {stats.avgRating}/5.0 • {stats.totalReviews} reviews
                  </div>
                </div>
              </div>

              <div className="action-item">
                <div
                  className="action-icon"
                  style={{
                    background: "rgba(139, 92, 246, 0.1)",
                    color: "#7C3AED",
                  }}
                >
                  <TrendingUp size={20} strokeWidth={2.5} />
                </div>
                <div className="action-content">
                  <div className="action-title">Profile Views</div>
                  <div className="action-count">
                    {stats.totalViews.toLocaleString()} in selected period
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
