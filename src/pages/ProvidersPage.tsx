// src/pages/ProvidersPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Star,
  MapPin,
  CheckCircle,
  Phone,
  MessageCircle,
  ArrowRight,
  Search as SearchIcon,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { supabase } from "../lib/supabaseClient";

type DbProvider = {
  id: string;
  full_name: string;
  primary_category: string;
  city: string;
  status: string;
  years_experience: number | null;
  avg_rating: number | null;
  total_reviews: number | null;
  profile_image_url: string | null;
  pricing_model: string | null;
};

type DbService = {
  id: string;
  provider_id: string;
  service_name: string;
  price: number | null;
};

type ProviderService = {
  name: string;
  price: number | null;
};

type UiProvider = {
  id: string;
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  city: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  image: string;
  yearsExperience: number;
  pricingLabel: string;
  priceValue: number;
  services: ProviderService[];
  matchedService?: ProviderService | null;
};

type DbCategory = {
  id: string;
  name: string;
  status: string;
};

const CITIES = [
  "All Cities",
  "Harare",
  "Bulawayo",
  "Chitungwiza",
  "Mutare",
  "Gweru",
  "Kwekwe",
  "Kadoma",
  "Masvingo",
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured First" },
  { value: "rating", label: "Highest Rated" },
  { value: "reviews", label: "Most Reviews" },
  { value: "experience", label: "Most Experienced" },
];

const DEFAULT_PROVIDER_IMAGE =
  "https://via.placeholder.com/800x600?text=Service+Provider";

const ProvidersPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All Categories",
  );
  const [selectedCity, setSelectedCity] = useState(
    searchParams.get("city") || "All Cities",
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "featured");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [providers, setProviders] = useState<UiProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<UiProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(["All Categories"]);

  // Load providers + services + categories from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1) Providers
        const { data: providersData, error: providersError } = await supabase
          .from("providers")
          .select(
            "id, full_name, primary_category, city, status, years_experience, avg_rating, total_reviews, profile_image_url, pricing_model",
          )
          .eq("status", "active");

        if (providersError) {
          console.error("Error loading providers:", providersError);
          setProviders([]);
        } else {
          const dbProviders: DbProvider[] = providersData || [];

          // 2) All provider services
          const { data: servicesData, error: servicesError } = await supabase
            .from("provider_services")
            .select("id, provider_id, service_name, price");

          if (servicesError) {
            console.error("Error loading provider services:", servicesError);
          }

          const dbServices: DbService[] = servicesData || [];

          const ui: UiProvider[] = dbProviders.map((p) => {
            const slug = `${p.full_name}-${p.city}`
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "");

            const providerServices: ProviderService[] = dbServices
              .filter((s) => s.provider_id === p.id)
              .map((s) => ({
                name: s.service_name,
                price: s.price,
              }));

            return {
              id: p.id,
              slug,
              name: p.full_name,
              category: p.primary_category,
              tagline: `${p.primary_category} specialist`,
              description: `Experienced ${p.primary_category.toLowerCase()} professional in ${p.city}.`,
              city: p.city,
              rating: p.avg_rating ?? 0,
              reviewCount: p.total_reviews ?? 0,
              verified: true,
              image: p.profile_image_url || DEFAULT_PROVIDER_IMAGE,
              yearsExperience: p.years_experience ?? 0,
              pricingLabel: p.pricing_model || "Quote-based",
              priceValue: p.years_experience ?? 0,
              services: providerServices,
              matchedService: null,
            };
          });

          setProviders(ui);
        }

        // 3) Categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("id,name,status")
          .eq("status", "Active")
          .order("display_order", { ascending: true });

        if (categoriesError) {
          console.error("Error loading categories:", categoriesError);
        } else {
          const dbCategories: DbCategory[] = categoriesData || [];
          const catNames = dbCategories.map((c) => c.name);
          setCategories(["All Categories", ...catNames]);
        }
      } catch (err) {
        console.error("Unexpected error loading providers/categories:", err);
        setProviders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters & sorting + sync URL
  useEffect(() => {
    // clone and reset dynamic fields
    let results: UiProvider[] = providers.map((p) => ({
      ...p,
      matchedService: undefined,
      tagline: `${p.category} specialist`,
    }));

    const qRaw = searchQuery.trim();
    const hasSearch = qRaw.length > 0;
    const q = qRaw.toLowerCase();

    if (hasSearch) {
      results = results
        .map((p) => {
          let best: ProviderService | null = null;

          if (p.services && p.services.length > 0) {
            for (const s of p.services) {
              const name = s.name.toLowerCase();
              if (name === q) {
                best = s;
                break;
              } else if (!best && name.includes(q)) {
                best = s;
              }
            }
          }

          const providerMatchesText =
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.city.toLowerCase().includes(q);

          const matchesByService = !!best;

          if (!matchesByService && !providerMatchesText) {
            return { ...p, _exclude: true as const };
          }

          if (best) {
            return {
              ...p,
              matchedService: best,
              tagline:
                best.price != null
                  ? `${best.name} • $${best.price.toFixed(2)}`
                  : best.name,
            };
          }

          return {
            ...p,
            matchedService: null,
            tagline: `${p.category} specialist`,
          };
        })
        .filter((p: any) => !p._exclude);
    }

    if (selectedCategory !== "All Categories") {
      results = results.filter((p) => p.category === selectedCategory);
    }

    if (selectedCity !== "All Cities") {
      results = results.filter((p) => p.city === selectedCity);
    }

    results.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "reviews":
          return b.reviewCount - a.reviewCount;
        case "experience":
          return b.yearsExperience - a.yearsExperience;
        case "featured":
        default:
          return 0;
      }
    });

    setFilteredProviders(results);

    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategory !== "All Categories")
      params.set("category", selectedCategory);
    if (selectedCity !== "All Cities") params.set("city", selectedCity);
    if (sortBy !== "featured") params.set("sort", sortBy);
    setSearchParams(params);
  }, [
    providers,
    searchQuery,
    selectedCategory,
    selectedCity,
    sortBy,
    setSearchParams,
  ]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
    setSelectedCity("All Cities");
    setSortBy("featured");
  };

  const activeFilterCount =
    (searchQuery ? 1 : 0) +
    (selectedCategory !== "All Categories" ? 1 : 0) +
    (selectedCity !== "All Cities" ? 1 : 0);

  // Breadcrumb
  const breadcrumbItems: { label: string; path?: string }[] = [];
  if (searchQuery.trim()) {
    breadcrumbItems.push({ label: `Search: "${searchQuery}"` });
  }
  if (selectedCity !== "All Cities") {
    breadcrumbItems.push({ label: selectedCity });
  }
  if (selectedCategory !== "All Categories") {
    breadcrumbItems.push({ label: selectedCategory });
  }
  if (breadcrumbItems.length === 0) {
    breadcrumbItems.push({ label: "All Providers" });
  }

  const handleViewProfile = (slug: string) => {
    navigate(`/providers/${slug}`);
  };

  return (
    <>
      <style>{`
        .providers-page {
          width: 100%;
          min-height: 100vh;
          background: var(--color-bg-section);
          padding: 40px 0 80px;
          font-family: var(--font-primary);
        }
        .providers-container {
          max-width: var(--container-max-width);
          margin: 0 auto;
          padding: 0 var(--container-padding);
        }
        .providers-header {
          margin-bottom: 20px;
        }
        .providers-title {
          font-family: var(--font-primary);
          font-size: 25px;
          font-weight: 800;
          color: var(--color-primary);
          margin-bottom: 10px;
          line-height: 1.15;
          letter-spacing: -1.2px;
        }
        .providers-subtitle {
          font-size: 16px;
          font-weight: 500;
          color: var(--color-text-secondary);
        }

        .search-section {
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: var(--shadow-sm);
        }
        .search-main-row {
          display: grid;
          grid-template-columns: 1fr auto auto auto;
          gap: 12px;
          margin-bottom: 16px;
        }
        .search-input-wrapper {
          position: relative;
        }
        .search-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-secondary);
          pointer-events: none;
        }
        .search-input {
          width: 100%;
          padding: 14px 18px 14px 50px;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-md);
          font-family: var(--font-primary);
          font-size: 15px;
          font-weight: 500;
          color: var(--color-primary);
          background: var(--color-bg);
          transition: all var(--transition-fast);
        }
        .search-input:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px var(--color-accent-soft);
        }
        .search-input::placeholder {
          color: var(--color-text-secondary);
        }

        .inline-select {
          padding: 14px 38px 14px 16px;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-md);
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 600;
          color: var(--color-primary);
          background: var(--color-bg);
          cursor: pointer;
          transition: all var(--transition-fast);
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          min-width: 140px;
        }
        .inline-select:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px var(--color-accent-soft);
        }

        .filter-toggle-btn {
          padding: 14px 20px;
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-md);
          color: var(--color-text-secondary);
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all var(--transition-fast);
          white-space: nowrap;
          position: relative;
        }
        .filter-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          width: 20px;
          height: 20px;
          background: var(--color-accent);
          color: #fff;
          border-radius: 50%;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--color-bg);
        }
        .filter-toggle-btn:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
          background: var(--color-accent-soft);
        }
        .filter-toggle-btn.active {
          background: var(--color-accent);
          color: #fff;
          border-color: var(--color-accent);
        }

        .quick-categories {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 8px;
        }
        .quick-cat-pill {
          padding: 8px 16px;
          background: var(--color-bg-section);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-full);
          font-size: 13px;
          font-weight: 600;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .quick-cat-pill:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
          background: var(--color-accent-soft);
        }
        .quick-cat-pill.active {
          background: var(--color-accent);
          color: #fff;
          border-color: var(--color-accent);
        }

        .advanced-filters {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: all 0.3s ease;
          margin-top: 0;
        }
        .advanced-filters.visible {
          max-height: 200px;
          opacity: 1;
          margin-top: 16px;
        }
        .advanced-filters-content {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .clear-filters-btn {
          padding: 10px 20px;
          background: transparent;
          border: 1.5px solid #EF4444;
          border-radius: var(--radius-md);
          color: #EF4444;
          font-family: var(--font-primary);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all var(--transition-fast);
          white-space: nowrap;
        }
        .clear-filters-btn:hover {
          background: #EF4444;
          color: #fff;
        }

        .results-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          gap: 16px;
        }
        .results-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .results-count {
          font-size: 15px;
          color: var(--color-text-secondary);
          font-weight: 500;
        }
        .results-count strong {
          color: var(--color-accent);
          font-weight: 700;
        }
        .sort-dropdown {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .sort-label {
          font-size: 14px;
          color: var(--color-text-secondary);
          font-weight: 500;
        }
        .sort-select {
          padding: 8px 32px 8px 12px;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-md);
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 600;
          color: var(--color-primary);
          background: var(--color-bg);
          cursor: pointer;
          transition: all var(--transition-fast);
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 8px center;
        }
        .sort-select:focus {
          outline: none;
          border-color: var(--color-accent);
        }

        /* GRID & CARD LAYOUT */

        .providers-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr); /* 3 per row on desktop */
          gap: 16px;
          margin-bottom: 48px;
        }

        .provider-card {
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: transform var(--transition-base), border-color var(--transition-base), box-shadow var(--transition-base);
          display: flex;
          flex-direction: column; /* mobile-style stacked layout */
          position: relative;
        }
        .provider-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--color-accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        .provider-card:hover::before {
          transform: scaleX(1);
        }
        .provider-card:hover {
          transform: translateY(-6px);
          border-color: var(--color-accent);
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
        }

        .provider-img-wrap {
          width: 100%;
          height: 200px;
          position: relative;
          overflow: hidden;
          background: var(--color-bg-soft);
          flex-shrink: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .provider-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }
        .provider-card:hover .provider-img {
          transform: scale(1.06);
        }

        .verified-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--color-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #fff;
          box-shadow: 0 2px 12px rgba(37, 99, 235, 0.4);
          z-index: 2;
          pointer-events: none;
        }

        .provider-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
       .provider-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 5px;
          min-height: 40px; /* force same header height with or without price */
        }
        .provider-name {
          font-family: var(--font-primary);
          font-size: 18px;
          font-weight: 700;
          color: var(--color-primary);
          line-height: 1.3;
          letter-spacing: -0.3px;
          cursor: pointer;
          transition: color var(--transition-fast);
          flex: 1;
        }
        .provider-name:hover {
          color: var(--color-accent);
        }

        .provider-price {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          flex-shrink: 0;
        }
        .provider-price-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          line-height: 1;
        }
       .provider-price-amount {
          font-size: 20px;
          font-weight: 800;
          color: var(--color-accent);
          letter-spacing: -0.5px;
          line-height: 1.1;
          margin-top: 2px;
        }

        .provider-tagline {
          font-size: 13px;
          color: var(--color-text-secondary);
          margin-bottom: 12px;
          line-height: 1.4;
        }
        .provider-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }
        .provider-rating {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
          font-weight: 600;
          color: var(--color-primary);
        }
        .provider-rating-count {
          font-size: 12px;
          font-weight: 400;
          color: var(--color-text-secondary);
        }
        .provider-location {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          color: var(--color-text-secondary);
        }
        .category-badge {
          padding: 4px 10px;
          background: var(--color-accent-soft);
          color: var(--color-accent);
          border-radius: var(--radius-full);
          font-size: 11px;
          font-weight: 700;
        }

        .provider-actions {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          gap: 11px;
          margin-top: auto;
        }
        .provider-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 10px 14px;
          border: none;
          border-radius: var(--radius-md);
          font-family: var(--font-primary);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: background var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast);
          white-space: nowrap;
          flex: 1 1 0;
          margin-left: -5px;
        }
        .provider-btn-primary {
          background: var(--color-accent);
          color: #fff;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
        }
        .provider-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
        .provider-btn-secondary {
          background: var(--color-bg-section);
          color: var(--color-accent);
          border: 1.5px solid var(--color-accent-light);
        }
        .provider-btn-profile {
          background: transparent;
          color: var(--color-text-secondary);
          border: 1.5px solid var(--color-border);
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          border: 1.5px dashed var(--color-border);
        }
        .empty-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          background: var(--color-bg-section);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-secondary);
        }
        .empty-title {
          font-family: var(--font-primary);
          font-size: 22px;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 8px;
        }
        .empty-text {
          font-size: 15px;
          color: var(--color-text-secondary);
          margin-bottom: 20px;
        }

        @media (max-width: 1200px) {
          .providers-container { padding: 0 32px; }
          .providers-grid {
            grid-template-columns: repeat(2, 1fr); /* 2 per row on medium */
            gap: 20px;
          }
        }

        @media (max-width: 1024px) {
          .providers-grid { grid-template-columns: 1fr; }
          .provider-card {
            flex-direction: column;
          }
          .provider-img-wrap {
            width: 100%;
            height: 220px;
          }
          .provider-actions {
            flex-wrap: wrap;
          }
          .provider-btn {
            flex: 1 1 auto;
          }
        }

        @media (max-width: 900px) {
          .providers-page { padding: 32px 0 60px; }
          .providers-container { padding: 0 24px; }
          .providers-title { font-size: 36px; }
          .search-main-row { grid-template-columns: 1fr; }
          .inline-select { width: 100%; }
          .results-bar {
            flex-direction: column;
            align-items: flex-start;
          }
          .results-left {
            width: 100%;
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .sort-dropdown { width: 100%; }
          .sort-select { flex: 1; }
        }

        @media (max-width: 640px) {
          .providers-page { padding: 24px 0 48px; }
          .providers-container { padding: 0 16px; }
          .providers-title { font-size: 23px; letter-spacing: -0.8px; }
          .providers-subtitle { font-size: 13px; }
          .providers-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <Breadcrumb items={breadcrumbItems} />

      <div className="providers-page">
        <div className="providers-container">
          <div className="providers-header">
            <h1 className="providers-title">Find Service Providers</h1>
            <p className="providers-subtitle">
              Browse verified professionals across Zimbabwe
            </p>
          </div>

          <div className="search-section">
            <div className="search-main-row">
              <div className="search-input-wrapper">
                <SearchIcon size={20} className="search-icon" strokeWidth={2} />
                <input
                  type="text"
                  placeholder="Search by name, service, or category..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className="inline-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                className="inline-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              <button
                className={`filter-toggle-btn ${showAdvancedFilters ? "active" : ""}`}
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <SlidersHorizontal size={18} strokeWidth={2} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="filter-badge">{activeFilterCount}</span>
                )}
              </button>
            </div>

            {/* Quick category pills under search bar */}
            <div className="quick-categories">
              {categories
                .filter((cat) => cat !== "All Categories")
                .map((cat) => (
                  <button
                    key={cat}
                    className={`quick-cat-pill ${
                      selectedCategory === cat ? "active" : ""
                    }`}
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === cat ? "All Categories" : cat,
                      )
                    }
                  >
                    {cat}
                  </button>
                ))}
            </div>

            <div
              className={`advanced-filters ${
                showAdvancedFilters ? "visible" : ""
              }`}
            >
              <div className="advanced-filters-content">
                <span
                  style={{
                    fontSize: 14,
                    color: "var(--color-text-secondary)",
                    fontWeight: 500,
                  }}
                >
                  More filters coming soon...
                </span>

                {activeFilterCount > 0 && (
                  <button className="clear-filters-btn" onClick={clearFilters}>
                    <X size={16} strokeWidth={2.5} />
                    Clear All
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="results-bar">
            <div className="results-left">
              <p className="results-count">
                Found <strong>{filteredProviders.length}</strong> provider
                {filteredProviders.length !== 1 ? "s" : ""}
                {selectedCity !== "All Cities" ? ` in ${selectedCity}` : ""}
              </p>

              <div className="sort-dropdown">
                <span className="sort-label">Sort by</span>
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: 14,
              }}
            >
              Loading providers...
            </p>
          ) : filteredProviders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <SearchIcon size={40} strokeWidth={2} />
              </div>
              <h3 className="empty-title">No providers found</h3>
              <p className="empty-text">
                Try adjusting your search or filters to find what you’re looking
                for.
              </p>
              {activeFilterCount > 0 && (
                <button
                  className="clear-filters-btn"
                  onClick={clearFilters}
                  style={{ margin: "0 auto" }}
                >
                  <X size={16} strokeWidth={2.5} />
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="providers-grid">
              {filteredProviders.map((provider) => (
                <div key={provider.id} className="provider-card">
                  <div
                    className="provider-img-wrap"
                    onClick={() => handleViewProfile(provider.slug)}
                  >
                    <img
                      src={provider.image}
                      alt={provider.name}
                      className="provider-img"
                      loading="lazy"
                    />
                    {provider.verified && (
                      <div className="verified-badge">
                        <CheckCircle size={16} strokeWidth={2.5} color="#fff" />
                      </div>
                    )}
                  </div>

                  <div className="provider-content">
                    {/* Header row: name on left, price on right */}
                    <div className="provider-header-row">
                      <h3
                        className="provider-name"
                        onClick={() => handleViewProfile(provider.slug)}
                      >
                        {provider.name}
                      </h3>

                      {provider.matchedService &&
                        provider.matchedService.price != null && (
                          <div className="provider-price">
                            <span className="provider-price-label">From</span>
                            <span className="provider-price-amount">
                              $
                              {Number.isInteger(provider.matchedService.price)
                                ? provider.matchedService.price
                                : provider.matchedService.price.toFixed(2)}
                            </span>
                          </div>
                        )}
                    </div>

                    {/* Single service line directly below the name */}
                    <p className="provider-tagline">
                      {provider.matchedService
                        ? provider.matchedService.name
                        : `${provider.category} specialist`}
                    </p>

                    <div className="provider-meta">
                      <div className="provider-rating">
                        <Star size={16} fill="#F59E0B" strokeWidth={0} />
                        <span>{provider.rating.toFixed(1)}</span>
                        <span className="provider-rating-count">
                          ({provider.reviewCount})
                        </span>
                      </div>

                      <div className="provider-location">
                        <MapPin size={14} strokeWidth={2} />
                        <span>{provider.city}</span>
                      </div>

                      <span className="category-badge">
                        {provider.category}
                      </span>
                    </div>

                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--color-text-secondary)",
                        marginBottom: 14,
                        lineHeight: 1.5,
                      }}
                    >
                      {provider.description}
                    </p>

                    <div className="provider-actions">
                      <button
                        className="provider-btn provider-btn-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open("https://wa.me/263000000000", "_blank");
                        }}
                      >
                        <MessageCircle size={14} strokeWidth={2.5} />
                        Whatsapp
                      </button>

                      <button
                        className="provider-btn provider-btn-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = "tel:+263000000000";
                        }}
                      >
                        <Phone size={14} strokeWidth={2.5} />
                        Call
                      </button>

                      <button
                        className="provider-btn provider-btn-profile"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewProfile(provider.slug);
                        }}
                      >
                        View Profile
                        <ArrowRight size={14} strokeWidth={2.5} />
                      </button>
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

export default ProvidersPage;
