// src/components/Home/CategorySection.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { supabase } from "../../lib/supabaseClient";

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
  image: string;
};

const DEFAULT_IMAGE =
  "https://via.placeholder.com/800x600?text=Service+Category";

const CategorySection = () => {
  const navigate = useNavigate();
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { elementRef: gridRef, isVisible: gridVisible } = useScrollReveal({
    threshold: 0.05,
  });

  const [categories, setCategories] = useState<UiCategory[]>([]);
  const [loading, setLoading] = useState(true);

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
          console.error("Error loading home categories:", error);
          setCategories([]);
          return;
        }

        const dbCategories: DbCategory[] = data || [];

        const uiCats: UiCategory[] = dbCategories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          description: cat.description || "Browse services in this category",
          image: cat.icon_url || DEFAULT_IMAGE,
        }));

        // only first 8
        setCategories(uiCats.slice(0, 8));
      } catch (err) {
        console.error("Unexpected error loading home categories:", err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // click should behave like CategoriesPage (filter ProvidersPage by category name)
  const handleCategoryClick = (categoryName: string) => {
    navigate(`/providers?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <>
      <style>{`
        /* ── SECTION ──────────────────────────────────────── */
        .cat-section {
          width: 100%;
          background: var(--color-bg-section);
          padding: 88px 0;
          font-family: var(--font-primary);
          position: relative;
        }

        .cat-section::before,
        .cat-section::after {
          content: '';
          position: absolute;
          left: 0; right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            var(--color-border) 20%,
            var(--color-border) 80%,
            transparent
          );
        }
        .cat-section::before { top: 0; }
        .cat-section::after  { bottom: 0; }

        .cat-container {
          max-width: var(--container-max-width);
          margin: 0 auto;
          padding: 0 var(--container-padding);
        }

        /* ── HEADER ───────────────────────────────────────── */
        .cat-header {
          text-align: center;
          margin-bottom: 52px;
        }

        .cat-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: var(--color-accent-soft);
          color: var(--color-accent);
          padding: 5px 14px;
          border-radius: var(--radius-full);
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .cat-title {
          font-family: var(--font-primary);
          font-size: 40px;
          font-weight: 800;
          color: var(--color-primary);
          margin-bottom: 12px;
          line-height: 1.15;
          letter-spacing: -1px;
        }

        .cat-subtitle {
          font-size: 16px;
          color: var(--color-text-secondary);
          max-width: 520px;
          margin: 0 auto;
          line-height: 1.65;
        }

        /* ── GRID ─────────────────────────────────────────── */
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 48px;
        }

        /* ── CARD ─────────────────────────────────────────── */
        .cat-card {
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

        .cat-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-lg);
          border-color: var(--color-accent-light);
        }

        .cat-card:active {
          transform: translateY(-2px);
        }

        /* ── IMAGE AREA ───────────────────────────────────── */
        .cat-img-wrap {
          width: 100%;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          position: relative;
          background: var(--color-bg-soft);
          flex-shrink: 0;
        }

        .cat-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          transition: transform 0.5s ease;
        }

        .cat-card:hover .cat-img {
          transform: scale(1.07);
        }

        /* subtle overlay on hover for depth */
        .cat-img-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            transparent 40%,
            rgba(15, 23, 42, 0.15) 100%
          );
          opacity: 0;
          transition: opacity var(--transition-base);
          pointer-events: none;
        }

        .cat-card:hover .cat-img-wrap::after {
          opacity: 1;
        }

        /* ── TEXT AREA ────────────────────────────────────── */
        .cat-text {
          padding: 16px 18px 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .cat-name {
          font-family: var(--font-primary);
          font-size: 15px;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 4px;
          letter-spacing: -0.2px;
          line-height: 1.3;
        }

        .cat-desc {
          font-size: 12.5px;
          color: var(--color-text-secondary);
          line-height: 1.5;
          font-weight: 400;
          flex: 1;
        }

        /* "Explore →" row - ALWAYS VISIBLE */
        .cat-explore {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 10px;
          font-size: 12px;
          font-weight: 700;
          color: var(--color-accent);
          opacity: 1;
          transform: translateY(0);
          transition:
            transform var(--transition-fast),
            color var(--transition-fast);
        }

        .cat-card:hover .cat-explore {
          transform: translateX(2px);
        }

        .cat-explore svg {
          transition: transform var(--transition-fast);
        }

        .cat-card:hover .cat-explore svg {
          transform: translateX(2px);
        }

        /* ── FOOTER ───────────────────────────────────────── */
        .cat-footer {
          text-align: center;
        }

        .cat-view-all {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 32px;
          background: transparent;
          border: 1.5px solid var(--color-accent);
          border-radius: var(--radius-full);
          color: var(--color-accent);
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.2px;
          position: relative;
          overflow: hidden;
          transition:
            background var(--transition-fast),
            color var(--transition-fast),
            transform var(--transition-fast),
            box-shadow var(--transition-fast);
        }

        .cat-view-all::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }

        .cat-view-all:hover::after { left: 100%; }

        .cat-view-all:hover {
          background: var(--color-accent);
          color: #fff;
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .cat-view-all:active { transform: scale(0.98); }

        .cat-view-all svg {
          transition: transform var(--transition-fast);
        }
        .cat-view-all:hover svg {
          transform: translateX(3px);
        }

        /* ── RESPONSIVE ───────────────────────────────────── */

        /* 4 columns — comfortable on large screens */
        @media (max-width: 1280px) {
          .cat-section { padding: 72px 0; }
          .cat-grid    { gap: 16px; }
        }

        /* 4 → 4, just tighter padding */
        @media (max-width: 1100px) {
          .cat-container { padding: 0 32px; }
          .cat-title     { font-size: 36px; }
        }

        /* tablet: drop to 4 narrow, or 2x4 rows */
        @media (max-width: 900px) {
          .cat-section   { padding: 60px 0; }
          .cat-container { padding: 0 24px; }
          .cat-grid      { grid-template-columns: repeat(4, 1fr); gap: 14px; }
          .cat-title     { font-size: 32px; }
          .cat-subtitle  { font-size: 15px; }
          .cat-header    { margin-bottom: 36px; }
          .cat-text      { padding: 12px 14px 14px; }
          .cat-name      { font-size: 13.5px; }
          .cat-desc      { font-size: 12px; }
        }

        /* mobile: strictly 2 per row */
        @media (max-width: 640px) {
          .cat-section   { padding: 48px 0; }
          .cat-container { padding: 0 16px; }
          .cat-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 36px;
          }
          .cat-title    { font-size: 26px; letter-spacing: -0.5px; }
          .cat-subtitle { font-size: 14px; }
          .cat-header   { margin-bottom: 28px; }

          .cat-card     { border-radius: 14px; }
          .cat-text     { padding: 12px 12px 14px; }
          .cat-name     { font-size: 13px; }
          .cat-desc     { font-size: 11.5px; }
          .cat-explore  { font-size: 11px; margin-top: 8px; }
        }

        @media (max-width: 400px) {
          .cat-container { padding: 0 12px; }
          .cat-grid      { gap: 10px; }
          .cat-name      { font-size: 12.5px; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <section className="cat-section">
        <div className="cat-container">
          {/* Header */}
          <div
            ref={headerRef as any}
            className={`cat-header scroll-reveal ${
              headerVisible ? "visible" : ""
            }`}
          >
            <div className="cat-eyebrow">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              Popular Services
            </div>
            <h2 className="cat-title">Browse Categories</h2>
            <p className="cat-subtitle">
              Find trusted professionals for any service you need across
              Zimbabwe
            </p>
          </div>

          {/* Grid */}
          <div ref={gridRef as any} className="cat-grid">
            {loading
              ? null
              : categories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`cat-card scroll-reveal-stagger ${
                      gridVisible ? "visible" : ""
                    }`}
                    onClick={() => handleCategoryClick(cat.name)}
                    role="button"
                    aria-label={`Browse ${cat.name} services`}
                  >
                    <div className="cat-img-wrap">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="cat-img"
                        loading="lazy"
                      />
                    </div>

                    <div className="cat-text">
                      <h3 className="cat-name">{cat.name}</h3>
                      <p className="cat-desc">{cat.description}</p>
                      <span className="cat-explore">
                        Explore <ArrowRight size={11} strokeWidth={2.5} />
                      </span>
                    </div>
                  </div>
                ))}
          </div>

          {/* Footer */}
          <div className="cat-footer">
            <button
              className="cat-view-all btn-magnetic"
              onClick={() => navigate("/categories")}
            >
              View All Categories
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default CategorySection;
