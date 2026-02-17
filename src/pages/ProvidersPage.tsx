// src/pages/ProvidersPage.tsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Star,
  MapPin,
  CheckCircle,
  Phone,
  MessageCircle,
  ArrowRight,
  Search,
  SlidersHorizontal,
  X,
  Grid3x3,
  List,
} from "lucide-react";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";

// Mock data
const ALL_PROVIDERS = [
  {
    id: "abc-plumbing",
    slug: "abc-plumbing-harare",
    name: "ABC Plumbing Services",
    category: "Plumbing",
    tagline: "24/7 Emergency Plumbing Experts",
    description:
      "Professional plumbing services with over 8 years of experience. Specializing in emergency repairs, installations, and maintenance for residential and commercial properties.",
    city: "Harare",
    areas: ["Borrowdale", "Mount Pleasant", "Avondale"],
    rating: 4.9,
    reviewCount: 127,
    verified: true,
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=400&fit=crop&q=80",
    yearsExperience: 8,
    pricing: "$25",
    priceValue: 25,
    featured: true,
  },
  {
    id: "elite-electrical",
    slug: "elite-electrical-bulawayo",
    name: "Elite Electrical Solutions",
    category: "Electrical",
    tagline: "Certified & Insured Electricians",
    description:
      "Licensed electricians providing safe and reliable electrical services. From wiring to complete electrical installations, we ensure quality workmanship.",
    city: "Bulawayo",
    areas: ["Suburbs", "Hillside", "North End"],
    rating: 5.0,
    reviewCount: 94,
    verified: true,
    image:
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&h=400&fit=crop&q=80",
    yearsExperience: 12,
    pricing: "$30",
    priceValue: 30,
    featured: true,
  },
  {
    id: "sparkle-cleaning",
    slug: "sparkle-cleaning-harare",
    name: "Sparkle Cleaning Co.",
    category: "Cleaning",
    tagline: "Professional Home & Office Cleaning",
    description:
      "Eco-friendly cleaning services for homes and offices. We use safe, effective products to deliver sparkling results every time.",
    city: "Harare",
    areas: ["CBD", "Eastlea", "Glen Lorne"],
    rating: 4.8,
    reviewCount: 203,
    verified: true,
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop&q=80",
    yearsExperience: 5,
    pricing: "$20",
    priceValue: 20,
    featured: false,
  },
  {
    id: "techfix-it",
    slug: "techfix-it-solutions-harare",
    name: "TechFix IT Solutions",
    category: "IT & Tech",
    tagline: "Expert Computer Repair & Networking",
    description:
      "Complete IT support for businesses and individuals. From hardware repairs to network setup, we keep your technology running smoothly.",
    city: "Harare",
    areas: ["Newlands", "Highlands", "Greendale"],
    rating: 4.9,
    reviewCount: 156,
    verified: true,
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop&q=80",
    yearsExperience: 10,
    pricing: "$35",
    priceValue: 35,
    featured: false,
  },
  {
    id: "premier-painting",
    slug: "premier-painting-services",
    name: "Premier Painting Services",
    category: "Painting",
    tagline: "Quality Interior & Exterior Painting",
    description:
      "Transform your space with professional painting services. We deliver flawless finishes for both residential and commercial projects.",
    city: "Harare",
    areas: ["Borrowdale", "Westgate", "Marlborough"],
    rating: 4.7,
    reviewCount: 89,
    verified: true,
    image:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop&q=80",
    yearsExperience: 6,
    pricing: "$150",
    priceValue: 150,
    featured: false,
  },
  {
    id: "royal-carpentry",
    slug: "royal-carpentry-works",
    name: "Royal Carpentry Works",
    category: "Carpentry",
    tagline: "Custom Furniture & Woodwork",
    description:
      "Skilled craftsmen creating beautiful custom furniture and woodwork. Quality materials and attention to detail in every project.",
    city: "Bulawayo",
    areas: ["Suburbs", "Burnside", "Hillside"],
    rating: 4.9,
    reviewCount: 76,
    verified: true,
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=400&fit=crop&q=80",
    yearsExperience: 15,
    pricing: "$50",
    priceValue: 50,
    featured: false,
  },
];

const QUICK_CATEGORIES = [
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Painting",
  "Carpentry",
  "IT & Tech",
  "Automotive",
  "Moving",
];

const ALL_CATEGORIES = [
  "All Categories",
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Automotive",
  "Painting",
  "Carpentry",
  "HVAC",
  "IT & Tech",
  "Moving",
  "Gardening",
  "Renovation",
  "Laundry",
];

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
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
];

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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filteredProviders, setFilteredProviders] = useState(ALL_PROVIDERS);

  // Build breadcrumb items dynamically
  const breadcrumbItems = [];

  if (searchQuery.trim()) {
    breadcrumbItems.push({
      label: `Search: "${searchQuery}"`,
    });
  }

  if (selectedCity !== "All Cities") {
    const path =
      searchQuery && !breadcrumbItems.length
        ? `/providers?q=${searchQuery}&city=${selectedCity}`
        : `/providers?city=${selectedCity}`;

    breadcrumbItems.push({
      label: selectedCity,
      path,
    });
  }

  if (selectedCategory !== "All Categories") {
    let path = `/providers?category=${selectedCategory}`;

    if (searchQuery && selectedCity === "All Cities") {
      path = `/providers?q=${searchQuery}&category=${selectedCategory}`;
    } else if (selectedCity !== "All Cities") {
      path = `/providers?city=${selectedCity}&category=${selectedCategory}`;
      if (searchQuery) {
        path = `/providers?q=${searchQuery}&city=${selectedCity}&category=${selectedCategory}`;
      }
    }

    breadcrumbItems.push({
      label: selectedCategory,
      path,
    });
  }

  if (breadcrumbItems.length === 0) {
    breadcrumbItems.push({ label: "All Providers" });
  }

  // Apply filters and sorting
  useEffect(() => {
    let results = [...ALL_PROVIDERS];

    // Search filter
    if (searchQuery.trim()) {
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Category filter
    if (selectedCategory !== "All Categories") {
      results = results.filter((p) => p.category === selectedCategory);
    }

    // City filter
    if (selectedCity !== "All Cities") {
      results = results.filter((p) => p.city === selectedCity);
    }

    // Sorting
    results.sort((a, b) => {
      switch (sortBy) {
        case "featured":
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        case "rating":
          return b.rating - a.rating;
        case "reviews":
          return b.reviewCount - a.reviewCount;
        case "price-low":
          return a.priceValue - b.priceValue;
        case "price-high":
          return b.priceValue - a.priceValue;
        case "newest":
          return b.yearsExperience - a.yearsExperience;
        default:
          return 0;
      }
    });

    setFilteredProviders(results);

    // Update URL
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategory !== "All Categories")
      params.set("category", selectedCategory);
    if (selectedCity !== "All Cities") params.set("city", selectedCity);
    if (sortBy !== "featured") params.set("sort", sortBy);
    setSearchParams(params);
  }, [searchQuery, selectedCategory, selectedCity, sortBy, setSearchParams]);

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

        /* ── HEADER ───────────────────────────────────────── */
        .providers-header {
          margin-bottom: 32px;
        }

        .providers-title {
          font-family: var(--font-primary);
          font-size: 35px;
          font-weight: 800;
          color: var(--color-primary);
          margin-bottom: 10px;
          line-height: 1.15;
          letter-spacing: -1.2px;
        }

        .providers-subtitle {
          font-size: 18px;
          font-weight: 500;
          color: var(--color-text-secondary);
        }

        /* ── SEARCH BAR ───────────────────────────────────── */
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

        /* Quick category pills */
        .quick-categories {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
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

        /* Advanced filters */
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

        /* ── RESULTS BAR ──────────────────────────────────── */
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

        .view-toggle {
          display: flex;
          gap: 4px;
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 4px;
        }

        .view-btn {
          padding: 8px 12px;
          background: transparent;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          color: var(--color-text-secondary);
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .view-btn.active {
          background: var(--color-accent);
          color: #fff;
        }

        .view-btn:hover:not(.active) {
          background: var(--color-accent-soft);
          color: var(--color-accent);
        }

        /* ── PROVIDER GRID ────────────────────────────────── */
        .providers-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 48px;
        }

        .providers-grid.list-view {
          grid-template-columns: repeat(2, 1fr);
        }

        .provider-card {
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition:
            transform var(--transition-base),
            border-color var(--transition-base),
            box-shadow var(--transition-base);
          display: flex;
          flex-direction: column;
          position: relative;
        }

        /* Top colored accent bar (shows on hover) */
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
          border-color: var(--color-accent-light);
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
        }

        .list-view .provider-card {
          flex-direction: row;
        }

        /* Image - CLICKABLE */
        .provider-img-wrap {
          width: 100%;
          height: 180px;
          position: relative;
          overflow: hidden;
          background: var(--color-bg-soft);
          flex-shrink: 0;
          cursor: pointer;
        }

        .list-view .provider-img-wrap {
          width: 280px;
          height: auto;
          min-height: 200px;
        }

        .provider-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
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

        /* Content - NOT CLICKABLE (except name and view profile) */
        .provider-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow: visible;
        }

        /* Header Row: Name + Price */
        .provider-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 5px;
        }

        /* Name - CLICKABLE */
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

        /* Price Display */
        .provider-price {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          flex-shrink: 0;
        }

        .price-label {
          font-size: 10px;
          font-weight: 600;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          line-height: 1;
        }

        .price-amount {
          font-size: 20px;
          font-weight: 800;
          color: var(--color-accent);
          letter-spacing: -0.5px;
          line-height: 1.2;
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

        .provider-areas {
          font-size: 12px;
          color: var(--color-text-secondary);
          margin-bottom: 14px;
          line-height: 1.5;
        }

        .provider-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: auto;
        }

        .provider-actions > * {
          display: flex;
        }

        .provider-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 16px;
          border: none;
          border-radius: var(--radius-md);
          font-family: var(--font-primary);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition:
            background var(--transition-fast),
            transform var(--transition-fast),
            box-shadow var(--transition-fast),
            border-color var(--transition-fast);
          white-space: nowrap;
        }

        .provider-btn-primary {
          background: var(--color-accent);
          color: #fff;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
        }

        .provider-btn-primary:hover {
          background: var(--color-accent-hover);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .provider-btn-secondary {
          background: var(--color-bg-section);
          color: var(--color-accent);
          border: 1.5px solid var(--color-accent-light);
        }

        .provider-btn-secondary:hover {
          background: var(--color-accent-soft);
          border-color: var(--color-accent);
        }

        .provider-btn-profile {
          grid-column: 1 / -1;
          background: transparent;
          color: var(--color-text-secondary);
          border: 1.5px solid var(--color-border);
        }

        .provider-btn-profile:hover {
          background: var(--color-bg-section);
          border-color: var(--color-accent);
          color: var(--color-accent);
        }

        /* ── EMPTY STATE ──────────────────────────────────── */
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

        /* ── RESPONSIVE ───────────────────────────────────── */
        @media (max-width: 1200px) {
          .providers-container { padding: 0 32px; }
          .providers-grid { gap: 20px; }
        }

        @media (max-width: 1024px) {
          .providers-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .providers-grid.list-view {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 900px) {
          .providers-page { padding: 32px 0 60px; }
          .providers-container { padding: 0 24px; }
          .providers-title { font-size: 36px; }
          
          .search-main-row {
            grid-template-columns: 1fr;
          }

          .inline-select {
            width: 100%;
          }

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

          .sort-dropdown {
            width: 100%;
          }

          .sort-select {
            flex: 1;
          }

          .view-toggle {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .providers-page { padding: 24px 0 48px; }
          .providers-container { padding: 0 16px; }
          .providers-title { font-size: 30px; letter-spacing: -0.8px; }
          .providers-subtitle { font-size: 16px; }
          
          .providers-grid,
          .providers-grid.list-view {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .list-view .provider-card {
            flex-direction: column;
          }

          .list-view .provider-img-wrap {
            width: 100%;
            height: 180px;
          }

          .search-section {
            padding: 16px;
          }

          .quick-categories {
            gap: 6px;
          }

          .quick-cat-pill {
            padding: 7px 14px;
            font-size: 12px;
          }

          .provider-actions {
            grid-template-columns: 1fr;
          }

          .provider-btn-profile {
            grid-column: 1;
          }

          .provider-header-row {
            gap: 8px;
          }

          .price-amount {
            font-size: 18px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* Breadcrumb - OUTSIDE .providers-page */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="providers-page">
        <div className="providers-container">
          {/* Header */}
          <div className="providers-header">
            <h1 className="providers-title">Find Service Providers</h1>
            <p className="providers-subtitle">
              Browse verified professionals across Zimbabwe
            </p>
          </div>

          {/* Search & Filters */}
          <div className="search-section">
            {/* Main search row */}
            <div className="search-main-row">
              <div className="search-input-wrapper">
                <Search size={20} className="search-icon" strokeWidth={2} />
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
                {ALL_CATEGORIES.map((cat) => (
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
                {activeFilterCount > 0 && (
                  <span className="filter-badge">{activeFilterCount}</span>
                )}
                <SlidersHorizontal size={18} strokeWidth={2} />
                Filters
              </button>
            </div>

            {/* Quick category pills */}
            <div className="quick-categories">
              {QUICK_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`quick-cat-pill ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Advanced filters */}
            <div
              className={`advanced-filters ${showAdvancedFilters ? "visible" : ""}`}
            >
              <div className="advanced-filters-content">
                <span
                  style={{
                    fontSize: "14px",
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

          {/* Results Bar */}
          <div className="results-bar">
            <div className="results-left">
              <p className="results-count">
                Found <strong>{filteredProviders.length}</strong> provider
                {filteredProviders.length !== 1 ? "s" : ""}
                {selectedCity !== "All Cities" && ` in ${selectedCity}`}
              </p>

              <div className="sort-dropdown">
                <span className="sort-label">Sort by:</span>
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

            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
              >
                <Grid3x3 size={18} strokeWidth={2} />
              </button>
              <button
                className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                aria-label="List view"
              >
                <List size={18} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Providers Grid */}
          {filteredProviders.length > 0 ? (
            <div
              className={`providers-grid ${viewMode === "list" ? "list-view" : ""}`}
            >
              {filteredProviders.map((provider) => (
                <div key={provider.id} className="provider-card">
                  {/* Image - CLICKABLE */}
                  <div
                    className="provider-img-wrap"
                    onClick={() => navigate(`/providers/${provider.slug}`)}
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

                  {/* Content - NOT CLICKABLE (except specific elements) */}
                  <div className="provider-content">
                    {/* Header Row: Name + Price */}
                    <div className="provider-header-row">
                      {/* Name - CLICKABLE */}
                      <h3
                        className="provider-name"
                        onClick={() => navigate(`/providers/${provider.slug}`)}
                      >
                        {provider.name}
                      </h3>

                      {/* Price - NOT CLICKABLE */}
                      <div className="provider-price">
                        <span className="price-label">From</span>
                        <span className="price-amount">{provider.pricing}</span>
                      </div>
                    </div>

                    <p className="provider-tagline">{provider.tagline}</p>

                    <div className="provider-meta">
                      <div className="provider-rating">
                        <Star size={16} fill="#F59E0B" strokeWidth={0} />
                        <span>{provider.rating}</span>
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

                    <p className="provider-areas">
                      Serves: {provider.areas.join(", ")}
                    </p>

                    {/* Action Buttons - CLICKABLE */}
                    <div className="provider-actions">
                      <button
                        className="provider-btn provider-btn-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `tel:+263`;
                        }}
                      >
                        <Phone size={14} strokeWidth={2.5} />
                        Call
                      </button>
                      <button
                        className="provider-btn provider-btn-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://wa.me/263`, "_blank");
                        }}
                      >
                        <MessageCircle size={14} strokeWidth={2.5} />
                        WhatsApp
                      </button>
                      <button
                        className="provider-btn provider-btn-profile"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/providers/${provider.slug}`);
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
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <Search size={40} strokeWidth={2} />
              </div>
              <h3 className="empty-title">No providers found</h3>
              <p className="empty-text">
                Try adjusting your search or filters to find what you're looking
                for
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
          )}
        </div>
      </div>
    </>
  );
};

export default ProvidersPage;
