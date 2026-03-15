// src/pages/CategoriesPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { supabase } from "../lib/supabaseClient";
import SEO from "../components/SEO";

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
  description: string;
  providerCount: number;
  image: string;
};

const DEFAULT_IMAGE =
  "https://via.placeholder.com/800x600?text=Service+Category";

// ── Skeleton ──────────────────────────────────────────────────────────────────
const CategoriesPageSkeleton = ({ count = 8 }: { count?: number }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="cat-sk-card">
        <div className="cat-shimmer cat-sk-img" />
        <div className="cat-sk-body">
          <div className="cat-shimmer" style={{ height: 15, width: "60%" }} />
          <div
            className="cat-shimmer"
            style={{ height: 12, width: "85%", marginTop: 6 }}
          />
          <div
            className="cat-shimmer"
            style={{ height: 12, width: "55%", marginTop: 4 }}
          />
          <div
            className="cat-shimmer"
            style={{ height: 11, width: "30%", marginTop: 10 }}
          />
        </div>
      </div>
    ))}
  </>
);

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<UiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/providers?category=${encodeURIComponent(categoryName)}`);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        // 1. Fetch all active categories
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

        // 2. Fetch active providers — keyed by primary_category (text name)
        //    primary_category_id is nullable/unpopulated for most rows,
        //    so we count by the text name column instead.
        const { data: providerRows, error: providerError } = await supabase
          .from("providers")
          .select("primary_category")
          .eq("status", "active");

        const providerCountByName: Record<string, number> = {};

        if (!providerError && providerRows) {
          for (const row of providerRows as {
            primary_category: string | null;
          }[]) {
            const catName = row.primary_category;
            if (!catName) continue;
            providerCountByName[catName] =
              (providerCountByName[catName] || 0) + 1;
          }
        }

        // 3. Map to UI shape — match category by name
        const uiCats: UiCategory[] = dbCategories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          description: cat.description || "Browse services in this category",
          providerCount: providerCountByName[cat.name] || 0,
          image: cat.icon_url || DEFAULT_IMAGE,
        }));

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
      <SEO
        title="Browse Service Categories"
        description="Explore all service categories on ZimServ — plumbing, electrical, cleaning, landscaping, tutoring and more. Find the right verified professional anywhere in Zimbabwe."
        keywords={[
          "service categories Zimbabwe",
          "plumbers Zimbabwe",
          "electricians Harare",
          "cleaning services",
          "home services Zimbabwe",
          "ZimServ categories",
        ]}
        url="/categories"
      />
      <style>{`
        /* ── SHIMMER ──────────────────────────────────────── */
        @keyframes cat-shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        .cat-shimmer {
          background: linear-gradient(
            90deg,
            var(--color-border) 25%,
            var(--color-bg) 50%,
            var(--color-border) 75%
          );
          background-size: 600px 100%;
          animation: cat-shimmer 1.4s ease-in-out infinite;
          border-radius: 6px;
        }
        .cat-sk-card {
          border-radius: 18px;
          overflow: hidden;
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
        }
        .cat-sk-img {
          width: 100%;
          aspect-ratio: 4 / 3;
          border-radius: 0;
        }
        .cat-sk-body {
          padding: 16px 18px 18px;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* ── PAGE ─────────────────────────────────────────── */
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
          font-size: 25px;
          font-weight: 800;
          color: var(--color-primary);
          margin-bottom: 10px;
          line-height: 1.15;
          letter-spacing: -1px;
          margin-top: -10px;
        }
        .categories-subtitle {
          font-size: 15px;
          color: var(--color-text-secondary);
          line-height: 1.65;
        }

        /* ── GRID ─────────────────────────────────────────── */
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        /* ── CARD ─────────────────────────────────────────── */
        .category-card {
          cursor: pointer;
          border-radius: 18px;
          overflow: hidden;
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          transition:
            transform var(--transition-base),
            box-shadow var(--transition-base),
            border-color var(--transition-base);
          display: flex;
          flex-direction: column;
        }
        .category-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-lg);
          border-color: var(--color-accent-light);
        }
        .category-card:active { transform: translateY(-2px); }

        /* ── IMAGE ────────────────────────────────────────── */
        .category-img-wrap {
          width: 100%;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          position: relative;
          background: var(--color-bg-soft);
          flex-shrink: 0;
        }
        .category-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          transition: transform 0.5s ease;
        }
        .category-card:hover .category-img { transform: scale(1.07); }
        .category-img-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(15,23,42,0.15) 100%);
          opacity: 0;
          transition: opacity var(--transition-base);
          pointer-events: none;
        }
        .category-card:hover .category-img-wrap::after { opacity: 1; }

        /* ── TEXT ─────────────────────────────────────────── */
        .category-text {
          padding: 16px 18px 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .category-name {
          font-family: var(--font-primary);
          font-size: 15px;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 4px;
          letter-spacing: -0.2px;
          line-height: 1.3;
        }
        .category-desc {
          font-size: 12.5px;
          color: var(--color-text-secondary);
          line-height: 1.5;
          font-weight: 400;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* ── FOOTER ───────────────────────────────────────── */
        .category-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
        }
        .category-count {
          font-size: 12px;
          font-weight: 600;
          color: var(--color-text-secondary);
        }
        .category-count strong {
          color: var(--color-accent);
          font-weight: 700;
        }
        .category-explore {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 700;
          color: var(--color-accent);
          transition:
            transform var(--transition-fast),
            color var(--transition-fast);
        }
        .category-card:hover .category-explore { transform: translateX(2px); }
        .category-explore svg { transition: transform var(--transition-fast); }
        .category-card:hover .category-explore svg { transform: translateX(2px); }

        /* ── RESPONSIVE ───────────────────────────────────── */
        @media (max-width: 1280px) {
          .categories-page { padding: 32px 0 72px; }
          .categories-grid { gap: 16px; }
        }
        @media (max-width: 1100px) {
          .categories-container { padding: 0 32px; }
          .categories-title { font-size: 22px; }
        }
        @media (max-width: 900px) {
          .categories-page { padding: 28px 0 60px; }
          .categories-container { padding: 0 24px; }
          .categories-grid { grid-template-columns: repeat(4, 1fr); gap: 14px; }
          .categories-title { font-size: 22px; }
          .categories-subtitle { font-size: 14px; }
          .categories-header { margin-bottom: 28px; }
          .category-text { padding: 12px 14px 14px; }
          .category-name { font-size: 13.5px; }
          .category-desc { font-size: 12px; }
        }
        @media (max-width: 640px) {
          .categories-page { padding: 20px 0 48px; }
          .categories-container { padding: 0 16px; }
          .categories-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .categories-title { font-size: 20px; letter-spacing: -0.5px; }
          .categories-subtitle { font-size: 14px; }
          .categories-header { margin-bottom: 20px; }
          .category-card { border-radius: 14px; }
          .cat-sk-card { border-radius: 14px; }
          .category-text { padding: 12px 12px 14px; }
          .category-name { font-size: 13px; }
          .category-desc { font-size: 11.5px; }
          .category-explore { font-size: 11px; }
          .category-count { font-size: 11px; }
        }
        @media (max-width: 400px) {
          .categories-container { padding: 0 12px; }
          .categories-grid { gap: 10px; }
          .category-name { font-size: 12.5px; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
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
            <div className="categories-grid">
              <CategoriesPageSkeleton count={8} />
            </div>
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
                  onClick={() => handleCategoryClick(category.name)}
                  role="button"
                  aria-label={`Browse ${category.name} providers`}
                >
                  <div className="category-img-wrap">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="category-img"
                      loading="lazy"
                    />
                  </div>

                  <div className="category-text">
                    <h3 className="category-name">{category.name}</h3>
                    <p className="category-desc">{category.description}</p>

                    <div className="category-footer">
                      <span className="category-count">
                        <strong>{category.providerCount}</strong> providers
                      </span>
                      <span className="category-explore">
                        Explore <ArrowRight size={11} strokeWidth={2.5} />
                      </span>
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
