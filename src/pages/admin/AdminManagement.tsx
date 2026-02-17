import { useState, useEffect } from "react";
import { Shield, Plus, Users, UserCheck, Search, X } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useToast } from "../../contexts/ToastContext";
import PageHeader from "../../components/Admin/PageHeader";
import StatCard from "../../components/Admin/StatCard";
import AdminsTable, { type Admin } from "../../components/Admin/AdminsTable";
import AddAdminModal from "../../components/Admin/Modals/AddAdminModal";

const AdminManagement = () => {
  const { showSuccess, showError } = useToast();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    checkAccessAndFetchAdmins();
  }, []);

  const checkAccessAndFetchAdmins = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        showError("Authentication Required", "Please log in");
        setLoading(false);
        return;
      }

      const isSuperAdmin = user.app_metadata?.role === "super_admin";

      if (!isSuperAdmin) {
        showError("Access Denied", "Super Admin privileges required");
        setLoading(false);
        return;
      }

      setCurrentUser(user);

      // Fetch all admins (excluding super admin)
      await fetchAdmins();
    } catch (error) {
      console.error("Error checking access:", error);
      showError("Error", "Failed to verify access");
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      setLoading(true);

      console.log("🔍 Fetching admins via RPC...");

      // Query auth.users table for admins
      const { data, error } = await supabase.rpc("get_admin_users");

      console.log("📦 RPC Response:", { data, error });

      if (error) {
        console.error("❌ Full error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        setAdmins([]);
        return;
      }

      console.log("✅ Raw admin data:", data);

      // Transform the data to match Admin interface
      const adminList: Admin[] = (data || []).map((admin: any) => ({
        id: admin.id,
        email: admin.email,
        fullName: admin.raw_user_meta_data?.full_name || null,
        role: admin.raw_app_meta_data?.role || "admin",
        status: "Active" as const,
        createdAt: new Date(admin.created_at),
        createdBy: admin.raw_app_meta_data?.created_by_email || null,
      }));

      console.log("✅ Transformed admin list:", adminList);
      console.log("✅ Number of admins:", adminList.length);

      setAdmins(adminList);
    } catch (error) {
      console.error("Error fetching admins:", error);
      showError("Error", "Failed to load admins");
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = (newAdmin: Admin) => {
    setAdmins((prev) => [newAdmin, ...prev]);
    showSuccess("Success", "Admin created successfully!");
  };

  const getFilteredAdmins = () => {
    if (!searchQuery.trim()) return admins;

    const query = searchQuery.toLowerCase().trim();
    return admins.filter(
      (admin) =>
        admin.email.toLowerCase().includes(query) ||
        admin.fullName?.toLowerCase().includes(query),
    );
  };

  const filteredAdmins = getFilteredAdmins();

  const stats = {
    total: admins.length + 1,
    superAdmin: 1,
    regularAdmins: admins.length,
    active: admins.filter((a) => a.status === "Active").length + 1,
  };

  // Access denied state
  if (
    !loading &&
    (!currentUser || currentUser.app_metadata?.role !== "super_admin")
  ) {
    return (
      <div className="access-denied-container">
        <style>{`
          .access-denied-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: var(--bg-primary);
            padding: 20px;
          }

          .access-denied-card {
            text-align: center;
            max-width: 480px;
            width: 90%;
            background: var(--card-bg);
            padding: 48px 40px;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            border: 1px solid var(--border-color);
          }

          .access-denied-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 24px;
            background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #dc2626;
          }

          .dark-mode .access-denied-icon {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%);
            color: #f87171;
          }

          .access-denied-title {
            font-size: 24px;
            font-weight: 800;
            color: var(--text-primary);
            margin: 0 0 12px 0;
            letter-spacing: -0.5px;
          }

          .access-denied-message {
            font-size: 15px;
            color: var(--text-secondary);
            margin: 0;
            line-height: 1.6;
          }

          @media (max-width: 768px) {
            .access-denied-card {
              padding: 36px 28px;
            }

            .access-denied-icon {
              width: 64px;
              height: 64px;
            }

            .access-denied-title {
              font-size: 20px;
            }

            .access-denied-message {
              font-size: 14px;
            }
          }
        `}</style>
        <div className="access-denied-card">
          <div className="access-denied-icon">
            <Shield size={40} strokeWidth={2.5} />
          </div>
          <h2 className="access-denied-title">Access Denied</h2>
          <p className="access-denied-message">
            Only Super Administrators can access this page. Please contact your
            system administrator if you need access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .admin-management {
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
          --card-shadow: rgba(0, 0, 0, 0.1);
          --orange-primary: #FF6B35;
          --orange-light-bg: #FFF4ED;
          --orange-shadow: rgba(255, 107, 53, 0.1);
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
          --card-shadow: rgba(0, 0, 0, 0.4);
          --orange-primary: #FF8A5B;
          --orange-light-bg: rgba(255, 107, 53, 0.15);
          --orange-shadow: rgba(255, 138, 91, 0.15);
        }

        @media (max-width: 768px) {
          .admin-management {
            padding: 20px 16px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

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
        }

        @media (max-width: 480px) {
          .admin-management {
            padding: 16px 12px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 16px;
          }

          .toolbar {
            margin-bottom: 16px;
          }

          .search-input {
            padding: 12px 40px 12px 44px;
            font-size: 14px;
            border-radius: 10px;
          }
        }
      `}</style>

      <div className="admin-management">
        <PageHeader
          title="Admin Management"
          subtitle="Create and manage administrator accounts"
          icon={Shield}
          action={{
            label: "Create Admin",
            onClick: () => setShowAddModal(true),
            icon: Plus,
          }}
        />

        <div className="stats-grid">
          <StatCard
            label="Total Admins"
            value={stats.total}
            icon={Users}
            iconColor="blue"
          />
          <StatCard
            label="Super Admin"
            value={stats.superAdmin}
            icon={Shield}
            iconColor="purple"
          />
          <StatCard
            label="Regular Admins"
            value={stats.regularAdmins}
            icon={UserCheck}
            iconColor="green"
          />
          <StatCard
            label="Active"
            value={stats.active}
            icon={UserCheck}
            iconColor="orange"
          />
        </div>

        <div className="toolbar">
          <div className="toolbar-left">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search admins by name or email..."
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
          </div>
        </div>

        <AdminsTable
          admins={filteredAdmins}
          loading={loading}
          currentUser={currentUser}
        />

        {showAddModal && (
          <AddAdminModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSuccess={handleAddSuccess}
          />
        )}
      </div>
    </>
  );
};

export default AdminManagement;
