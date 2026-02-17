// src/pages/admin/AdminUsers.tsx
import { useState, useRef, useEffect } from "react";
import {
  Users,
  CheckCircle,
  AlertCircle,
  Eye,
  Phone,
  Mail,
  Search,
  Filter,
  X,
} from "lucide-react";
import PageHeader from "../../components/Admin/PageHeader";
import StatCard from "../../components/Admin/StatCard";

interface User {
  contact: string;
  contactType: "phone" | "email";
  jobsCompleted: number;
  reviewsCount: number;
  verifiedReviews: number;
  lastActive: Date;
  status: "Active" | "Flagged";
}

const MOCK_USERS: User[] = [
  {
    contact: "+263 77 123 4567",
    contactType: "phone",
    jobsCompleted: 2,
    reviewsCount: 2,
    verifiedReviews: 2,
    lastActive: new Date("2026-02-14T10:30:00"),
    status: "Active",
  },
  {
    contact: "sarah.m@example.com",
    contactType: "email",
    jobsCompleted: 4,
    reviewsCount: 3,
    verifiedReviews: 3,
    lastActive: new Date("2026-02-13T14:20:00"),
    status: "Active",
  },
  {
    contact: "+263 77 234 5678",
    contactType: "phone",
    jobsCompleted: 6,
    reviewsCount: 5,
    verifiedReviews: 4,
    lastActive: new Date("2026-02-12T09:15:00"),
    status: "Active",
  },
  {
    contact: "+263 77 345 6789",
    contactType: "phone",
    jobsCompleted: 1,
    reviewsCount: 1,
    verifiedReviews: 0,
    lastActive: new Date("2026-02-10T16:45:00"),
    status: "Flagged",
  },
  {
    contact: "tendai.k@gmail.com",
    contactType: "email",
    jobsCompleted: 2,
    reviewsCount: 2,
    verifiedReviews: 2,
    lastActive: new Date("2026-02-11T11:00:00"),
    status: "Active",
  },
];

const AdminUsers = () => {
  const [users] = useState<User[]>(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Active" | "Flagged"
  >("All");
  const [showFilter, setShowFilter] = useState(false);

  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setShowFilter(false);
      }
    };

    if (showFilter) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilter]);

  const getFilteredUsers = () => {
    let filtered = users;

    // Filter by status
    if (filterStatus !== "All") {
      filtered = filtered.filter((u) => u.status === filterStatus);
    }

    // Search by contact
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((u) =>
        u.contact.toLowerCase().includes(query),
      );
    }

    return filtered;
  };

  const filteredUsers = getFilteredUsers();

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "Active").length,
    flagged: users.filter((u) => u.status === "Flagged").length,
    totalReviews: users.reduce((sum, u) => sum + u.reviewsCount, 0),
  };

  // Get display label for filter button
  const getFilterLabel = () => {
    if (filterStatus === "All") return "Filter";
    return filterStatus;
  };

  return (
    <>
      <style>{`
        /* CSS Variables for Dark Mode */
        :root {
          --bg-primary: #f8f9fa;
          --text-primary: #111827;
          --text-secondary: #6b7280;
          --text-tertiary: #9ca3af;
          --card-bg: #ffffff;
          --border-color: #e5e7eb;
          --border-light: #f3f4f6;
          --border-hover: #d1d5db;
          --hover-bg: #fafbfc;
          --table-header-bg: #f9fafb;
          --search-bg: #f9fafb;
          --filter-btn-bg: #ffffff;
          --filter-btn-hover: #f9fafb;
          --empty-bg: #fafafa;
          --card-shadow: rgba(0, 0, 0, 0.05);
          --dropdown-shadow: rgba(0, 0, 0, 0.15);
          --orange-primary: #FF6B35;
          --orange-light-bg: #FFF4ED;
          --orange-shadow: rgba(255, 107, 53, 0.1);
          --blue-primary: #2563EB;
          --blue-light-bg: #EFF6FF;
          --blue-icon-bg: #DBEAFE;
          --blue-icon-color: #1E40AF;
          --yellow-icon-bg: #FEF3C7;
          --yellow-icon-color: #92400E;
          --yellow-badge-bg: #FEF3C7;
          --yellow-badge-color: #B45309;
          --green-badge-bg: #DCFCE7;
          --green-badge-color: #15803D;
        }

        .dark-mode {
          --bg-primary: #111827;
          --text-primary: #f9fafb;
          --text-secondary: #d1d5db;
          --text-tertiary: #9ca3af;
          --card-bg: #1f2937;
          --border-color: #374151;
          --border-light: #374151;
          --border-hover: #4b5563;
          --hover-bg: #374151;
          --table-header-bg: #1f2937;
          --search-bg: #374151;
          --filter-btn-bg: #1f2937;
          --filter-btn-hover: #374151;
          --empty-bg: #1f2937;
          --card-shadow: rgba(0, 0, 0, 0.3);
          --dropdown-shadow: rgba(0, 0, 0, 0.6);
          --orange-primary: #FF8A5B;
          --orange-light-bg: rgba(255, 107, 53, 0.15);
          --orange-shadow: rgba(255, 138, 91, 0.15);
          --blue-primary: #60a5fa;
          --blue-light-bg: rgba(96, 165, 250, 0.15);
          --blue-icon-bg: rgba(30, 64, 175, 0.25);
          --blue-icon-color: #60a5fa;
          --yellow-icon-bg: rgba(146, 64, 14, 0.25);
          --yellow-icon-color: #fbbf24;
          --yellow-badge-bg: rgba(180, 83, 9, 0.2);
          --yellow-badge-color: #fbbf24;
          --green-badge-bg: rgba(21, 128, 61, 0.2);
          --green-badge-color: #4ade80;
        }

        .admin-users {
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

        /* ✅ NEW: Toolbar Layout */
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

        /* ✅ NEW: Search Container */
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

        .search-input::placeholder {
          color: var(--text-tertiary);
        }

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

        /* ✅ NEW: Filter Dropdown */
        .filter-wrapper {
          position: relative;
        }

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
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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

        .table-container {
          overflow-x: auto;
          border-radius: 12px;
          border: 1.5px solid var(--border-color);
          background: var(--card-bg);
          box-shadow: 0 2px 8px var(--card-shadow);
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
        }

        .users-table thead {
          background: var(--table-header-bg);
          border-bottom: 1.5px solid var(--border-color);
        }

        .users-table th {
          padding: 14px 16px;
          text-align: left;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .users-table th:first-child {
          padding-left: 24px;
        }

        .users-table th:nth-child(2),
        .users-table th:nth-child(3),
        .users-table th:nth-child(4),
        .users-table th:nth-child(5),
        .users-table th:nth-child(6),
        .users-table th:nth-child(7) {
          text-align: center;
        }

        .users-table tbody tr {
          border-bottom: 1px solid var(--border-light);
          transition: background-color 0.15s ease;
        }

        .users-table tbody tr:hover {
          background: var(--hover-bg);
        }

        .users-table tbody tr:last-child {
          border-bottom: none;
        }

        .users-table td {
          padding: 16px;
          color: var(--text-primary);
          font-size: 14px;
          vertical-align: middle;
        }

        .users-table td:first-child {
          padding-left: 24px;
        }

        .users-table td:nth-child(2),
        .users-table td:nth-child(3),
        .users-table td:nth-child(4),
        .users-table td:nth-child(5),
        .users-table td:nth-child(6),
        .users-table td:nth-child(7) {
          text-align: center;
        }

        .contact-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .contact-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .contact-icon.phone {
          background: var(--blue-icon-bg);
          color: var(--blue-icon-color);
        }

        .contact-icon.email {
          background: var(--yellow-icon-bg);
          color: var(--yellow-icon-color);
        }

        .contact-text {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 14px;
        }

        .metric-value {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 15px;
        }

        .date-text {
          color: var(--text-secondary);
          font-size: 14px;
          white-space: nowrap;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        .status-badge.active {
          background: var(--green-badge-bg);
          color: var(--green-badge-color);
        }

        .status-badge.flagged {
          background: var(--yellow-badge-bg);
          color: var(--yellow-badge-color);
        }

        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1.5px solid;
          background: transparent;
        }

        .action-btn.view {
          border-color: var(--blue-primary);
          color: var(--blue-primary);
        }

        .action-btn.view:hover {
          background: var(--blue-light-bg);
        }

        .empty-state {
          padding: 80px 20px;
          text-align: center;
          border: 1.5px dashed var(--border-color);
          border-radius: 12px;
          background: var(--empty-bg);
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .empty-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .empty-text {
          font-size: 15px;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .admin-users {
            padding: 20px 16px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          /* ✅ NEW: Mobile toolbar layout */
          .toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .toolbar-left {
            flex-direction: column;
          }

          .search-container {
            max-width: 100%;
          }

          .filter-btn {
            width: 100%;
            justify-content: center;
          }

          .table-container {
            border: none;
            background: transparent;
            box-shadow: none;
          }

          .users-table thead {
            display: none;
          }

          .users-table tbody tr {
            display: block;
            margin-bottom: 16px;
            border: 1.5px solid var(--border-color);
            border-radius: 12px;
            background: var(--card-bg);
            padding: 16px;
          }

          .users-table tbody tr:hover {
            background: var(--card-bg);
          }

          .users-table td {
            display: block;
            padding: 10px 0;
            border: none;
            text-align: left !important;
          }

          .users-table td:first-child {
            padding: 10px 0;
          }

          .users-table td:before {
            content: attr(data-label);
            display: block;
            font-weight: 600;
            font-size: 11px;
            color: var(--text-secondary);
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
        }
      `}</style>

      <div className="admin-users">
        <PageHeader
          title="Users & Customers"
          subtitle="Track customer activity by contact information (no accounts required)"
          icon={Users}
        />

        <div className="stats-grid">
          <StatCard
            label="Unique Customers"
            value={stats.total}
            icon={Users}
            iconColor="orange"
          />
          <StatCard
            label="Active Users"
            value={stats.active}
            icon={CheckCircle}
            iconColor="green"
          />
          <StatCard
            label="Total Reviews"
            value={stats.totalReviews}
            icon={CheckCircle}
            iconColor="blue"
          />
        </div>

        {/* ✅ NEW: Toolbar with Search and Filter */}
        <div className="toolbar">
          <div className="toolbar-left">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by phone or email..."
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
                {getFilterLabel()}
              </button>

              {showFilter && (
                <div className="filter-dropdown">
                  <div
                    className={`filter-option ${filterStatus === "All" ? "active" : ""}`}
                    onClick={() => {
                      setFilterStatus("All");
                      setShowFilter(false);
                    }}
                  >
                    All Users
                  </div>
                  <div
                    className={`filter-option ${filterStatus === "Active" ? "active" : ""}`}
                    onClick={() => {
                      setFilterStatus("Active");
                      setShowFilter(false);
                    }}
                  >
                    Active Only
                  </div>
                  <div
                    className={`filter-option ${filterStatus === "Flagged" ? "active" : ""}`}
                    onClick={() => {
                      setFilterStatus("Flagged");
                      setShowFilter(false);
                    }}
                  >
                    Flagged Only
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👤</div>
            <h3 className="empty-title">No users found</h3>
            <p className="empty-text">
              {searchQuery
                ? "No users match your search query"
                : "No customer activity yet"}
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Contact</th>
                  <th>Jobs</th>
                  <th>Reviews</th>
                  <th>Verified Reviews</th>
                  <th>Last Active</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.contact}>
                    <td data-label="Contact">
                      <div className="contact-info">
                        <div className={`contact-icon ${user.contactType}`}>
                          {user.contactType === "phone" ? (
                            <Phone size={16} strokeWidth={2.5} />
                          ) : (
                            <Mail size={16} strokeWidth={2.5} />
                          )}
                        </div>
                        <span className="contact-text">{user.contact}</span>
                      </div>
                    </td>
                    <td data-label="Jobs">
                      <span className="metric-value">{user.jobsCompleted}</span>
                    </td>
                    <td data-label="Reviews">
                      <span className="metric-value">{user.reviewsCount}</span>
                    </td>
                    <td data-label="Verified Reviews">
                      <span className="metric-value">
                        {user.verifiedReviews}
                      </span>
                    </td>
                    <td data-label="Last Active">
                      <span className="date-text">
                        {user.lastActive.toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    <td data-label="Status">
                      <span
                        className={`status-badge ${user.status.toLowerCase()}`}
                      >
                        {user.status === "Active" ? (
                          <CheckCircle size={12} strokeWidth={2.5} />
                        ) : (
                          <AlertCircle size={12} strokeWidth={2.5} />
                        )}
                        {user.status}
                      </span>
                    </td>
                    <td data-label="Actions">
                      <button className="action-btn view">
                        <Eye size={14} strokeWidth={2.5} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminUsers;
