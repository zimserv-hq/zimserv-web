// src/pages/ProvidersPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  Star,
  MapPin,
  CheckCircle,
  Phone,
  MessageCircle,
  Search as SearchIcon,
  SlidersHorizontal,
  X,
  ChevronRight,
  Briefcase,
} from "lucide-react";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { supabase } from "../lib/supabaseClient";

type DbProvider = {
  id: string;
  slug: string | null;
  business_name: string | null;
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

type DbServiceArea = {
  provider_id: string;
  city: string;
  suburb: string | null;
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
  areas: string[];
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
  const location = useLocation();
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

  // ── AUTH STATE ───────────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [signingIn, setSigningIn] = useState(false); // ✅ NEW

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── CONTACT HANDLER ──────────────────────────────────────────────────────────
  const handleContactClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    if (!currentUser) {
      setShowLoginPrompt(true);
    } else {
      action();
    }
  };

  // ✅ UPDATED: triggers Google OAuth directly from modal — no redirect to /signin
  const handleSignInRedirect = async () => {
    setSigningIn(true);
    sessionStorage.setItem("returnTo", location.pathname + location.search);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    setSigningIn(false); // only reached if OAuth fails to redirect
  };

  // ── DATA FETCHING ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const { data: providersData, error: providersError } = await supabase
          .from("providers")
          .select(
            "id, slug, business_name, primary_category, city, status, years_experience, avg_rating, total_reviews, profile_image_url, pricing_model",
          )
          .eq("status", "active");

        if (providersError) {
          console.error("Error loading providers:", providersError);
          setProviders([]);
        } else {
          const dbProviders: DbProvider[] = providersData || [];

          const { data: servicesData, error: servicesError } = await supabase
            .from("provider_services")
            .select("id, provider_id, service_name, price");

          if (servicesError) {
            console.error("Error loading provider services:", servicesError);
          }

          const { data: areasData, error: areasError } = await supabase
            .from("provider_service_areas")
            .select("provider_id, city, suburb");

          if (areasError) {
            console.error("Error loading service areas:", areasError);
          }

          const dbServices: DbService[] = servicesData || [];
          const dbAreas: DbServiceArea[] = areasData || [];

          const ui: UiProvider[] = dbProviders.map((p) => {
            const displayName = p.business_name ?? "ZimServ Provider";

            // Use stored slug; fall back to generated slug or id if null
            const slug =
              p.slug ??
              displayName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");

            const providerServices: ProviderService[] = dbServices
              .filter((s) => s.provider_id === p.id)
              .map((s) => ({ name: s.service_name, price: s.price }));

            const providerAreas: string[] = dbAreas
              .filter((a) => a.provider_id === p.id)
              .map((a) => a.suburb || a.city)
              .filter(Boolean)
              .filter((v, i, arr) => arr.indexOf(v) === i);

            return {
              id: p.id,
              slug,
              name: displayName,
              category: p.primary_category,
              tagline: `${p.primary_category} specialist`,
              description: `Experienced ${p.primary_category.toLowerCase()} professional in ${p.city}.`,
              city: p.city,
              areas: providerAreas,
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
        console.error("Unexpected error:", err);
        setProviders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
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

          if (!best && !providerMatchesText)
            return { ...p, _exclude: true as const };
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

  const breadcrumbItems: { label: string; path?: string }[] = [];
  if (searchQuery.trim())
    breadcrumbItems.push({ label: `Search: "${searchQuery}"` });
  if (selectedCity !== "All Cities")
    breadcrumbItems.push({ label: selectedCity });
  if (selectedCategory !== "All Categories")
    breadcrumbItems.push({ label: selectedCategory });
  if (breadcrumbItems.length === 0)
    breadcrumbItems.push({ label: "All Providers" });

  const handleViewProfile = (slug: string) => navigate(`/providers/${slug}`);

  return (
    <>
      <style>{`
        .pp-page {
          width: 100%;
          min-height: 100vh;
          background: var(--color-bg-section);
          padding: 40px 0 80px;
          font-family: var(--font-primary);
        }

        .pp-container {
          max-width: var(--container-max-width);
          margin: 0 auto;
          padding: 0 var(--container-padding);
        }

        .pp-header { margin-bottom: 20px; }

        .pp-title {
          font-family: var(--font-primary);
          font-size: 32px;
          font-weight: 800;
          color: var(--color-primary);
          margin-bottom: 6px;
          line-height: 1.15;
          letter-spacing: -1.2px;
        }

        .pp-subtitle {
          font-size: 15px;
          font-weight: 500;
          color: var(--color-text-secondary);
        }

        .pp-search-section {
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: var(--shadow-sm);
        }

        .pp-search-row {
          display: grid;
          grid-template-columns: 1fr auto auto auto;
          gap: 12px;
          margin-bottom: 16px;
        }

        .pp-search-wrap { position: relative; }

        .pp-search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-secondary);
          pointer-events: none;
        }

        .pp-search-input {
          width: 100%;
          padding: 13px 16px 13px 46px;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-md);
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 500;
          color: var(--color-primary);
          background: var(--color-bg);
          transition: all var(--transition-fast);
        }

        .pp-search-input:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px var(--color-accent-soft);
        }

        .pp-search-input::placeholder { color: var(--color-text-secondary); }

        .pp-select {
          padding: 13px 36px 13px 14px;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-md);
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 600;
          color: var(--color-primary);
          background: var(--color-bg);
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
          min-width: 140px;
          transition: all var(--transition-fast);
        }

        .pp-select:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px var(--color-accent-soft);
        }

        .pp-filter-btn {
          padding: 13px 18px;
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

        .pp-filter-badge {
          position: absolute;
          top: -6px; right: -6px;
          width: 20px; height: 20px;
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

        .pp-filter-btn:hover,
        .pp-filter-btn.active {
          border-color: var(--color-accent);
          color: var(--color-accent);
          background: var(--color-accent-soft);
        }

        .pp-filter-btn.active {
          background: var(--color-accent);
          color: #fff;
        }

        .pp-quick-cats {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .pp-cat-pill {
          padding: 7px 15px;
          background: var(--color-bg-section);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-full);
          font-size: 13px;
          font-weight: 600;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .pp-cat-pill:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
          background: var(--color-accent-soft);
        }

        .pp-cat-pill.active {
          background: var(--color-accent);
          color: #fff;
          border-color: var(--color-accent);
        }

        .pp-advanced {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: all 0.3s ease;
        }

        .pp-advanced.visible {
          max-height: 200px;
          opacity: 1;
          margin-top: 16px;
        }

        .pp-advanced-inner {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .pp-clear-btn {
          padding: 9px 18px;
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

        .pp-clear-btn:hover {
          background: #EF4444;
          color: #fff;
        }

        .pp-results-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          gap: 16px;
        }

        .pp-results-count {
          font-size: 15px;
          color: var(--color-text-secondary);
          font-weight: 500;
        }

        .pp-results-count strong {
          color: var(--color-accent);
          font-weight: 700;
        }

        .pp-sort-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pp-sort-label {
          font-size: 14px;
          color: var(--color-text-secondary);
          font-weight: 500;
          white-space: nowrap;
        }

        .pp-sort-select {
          padding: 8px 30px 8px 12px;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-md);
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 600;
          color: var(--color-primary);
          background: var(--color-bg);
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 8px center;
          transition: all var(--transition-fast);
        }

        .pp-sort-select:focus {
          outline: none;
          border-color: var(--color-accent);
        }

        .pp-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 48px;
        }

        .pp-card {
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-xl);
          overflow: hidden;
          cursor: pointer;
          position: relative;
          display: flex;
          flex-direction: column;
          transition:
            transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.3s ease,
            border-color 0.25s ease;
        }

        .pp-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg), 0 0 0 1px rgba(236,111,22,0.1);
          border-color: var(--color-accent-light);
        }

        .pp-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--color-accent), var(--color-accent-light));
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 2;
        }

        .pp-card:hover::before { transform: scaleX(1); }

        .pp-img-wrap {
          position: relative;
          height: 240px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .pp-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .pp-card:hover .pp-img { transform: scale(1.06); }

        .pp-img-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(28,25,23,0.08) 0%,
            transparent 40%,
            rgba(28,25,23,0.52) 100%
          );
        }

        .pp-img-top {
          position: absolute;
          top: 12px; left: 12px; right: 12px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .pp-cat-badge {
          padding: 5px 12px;
          background: var(--color-accent);
          color: #fff;
          border-radius: var(--radius-full);
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .pp-verified-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          background: rgba(28,25,23,0.55);
          backdrop-filter: blur(8px);
          color: #fff;
          border-radius: var(--radius-full);
          font-size: 10.5px;
          font-weight: 600;
          border: 1px solid rgba(255,255,255,0.12);
        }

        .pp-verified-pill svg { color: #4ade80; }

        .pp-body {
          padding: 18px 20px 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .pp-name-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 3px;
        }

        .pp-name {
          font-size: 18px;
          font-weight: 800;
          color: var(--color-primary);
          letter-spacing: -0.4px;
          line-height: 1.2;
          flex: 1;
          transition: color var(--transition-fast);
        }

        .pp-card:hover .pp-name { color: var(--color-accent); }

        .pp-price {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          flex-shrink: 0;
        }

        .pp-price-label {
          font-size: 10px;
          font-weight: 600;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          line-height: 1;
        }

        .pp-price-amount {
          font-size: 20px;
          font-weight: 800;
          color: var(--color-accent);
          letter-spacing: -0.5px;
          line-height: 1.2;
          margin-top: 2px;
        }

        .pp-price-quote {
          font-size: 13px;
          font-weight: 700;
          color: var(--color-text-secondary);
          margin-top: 4px;
        }

        .pp-tagline {
          font-size: 13px;
          color: var(--color-text-secondary);
          line-height: 1.45;
          margin-bottom: 14px;
        }

        .pp-chips {
          display: flex;
          gap: 7px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }

        .pp-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          background: var(--color-bg-section);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          font-size: 12px;
          color: var(--color-text-secondary);
          font-weight: 500;
          transition: border-color 0.2s, background 0.2s;
        }

        .pp-card:hover .pp-chip {
          border-color: rgba(236,111,22,0.25);
          background: var(--color-accent-soft);
        }

        .pp-chip svg { color: var(--color-accent); flex-shrink: 0; }

        .pp-areas {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 14px;
          min-height: 24px;
        }

        .pp-areas-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--color-text-secondary);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .pp-area-tag {
          display: inline-flex;
          padding: 3px 9px;
          background: var(--color-accent-soft);
          color: var(--color-text-secondary);
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
        }

        .pp-area-more {
          font-size: 11px;
          color: var(--color-text-secondary);
          white-space: nowrap;
        }

        .pp-rating-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
        }

        .pp-stars { display: flex; gap: 2px; }

        .pp-rating-num {
          font-size: 14px;
          font-weight: 700;
          color: var(--color-primary);
          letter-spacing: -0.2px;
        }

        .pp-rating-ct {
          font-size: 12.5px;
          color: var(--color-text-secondary);
        }

        .pp-desc {
          font-size: 12px;
          color: var(--color-text-secondary);
          line-height: 1.55;
          margin-bottom: 16px;
        }

        .pp-divider {
          height: 1px;
          background: var(--color-border);
          margin-bottom: 14px;
        }

        .pp-actions {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 8px;
          margin-top: auto;
        }

        .pp-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 11px 14px;
          border-radius: var(--radius-md);
          font-family: var(--font-primary);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition:
            background 0.2s ease,
            transform 0.15s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease;
          white-space: nowrap;
        }

        .pp-btn-whatsapp {
          background: var(--color-accent);
          color: #fff;
          box-shadow: 0 3px 14px rgba(236,111,22,0.32);
        }

        .pp-btn-whatsapp:hover {
          background: var(--color-accent-hover);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(236,111,22,0.44);
        }

        .pp-btn-whatsapp:active { transform: scale(0.97); }

        .pp-btn-call {
          background: var(--color-bg);
          color: var(--color-text-secondary);
          border: 1.5px solid var(--color-border);
        }

        .pp-btn-call:hover {
          background: #f0fdf4;
          border-color: #16a34a;
          color: #16a34a;
          transform: translateY(-1px);
        }

        .pp-btn-profile {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-md);
          color: var(--color-accent);
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
        }

        .pp-btn-profile:hover {
          background: var(--color-accent-soft);
          border-color: var(--color-accent);
          transform: translateY(-1px);
        }

        .pp-empty {
          text-align: center;
          padding: 80px 20px;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          border: 1.5px dashed var(--color-border);
        }

        .pp-empty-icon {
          width: 80px; height: 80px;
          margin: 0 auto 20px;
          background: var(--color-bg-section);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-secondary);
        }

        .pp-empty-title {
          font-size: 22px;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 8px;
        }

        .pp-empty-text {
          font-size: 15px;
          color: var(--color-text-secondary);
          margin-bottom: 20px;
        }

        .pp-loading {
          font-size: 14px;
          color: var(--color-text-secondary);
          padding: 40px 0;
          text-align: center;
        }

        /* ── LOGIN PROMPT MODAL ───────────────────────────── */
        .pp-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(4px);
          animation: pp-fade-in 0.2s ease;
        }

        @keyframes pp-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .pp-modal {
          background: var(--color-bg);
          border-radius: var(--radius-xl);
          padding: 40px 36px 36px;
          max-width: 380px;
          width: 90%;
          text-align: center;
          position: relative;
          border: 1.5px solid var(--color-border);
          box-shadow: var(--shadow-lg);
          animation: pp-slide-up 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        }

        @keyframes pp-slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .pp-modal-close {
          position: absolute;
          top: 14px; right: 14px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--color-text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: var(--radius-sm);
          transition: color var(--transition-fast), background var(--transition-fast);
        }

        .pp-modal-close:hover {
          color: var(--color-primary);
          background: var(--color-bg-section);
        }

        .pp-modal-icon { font-size: 44px; margin-bottom: 14px; }

        .pp-modal-title {
          font-size: 20px;
          font-weight: 800;
          color: var(--color-primary);
          letter-spacing: -0.4px;
          margin-bottom: 8px;
        }

        .pp-modal-text {
          font-size: 14px;
          color: var(--color-text-secondary);
          margin-bottom: 28px;
          line-height: 1.6;
        }

       .pp-modal-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }



        /* ── MODAL GOOGLE BUTTON ──────────────────────────────── */
        .pp-modal-google-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          padding: 13px 20px;
          border-radius: var(--radius-md);
          font-family: var(--font-primary);
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          color: var(--color-primary);
          box-shadow: var(--shadow-sm);
          transition:
            border-color var(--transition-fast),
            box-shadow var(--transition-fast),
            transform var(--transition-fast);
          letter-spacing: 0.1px;
        }

        .pp-modal-google-btn:hover {
          border-color: #4285F4;
          box-shadow: 0 4px 16px rgba(66,133,244,0.15);
          transform: translateY(-1px);
        }

        .pp-modal-google-btn:active { transform: scale(0.98); }

        .pp-modal-google-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        .pp-modal-google-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .pp-modal-cancel-btn {
          width: 100%;
          padding: 13px 20px;
          border-radius: var(--radius-md);
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          background: transparent;
          border: 1.5px solid var(--color-border);
          color: var(--color-text-secondary);
          transition: all var(--transition-fast);
          margin-top: 4px;
        }

        .pp-modal-cancel-btn:hover {
          background: var(--color-bg-section);
          border-color: var(--color-text-secondary);
          color: var(--color-primary);
        }


        /* ── RESPONSIVE ───────────────────────────────────── */
        @media (max-width: 1200px) {
          .pp-container { padding: 0 32px; }
          .pp-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
        }

        @media (max-width: 900px) {
          .pp-page { padding: 32px 0 60px; }
          .pp-container { padding: 0 24px; }
          .pp-title { font-size: 28px; }
          .pp-search-row { grid-template-columns: 1fr; }
          .pp-select { width: 100%; }
          .pp-results-bar { flex-direction: column; align-items: flex-start; }
          .pp-sort-wrap { width: 100%; }
          .pp-sort-select { flex: 1; }
        }

        @media (max-width: 768px) {
          .pp-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 640px) {
          .pp-page { padding: 24px 0 48px; }
          .pp-container { padding: 0 16px; }
          .pp-title { font-size: 24px; letter-spacing: -0.8px; }
          .pp-img-wrap { height: 200px; }
          .pp-price-amount { font-size: 18px; }
          .pp-actions { grid-template-columns: 1fr 1fr; }
          .pp-btn-profile {
            grid-column: 1 / -1;
            width: 100%;
            border-radius: var(--radius-md);
            gap: 6px;
          }
          .pp-btn-profile::after {
            content: 'View Profile';
            font-size: 13px;
            font-weight: 700;
          }
          .pp-modal { padding: 36px 20px 28px; }
          .pp-modal-actions { grid-template-columns: 1fr; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <Breadcrumb items={breadcrumbItems} />

      <div className="pp-page">
        <div className="pp-container">
          <div className="pp-header">
            <h1 className="pp-title">Find Service Providers</h1>
            <p className="pp-subtitle">
              Browse verified professionals across Zimbabwe
            </p>
          </div>

          <div className="pp-search-section">
            <div className="pp-search-row">
              <div className="pp-search-wrap">
                <SearchIcon
                  size={18}
                  className="pp-search-icon"
                  strokeWidth={2}
                />
                <input
                  type="text"
                  placeholder="Search by name, service, or category..."
                  className="pp-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="pp-select"
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
                className="pp-select"
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
                className={`pp-filter-btn ${showAdvancedFilters ? "active" : ""}`}
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <SlidersHorizontal size={17} strokeWidth={2} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="pp-filter-badge">{activeFilterCount}</span>
                )}
              </button>
            </div>

            <div className="pp-quick-cats">
              {categories
                .filter((cat) => cat !== "All Categories")
                .map((cat) => (
                  <button
                    key={cat}
                    className={`pp-cat-pill ${selectedCategory === cat ? "active" : ""}`}
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
              className={`pp-advanced ${showAdvancedFilters ? "visible" : ""}`}
            >
              <div className="pp-advanced-inner">
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
                  <button className="pp-clear-btn" onClick={clearFilters}>
                    <X size={15} strokeWidth={2.5} />
                    Clear All
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="pp-results-bar">
            <p className="pp-results-count">
              Found <strong>{filteredProviders.length}</strong> provider
              {filteredProviders.length !== 1 ? "s" : ""}
              {selectedCity !== "All Cities" ? ` in ${selectedCity}` : ""}
            </p>
            <div className="pp-sort-wrap">
              <span className="pp-sort-label">Sort by</span>
              <select
                className="pp-sort-select"
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

          {loading ? (
            <p className="pp-loading">Loading providers...</p>
          ) : filteredProviders.length === 0 ? (
            <div className="pp-empty">
              <div className="pp-empty-icon">
                <SearchIcon size={36} strokeWidth={2} />
              </div>
              <h3 className="pp-empty-title">No providers found</h3>
              <p className="pp-empty-text">
                Try adjusting your search or filters to find what you're looking
                for.
              </p>
              {activeFilterCount > 0 && (
                <button
                  className="pp-clear-btn"
                  onClick={clearFilters}
                  style={{ margin: "0 auto" }}
                >
                  <X size={15} strokeWidth={2.5} />
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="pp-grid">
              {filteredProviders.map((provider) => {
                const hasPrice =
                  provider.matchedService &&
                  provider.matchedService.price != null;
                const displayAreas = provider.areas.slice(0, 2);
                const extraAreas = provider.areas.length - 2;

                return (
                  <div
                    key={provider.id}
                    className="pp-card"
                    onClick={() => handleViewProfile(provider.slug)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${provider.name} profile`}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleViewProfile(provider.slug)
                    }
                  >
                    <div className="pp-img-wrap">
                      <img
                        src={provider.image}
                        alt={provider.name}
                        className="pp-img"
                        loading="lazy"
                      />
                      <div className="pp-img-scrim" />
                      <div className="pp-img-top">
                        {provider.verified && (
                          <span className="pp-verified-pill">
                            <CheckCircle size={11} strokeWidth={2.5} />
                            Verified
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pp-body">
                      <div className="pp-name-row">
                        <h3 className="pp-name">{provider.name}</h3>
                        {hasPrice ? (
                          <div className="pp-price">
                            <span className="pp-price-label">From</span>
                            <span className="pp-price-amount">
                              $
                              {Number.isInteger(provider.matchedService!.price)
                                ? provider.matchedService!.price
                                : provider.matchedService!.price!.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="pp-price-quote">
                            {provider.pricingLabel}
                          </span>
                        )}
                      </div>

                      <p className="pp-tagline">
                        {provider.matchedService
                          ? provider.matchedService.name
                          : `${provider.category} specialist`}
                      </p>

                      <div className="pp-chips">
                        <span className="pp-chip">
                          <MapPin size={12} strokeWidth={2} />
                          {provider.city}
                        </span>
                        {provider.yearsExperience > 0 && (
                          <span className="pp-chip">
                            <Briefcase size={12} strokeWidth={2} />
                            {provider.yearsExperience}yr exp
                          </span>
                        )}
                      </div>

                      {provider.areas.length > 0 && (
                        <div className="pp-areas">
                          <span className="pp-areas-label">Serves:</span>
                          {displayAreas.map((area) => (
                            <span key={area} className="pp-area-tag">
                              {area}
                            </span>
                          ))}
                          {extraAreas > 0 && (
                            <span className="pp-area-more">
                              +{extraAreas} more
                            </span>
                          )}
                        </div>
                      )}

                      <div className="pp-rating-row">
                        <div className="pp-stars">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={13}
                              fill={
                                s <= Math.floor(provider.rating)
                                  ? "#F59E0B"
                                  : "none"
                              }
                              stroke="#F59E0B"
                              strokeWidth={1.5}
                            />
                          ))}
                        </div>
                        <span className="pp-rating-num">
                          {provider.rating.toFixed(1)}
                        </span>
                        <span className="pp-rating-ct">
                          ({provider.reviewCount})
                        </span>
                      </div>

                      <p className="pp-desc">{provider.description}</p>

                      <div className="pp-divider" />

                      {/* ── Actions ── */}
                      <div className="pp-actions">
                        <button
                          className="pp-btn pp-btn-whatsapp"
                          onClick={(e) =>
                            handleContactClick(e, () =>
                              window.open(
                                `https://wa.me/${provider.id}`,
                                "_blank",
                              ),
                            )
                          }
                        >
                          <MessageCircle size={14} strokeWidth={2.5} />
                          WhatsApp
                        </button>
                        <button
                          className="pp-btn pp-btn-call"
                          onClick={(e) =>
                            handleContactClick(e, () => {
                              window.location.href = `tel:${provider.id}`;
                            })
                          }
                        >
                          <Phone size={14} strokeWidth={2.5} />
                          Call
                        </button>
                        <button
                          className="pp-btn-profile"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewProfile(provider.slug);
                          }}
                          aria-label="View full profile"
                        >
                          <ChevronRight size={16} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Login Prompt Modal ── */}
      {showLoginPrompt && (
        <div
          className="pp-modal-overlay"
          onClick={() => !signingIn && setShowLoginPrompt(false)}
        >
          <div className="pp-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="pp-modal-close"
              onClick={() => setShowLoginPrompt(false)}
              aria-label="Close"
              disabled={signingIn}
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            {signingIn ? (
              <>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    border: "3px solid var(--color-border)",
                    borderTopColor: "var(--color-accent)",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                    margin: "14px auto 20px",
                  }}
                />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <p
                  style={{
                    color: "var(--color-text-secondary)",
                    fontSize: 14,
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  Redirecting to Google...
                </p>
              </>
            ) : (
              <>
                <div className="pp-modal-icon">🔒</div>
                <h3 className="pp-modal-title">Sign in to Contact</h3>
                <p className="pp-modal-text">
                  Sign in with your Google account to contact service providers
                  via WhatsApp or phone call.
                </p>

                <div className="pp-modal-actions">
                  {/* ✅ Full Google button matching SignInPage style */}
                  <button
                    className="pp-modal-google-btn"
                    onClick={handleSignInRedirect}
                    disabled={signingIn}
                  >
                    <svg className="pp-modal-google-icon" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </button>

                  <button
                    className="pp-modal-cancel-btn"
                    onClick={() => setShowLoginPrompt(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProvidersPage;
