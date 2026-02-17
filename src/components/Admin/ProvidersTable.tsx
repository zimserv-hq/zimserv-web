// src/components/Admin/ProvidersTable.tsx (WITH DARK MODE + NEEDS REVIEW)
import { useState } from "react";
import { Eye, CheckCircle, MapPin, Star, AlertCircle } from "lucide-react";

export interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  city: string;
  rating: number;
  reviewCount: number;
  jobsCompleted: number;
  status: "Active" | "Pending" | "Suspended";
  verified: boolean;
  joinedDate: Date;
  profileImage: string;
  hasPendingEdits?: boolean;
}

interface ProvidersTableProps {
  providers: Provider[];
  loading: boolean;
  onView: (provider: Provider) => void;
  onToggleStatus?: (provider: Provider) => void;
}

const ProvidersTable = ({
  providers,
  loading,
  onView,
  onToggleStatus,
}: ProvidersTableProps) => {
  const [, setHoveredRow] = useState<string | null>(null);

  if (loading) {
    return <TableSkeleton />;
  }

  if (providers.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <h3 className="empty-title">No providers found</h3>
        <p className="empty-text">No providers match your current filters</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        /* CSS Variables for Dark Mode */
        :root {
          --card-bg: #ffffff;
          --border-color: #e3e5e8;
          --border-light: #f1f3f4;
          --text-primary: #202124;
          --text-secondary: #5f6368;
          --hover-bg: #fafbfc;
          --table-header-bg: #f8f9fa;
          --empty-bg: #fafbfc;
          --blue-primary: #1a73e8;
          --blue-light-bg: #e8f0fe;
          --green-primary: #1e8e3e;
          --green-light-bg: #e6f4ea;
          --green-dark: #137333;
          --yellow-bg: #fef7e0;
          --yellow-text: #8f5d00;
          --red-bg: #fce8e6;
          --red-text: #c5221f;
          --verified-color: #1a73e8;
          --star-color: #f9ab00;
          --skeleton-from: #f1f3f4;
          --skeleton-to: #e3e5e8;
          --orange-primary: #FF6B35;
          --orange-light-bg: #FFF4ED;
          --orange-shadow: rgba(255, 107, 53, 0.2);
        }

        .dark-mode {
          --card-bg: #1f2937;
          --border-color: #374151;
          --border-light: #374151;
          --text-primary: #f9fafb;
          --text-secondary: #d1d5db;
          --hover-bg: #374151;
          --table-header-bg: #1f2937;
          --empty-bg: #1f2937;
          --blue-primary: #60a5fa;
          --blue-light-bg: rgba(96, 165, 250, 0.15);
          --green-primary: #4ade80;
          --green-light-bg: rgba(74, 222, 128, 0.15);
          --green-dark: #4ade80;
          --yellow-bg: rgba(251, 191, 36, 0.15);
          --yellow-text: #fbbf24;
          --red-bg: rgba(248, 113, 113, 0.15);
          --red-text: #f87171;
          --verified-color: #60a5fa;
          --star-color: #fbbf24;
          --skeleton-from: #374151;
          --skeleton-to: #4b5563;
          --orange-primary: #FF8A5B;
          --orange-light-bg: rgba(255, 107, 53, 0.15);
          --orange-shadow: rgba(255, 138, 91, 0.3);
        }

        .table-container {
          overflow-x: auto;
          border-radius: 12px;
          border: 1.5px solid var(--border-color);
          background: var(--card-bg);
        }

        .providers-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 900px;
        }

        .providers-table thead {
          background: var(--table-header-bg);
          border-bottom: 1.5px solid var(--border-color);
        }

        .providers-table th {
          padding: 12px 16px;
          text-align: left;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .providers-table tbody tr {
          border-bottom: 1px solid var(--border-light);
          transition: background-color 0.15s ease;
        }

        .providers-table tbody tr:hover {
          background: var(--hover-bg);
        }

        .providers-table tbody tr:last-child {
          border-bottom: none;
        }

        .providers-table td {
          padding: 14px 16px;
          color: var(--text-primary);
          font-size: 14px;
          vertical-align: middle;
        }

        .provider-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .provider-avatar {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          object-fit: cover;
          border: 1.5px solid var(--border-color);
        }

        .provider-info h4 {
          font-weight: 600;
          font-size: 14px;
          color: var(--text-primary);
          margin: 0 0 3px 0;
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .verified-badge {
          color: var(--verified-color);
        }

        .needs-review-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          border-radius: 6px;
          background: var(--orange-light-bg);
          color: var(--orange-primary);
          font-size: 10px;
          font-weight: 700;
          white-space: nowrap;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .provider-info p {
          font-size: 13px;
          color: var(--text-secondary);
          margin: 0;
        }

        .location-cell {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-secondary);
        }

        .rating-cell {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .rating-value {
          font-weight: 600;
          color: var(--text-primary);
        }

        .rating-count {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge.active {
          background: var(--green-light-bg);
          color: var(--green-dark);
        }

        .status-badge.pending {
          background: var(--yellow-bg);
          color: var(--yellow-text);
        }

        .status-badge.suspended {
          background: var(--red-bg);
          color: var(--red-text);
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .status-badge.active .status-dot {
          background: var(--green-dark);
        }

        .status-badge.pending .status-dot {
          background: var(--yellow-text);
        }

        .status-badge.suspended .status-dot {
          background: var(--red-text);
        }

        .action-buttons {
          display: flex;
          gap: 8px;
          align-items: center;
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
          white-space: nowrap;
        }

        .action-btn.view {
          border-color: var(--blue-primary);
          color: var(--blue-primary);
        }

        .action-btn.view:hover {
          background: var(--blue-light-bg);
        }

        .action-btn.approve {
          border-color: var(--green-primary);
          color: var(--green-primary);
        }

        .action-btn.approve:hover {
          background: var(--green-light-bg);
        }

        .action-btn.review {
          border-color: var(--orange-primary);
          background: var(--orange-light-bg);
          color: var(--orange-primary);
          animation: glow 2s ease-in-out infinite;
        }

        .action-btn.review:hover {
          background: var(--orange-primary);
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px var(--orange-shadow);
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 0 0 var(--orange-shadow); }
          50% { box-shadow: 0 0 12px 4px var(--orange-shadow); }
        }

        /* Mobile Cards View */
        .mobile-cards {
          display: none;
        }

        .provider-card {
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 12px;
          padding: 16px;
          transition: all 0.15s;
        }

        .provider-card:hover {
          border-color: var(--text-secondary);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .dark-mode .provider-card:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .card-header {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
        }

        .card-avatar {
          width: 56px;
          height: 56px;
          border-radius: 10px;
          object-fit: cover;
          border: 1.5px solid var(--border-color);
          flex-shrink: 0;
        }

        .card-info {
          flex: 1;
          min-width: 0;
        }

        .card-name {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 4px 0;
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .card-email {
          font-size: 13px;
          color: var(--text-secondary);
          margin: 0 0 6px 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .card-meta {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .card-meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .card-stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-top: 1px solid var(--border-light);
          border-bottom: 1px solid var(--border-light);
          margin-bottom: 12px;
        }

        .card-stat {
          text-align: center;
        }

        .card-stat-label {
          font-size: 11px;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .card-stat-value {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 4px;
          justify-content: center;
        }

        .card-actions {
          display: flex;
          gap: 8px;
        }

        .card-actions .action-btn {
          flex: 1;
          justify-content: center;
        }

        .empty-state {
          padding: 60px 20px;
          text-align: center;
          border: 1.5px dashed var(--border-color);
          border-radius: 12px;
          background: var(--empty-bg);
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .empty-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .empty-text {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .skeleton {
          background: linear-gradient(90deg, var(--skeleton-from) 25%, var(--skeleton-to) 50%, var(--skeleton-from) 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 8px;
        }

        @keyframes skeleton-loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .skeleton-row {
          height: 70px;
          margin-bottom: 1px;
        }

        /* Tablet: 2 columns */
        @media (max-width: 1024px) and (min-width: 769px) {
          .table-container {
            display: none;
          }

          .mobile-cards {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .provider-card {
            margin-bottom: 0;
          }
        }

        /* Mobile: 1 column */
        @media (max-width: 768px) {
          .table-container {
            display: none;
          }

          .mobile-cards {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .provider-card {
            margin-bottom: 0;
          }
        }
      `}</style>

      {/* Desktop Table View */}
      <div className="table-container">
        <table className="providers-table">
          <thead>
            <tr>
              <th>Provider</th>
              <th>Category</th>
              <th>Location</th>
              <th>Rating</th>
              <th>Jobs</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((provider) => {
              const isPending = provider.status === "Pending";
              const isSuspended = provider.status === "Suspended";

              return (
                <tr
                  key={provider.id}
                  onMouseEnter={() => setHoveredRow(provider.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td>
                    <div className="provider-cell">
                      <img
                        src={provider.profileImage}
                        alt={provider.name}
                        className="provider-avatar"
                      />
                      <div className="provider-info">
                        <h4>
                          {provider.name}
                          {provider.verified && (
                            <CheckCircle
                              size={14}
                              className="verified-badge"
                              strokeWidth={2}
                            />
                          )}
                          {provider.hasPendingEdits && (
                            <span className="needs-review-badge">
                              <AlertCircle size={12} strokeWidth={3} />
                              REVIEW
                            </span>
                          )}
                        </h4>
                        <p>{provider.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>{provider.category}</td>
                  <td>
                    <div className="location-cell">
                      <MapPin size={14} strokeWidth={2} />
                      {provider.city}
                    </div>
                  </td>
                  <td>
                    <div className="rating-cell">
                      <Star
                        size={14}
                        fill="var(--star-color)"
                        stroke="var(--star-color)"
                        strokeWidth={0}
                      />
                      <span className="rating-value">{provider.rating}</span>
                      <span className="rating-count">
                        ({provider.reviewCount})
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>
                      {provider.jobsCompleted}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${provider.status.toLowerCase()}`}
                    >
                      <span className="status-dot"></span>
                      {provider.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {provider.hasPendingEdits && (
                        <button
                          className="action-btn review"
                          onClick={() => onView(provider)}
                          title="Review pending changes"
                        >
                          <AlertCircle size={14} strokeWidth={2.5} />
                          Review
                        </button>
                      )}
                      <button
                        className="action-btn view"
                        onClick={() => onView(provider)}
                        title="View details"
                      >
                        <Eye size={14} strokeWidth={2} />
                        View
                      </button>

                      {(isPending || isSuspended) && onToggleStatus && (
                        <button
                          className="action-btn approve"
                          onClick={() => onToggleStatus(provider)}
                          title="Approve provider"
                        >
                          <CheckCircle size={14} strokeWidth={2} />
                          Approve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards View */}
      <div className="mobile-cards">
        {providers.map((provider) => {
          const isPending = provider.status === "Pending";
          const isSuspended = provider.status === "Suspended";

          return (
            <div key={provider.id} className="provider-card">
              <div className="card-header">
                <img
                  src={provider.profileImage}
                  alt={provider.name}
                  className="card-avatar"
                />
                <div className="card-info">
                  <h3 className="card-name">
                    {provider.name}
                    {provider.verified && (
                      <CheckCircle
                        size={14}
                        className="verified-badge"
                        strokeWidth={2}
                      />
                    )}
                    {provider.hasPendingEdits && (
                      <span className="needs-review-badge">
                        <AlertCircle size={12} strokeWidth={3} />
                        REVIEW
                      </span>
                    )}
                  </h3>
                  <p className="card-email">{provider.email}</p>
                  <span
                    className={`status-badge ${provider.status.toLowerCase()}`}
                  >
                    <span className="status-dot"></span>
                    {provider.status}
                  </span>
                </div>
              </div>

              <div className="card-meta">
                <div className="card-meta-item">
                  <span style={{ fontWeight: 600 }}>{provider.category}</span>
                </div>
                <div className="card-meta-item">
                  <MapPin size={12} strokeWidth={2} />
                  {provider.city}
                </div>
              </div>

              <div className="card-stats">
                <div className="card-stat">
                  <div className="card-stat-label">Rating</div>
                  <div className="card-stat-value">
                    <Star
                      size={14}
                      fill="var(--star-color)"
                      stroke="var(--star-color)"
                      strokeWidth={0}
                    />
                    {provider.rating}
                  </div>
                </div>
                <div className="card-stat">
                  <div className="card-stat-label">Reviews</div>
                  <div className="card-stat-value">{provider.reviewCount}</div>
                </div>
                <div className="card-stat">
                  <div className="card-stat-label">Jobs</div>
                  <div className="card-stat-value">
                    {provider.jobsCompleted}
                  </div>
                </div>
              </div>

              <div className="card-actions">
                {provider.hasPendingEdits && (
                  <button
                    className="action-btn review"
                    onClick={() => onView(provider)}
                  >
                    <AlertCircle size={14} strokeWidth={2.5} />
                    Review
                  </button>
                )}
                <button
                  className="action-btn view"
                  onClick={() => onView(provider)}
                >
                  <Eye size={14} strokeWidth={2} />
                  View
                </button>

                {(isPending || isSuspended) && onToggleStatus && (
                  <button
                    className="action-btn approve"
                    onClick={() => onToggleStatus(provider)}
                  >
                    <CheckCircle size={14} strokeWidth={2} />
                    Approve
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const TableSkeleton = () => (
  <>
    <style>{`
      .skeleton-container {
        border: 1.5px solid var(--border-color);
        border-radius: 12px;
        overflow: hidden;
        background: var(--card-bg);
      }
    `}</style>
    <div className="skeleton-container">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="skeleton skeleton-row"></div>
      ))}
    </div>
  </>
);

export default ProvidersTable;
