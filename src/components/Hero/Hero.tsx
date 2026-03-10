// src/components/Hero/Hero.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ArrowRight, CheckCircle, Users } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

const ZIMBABWE_CITIES = [
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
  "Norton",
  "Marondera",
  "Ruwa",
];

interface Suggestion {
  name: string;
  matchedKeyword: string;
}

const Hero = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch suggestions from Supabase
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
        .select("name, search_keywords")
        .eq("is_active", true)
        .or(`name.ilike.%${q}%,search_keywords.cs.{${q}}`)
        .limit(4);

      if (error || !data) return;

      const results: Suggestion[] = [];
      const seen = new Set<string>();

      for (const service of data) {
        if (seen.has(service.name)) continue;
        seen.add(service.name);

        // Find which keyword matched
        const matchedKeyword =
          service.search_keywords?.find((kw: string) =>
            kw.toLowerCase().includes(q),
          ) ?? service.name;

        results.push({ name: service.name, matchedKeyword });
      }

      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setActiveIndex(-1);
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      setShowSuggestions(false);
      const params = new URLSearchParams();
      params.append("q", q);
      if (selectedCity !== "All Cities") params.append("city", selectedCity);
      navigate(`/providers?${params.toString()}`);
    }
  };

  const handleSuggestionClick = (name: string) => {
    setSearchQuery(name);
    setShowSuggestions(false);
    const params = new URLSearchParams();
    params.append("q", name);
    if (selectedCity !== "All Cities") params.append("city", selectedCity);
    navigate(`/providers?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[activeIndex].name);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const highlightMatch = (text: string, query: string) => {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <span>{text}</span>;
    return (
      <>
        {text.slice(0, idx)}
        <strong>{text.slice(idx, idx + query.length)}</strong>
        {text.slice(idx + query.length)}
      </>
    );
  };

  return (
    <>
      <style>{`
        /* ── HERO SECTION ─────────────────────────────────── */
        .hero-root {
          width: 100%;
          background: var(--color-bg-section);
          padding-top: 72px;
          position: relative;
          overflow: hidden;
          min-height: 650px;
          display: flex;
          align-items: center;
        }

        .hero-container {
          max-width: var(--container-max-width);
          margin: 0 auto;
          padding: 80px var(--container-padding) 60px;
          display: grid;
          grid-template-columns: 1fr 540px;
          gap: 80px;
          align-items: center;
          position: relative;
          z-index: 1;
          margin-top: -10px;
        }

        .hero-content { max-width: 640px; }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: var(--color-accent-soft);
          color: var(--color-accent);
          padding: 6px 16px;
          border-radius: var(--radius-full);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .hero-headline {
          font-family: var(--font-primary);
          font-size: 45px;
          font-weight: 800;
          color: var(--color-primary);
          line-height: 1.1;
          margin-bottom: 20px;
          letter-spacing: -1.8px;
        }

        .hero-headline-accent { color: var(--color-accent); }

        .hero-subtext {
          font-size: 18px;
          color: var(--color-text-secondary);
          line-height: 1.65;
          margin-bottom: 40px;
          font-weight: 400;
        }

        /* ── SEARCH FORM ──────────────────────────────────── */
        .hero-search {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 36px;
        }

        /* wrapper for input + dropdown */
        .hero-input-outer {
          position: relative;
        }

        .hero-input-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 18px 24px;
          box-shadow: var(--shadow-sm);
          transition: border-color var(--transition-base), box-shadow var(--transition-base);
        }

        .hero-input-wrap:focus-within {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 4px var(--color-accent-soft), var(--shadow-md);
        }

        .hero-input-wrap.has-suggestions {
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
          border-bottom-color: transparent;
        }

        .hero-search-icon { color: var(--color-text-secondary); flex-shrink: 0; }
        .hero-input-wrap:focus-within .hero-search-icon { color: var(--color-accent); }

        .hero-input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-family: var(--font-primary);
          font-size: 16px;
          font-weight: 500;
          color: var(--color-primary);
        }

        .hero-input::placeholder { color: var(--color-text-secondary); }

        /* ── SUGGESTIONS DROPDOWN ─────────────────────────── */
        .hero-suggestions {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: var(--color-bg);
          border: 1.5px solid var(--color-accent);
          border-top: none;
          border-bottom-left-radius: var(--radius-lg);
          border-bottom-right-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          z-index: 100;
          overflow: hidden;
        }

        .hero-suggestion-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 12px 24px;
          cursor: pointer;
          transition: background var(--transition-fast);
          border-bottom: 1px solid var(--color-border);
        }

        .hero-suggestion-item:last-child { border-bottom: none; }

        .hero-suggestion-item:hover,
        .hero-suggestion-item.active {
          background: var(--color-accent-soft);
        }

        .hero-suggestion-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-primary);
        }

        .hero-suggestion-name strong {
          color: var(--color-accent);
          font-weight: 700;
        }

        .hero-suggestion-keyword {
          font-size: 12px;
          color: var(--color-text-secondary);
          font-weight: 400;
        }

        .hero-suggestion-keyword strong {
          color: var(--color-accent);
          font-weight: 600;
        }

        /* ── CITY + BUTTON ROW ────────────────────────────── */
        .hero-search-row {
          display: flex;
          gap: 12px;
          align-items: stretch;
        }

        .hero-city-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 18px 24px;
          box-shadow: var(--shadow-sm);
          transition: border-color var(--transition-base), box-shadow var(--transition-base);
        }

        .hero-city-wrap:focus-within {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 4px var(--color-accent-soft), var(--shadow-md);
        }

        .hero-city-icon { color: var(--color-accent); flex-shrink: 0; }

        .hero-city-select {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-family: var(--font-primary);
          font-size: 16px;
          font-weight: 600;
          color: var(--color-primary);
          cursor: pointer;
          -webkit-appearance: none;
          appearance: none;
        }

        .hero-btn {
          background: var(--color-accent);
          color: #fff;
          border: none;
          border-radius: var(--radius-lg);
          padding: 18px 40px;
          font-family: var(--font-primary);
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          letter-spacing: 0.3px;
          box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
          transition: background var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast), opacity var(--transition-fast);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hero-btn:hover:not(:disabled) {
          background: var(--color-accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(37, 99, 235, 0.4);
        }

        .hero-btn:active:not(:disabled) { transform: scale(0.98); }
        .hero-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ── STATS ────────────────────────────────────────── */
        .hero-stats { display: flex; gap: 36px; flex-wrap: wrap; }

        .hero-stat { display: flex; align-items: center; gap: 8px; }
        .hero-stat-icon { color: var(--color-accent); flex-shrink: 0; }

        .hero-stat-text {
          font-size: 15px;
          font-weight: 400;
          color: var(--color-text-secondary);
          line-height: 1.3;
        }

        .hero-stat-number { color: var(--color-accent); font-weight: 700; }

        /* ── RIGHT IMAGE ──────────────────────────────────── */
        .hero-image-wrap {
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          height: 100%;
          min-height: 580px;
        }

        .hero-image {
          width: 100%;
          height: auto;
          max-height: 650px;
          object-fit: contain;
          object-position: bottom center;
          filter: drop-shadow(0 16px 40px rgba(15, 23, 42, 0.08));
        }

        .hero-float {
          position: absolute;
          top: 40px;
          right: -50px;
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 14px 18px;
          box-shadow: var(--shadow-lg);
          display: flex;
          align-items: center;
          gap: 12px;
          animation: hero-float 3s ease-in-out infinite;
        }

        @keyframes hero-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .hero-float-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--color-accent-soft);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-accent);
          flex-shrink: 0;
        }

        .hero-float-text { font-size: 13px; font-weight: 700; color: var(--color-primary); line-height: 1.2; margin-bottom: 2px; }
        .hero-float-sub { font-size: 12px; font-weight: 500; color: var(--color-text-secondary); line-height: 1.2; }

        /* ── RESPONSIVE ───────────────────────────────────── */
        @media (max-width: 1200px) { .hero-container { gap: 60px; } .hero-headline { font-size: 50px; } }

        @media (max-width: 1024px) {
          .hero-container { grid-template-columns: 1fr 440px; gap: 48px; padding: 60px 32px 48px; }
          .hero-headline { font-size: 44px; }
        }

        @media (max-width: 900px) {
          .hero-root { min-height: auto; }
          .hero-container { grid-template-columns: 1fr; padding: 48px 24px; text-align: center; }
          .hero-content { max-width: 100%; margin: 0 auto; }
          .hero-badge { margin: 0 auto 20px; }
          .hero-headline { font-size: 40px; }
          .hero-image-wrap { display: none; }
          .hero-stats { justify-content: center; }
        }

        @media (max-width: 640px) {
          .hero-container { padding: 36px 20px; }
          .hero-headline { font-size: 34px; letter-spacing: -1.2px; }
          .hero-subtext { font-size: 16px; margin-bottom: 32px; }
          .hero-input-wrap, .hero-city-wrap { padding: 16px 20px; }
          .hero-search-row { flex-direction: column; }
          .hero-btn { width: 100%; justify-content: center; padding: 16px; }
          .hero-stats { flex-direction: column; gap: 20px; align-items: center; }
        }

        @media (max-width: 480px) {
          .hero-container { padding: 60px 16px; }
          .hero-headline { font-size: 28px; }
          .hero-subtext { font-size: 14px; }
        }

        @media (prefers-reduced-motion: reduce) { .hero-float { animation: none !important; } }
      `}</style>

      <section className="hero-root">
        <div className="hero-container">
          {/* ── LEFT CONTENT ─────────────────────────────── */}
          <div className="hero-content">
            <div className="hero-badge">
              <CheckCircle size={12} strokeWidth={2.5} />
              Trusted by Thousands
            </div>

            <h1 className="hero-headline">
              Find Trusted{" "}
              <span className="hero-headline-accent">Service Providers</span> in
              Zimbabwe
            </h1>

            <p className="hero-subtext">
              Connect with verified professionals for plumbing, electrical,
              cleaning, repairs, and more—all in one place.
            </p>

            {/* ── SEARCH FORM ─────────────────────────────── */}
            <form className="hero-search" onSubmit={handleSearch}>
              {/* Service input + suggestions */}
              <div className="hero-input-outer" ref={wrapRef}>
                <div
                  className={`hero-input-wrap ${showSuggestions ? "has-suggestions" : ""}`}
                >
                  <Search
                    size={20}
                    className="hero-search-icon"
                    strokeWidth={2}
                  />
                  <input
                    type="text"
                    placeholder="What service do you need?"
                    className="hero-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() =>
                      suggestions.length > 0 && setShowSuggestions(true)
                    }
                    aria-label="Search for services"
                    autoComplete="off"
                  />
                </div>

                {showSuggestions && (
                  <div className="hero-suggestions">
                    {suggestions.map((s, i) => (
                      <div
                        key={s.name}
                        className={`hero-suggestion-item ${i === activeIndex ? "active" : ""}`}
                        onMouseDown={() => handleSuggestionClick(s.name)}
                        onMouseEnter={() => setActiveIndex(i)}
                      >
                        <span className="hero-suggestion-name">
                          {highlightMatch(s.name, searchQuery.trim())}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* City + Submit */}
              <div className="hero-search-row">
                <div className="hero-city-wrap">
                  <MapPin
                    size={18}
                    className="hero-city-icon"
                    strokeWidth={2.5}
                  />
                  <select
                    className="hero-city-select"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    aria-label="Select city"
                  >
                    {ZIMBABWE_CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="hero-btn"
                  disabled={!searchQuery.trim()}
                >
                  Search
                  <ArrowRight size={18} strokeWidth={2.5} />
                </button>
              </div>
            </form>

            {/* ── STATS ───────────────────────────────────── */}
            <div className="hero-stats">
              <div className="hero-stat">
                <CheckCircle
                  size={18}
                  className="hero-stat-icon"
                  strokeWidth={2}
                />
                <span className="hero-stat-text">
                  <span className="hero-stat-number">100+</span> Verified
                  Providers
                </span>
              </div>
              <div className="hero-stat">
                <Users size={18} className="hero-stat-icon" strokeWidth={2} />
                <span className="hero-stat-text">
                  <span className="hero-stat-number">1K+</span> Happy Customers
                </span>
              </div>
            </div>
          </div>

          {/* ── RIGHT IMAGE ──────────────────────────────── */}
          <div className="hero-image-wrap">
            <img
              src="/assets/hero.png"
              alt="Verified service provider"
              className="hero-image"
            />
            <div className="hero-float">
              <div className="hero-float-icon">
                <CheckCircle size={18} strokeWidth={2.5} />
              </div>
              <div>
                <div className="hero-float-text">All Verified</div>
                <div className="hero-float-sub">Background checked</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
