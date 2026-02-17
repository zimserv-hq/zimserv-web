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
} from "lucide-react";
import PageHeader from "../../components/Admin/PageHeader";
import StatCard from "../../components/Admin/StatCard";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export type Application = {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  whatsapp_number: string | null;
  city: string;
  primary_category_id: string;
  categories?: { name: string } | null;
  years_experience: string;
  work_type: string;
  availability: string | null;
  description: string;
  referral_source: string | null;
  verification_file_url: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  rejection_reason: string | null;
};

// ── Skeleton Components ──────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────

const AdminApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [filterStatus, setFilterStatus] = useState<
    "All" | "pending" | "approved" | "rejected"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [modalAction, setModalAction] = useState<"approve" | "reject">(
    "approve",
  );

  const filterDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("provider_applications")
        .select(
          `
          *,
          categories (
            name
          )
        `,
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Error fetching applications:", error);
        return;
      }

      setApplications(data || []);
    } catch (err) {
      console.error("❌ Unexpected error:", err);
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

  const handleView = (application: Application) => {
    navigate(`/admin/applications/${application.id}`);
  };

  const handleApprove = (application: Application) => {
    setSelectedApplication(application);
    setModalAction("approve");
    setShowStatusModal(true);
  };

  const handleReject = (application: Application) => {
    setSelectedApplication(application);
    setModalAction("reject");
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedApplication) return;
    setIsUpdating(true);

    try {
      const newStatus = modalAction === "approve" ? "approved" : "rejected";

      const { data, error } = await supabase
        .from("provider_applications")
        .update({ status: newStatus, reviewed_at: new Date().toISOString() })
        .eq("id", selectedApplication.id)
        .select()
        .single();

      if (error) {
        alert("Failed to update application status");
        return;
      }

      if (modalAction === "approve") {
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

        if (functionError) {
          alert(
            "Application approved but failed to send invitation email. Please send manually.",
          );
        } else {
          alert(
            `Application approved! Invitation email sent to ${selectedApplication.email}`,
          );
        }
      } else {
        alert("Application rejected successfully.");
      }

      setApplications((prev) =>
        prev.map((app) =>
          app.id === selectedApplication.id
            ? { ...app, status: newStatus, reviewed_at: data.reviewed_at }
            : app,
        ),
      );

      setShowStatusModal(false);
      setSelectedApplication(null);
    } catch (err) {
      alert("An unexpected error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  const getFilteredApplications = () => {
    let filtered = applications;
    if (filterStatus !== "All") {
      filtered = filtered.filter((app) => app.status === filterStatus);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (app) =>
          app.full_name.toLowerCase().includes(query) ||
          app.email.toLowerCase().includes(query) ||
          (app.categories?.name || "").toLowerCase().includes(query) ||
          app.city.toLowerCase().includes(query),
      );
    }
    return filtered;
  };

  const filteredApplications = getFilteredApplications();

  const stats = {
    total: applications.length,
    pending: applications.filter((app) => app.status === "pending").length,
    approved: applications.filter((app) => app.status === "approved").length,
    rejected: applications.filter((app) => app.status === "rejected").length,
  };

  return (
    <>
      <style>{`
        /* ── Skeleton Animations ─────────────────────────────────── */
        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }

        .skeleton-block,
        .skeleton-circle,
        .skeleton-pill,
        .skeleton-btn,
        .skeleton-stat-card {
          background: linear-gradient(
            90deg,
            var(--skeleton-base) 25%,
            var(--skeleton-highlight) 50%,
            var(--skeleton-base) 75%
          );
          background-size: 600px 100%;
          animation: shimmer 1.6s ease-in-out infinite;
          border-radius: 6px;
        }

        :root {
          --skeleton-base:      #f0f0f0;
          --skeleton-highlight: #e0e0e0;
        }

        .dark-mode {
          --skeleton-base:      #374151;
          --skeleton-highlight: #4b5563;
        }

        /* Stat card skeleton */
        .skeleton-stat-card {
          border-radius: 16px;
          padding: 24px;
          border: 1.5px solid var(--border-color);
          background: var(--card-bg);
          min-height: 110px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .skeleton-stat-card .skeleton-block,
        .skeleton-stat-card .skeleton-circle {
          /* inherit shimmer from parent background won't work on children — use directly */
        }

        .skeleton-stat-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .skeleton-stat-label {
          height: 13px;
          width: 80px;
        }

        .skeleton-stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .skeleton-stat-value {
          height: 28px;
          width: 60px;
        }

        /* Table row skeleton */
        .skeleton-row td {
          padding: 18px 20px;
          border-bottom: 1px solid var(--border-color);
        }

        .skeleton-applicant-cell {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .skeleton-name  { height: 14px; width: 120px; }
        .skeleton-email { height: 12px; width: 160px; }
        .skeleton-cell-md { height: 14px; width: 90px; }
        .skeleton-cell-sm { height: 14px; width: 60px; }

        .skeleton-pill {
          height: 26px;
          width: 80px;
          border-radius: 20px;
        }

        .skeleton-actions {
          display: flex;
          gap: 8px;
        }

        .skeleton-btn {
          height: 32px;
          width: 72px;
          border-radius: 8px;
        }

        /* ── Original Styles ─────────────────────────────────────── */
        .admin-applications {
          padding: 28px;
          max-width: 1600px;
          margin: 0 auto;
          background: var(--bg-primary);
          min-height: 100vh;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .toolbar {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 20px;
        }

        .toolbar-left {
          flex: 1;
          display: flex;
          gap: 12px;
        }

        .search-container {
          position: relative;
          flex: 1;
          max-width: 500px;
        }

        .search-input {
          width: 100%;
          padding: 13px 16px 13px 48px;
          border-radius: 12px;
          border: 1.5px solid var(--border-color);
          background: var(--search-bg);
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 500;
          outline: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .search-input::placeholder { color: var(--text-tertiary); }

        .search-input:focus {
          border-color: var(--orange-primary);
          background: var(--card-bg);
          box-shadow: 0 0 0 4px var(--orange-shadow);
          transform: translateY(-1px);
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-tertiary);
          pointer-events: none;
          transition: all 0.3s ease;
        }

        .search-input:focus ~ .search-icon {
          color: var(--orange-primary);
          transform: translateY(-50%) scale(1.1);
        }

        .clear-search {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-secondary);
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .clear-search:hover {
          background: var(--hover-bg);
          color: var(--text-primary);
          transform: translateY(-50%) scale(1.1);
        }

        .filter-wrapper { position: relative; }

        .filter-btn {
          padding: 13px 20px;
          border-radius: 12px;
          border: 1.5px solid var(--border-color);
          background: var(--filter-btn-bg);
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
        }

        .filter-btn:hover {
          background: var(--filter-btn-hover);
          border-color: var(--border-hover);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px var(--card-shadow);
        }

        .filter-btn.active {
          background: var(--orange-light-bg);
          border-color: var(--orange-primary);
          color: var(--orange-primary);
        }

        .filter-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 12px;
          box-shadow: 0 12px 48px var(--dropdown-shadow);
          padding: 8px;
          min-width: 180px;
          z-index: 100;
          animation: slideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .filter-option {
          padding: 12px 14px;
          cursor: pointer;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
          transition: all 0.15s ease;
        }

        .filter-option:hover {
          background: var(--hover-bg);
          color: var(--orange-primary);
          transform: translateX(4px);
        }

        .filter-option.active {
          background: var(--orange-light-bg);
          color: var(--orange-primary);
          font-weight: 600;
        }

        .table-card {
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 24px var(--card-shadow);
        }

        .table-container { overflow-x: auto; }

        .applications-table {
          width: 100%;
          border-collapse: collapse;
        }

        .applications-table thead {
          background: var(--hover-bg);
          border-bottom: 1.5px solid var(--border-color);
        }

        .applications-table th {
          padding: 16px 20px;
          text-align: left;
          font-size: 13px;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .applications-table td {
          padding: 18px 20px;
          border-bottom: 1px solid var(--border-color);
          font-size: 14px;
          color: var(--text-primary);
        }

        .applications-table tbody tr { transition: background 0.15s ease; }
        .applications-table tbody tr:hover { background: var(--hover-bg); }
        .applications-table tbody tr:last-child td { border-bottom: none; }

        .applicant-cell { display: flex; flex-direction: column; gap: 4px; }
        .applicant-name { font-weight: 600; color: var(--text-primary); }
        .applicant-email { font-size: 13px; color: var(--text-secondary); }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-badge.pending  { background: #fef3c7; color: #92400e; }
        .status-badge.approved { background: #d1fae5; color: #065f46; }
        .status-badge.rejected { background: #fee2e2; color: #991b1b; }

        .dark-mode .status-badge.pending  { background: rgba(251,191,36,0.2);  color: #fbbf24; }
        .dark-mode .status-badge.approved { background: rgba(16,185,129,0.2);  color: #10b981; }
        .dark-mode .status-badge.rejected { background: rgba(239,68,68,0.2);   color: #ef4444; }

        .actions-cell { display: flex; gap: 8px; }

        .action-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .action-btn.view { background: var(--hover-bg); color: var(--text-primary); }
        .action-btn.view:hover { background: var(--border-color); transform: translateY(-2px); }

        .action-btn.approve {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #fff;
          box-shadow: 0 2px 8px rgba(16,185,129,0.3);
        }
        .action-btn.approve:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(16,185,129,0.4); }

        .action-btn.reject {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: #fff;
          box-shadow: 0 2px 8px rgba(239,68,68,0.3);
        }
        .action-btn.reject:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(239,68,68,0.4); }
        .action-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }

        .empty-state { padding: 80px 40px; text-align: center; color: var(--text-secondary); }
        .empty-icon  { margin-bottom: 16px; opacity: 0.5; }
        .empty-text  { font-size: 16px; font-weight: 600; margin-bottom: 8px; }
        .empty-subtext { font-size: 14px; opacity: 0.7; }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: var(--modal-overlay);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(8px);
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

        .modal-content {
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 16px;
          padding: 28px;
          max-width: 460px;
          width: 90%;
          box-shadow: 0 24px 80px var(--modal-shadow);
          animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideUp {
          from { opacity:0; transform: translateY(20px) scale(0.95); }
          to   { opacity:1; transform: translateY(0) scale(1); }
        }

        .modal-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .modal-text {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 28px;
          font-size: 15px;
        }

        .modal-text strong { color: var(--text-primary); font-weight: 600; }
        .modal-actions { display: flex; gap: 12px; justify-content: flex-end; }

        .btn-modal {
          padding: 12px 24px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-cancel { background: var(--btn-cancel-bg); color: var(--text-primary); }
        .btn-cancel:hover { background: var(--btn-cancel-hover); }
        .btn-confirm { color: #fff; }

        .btn-confirm.approve {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          box-shadow: 0 4px 16px rgba(16,185,129,0.3);
        }
        .btn-confirm.approve:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(16,185,129,0.4); }

        .btn-confirm.reject {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          box-shadow: 0 4px 16px rgba(239,68,68,0.3);
        }
        .btn-confirm.reject:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(239,68,68,0.4); }
        .btn-confirm:disabled { opacity: 0.5; cursor: not-allowed; }

        /* CSS Variables */
        :root {
          --bg-primary: #f8f9fa;
          --text-primary: #111827;
          --text-secondary: #6b7280;
          --text-tertiary: #9ca3af;
          --card-bg: #ffffff;
          --border-color: #e5e7eb;
          --border-hover: #d1d5db;
          --hover-bg: #f3f4f6;
          --search-bg: #f9fafb;
          --filter-btn-bg: #ffffff;
          --filter-btn-hover: #f9fafb;
          --card-shadow: rgba(0, 0, 0, 0.1);
          --dropdown-shadow: rgba(0, 0, 0, 0.15);
          --orange-primary: #ff6b35;
          --orange-light-bg: #fff4ed;
          --orange-shadow: rgba(255, 107, 53, 0.1);
          --modal-overlay: rgba(0, 0, 0, 0.5);
          --modal-shadow: rgba(0, 0, 0, 0.3);
          --btn-cancel-bg: #f3f4f6;
          --btn-cancel-hover: #e5e7eb;
        }

        .dark-mode {
          --bg-primary: #111827;
          --text-primary: #f9fafb;
          --text-secondary: #d1d5db;
          --text-tertiary: #9ca3af;
          --card-bg: #1f2937;
          --border-color: #374151;
          --border-hover: #4b5563;
          --hover-bg: #374151;
          --search-bg: #374151;
          --filter-btn-bg: #1f2937;
          --filter-btn-hover: #374151;
          --card-shadow: rgba(0, 0, 0, 0.4);
          --dropdown-shadow: rgba(0, 0, 0, 0.6);
          --orange-primary: #ff8a5b;
          --orange-light-bg: rgba(255, 107, 53, 0.15);
          --orange-shadow: rgba(255, 138, 91, 0.15);
          --modal-overlay: rgba(0, 0, 0, 0.7);
          --modal-shadow: rgba(0, 0, 0, 0.6);
          --btn-cancel-bg: #374151;
          --btn-cancel-hover: #4b5563;
        }

        @media (max-width: 768px) {
          .admin-applications { padding: 20px 16px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .toolbar { flex-direction: column; align-items: stretch; }
          .toolbar-left { flex-direction: column; }
          .search-container { max-width: 100%; }
          .filter-btn { width: 100%; justify-content: center; }
          .table-container { overflow-x: scroll; }
          .modal-actions { flex-direction: column-reverse; }
          .btn-modal { width: 100%; }
        }
      `}</style>

      <div className="admin-applications">
        <PageHeader
          title="Applications"
          subtitle="Review and manage provider applications"
          icon={FileText}
        />

        {/* Stats — skeleton while loading */}
        <div className="stats-grid">
          {loading ? (
            <>
              <SkeletonStatCard />
              <SkeletonStatCard />
              <SkeletonStatCard />
              <SkeletonStatCard />
            </>
          ) : (
            <>
              <StatCard
                label="Total Applications"
                value={stats.total}
                icon={FileText}
                iconColor="orange"
              />
              <StatCard
                label="Pending Review"
                value={stats.pending}
                icon={Clock}
                iconColor="blue"
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

        <div className="toolbar">
          <div className="toolbar-left">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <Search size={18} className="search-icon" strokeWidth={2.5} />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="clear-search"
                  title="Clear search"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              )}
            </div>

            <div className="filter-wrapper" ref={filterDropdownRef}>
              <button
                className={`filter-btn ${filterStatus !== "All" ? "active" : ""}`}
                onClick={() => setShowFilter(!showFilter)}
              >
                <Filter size={18} strokeWidth={2.5} />
                {filterStatus === "All" ? "Filter" : filterStatus}
              </button>

              {showFilter && (
                <div className="filter-dropdown">
                  {(["All", "pending", "approved", "rejected"] as const).map(
                    (s) => (
                      <div
                        key={s}
                        className={`filter-option ${filterStatus === s ? "active" : ""}`}
                        onClick={() => {
                          setFilterStatus(s);
                          setShowFilter(false);
                        }}
                      >
                        {s === "All"
                          ? "All Applications"
                          : s.charAt(0).toUpperCase() + s.slice(1)}
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="table-card">
          <div className="table-container">
            {loading ? (
              /* ── Skeleton Table ── */
              <table className="applications-table">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Category</th>
                    <th>City</th>
                    <th>Experience</th>
                    <th>Applied</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))}
                </tbody>
              </table>
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
              <table className="applications-table">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Category</th>
                    <th>City</th>
                    <th>Experience</th>
                    <th>Applied</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <div className="applicant-cell">
                          <span className="applicant-name">
                            {app.full_name}
                          </span>
                          <span className="applicant-email">{app.email}</span>
                        </div>
                      </td>
                      <td>{app.categories?.name ?? "—"}</td>
                      <td>{app.city}</td>
                      <td>{app.years_experience}</td>
                      <td>
                        {new Date(app.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td>
                        <span className={`status-badge ${app.status}`}>
                          {app.status === "pending" && (
                            <Clock size={14} strokeWidth={2.5} />
                          )}
                          {app.status === "approved" && (
                            <CheckCircle size={14} strokeWidth={2.5} />
                          )}
                          {app.status === "rejected" && (
                            <XCircle size={14} strokeWidth={2.5} />
                          )}
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className="action-btn view"
                            onClick={() => handleView(app)}
                            title="View details"
                          >
                            <Eye size={14} strokeWidth={2.5} />
                            View
                          </button>
                          {app.status === "pending" && (
                            <>
                              <button
                                className="action-btn approve"
                                onClick={() => handleApprove(app)}
                              >
                                <CheckCircle size={14} strokeWidth={2.5} />
                                Approve
                              </button>
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {showStatusModal && selectedApplication && (
          <div
            className="modal-overlay"
            onClick={() => !isUpdating && setShowStatusModal(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">
                {modalAction === "approve" ? (
                  <CheckCircle size={24} color="#10b981" strokeWidth={2.5} />
                ) : (
                  <XCircle size={24} color="#ef4444" strokeWidth={2.5} />
                )}
                {modalAction === "approve"
                  ? "Approve Application"
                  : "Reject Application"}
              </h2>
              <p className="modal-text">
                Are you sure you want to{" "}
                <strong>
                  {modalAction === "approve" ? "approve" : "reject"}
                </strong>{" "}
                the application from{" "}
                <strong>{selectedApplication.full_name}</strong>?
              </p>
              <div className="modal-actions">
                <button
                  className="btn-modal btn-cancel"
                  onClick={() => setShowStatusModal(false)}
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
                    ? "Processing..."
                    : modalAction === "approve"
                      ? "Approve"
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
