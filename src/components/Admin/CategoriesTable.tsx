// src/components/Admin/CategoriesTable.tsx (PERFECT ALIGNMENT + DARK MODE)
import React, { useState } from "react";
import { Edit2, Power } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Inactive";
  servicesCount: number;
  iconUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CategoriesTableProps {
  categories: Category[];
  loading: boolean;
  onEdit: (category: Category) => void;
  onToggleStatus: (category: Category) => void;
}

const CategoriesTable: React.FC<CategoriesTableProps> = ({
  categories,
  loading,
  onEdit,
  onToggleStatus,
}) => {
  const [, setHoveredRow] = useState<string | null>(null);

  if (loading) {
    return <TableSkeleton />;
  }

  if (categories.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <style>{`
        /* CSS Variables for Dark Mode */
        :root {
          --card-bg: #ffffff;
          --border-color: #e5e7eb;
          --border-light: #f3f4f6;
          --text-primary: #1f2937;
          --text-secondary: #6b7280;
          --text-tertiary: #9ca3af;
          --hover-bg: #fafafa;
          --table-header-bg: #f9fafb;
          --empty-bg: #fafafa;
          --success-bg: #DCFCE7;
          --success-color: #15803D;
          --danger-bg: #FEE2E2;
          --danger-color: #DC2626;
          --orange-primary: #FF6B35;
          --orange-light-bg: #FFF4ED;
          --green-color: #10b981;
          --green-light-bg: #DCFCE7;
          --red-color: #ef4444;
          --red-light-bg: #FEE2E2;
          --skeleton-from: #f3f4f6;
          --skeleton-to: #e5e7eb;
        }

        .dark-mode {
          --card-bg: #1f2937;
          --border-color: #374151;
          --border-light: #374151;
          --text-primary: #f9fafb;
          --text-secondary: #d1d5db;
          --text-tertiary: #9ca3af;
          --hover-bg: #374151;
          --table-header-bg: #1f2937;
          --empty-bg: #1f2937;
          --success-bg: rgba(21, 128, 61, 0.2);
          --success-color: #4ADE80;
          --danger-bg: rgba(220, 38, 38, 0.15);
          --danger-color: #F87171;
          --orange-primary: #FF8A5B;
          --orange-light-bg: rgba(255, 107, 53, 0.15);
          --green-color: #4ADE80;
          --green-light-bg: rgba(16, 185, 129, 0.2);
          --red-color: #F87171;
          --red-light-bg: rgba(239, 68, 68, 0.15);
          --skeleton-from: #374151;
          --skeleton-to: #4b5563;
        }

        /* Desktop Table */
        .table-container {
          overflow-x: auto;
          border-radius: 12px;
          border: 1.5px solid var(--border-color);
          background: var(--card-bg);
        }

        .categories-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }

        .categories-table thead {
          background: var(--table-header-bg);
          border-bottom: 1.5px solid var(--border-color);
        }

        .categories-table th {
          padding: 14px 16px;
          text-align: left;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .categories-table tbody tr {
          border-bottom: 1px solid var(--border-light);
          transition: background-color 0.15s ease;
        }

        .categories-table tbody tr:hover {
          background: var(--hover-bg);
        }

        .categories-table tbody tr:last-child {
          border-bottom: none;
        }

        .categories-table td {
          padding: 16px;
          color: var(--text-primary);
          font-size: 14px;
          vertical-align: middle;
        }

        /* Category Name Cell */
        .category-name-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .category-icon {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          overflow: hidden;
          border: 1.5px solid var(--border-color);
          flex-shrink: 0;
          background: var(--table-header-bg);
        }

        .category-icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .category-info h4 {
          font-weight: 600;
          font-size: 15px;
          color: var(--text-primary);
          margin: 0 0 4px 0;
        }

        .category-info p {
          font-size: 13px;
          color: var(--text-secondary);
          margin: 0;
          max-width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Services Count */
        .services-count {
          font-weight: 600;
          color: var(--text-primary);
        }

        .services-label {
          color: var(--text-tertiary);
          margin-left: 4px;
        }

        /* Status Badge */
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
          background: var(--success-bg);
          color: var(--success-color);
        }

        .status-badge.inactive {
          background: var(--danger-bg);
          color: var(--danger-color);
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .status-badge.active .status-dot {
          background: var(--success-color);
        }

        .status-badge.inactive .status-dot {
          background: var(--danger-color);
        }

        /* Action Buttons */
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

        .action-btn.edit {
          border-color: var(--orange-primary);
          color: var(--orange-primary);
        }

        .action-btn.edit:hover {
          background: var(--orange-light-bg);
        }

        .action-btn.toggle {
          border-color: var(--green-color);
          color: var(--green-color);
        }

        .action-btn.toggle:hover {
          background: var(--green-light-bg);
        }

        .action-btn.toggle.deactivate {
          border-color: var(--red-color);
          color: var(--red-color);
        }

        .action-btn.toggle.deactivate:hover {
          background: var(--red-light-bg);
        }

        /* Mobile Cards */
        .mobile-cards {
          display: none;
        }

        .mobile-card {
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
        }

        .mobile-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .mobile-card-info {
          flex: 1;
        }

        .mobile-card-info h4 {
          font-weight: 600;
          font-size: 16px;
          color: var(--text-primary);
          margin: 0 0 6px 0;
        }

        .mobile-card-info p {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0;
        }

        .mobile-card-meta {
          display: flex;
          gap: 16px;
          margin-bottom: 12px;
          font-size: 14px;
        }

        .mobile-card-actions {
          display: flex;
          gap: 8px;
        }

        /* Empty State */
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

        /* Skeleton */
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
          height: 72px;
          margin-bottom: 1px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .table-container {
            display: none;
          }

          .mobile-cards {
            display: block;
          }

          .action-btn {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>

      {/* Desktop Table */}
      <div className="table-container">
        <table className="categories-table">
          <thead>
            <tr>
              <th>CATEGORY</th>
              <th>SERVICES</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => {
              const isActive = category.status === "Active";
              return (
                <tr
                  key={category.id}
                  onMouseEnter={() => setHoveredRow(category.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td>
                    <div className="category-name-cell">
                      <div className="category-icon">
                        <img
                          src={category.iconUrl}
                          alt={category.name}
                          loading="lazy"
                        />
                      </div>
                      <div className="category-info">
                        <h4>{category.name}</h4>
                        <p title={category.description}>
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="services-count">
                      {category.servicesCount}
                    </span>
                    <span className="services-label">services</span>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${isActive ? "active" : "inactive"}`}
                    >
                      <span className="status-dot"></span>
                      {category.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn edit"
                        onClick={() => onEdit(category)}
                        title="Edit category"
                      >
                        <Edit2 size={14} strokeWidth={2.5} />
                        Edit
                      </button>
                      <button
                        className={`action-btn toggle ${isActive ? "deactivate" : ""}`}
                        onClick={() => onToggleStatus(category)}
                        title={`${isActive ? "Deactivate" : "Activate"} category`}
                      >
                        <Power size={14} strokeWidth={2.5} />
                        {isActive ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="mobile-cards">
        {categories.map((category) => {
          const isActive = category.status === "Active";
          return (
            <div key={category.id} className="mobile-card">
              <div className="mobile-card-header">
                <div className="category-icon">
                  <img
                    src={category.iconUrl}
                    alt={category.name}
                    loading="lazy"
                  />
                </div>
                <div className="mobile-card-info">
                  <h4>{category.name}</h4>
                  <p>{category.description}</p>
                </div>
              </div>

              <div className="mobile-card-meta">
                <div>
                  <span style={{ color: "var(--text-secondary)" }}>
                    Services:{" "}
                  </span>
                  <span className="services-count">
                    {category.servicesCount}
                  </span>
                </div>
                <span
                  className={`status-badge ${isActive ? "active" : "inactive"}`}
                >
                  <span className="status-dot"></span>
                  {category.status}
                </span>
              </div>

              <div className="mobile-card-actions">
                <button
                  className="action-btn edit"
                  onClick={() => onEdit(category)}
                >
                  <Edit2 size={14} strokeWidth={2.5} />
                  Edit
                </button>
                <button
                  className={`action-btn toggle ${isActive ? "deactivate" : ""}`}
                  onClick={() => onToggleStatus(category)}
                >
                  <Power size={14} strokeWidth={2.5} />
                  {isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

// Skeleton Loader Component
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

// Empty State Component
const EmptyState = () => (
  <div className="empty-state">
    <div className="empty-icon">📂</div>
    <h3 className="empty-title">No categories found</h3>
    <p className="empty-text">Click "Add Category" to create your first one</p>
  </div>
);

export default CategoriesTable;
