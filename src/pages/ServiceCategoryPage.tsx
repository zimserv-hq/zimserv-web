// src/pages/ServiceCategoryPage.tsx
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  MapPin,
  Phone,
  MessageCircle,
  ChevronRight,
  Briefcase,
  Search,
  X,
  Lock,
} from "lucide-react";
import SEO from "../components/SEO";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { supabase } from "../lib/supabaseClient";

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
  "Chinhoyi",
  "Marondera",
];

const CITY_AREAS: Record<string, string[]> = {
  Harare: ["Borrowdale", "Avondale", "Mbare", "Highfield", "Eastlea", "Msasa"],
  Bulawayo: ["Suburbs", "Nkulumane", "Pumula", "Lobengula", "Burnside"],
  Chitungwiza: ["Unit A", "Unit B", "St Mary's", "Zengeza"],
  Mutare: ["Chikanga", "Dangamvura", "Hobhouse", "Sakubva"],
  Gweru: ["Mkoba", "Mambo", "Senga", "Windsor"],
  Kwekwe: ["Mbizo", "Amaveni", "Golden Kopje"],
  Masvingo: ["Rujeko", "Mucheke", "Rhodene"],
  Chinhoyi: ["Chinhoyi CBD", "Chikonohono"],
  Marondera: ["Dombotombo", "Marondera CBD"],
  Kadoma: ["Rimuka", "Kadoma CBD"],
};

const SORT_OPTIONS = [
  { value: "rating", label: "Highest Rated" },
  { value: "reviews", label: "Most Reviews" },
  { value: "experience", label: "Most Experienced" },
];

const DEFAULT_IMAGE = "https://placehold.co/400x300?text=Provider";

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

const viewFiredSet = new Set<string>();

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

type UiProvider = {
  id: string;
  slug: string;
  name: string;
  category: string;
  tagline: string;
  city: string;
  areas: string[];
  worksNationwide: boolean;
  rating: number;
  reviewCount: number;
  verified: boolean;
  image: string;
  yearsExperience: number;
  pricingLabel: string;
  phone: string;
  whatsapp: string;
  services: { name: string; price: number | null }[];
  matchedService?: { name: string; price: number | null } | null;
};

function toTitleCase(str: string) {
  return str
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function highlightMatch(text: string, query: string) {
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
}

const SeoContentBlock = ({
  category,
  initialCity,
  filtered,
}: {
  category: string;
  initialCity: string;
  filtered: UiProvider[];
}) => {
  const [expanded, setExpanded] = useState(false);

  const firstParagraph =
    initialCity !== "All Cities"
      ? `Looking for reliable ${category.toLowerCase()} services in ${initialCity}? ZimServ connects you with trusted, verified professionals across ${initialCity}'s key areas including ${(CITY_AREAS[initialCity] || ["the CBD", "surrounding suburbs"]).slice(0, 4).join(", ")}. Whether you need installation, repairs, emergency call-outs, or routine maintenance, our ${category.toLowerCase()} providers are equipped for both residential and commercial work.`
      : `ZimServ makes it easy to find trusted ${category.toLowerCase()} professionals anywhere in Zimbabwe. We have verified providers in Harare, Bulawayo, Mutare, Gweru and more — all reviewed by real customers so you know exactly who you're hiring before you make contact.`;

  return (
    <div className="scp-content-block">
      <h2 className="scp-content-title">
        {initialCity !== "All Cities"
          ? `${category} Services in ${initialCity}, Zimbabwe`
          : `${category} Services Across Zimbabwe`}
      </h2>
      <p className="scp-content-p">{firstParagraph}</p>
      <div
        className={`scp-read-more-content ${expanded ? "expanded" : "collapsed"}`}
      >
        <p className="scp-content-p">
          Every {category.toLowerCase()} provider on ZimServ has a verified
          profile with genuine customer reviews, years of experience, and
          transparent pricing. Compare providers side by side and contact them
          directly via WhatsApp or phone — no agency fees, no middlemen.
        </p>
        <p className="scp-content-p" style={{ marginBottom: 0 }}>
          {initialCity !== "All Cities"
            ? `With ${filtered.length} active ${category.toLowerCase()} providers currently listed in ${initialCity}, you can browse by rating, experience level, or specific service type using the search bar above. Most providers respond quickly and offer flexible scheduling.`
            : `Browse ${filtered.length} verified ${category.toLowerCase()} providers across Zimbabwe. Use the search bar to find someone who offers the specific service you need — prices are shown where providers have set fixed rates.`}
        </p>

        {/* FAQ BLOCK — added for SEO */}
        <div
          style={{
            marginTop: 20,
            borderTop: "1px solid var(--color-border)",
            paddingTop: 16,
          }}
        >
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "var(--color-primary)",
              marginBottom: 12,
            }}
          >
            Frequently Asked Questions
          </h3>
          <p className="scp-content-p">
            <strong>
              How much do {category.toLowerCase()} services cost in{" "}
              {initialCity !== "All Cities" ? initialCity : "Zimbabwe"}?
            </strong>
            <br />
            Prices vary depending on the job scope and provider. Most providers
            offer free quotes — contact them directly via WhatsApp for a fast
            estimate.
          </p>
          <p className="scp-content-p">
            <strong>
              How quickly can {category.toLowerCase()} providers respond?
            </strong>
            <br />
            Many providers on ZimServ respond within minutes via WhatsApp or
            phone. Look for providers with high review counts for the fastest,
            most reliable service.
          </p>
          <p className="scp-content-p" style={{ marginBottom: 0 }}>
            <strong>
              Are ZimServ {category.toLowerCase()} providers verified?
            </strong>
            <br />
            Yes — verified providers have completed ZimServ's identity and
            credentials check. Look for the green "Verified" badge on provider
            cards.
          </p>
        </div>

        {/* COMMON SERVICES LIST — added for SEO */}
        <div style={{ marginTop: 16 }}>
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "var(--color-primary)",
              marginBottom: 10,
            }}
          >
            Common {category} Services
          </h3>
          <ul
            style={{
              paddingLeft: 18,
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            <li className="scp-content-p" style={{ marginBottom: 0 }}>
              {category} installation services
            </li>
            <li className="scp-content-p" style={{ marginBottom: 0 }}>
              {category} repairs and maintenance
            </li>
            <li className="scp-content-p" style={{ marginBottom: 0 }}>
              Emergency {category.toLowerCase()} call-outs
            </li>
            <li className="scp-content-p" style={{ marginBottom: 0 }}>
              Residential and commercial {category.toLowerCase()}
            </li>
            <li className="scp-content-p" style={{ marginBottom: 0 }}>
              {category} inspections and assessments
            </li>
          </ul>
        </div>
      </div>

      <button
        className="scp-read-more-btn"
        onClick={() => setExpanded((p) => !p)}
      >
        {expanded ? (
          <>
            <ChevronRight
              size={14}
              style={{ transform: "rotate(-90deg)" }}
              strokeWidth={2.5}
            />{" "}
            Show less
          </>
        ) : (
          <>
            <ChevronRight
              size={14}
              style={{ transform: "rotate(90deg)" }}
              strokeWidth={2.5}
            />{" "}
            Read more
          </>
        )}
      </button>
    </div>
  );
};

const ServiceCategoryPage = () => {
  const { category: categorySlug, city: citySlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const category = toTitleCase(categorySlug || "");
  const initialCity = citySlug ? toTitleCase(citySlug) : "All Cities";

  const [allProviders, setAllProviders] = useState<UiProvider[]>([]);
  const [filtered, setFiltered] = useState<UiProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [sortBy, setSortBy] = useState("rating");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [relatedCategories, setRelatedCategories] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  const searchWrapRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    const fetchData = async () => {
      setLoading(true);

      const { data: providerData } = await supabase
        .from("providers")
        .select(
          `
          id, slug, full_name, business_name, primary_category,
          city, avg_rating, total_reviews, years_experience,
          profile_image_url, verification_level,
          phone_number, whatsapp_number, pricing_model,
          works_nationwide
        `,
        )
        .eq("status", "active")
        .ilike("primary_category", category);

      const { data: servicesData } = await supabase
        .from("provider_services")
        .select("provider_id, service_name, price");

      const { data: areasData } = await supabase
        .from("provider_service_areas")
        .select("provider_id, city, suburb");

      const { data: allProvidersForCounts } = await supabase
        .from("providers")
        .select("primary_category")
        .eq("status", "active");

      const categoryCounts = (allProvidersForCounts || []).reduce<
        Record<string, number>
      >((acc, p: any) => {
        acc[p.primary_category] = (acc[p.primary_category] || 0) + 1;
        return acc;
      }, {});

      const { data: cd } = await supabase
        .from("categories")
        .select("id, name, status")
        .eq("status", "Active")
        .order("display_order", { ascending: true });

      const qualified = (
        (cd || []) as { id: string; name: string; status: string }[]
      )
        .map((c) => c.name)
        .filter((name) => (categoryCounts[name] || 0) > 2);

      setRelatedCategories(qualified);

      const ui: UiProvider[] = (providerData || []).map((p: any) => {
        const provServices = (servicesData || [])
          .filter((s: any) => s.provider_id === p.id)
          .map((s: any) => ({ name: s.service_name, price: s.price ?? null }));

        const areas = (areasData || [])
          .filter((a: any) => a.provider_id === p.id)
          .map((a: any) => a.suburb || a.city)
          .filter(Boolean);

        return {
          id: p.id,
          slug: p.slug || p.id,
          name: p.business_name || p.full_name || "ZimServ Provider",
          category: p.primary_category,
          tagline: `${p.primary_category} Specialist`,
          city: p.city,
          areas,
          worksNationwide: p.works_nationwide ?? false,
          rating: Number(p.avg_rating) || 0,
          reviewCount: p.total_reviews || 0,
          verified: p.verification_level !== "Basic",
          image: p.profile_image_url || DEFAULT_IMAGE,
          yearsExperience: p.years_experience || 0,
          pricingLabel: p.pricing_model || "Quote-based", // ← fixed: no longer misusing years_experience
          phone: p.phone_number || "",
          whatsapp: p.whatsapp_number || p.phone_number || "",
          services: provServices,
          matchedService: null,
        };
      });

      setAllProviders(ui);
      setLoading(false);
    };
    fetchData();
  }, [category]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      const { data } = await supabase
        .from("services")
        .select("name")
        .eq("is_active", true)
        .ilike("name", `%${q}%`)
        .limit(4);
      const names = (data || []).map((s: any) => s.name);
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

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();

    let results = allProviders
      .map((p) => {
        let matchedService: UiProvider["matchedService"] = null;
        if (q) {
          for (const s of p.services) {
            if (s.name.toLowerCase() === q) {
              matchedService = s;
              break;
            }
            if (!matchedService && s.name.toLowerCase().includes(q))
              matchedService = s;
          }
          const textMatch =
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.city.toLowerCase().includes(q);
          if (!matchedService && !textMatch) return null;
        }
        return {
          ...p,
          matchedService,
          tagline: matchedService ? matchedService.name : p.tagline,
        };
      })
      .filter(Boolean) as UiProvider[];

    if (selectedCity !== "All Cities") {
      results = results.filter(
        (p) => p.worksNationwide || p.city === selectedCity,
      );
    }

    results.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "reviews") return b.reviewCount - a.reviewCount;
      if (sortBy === "experience") return b.yearsExperience - a.yearsExperience;
      return 0;
    });

    setFiltered(results);
  }, [allProviders, searchQuery, selectedCity, sortBy]);

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

  // ← FIXED: no search = always show pricingLabel pill, never a raw price
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

    return {
      label: null,
      amount: p.pricingLabel || "Quote-based",
      isPrice: false,
    };
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

  const pageTitle =
    initialCity !== "All Cities"
      ? `${category} in ${initialCity}, Zimbabwe`
      : `${category} Services in Zimbabwe`;

  const pageDesc =
    initialCity !== "All Cities"
      ? `Find ${filtered.length || "trusted"} verified ${category} professionals in ${initialCity}. Compare prices, read reviews and contact directly via WhatsApp or phone on ZimServ.`
      : `Find verified ${category} professionals across Zimbabwe. Browse ${filtered.length || "trusted"} providers in Harare, Bulawayo and more. Contact directly on ZimServ.`;
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: pageTitle,
    description: pageDesc,
    numberOfItems: filtered.length,
    itemListElement: filtered.slice(0, 10).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "LocalBusiness",
        name: p.name,
        description: p.tagline,
        address: {
          "@type": "PostalAddress",
          addressLocality: p.city,
          addressCountry: "ZW",
        },
        aggregateRating:
          p.rating > 0
            ? {
                "@type": "AggregateRating",
                ratingValue: p.rating.toFixed(1),
                reviewCount: p.reviewCount,
              }
            : undefined,
        url: `https://www.zimserv.co.zw/providers/${p.slug}`,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      <SEO
        title={pageTitle}
        description={pageDesc}
        url={
          initialCity !== "All Cities"
            ? `/services/${categorySlug}/${citySlug}`
            : `/services/${categorySlug}`
        }
        keywords={[
          `${category} Zimbabwe`,
          initialCity !== "All Cities"
            ? `${category} ${initialCity}`
            : `${category} Harare`,
          `hire ${category.toLowerCase()} Zimbabwe`,
          `best ${category.toLowerCase()} Zimbabwe`,
          "ZimServ service providers",
        ]}
      />

      <style>{`
        .scp-page{width:100%;min-height:100vh;background:var(--color-bg-section);padding:40px 0 80px;font-family:var(--font-primary)}
        .scp-container{max-width:var(--container-max-width);margin:0 auto;padding:0 var(--container-padding)}
        .scp-header{margin-bottom:20px}
        .scp-title{font-size:20px;font-weight:800;color:var(--color-primary);letter-spacing:-1px;margin-bottom:6px}
        .scp-subtitle{font-size:14px;color:var(--color-text-secondary);font-weight:500}
        .scp-search-section{background:var(--color-bg);border:1.5px solid var(--color-border);border-radius:var(--radius-lg);padding:20px;margin-bottom:24px;box-shadow:var(--shadow-sm)}
        .scp-search-row{display:grid;grid-template-columns:1fr auto;gap:12px}
        .scp-search-wrap{position:relative}
        .scp-search-icon{position:absolute;left:16px;top:50%;transform:translateY(-50%);color:var(--color-text-secondary);pointer-events:none;z-index:1}
        .scp-search-input{width:100%;padding:13px 40px 13px 46px;border:1.5px solid var(--color-border);border-radius:var(--radius-md);font-family:var(--font-primary);font-size:14px;font-weight:500;color:var(--color-primary);background:var(--color-bg);transition:all var(--transition-fast);box-sizing:border-box}
        .scp-search-input:focus{outline:none;border-color:var(--color-accent);box-shadow:0 0 0 3px var(--color-accent-soft)}
        .scp-search-input.has-suggestions{border-bottom-left-radius:0;border-bottom-right-radius:0;border-bottom-color:transparent}
        .scp-search-input::placeholder{color:var(--color-text-secondary)}
        .scp-suggestions{position:absolute;top:100%;left:0;right:0;background:var(--color-bg);border:1.5px solid var(--color-accent);border-top:none;border-bottom-left-radius:var(--radius-md);border-bottom-right-radius:var(--radius-md);box-shadow:var(--shadow-md);z-index:100;overflow:hidden}
        .scp-suggestion-item{padding:11px 16px 11px 46px;font-size:14px;font-weight:500;color:var(--color-primary);cursor:pointer;border-bottom:1px solid var(--color-border);transition:background var(--transition-fast)}
        .scp-suggestion-item:last-child{border-bottom:none}
        .scp-suggestion-item:hover,.scp-suggestion-item.active{background:var(--color-accent-soft)}
        .scp-select{padding:13px 36px 13px 14px;border:1.5px solid var(--color-border);border-radius:var(--radius-md);font-family:var(--font-primary);font-size:14px;font-weight:600;color:var(--color-primary);background:var(--color-bg);cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;min-width:140px;transition:all var(--transition-fast)}
        .scp-select:focus{outline:none;border-color:var(--color-accent);box-shadow:0 0 0 3px var(--color-accent-soft)}
        .scp-results-bar{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;gap:16px}
        .scp-results-count{font-size:15px;color:var(--color-text-secondary);font-weight:500}
        .scp-results-count strong{color:var(--color-accent);font-weight:700}
        .scp-sort-wrap{display:flex;align-items:center;gap:8px}
        .scp-sort-label{font-size:14px;color:var(--color-text-secondary);font-weight:500;white-space:nowrap}
        .scp-sort-select{padding:8px 30px 8px 12px;border:1.5px solid var(--color-border);border-radius:var(--radius-md);font-family:var(--font-primary);font-size:14px;font-weight:600;color:var(--color-primary);background:var(--color-bg);cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 8px center}
        .scp-sort-select:focus{outline:none;border-color:var(--color-accent)}
        .scp-content-block{background:var(--color-bg);border:1.5px solid var(--color-border);border-radius:var(--radius-lg);padding:28px 32px;margin-bottom:28px}
        .scp-content-title{font-size:20px;font-weight:800;color:var(--color-primary);letter-spacing:-0.4px;margin-bottom:14px}
        .scp-content-p{font-size:14px;color:var(--color-text-secondary);line-height:1.75;margin-bottom:12px}
        .scp-content-p:last-child{margin-bottom:0}
        .scp-read-more-content{overflow:hidden;transition:max-height 0.4s ease,opacity 0.3s ease}
        .scp-read-more-content.collapsed{max-height:0;opacity:0}
        .scp-read-more-content.expanded{max-height:900px;opacity:1}
        .scp-read-more-btn{background:none;border:none;color:var(--color-accent);font-family:var(--font-primary);font-size:13.5px;font-weight:700;cursor:pointer;padding:0;margin-top:6px;display:inline-flex;align-items:center;gap:5px;transition:color var(--transition-fast)}
        .scp-read-more-btn:hover{color:var(--color-accent-hover)}
        .scp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:36px}
        .scp-card{background:var(--color-bg);border:1.5px solid var(--color-border);border-radius:var(--radius-xl);overflow:hidden;cursor:pointer;position:relative;display:flex;flex-direction:column;transition:transform 0.3s cubic-bezier(0.22,1,0.36,1),box-shadow 0.3s ease,border-color 0.25s ease}
        .scp-card:hover{transform:translateY(-5px);box-shadow:var(--shadow-lg),0 0 0 1px rgba(236,111,22,0.1);border-color:var(--color-accent-light)}
        .scp-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--color-accent),var(--color-accent-light));transform:scaleX(0);transform-origin:left;transition:transform 0.35s cubic-bezier(0.22,1,0.36,1);z-index:2}
        .scp-card:hover::before{transform:scaleX(1)}
        .scp-img-wrap{position:relative;aspect-ratio:4/3;overflow:hidden;flex-shrink:0}
        .scp-img{width:100%;height:100%;object-fit:cover;object-position:center top;display:block;transition:transform 0.55s cubic-bezier(0.22,1,0.36,1)}
        .scp-card:hover .scp-img{transform:scale(1.06)}
        .scp-img-scrim{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(28,25,23,0.08) 0%,transparent 40%,rgba(28,25,23,0.52) 100%)}
        .scp-img-top{position:absolute;top:12px;left:12px;right:12px;display:flex;justify-content:space-between;align-items:flex-start}
        .scp-verified-pill{display:flex;align-items:center;gap:5px;padding:5px 10px;background:rgba(28,25,23,0.55);backdrop-filter:blur(8px);color:#fff;border-radius:var(--radius-full);font-size:11px;font-weight:600;border:1px solid rgba(255,255,255,0.12)}
        .scp-verified-pill svg{color:#4ade80}
        .scp-body{padding:18px 20px 20px;display:flex;flex-direction:column;flex:1}
        .scp-name-row{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:3px}
        .scp-name{font-size:18px;font-weight:800;color:var(--color-primary);letter-spacing:-0.4px;line-height:1.2;flex:1;transition:color var(--transition-fast)}
        .scp-card:hover .scp-name{color:var(--color-accent)}
        .scp-price-block{display:flex;flex-direction:column;align-items:flex-end;gap:2px}
        .scp-price-from{font-size:9.5px;font-weight:700;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:.09em;line-height:1}
        .scp-price-amount{font-size:16px;font-weight:800;color:var(--color-accent);letter-spacing:-0.5px;line-height:1.2;white-space:nowrap}
        .scp-price-quote{font-size:11.5px;font-weight:600;color:var(--color-text-secondary);background:var(--color-bg-section);border:1px solid var(--color-border);border-radius:var(--radius-full);padding:3px 9px;margin-top:2px;white-space:nowrap}
        .scp-tagline{font-size:13px;color:var(--color-text-secondary);line-height:1.45;margin-bottom:14px}
        .scp-chips{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:10px}
        .scp-chip{display:inline-flex;align-items:center;gap:5px;padding:5px 10px;background:var(--color-bg-section);border:1px solid var(--color-border);border-radius:var(--radius-sm);font-size:12px;color:var(--color-text-secondary);font-weight:500;transition:border-color 0.2s,background 0.2s}
        .scp-card:hover .scp-chip{border-color:rgba(236,111,22,0.25);background:var(--color-accent-soft)}
        .scp-chip svg{color:var(--color-accent);flex-shrink:0}
        .scp-areas{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:10px;min-height:24px}
        .scp-areas-label{font-size:12px;font-weight:600;color:var(--color-text-secondary);white-space:nowrap;flex-shrink:0}
        .scp-area-tag{display:inline-flex;padding:3px 9px;background:var(--color-accent-soft);color:var(--color-text-secondary);border-radius:6px;font-size:11px;font-weight:600;white-space:nowrap}
        .scp-area-tag.nationwide{color:var(--color-accent);border:1px solid var(--color-accent-light);font-weight:700}
        .scp-rating-row{display:flex;align-items:center;gap:8px;margin-bottom:6px}
        .scp-stars{display:flex;gap:2px}
        .scp-rating-num{font-size:14px;font-weight:700;color:var(--color-primary);letter-spacing:-0.2px}
        .scp-review-ct{font-size:12.5px;color:var(--color-text-secondary)}
        .scp-new-badge{font-size:11px;font-weight:700;color:var(--color-accent);background:var(--color-accent-soft);padding:2px 8px;border-radius:var(--radius-full)}
        .scp-views-today{font-size:12px;color:var(--color-text-secondary);margin-bottom:10px}
        .scp-divider{height:1px;background:var(--color-border);margin-bottom:14px}
        .scp-actions{display:grid;grid-template-columns:1fr 1fr auto;gap:8px;margin-top:auto}
        .scp-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:11px 14px;border-radius:var(--radius-md);font-family:var(--font-primary);font-size:13px;font-weight:700;cursor:pointer;border:none;transition:background 0.2s,transform 0.15s,box-shadow 0.2s,border-color 0.2s,color 0.2s;white-space:nowrap}
        .scp-btn-wa{background:var(--color-accent);color:#fff;box-shadow:0 3px 14px rgba(236,111,22,0.32)}
        .scp-btn-wa:hover{background:var(--color-accent-hover);transform:translateY(-1px);box-shadow:0 6px 20px rgba(236,111,22,0.44)}
        .scp-btn-call{background:var(--color-bg);color:var(--color-text-secondary);border:1.5px solid var(--color-border)}
        .scp-btn-call:hover{background:#f0fdf4;border-color:#16a34a;color:#16a34a;transform:translateY(-1px)}
        .scp-btn-profile{width:42px;height:42px;display:flex;align-items:center;justify-content:center;background:var(--color-bg);border:1.5px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-accent);cursor:pointer;flex-shrink:0;transition:background 0.2s,border-color 0.2s,transform 0.2s}
        .scp-btn-profile:hover{background:var(--color-accent-soft);border-color:var(--color-accent);transform:translateY(-1px)}
        .scp-lock-badge{position:absolute;bottom:10px;right:10px;display:flex;align-items:center;gap:4px;padding:4px 9px;background:rgba(28,25,23,0.6);backdrop-filter:blur(8px);border-radius:var(--radius-full);font-size:11px;font-weight:600;color:rgba(255,255,255,0.85);border:1px solid rgba(255,255,255,0.1);pointer-events:none}
        .scp-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.55);backdrop-filter:blur(4px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px}
        .scp-modal{background:var(--color-bg);border-radius:var(--radius-xl);padding:40px 36px 32px;max-width:400px;width:100%;position:relative;box-shadow:0 24px 64px rgba(0,0,0,0.18);text-align:center;border:1.5px solid var(--color-border)}
        .scp-modal-close{position:absolute;top:14px;right:14px;background:none;border:none;cursor:pointer;color:var(--color-text-secondary);display:flex;padding:4px;border-radius:var(--radius-sm);transition:background var(--transition-fast)}
        .scp-modal-close:hover{background:var(--color-bg-section)}
        .scp-modal-icon{font-size:40px;margin-bottom:16px}
        .scp-modal-title{font-size:22px;font-weight:800;color:var(--color-primary);letter-spacing:-0.5px;margin-bottom:8px}
        .scp-modal-desc{font-size:14px;color:var(--color-text-secondary);line-height:1.65;margin-bottom:24px}
        .scp-modal-actions{display:flex;flex-direction:column;gap:10px}
        .scp-google-btn{display:flex;align-items:center;justify-content:center;gap:10px;padding:13px 20px;background:#fff;border:1.5px solid var(--color-border);border-radius:var(--radius-md);font-family:var(--font-primary);font-size:15px;font-weight:700;color:var(--color-primary);cursor:pointer;transition:box-shadow 0.2s,border-color 0.2s,transform 0.15s;box-shadow:var(--shadow-sm)}
        .scp-google-btn:hover:not(:disabled){box-shadow:var(--shadow-md);border-color:var(--color-accent);transform:translateY(-1px)}
        .scp-google-btn:disabled{opacity:0.6;cursor:not-allowed}
        .scp-cancel-btn{background:none;border:none;font-family:var(--font-primary);font-size:14px;font-weight:600;color:var(--color-text-secondary);cursor:pointer;padding:8px;transition:color var(--transition-fast)}
        .scp-cancel-btn:hover{color:var(--color-primary)}
        .scp-links-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:12px}
        .scp-links-widget{background:var(--color-bg);border:1.5px solid var(--color-border);border-radius:var(--radius-lg);padding:24px}
        .scp-links-title{font-size:15px;font-weight:700;color:var(--color-primary);margin-bottom:14px;letter-spacing:-0.2px}
        .scp-link-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px}
        .scp-link-item a{font-size:13.5px;color:var(--color-text-secondary);font-weight:500;text-decoration:none;transition:color var(--transition-fast)}
        .scp-link-item a:hover{color:var(--color-accent)}
        .scp-link-item.primary a{color:var(--color-accent);font-weight:600}
        .scp-empty{text-align:center;padding:80px 20px;background:var(--color-bg);border-radius:var(--radius-lg);border:1.5px dashed var(--color-border);margin-bottom:36px}
        .scp-empty h3{font-size:22px;font-weight:700;color:var(--color-primary);margin-bottom:8px}
        .scp-empty p{font-size:15px;color:var(--color-text-secondary);margin-bottom:20px}
        .scp-empty-btn{padding:12px 28px;background:var(--color-accent);color:#fff;border:none;border-radius:var(--radius-full);font-weight:700;font-size:14px;cursor:pointer;font-family:var(--font-primary)}
        @keyframes scp-shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}
        .scp-shimmer{background:linear-gradient(90deg,var(--color-border) 25%,var(--color-bg) 50%,var(--color-border) 75%);background-size:600px 100%;animation:scp-shimmer 1.4s ease-in-out infinite;border-radius:6px}
        @media(max-width:1200px){.scp-container{padding:0 32px}.scp-grid{gap:16px}}
        @media(max-width:900px){.scp-page{padding:32px 0 60px}.scp-container{padding:0 24px}.scp-search-row{grid-template-columns:1fr}.scp-select{width:100%}.scp-results-bar{flex-direction:column;align-items:flex-start}.scp-sort-wrap{width:100%}.scp-sort-select{flex:1}.scp-links-grid{grid-template-columns:1fr}.scp-content-block{padding:20px}}
        @media(max-width:768px){.scp-grid{grid-template-columns:1fr}}
        @media(max-width:640px){.scp-page{padding:24px 0 48px}.scp-container{padding:0 16px}.scp-title{font-size:20px;letter-spacing:-0.8px}.scp-price-amount{font-size:18px}.scp-actions{grid-template-columns:1fr 1fr}.scp-btn-profile{grid-column:1/-1;width:100%;border-radius:var(--radius-md)}.scp-btn-profile::after{content:'View Profile';font-size:13px;font-weight:700;margin-left:6px}}
        @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}}
      `}</style>

      <Breadcrumb
        items={[
          { label: "Services", path: "/categories" },
          ...(initialCity !== "All Cities"
            ? [
                { label: category, path: `/services/${categorySlug}` },
                { label: initialCity },
              ]
            : [{ label: category }]),
        ]}
      />

      <div className="scp-page">
        <div className="scp-container">
          {/* HEADER */}
          <div className="scp-header">
            <h1 className="scp-title">
              {initialCity !== "All Cities"
                ? `${category} Providers in ${initialCity}`
                : `${category} Service Providers in Zimbabwe`}
            </h1>
            <p className="scp-subtitle">
              Browse verified {category.toLowerCase()} professionals
              {initialCity !== "All Cities"
                ? ` in ${initialCity}`
                : " across Zimbabwe"}
            </p>
          </div>

          {/* SEARCH */}
          <div className="scp-search-section">
            <div className="scp-search-row">
              <div className="scp-search-wrap" ref={searchWrapRef}>
                <Search
                  size={16}
                  strokeWidth={2.5}
                  className="scp-search-icon"
                />
                <input
                  type="text"
                  className={`scp-search-input${showSuggestions ? " has-suggestions" : ""}`}
                  placeholder={`Search ${category.toLowerCase()} services…`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() =>
                    suggestions.length > 0 && setShowSuggestions(true)
                  }
                  onKeyDown={handleSearchKeyDown}
                  autoComplete="off"
                />
                {searchQuery && (
                  <button
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 4,
                      color: "var(--color-text-secondary)",
                      display: "flex",
                    }}
                    onClick={() => {
                      setSearchQuery("");
                      setSuggestions([]);
                      setShowSuggestions(false);
                    }}
                  >
                    <X size={14} strokeWidth={2.5} />
                  </button>
                )}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="scp-suggestions">
                    {suggestions.map((s, i) => (
                      <div
                        key={s}
                        className={`scp-suggestion-item${i === activeIndex ? " active" : ""}`}
                        onMouseDown={() => {
                          setSearchQuery(s);
                          setShowSuggestions(false);
                        }}
                        onMouseEnter={() => setActiveIndex(i)}
                      >
                        {highlightMatch(s, searchQuery)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <select
                className="scp-select"
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
          </div>

          {/* RESULTS BAR */}
          {!loading && (
            <div className="scp-results-bar">
              <p className="scp-results-count">
                <strong>{filtered.length}</strong>{" "}
                {filtered.length === 1 ? "provider" : "providers"} found
                {selectedCity !== "All Cities" ? ` in ${selectedCity}` : ""}
                {!currentUser && (
                  <span
                    style={{
                      marginLeft: 10,
                      fontSize: 12,
                      color: "var(--color-text-secondary)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Lock size={11} strokeWidth={2.5} /> Sign in to contact
                  </span>
                )}
              </p>
              <div className="scp-sort-wrap">
                <span className="scp-sort-label">Sort by</span>
                <select
                  className="scp-sort-select"
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
          )}

          {/* SEO CONTENT BLOCK */}
          {!loading && (
            <SeoContentBlock
              category={category}
              initialCity={initialCity}
              filtered={filtered}
            />
          )}

          {/* GRID */}
          {loading ? (
            <div className="scp-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--color-bg)",
                    border: "1.5px solid var(--color-border)",
                    borderRadius: "var(--radius-xl)",
                    overflow: "hidden",
                  }}
                >
                  <div className="scp-shimmer" style={{ aspectRatio: "4/3" }} />
                  <div
                    style={{
                      padding: "18px 20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <div
                      className="scp-shimmer"
                      style={{ height: 18, width: "60%" }}
                    />
                    <div
                      className="scp-shimmer"
                      style={{ height: 13, width: "80%" }}
                    />
                    <div
                      className="scp-shimmer"
                      style={{ height: 13, width: "50%" }}
                    />
                    <div
                      className="scp-shimmer"
                      style={{ height: 38, width: "100%", marginTop: 8 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="scp-empty">
              <h3>No {category.toLowerCase()} providers found</h3>
              <p>
                Try adjusting your search or{" "}
                {selectedCity !== "All Cities"
                  ? "switch to All Cities"
                  : "browse all categories"}
                .
              </p>
              <button
                className="scp-empty-btn"
                onClick={() => navigate(`/services/${categorySlug}`)}
              >
                Browse All {category} Providers
              </button>
            </div>
          ) : (
            <div className="scp-grid">
              {filtered.map((provider) => {
                const priceDisplay = getPriceDisplay(provider);
                const waNum = (
                  provider.whatsapp ||
                  provider.phone ||
                  ""
                ).replace(/\D/g, "");
                const viewsToday =
                  3 +
                  (parseInt(
                    provider.id.replace(/\D/g, "").slice(-2) || "0",
                    10,
                  ) %
                    18);

                return (
                  <div
                    key={provider.id}
                    className="scp-card"
                    onClick={() =>
                      handleViewProfile(provider.slug, provider.id)
                    }
                  >
                    {/* Image */}
                    <div className="scp-img-wrap">
                      <img
                        src={provider.image}
                        alt={`${provider.name} - ${provider.category} in ${provider.city}`}
                        className="scp-img"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                        }}
                      />
                      <div className="scp-img-scrim" />
                      <div className="scp-img-top">
                        {provider.verified && (
                          <span className="scp-verified-pill">
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#4ade80"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Verified
                          </span>
                        )}
                      </div>
                      {!currentUser && (
                        <div className="scp-lock-badge">
                          <Lock size={10} strokeWidth={2.5} /> Sign in to
                          contact
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="scp-body">
                      <div className="scp-name-row">
                        <span className="scp-name">{provider.name}</span>
                        <div className="scp-price-block">
                          {priceDisplay.isPrice && (
                            <span className="scp-price-from">from</span>
                          )}
                          {priceDisplay.isPrice ? (
                            <span className="scp-price-amount">
                              {priceDisplay.amount}
                            </span>
                          ) : (
                            <span className="scp-price-quote">
                              {priceDisplay.amount}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="scp-tagline">{provider.tagline}</p>

                      <div className="scp-chips">
                        <span className="scp-chip">
                          <MapPin size={12} strokeWidth={2} /> {provider.city}
                        </span>
                        {provider.yearsExperience > 0 && (
                          <span className="scp-chip">
                            <Briefcase size={12} strokeWidth={2} />
                            {provider.yearsExperience}yr
                            {provider.yearsExperience !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>

                      {/* AREAS */}
                      <div className="scp-areas">
                        <span className="scp-areas-label">Areas:</span>
                        {provider.worksNationwide ? (
                          <span className="scp-area-tag nationwide">
                            🌍 Nationwide
                          </span>
                        ) : provider.areas.length > 0 ? (
                          <>
                            {provider.areas.slice(0, 3).map((a) => (
                              <span key={a} className="scp-area-tag">
                                {a}
                              </span>
                            ))}
                            {provider.areas.length > 3 && (
                              <span
                                style={{
                                  fontSize: 11,
                                  color: "var(--color-text-secondary)",
                                }}
                              >
                                +{provider.areas.length - 3} more
                              </span>
                            )}
                          </>
                        ) : (
                          <span
                            style={{
                              fontSize: 12,
                              color: "var(--color-text-secondary)",
                            }}
                          >
                            Not specified
                          </span>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="scp-rating-row">
                        <div className="scp-stars">
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
                            <span className="scp-rating-num">
                              {provider.rating.toFixed(1)}
                            </span>
                            <span className="scp-review-ct">
                              ({provider.reviewCount}{" "}
                              {provider.reviewCount === 1
                                ? "review"
                                : "reviews"}
                              )
                            </span>
                          </>
                        ) : (
                          <span className="scp-new-badge">NEW</span>
                        )}
                      </div>

                      <p className="scp-views-today">
                        {viewsToday} people viewed today
                      </p>
                      <div className="scp-divider" />

                      {/* Actions */}
                      <div
                        className="scp-actions"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="scp-btn scp-btn-wa"
                          onClick={(e) =>
                            handleContactClick(
                              e,
                              () => {
                                if (!waNum) return;
                                const message = provider.matchedService
                                  ? `Hi, I found you on ZimServ and I'm interested in your *${provider.matchedService.name}* service${provider.matchedService.price != null ? ` (priced starting from $${provider.matchedService.price.toFixed(2)})` : " (price on request)"}. Are you available?`
                                  : `Hi, I found you on ZimServ and I need your *${provider.category}* service. Are you available?`;
                                window.open(
                                  `https://wa.me/${waNum}?text=${encodeURIComponent(message)}`,
                                  "_blank",
                                );
                              },
                              "whatsapp_click",
                              provider.id,
                            )
                          }
                        >
                          <MessageCircle size={15} strokeWidth={2} /> WhatsApp
                        </button>

                        <button
                          className="scp-btn scp-btn-call"
                          onClick={(e) =>
                            handleContactClick(
                              e,
                              () => {
                                if (provider.phone)
                                  window.open(`tel:${provider.phone}`, "_self");
                              },
                              "call_click",
                              provider.id,
                            )
                          }
                        >
                          <Phone size={15} strokeWidth={2} /> Call
                        </button>

                        <button
                          className="scp-btn-profile"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewProfile(provider.slug, provider.id);
                          }}
                        >
                          <ChevronRight size={18} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* INTERNAL LINKS */}
          {!loading && (
            <section className="scp-links-grid">
              <div className="scp-links-widget">
                <h3 className="scp-links-title">{category} by City</h3>
                <ul className="scp-link-list">
                  <li className="scp-link-item primary">
                    <a href={`/services/${categorySlug}`}>
                      → All {category} Providers in Zimbabwe
                    </a>
                  </li>
                  {CITIES.filter(
                    (c) => c !== "All Cities" && c !== initialCity,
                  ).map((c) => (
                    <li key={c} className="scp-link-item">
                      <a
                        href={`/services/${categorySlug}/${c.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {category} in {c}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="scp-links-widget">
                <h3 className="scp-links-title">
                  Related Services
                  {initialCity !== "All Cities"
                    ? ` in ${initialCity}`
                    : " in Zimbabwe"}
                </h3>
                <ul className="scp-link-list">
                  {relatedCategories
                    .filter((s) => s.toLowerCase() !== category.toLowerCase())
                    .slice(0, 7)
                    .map((s) => {
                      const slug = s
                        .toLowerCase()
                        .replace(/&/g, "and")
                        .replace(/[^a-z0-9\s-]/g, "")
                        .replace(/\s+/g, "-")
                        .replace(/-+/g, "-")
                        .replace(/^-|-$/g, "");
                      return (
                        <li key={s} className="scp-link-item">
                          <a
                            href={
                              initialCity !== "All Cities"
                                ? `/services/${slug}/${citySlug}`
                                : `/services/${slug}`
                            }
                          >
                            {s}
                            {initialCity !== "All Cities"
                              ? ` in ${initialCity}`
                              : " in Zimbabwe"}
                          </a>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* LOGIN MODAL */}
      {showLoginPrompt && (
        <div className="scp-overlay" onClick={() => setShowLoginPrompt(false)}>
          <div className="scp-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="scp-modal-close"
              onClick={() => setShowLoginPrompt(false)}
            >
              <X size={18} strokeWidth={2} />
            </button>
            <div className="scp-modal-icon">🔒</div>
            <h2 className="scp-modal-title">Sign in to contact</h2>
            <p className="scp-modal-desc">
              Create a free ZimServ account to reach any provider directly by
              WhatsApp or phone — no fees, no middlemen.
            </p>
            <div className="scp-modal-actions">
              <button
                className="scp-google-btn"
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
                className="scp-cancel-btn"
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

export default ServiceCategoryPage;
