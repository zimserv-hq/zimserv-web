// src/pages/ProvidersPage.tsx
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  MapPin,
  Phone,
  MessageCircle,
  Search as SearchIcon,
  X,
  ChevronRight,
  Briefcase,
} from "lucide-react";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import ProvidersPageSkeleton from "../components/Providers/ProvidersPageSkeleton";
import { supabase } from "../lib/supabaseClient";
import SEO from "../components/SEO";

// ── Half-star renderer ──────────────────────────────────────────────────────
const StarIcon = ({
  index,
  rating,
  size = 13,
}: {
  index: number;
  rating: number;
  size?: number;
}) => {
  const id = `hstar-${index}-${Math.round(rating * 10)}`;
  const filled = rating >= index;
  const half = !filled && rating > index - 1;

  if (filled) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="#F59E0B"
        stroke="#F59E0B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  }
  if (half) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          <linearGradient id={id}>
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <polygon
          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          fill={`url(#${id})`}
          stroke="#F59E0B"
        />
      </svg>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#D1D5DB"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
};
// ───────────────────────────────────────────────────────────────────────────

// ── Analytics hook (inline — no separate file needed) ──────────────────────
const viewFiredSet = new Set<string>(); // module-level so it persists across renders

const useAnalytics = () => {
  const track = useCallback(
    async (
      eventType: "whatsapp_click" | "call_click" | "profile_view",
      providerId: string,
    ) => {
      if (eventType === "profile_view") {
        if (viewFiredSet.has(providerId)) return;
        viewFiredSet.add(providerId);
      }
      const column =
        eventType === "whatsapp_click"
          ? "click_to_whatsapp_count"
          : eventType === "call_click"
            ? "click_to_call_count"
            : "profile_views";
      const { error } = await supabase.rpc("increment_provider_stat", {
        p_provider_id: providerId,
        p_column: column,
      });
      if (error) console.warn("[analytics]", error.message);
    },
    [],
  );
  return { track };
};
// ───────────────────────────────────────────────────────────────────────────

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
  phone_number: string | null;
  whatsapp_number: string | null;
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
type ProviderService = { name: string; price: number | null };
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
  phone: string;
  whatsapp: string;
};
type DbCategory = { id: string; name: string; status: string };

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
  { value: "featured", label: "Featured" },
  { value: "rating", label: "Top Rated" },
  { value: "reviews", label: "Most Reviewed" },
  { value: "experience", label: "Most Experienced" },
];
const CATEGORY_ICONS: Record<string, string> = {
  "Auto Mechanics": "🔧",
  "Tiling Services": "🪟",
  Electrical: "⚡",
  Plumbing: "🔩",
  "Solar Installation & Maintenance": "☀️",
  Carpentry: "🪵",
  Painting: "🎨",
  "Borehole & Water Systems": "💧",
  "Welding & Metal Fabrication": "⚙️",
  Roofing: "🏠",
  "Pest Control": "🐛",
  Cleaning: "✨",
  "Moving & Transport Services": "🚛",
  "Appliance Repair": "🔌",
  "Gardening & Landscaping": "🌿",
  "Beauty & Personal Care": "💅",
  "Event Services": "🎉",
  Security: "🛡️",
  IT: "💻",
  Catering: "🍽️",
};
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
  const [providers, setProviders] = useState<UiProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<UiProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(["All Categories"]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  const { track } = useAnalytics();

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setCurrentUser(session?.user ?? null));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, s) =>
      setCurrentUser(s?.user ?? null),
    );
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      const { data, error } = await supabase
        .from("services")
        .select("name")
        .eq("is_active", true)
        .ilike("name", `%${q}%`)
        .limit(4);
      if (error || !data) return;
      const names = data.map((s) => s.name);
      setSuggestions(names);
      setShowSuggestions(names.length > 0);
      setActiveIndex(-1);
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        searchWrapRef.current &&
        !searchWrapRef.current.contains(e.target as Node)
      )
        setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Updated: tracks whatsapp/call events ──────────────────────────────
  const handleContactClick = (
    e: React.MouseEvent,
    action: () => void,
    eventType: "whatsapp_click" | "call_click",
    providerId: string,
  ) => {
    e.stopPropagation();
    if (!currentUser) {
      setShowLoginPrompt(true);
    } else {
      track(eventType, providerId);
      action();
    }
  };

  // ── Updated: tracks profile views ─────────────────────────────────────
  const handleViewProfile = (slug: string, providerId: string) => {
    track("profile_view", providerId);
    navigate(`/providers/${slug}`);
  };

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
    setSigningIn(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: pd, error: pe } = await supabase
          .from("providers")
          .select(
            "id, slug, business_name, primary_category, city, status, years_experience, avg_rating, total_reviews, profile_image_url, pricing_model, phone_number, whatsapp_number",
          )
          .eq("status", "active");
        if (pe) {
          setProviders([]);
        } else {
          const dbP: DbProvider[] = pd || [];
          const { data: sd } = await supabase
            .from("provider_services")
            .select("id, provider_id, service_name, price");
          const { data: ad } = await supabase
            .from("provider_service_areas")
            .select("provider_id, city, suburb");
          const dbS: DbService[] = sd || [];
          const dbA: DbServiceArea[] = ad || [];
          setProviders(
            dbP.map((p) => {
              const displayName = p.business_name ?? "ZimServ Provider";
              const slug =
                p.slug ??
                displayName
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-|-$/g, "");
              return {
                id: p.id,
                slug,
                name: displayName,
                category: p.primary_category,
                tagline: `${p.primary_category} specialist`,
                description: `Experienced ${p.primary_category.toLowerCase()} professional in ${p.city}.`,
                city: p.city,
                areas: dbA
                  .filter((a) => a.provider_id === p.id)
                  .map((a) => a.suburb || a.city)
                  .filter(Boolean)
                  .filter((v, i, arr) => arr.indexOf(v) === i) as string[],
                rating: p.avg_rating ?? 0,
                reviewCount: p.total_reviews ?? 0,
                verified: true,
                image: p.profile_image_url || DEFAULT_PROVIDER_IMAGE,
                yearsExperience: p.years_experience ?? 0,
                pricingLabel: p.pricing_model || "Quote-based",
                priceValue: p.years_experience ?? 0,
                services: dbS
                  .filter((s) => s.provider_id === p.id)
                  .map((s) => ({ name: s.service_name, price: s.price })),
                matchedService: null,
                phone: p.phone_number ?? "",
                whatsapp: p.whatsapp_number ?? p.phone_number ?? "",
              };
            }),
          );

          const categoryCounts = dbP.reduce<Record<string, number>>(
            (acc, p) => {
              acc[p.primary_category] = (acc[p.primary_category] || 0) + 1;
              return acc;
            },
            {},
          );

          const { data: cd } = await supabase
            .from("categories")
            .select("id,name,status")
            .eq("status", "Active")
            .order("display_order", { ascending: true });

          setCategories([
            "All Categories",
            ...((cd || []) as DbCategory[])
              .map((c) => c.name)
              .filter((name) => (categoryCounts[name] || 0) > 2),
          ]);
        }
      } catch {
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
    const q = qRaw.toLowerCase();
    if (qRaw.length > 0) {
      results = results
        .map((p) => {
          let best: ProviderService | null = null;
          if (p.services?.length > 0) {
            for (const s of p.services) {
              const n = s.name.toLowerCase();
              if (n === q) {
                best = s;
                break;
              } else if (!best && n.includes(q)) best = s;
            }
          }
          const match =
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.city.toLowerCase().includes(q);
          if (!best && !match) return { ...p, _exclude: true as const };
          if (best) return { ...p, matchedService: best, tagline: best.name };
          return { ...p, matchedService: null };
        })
        .filter((p: any) => !p._exclude);
    }
    if (selectedCategory !== "All Categories")
      results = results.filter((p) => p.category === selectedCategory);
    if (selectedCity !== "All Cities")
      results = results.filter((p) => p.city === selectedCity);
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
  const hasActiveFilters = !!(
    searchQuery ||
    selectedCategory !== "All Categories" ||
    selectedCity !== "All Cities"
  );
  const breadcrumbItems: { label: string; path?: string }[] = [];
  if (searchQuery.trim())
    breadcrumbItems.push({ label: `Search: "${searchQuery}"` });
  if (selectedCity !== "All Cities")
    breadcrumbItems.push({ label: selectedCity });
  if (selectedCategory !== "All Categories")
    breadcrumbItems.push({ label: selectedCategory });
  if (breadcrumbItems.length === 0)
    breadcrumbItems.push({ label: "All Providers" });

  const highlightMatch = (text: string, query: string) => {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <span>{text}</span>;
    return (
      <>
        {text.slice(0, idx)}
        <mark
          style={{
            background: "#FFF0E0",
            color: "#C8570A",
            fontWeight: 700,
            borderRadius: 3,
            padding: "0 1px",
          }}
        >
          {text.slice(idx, idx + query.length)}
        </mark>
        {text.slice(idx + query.length)}
      </>
    );
  };
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || !suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((p) => Math.min(p + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((p) => Math.max(p - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      setSearchQuery(suggestions[activeIndex]);
      setShowSuggestions(false);
    } else if (e.key === "Escape") setShowSuggestions(false);
  };
  const getPriceDisplay = (p: UiProvider) => {
    const isPerSqm =
      p.category === "Tiling Services" || p.category === "Painting";

    if (p.matchedService) {
      if (p.matchedService.price != null)
        return {
          label: p.matchedService.name,
          amount: isPerSqm
            ? `$${p.matchedService.price.toFixed(2)}/m²`
            : `$${p.matchedService.price.toFixed(2)}`,
          isPrice: true,
        };
      return {
        label: p.matchedService.name,
        amount: "On request",
        isPrice: false,
      };
    }

    // no matched service — use pricingLabel but append /m² if applicable
    const label = p.pricingLabel || "Quote-based";
    const amount =
      isPerSqm && p.priceValue > 0 ? `$${p.priceValue.toFixed(2)}/m²` : label;

    return { label: null, amount, isPrice: isPerSqm && p.priceValue > 0 };
  };

  const hasCategory = selectedCategory !== "All Categories";
  const hasCity = selectedCity !== "All Cities";
  const seoTitle = hasCategory
    ? `${selectedCategory} Providers${hasCity ? ` in ${selectedCity}` : " in Zimbabwe"}`
    : hasCity
      ? `Service Providers in ${selectedCity}, Zimbabwe`
      : "Find Service Providers in Zimbabwe";

  return (
    <>
      <SEO
        title={seoTitle}
        description={
          hasCategory && hasCity
            ? `Find verified ${selectedCategory} providers in ${selectedCity}, Zimbabwe. Compare ratings, reviews and contact directly.`
            : hasCategory
              ? `Hire trusted ${selectedCategory} specialists across Zimbabwe. Browse profiles, reviews and contact directly.`
              : hasCity
                ? `Find verified service providers in ${selectedCity}, Zimbabwe. Plumbers, electricians and more.`
                : "Browse verified plumbers, electricians, painters and more across Zimbabwe. Compare reviews and contact directly."
        }
        keywords={[
          "service providers Zimbabwe",
          "hire professionals Zimbabwe",
          "ZimServ",
        ]}
        url="/providers"
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        :root {
          --pj: 'Plus Jakarta Sans', sans-serif;
          --ink: #1C1917; --ink-2: #44403C; --ink-3: #78716C; --ink-4: #A8A29E;
          --bg: #F7F5F2; --bg-card: #FFFFFF; --border: #E7E3DE; --border-2: #D4CFC9;
          --accent: #EC6F16; --accent-2: #C8570A; --accent-bg: #FFF4EC; --accent-border: #FFD9B8;
          --green: #16A34A; --green-bg: #F0FDF4; --green-border: #BBF7D0;
          --r-sm: 8px; --r-md: 12px; --r-lg: 16px; --r-xl: 20px; --r-pill: 100px;
          --s-sm: 0 1px 3px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.04);
          --s-md: 0 4px 16px rgba(0,0,0,.08),0 2px 6px rgba(0,0,0,.04);
          --s-lg: 0 12px 40px rgba(0,0,0,.10),0 4px 12px rgba(0,0,0,.05);
          --s-card: 0 2px 8px rgba(28,25,23,.06),0 0 0 1px rgba(28,25,23,.04);
          --t: .25s cubic-bezier(.22,1,.36,1);
        }
        .z-page { background: var(--bg); min-height: 100vh; font-family: var(--pj); color: var(--ink); }
        .z-hero { background: #1C1917; padding: 52px 0 56px; position: relative; overflow: hidden; margin-top: 20px; }
        .z-hero::before { content:''; position:absolute; inset:0; background-image: linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px); background-size: 48px 48px; pointer-events:none; }
        .z-hero::after { content:''; position:absolute; right:-80px; top:-100px; width:560px; height:500px; background:radial-gradient(ellipse,rgba(236,111,22,.17) 0%,transparent 65%); pointer-events:none; }
        .z-hero-inner { max-width:1200px; margin:0 auto; padding:0 40px; display:flex; align-items:center; justify-content:space-between; gap:32px; position:relative; z-index:1; }
        .z-eyebrow { display:inline-flex; align-items:center; gap:8px; font-family:var(--pj); font-size:11px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:var(--accent); margin-bottom:16px; }
        .z-eyebrow-dot { width:6px; height:6px; background:var(--accent); border-radius:50%; animation:z-blink 2.4s ease-in-out infinite; }
        @keyframes z-blink { 0%,100%{opacity:1} 50%{opacity:.35} }
        .z-hero-h1 { font-family:var(--pj); font-size:25px; font-weight:800; color:#FAF9F7; line-height:1.1; letter-spacing:-.03em; margin:0 0 14px; }
        .z-h1-accent { color:var(--accent); position:relative; }
        .z-hero-sub { font-size:13px; font-weight:400; color:rgba(250,249,247,.45); line-height:1.6; }
        .z-hero-sub strong { color:rgba(250,249,247,.7); font-weight:600; }
        .z-hero-stats { display:flex; gap:24px; margin-top:28px; align-items:center; }
        .z-stat { display:flex; flex-direction:column; gap:2px; }
        .z-stat-n { font-size:17px; font-weight:800; color:#FAF9F7; letter-spacing:-.03em; line-height:1; }
        .z-stat-l { font-size:11px; font-weight:500; color:rgba(250,249,247,.38); text-transform:uppercase; letter-spacing:.08em; }
        .z-stat-div { width:1px; background:rgba(255,255,255,.1); align-self:stretch; }
        .z-bar { background:#fff; border-bottom:1px solid var(--border); position:sticky; top:0; z-index:200; box-shadow:0 2px 12px rgba(28,25,23,.07); }
        .z-bar-inner { max-width:1200px; margin:0 auto; padding:0 40px; height:72px; display:flex; align-items:center; }
        .z-si-wrap { flex:1; position:relative; border-right:1px solid var(--border); height:100%; display:flex; align-items:center; }
        .z-si-ico { position:absolute; left:20px; color:var(--ink-4); pointer-events:none; }
        .z-si { width:100%; height:100%; padding:0 20px 0 52px; background:transparent; border:none; font-family:var(--pj); font-size:15px; font-weight:500; color:var(--ink); box-sizing:border-box; transition:background var(--t); }
        .z-si:focus { outline:none; background:#FFFBF8; }
        .z-si::placeholder { color:var(--ink-4); font-weight:400; }
        .z-suggs { position:absolute; top:calc(100% + 1px); left:0; right:0; background:#fff; border:1px solid var(--border); border-top:2px solid var(--accent); border-radius:0 0 var(--r-md) var(--r-md); box-shadow:var(--s-md); z-index:300; overflow:hidden; }
        .z-sugg { padding:11px 20px 11px 52px; font-family:var(--pj); font-size:14px; font-weight:500; color:var(--ink-2); cursor:pointer; border-bottom:1px solid var(--border); transition:background .15s; }
        .z-sugg:last-child { border-bottom:none; }
        .z-sugg:hover,.z-sugg.active { background:var(--accent-bg); }
        .z-sel-wrap { height:100%; border-right:1px solid var(--border); display:flex; align-items:center; padding:0 4px; flex-shrink:0; }
        .z-sel { height:100%; padding:0 36px 0 16px; background:transparent; border:none; font-family:var(--pj); font-size:14px; font-weight:600; color:var(--ink-2); cursor:pointer; appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2378716C' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 12px center; min-width:140px; transition:background-color var(--t); }
        .z-sel:focus { outline:none; background-color:var(--accent-bg); }
        .z-sel:hover { background-color:var(--bg); }
        .z-sort-wrap { height:100%; display:flex; align-items:center; padding:0 20px; gap:9px; flex-shrink:0; }
        .z-sort-lbl { font-size:11.5px; font-weight:700; color:var(--ink-4); text-transform:uppercase; letter-spacing:.07em; white-space:nowrap; }
        .z-sort-sel { padding:7px 28px 7px 10px; background:var(--bg); border:1.5px solid var(--border); border-radius:var(--r-sm); font-family:var(--pj); font-size:13px; font-weight:600; color:var(--ink); cursor:pointer; appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2378716C' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 8px center; transition:border-color var(--t); }
        .z-sort-sel:focus { outline:none; border-color:var(--accent); }
        .z-body { max-width:1200px; margin:0 auto; padding:32px 40px 80px; }
        .z-pills { display:flex; gap:7px; flex-wrap:wrap; padding-bottom:28px; border-bottom:1px solid var(--border); margin-bottom:28px; }
        .z-pill { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; background:var(--bg-card); border:1.5px solid var(--border); border-radius:var(--r-pill); font-family:var(--pj); font-size:13px; font-weight:600; color:var(--ink-2); cursor:pointer; transition:all var(--t); white-space:nowrap; box-shadow:var(--s-sm); user-select:none; }
        .z-pill:hover { border-color:var(--accent-border); color:var(--accent); background:var(--accent-bg); box-shadow:0 2px 8px rgba(236,111,22,.12); transform:translateY(-1px); }
        .z-pill.on { background:var(--ink); border-color:var(--ink); color:#fff; box-shadow:0 4px 14px rgba(28,25,23,.2); transform:translateY(-1px); }
        .z-pill-ico { font-size:14px; line-height:1; }
        .z-rbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; gap:12px; }
        .z-rlabel { font-size:15px; font-weight:600; color:var(--ink-3); }
        .z-rlabel strong { font-size:15px; font-weight:800; color:var(--ink); letter-spacing:-.03em; margin-right:4px; }
        .z-cbtn { display:inline-flex; align-items:center; gap:5px; padding:6px 13px; background:transparent; border:1.5px solid var(--border-2); border-radius:var(--r-pill); font-family:var(--pj); font-size:12.5px; font-weight:600; color:var(--ink-3); cursor:pointer; transition:all var(--t); }
        .z-cbtn:hover { border-color:#EF4444; color:#EF4444; background:#FEF2F2; }
        .z-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
        .z-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--r-xl); overflow:hidden; display:flex; flex-direction:column; cursor:pointer; position:relative; box-shadow:var(--s-card); transition:transform var(--t),box-shadow var(--t),border-color var(--t); animation:z-in .45s var(--t) both; }
        @keyframes z-in { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .z-card:nth-child(1){animation-delay:.00s} .z-card:nth-child(2){animation-delay:.05s} .z-card:nth-child(3){animation-delay:.10s}
        .z-card:nth-child(4){animation-delay:.15s} .z-card:nth-child(5){animation-delay:.20s} .z-card:nth-child(6){animation-delay:.25s}
        .z-card:nth-child(n+7){animation-delay:.28s}
        .z-card:hover { transform:translateY(-5px); box-shadow:var(--s-lg); border-color:var(--accent-border); }
        .z-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,var(--accent),#F59E0B); z-index:2; transform:scaleX(0); transform-origin:left; transition:transform .35s cubic-bezier(.22,1,.36,1); }
        .z-card:hover::before { transform:scaleX(1); }
        .z-cimg { position:relative; aspect-ratio:4/3; overflow:hidden; background:#E7E3DE; flex-shrink:0; }
        .z-cimg img { width:100%; height:100%; object-fit:cover; object-position:center top; display:block; transition:transform .55s cubic-bezier(.22,1,.36,1),filter .4s ease; filter:saturate(.88) brightness(.97); }
        .z-card:hover .z-cimg img { transform:scale(1.06); filter:saturate(1) brightness(1); }
        .z-cimg-scrim { position:absolute; inset:0; background:linear-gradient(to bottom,rgba(28,25,23,0) 35%,rgba(28,25,23,.65) 100%); }
        
        .z-cpill { display:inline-flex; align-items:center; gap:5px; padding:5px 11px; background:rgba(28,25,23,.6); backdrop-filter:blur(8px); border-radius:var(--r-pill); font-family:var(--pj); font-size:11.5px; font-weight:700; color:rgba(250,249,247,.88); border:1px solid rgba(255,255,255,.1); }
        .z-cbody { padding:16px 18px 18px; display:flex; flex-direction:column; flex:1; }
        .z-name-row { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:4px; cursor:pointer; }
        .z-cname { font-family:var(--pj); font-size:17px; font-weight:800; color:var(--ink); letter-spacing:-.025em; line-height:1.25; flex:1; min-width:0; transition:color var(--t); }
        .z-card:hover .z-cname { color:var(--accent); }
        .z-price-block { display:flex; flex-direction:column; align-items:flex-end; flex-shrink:0; padding-top:1px; gap:2px; }
        .z-price-from { font-size:9.5px; font-weight:700; color:var(--ink-4); text-transform:uppercase; letter-spacing:.09em; line-height:1; }
        .z-price-amt { font-family:var(--pj); font-size:16px; font-weight:800; color:var(--accent); letter-spacing:-.02em; line-height:1; white-space:nowrap; }
        .z-price-quote { font-size:11.5px; font-weight:600; color:var(--ink-4); white-space:nowrap; background:var(--bg); border:1px solid var(--border); border-radius:var(--r-pill); padding:3px 9px; margin-top:2px; }
        .z-ctag { font-size:12.5px; font-weight:400; color:var(--ink-3); margin-bottom:12px; line-height:1.5; }
        .z-meta { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:10px; }
        .z-chip { display:inline-flex; align-items:center; gap:4px; padding:4px 9px; background:var(--bg); border:1px solid var(--border); border-radius:var(--r-pill); font-family:var(--pj); font-size:11.5px; font-weight:600; color:var(--ink-2); transition:border-color var(--t),background var(--t); }
        .z-chip svg { color:var(--accent); }
        .z-card:hover .z-chip { border-color:var(--accent-border); background:var(--accent-bg); }
        .z-areas { display:flex; flex-wrap:wrap; align-items:center; gap:5px; margin-bottom:10px; }
        .z-atag { padding:3px 8px; background:var(--accent-bg); border:1px solid var(--accent-border); color:var(--accent-2); border-radius:5px; font-size:11px; font-weight:700; }
        .z-amore { font-size:11px; color:var(--ink-4); font-weight:500; }
        .z-rating { display:flex; align-items:center; gap:7px; margin-bottom:14px; }
        .z-stars { display:flex; gap:2px; align-items:center; }
        .z-rnum { font-size:13px; font-weight:700; color:var(--ink); }
        .z-rct { font-size:12px; color:var(--ink-4); font-weight:500; }
        .z-new { display:inline-flex; align-items:center; padding:2px 7px; background:#EFF6FF; border:1px solid #BFDBFE; border-radius:var(--r-pill); font-size:10.5px; font-weight:700; color:#3B82F6; letter-spacing:.04em; }
        .z-div { height:1px; background:var(--border); margin-bottom:14px; }
        .z-acts { display:grid; grid-template-columns:1fr 1fr auto; gap:7px; margin-top:auto; }
        .z-btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; padding:10px 13px; border-radius:var(--r-sm); font-family:var(--pj); font-size:13px; font-weight:700; cursor:pointer; border:none; transition:all .2s ease; white-space:nowrap; letter-spacing:.01em; }
        .z-bwa { background:var(--accent); color:#fff; box-shadow:0 2px 10px rgba(236,111,22,.28); }
        .z-bwa:hover { background:var(--accent-2); transform:translateY(-1px); box-shadow:0 6px 20px rgba(236,111,22,.38); }
        .z-bwa:active { transform:scale(.97); }
        .z-bcall { background:var(--green-bg); color:var(--green); border:1.5px solid var(--green-border); }
        .z-bcall:hover { background:#DCFCE7; border-color:var(--green); transform:translateY(-1px); }
        .z-bprof { width:40px; height:40px; background:var(--bg); border:1.5px solid var(--border); border-radius:var(--r-sm); display:flex; align-items:center; justify-content:center; color:var(--ink-3); cursor:pointer; flex-shrink:0; transition:all .2s; }
        .z-bprof:hover { background:var(--ink); border-color:var(--ink); color:#fff; transform:translateY(-1px); }
        .z-empty { text-align:center; padding:100px 20px; }
        .z-empty-ico { font-size:52px; margin-bottom:20px; opacity:.3; }
        .z-empty-h { font-family:var(--pj); font-size:24px; font-weight:800; color:var(--ink); margin-bottom:10px; letter-spacing:-.025em; }
        .z-empty-p { font-size:15px; color:var(--ink-3); margin-bottom:24px; }
        .z-ov { position:fixed; inset:0; background:rgba(28,25,23,.55); display:flex; align-items:center; justify-content:center; z-index:9999; backdrop-filter:blur(5px); animation:z-fade .2s ease; }
        @keyframes z-fade { from{opacity:0} to{opacity:1} }
        .z-modal { background:#fff; border-radius:var(--r-xl); padding:44px 40px 40px; max-width:380px; width:90%; text-align:center; position:relative; box-shadow:0 32px 80px rgba(0,0,0,.18); animation:z-up .28s cubic-bezier(.22,1,.36,1); }
        @keyframes z-up { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .z-mcl { position:absolute; top:14px; right:14px; background:transparent; border:none; cursor:pointer; color:var(--ink-4); padding:6px; border-radius:6px; transition:all .15s; }
        .z-mcl:hover { color:var(--ink); background:var(--bg); }
        .z-mic { font-size:40px; margin-bottom:14px; }
        .z-mh { font-family:var(--pj); font-size:21px; font-weight:800; color:var(--ink); letter-spacing:-.03em; margin-bottom:10px; }
        .z-mp { font-size:14px; color:var(--ink-3); margin-bottom:28px; line-height:1.65; }
        .z-macts { display:flex; flex-direction:column; gap:8px; }
        .z-gbtn { display:flex; align-items:center; justify-content:center; gap:12px; width:100%; padding:13px 20px; border-radius:var(--r-sm); font-family:var(--pj); font-size:14px; font-weight:700; cursor:pointer; background:#fff; border:1.5px solid var(--border); color:var(--ink); box-shadow:var(--s-sm); transition:all .2s; }
        .z-gbtn:hover { border-color:#4285F4; box-shadow:0 4px 20px rgba(66,133,244,.14); transform:translateY(-1px); }
        .z-gbtn:disabled { opacity:.6; cursor:not-allowed; transform:none; }
        .z-cxbtn { width:100%; padding:12px 20px; border-radius:var(--r-sm); font-family:var(--pj); font-size:13.5px; font-weight:600; cursor:pointer; background:transparent; border:1px solid var(--border); color:var(--ink-3); transition:all .15s; }
        .z-cxbtn:hover { background:var(--bg); color:var(--ink); }
        @media(max-width:1100px){ .z-grid{grid-template-columns:repeat(2,1fr)} }
        @media(max-width:860px){
          .z-hero-inner{flex-direction:column;align-items:flex-start;padding:0 20px}
          .z-hero-h1{font-size:28px}
          .z-bar-inner{height:auto;flex-wrap:wrap;padding:12px 20px;gap:8px}
          .z-si-wrap{border-right:none;border-bottom:1px solid var(--border);width:100%;height:48px}
          .z-sel-wrap{border-right:none;padding:0;flex:1}
          .z-sel{width:100%;height:40px}
          .z-sort-wrap{width:100%;padding:0;justify-content:flex-end}
          .z-body{padding:24px 20px 60px}
        }
        @media(max-width:640px){
          .z-grid{grid-template-columns:1fr}
          .z-hero-h1{font-size:25px}
          .z-hero-stats{gap:16px}
          .z-acts{grid-template-columns:1fr 1fr}
          .z-bprof{grid-column:1/-1;width:100%;height:38px;gap:6px}
          .z-bprof::after{content:'View Profile';font-family:var(--pj);font-size:13px;font-weight:700}
          .z-modal{padding:36px 22px 28px}
        }
        @media(prefers-reduced-motion:reduce){ *,*::before,*::after{animation:none!important;transition:none!important} }
      `}</style>

      <Breadcrumb items={breadcrumbItems} />

      {/* HERO */}
      <section className="z-hero">
        <div className="z-hero-inner">
          <div>
            <div className="z-eyebrow">
              <span className="z-eyebrow-dot" />
              Zimbabwe's Service Marketplace
            </div>
            <h1 className="z-hero-h1">
              Find <span className="z-h1-accent">trusted</span> professionals
              <br />
              near you
            </h1>
            <p className="z-hero-sub">
              <strong>Verified providers</strong> · Direct contact · No
              middlemen
            </p>
            <p
              className="z-hero-sub"
              style={{
                marginTop: "10px",
                fontSize: "13px",
                color: "rgba(250,249,247,.35)",
              }}
            >
              💡 Prices shown are{" "}
              <strong style={{ color: "rgba(250,249,247,.5)" }}>
                starting estimates
              </strong>{" "}
              and may vary based on job scope, materials, or site conditions.
              Ratings reflect{" "}
              <strong style={{ color: "rgba(250,249,247,.5)" }}>
                verified customer reviews
              </strong>{" "}
              to help you choose with confidence.
            </p>
            {providers.length > 0 && (
              <div className="z-hero-stats">
                <div className="z-stat">
                  <span className="z-stat-n">{providers.length}</span>
                  <span className="z-stat-l">Providers</span>
                </div>
                <div className="z-stat-div" />
                <div className="z-stat">
                  <span className="z-stat-n">{categories.length - 1}</span>
                  <span className="z-stat-l">Categories</span>
                </div>
                <div className="z-stat-div" />
                <div className="z-stat">
                  <span className="z-stat-n">{CITIES.length - 1}</span>
                  <span className="z-stat-l">Cities</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SEARCH BAR */}
      <div className="z-bar">
        <div className="z-bar-inner">
          <div className="z-si-wrap" ref={searchWrapRef}>
            <SearchIcon size={17} className="z-si-ico" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search services, providers, categories…"
              className="z-si"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              autoComplete="off"
            />
            {showSuggestions && (
              <div className="z-suggs">
                {suggestions.map((name, i) => (
                  <div
                    key={name}
                    className={`z-sugg${i === activeIndex ? " active" : ""}`}
                    onMouseDown={() => {
                      setSearchQuery(name);
                      setShowSuggestions(false);
                    }}
                    onMouseEnter={() => setActiveIndex(i)}
                  >
                    {highlightMatch(name, searchQuery.trim())}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="z-sel-wrap">
            <select
              className="z-sel"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="z-sel-wrap">
            <select
              className="z-sel"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="z-sort-wrap">
            <span className="z-sort-lbl">Sort</span>
            <select
              className="z-sort-sel"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="z-body">
        {categories.length > 1 && (
          <div className="z-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`z-pill${selectedCategory === cat ? " on" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat !== "All Categories" && (
                  <span className="z-pill-ico">
                    {CATEGORY_ICONS[cat] || "◆"}
                  </span>
                )}
                {cat}
              </button>
            ))}
          </div>
        )}
        {loading ? (
          <ProvidersPageSkeleton />
        ) : (
          <>
            <div className="z-rbar">
              <p className="z-rlabel">
                <strong>{filteredProviders.length}</strong>
                {filteredProviders.length === 1
                  ? " provider"
                  : " providers"}{" "}
                found
              </p>
              {hasActiveFilters && (
                <button className="z-cbtn" onClick={clearFilters}>
                  <X size={13} strokeWidth={2.5} /> Clear filters
                </button>
              )}
            </div>
            {filteredProviders.length === 0 ? (
              <div className="z-empty">
                <div className="z-empty-ico">🔍</div>
                <h3 className="z-empty-h">No providers found</h3>
                <p className="z-empty-p">
                  Try broadening your search or adjusting your filters.
                </p>
                <button
                  className="z-cbtn"
                  onClick={clearFilters}
                  style={{ margin: "0 auto" }}
                >
                  <X size={13} strokeWidth={2.5} /> Clear filters
                </button>
              </div>
            ) : (
              <div className="z-grid">
                {filteredProviders.map((provider, index) => {
                  const pd = getPriceDisplay(provider);

                  const viewsToday = 10 + (index % 25);

                  return (
                    <div key={provider.id} className="z-card">
                      {/* IMAGE */}
                      <div
                        className="z-cimg"
                        onClick={() =>
                          handleViewProfile(provider.slug, provider.id)
                        }
                      >
                        <img src={provider.image} alt={provider.name} />
                        <div className="z-cimg-scrim" />
                      </div>

                      {/* BODY */}
                      <div className="z-cbody">
                        <div
                          className="z-name-row"
                          onClick={() =>
                            handleViewProfile(provider.slug, provider.id)
                          }
                        >
                          <div className="z-cname">{provider.name}</div>
                          <div className="z-price-block">
                            {pd.isPrice ? (
                              <>
                                <span className="z-price-from"> From</span>
                                <span className="z-price-amt">{pd.amount}</span>
                              </>
                            ) : (
                              <span className="z-price-quote">{pd.amount}</span>
                            )}
                          </div>
                        </div>

                        <p className="z-ctag">{provider.tagline}</p>

                        <div className="z-meta">
                          <span className="z-chip">
                            <MapPin size={11} strokeWidth={2} /> {provider.city}
                          </span>
                          {provider.yearsExperience > 0 && (
                            <span className="z-chip">
                              <Briefcase size={11} strokeWidth={2} />{" "}
                              {provider.yearsExperience} yrs exp
                            </span>
                          )}
                        </div>

                        {provider.areas.length > 0 && (
                          <div className="z-areas">
                            {provider.areas.slice(0, 3).map((a) => (
                              <span key={a} className="z-atag">
                                {a}
                              </span>
                            ))}
                            {provider.areas.length > 3 && (
                              <span className="z-amore">
                                +{provider.areas.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* RATING — half-star support */}
                        <div className="z-rating">
                          <div className="z-stars">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <StarIcon
                                key={s}
                                index={s}
                                rating={provider.rating}
                                size={13}
                              />
                            ))}
                          </div>
                          {provider.rating > 0 ? (
                            <>
                              <span className="z-rnum">
                                {provider.rating.toFixed(1)}
                              </span>
                              <span className="z-rct">
                                ({provider.reviewCount}{" "}
                                {provider.reviewCount === 1
                                  ? "review"
                                  : "reviews"}
                                )
                              </span>
                            </>
                          ) : (
                            <span className="z-new">NEW</span>
                          )}
                        </div>

                        <div
                          style={{
                            fontSize: "12px",
                            color: "#78716C",
                            marginBottom: "10px",
                          }}
                        >
                          {viewsToday} people viewed today
                        </div>

                        <div className="z-div" />

                        {/* ACTIONS */}
                        <div className="z-acts">
                          <button
                            className="z-btn z-bwa"
                            onClick={(e) =>
                              handleContactClick(
                                e,
                                () => {
                                  const num = (
                                    provider.whatsapp ||
                                    provider.phone ||
                                    ""
                                  ).replace(/\D/g, "");
                                  if (!num) return;

                                  let message: string;
                                  if (provider.matchedService) {
                                    const priceStr =
                                      provider.matchedService.price != null
                                        ? ` (priced starting from $${provider.matchedService.price.toFixed(2)})`
                                        : " (price on request)";
                                    message = `Hi, I found you on ZimServ and I'm interested in your *${provider.matchedService.name}* service${priceStr}. Are you available?`;
                                  } else {
                                    message = `Hi, I found you on ZimServ and I need your *${provider.category}* service. Are you available?`;
                                  }

                                  window.open(
                                    `https://wa.me/${num}?text=${encodeURIComponent(message)}`,
                                    "_blank",
                                  );
                                },
                                "whatsapp_click",
                                provider.id,
                              )
                            }
                          >
                            <MessageCircle size={14} /> Whatsapp
                          </button>
                          <button
                            className="z-btn z-bcall"
                            onClick={(e) =>
                              handleContactClick(
                                e,
                                () => {
                                  if (provider.phone)
                                    window.open(
                                      `tel:${provider.phone}`,
                                      "_self",
                                    );
                                },
                                "call_click",
                                provider.id,
                              )
                            }
                          >
                            <Phone size={14} /> Call
                          </button>
                          <button
                            className="z-bprof"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewProfile(provider.slug, provider.id);
                            }}
                          >
                            <ChevronRight size={17} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      <section
        style={{
          maxWidth: "800px",
          margin: "40px auto",
          fontSize: "13px",
          textAlign: "center",
          color: "#78716C",
        }}
      >
        <p>
          {hasCategory && hasCity
            ? `Find trusted ${selectedCategory.toLowerCase()} professionals in ${selectedCity}. Browse verified providers, compare reviews and contact directly.`
            : "Browse verified service providers across Zimbabwe including plumbers, electricians, cleaners and more."}
        </p>
      </section>

      {/* LOGIN MODAL */}
      {showLoginPrompt && (
        <div className="z-ov" onClick={() => setShowLoginPrompt(false)}>
          <div className="z-modal" onClick={(e) => e.stopPropagation()}>
            <button className="z-mcl" onClick={() => setShowLoginPrompt(false)}>
              <X size={18} strokeWidth={2} />
            </button>
            <div className="z-mic">🔒</div>
            <h2 className="z-mh">Sign in to contact</h2>
            <p className="z-mp">
              Create a free account to reach any provider directly by WhatsApp
              or phone.
            </p>
            <div className="z-macts">
              <button
                className="z-gbtn"
                onClick={handleSignInRedirect}
                disabled={signingIn}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
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
                {signingIn ? "Redirecting…" : "Continue with Google"}
              </button>
              <button
                className="z-cxbtn"
                onClick={() => setShowLoginPrompt(false)}
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProvidersPage;
