// src/pages/CategoriesPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { supabase } from "../lib/supabaseClient";

type DbCategory = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  icon_url: string | null;
  display_order: number | null;
};

type UiCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  providerCount: number;
  color: string;
  image: string;
};

const DEFAULT_IMAGE =
  "https://via.placeholder.com/800x600?text=Service+Category";

const DEFAULT_COLOR = "#FF6B35";

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<UiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // send category NAME so ProvidersPage filter (p.category === selectedCategory) works
  const handleCategoryClick = (categoryName: string) => {
    navigate(`/providers?category=${encodeURIComponent(categoryName)}`);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("categories")
          .select("id,name,description,status,icon_url,display_order")
          .eq("status", "Active")
          .order("display_order", { ascending: true });

        if (error) {
          console.error("Error loading categories:", error);
          setCategories([]);
          return;
        }

        const dbCategories: DbCategory[] = data || [];

        const categoriesWithServices = await Promise.all(
          dbCategories.map(async (category) => {
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

            let servicesDescription = "";
            if (services && services.length > 0) {
              const serviceNames = services.map((s) => s.name).join(", ");
              servicesDescription =
                serviceNames + (count && count > 5 ? ", ..." : "");
            } else {
              servicesDescription = "No services yet";
            }

            return {
              ...category,
              servicesDescription,
              servicesCount: count || 0,
            };
          }),
        );

        const { data: providerRows, error: providerError } = await supabase
          .from("providers")
          .select("primary_category_id,status");

        const providerCountMap: Record<string, number> = {};

        if (!providerError && providerRows) {
          for (const row of providerRows as any[]) {
            if (row.status !== "active") continue;
            const catId = row.primary_category_id as string | null;
            if (!catId) continue;
            providerCountMap[catId] = (providerCountMap[catId] || 0) + 1;
          }
        }

        const uiCats: UiCategory[] = categoriesWithServices.map((cat) => {
          const slug = cat.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

          const providerCount = providerCountMap[cat.id] || 0;

          return {
            id: cat.id,
            name: cat.name,
            slug,
            description: cat.servicesDescription,
            providerCount,
            color: DEFAULT_COLOR,
            image: cat.icon_url || DEFAULT_IMAGE,
          };
        });

        setCategories(uiCats);
      } catch (err) {
        console.error("Unexpected error loading categories:", err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <style>{`
        .categories-page {
          width: 100%;
          min-height: 100vh;
          background: var(--color-bg-section);
          padding: 40px 0 80px;
          font-family: var(--font-primary);
        }
        .categories-container {
          max-width: var(--container-max-width);
          margin: 0 auto;
          padding: 0 var(--container-padding);
        }
        .categories-header {
          margin-bottom: 32px;
        }
        .categories-title {
          font-family: var(--font-primary);
          font-size: 30px;
          font-weight: 800;
          color: var(--color-primary);
          margin-bottom: 10px;
          line-height: 1.15;
          letter-spacing: -1.2px;
          margin-top: -10px;
        }
        .categories-subtitle {
          font-size: 16px;
          font-weight: 500;
          color: var(--color-text-secondary);
        }
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .category-card {
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          cursor: pointer;
          transition:
            transform var(--transition-base),
            border-color var(--transition-base),
            box-shadow var(--transition-base);
          position: relative;
        }
        .category-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--accent-color);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
          z-index: 2;
        }
        .category-card:hover::before {
          transform: scaleX(1);
        }
        .category-card:hover {
          transform: translateY(-6px);
          border-color: var(--accent-color);
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
        }
        .category-image-wrap {
          width: 100%;
          height: 160px;
          overflow: hidden;
          background: var(--color-bg-soft);
          position: relative;
        }
        .category-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .category-card:hover .category-image {
          transform: scale(1.08);
        }
        .category-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(0,0,0,0.3) 100%
          );
        }
        .category-content {
          padding: 20px;
        }
        .category-name {
          font-family: var(--font-primary);
          font-size: 20px;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 6px;
          line-height: 1.3;
          letter-spacing: -0.3px;
        }
        .category-description {
          font-size: 13px;
          color: var(--color-text-secondary);
          line-height: 1.5;
          margin-bottom: 14px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .category-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .category-count {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-text-secondary);
        }
        .category-count strong {
          color: var(--color-accent);
          font-weight: 700;
        }
        .category-arrow {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--color-accent-soft);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-accent);
          transition: all var(--transition-fast);
        }
        .category-card:hover .category-arrow {
          background: var(--color-accent);
          color: #fff;
          transform: translateX(4px);
        }
        @media (max-width: 1200px) {
          .categories-container { padding: 0 32px; }
          .categories-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }
        }
        @media (max-width: 900px) {
          .categories-page { padding: 32px 0 60px; }
          .categories-container { padding: 0 24px; }
          .categories-title { font-size: 36px; }
          .categories-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .categories-page { padding: 24px 0 48px; }
          .categories-container { padding: 0 16px; }
          .categories-title { font-size: 30px; letter-spacing: -0.8px; }
          .categories-subtitle { font-size: 16px; }
          .categories-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .category-image-wrap {
            height: 180px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <Breadcrumb items={[{ label: "Categories" }]} />

      <div className="categories-page">
        <div className="categories-container">
          <div className="categories-header">
            <h1 className="categories-title">Browse Service Categories</h1>
            <p className="categories-subtitle">
              Find the perfect professional for any job across Zimbabwe
            </p>
          </div>

          {loading ? (
            <p style={{ color: "var(--color-text-secondary)", fontSize: 14 }}>
              Loading categories...
            </p>
          ) : categories.length === 0 ? (
            <p style={{ color: "var(--color-text-secondary)", fontSize: 14 }}>
              No categories available yet.
            </p>
          ) : (
            <div className="categories-grid">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="category-card"
                  style={
                    { "--accent-color": category.color } as React.CSSProperties
                  }
                  onClick={() => handleCategoryClick(category.name)}
                  role="button"
                  aria-label={`Browse ${category.name} providers`}
                >
                  <div className="category-image-wrap">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="category-image"
                      loading="lazy"
                    />
                    <div className="category-image-overlay" />
                  </div>

                  <div className="category-content">
                    <h3 className="category-name">{category.name}</h3>
                    <p className="category-description">
                      {category.description}
                    </p>

                    <div className="category-footer">
                      <span className="category-count">
                        <strong>{category.providerCount}</strong> providers
                      </span>
                      <div className="category-arrow">
                        <ArrowRight size={16} strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;
