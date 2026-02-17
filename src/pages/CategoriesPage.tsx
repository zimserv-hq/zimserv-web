// src/pages/CategoriesPage.tsx
import { useNavigate } from "react-router-dom";
import {
  Wrench,
  Zap,
  Sparkles,
  Car,
  Paintbrush,
  Hammer,
  Wind,
  Laptop,
  Package,
  Leaf,
  Home,
  Shirt,
  ArrowRight,
} from "lucide-react";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";

const CATEGORIES = [
  {
    id: "plumbing",
    name: "Plumbing",
    slug: "plumbing",
    icon: Wrench,
    description: "Geysers, blocked drains, pipe installations, repairs",
    providerCount: 45,
    color: "#3B82F6", // blue
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "electrical",
    name: "Electrical",
    slug: "electrical",
    icon: Zap,
    description: "Wiring, repairs, solar installations, fault-finding",
    providerCount: 38,
    color: "#F59E0B", // amber
    image:
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "cleaning",
    name: "Cleaning",
    slug: "cleaning",
    icon: Sparkles,
    description: "Home cleaning, office cleaning, deep cleaning",
    providerCount: 52,
    color: "#10B981", // green
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "automotive",
    name: "Automotive",
    slug: "automotive",
    icon: Car,
    description: "Mechanics, panel beaters, car wash, mobile services",
    providerCount: 34,
    color: "#EF4444", // red
    image:
      "https://images.unsplash.com/photo-1632823469770-0fbd80a4c4c0?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "painting",
    name: "Painting",
    slug: "painting",
    icon: Paintbrush,
    description: "Interior painting, exterior painting, spray painting",
    providerCount: 29,
    color: "#8B5CF6", // purple
    image:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "carpentry",
    name: "Carpentry",
    slug: "carpentry",
    icon: Hammer,
    description: "Custom furniture, kitchen cabinets, woodwork",
    providerCount: 27,
    color: "#D97706", // orange
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "hvac",
    name: "HVAC",
    slug: "hvac",
    icon: Wind,
    description: "Air conditioning, heating, ventilation services",
    providerCount: 18,
    color: "#06B6D4", // cyan
    image:
      "https://images.unsplash.com/photo-1581092160607-ee67d9f1e3c6?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "it-tech",
    name: "IT & Tech",
    slug: "it-tech",
    icon: Laptop,
    description: "Computer repairs, networking, software support",
    providerCount: 31,
    color: "#6366F1", // indigo
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "moving",
    name: "Moving",
    slug: "moving",
    icon: Package,
    description: "Residential moving, office relocation, packing",
    providerCount: 22,
    color: "#EC4899", // pink
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "gardening",
    name: "Gardening",
    slug: "gardening",
    icon: Leaf,
    description: "Lawn care, landscaping, garden maintenance",
    providerCount: 25,
    color: "#22C55E", // green
    image:
      "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "renovation",
    name: "Renovation",
    slug: "renovation",
    icon: Home,
    description: "Home renovation, remodeling, construction",
    providerCount: 19,
    color: "#F97316", // orange
    image:
      "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "laundry",
    name: "Laundry",
    slug: "laundry",
    icon: Shirt,
    description: "Dry cleaning, wash & fold, ironing services",
    providerCount: 16,
    color: "#14B8A6", // teal
    image:
      "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&h=600&fit=crop&q=80",
  },
];

const CategoriesPage = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (slug: string) => {
    navigate(`/providers?category=${slug}`);
  };

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

        /* ── HEADER ───────────────────────────────────────── */
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

        /* ── GRID ─────────────────────────────────────────── */
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

        /* Top accent bar */
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

        /* Image */
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

        /* Overlay gradient */
        .category-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%);
        }

        /* Content */
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

        /* ── RESPONSIVE ───────────────────────────────────── */
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

      {/* Breadcrumb - OUTSIDE .categories-page */}
      <Breadcrumb items={[{ label: "Categories" }]} />

      <div className="categories-page">
        <div className="categories-container">
          {/* Header - Matching ProvidersPage Style */}
          <div className="categories-header">
            <h1 className="categories-title">Browse Service Categories</h1>
            <p className="categories-subtitle">
              Find the perfect professional for any job across Zimbabwe
            </p>
          </div>

          {/* Categories Grid */}
          <div className="categories-grid">
            {CATEGORIES.map((category) => {
              return (
                <div
                  key={category.id}
                  className="category-card"
                  style={
                    { "--accent-color": category.color } as React.CSSProperties
                  }
                  onClick={() => handleCategoryClick(category.slug)}
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
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;
