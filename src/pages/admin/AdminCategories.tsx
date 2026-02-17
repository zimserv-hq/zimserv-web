// src/pages/admin/AdminCategories.tsx
import { useState, useEffect } from "react";
import { FolderOpen, Plus, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useToast } from "../../contexts/ToastContext";
import PageHeader from "../../components/Admin/PageHeader";
import StatCard from "../../components/Admin/StatCard";
import CategoriesTable, {
  type Category,
} from "../../components/Admin/CategoriesTable";
import AddCategoryModal from "../../components/Admin/Modals/AddCategoryModal";
import EditCategoryModal from "../../components/Admin/Modals/EditCategoryModal";
import SearchBar from "../../components/Admin/SearchBar";

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

const SkeletonCategoryRow = () => (
  <tr className="sk-table-row">
    {/* Icon + Name */}
    <td>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          className="sk-block"
          style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          <div className="sk-block" style={{ width: 120, height: 14 }} />
          <div className="sk-block" style={{ width: 180, height: 12 }} />
        </div>
      </div>
    </td>
    {/* Services count */}
    <td>
      <div
        className="sk-block"
        style={{ width: 50, height: 26, borderRadius: 20 }}
      />
    </td>
    {/* Status */}
    <td>
      <div className="sk-block sk-pill" />
    </td>
    {/* Actions */}
    <td>
      <div style={{ display: "flex", gap: 8 }}>
        <div className="sk-block sk-btn" />
        <div className="sk-block sk-btn" />
      </div>
    </td>
  </tr>
);

// ─────────────────────────────────────────────────────────────────────────────

const AdminCategories = () => {
  const { showSuccess, showError } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .order("display_order");
      if (categoriesError) throw categoriesError;

      const categoriesWithServices = await Promise.all(
        (categoriesData || []).map(async (category) => {
          const { data: services } = await supabase
            .from("services")
            .select("name, is_active")
            .eq("category_id", category.id)
            .eq("is_active", true)
            .order("display_order")
            .limit(5);

          const { count } = await supabase
            .from("services")
            .select("*", { count: "exact", head: true })
            .eq("category_id", category.id)
            .eq("is_active", true);

          let description = category.description || "";
          if (services && services.length > 0) {
            const serviceNames = services.map((s) => s.name).join(", ");
            description = serviceNames + (count && count > 5 ? ", ..." : "");
          } else if (!description) {
            description = "No services yet";
          }

          return {
            id: category.id,
            name: category.name,
            description,
            status: category.status as "Active" | "Inactive",
            servicesCount: count || 0,
            iconUrl:
              category.icon_url ||
              "https://via.placeholder.com/200?text=No+Icon",
            createdAt: new Date(category.created_at),
            updatedAt: new Date(category.updated_at),
          };
        }),
      );

      setCategories(categoriesWithServices);
    } catch (error) {
      console.error("Error fetching categories:", error);
      showError("Error", "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleToggleStatus = async (category: Category) => {
    try {
      const newStatus = category.status === "Active" ? "Inactive" : "Active";
      const { error } = await supabase
        .from("categories")
        .update({ status: newStatus })
        .eq("id", category.id);
      if (error) throw error;

      setCategories((prev) =>
        prev.map((c) =>
          c.id === category.id
            ? { ...c, status: newStatus as "Active" | "Inactive" }
            : c,
        ),
      );
      showSuccess(
        "Success",
        `Category ${newStatus === "Active" ? "activated" : "deactivated"} successfully`,
      );
    } catch (error) {
      showError("Error", "Failed to update category status");
    }
  };

  const handleAddSuccess = (newCategory: Category) => {
    setCategories((prev) => [newCategory, ...prev]);
    fetchCategories();
  };

  const handleEditSuccess = (updatedCategory: Category) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === updatedCategory.id ? updatedCategory : c)),
    );
    fetchCategories();
  };

  const getFilteredCategories = () => {
    if (!searchQuery.trim()) return categories;
    const query = searchQuery.toLowerCase().trim();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query),
    );
  };

  const filteredCategories = getFilteredCategories();

  const stats = {
    total: categories.length,
    active: categories.filter((c) => c.status === "Active").length,
    inactive: categories.filter((c) => c.status === "Inactive").length,
    totalServices: categories.reduce((sum, c) => sum + c.servicesCount, 0),
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
          display: flex; flex-direction: column;
          gap: 16px; min-height: 110px;
          justify-content: space-between;
        }
        .sk-stat-top { display: flex; justify-content: space-between; align-items: center; }
        .sk-stat-icon { width: 40px; height: 40px; border-radius: 10px; }

        .sk-table-row td {
          padding: 18px 20px;
          border-bottom: 1px solid var(--border-color);
        }
        .sk-pill { height: 26px; width: 80px;  border-radius: 20px; }
        .sk-btn  { height: 32px; width: 72px;  border-radius: 8px;  }

        /* ── Page Styles ──────────────────────────────────────────── */
        .admin-categories {
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

        :root { --bg-primary: #f8f9fa; }
        .dark-mode { --bg-primary: #111827; }

        @media (max-width: 768px) {
          .admin-categories { padding: 20px 16px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        }
      `}</style>

      <div className="admin-categories">
        <PageHeader
          title="Service Categories"
          subtitle="Manage service categories and organize provider listings"
          icon={FolderOpen}
          action={{
            label: "Add Category",
            onClick: () => setShowAddModal(true),
            icon: Plus,
          }}
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
                label="Total Categories"
                value={stats.total}
                icon={FolderOpen}
                iconColor="orange"
              />
              <StatCard
                label="Active Categories"
                value={stats.active}
                icon={CheckCircle}
                iconColor="green"
              />
              <StatCard
                label="Inactive Categories"
                value={stats.inactive}
                icon={XCircle}
                iconColor="red"
              />
              <StatCard
                label="Total Services"
                value={stats.totalServices}
                icon={FolderOpen}
                iconColor="blue"
              />
            </>
          )}
        </div>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search categories by name or description..."
        />

        {/* Table — show skeleton rows while loading */}
        {loading ? (
          <div
            style={{
              background: "var(--card-bg)",
              border: "1.5px solid var(--border-color)",
              borderRadius: 16,
              overflow: "hidden",
              marginTop: 0,
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    background: "var(--hover-bg, #f3f4f6)",
                    borderBottom: "1.5px solid var(--border-color, #e5e7eb)",
                  }}
                >
                  {["Category", "Services", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "16px 20px",
                        textAlign: "left",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--text-secondary, #6b7280)",
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
                  <SkeletonCategoryRow key={i} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <CategoriesTable
            categories={filteredCategories}
            loading={loading}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
          />
        )}

        {showAddModal && (
          <AddCategoryModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSuccess={handleAddSuccess}
          />
        )}

        {showEditModal && selectedCategory && (
          <EditCategoryModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedCategory(null);
            }}
            onSuccess={handleEditSuccess}
            category={selectedCategory}
          />
        )}
      </div>
    </>
  );
};

export default AdminCategories;
