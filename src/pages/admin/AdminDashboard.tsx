// src/pages/admin/AdminDashboard.tsx
import { useState, useEffect } from "react";
import {
  Star,
  MousePointerClick,
  Clock,
  CheckCircle,
  Phone,
  Eye,
  MessageCircle,
  ArrowUpRight,
  Flag,
  ChevronRight,
} from "lucide-react";
import StatCard from "../../components/Admin/StatCard";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

// ── Types ──────────────────────────────────────────────────────────────────
interface DashboardStats {
  totalProviders: number;
  activeProviders: number;
  totalViews: number;
  totalLeadEvents: number;
  clickToCall: number;
  clickToWhatsApp: number;
  avgRating: number;
  flaggedReviews: number;
  pendingProviders: number;
  totalReviews: number;
}

interface TopProvider {
  id: string;
  name: string;
  category: string;
  calls: number;
  whatsapp: number;
  views: number;
  totalLeads: number;
}

// ── Time filter helpers ────────────────────────────────────────────────────
function getDateRange(filter: string): { from: string; prev: string } {
  const now = new Date();
  const days =
    filter === "today"
      ? 1
      : filter === "7days"
        ? 7
        : filter === "30days"
          ? 30
          : 90;

  const from = new Date(now);
  from.setDate(from.getDate() - days);
  const prev = new Date(from);
  prev.setDate(prev.getDate() - days);

  return { from: from.toISOString(), prev: prev.toISOString() };
}

// ── Component ──────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState("7days");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topProviders, setTopProviders] = useState<TopProvider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData(timeFilter);
  }, [timeFilter]);

  const fetchDashboardData = async (filter: string) => {
    setLoading(true);
    const { from, prev } = getDateRange(filter);
    try {
      await Promise.all([fetchStats(from), fetchTopProviders(from, prev)]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (from: string) => {
    const { data: providerCounts } = await supabase
      .from("providers")
      .select("status");

    const totalProviders = providerCounts?.length ?? 0;
    const activeProviders =
      providerCounts?.filter((p) => p.status === "active").length ?? 0;

    const { count: pendingProviders } = await supabase
      .from("provider_applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    const { count: flaggedReviews } = await supabase
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("is_flagged", true);

    const { data: ratingsData } = await supabase
      .from("providers")
      .select("avg_rating, total_reviews")
      .eq("status", "active");

    const totalReviews =
      ratingsData?.reduce((sum, p) => sum + (p.total_reviews ?? 0), 0) ?? 0;
    const ratedProviders = ratingsData?.filter((p) => p.avg_rating > 0) ?? [];
    const avgRating =
      ratedProviders.length > 0
        ? ratedProviders.reduce((sum, p) => sum + (p.avg_rating ?? 0), 0) /
          ratedProviders.length
        : 0;

    const { data: allEvents } = await supabase
      .from("provider_lead_events")
      .select("event_type")
      .gte("created_at", from);

    const totalViews =
      allEvents?.filter((e) => e.event_type === "profile_view").length ?? 0;
    const clickToCall =
      allEvents?.filter((e) => e.event_type === "call_click").length ?? 0;
    const clickToWhatsApp =
      allEvents?.filter((e) => e.event_type === "whatsapp_click").length ?? 0;
    const totalLeadEvents = clickToCall + clickToWhatsApp;

    setStats({
      totalProviders,
      activeProviders,
      totalViews,
      totalLeadEvents,
      clickToCall,
      clickToWhatsApp,
      avgRating: parseFloat(avgRating.toFixed(1)),
      flaggedReviews: flaggedReviews ?? 0,
      pendingProviders: pendingProviders ?? 0,
      totalReviews,
    });
  };

  const fetchTopProviders = async (from: string, prev: string) => {
    const { data: currentEvents } = await supabase
      .from("provider_lead_events")
      .select("provider_id, event_type")
      .in("event_type", ["call_click", "whatsapp_click"])
      .gte("created_at", from);

    void prev;

    if (!currentEvents) return;

    const currentMap = new Map<string, { calls: number; whatsapp: number }>();
    for (const e of currentEvents) {
      const existing = currentMap.get(e.provider_id) ?? {
        calls: 0,
        whatsapp: 0,
      };
      if (e.event_type === "call_click") existing.calls++;
      if (e.event_type === "whatsapp_click") existing.whatsapp++;
      currentMap.set(e.provider_id, existing);
    }

    const sorted = [...currentMap.entries()]
      .map(([id, counts]) => ({
        id,
        calls: counts.calls,
        whatsapp: counts.whatsapp,
        total: counts.calls + counts.whatsapp,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    if (sorted.length === 0) {
      setTopProviders([]);
      return;
    }

    const ids = sorted.map((p) => p.id);

    const { data: providerDetails } = await supabase
      .from("providers")
      .select("id, business_name, full_name, primary_category")
      .in("id", ids);

    const { data: viewEvents } = await supabase
      .from("provider_lead_events")
      .select("provider_id")
      .eq("event_type", "profile_view")
      .gte("created_at", from)
      .in("provider_id", ids);

    const viewMap = new Map<string, number>();
    for (const e of viewEvents ?? []) {
      viewMap.set(e.provider_id, (viewMap.get(e.provider_id) ?? 0) + 1);
    }

    setTopProviders(
      sorted.map((p) => {
        const d = providerDetails?.find((x) => x.id === p.id);
        return {
          id: p.id,
          name: d?.business_name || d?.full_name || "Unknown Provider",
          category: d?.primary_category ?? "—",
          calls: p.calls,
          whatsapp: p.whatsapp,
          views: viewMap.get(p.id) ?? 0,
          totalLeads: p.total,
        };
      }),
    );
  };

  const rankEmoji = (i: number) =>
    i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;

  const SkeletonStatCard = () => (
    <div className="skeleton-stat-card">
      <div className="skeleton-icon-box" />
      <div style={{ flex: 1 }}>
        <div
          className="skeleton-line"
          style={{ width: "40%", height: 11, marginBottom: 10 }}
        />
        <div className="skeleton-line" style={{ width: "60%", height: 28 }} />
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .admin-dashboard {
          padding: 32px;
          max-width: 1600px;
          margin: 0 auto;
        }

        /* ── Page Header ─────────────────────────────────── */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 28px;
          gap: 16px;
        }
        .page-title {
          font-size: 26px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.8px;
          line-height: 1.1;
          margin-bottom: 4px;
        }
        .page-subtitle {
          font-size: 13px;
          color: var(--text-tertiary);
          font-weight: 500;
        }
        .time-filter {
          display: inline-flex;
          gap: 4px;
          padding: 4px;
          background: var(--filter-bg);
          border-radius: 10px;
          border: 1.5px solid var(--border-color);
          flex-shrink: 0;
        }
        .filter-btn {
          padding: 7px 15px;
          border-radius: 7px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
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

        /* ── Section label ───────────────────────────────── */
        .section-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: var(--text-tertiary);
          margin-bottom: 12px;
        }

        /* ── Stat Cards ──────────────────────────────────── */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }
        .skeleton-stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 14px;
          min-height: 88px;
        }
        .skeleton-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--chip-bg);
          animation: pulse 1.5s ease-in-out infinite;
          flex-shrink: 0;
        }
        .skeleton-line {
          border-radius: 5px;
          background: var(--chip-bg);
          animation: pulse 1.5s ease-in-out infinite;
        }

        /* ── Main Grid ───────────────────────────────────── */
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 20px;
        }
        .dashboard-card {
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 16px;
          overflow: hidden;
          transition: box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .dashboard-card:hover {
          border-color: var(--border-hover);
          box-shadow: 0 8px 28px var(--card-shadow);
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px 16px;
        }
        .card-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.2px;
        }
        .card-link {
          font-size: 12px;
          color: var(--orange-primary);
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 10px;
          border-radius: 7px;
          transition: background 0.2s ease;
        }
        .card-link:hover { background: var(--orange-light-bg); }

        /* ── Performers Table ────────────────────────────── */
        .performers-table {
          width: 100%;
          border-collapse: collapse;
          border-top: 1.5px solid var(--border-color);
        }
        .performers-table thead tr {
          background: var(--chip-bg);
          border-bottom: 1.5px solid var(--border-color);
        }
        .performers-table thead th {
          padding: 9px 16px;
          font-size: 10.5px;
          font-weight: 700;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.7px;
          text-align: left;
          white-space: nowrap;
        }
        .performers-table thead th.num {
          text-align: right;
        }
        .performers-table thead th:first-child {
          width: 40px;
          text-align: center;
          padding-left: 20px;
        }
        .performers-table thead th:last-child {
          width: 32px;
          padding-right: 16px;
        }

        /* body rows */
        .performers-table tbody tr {
          border-bottom: 1px solid var(--border-color);
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .performers-table tbody tr:last-child { border-bottom: none; }
        .performers-table tbody tr:hover { background: var(--hover-bg); }
        .performers-table tbody tr:hover .row-arrow { opacity: 1; }

        .performers-table tbody td {
          padding: 13px 16px;
          vertical-align: middle;
        }
        .performers-table tbody td:first-child {
          padding-left: 20px;
          text-align: center;
          width: 40px;
        }
        .performers-table tbody td:last-child {
          padding-right: 16px;
          width: 32px;
        }
        .performers-table tbody td.num {
          text-align: right;
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          font-variant-numeric: tabular-nums;
        }

        /* rank cell */
        .rank-emoji { font-size: 19px; line-height: 1; }
        .rank-number {
          font-size: 12px;
          font-weight: 800;
          color: var(--text-tertiary);
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: var(--chip-bg);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        /* provider name cell */
        .provider-name-cell {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 200px;
          margin-bottom: 2px;
        }
        .provider-category-cell {
          font-size: 11.5px;
          color: var(--text-tertiary);
          font-weight: 500;
        }

        /* lead chips */
        .lead-chip {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 3px 7px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
        }
        .lead-chip.call    { background: rgba(21,128,61,0.1);  color: #15803D; }
        .lead-chip.wa      { background: rgba(37,99,235,0.08); color: #2563EB; }
        .chips-cell        { display: flex; gap: 6px; align-items: center; }

        /* views cell */
        .views-cell {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
          font-variant-numeric: tabular-nums;
        }

        /* arrow */
        .row-arrow { opacity: 0; transition: opacity 0.15s ease; color: var(--text-tertiary); }

        /* skeleton rows */
        .sk-row td { padding: 14px 16px; }
        .sk-row td:first-child { padding-left: 20px; }
        .sk { border-radius: 5px; background: var(--chip-bg); animation: pulse 1.5s ease-in-out infinite; display: block; }
        .sk-circle { border-radius: 50%; }

        /* empty state */
        .empty-state {
          padding: 52px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .empty-icon-wrap {
          width: 56px; height: 56px; border-radius: 16px;
          background: var(--chip-bg);
          display: flex; align-items: center; justify-content: center;
          font-size: 26px; margin-bottom: 4px;
        }
        .empty-title { font-size: 15px; font-weight: 700; color: var(--text-primary); }
        .empty-sub   { font-size: 13px; color: var(--text-tertiary); max-width: 240px; line-height: 1.55; }

        /* ── Needs Attention ─────────────────────────────── */
        .attention-divider { height: 1px; background: var(--border-color); margin: 0 20px; }

        .action-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 20px;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .action-item:hover { background: var(--hover-bg); }
        .action-item:hover .action-arrow { opacity: 1; transform: translateX(2px); }

        .info-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 20px;
        }

        .action-icon {
          width: 42px; height: 42px; border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }
        .action-item:hover .action-icon { transform: scale(1.06); }

        .action-content { flex: 1; min-width: 0; }
        .action-title {
          font-size: 14px; font-weight: 600; color: var(--text-primary);
          margin-bottom: 2px;
        }
        .action-sub { font-size: 12px; color: var(--text-tertiary); font-weight: 500; }

        /* right side — badge + arrow side by side */
        .action-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .action-badge {
          background: linear-gradient(135deg, #ef4444 0%, #DC2626 100%);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 10px;
          min-width: 22px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(239,68,68,0.3);
          letter-spacing: 0.2px;
        }
        .action-value {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
          font-variant-numeric: tabular-nums;
        }
        .action-arrow {
          opacity: 0;
          flex-shrink: 0;
          transition: opacity 0.15s ease, transform 0.15s ease;
          color: var(--text-tertiary);
        }

        /* ── Animations ──────────────────────────────────── */
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeSlideUp 0.35s ease both; }

        /* ── CSS Variables ───────────────────────────────── */
        :root {
          --text-primary:    #111827;
          --text-secondary:  #6b7280;
          --text-tertiary:   #9ca3af;
          --card-bg:         #ffffff;
          --border-color:    #e5e7eb;
          --border-hover:    #d1d5db;
          --card-shadow:     rgba(0,0,0,0.08);
          --hover-bg:        #f9fafb;
          --chip-bg:         #f3f4f6;
          --filter-bg:       #f9fafb;
          --filter-hover-bg: rgba(255,107,53,0.08);
          --filter-active-bg:#ffffff;
          --orange-primary:  #FF6B35;
          --orange-light-bg: #FFF4ED;
          --orange-shadow:   rgba(255,107,53,0.15);
        }
        .dark-mode {
          --text-primary:    #f9fafb;
          --text-secondary:  #d1d5db;
          --text-tertiary:   #9ca3af;
          --card-bg:         #1f2937;
          --border-color:    #374151;
          --border-hover:    #4b5563;
          --card-shadow:     rgba(0,0,0,0.4);
          --hover-bg:        #374151;
          --chip-bg:         #374151;
          --filter-bg:       #374151;
          --filter-hover-bg: rgba(255,138,91,0.12);
          --filter-active-bg:#1f2937;
          --orange-primary:  #FF8A5B;
          --orange-light-bg: rgba(255,107,53,0.12);
          --orange-shadow:   rgba(255,138,91,0.2);
        }

        /* ── Responsive ──────────────────────────────────── */
        @media (max-width: 1280px) {
          .dashboard-grid { grid-template-columns: 1fr; }
          .stats-grid     { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .admin-dashboard { padding: 20px 16px; }
          .page-title      { font-size: 22px; }
          .time-filter     { display: none; }
          .stats-grid      { grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px; }
          .performers-table thead th.hide-mobile,
          .performers-table tbody td.hide-mobile { display: none; }
          .card-header     { padding: 16px 18px 12px; }
        }
      `}</style>

      <div className="admin-dashboard">
        {/* ── Page Header ──────────────────────────────────────────── */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">
              Platform overview & performance metrics
            </p>
          </div>
          <div className="time-filter">
            {(
              [
                { label: "Today", value: "today" },
                { label: "7 Days", value: "7days" },
                { label: "30 Days", value: "30days" },
                { label: "90 Days", value: "90days" },
              ] as const
            ).map(({ label, value }) => (
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

        {/* ── Stat Cards ───────────────────────────────────────────── */}
        <div className="section-label">Overview</div>
        <div className="stats-grid">
          {loading || !stats ? (
            [1, 2, 3, 4].map((i) => <SkeletonStatCard key={i} />)
          ) : (
            <div className="fade-in" style={{ display: "contents" }}>
              <StatCard
                label="Profile Views"
                value={stats.totalViews.toLocaleString()}
                icon={Eye}
                iconColor="blue"
              />
              <StatCard
                label="Total Leads"
                value={stats.totalLeadEvents.toLocaleString()}
                icon={MousePointerClick}
                iconColor="orange"
              />
              <StatCard
                label="Call Clicks"
                value={stats.clickToCall.toLocaleString()}
                icon={Phone}
                iconColor="green"
              />
              <StatCard
                label="WhatsApp"
                value={stats.clickToWhatsApp.toLocaleString()}
                icon={MessageCircle}
                iconColor="purple"
              />
            </div>
          )}
        </div>

        {/* ── Main Grid ────────────────────────────────────────────── */}
        <div className="dashboard-grid">
          {/* ── Top Performers ───────────────────────────────────── */}
          <div className="dashboard-card">
            <div className="card-header">
              <div className="card-title">Top Performers</div>
              <span
                className="card-link"
                onClick={() => navigate("/admin/providers?sort=leads")} // ← add ?sort=leads
              >
                View all <ArrowUpRight size={13} strokeWidth={2.5} />
              </span>
            </div>

            {loading ? (
              /* skeleton */
              <table className="performers-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Provider</th>
                    <th className="num">Total Leads</th>
                    <th className="num hide-mobile">WhatsApp</th>
                    <th className="num hide-mobile">Calls</th>
                    <th className="num hide-mobile">Views</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="sk-row">
                      <td>
                        <div
                          className="sk sk-circle"
                          style={{ width: 26, height: 26, margin: "0 auto" }}
                        />
                      </td>
                      <td>
                        <div
                          className="sk"
                          style={{ width: "55%", height: 12, marginBottom: 7 }}
                        />
                        <div
                          className="sk"
                          style={{ width: "32%", height: 10 }}
                        />
                      </td>
                      <td>
                        <div
                          className="sk"
                          style={{ width: 32, height: 14, marginLeft: "auto" }}
                        />
                      </td>
                      <td className="hide-mobile">
                        <div
                          className="sk"
                          style={{
                            width: 48,
                            height: 22,
                            borderRadius: 20,
                            marginLeft: "auto",
                          }}
                        />
                      </td>
                      <td className="hide-mobile">
                        <div
                          className="sk"
                          style={{
                            width: 48,
                            height: 22,
                            borderRadius: 20,
                            marginLeft: "auto",
                          }}
                        />
                      </td>
                      <td className="hide-mobile">
                        <div
                          className="sk"
                          style={{ width: 36, height: 12, marginLeft: "auto" }}
                        />
                      </td>
                      <td />
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : topProviders.length === 0 ? (
              <div className="empty-state fade-in">
                <div className="empty-icon-wrap">📊</div>
                <div className="empty-title">No lead data yet</div>
                <div className="empty-sub">
                  Data will appear once providers start receiving calls or
                  WhatsApp contacts.
                </div>
              </div>
            ) : (
              <table className="performers-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Provider</th>
                    <th className="num">Total Leads</th>
                    <th className="num hide-mobile">WhatsApp</th>
                    <th className="num hide-mobile">Calls</th>
                    <th className="num hide-mobile">Views</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {topProviders.map((provider, index) => (
                    <tr
                      key={provider.id}
                      className="fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() =>
                        navigate(`/admin/providers/${provider.id}`)
                      }
                    >
                      {/* Rank */}
                      <td>
                        {rankEmoji(index) ? (
                          <span className="rank-emoji">{rankEmoji(index)}</span>
                        ) : (
                          <span className="rank-number">#{index + 1}</span>
                        )}
                      </td>

                      {/* Provider */}
                      <td>
                        <div
                          className="provider-name-cell"
                          title={provider.name}
                        >
                          {provider.name}
                        </div>
                        <div className="provider-category-cell">
                          {provider.category}
                        </div>
                      </td>

                      {/* Total Leads */}
                      <td className="num">{provider.totalLeads}</td>

                      {/* WhatsApp chip */}
                      <td
                        className="hide-mobile"
                        style={{ textAlign: "right" }}
                      >
                        <span className="lead-chip wa">
                          <MessageCircle size={10} strokeWidth={2.5} />
                          {provider.whatsapp}
                        </span>
                      </td>

                      {/* Calls chip */}
                      <td
                        className="hide-mobile"
                        style={{ textAlign: "right" }}
                      >
                        <span className="lead-chip call">
                          <Phone size={10} strokeWidth={2.5} />
                          {provider.calls}
                        </span>
                      </td>

                      {/* Views */}
                      <td
                        className="hide-mobile"
                        style={{ textAlign: "right" }}
                      >
                        <span className="views-cell">
                          <Eye
                            size={12}
                            strokeWidth={2}
                            style={{ color: "var(--text-tertiary)" }}
                          />
                          {provider.views.toLocaleString()}
                        </span>
                      </td>

                      {/* Arrow */}
                      <td>
                        <ChevronRight
                          size={14}
                          strokeWidth={2}
                          className="row-arrow"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* ── Needs Attention ──────────────────────────────────── */}
          <div className="dashboard-card">
            <div className="card-header">
              <div className="card-title">Needs Attention</div>
            </div>

            {/* Flagged Reviews */}
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
                <Flag size={18} strokeWidth={2.5} />
              </div>
              <div className="action-content">
                <div className="action-title">Flagged Reviews</div>
                <div className="action-sub">Awaiting moderation</div>
              </div>
              <div className="action-right">
                {!loading && stats && stats.flaggedReviews > 0 && (
                  <span className="action-badge">{stats.flaggedReviews}</span>
                )}
                <ChevronRight
                  size={15}
                  strokeWidth={2}
                  className="action-arrow"
                />
              </div>
            </div>

            <div className="attention-divider" />

            {/* Pending Providers */}
            <div
              className="action-item"
              onClick={() => navigate("/admin/providers")}
            >
              <div
                className="action-icon"
                style={{ background: "rgba(37,99,235,0.1)", color: "#2563EB" }}
              >
                <Clock size={18} strokeWidth={2.5} />
              </div>
              <div className="action-content">
                <div className="action-title">New Providers</div>
                <div className="action-sub">Pending approval</div>
              </div>
              <div className="action-right">
                {!loading && stats && stats.pendingProviders > 0 && (
                  <span className="action-badge">{stats.pendingProviders}</span>
                )}
                <ChevronRight
                  size={15}
                  strokeWidth={2}
                  className="action-arrow"
                />
              </div>
            </div>

            <div className="attention-divider" />

            {/* Active Providers */}
            <div className="info-item">
              <div
                className="action-icon"
                style={{ background: "rgba(21,128,61,0.1)", color: "#15803D" }}
              >
                <CheckCircle size={18} strokeWidth={2.5} />
              </div>
              <div className="action-content">
                <div className="action-title">Active Providers</div>
                <div className="action-sub">Live on platform</div>
              </div>
              <div className="action-value">
                {loading || !stats ? "—" : stats.activeProviders}
              </div>
            </div>

            <div className="attention-divider" />

            {/* Platform Rating */}
            <div className="info-item">
              <div
                className="action-icon"
                style={{ background: "rgba(234,179,8,0.1)", color: "#EAB308" }}
              >
                <Star size={18} strokeWidth={2.5} />
              </div>
              <div className="action-content">
                <div className="action-title">Platform Rating</div>
                <div className="action-sub">
                  {loading || !stats
                    ? "Loading…"
                    : `${stats.totalReviews.toLocaleString()} reviews`}
                </div>
              </div>
              <div className="action-value">
                {loading || !stats ? (
                  "—"
                ) : (
                  <>
                    {stats.avgRating}
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--text-tertiary)",
                        fontWeight: 500,
                      }}
                    >
                      /5
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
