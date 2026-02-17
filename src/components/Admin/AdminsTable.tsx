import { Mail, Calendar, Shield, User, UserCheck } from "lucide-react";

export interface Admin {
  id: string;
  email: string;
  fullName?: string;
  role: string;
  status: "Active" | "Inactive";
  createdAt: Date;
  createdBy?: string;
}

interface AdminsTableProps {
  admins: Admin[];
  loading: boolean;
  currentUser: any;
}

const AdminsTable = ({ admins, currentUser }: AdminsTableProps) => {
  return (
    <>
      <style>{`
        /* Dark Mode Variables */
        :root {
          --table-bg: #ffffff;
          --table-text: #111827;
          --table-text-secondary: #6b7280;
          --table-text-tertiary: #9ca3af;
          --table-border: #e5e7eb;
          --table-border-light: #f3f4f6;
          --table-hover: #f9fafb;
          --table-header-bg: #f9fafb;
        }

        .dark-mode {
          --table-bg: #1f2937;
          --table-text: #f9fafb;
          --table-text-secondary: #d1d5db;
          --table-text-tertiary: #9ca3af;
          --table-border: #374151;
          --table-border-light: #4b5563;
          --table-hover: #374151;
          --table-header-bg: #111827;
        }

        .table-container {
          background: var(--table-bg);
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid var(--table-border);
          overflow: hidden;
        }

        .dark-mode .table-container {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .table-header {
          background: var(--table-header-bg);
          border-bottom: 1px solid var(--table-border);
          padding: 20px 28px;
        }

        .table-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--table-text);
          margin: 0;
          letter-spacing: -0.3px;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .table-wrapper::-webkit-scrollbar {
          height: 8px;
        }

        .table-wrapper::-webkit-scrollbar-track {
          background: transparent;
        }

        .table-wrapper::-webkit-scrollbar-thumb {
          background: var(--table-border);
          border-radius: 4px;
        }

        .admins-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 700px;
        }

        .admins-table thead th {
          text-align: left;
          padding: 14px 28px;
          font-size: 11px;
          font-weight: 700;
          color: var(--table-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          background: var(--table-header-bg);
          border-bottom: 1px solid var(--table-border);
          white-space: nowrap;
        }

        .admins-table tbody td {
          padding: 18px 28px;
          border-bottom: 1px solid var(--table-border-light);
        }

        .admins-table tbody tr {
          transition: background 0.2s ease;
        }

        .admins-table tbody tr:hover {
          background: var(--table-hover);
        }

        .admins-table tbody tr:last-child td {
          border-bottom: none;
        }

        .admin-info {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 200px;
        }

        .admin-avatar {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 14px;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .admin-avatar-super {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .admin-details h4 {
          font-size: 14px;
          font-weight: 700;
          color: var(--table-text);
          margin: 0 0 5px 0;
          letter-spacing: -0.1px;
          white-space: nowrap;
        }

        .admin-details p {
          font-size: 13px;
          color: var(--table-text-secondary);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 250px;
        }

        .you-badge {
          color: var(--table-text-tertiary);
          font-weight: 600;
          font-size: 12px;
        }

        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: -0.1px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          white-space: nowrap;
        }

        .role-super-admin {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #92400e;
          border: 1px solid #fbbf24;
        }

        .dark-mode .role-super-admin {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.2) 100%);
          color: #fbbf24;
          border: 1px solid rgba(251, 191, 36, 0.3);
        }

        .role-admin {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          color: #1e40af;
          border: 1px solid #60a5fa;
        }

        .dark-mode .role-admin {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%);
          color: #60a5fa;
          border: 1px solid rgba(96, 165, 250, 0.3);
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 5px 14px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: -0.1px;
          white-space: nowrap;
        }

        .status-active {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #10b981;
        }

        .dark-mode .status-active {
          background: rgba(16, 185, 129, 0.2);
          color: #6ee7b7;
          border: 1px solid rgba(110, 231, 183, 0.3);
        }

        .status-inactive {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #f87171;
        }

        .dark-mode .status-inactive {
          background: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
          border: 1px solid rgba(252, 165, 165, 0.3);
        }

        .created-info {
          font-size: 13px;
          color: var(--table-text-secondary);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
        }

        .created-by {
          font-size: 12px;
          color: var(--table-text-tertiary);
          margin-top: 4px;
          font-weight: 500;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
        }

        .empty-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 20px;
          color: var(--table-text-tertiary);
          opacity: 0.5;
        }

        .empty-title {
          font-size: 17px;
          font-weight: 700;
          color: var(--table-text);
          margin: 0 0 10px 0;
          letter-spacing: -0.3px;
        }

        .empty-description {
          font-size: 14px;
          color: var(--table-text-secondary);
          margin: 0;
          font-weight: 500;
        }

        /* ── Mobile card layout ── */
        .mobile-cards {
          display: none;
        }

        .admin-card {
          padding: 16px;
          border-bottom: 1px solid var(--table-border-light);
        }

        .admin-card:last-child {
          border-bottom: none;
        }

        .admin-card-top {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .admin-card-name {
          font-size: 14px;
          font-weight: 700;
          color: var(--table-text);
          margin: 0 0 3px 0;
          letter-spacing: -0.1px;
        }

        .admin-card-email {
          font-size: 12px;
          color: var(--table-text-secondary);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 5px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 220px;
        }

        .admin-card-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .admin-card-date {
          font-size: 12px;
          color: var(--table-text-tertiary);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 5px;
          margin-left: auto;
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .table-header {
            padding: 16px 20px;
          }

          .table-title {
            font-size: 16px;
          }

          .admins-table {
            min-width: 650px;
          }

          .admins-table thead th {
            padding: 12px 16px;
            font-size: 10px;
            letter-spacing: 0.6px;
          }

          .admins-table tbody td {
            padding: 14px 16px;
          }

          .admin-info {
            gap: 12px;
            min-width: 180px;
          }

          .admin-avatar {
            width: 38px;
            height: 38px;
            font-size: 13px;
            border-radius: 10px;
          }

          .admin-details h4 {
            font-size: 13px;
          }

          .admin-details p {
            font-size: 12px;
            max-width: 180px;
          }

          .you-badge {
            font-size: 11px;
          }

          .role-badge {
            font-size: 11px;
            padding: 6px 12px;
            gap: 5px;
          }

          .status-badge {
            font-size: 11px;
            padding: 4px 12px;
          }

          .created-info {
            font-size: 12px;
            gap: 5px;
          }

          .created-by {
            font-size: 11px;
          }

          .empty-state {
            padding: 60px 16px;
          }

          .empty-icon {
            width: 56px;
            height: 56px;
          }

          .empty-title {
            font-size: 16px;
          }

          .empty-description {
            font-size: 13px;
          }
        }

        /* Small Mobile — switch to cards */
        @media (max-width: 560px) {
          .table-wrapper {
            overflow-x: visible;
          }

          .admins-table {
            display: none;
          }

          .mobile-cards {
            display: block;
          }

          .table-header {
            padding: 14px 16px;
          }

          .table-title {
            font-size: 15px;
          }

          .admin-avatar {
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .role-badge {
            font-size: 11px;
            padding: 5px 11px;
            gap: 5px;
          }

          .status-badge {
            font-size: 11px;
            padding: 4px 11px;
          }

          .empty-state {
            padding: 48px 16px;
          }
        }
      `}</style>

      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">Administrator Accounts</h3>
        </div>

        <div className="table-wrapper">
          {admins.length === 0 && !currentUser ? (
            <div className="empty-state">
              <Shield className="empty-icon" />
              <h4 className="empty-title">No Admin Accounts Yet</h4>
              <p className="empty-description">
                Create your first admin account to get started
              </p>
            </div>
          ) : (
            <>
              {/* ── Desktop / tablet table ── */}
              <table className="admins-table">
                <thead>
                  <tr>
                    <th>Admin</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUser && (
                    <tr>
                      <td>
                        <div className="admin-info">
                          <div className="admin-avatar admin-avatar-super">
                            <Shield size={22} strokeWidth={2.5} />
                          </div>
                          <div className="admin-details">
                            <h4>
                              {currentUser.user_metadata?.full_name ||
                                "Super Administrator"}{" "}
                              <span className="you-badge">(You)</span>
                            </h4>
                            <p title={currentUser.email}>
                              <Mail size={13} strokeWidth={2} />
                              {currentUser.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="role-badge role-super-admin">
                          <Shield size={14} strokeWidth={2.5} />
                          Super Admin
                        </span>
                      </td>
                      <td>
                        <span className="status-badge status-active">
                          Active
                        </span>
                      </td>
                      <td>
                        <div className="created-info">
                          <Calendar size={14} strokeWidth={2} />
                          {new Date(
                            currentUser.created_at,
                          ).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  )}

                  {admins.map((admin) => (
                    <tr key={admin.id}>
                      <td>
                        <div className="admin-info">
                          <div className="admin-avatar">
                            <User size={22} strokeWidth={2.5} />
                          </div>
                          <div className="admin-details">
                            <h4>{admin.fullName || "Admin User"}</h4>
                            <p title={admin.email}>
                              <Mail size={13} strokeWidth={2} />
                              {admin.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="role-badge role-admin">
                          <UserCheck size={14} strokeWidth={2.5} />
                          Admin
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            admin.status === "Active"
                              ? "status-active"
                              : "status-inactive"
                          }`}
                        >
                          {admin.status}
                        </span>
                      </td>
                      <td>
                        <div className="created-info">
                          <Calendar size={14} strokeWidth={2} />
                          <span>{admin.createdAt.toLocaleDateString()}</span>
                        </div>
                        {admin.createdBy && (
                          <div className="created-by">by {admin.createdBy}</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* ── Mobile cards (≤560px) ── */}
              <div className="mobile-cards">
                {currentUser && (
                  <div className="admin-card">
                    <div className="admin-card-top">
                      <div className="admin-avatar admin-avatar-super">
                        <Shield size={20} strokeWidth={2.5} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="admin-card-name">
                          {currentUser.user_metadata?.full_name ||
                            "Super Administrator"}{" "}
                          <span className="you-badge">(You)</span>
                        </p>
                        <p
                          className="admin-card-email"
                          title={currentUser.email}
                        >
                          <Mail size={12} strokeWidth={2} />
                          {currentUser.email}
                        </p>
                      </div>
                    </div>
                    <div className="admin-card-meta">
                      <span className="role-badge role-super-admin">
                        <Shield size={13} strokeWidth={2.5} />
                        Super Admin
                      </span>
                      <span className="status-badge status-active">Active</span>
                      <span className="admin-card-date">
                        <Calendar size={12} strokeWidth={2} />
                        {new Date(currentUser.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}

                {admins.map((admin) => (
                  <div className="admin-card" key={admin.id}>
                    <div className="admin-card-top">
                      <div className="admin-avatar">
                        <User size={20} strokeWidth={2.5} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="admin-card-name">
                          {admin.fullName || "Admin User"}
                        </p>
                        <p className="admin-card-email" title={admin.email}>
                          <Mail size={12} strokeWidth={2} />
                          {admin.email}
                        </p>
                      </div>
                    </div>
                    <div className="admin-card-meta">
                      <span className="role-badge role-admin">
                        <UserCheck size={13} strokeWidth={2.5} />
                        Admin
                      </span>
                      <span
                        className={`status-badge ${
                          admin.status === "Active"
                            ? "status-active"
                            : "status-inactive"
                        }`}
                      >
                        {admin.status}
                      </span>
                      <span className="admin-card-date">
                        <Calendar size={12} strokeWidth={2} />
                        {admin.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    {admin.createdBy && (
                      <div className="created-by" style={{ marginTop: 8 }}>
                        by {admin.createdBy}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminsTable;
