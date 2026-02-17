// src/pages/admin/AdminProviders.tsx
import { useState, useRef, useEffect } from "react";
import {
  Search,
  Filter,
  Briefcase,
  CheckCircle,
  XCircle,
  X,
  AlertCircle,
} from "lucide-react";
import PageHeader from "../../components/Admin/PageHeader";
import StatCard from "../../components/Admin/StatCard";
import ProvidersTable, {
  type Provider,
} from "../../components/Admin/ProvidersTable";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useToast } from "../../contexts/ToastContext";

// ── Skeleton Components ────────────────────────────────────────────────────

const SkeletonStatCard = () => (
  <div className="sk-stat-card">
    <div className="sk-stat-top">
      <div className="sk-block" style={{ width: 80, height: 13 }} />
      <div className="sk-block sk-stat-icon" />
    </div>
    <div className="sk-block" style={{ width: 60, height: 28 }} />
  </div>
);

const SkeletonTableRow = () => (
  <tr className="sk-table-row">
    <td>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          className="sk-block"
          style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0 }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          <div className="sk-block" style={{ width: 130, height: 14 }} />
          <div className="sk-block" style={{ width: 160, height: 12 }} />
        </div>
      </div>
    </td>
    <td>
      <div className="sk-block" style={{ width: 90, height: 14 }} />
    </td>
    <td>
      <div className="sk-block" style={{ width: 80, height: 14 }} />
    </td>
    <td>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div className="sk-block" style={{ width: 70, height: 14 }} />
      </div>
    </td>
    <td>
      <div className="sk-block sk-pill" />
    </td>
    <td>
      <div style={{ display: "flex", gap: 8 }}>
        <div className="sk-block sk-btn" />
        <div className="sk-block sk-btn" />
      </div>
    </td>
  </tr>
);

// ─────────────────────────────────────────────────────────────────────────────

const AdminProviders = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Active" | "Pending" | "Suspended" | "Needs Review"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null,
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const filterDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProviders();
  }, []);

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

  // Update the fetchProviders function
  async function fetchProviders() {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc("get_providers_with_stats");
      if (error) throw error;

      const mappedProviders: Provider[] = (data || []).map((p: any) => ({
        id: p.id,
        name: p.business_name || p.full_name,
        email: p.email || "",
        phone: p.phone_number,
        category: p.primary_category,
        city: p.city,
        rating: Number(p.average_rating) || 0, // ✅ Changed from quality_score
        reviewCount: Number(p.review_count) || 0, // ✅ Added review count
        jobsCompleted: 0, // TODO: Add jobs table later
        status: mapStatus(p.status),
        verified: p.status === "active",
        joinedDate: new Date(p.created_at),
        profileImage:
          p.profile_image_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(p.business_name || p.full_name)}&background=FF6B35&color=fff&size=128`, // ✅ Added fallback avatar
        hasPendingEdits: p.has_pending_edits || false,
      }));

      setProviders(mappedProviders);
    } catch (error: any) {
      console.error("Error fetching providers:", error);
      showError("Error", error.message || "Failed to load providers");
    } finally {
      setLoading(false);
    }
  }

  function mapStatus(dbStatus: string): "Active" | "Pending" | "Suspended" {
    switch (dbStatus) {
      case "active":
        return "Active";
      case "pending_review":
      case "needs_changes":
        return "Pending";
      case "suspended":
      case "banned":
        return "Suspended";
      default:
        return "Pending";
    }
  }

  function mapStatusToDb(uiStatus: "Active" | "Pending" | "Suspended"): string {
    switch (uiStatus) {
      case "Active":
        return "active";
      case "Pending":
        return "pending_review";
      case "Suspended":
        return "suspended";
      default:
        return "pending_review";
    }
  }

  const handleView = (provider: Provider) =>
    navigate(`/admin/providers/${provider.id}`);

  const handleToggleStatus = (provider: Provider) => {
    setSelectedProvider(provider);
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedProvider) return;
    setIsUpdating(true);
    try {
      const newStatus: "Active" | "Pending" | "Suspended" =
        selectedProvider.status === "Pending" ||
        selectedProvider.status === "Suspended"
          ? "Active"
          : "Suspended";

      const dbStatus = mapStatusToDb(newStatus);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const updateData: any = {
        status: dbStatus,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user?.id,
      };
      if (newStatus === "Active")
        updateData.activated_at = new Date().toISOString();

      const { error } = await supabase
        .from("providers")
        .update(updateData)
        .eq("id", selectedProvider.id);
      if (error) throw error;

      setProviders((prev) =>
        prev.map((p) =>
          p.id === selectedProvider.id
            ? { ...p, status: newStatus, verified: newStatus === "Active" }
            : p,
        ),
      );

      showSuccess(
        "Success",
        `Provider ${newStatus === "Active" ? "activated" : "suspended"} successfully`,
      );
      setShowStatusModal(false);
      setSelectedProvider(null);
    } catch (error: any) {
      showError("Error", error.message || "Failed to update provider status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getFilteredProviders = () => {
    let filtered = providers;
    if (filterStatus === "Needs Review") {
      filtered = filtered.filter((p) => p.hasPendingEdits);
    } else if (filterStatus !== "All") {
      filtered = filtered.filter((p) => p.status === filterStatus);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.email.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.city.toLowerCase().includes(query),
      );
    }
    return filtered.sort((a, b) => {
      if (a.hasPendingEdits && !b.hasPendingEdits) return -1;
      if (!a.hasPendingEdits && b.hasPendingEdits) return 1;
      return b.joinedDate.getTime() - a.joinedDate.getTime();
    });
  };

  const filteredProviders = getFilteredProviders();

  const stats = {
    total: providers.length,
    active: providers.filter((p) => p.status === "Active").length,
    pending: providers.filter((p) => p.status === "Pending").length,
    suspended: providers.filter((p) => p.status === "Suspended").length,
    needsReview: providers.filter((p) => p.hasPendingEdits).length,
  };

  return (
    <>
      <style>{`
        /* ── Skeleton ─────────────────────────────────────────────── */
        @keyframes skShimmer {
          0%   { background-position: -700px 0; }
          100% { background-position:  700px 0; }
        }
        .sk-block {
          background: linear-gradient(
            90deg,
            var(--sk-base) 25%,
            var(--sk-hi)   50%,
            var(--sk-base) 75%
          );
          background-size: 700px 100%;
          animation: skShimmer 1.6s ease-in-out infinite;
          border-radius: 6px;
          flex-shrink: 0;
        }
        :root { --sk-base: #f0f0f0; --sk-hi: #e4e4e4; }
        .dark-mode { --sk-base: #374151; --sk-hi: #4b5563; }

        .sk-stat-card {
          padding: 24px;
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-height: 110px;
          justify-content: space-between;
        }
        .sk-stat-top { display: flex; justify-content: space-between; align-items: center; }
        .sk-stat-icon { width: 40px; height: 40px; border-radius: 10px; }

        .sk-table-row td {
          padding: 18px 20px;
          border-bottom: 1px solid var(--border-color);
        }
        .sk-pill  { height: 26px; width: 80px;  border-radius: 20px; }
        .sk-btn   { height: 32px; width: 72px;  border-radius: 8px;  }

        /* ── Page Styles ──────────────────────────────────────────── */
        .admin-providers {
          padding: 28px;
          max-width: 1600px;
          margin: 0 auto;
          background: var(--bg-primary);
          min-height: 100vh;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
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
          left: 16px; top: 50%;
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
          right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: var(--text-secondary);
          padding: 6px;
          display: flex; align-items: center; justify-content: center;
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
          display: flex; align-items: center; gap: 10px;
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
          top: calc(100% + 8px); right: 0;
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 12px;
          box-shadow: 0 12px 48px var(--dropdown-shadow);
          padding: 8px;
          min-width: 200px;
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
          display: flex; align-items: center; justify-content: space-between;
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
        .filter-option.needs-review {
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 4px;
          padding-bottom: 12px;
        }

        .filter-badge {
          display: inline-flex;
          align-items: center; justify-content: center;
          min-width: 24px; height: 20px; padding: 0 6px;
          border-radius: 10px;
          font-size: 11px; font-weight: 700;
          background: var(--orange-primary); color: white;
        }

        /* Modal */
        .modal-overlay {
          position: fixed; inset: 0;
          background: var(--modal-overlay);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(8px);
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .modal-content {
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 16px;
          padding: 28px;
          max-width: 460px; width: 90%;
          box-shadow: 0 24px 80px var(--modal-shadow);
          animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .modal-title {
          font-size: 20px; font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 16px;
          display: flex; align-items: center; gap: 12px;
        }
        .modal-text { color: var(--text-secondary); line-height: 1.6; margin-bottom: 28px; font-size: 15px; }
        .modal-text strong { color: var(--text-primary); font-weight: 600; }
        .modal-actions { display: flex; gap: 12px; justify-content: flex-end; }

        .btn-modal { padding: 12px 24px; border: none; border-radius: 10px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s ease; }
        .btn-cancel { background: var(--btn-cancel-bg); color: var(--text-primary); }
        .btn-cancel:hover { background: var(--btn-cancel-hover); }
        .btn-confirm { color: #fff; }
        .btn-confirm.approve {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
        }
        .btn-confirm.approve:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4); }
        .btn-confirm.suspend {
          background: linear-gradient(135deg, #ef4444 0%, #DC2626 100%);
          box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
        }
        .btn-confirm.suspend:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4); }
        .btn-confirm:disabled { opacity: 0.5; cursor: not-allowed; }

        /* CSS Variables */
        :root {
          --bg-primary: #f8f9fa; --text-primary: #111827; --text-secondary: #6b7280;
          --text-tertiary: #9ca3af; --card-bg: #ffffff; --border-color: #e5e7eb;
          --border-hover: #d1d5db; --hover-bg: #f3f4f6; --search-bg: #f9fafb;
          --filter-btn-bg: #ffffff; --filter-btn-hover: #f9fafb;
          --card-shadow: rgba(0,0,0,0.1); --dropdown-shadow: rgba(0,0,0,0.15);
          --orange-primary: #FF6B35; --orange-light-bg: #FFF4ED;
          --orange-shadow: rgba(255,107,53,0.1);
          --modal-overlay: rgba(0,0,0,0.5); --modal-shadow: rgba(0,0,0,0.3);
          --btn-cancel-bg: #f3f4f6; --btn-cancel-hover: #e5e7eb;
        }
        .dark-mode {
          --bg-primary: #111827; --text-primary: #f9fafb; --text-secondary: #d1d5db;
          --text-tertiary: #9ca3af; --card-bg: #1f2937; --border-color: #374151;
          --border-hover: #4b5563; --hover-bg: #374151; --search-bg: #374151;
          --filter-btn-bg: #1f2937; --filter-btn-hover: #374151;
          --card-shadow: rgba(0,0,0,0.4); --dropdown-shadow: rgba(0,0,0,0.6);
          --orange-primary: #FF8A5B; --orange-light-bg: rgba(255,107,53,0.15);
          --orange-shadow: rgba(255,138,91,0.15);
          --modal-overlay: rgba(0,0,0,0.7); --modal-shadow: rgba(0,0,0,0.6);
          --btn-cancel-bg: #374151; --btn-cancel-hover: #4b5563;
        }

        @media (max-width: 768px) {
          .admin-providers { padding: 20px 16px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .toolbar { flex-direction: column; align-items: stretch; }
          .toolbar-left { flex-direction: column; }
          .search-container { max-width: 100%; }
          .filter-btn { width: 100%; justify-content: center; }
          .modal-actions { flex-direction: column-reverse; }
          .btn-modal { width: 100%; }
        }
      `}</style>

      <div className="admin-providers">
        <PageHeader
          title="Providers"
          subtitle="View and manage service provider applications"
          icon={Briefcase}
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
                label="Total Providers"
                value={stats.total}
                icon={Briefcase}
                iconColor="orange"
              />
              <StatCard
                label="Active"
                value={stats.active}
                icon={CheckCircle}
                iconColor="green"
              />
              <StatCard
                label="Needs Review"
                value={stats.needsReview}
                icon={AlertCircle}
                iconColor="orange"
              />
              <StatCard
                label="Suspended"
                value={stats.suspended}
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
                placeholder="Search providers..."
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
                  <div
                    className={`filter-option needs-review ${filterStatus === "Needs Review" ? "active" : ""}`}
                    onClick={() => {
                      setFilterStatus("Needs Review");
                      setShowFilter(false);
                    }}
                  >
                    <span>⚠️ Needs Review</span>
                    {stats.needsReview > 0 && (
                      <span className="filter-badge">{stats.needsReview}</span>
                    )}
                  </div>
                  {(["All", "Active", "Pending", "Suspended"] as const).map(
                    (s) => (
                      <div
                        key={s}
                        className={`filter-option ${filterStatus === s ? "active" : ""}`}
                        onClick={() => {
                          setFilterStatus(s);
                          setShowFilter(false);
                        }}
                      >
                        {s === "All" ? "All Providers" : s}
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table — ProvidersTable already handles loading internally,
            but we also show skeleton rows when loading for consistency */}
        {loading ? (
          <div
            style={{
              background: "var(--card-bg)",
              border: "1.5px solid var(--border-color)",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    background: "var(--hover-bg)",
                    borderBottom: "1.5px solid var(--border-color)",
                  }}
                >
                  {[
                    "Provider",
                    "Category",
                    "City",
                    "Rating",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "16px 20px",
                        textAlign: "left",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonTableRow key={i} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <ProvidersTable
            providers={filteredProviders}
            loading={loading}
            onView={handleView}
            onToggleStatus={handleToggleStatus}
          />
        )}

        {showStatusModal && selectedProvider && (
          <div
            className="modal-overlay"
            onClick={() => !isUpdating && setShowStatusModal(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">
                {selectedProvider.status === "Active" ? (
                  <XCircle size={24} color="#ef4444" strokeWidth={2.5} />
                ) : (
                  <CheckCircle size={24} color="#10b981" strokeWidth={2.5} />
                )}
                {selectedProvider.status === "Active"
                  ? "Suspend Provider"
                  : "Approve Provider"}
              </h2>
              <p className="modal-text">
                Are you sure you want to{" "}
                <strong>
                  {selectedProvider.status === "Active" ? "suspend" : "approve"}
                </strong>{" "}
                <strong>{selectedProvider.name}</strong>?
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
                  className={`btn-modal btn-confirm ${selectedProvider.status === "Active" ? "suspend" : "approve"}`}
                  onClick={confirmStatusChange}
                  disabled={isUpdating}
                >
                  {isUpdating
                    ? "Processing..."
                    : selectedProvider.status === "Active"
                      ? "Suspend"
                      : "Approve"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminProviders;
