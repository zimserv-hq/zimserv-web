// src/pages/admin/AdminApplications.tsx
import { useState, useRef, useEffect } from "react";
import {
  Search,
  Filter,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  X,
  Eye,
  MapPin,
  Briefcase,
  Send,
} from "lucide-react";
import PageHeader from "../../components/Admin/PageHeader";
import StatCard from "../../components/Admin/StatCard";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useToast } from "../../contexts/ToastContext";

export type Application = {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  whatsapp_number: string | null;
  city: string;
  primary_category: string;
  primary_category_id: string | null;
  suggested_category: string | null;
  categories?: { name: string } | null;
  work_type: string;
  availability: string | null;
  description: string;
  referral_source: string | null;
  verification_file_url: string | null;
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "invite_sent"
    | "invite_expired"
    | "onboarding";
  last_invited_at: string | null;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  rejection_reason: string | null;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const isResend = (app: Application) => app.status === "invite_expired";

// ── Skeleton Components ───────────────────────────────────────────────────────

const SkeletonStatCard = () => (
  <div className="skeleton-stat-card">
    <div className="skeleton-stat-top">
      <div className="skeleton-block skeleton-stat-label" />
      <div className="skeleton-circle skeleton-stat-icon" />
    </div>
    <div className="skeleton-block skeleton-stat-value" />
  </div>
);

const SkeletonRow = () => (
  <tr className="skeleton-row">
    <td>
      <div className="skeleton-applicant-cell">
        <div className="skeleton-block skeleton-name" />
        <div className="skeleton-block skeleton-email" />
      </div>
    </td>
    <td>
      <div className="skeleton-block skeleton-cell-md" />
    </td>
    <td>
      <div className="skeleton-block skeleton-cell-sm" />
    </td>
    <td>
      <div className="skeleton-block skeleton-cell-md" />
    </td>
    <td>
      <div className="skeleton-pill" />
    </td>
    <td>
      <div className="skeleton-actions">
        <div className="skeleton-btn" />
        <div className="skeleton-btn" />
      </div>
    </td>
  </tr>
);

const SkeletonCard = () => (
  <div className="app-card">
    <div className="app-card-header">
      <div
        style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}
      >
        <div className="skeleton-block skeleton-name" />
        <div className="skeleton-block skeleton-email" />
        <div className="skeleton-pill" style={{ width: 80, marginTop: 4 }} />
      </div>
    </div>
    <div className="app-card-meta">
      <div className="skeleton-block skeleton-cell-md" />
      <div className="skeleton-block skeleton-cell-sm" />
    </div>
    <div className="app-card-stats">
      <div className="skeleton-block" style={{ height: 40, flex: 1 }} />
      <div className="skeleton-block" style={{ height: 40, flex: 1 }} />
    </div>
    <div className="app-card-actions">
      <div
        className="skeleton-block skeleton-btn"
        style={{ flex: 1, height: 38 }}
      />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

const AdminApplications = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [filterStatus, setFilterStatus] = useState<
    | "All"
    | "pending"
    | "approved"
    | "rejected"
    | "invite_sent"
    | "invite_expired"
    | "onboarding"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [modalAction, setModalAction] = useState<
    "approve" | "reject" | "resend"
  >("approve");
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("provider_applications")
        .select(`*, categories(name)`)
        .order("created_at", { ascending: false });
      if (error) {
        showError("Load failed", "Failed to load applications.");
        return;
      }
      setApplications(data || []);
    } catch (err) {
      showError("Unexpected error", "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setShowFilter(false);
      }
    };
    if (showFilter) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilter]);

  const getCategoryName = (app: Application) => {
    if (app.suggested_category && app.primary_category === "Other") {
      return `${app.suggested_category} (Custom)`;
    }
    return app.categories?.name ?? app.primary_category ?? "—";
  };

  const handleView = (app: Application) =>
    navigate(`/admin/applications/${app.id}`);

  const handleApprove = (app: Application) => {
    setSelectedApplication(app);
    setModalAction(isResend(app) ? "resend" : "approve");
    setShowStatusModal(true);
  };

  const handleReject = (app: Application) => {
    setSelectedApplication(app);
    setModalAction("reject");
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedApplication) return;
    setIsUpdating(true);
    try {
      // ── Reject path ────────────────────────────────────────────────────
      if (modalAction === "reject") {
        const { error } = await supabase
          .from("provider_applications")
          .update({ status: "rejected", reviewed_at: new Date().toISOString() })
          .eq("id", selectedApplication.id);

        if (error) {
          showError("Update failed", "Failed to reject application.");
          return;
        }

        setApplications((prev) =>
          prev.map((app) =>
            app.id === selectedApplication.id
              ? {
                  ...app,
                  status: "rejected",
                  reviewed_at: new Date().toISOString(),
                }
              : app,
          ),
        );
        showSuccess(
          "Application rejected",
          "The application has been rejected.",
        );
        setShowStatusModal(false);
        setSelectedApplication(null);
        return;
      }

      // ── Approve / Resend path ──────────────────────────────────────────
      // Step 1: Set to "approved" (edge fn will flip to "invite_sent")
      const { error: approveError } = await supabase
        .from("provider_applications")
        .update({ status: "approved", reviewed_at: new Date().toISOString() })
        .eq("id", selectedApplication.id);

      if (approveError) {
        showError("Update failed", "Failed to approve application.");
        return;
      }

      // Step 2: Call edge function — sets status to "invite_sent" on success
      const { error: functionError } = await supabase.functions.invoke(
        "send-provider-invite",
        {
          body: {
            applicationId: selectedApplication.id,
            email: selectedApplication.email,
            fullName: selectedApplication.full_name,
          },
        },
      );

      // Step 3a: Failed — roll back to "pending"
      if (functionError) {
        await supabase
          .from("provider_applications")
          .update({ status: "pending", reviewed_at: null })
          .eq("id", selectedApplication.id);

        setApplications((prev) =>
          prev.map((app) =>
            app.id === selectedApplication.id
              ? { ...app, status: "pending", reviewed_at: null }
              : app,
          ),
        );

        showError(
          "Invite failed",
          "Could not send invitation email. Application was not approved. Please try again.",
        );
        setShowStatusModal(false);
        setSelectedApplication(null);
        return;
      }

      // Step 3b: Success — edge fn set status to "invite_sent"; reflect locally
      setApplications((prev) =>
        prev.map((app) =>
          app.id === selectedApplication.id
            ? {
                ...app,
                status: "invite_sent",
                reviewed_at: new Date().toISOString(),
                last_invited_at: new Date().toISOString(),
              }
            : app,
        ),
      );

      showSuccess(
        modalAction === "resend" ? "Invite resent" : "Application approved",
        `Invitation email sent to ${selectedApplication.email}.`,
      );
      setShowStatusModal(false);
      setSelectedApplication(null);
    } catch (err) {
      showError("Unexpected error", "An unexpected error occurred.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getFilteredApplications = () => {
    let filtered = applications;
    if (filterStatus !== "All")
      filtered = filtered.filter((app) => app.status === filterStatus);
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (app) =>
          app.full_name.toLowerCase().includes(query) ||
          app.email.toLowerCase().includes(query) ||
          getCategoryName(app).toLowerCase().includes(query) ||
          app.city.toLowerCase().includes(query),
      );
    }
    return filtered;
  };

  const filteredApplications = getFilteredApplications();

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    approved: applications.filter((a) =>
      ["approved", "invite_sent", "invite_expired", "onboarding"].includes(
        a.status,
      ),
    ).length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const getStatusBadgeIcon = (status: Application["status"]) => {
    switch (status) {
      case "pending":
        return <Clock size={12} strokeWidth={2.5} />;
      case "approved":
        return <CheckCircle size={12} strokeWidth={2.5} />;
      case "invite_sent":
        return <Send size={12} strokeWidth={2.5} />;
      case "invite_expired":
        return <Clock size={12} strokeWidth={2.5} />;
      case "onboarding":
        return <Clock size={12} strokeWidth={2.5} />;
      case "rejected":
        return <XCircle size={12} strokeWidth={2.5} />;
    }
  };

  const getStatusLabel = (status: Application["status"]) => {
    switch (status) {
      case "invite_sent":
        return "Invite Sent";
      case "invite_expired":
        return "Invite Expired";
      case "onboarding":
        return "Onboarding";
      default:
        return status;
    }
  };

  const renderActionButtons = (app: Application) => (
    <div className="actions-cell">
      <button className="action-btn view" onClick={() => handleView(app)}>
        <Eye size={14} strokeWidth={2.5} />
        View
      </button>
      {(app.status === "pending" || app.status === "invite_expired") && (
        <>
          {app.status === "invite_expired" ? (
            <button
              className="action-btn resend"
              onClick={() => handleApprove(app)}
            >
              <Send size={14} strokeWidth={2.5} />
              Resend Invite
            </button>
          ) : (
            <button
              className="action-btn approve"
              onClick={() => handleApprove(app)}
            >
              <CheckCircle size={14} strokeWidth={2.5} />
              Approve
            </button>
          )}
          <button
            className="action-btn reject"
            onClick={() => handleReject(app)}
          >
            <XCircle size={14} strokeWidth={2.5} />
            Reject
          </button>
        </>
      )}
    </div>
  );

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        .skeleton-block, .skeleton-circle, .skeleton-pill, .skeleton-btn, .skeleton-stat-card {
          background: linear-gradient(90deg, var(--skeleton-base) 25%, var(--skeleton-highlight) 50%, var(--skeleton-base) 75%);
          background-size: 600px 100%;
          animation: shimmer 1.6s ease-in-out infinite;
          border-radius: 6px;
        }
        :root { --skeleton-base: #f0f0f0; --skeleton-highlight: #e0e0e0; }
        .dark-mode { --skeleton-base: #374151; --skeleton-highlight: #4b5563; }

        .skeleton-stat-card { border-radius: 16px; padding: 24px; border: 1.5px solid var(--border-color); background: var(--card-bg); min-height: 110px; display: flex; flex-direction: column; justify-content: space-between; }
        .skeleton-stat-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .skeleton-stat-label { height: 13px; width: 80px; }
        .skeleton-stat-icon  { width: 40px; height: 40px; border-radius: 10px; }
        .skeleton-stat-value { height: 28px; width: 60px; }
        .skeleton-row td { padding: 18px 20px; border-bottom: 1px solid var(--border-color); }
        .skeleton-applicant-cell { display: flex; flex-direction: column; gap: 8px; }
        .skeleton-name    { height: 14px; width: 120px; }
        .skeleton-email   { height: 12px; width: 160px; }
        .skeleton-cell-md { height: 14px; width: 90px; }
        .skeleton-cell-sm { height: 14px; width: 60px; }
        .skeleton-pill    { height: 26px; width: 80px; border-radius: 20px; }
        .skeleton-actions { display: flex; gap: 8px; }
        .skeleton-btn     { height: 32px; width: 72px; border-radius: 8px; }

        .admin-applications { padding: 24px; max-width: 1400px; margin: 0 auto; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
        .toolbar { display: flex; gap: 12px; align-items: center; margin-bottom: 20px; flex-wrap: wrap; }
        .search-wrapper { position: relative; flex: 1; min-width: 200px; }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--color-text-secondary); pointer-events: none; }
        .search-input { width: 100%; padding: 10px 12px 10px 38px; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg); color: var(--color-primary); font-family: var(--font-primary); font-size: 14px; }
        .search-input:focus { outline: none; border-color: var(--color-accent); box-shadow: 0 0 0 3px var(--color-accent-soft); }
        .filter-wrapper { position: relative; }
        .filter-btn { display: flex; align-items: center; gap: 6px; padding: 10px 16px; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg); color: var(--color-primary); font-family: var(--font-primary); font-size: 14px; font-weight: 600; cursor: pointer; transition: all var(--transition-fast); white-space: nowrap; }
        .filter-btn:hover, .filter-btn.active { border-color: var(--color-accent); color: var(--color-accent); }
        .filter-dropdown { position: absolute; top: calc(100% + 8px); right: 0; background: var(--color-bg); border: 1.5px solid var(--color-border); border-radius: var(--radius-md); box-shadow: var(--shadow-lg); z-index: 100; min-width: 160px; overflow: hidden; }
        .filter-option { padding: 10px 16px; font-size: 14px; font-weight: 500; cursor: pointer; transition: background var(--transition-fast); color: var(--color-primary); }
        .filter-option:hover { background: var(--color-bg-section); }
        .filter-option.active { color: var(--color-accent); font-weight: 700; background: var(--color-accent-soft); }
        .table-wrapper { background: var(--color-bg); border: 1.5px solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden; }
        .apps-table { width: 100%; border-collapse: collapse; }
        .apps-table th { padding: 14px 20px; text-align: left; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--color-text-secondary); border-bottom: 1.5px solid var(--color-border); background: var(--color-bg-section); white-space: nowrap; }
        .apps-table td { padding: 16px 20px; border-bottom: 1px solid var(--color-border); vertical-align: middle; }
        .apps-table tr:last-child td { border-bottom: none; }
        .apps-table tr:hover td { background: var(--color-bg-section); }
        .applicant-name { font-weight: 700; font-size: 14px; color: var(--color-primary); margin-bottom: 3px; }
        .applicant-email { font-size: 13px; color: var(--color-text-secondary); }
        .status-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: capitalize; white-space: nowrap; }
        .status-badge.pending       { background: #FEF3C7; color: #92400E; }
        .status-badge.approved      { background: #D1FAE5; color: #065F46; }
        .status-badge.invite_sent   { background: #DBEAFE; color: #1E40AF; }
        .status-badge.invite_expired{ background: #FEF3C7; color: #92400E; }
        .status-badge.rejected      { background: #FEE2E2; color: #991B1B; }
        .status-badge.onboarding { background: #EDE9FE; color: #5B21B6; }
        .expired-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 20px; font-size: 11px; font-weight: 600; background: #FEF3C7; color: #92400E; }
        .actions-cell { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
        .action-btn { display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; border-radius: 8px; font-size: 13px; font-weight: 600; border: 1.5px solid; cursor: pointer; transition: all var(--transition-fast); font-family: var(--font-primary); white-space: nowrap; }
        .action-btn.view    { border-color: var(--color-border); color: var(--color-text-secondary); background: transparent; }
        .action-btn.view:hover { border-color: var(--color-accent); color: var(--color-accent); background: var(--color-accent-soft); }
        .action-btn.approve { border-color: #10b981; color: #10b981; background: transparent; }
        .action-btn.approve:hover { background: #D1FAE5; }
        .action-btn.resend  { border-color: #f59e0b; color: #f59e0b; background: transparent; }
        .action-btn.resend:hover  { background: #FEF3C7; }
        .action-btn.reject  { border-color: #ef4444; color: #ef4444; background: transparent; }
        .action-btn.reject:hover  { background: #FEE2E2; }
        .empty-state { padding: 80px 20px; text-align: center; }
        .empty-icon { color: var(--color-text-secondary); opacity: 0.4; margin-bottom: 16px; }
        .empty-text { font-size: 18px; font-weight: 700; color: var(--color-primary); margin-bottom: 8px; }
        .empty-subtext { color: var(--color-text-secondary); font-size: 14px; }
        .mobile-cards { display: none; gap: 16px; flex-direction: column; }
        .app-card { background: var(--color-bg); border: 1.5px solid var(--color-border); border-radius: var(--radius-lg); padding: 20px; }
        .app-card-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; }
        .app-card-name  { font-weight: 700; font-size: 15px; color: var(--color-primary); margin-bottom: 3px; }
        .app-card-email { font-size: 13px; color: var(--color-text-secondary); margin-bottom: 8px; }
        .app-card-meta  { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 14px; }
        .app-card-meta-item { display: flex; align-items: center; gap: 5px; font-size: 13px; color: var(--color-text-secondary); }
        .app-card-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 14px; padding: 14px; background: var(--color-bg-section); border-radius: var(--radius-md); }
        .app-card-stat-label { font-size: 11px; font-weight: 600; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 4px; }
        .app-card-stat-value { font-size: 13px; font-weight: 700; color: var(--color-primary); }
        .app-card-actions .actions-cell { flex-wrap: wrap; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal-content { background: var(--color-bg); border-radius: var(--radius-lg); padding: 32px; max-width: 480px; width: 100%; box-shadow: var(--shadow-xl); }
        .modal-title { display: flex; align-items: center; gap: 10px; font-family: 'Fraunces', serif; font-size: 20px; font-weight: 800; color: var(--color-primary); margin-bottom: 14px; }
        .modal-text { color: var(--color-text-secondary); font-size: 15px; line-height: 1.6; margin-bottom: 24px; }
        .modal-actions { display: flex; gap: 12px; justify-content: flex-end; }
        .btn-modal { padding: 10px 24px; border-radius: var(--radius-full); font-weight: 700; font-size: 14px; border: none; cursor: pointer; font-family: var(--font-primary); transition: all var(--transition-fast); }
        .btn-modal:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-cancel { background: var(--color-bg-section); color: var(--color-text-secondary); border: 1.5px solid var(--color-border); }
        .btn-cancel:hover:not(:disabled) { border-color: var(--color-accent); color: var(--color-accent); }
        .btn-confirm.approve { background: #10b981; color: #fff; }
        .btn-confirm.approve:hover:not(:disabled) { background: #059669; }
        .btn-confirm.resend  { background: #f59e0b; color: #fff; }
        .btn-confirm.resend:hover:not(:disabled)  { background: #d97706; }
        .btn-confirm.reject  { background: #ef4444; color: #fff; }
        .btn-confirm.reject:hover:not(:disabled)  { background: #dc2626; }
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .table-wrapper { display: none; }
          .mobile-cards { display: flex; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
          .admin-applications { padding: 16px; }
        }
      `}</style>

      <div className="admin-applications">
        <PageHeader
          title="Applications"
          subtitle="Review and manage provider applications"
        />

        {/* ── Stats ── */}
        <div className="stats-grid">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <SkeletonStatCard key={i} />
            ))
          ) : (
            <>
              <StatCard
                label="Total"
                value={stats.total}
                icon={FileText}
                iconColor="blue"
              />
              <StatCard
                label="Pending"
                value={stats.pending}
                icon={Clock}
                iconColor="yellow"
              />
              <StatCard
                label="Approved"
                value={stats.approved}
                icon={CheckCircle}
                iconColor="green"
              />
              <StatCard
                label="Rejected"
                value={stats.rejected}
                icon={XCircle}
                iconColor="red"
              />
            </>
          )}
        </div>

        {/* ── Toolbar ── */}
        <div className="toolbar">
          <div className="search-wrapper">
            <Search size={16} className="search-icon" />
            <input
              className="search-input"
              placeholder="Search by name, email, category or city…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filter-wrapper" ref={filterDropdownRef}>
            <button
              className={`filter-btn${showFilter ? " active" : ""}`}
              onClick={() => setShowFilter((v) => !v)}
            >
              <Filter size={15} strokeWidth={2.5} />
              {filterStatus === "All"
                ? "Filter"
                : getStatusLabel(filterStatus as Application["status"])}
              {filterStatus !== "All" && (
                <X
                  size={14}
                  strokeWidth={2.5}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilterStatus("All");
                    setShowFilter(false);
                  }}
                />
              )}
            </button>
            {showFilter && (
              <div className="filter-dropdown">
                {(
                  [
                    "All",
                    "pending",
                    "approved",
                    "invite_sent",
                    "invite_expired",
                    "rejected",
                  ] as const
                ).map((s) => (
                  <div
                    key={s}
                    className={`filter-option${filterStatus === s ? " active" : ""}`}
                    onClick={() => {
                      setFilterStatus(s);
                      setShowFilter(false);
                    }}
                  >
                    {s === "All"
                      ? "All"
                      : getStatusLabel(s as Application["status"])}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Desktop Table ── */}
        <div className="table-wrapper">
          <table className="apps-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Category</th>
                <th>City</th>
                <th>Applied</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">
                      <FileText size={48} className="empty-icon" />
                      <div className="empty-text">No applications found</div>
                      <div className="empty-subtext">
                        {searchQuery || filterStatus !== "All"
                          ? "Try adjusting your filters"
                          : "New applications will appear here"}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div className="applicant-name">{app.full_name}</div>
                      <div className="applicant-email">{app.email}</div>
                    </td>
                    <td>{getCategoryName(app)}</td>
                    <td>{app.city}</td>
                    <td>
                      {new Date(app.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <span className={`status-badge ${app.status}`}>
                        {getStatusBadgeIcon(app.status)}
                        {getStatusLabel(app.status)}
                      </span>
                    </td>
                    <td>{renderActionButtons(app)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Mobile Cards ── */}
        <div className="mobile-cards">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filteredApplications.length === 0 ? (
            <div className="empty-state">
              <FileText size={48} className="empty-icon" />
              <div className="empty-text">No applications found</div>
              <div className="empty-subtext">
                {searchQuery || filterStatus !== "All"
                  ? "Try adjusting your filters"
                  : "New applications will appear here"}
              </div>
            </div>
          ) : (
            filteredApplications.map((app) => (
              <div key={app.id} className="app-card">
                <div className="app-card-header">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 className="app-card-name">{app.full_name}</h3>
                    <p className="app-card-email">{app.email}</p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 6,
                      }}
                    >
                      <span className={`status-badge ${app.status}`}>
                        {getStatusBadgeIcon(app.status)}
                        {getStatusLabel(app.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="app-card-meta">
                  <div className="app-card-meta-item">
                    <Briefcase size={13} strokeWidth={2} />
                    {getCategoryName(app)}
                  </div>
                  <div className="app-card-meta-item">
                    <MapPin size={13} strokeWidth={2} />
                    {app.city}
                  </div>
                </div>

                <div className="app-card-stats">
                  <div className="app-card-stat">
                    <div className="app-card-stat-label">Work Type</div>
                    <div
                      className="app-card-stat-value"
                      style={{ textTransform: "capitalize" }}
                    >
                      {app.work_type || "—"}
                    </div>
                  </div>
                  <div className="app-card-stat">
                    <div className="app-card-stat-label">Applied</div>
                    <div className="app-card-stat-value">
                      {new Date(app.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="app-card-stat">
                    <div className="app-card-stat-label">City</div>
                    <div className="app-card-stat-value">{app.city}</div>
                  </div>
                </div>

                <div className="app-card-actions">
                  {renderActionButtons(app)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Modal ── */}
        {showStatusModal && selectedApplication && (
          <div
            className="modal-overlay"
            onClick={() => !isUpdating && setShowStatusModal(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">
                {modalAction === "approve" && (
                  <CheckCircle size={24} color="#10b981" strokeWidth={2.5} />
                )}
                {modalAction === "resend" && (
                  <Send size={24} color="#f59e0b" strokeWidth={2.5} />
                )}
                {modalAction === "reject" && (
                  <XCircle size={24} color="#ef4444" strokeWidth={2.5} />
                )}
                {modalAction === "approve" && "Approve Application"}
                {modalAction === "resend" && "Resend Invite"}
                {modalAction === "reject" && "Reject Application"}
              </h2>
              <p className="modal-text">
                {modalAction === "approve" && (
                  <>
                    Are you sure you want to <strong>approve</strong> the
                    application from{" "}
                    <strong>{selectedApplication.full_name}</strong>? An
                    invitation email will be sent to{" "}
                    <strong>{selectedApplication.email}</strong>.
                  </>
                )}
                {modalAction === "resend" && (
                  <>
                    The previous invite for{" "}
                    <strong>{selectedApplication.full_name}</strong> has
                    expired. Send a fresh 72-hour invite link to{" "}
                    <strong>{selectedApplication.email}</strong>?
                  </>
                )}
                {modalAction === "reject" && (
                  <>
                    Are you sure you want to <strong>reject</strong> the
                    application from{" "}
                    <strong>{selectedApplication.full_name}</strong>? This
                    action can be reversed later.
                  </>
                )}
              </p>
              <div className="modal-actions">
                <button
                  className="btn-modal btn-cancel"
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedApplication(null);
                  }}
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  className={`btn-modal btn-confirm ${modalAction}`}
                  onClick={confirmStatusChange}
                  disabled={isUpdating}
                >
                  {isUpdating
                    ? "Processing…"
                    : modalAction === "approve"
                      ? "Approve & Send Invite"
                      : modalAction === "resend"
                        ? "Resend Invite"
                        : "Reject"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminApplications;
