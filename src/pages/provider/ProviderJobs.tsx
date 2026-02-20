// src/pages/provider/ProviderJobs.tsx
import { useState, useEffect } from "react";
import {
  Briefcase,
  Clock,
  CheckCircle,
  MapPin,
  Calendar,
  Eye,
  Plus,
  Phone,
  XCircle,
  Mail,
  Loader2,
} from "lucide-react";
import PageHeader from "../../components/Admin/PageHeader";
import SearchBar from "../../components/Admin/SearchBar";
import AddJobModal from "../../components/ProviderPanel/AddJobModal";
import { supabase } from "../../lib/supabaseClient";

interface Job {
  id: string;
  title: string;
  customerName: string;
  location: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
  scheduledDate?: string;
  customerPhone?: string;
  customerEmail?: string;
  budget?: string;
}

type FilterStatus =
  | "All"
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled";

const ProviderJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [providerId, setProviderId] = useState<string | null>(null);

  useEffect(() => {
    fetchProviderAndJobs();
  }, []);

  const fetchProviderAndJobs = async () => {
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
      await fetchJobs(provider.id);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async (pid: string) => {
    const { data, error } = await supabase
      .from("provider_jobs")
      .select("*")
      .eq("provider_id", pid)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setJobs(
        data.map((j) => ({
          id: j.id,
          title: j.title,
          customerName: j.customer_name,
          location: j.location,
          status: j.status,
          createdAt: j.created_at,
          scheduledDate: j.scheduled_date,
          customerPhone: j.customer_phone,
          customerEmail: j.customer_email,
          budget: j.budget,
        })),
      );
    }
  };

  const handleUpdateStatus = async (
    jobId: string,
    newStatus: "completed" | "cancelled",
  ) => {
    setActionLoading(jobId + newStatus);
    try {
      const { error } = await supabase
        .from("provider_jobs")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", jobId);

      if (!error) {
        setJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j)),
        );
      }
    } catch (error) {
      console.error("Error updating job:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const getFilteredJobs = () => {
    let filtered = jobs;
    if (filterStatus !== "All")
      filtered = filtered.filter((j) => j.status === filterStatus);
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(query) ||
          j.customerName.toLowerCase().includes(query) ||
          j.location.toLowerCase().includes(query),
      );
    }
    return filtered;
  };

  const filteredJobs = getFilteredJobs();

  const jobStats = {
    total: jobs.length,
    inProgress: jobs.filter((j) => j.status === "in_progress").length,
    completed: jobs.filter((j) => j.status === "completed").length,
    pending: jobs.filter((j) => j.status === "pending").length,
  };

  // Stat card click — toggle filter, click same card again to reset to All
  const handleStatClick = (status: FilterStatus) => {
    setFilterStatus((prev) => (prev === status ? "All" : status));
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          bg: "#fef7e0",
          text: "#8f5d00",
          border: "#fbbf24",
          icon: Clock,
          darkBg: "rgba(143,93,0,0.15)",
          darkText: "#fcd34d",
        };
      case "in_progress":
        return {
          bg: "#eff6ff",
          text: "#2563eb",
          border: "#93c5fd",
          icon: Briefcase,
          darkBg: "rgba(37,99,235,0.15)",
          darkText: "#60a5fa",
        };
      case "completed":
        return {
          bg: "#dcfce7",
          text: "#15803d",
          border: "#86efac",
          icon: CheckCircle,
          darkBg: "rgba(21,128,61,0.15)",
          darkText: "#4ade80",
        };
      case "cancelled":
        return {
          bg: "#fee2e2",
          text: "#dc2626",
          border: "#fca5a5",
          icon: XCircle,
          darkBg: "rgba(220,38,38,0.15)",
          darkText: "#f87171",
        };
      default:
        return {
          bg: "#f3f4f6",
          text: "#6b7280",
          border: "#e5e7eb",
          icon: Briefcase,
          darkBg: "#374151",
          darkText: "#9ca3af",
        };
    }
  };

  const getStatusLabel = (status: string) =>
    status
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatScheduled = (dateStr?: string) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Stat card configs — each knows its filter value
  const statCards: {
    label: string;
    value: number;
    icon: any;
    filterValue: FilterStatus;
    activeColor: string;
  }[] = [
    {
      label: "Total Jobs",
      value: jobStats.total,
      icon: Briefcase,
      filterValue: "All",
      activeColor: "#FF6B35",
    },
    {
      label: "Pending",
      value: jobStats.pending,
      icon: Clock,
      filterValue: "pending",
      activeColor: "#d97706",
    },
    {
      label: "In Progress",
      value: jobStats.inProgress,
      icon: Briefcase,
      filterValue: "in_progress",
      activeColor: "#2563eb",
    },
    {
      label: "Completed",
      value: jobStats.completed,
      icon: CheckCircle,
      filterValue: "completed",
      activeColor: "#15803d",
    },
  ];

  return (
    <>
      <style>{`
        .provider-jobs {
          padding: 24px 28px;
          max-width: 1600px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
        }

        /* ── Stat Cards ── */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }

        .stat-filter-card {
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 14px;
          padding: 18px 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 14px;
          user-select: none;
          position: relative;
          overflow: hidden;
        }

        .stat-filter-card:hover {
          border-color: var(--border-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
        }

        .stat-filter-card.active {
          border-color: var(--stat-active-color);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--stat-active-color) 15%, transparent);
        }

        .stat-filter-card.active::after {
          content: '';
          position: absolute;
          inset: 0;
          background: color-mix(in srgb, var(--stat-active-color) 6%, transparent);
          pointer-events: none;
        }

        .stat-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s;
        }

        .stat-text { flex: 1; min-width: 0; }

        .stat-value {
          font-size: 24px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.5px;
          line-height: 1;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .stat-active-dot {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--stat-active-color);
        }

        /* ── Actions Bar ── */
        .actions-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .search-wrapper {
          flex: 1;
          max-width: 480px;
          min-width: 0;
          margin-top: 20px;
        }

        /* Active filter pill */
        .active-filter-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          background: rgba(255,107,53,0.1);
          color: var(--orange-primary);
          border: 1.5px solid rgba(255,107,53,0.25);
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .active-filter-pill:hover { background: rgba(255,107,53,0.18); }
        .active-filter-pill svg { opacity: 0.7; }

        .add-job-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0 20px;
          height: 44px;
          background: linear-gradient(135deg, #FF6B35 0%, #E85A28 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.25);
          margin-left: auto;
        }

        .add-job-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(255, 107, 53, 0.35);
        }

        /* ── Jobs Grid ── */
        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .job-card {
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 14px;
          padding: 20px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .job-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #FF6B35 0%, #E85A28 100%);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .job-card:hover { border-color: var(--border-hover); box-shadow: 0 8px 24px var(--card-shadow); transform: translateY(-2px); }
        .job-card:hover::before { transform: scaleX(1); }

        .job-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
        .job-title  { font-size: 15px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.2px; flex: 1; line-height: 1.3; }

        .status-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 8px;
          font-size: 12px; font-weight: 600; border: 1px solid;
          white-space: nowrap; flex-shrink: 0;
        }

        .job-info { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; flex: 1; }
        .info-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-secondary); }
        .info-row svg { color: var(--text-tertiary); flex-shrink: 0; }
        .info-row strong { color: var(--text-primary); font-weight: 600; }

        .budget-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 3px 10px; background: rgba(255,107,53,0.08);
          color: var(--orange-primary); border-radius: 6px;
          font-size: 12px; font-weight: 600;
          border: 1px solid rgba(255,107,53,0.2);
        }

        .job-actions-section { border-top: 1.5px solid var(--border-color); padding-top: 14px; margin-top: auto; display: flex; flex-direction: column; gap: 10px; }
        .job-date { font-size: 11px; color: var(--text-tertiary); }
        .job-action-buttons { display: flex; gap: 8px; }

        .action-btn {
          flex: 1; display: inline-flex; align-items: center; justify-content: center;
          gap: 6px; padding: 8px 12px; border-radius: 8px;
          font-size: 12px; font-weight: 600; cursor: pointer;
          transition: all 0.2s ease; border: 1.5px solid;
        }
        .action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .action-btn.complete { background: #dcfce7; color: #15803d; border-color: #86efac; }
        .action-btn.complete:hover:not(:disabled) { background: #15803d; color: #fff; border-color: #15803d; }
        .action-btn.cancel { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }
        .action-btn.cancel:hover:not(:disabled) { background: #dc2626; color: #fff; border-color: #dc2626; }
        .dark-mode .action-btn.complete { background: rgba(21,128,61,0.15); color: #4ade80; border-color: rgba(21,128,61,0.3); }
        .dark-mode .action-btn.cancel   { background: rgba(220,38,38,0.15); color: #f87171; border-color: rgba(220,38,38,0.3); }
        .dark-mode .status-badge { background: rgba(var(--badge-rgb), 0.15) !important; border-color: transparent !important; }

        .empty-state { grid-column: 1 / -1; padding: 80px 20px; text-align: center; border: 1.5px dashed var(--border-color); border-radius: 14px; background: var(--card-bg); }
        .empty-icon  { font-size: 48px; margin-bottom: 16px; }
        .empty-title { font-size: 18px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; }
        .empty-text  { font-size: 14px; color: var(--text-secondary); }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .jobs-grid  { grid-template-columns: repeat(2, 1fr); }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .provider-jobs  { padding: 16px; }
          .stats-grid     { grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 16px; }
          .actions-bar    { flex-wrap: wrap; gap: 10px; }
          .search-wrapper { max-width: none; flex: 1 1 200px; }
          .add-job-btn    { margin-left: 0; }
          .jobs-grid      { grid-template-columns: 1fr; gap: 12px; }
          .job-card       { padding: 16px; }
          .job-title      { font-size: 14px; }
          .info-row       { font-size: 12px; }
        }

        @media (max-width: 480px) {
          .provider-jobs       { padding: 12px; }
          .stats-grid          { gap: 8px; }
          .job-action-buttons  { flex-direction: column; }
          .action-btn          { width: 100%; }
        }
      `}</style>

      <div className="provider-jobs">
        <PageHeader
          title="Jobs"
          subtitle="Manage your service requests and bookings"
          icon={Briefcase}
        />

        {/* ── Stat Cards (clickable filters) ── */}
        <div className="stats-grid">
          {statCards.map(
            ({ label, value, icon: Icon, filterValue, activeColor }) => {
              const isActive = filterStatus === filterValue;
              return (
                <div
                  key={filterValue}
                  className={`stat-filter-card ${isActive ? "active" : ""}`}
                  style={
                    {
                      "--stat-active-color": activeColor,
                    } as React.CSSProperties
                  }
                  onClick={() => handleStatClick(filterValue)}
                  title={
                    isActive ? `Remove "${label}" filter` : `Filter by ${label}`
                  }
                >
                  <div
                    className="stat-icon-wrap"
                    style={{
                      background: isActive
                        ? `color-mix(in srgb, ${activeColor} 15%, transparent)`
                        : "var(--hover-bg)",
                      color: isActive ? activeColor : "var(--text-secondary)",
                    }}
                  >
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <div className="stat-text">
                    <div className="stat-value">{value}</div>
                    <div className="stat-label">{label}</div>
                  </div>
                  {isActive && <div className="stat-active-dot" />}
                </div>
              );
            },
          )}
        </div>

        {/* ── Actions Bar ── */}
        <div className="actions-bar">
          <div className="search-wrapper">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by job title, customer, or location..."
            />
          </div>

          {/* Active filter pill — shows which stat is selected, click to clear */}
          {filterStatus !== "All" && (
            <button
              className="active-filter-pill"
              onClick={() => setFilterStatus("All")}
              title="Clear filter"
            >
              {getStatusLabel(filterStatus)}
              <XCircle size={13} strokeWidth={2.5} />
            </button>
          )}

          <button className="add-job-btn" onClick={() => setShowAddModal(true)}>
            <Plus size={18} strokeWidth={2.5} />
            Add New Job
          </button>
        </div>

        {/* ── Jobs Grid ── */}
        <div className="jobs-grid">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="job-card"
                style={{
                  minHeight: 200,
                  background: "var(--border-color)",
                  opacity: 0.4,
                }}
              />
            ))
          ) : filteredJobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3 className="empty-title">No jobs found</h3>
              <p className="empty-text">
                {searchQuery || filterStatus !== "All"
                  ? "No jobs match your current filters"
                  : "Add your first job to get started"}
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const statusConfig = getStatusConfig(job.status);
              const StatusIcon = statusConfig.icon;
              const isActioning = actionLoading?.startsWith(job.id);

              return (
                <div key={job.id} className="job-card">
                  <div className="job-header">
                    <h3 className="job-title">{job.title}</h3>
                    <div
                      className="status-badge"
                      style={{
                        background: statusConfig.bg,
                        color: statusConfig.text,
                        borderColor: statusConfig.border,
                      }}
                    >
                      <StatusIcon size={12} strokeWidth={2.5} />
                      {getStatusLabel(job.status)}
                    </div>
                  </div>

                  <div className="job-info">
                    <div className="info-row">
                      <Eye size={14} />
                      <strong>{job.customerName}</strong>
                    </div>
                    <div className="info-row">
                      <MapPin size={14} />
                      {job.location}
                    </div>
                    {job.customerPhone && (
                      <div className="info-row">
                        <Phone size={14} />
                        <strong>{job.customerPhone}</strong>
                      </div>
                    )}
                    {job.customerEmail && (
                      <div className="info-row">
                        <Mail size={14} />
                        <strong>{job.customerEmail}</strong>
                      </div>
                    )}
                    {job.scheduledDate && (
                      <div className="info-row">
                        <Calendar size={14} />
                        {formatScheduled(job.scheduledDate)}
                      </div>
                    )}
                    {job.budget && (
                      <div className="info-row">
                        <span className="budget-badge">{job.budget}</span>
                      </div>
                    )}
                  </div>

                  <div className="job-actions-section">
                    <span className="job-date">
                      Added {formatDate(job.createdAt)}
                    </span>
                    {job.status !== "completed" &&
                      job.status !== "cancelled" && (
                        <div className="job-action-buttons">
                          <button
                            className="action-btn complete"
                            disabled={!!isActioning}
                            onClick={() =>
                              handleUpdateStatus(job.id, "completed")
                            }
                          >
                            {actionLoading === job.id + "completed" ? (
                              <Loader2 size={13} className="spin" />
                            ) : (
                              <CheckCircle size={13} />
                            )}
                            Complete
                          </button>
                          <button
                            className="action-btn cancel"
                            disabled={!!isActioning}
                            onClick={() =>
                              handleUpdateStatus(job.id, "cancelled")
                            }
                          >
                            {actionLoading === job.id + "cancelled" ? (
                              <Loader2 size={13} className="spin" />
                            ) : (
                              <XCircle size={13} />
                            )}
                            Cancel
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {showAddModal && (
          <AddJobModal
            onClose={() => setShowAddModal(false)}
            providerId={providerId}
            onJobAdded={() => providerId && fetchJobs(providerId)}
          />
        )}
      </div>
    </>
  );
};

export default ProviderJobs;
