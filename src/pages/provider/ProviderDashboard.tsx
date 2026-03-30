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
  ChevronRight,
  Award,
  BarChart2,
  RefreshCw,
} from "lucide-react";
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
  repliedReviews: number;
}

interface RecentReview {
  id: string;
  customerNickname: string;
  rating: number;
  comment: string;
  createdAt: string;
  providerReply: string | null;
}

// ── Inline stat card ─────────────────────────────────────────────────────────
const StatCard = ({
  label,
  value,
  icon: Icon,
  accent,
  accentBg,
  sub,
  onClick,
}: {
  label: string;
  value: string | number;
  icon: any;
  accent: string;
  accentBg: string;
  sub?: string;
  onClick?: () => void;
}) => (
  <div
    className="stat-card"
    onClick={onClick}
    style={{ cursor: onClick ? "pointer" : "default" }}
  >
    <div className="stat-card-top">
      <div className="stat-icon-wrap" style={{ background: accentBg }}>
        <Icon size={20} strokeWidth={2.5} style={{ color: accent }} />
      </div>
    </div>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
    {sub && <div className="stat-sub">{sub}</div>}
  </div>
);

// ── Rating stars ─────────────────────────────────────────────────────────────
const Stars = ({ rating, size = 13 }: { rating: number; size?: number }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={size}
        fill={i < rating ? "#f9ab00" : "none"}
        stroke={i < rating ? "#f9ab00" : "#dadce0"}
        strokeWidth={2}
      />
    ))}
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("");
  const [providerName, setProviderName] = useState("");

  const [stats, setStats] = useState<DashboardStats>({
    totalViews: 0,
    totalLeads: 0,
    clickToCall: 0,
    clickToWhatsApp: 0,
    avgRating: 0,
    totalReviews: 0,
    pendingReviews: 0,
    repliedReviews: 0,
  });

  const [recentReviews, setRecentReviews] = useState<RecentReview[]>([]);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(
      h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening",
    );
    fetchProviderAndData();
  }, []);

  const fetchProviderAndData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    setError(null);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        setError("Not authenticated");
        return;
      }

      const { data: provider, error: providerError } = await supabase
        .from("providers")
        .select(
          "id, full_name, business_name, profile_views, click_to_call_count, click_to_whatsapp_count, avg_rating, total_reviews",
        )
        .eq("user_id", user.id)
        .single();

      if (providerError || !provider) {
        setError("Provider profile not found");
        return;
      }

      setProviderName(provider.business_name || provider.full_name || "");

      const { data: reviewsData } = await supabase
        .from("reviews")
        .select(
          "id, customer_nickname, rating, comment, created_at, provider_reply",
        )
        .eq("provider_id", provider.id)
        .order("created_at", { ascending: false });

      const allReviews = reviewsData ?? [];
      setRecentReviews(
        allReviews.slice(0, 5).map((r) => ({
          id: r.id,
          customerNickname: r.customer_nickname,
          rating: r.rating,
          comment: r.comment,
          createdAt: r.created_at,
          providerReply: r.provider_reply ?? null,
        })),
      );

      const pendingReviews = allReviews.filter((r) => !r.provider_reply).length;
      const repliedReviews = allReviews.filter(
        (r) => !!r.provider_reply,
      ).length;
      const totalViews = provider.profile_views ?? 0;
      const clickToCall = provider.click_to_call_count ?? 0;
      const clickToWhatsApp = provider.click_to_whatsapp_count ?? 0;

      setStats({
        totalViews,
        totalLeads: clickToCall + clickToWhatsApp,
        clickToCall,
        clickToWhatsApp,
        avgRating: Math.round((provider.avg_rating ?? 0) * 10) / 10,
        totalReviews: provider.total_reviews ?? 0,
        pendingReviews,
        repliedReviews,
      });
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
      setRefreshing(false);
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

  // Reply rate %
  const replyRate =
    stats.totalReviews > 0
      ? Math.round((stats.repliedReviews / stats.totalReviews) * 100)
      : 0;

  const statCards = [
    {
      label: "Profile Views",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      accent: "#3B82F6",
      accentBg: "rgba(59,130,246,0.12)",
      sub: "All time",
      cssAccent: "#3B82F6",
    },
    {
      label: "Total Leads",
      value: stats.totalLeads.toLocaleString(),
      icon: MousePointerClick,
      accent: "#FF6B35",
      accentBg: "rgba(255,107,53,0.12)",
      sub: "Calls + WhatsApp",
      cssAccent: "#FF6B35",
    },
    {
      label: "Calls Received",
      value: stats.clickToCall,
      icon: Phone,
      accent: "#10b981",
      accentBg: "rgba(16,185,129,0.12)",
      sub: "Direct calls",
      cssAccent: "#10b981",
    },
    {
      label: "WhatsApp Clicks",
      value: stats.clickToWhatsApp,
      icon: MessageCircle,
      accent: "#8B5CF6",
      accentBg: "rgba(139,92,246,0.12)",
      sub: "WhatsApp leads",
      cssAccent: "#8B5CF6",
    },
  ];

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

        /* ── Hero greeting row ── */
        .greeting-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .greeting-block {}
        .greeting-eyebrow {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: var(--orange-primary);
          margin-bottom: 4px;
        }
        .greeting-title {
          font-size: 26px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.8px;
          line-height: 1.2;
        }
        .greeting-sub {
          font-size: 12px;
          color: var(--text-tertiary);
          margin-top: 4px;
          font-weight: 500;
        }
        .greeting-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .refresh-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 14px;
          background: var(--card-bg);
          color: var(--text-secondary);
          border: 1.5px solid var(--border-color);
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .refresh-btn:hover { border-color: var(--orange-primary); color: var(--orange-primary); }
        .refresh-btn svg { transition: transform 0.6s ease; }
        .refresh-btn:hover svg { transform: rotate(180deg); }
        .spinning { animation: spin360 0.7s linear infinite; }
        @keyframes spin360 { to { transform: rotate(360deg); } }

        .new-job-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #FF6B35 0%, #E85A28 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          box-shadow: 0 4px 14px rgba(255,107,53,0.3);
          font-family: inherit;
        }
        .new-job-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(255,107,53,0.4); }
        .new-job-btn:active { transform: translateY(0); }

        /* ── Alert banner ── */
        .alert-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          border-radius: 12px;
          margin-bottom: 20px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1.5px solid;
        }
        .alert-banner.warning {
          background: rgba(255,107,53,0.07);
          border-color: rgba(255,107,53,0.25);
          color: var(--orange-primary);
        }
        .alert-banner.warning:hover { background: rgba(255,107,53,0.12); }
        .alert-banner-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--orange-primary);
          animation: pulse-dot 1.5s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        .alert-banner-text { flex: 1; }
        .error-banner {
          background: rgba(239,68,68,0.08);
          border: 1.5px solid rgba(239,68,68,0.25);
          border-radius: 10px;
          padding: 12px 16px;
          margin-bottom: 20px;
          font-size: 13px;
          color: #dc2626;
        }
        .dark-mode .error-banner { color: #f87171; background: rgba(239,68,68,0.12); }

        /* ── Stat cards ── */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        .stat-card {
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 16px;
          padding: 22px 20px 20px;
          transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
          position: relative;
          overflow: hidden;
        }
        .stat-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: var(--stat-accent, transparent);
          border-radius: 0 0 16px 16px;
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .stat-card:hover {
          border-color: var(--border-hover);
          box-shadow: 0 10px 32px var(--card-shadow);
          transform: translateY(-4px);
        }
        .stat-card:hover::after { opacity: 1; }
        .stat-card-top {
          margin-bottom: 18px;
        }
        .stat-icon-wrap {
          width: 48px; height: 48px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .stat-value {
          font-size: 32px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -1.2px;
          line-height: 1;
          margin-bottom: 5px;
        }
        .stat-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 2px;
        }
        .stat-sub {
          font-size: 11px;
          color: var(--text-tertiary);
          font-weight: 500;
        }

        /* ── Score / highlight strip ── */
        .highlight-strip {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }
        .highlight-tile {
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 16px;
          padding: 20px 22px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .highlight-tile:hover {
          border-color: var(--border-hover);
          box-shadow: 0 6px 20px var(--card-shadow);
          transform: translateY(-2px);
        }
        .highlight-icon {
          width: 50px; height: 50px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .highlight-body { flex: 1; min-width: 0; }
        .highlight-value {
          font-size: 24px; font-weight: 800;
          color: var(--text-primary); letter-spacing: -0.5px; line-height: 1;
          margin-bottom: 4px;
        }
        .highlight-stars { display: flex; gap: 3px; margin-bottom: 5px; }
        .highlight-label {
          font-size: 12px; font-weight: 600;
          color: var(--text-secondary);
        }
        .highlight-arrow {
          color: var(--text-tertiary); flex-shrink: 0;
          transition: transform 0.2s, color 0.2s;
        }
        .highlight-tile:hover .highlight-arrow { transform: translateX(3px); color: var(--orange-primary); }

        /* ── Main grid ── */
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 20px;
        }

        /* ── Cards ── */
        .dashboard-card {
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .dashboard-card:hover {
          border-color: var(--border-hover);
          box-shadow: 0 8px 32px var(--card-shadow);
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 22px;
          border-bottom: 1.5px solid var(--border-color);
        }
        .card-title-wrap {}
        .card-title {
          font-size: 15px; font-weight: 700;
          color: var(--text-primary); letter-spacing: -0.3px;
        }
        .card-subtitle {
          font-size: 12px; color: var(--text-tertiary); margin-top: 1px; font-weight: 500;
        }
        .card-link {
          font-size: 13px; color: var(--orange-primary); font-weight: 600;
          cursor: pointer; display: flex; align-items: center; gap: 4px;
          padding: 6px 12px; border-radius: 8px; transition: all 0.2s ease;
          white-space: nowrap;
        }
        .card-link:hover { background: var(--orange-light-bg); }

        /* ── Review list ── */
        .reviews-list { display: flex; flex-direction: column; }
        .review-item {
          padding: 16px 22px;
          border-bottom: 1px solid var(--border-color);
          cursor: pointer;
          transition: all 0.15s ease;
          position: relative;
        }
        .review-item::before {
          content: '';
          position: absolute; left: 0; top: 0; bottom: 0;
          width: 3px; border-radius: 0 2px 2px 0;
          background: var(--orange-primary);
          transform: scaleY(0);
          transition: transform 0.2s ease;
        }
        .review-item:last-child { border-bottom: none; }
        .review-item:hover { background: var(--hover-bg); }
        .review-item:hover::before { transform: scaleY(1); }
        .review-item-header {
          display: flex; justify-content: space-between;
          align-items: center; margin-bottom: 6px;
        }
        .reviewer-name { font-size: 14px; font-weight: 700; color: var(--text-primary); }
        .review-comment {
          font-size: 13px; color: var(--text-secondary); line-height: 1.55;
          margin-bottom: 10px;
          display: -webkit-box;
          -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .review-footer {
          display: flex; align-items: center; justify-content: space-between;
        }
        .review-timestamp { font-size: 11px; color: var(--text-tertiary); font-weight: 500; }
        .reply-badge {
          font-size: 10px; padding: 3px 9px; border-radius: 6px;
          font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px;
        }
        .reply-badge.replied { background: #dcfce7; color: #15803d; }
        .reply-badge.pending { background: #fff7ed; color: #c2410c; }
        .dark-mode .reply-badge.replied { background: rgba(21,128,61,0.2); color: #4ade80; }
        .dark-mode .reply-badge.pending { background: rgba(194,65,12,0.2); color: #fb923c; }

        .reviews-empty {
          padding: 48px 24px; text-align: center; color: var(--text-tertiary);
        }
        .reviews-empty-icon {
          width: 52px; height: 52px; border-radius: 16px;
          background: var(--hover-bg);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 12px;
        }

        /* ── Performance panel ── */
        .perf-list { display: flex; flex-direction: column; }
        .perf-item {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 22px;
          border-bottom: 1px solid var(--border-color);
          cursor: pointer; transition: all 0.15s ease;
        }
        .perf-item:last-child { border-bottom: none; }
        .perf-item:hover { background: var(--hover-bg); }
        .perf-icon {
          width: 42px; height: 42px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: transform 0.2s ease;
        }
        .perf-item:hover .perf-icon { transform: scale(1.07); }
        .perf-body { flex: 1; min-width: 0; }
        .perf-title { font-size: 14px; font-weight: 700; color: var(--text-primary); margin-bottom: 2px; }
        .perf-sub { font-size: 12px; color: var(--text-secondary); }
        .perf-right { display: flex; align-items: center; gap: 8px; }
        .perf-badge {
          background: var(--orange-primary); color: #fff;
          font-size: 12px; font-weight: 700;
          padding: 3px 10px; border-radius: 8px; min-width: 28px; text-align: center;
        }
        .perf-value {
          font-size: 18px; font-weight: 800;
          color: var(--text-primary); letter-spacing: -0.4px;
        }
        .perf-chevron { color: var(--text-tertiary); transition: transform 0.2s, color 0.2s; }
        .perf-item:hover .perf-chevron { transform: translateX(3px); color: var(--orange-primary); }

        /* ── Loading skeleton ── */
        .loading-skeleton {
          background: linear-gradient(90deg, var(--border-color) 25%, var(--hover-bg) 50%, var(--border-color) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        /* ── Responsive ── */
        @media (max-width: 1200px) {
          .dashboard-grid { grid-template-columns: 1fr; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .highlight-strip { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 900px) {
          .highlight-strip { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .provider-dashboard { padding: 14px 14px 24px; }
          .greeting-title { font-size: 21px; }
          .greeting-row { margin-bottom: 16px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 16px; }
          .stat-value { font-size: 26px; }
          .highlight-strip { grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 16px; }
          .dashboard-grid { gap: 14px; }
          .card-header { padding: 14px 16px; }
          .review-item { padding: 12px 16px; }
          .perf-item { padding: 12px 16px; gap: 12px; }
          .perf-icon { width: 38px; height: 38px; border-radius: 10px; }
        }
        @media (max-width: 480px) {
          .provider-dashboard { padding: 12px 12px 24px; }
          .stats-grid { gap: 8px; }
          .highlight-strip { grid-template-columns: 1fr 1fr; gap: 8px; }
          .greeting-title { font-size: 16px; }
          .greeting-actions { flex-direction: row; gap: 8px; }
          .new-job-btn { padding: 9px 16px; font-size: 13px; }
          .refresh-btn { padding: 9px 12px; }
        }
      `}</style>

      <div className="provider-dashboard">
        {/* ── Greeting row ── */}
        <div className="greeting-row">
          <div className="greeting-block">
            <div className="greeting-eyebrow">Provider Portal</div>
            <h1 className="greeting-title">
              {greeting}
              {providerName ? `, ${providerName.split(" ")[0]}` : ""} 👋
            </h1>
            <p className="greeting-sub">
              Here's what's happening with your business today.
            </p>
          </div>
          <div className="greeting-actions">
            <button
              className="refresh-btn"
              onClick={() => fetchProviderAndData(true)}
              disabled={refreshing}
            >
              <RefreshCw
                size={14}
                strokeWidth={2.5}
                className={refreshing ? "spinning" : ""}
              />
              {refreshing ? "Refreshing…" : "Refresh"}
            </button>
            <button
              className="new-job-btn"
              onClick={() => navigate("/provider/jobs")}
            >
              <Plus size={16} strokeWidth={2.5} />
              Add Job
            </button>
          </div>
        </div>

        {/* ── Pending reviews alert ── */}
        {!loading && stats.pendingReviews > 0 && (
          <div
            className="alert-banner warning"
            onClick={() => navigate("/provider/reviews")}
          >
            <span className="alert-banner-dot" />
            <span className="alert-banner-text">
              You have{" "}
              <strong>
                {stats.pendingReviews} review
                {stats.pendingReviews > 1 ? "s" : ""}
              </strong>{" "}
              waiting for your reply — respond to build trust with customers.
            </span>
            <ChevronRight size={16} strokeWidth={2.5} />
          </div>
        )}

        {/* ── Error ── */}
        {error && <div className="error-banner">⚠️ {error}</div>}

        {/* ── Stat cards ── */}
        <div className="stats-grid">
          {loading
            ? [...Array(4)].map((_, i) => (
                <div key={i} className="stat-card">
                  <div
                    className="loading-skeleton"
                    style={{
                      height: 44,
                      width: 44,
                      borderRadius: 12,
                      marginBottom: 16,
                    }}
                  />
                  <div
                    className="loading-skeleton"
                    style={{ height: 28, width: "55%", marginBottom: 8 }}
                  />
                  <div
                    className="loading-skeleton"
                    style={{ height: 13, width: "70%" }}
                  />
                </div>
              ))
            : statCards.map((s) => (
                <div
                  key={s.label}
                  style={
                    { "--stat-accent": s.cssAccent } as React.CSSProperties
                  }
                >
                  <StatCard {...s} />
                </div>
              ))}
        </div>

        {/* ── Highlight strip: Rating (stars) + Reply rate ── */}
        <div className="highlight-strip">
          {/* Avg rating — stars */}
          <div
            className="highlight-tile"
            onClick={() => navigate("/provider/reviews")}
          >
            <div
              className="highlight-icon"
              style={{ background: "rgba(234,179,8,0.12)" }}
            >
              <Award size={24} strokeWidth={2.5} style={{ color: "#EAB308" }} />
            </div>
            <div className="highlight-body">
              {loading ? (
                <div
                  className="loading-skeleton"
                  style={{ height: 20, width: 100, marginBottom: 8 }}
                />
              ) : (
                <>
                  <div className="highlight-value">
                    {stats.avgRating || "—"}
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--text-tertiary)",
                        marginLeft: 4,
                      }}
                    >
                      /5
                    </span>
                  </div>
                  <div className="highlight-stars">
                    {[...Array(5)].map((_, i) => {
                      const filled = i < Math.floor(stats.avgRating);
                      const half = !filled && i < stats.avgRating;
                      return (
                        <Star
                          key={i}
                          size={16}
                          fill={filled ? "#f9ab00" : "none"}
                          stroke={filled || half ? "#f9ab00" : "#d1d5db"}
                          strokeWidth={2}
                        />
                      );
                    })}
                  </div>
                  <div className="highlight-label">
                    {stats.totalReviews} customer review
                    {stats.totalReviews !== 1 ? "s" : ""}
                  </div>
                </>
              )}
            </div>
            <ChevronRight
              size={16}
              strokeWidth={2.5}
              className="highlight-arrow"
            />
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="dashboard-grid">
          {/* Recent Reviews */}
          <div className="dashboard-card">
            <div className="card-header">
              <div className="card-title-wrap">
                <div className="card-title">Recent Reviews</div>
                <div className="card-subtitle">Latest customer feedback</div>
              </div>
              <span
                className="card-link"
                onClick={() => navigate("/provider/reviews")}
              >
                View all <ArrowUpRight size={13} strokeWidth={2.5} />
              </span>
            </div>
            <div className="reviews-list">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "16px 22px",
                      borderBottom: "1px solid var(--border-color)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <div
                        className="loading-skeleton"
                        style={{ height: 13, width: "40%" }}
                      />
                      <div
                        className="loading-skeleton"
                        style={{ height: 13, width: 72 }}
                      />
                    </div>
                    <div
                      className="loading-skeleton"
                      style={{ height: 12, width: "85%", marginBottom: 6 }}
                    />
                    <div
                      className="loading-skeleton"
                      style={{ height: 12, width: "65%" }}
                    />
                  </div>
                ))
              ) : recentReviews.length === 0 ? (
                <div className="reviews-empty">
                  <div className="reviews-empty-icon">
                    <MessageCircle
                      size={24}
                      strokeWidth={1.5}
                      style={{ color: "var(--text-tertiary)" }}
                    />
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                    No reviews yet
                  </p>
                  <p style={{ fontSize: 12 }}>
                    Reviews from customers will appear here
                  </p>
                </div>
              ) : (
                recentReviews.map((review) => (
                  <div
                    key={review.id}
                    className="review-item"
                    onClick={() =>
                      navigate("/provider/reviews", {
                        state: { highlightId: review.id },
                      })
                    }
                  >
                    <div className="review-item-header">
                      <span className="reviewer-name">
                        {review.customerNickname}
                      </span>
                      <Stars rating={review.rating} />
                    </div>
                    <p className="review-comment">{review.comment}</p>
                    <div className="review-footer">
                      <span className="review-timestamp">
                        {getTimeAgo(review.createdAt)}
                      </span>
                      <span
                        className={`reply-badge ${review.providerReply ? "replied" : "pending"}`}
                      >
                        {review.providerReply ? "✓ Replied" : "Needs reply"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Performance */}
          <div className="dashboard-card">
            <div className="card-header">
              <div className="card-title-wrap">
                <div className="card-title">Performance</div>
                <div className="card-subtitle">Business health overview</div>
              </div>
              <BarChart2
                size={18}
                strokeWidth={2}
                style={{ color: "var(--text-tertiary)" }}
              />
            </div>
            <div className="perf-list">
              <div
                className="perf-item"
                onClick={() => navigate("/provider/reviews")}
              >
                <div
                  className="perf-icon"
                  style={{ background: "rgba(255,107,53,0.1)" }}
                >
                  <MessageCircle
                    size={18}
                    strokeWidth={2.5}
                    style={{ color: "#FF6B35" }}
                  />
                </div>
                <div className="perf-body">
                  <div className="perf-title">Pending Reviews</div>
                  <div className="perf-sub">Awaiting your response</div>
                </div>
                <div className="perf-right">
                  {stats.pendingReviews > 0 ? (
                    <span className="perf-badge">{stats.pendingReviews}</span>
                  ) : (
                    <CheckCircle
                      size={18}
                      strokeWidth={2.5}
                      style={{ color: "#10b981" }}
                    />
                  )}
                  <ChevronRight
                    size={15}
                    strokeWidth={2.5}
                    className="perf-chevron"
                  />
                </div>
              </div>

              <div
                className="perf-item"
                onClick={() => navigate("/provider/reviews")}
              >
                <div
                  className="perf-icon"
                  style={{ background: "rgba(16,185,129,0.1)" }}
                >
                  <CheckCircle
                    size={18}
                    strokeWidth={2.5}
                    style={{ color: "#10b981" }}
                  />
                </div>
                <div className="perf-body">
                  <div className="perf-title">Replied Reviews</div>
                  <div className="perf-sub">
                    {stats.repliedReviews} of {stats.totalReviews} responded
                  </div>
                </div>
                <div className="perf-right">
                  <span className="perf-value" style={{ color: "#10b981" }}>
                    {replyRate}%
                  </span>
                  <ChevronRight
                    size={15}
                    strokeWidth={2.5}
                    className="perf-chevron"
                  />
                </div>
              </div>

              <div
                className="perf-item"
                onClick={() => navigate("/provider/jobs")}
              >
                <div
                  className="perf-icon"
                  style={{ background: "rgba(37,99,235,0.1)" }}
                >
                  <Briefcase
                    size={18}
                    strokeWidth={2.5}
                    style={{ color: "#2563EB" }}
                  />
                </div>
                <div className="perf-body">
                  <div className="perf-title">Active Jobs</div>
                  <div className="perf-sub">Currently in progress</div>
                </div>
                <div className="perf-right">
                  <ChevronRight
                    size={15}
                    strokeWidth={2.5}
                    className="perf-chevron"
                  />
                </div>
              </div>

              <div
                className="perf-item"
                onClick={() => navigate("/provider/reviews")}
              >
                <div
                  className="perf-icon"
                  style={{ background: "rgba(234,179,8,0.1)" }}
                >
                  <Star
                    size={18}
                    strokeWidth={2.5}
                    style={{ color: "#EAB308" }}
                  />
                </div>
                <div className="perf-body">
                  <div className="perf-title">Your Rating</div>
                  <div className="perf-sub">
                    {stats.totalReviews} total reviews
                  </div>
                </div>
                <div className="perf-right">
                  <span className="perf-value">{stats.avgRating || "—"}</span>
                  <ChevronRight
                    size={15}
                    strokeWidth={2.5}
                    className="perf-chevron"
                  />
                </div>
              </div>

              <div className="perf-item">
                <div
                  className="perf-icon"
                  style={{ background: "rgba(139,92,246,0.1)" }}
                >
                  <Eye
                    size={18}
                    strokeWidth={2.5}
                    style={{ color: "#7C3AED" }}
                  />
                </div>
                <div className="perf-body">
                  <div className="perf-title">Profile Views</div>
                  <div className="perf-sub">All time impressions</div>
                </div>
                <div className="perf-right">
                  <span className="perf-value">
                    {stats.totalViews.toLocaleString()}
                  </span>
                  <ChevronRight
                    size={15}
                    strokeWidth={2.5}
                    className="perf-chevron"
                  />
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
