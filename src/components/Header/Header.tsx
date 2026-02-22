// src/components/Header/Header.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Menu, X, Grid, Briefcase, LogIn } from "lucide-react";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 10);
      setShowSearch(scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      const params = new URLSearchParams();
      params.append("q", q);
      navigate(`/providers?${params.toString()}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogoClick = () => {
    navigate("/");
    setSearchQuery("");
  };

  return (
    <>
      <style>{`
        /* ── HEADER ROOT ──────────────────────────────────── */
        .hdr-root {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          font-family: var(--font-primary);
        }

        .hdr-root::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(
            90deg,
            var(--color-accent) 0%,
            var(--color-accent-light) 50%,
            var(--color-accent) 100%
          );
          background-size: 200% 100%;
          animation: hdr-stripe 4s linear infinite;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .hdr-root.scrolled::before { opacity: 1; }

        @keyframes hdr-stripe {
          0%   { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }

        .hdr-bar {
          background: var(--color-bg);
          border-bottom: 1px solid var(--color-border);
          transition:
            box-shadow var(--transition-base),
            background var(--transition-base),
            backdrop-filter var(--transition-base),
            border-color var(--transition-base);
        }

        .hdr-root.scrolled .hdr-bar {
          background: var(--color-bg);
          backdrop-filter: blur(20px) saturate(180%);
          border-color: var(--color-divider);
          box-shadow: 0 1px 0 var(--color-border), var(--shadow-md);
        }

        .hdr-inner {
          max-width: var(--container-max-width);
          margin: 0 auto;
          padding: 0 var(--container-padding);
          height: 85px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 32px;
          transition: height var(--transition-base);
        }

        /* ── LOGO ─────────────────────────────────────────── */
        .hdr-logo {
          cursor: pointer;
          display: flex;
          align-items: center;
          flex-shrink: 0;
          filter: drop-shadow(var(--shadow-sm));
          transition: transform var(--transition-base), filter var(--transition-base);
        }

        .hdr-logo img {
          height: 44px;
          width: auto;
          display: block;
          transition: height var(--transition-base);
        }

        .hdr-logo:hover {
          transform: translateY(-1px);
          filter: drop-shadow(var(--shadow-md));
        }

        /* ── SEARCH (appears on scroll) ───────────────────── */
        .hdr-search-wrap {
          display: flex;
          justify-content: center;
          min-width: 0;
          opacity: 0;
          transform: translateY(-8px);
          pointer-events: none;
          transition:
            opacity 0.3s ease,
            transform 0.3s ease;
        }

        .hdr-search-wrap.visible {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        .hdr-search-form {
          width: 100%;
          max-width: 380px;
          margin-left: 150px;
        }

        .hdr-search {
          display: flex;
          align-items: center;
          background: var(--color-bg-section);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-full);
          padding: 5px 5px 5px 16px;
          transition:
            border-color var(--transition-base),
            box-shadow var(--transition-base),
            background var(--transition-base);
        }

        .hdr-search:hover {
          border-color: var(--color-accent-light);
          background: var(--color-bg);
        }

        .hdr-search:focus-within {
          border-color: var(--color-accent);
          border-width: 2px;
          padding: 4px 4px 4px 15px;
          box-shadow: 0 0 0 3px var(--color-accent-soft);
          background: var(--color-bg);
        }

        .hdr-search-left {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          min-width: 0;
        }

        .hdr-search-icon {
          color: var(--color-text-secondary);
          flex-shrink: 0;
          transition: color var(--transition-fast);
        }

        .hdr-search:focus-within .hdr-search-icon {
          color: var(--color-accent);
        }

        .hdr-search-input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 500;
          color: var(--color-primary);
          min-width: 0;
        }

        .hdr-search-input::placeholder {
          color: var(--color-text-secondary);
        }

        .hdr-search-btn {
          background: var(--color-accent);
          color: #fff;
          border: none;
          border-radius: var(--radius-full);
          padding: 8px 18px;
          font-family: var(--font-primary);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          letter-spacing: 0.2px;
          transition:
            background var(--transition-fast),
            transform var(--transition-fast),
            opacity var(--transition-fast);
        }

        .hdr-search-btn:hover:not(:disabled) {
          background: var(--color-accent-hover);
          transform: translateY(-1px);
        }

        .hdr-search-btn:active:not(:disabled) { transform: scale(0.97); }

        .hdr-search-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* ── RIGHT NAV ────────────────────────────────────── */
        .hdr-nav {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
          justify-self: end;
        }

        /* Thin vertical divider between nav groups */
        .hdr-nav-divider {
          width: 1px;
          height: 20px;
          background: var(--color-border);
          margin: 0 8px;
          flex-shrink: 0;
        }

        /* Ghost — Browse Categories */
        .hdr-nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border: none;
          border-radius: var(--radius-full);
          background: transparent;
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text-secondary);
          cursor: pointer;
          white-space: nowrap;
          transition: background var(--transition-fast), color var(--transition-fast);
        }

        .hdr-nav-link:hover {
          background: var(--color-bg-section);
          color: var(--color-accent);
        }

        .hdr-nav-link svg {
          opacity: 0.6;
          transition: opacity var(--transition-fast), transform var(--transition-fast);
        }

        .hdr-nav-link:hover svg {
          opacity: 1;
          transform: scale(1.1);
        }

        /* Filled — Sign In */
        .hdr-signin {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 9px 18px;
          border: none;
          border-radius: var(--radius-full);
          background: var(--color-accent);
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          white-space: nowrap;
          letter-spacing: 0.2px;
          box-shadow: 0 2px 8px rgba(236,111,22,0.28);
          position: relative;
          overflow: hidden;
          transition:
            background var(--transition-fast),
            transform var(--transition-fast),
            box-shadow var(--transition-fast);
        }

        .hdr-signin::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          transition: left 0.5s ease;
        }

        .hdr-signin:hover::after { left: 100%; }

        .hdr-signin:hover {
          background: var(--color-accent-hover);
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(236,111,22,0.38);
        }

        .hdr-signin:active { transform: scale(0.98); }

        /* Outlined — Become a Provider */
        .hdr-cta {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 16px;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-full);
          background: transparent;
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 700;
          color: var(--color-primary);
          cursor: pointer;
          white-space: nowrap;
          transition:
            border-color var(--transition-fast),
            color var(--transition-fast),
            background var(--transition-fast),
            transform var(--transition-fast);
        }

        .hdr-cta:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
          background: var(--color-accent-soft);
          transform: translateY(-1px);
        }

        /* ── MOBILE HAMBURGER ─────────────────────────────── */
        .hdr-hamburger {
          display: none;
          width: 36px;
          height: 36px;
          border: 1.5px solid var(--color-border);
          background: var(--color-bg);
          border-radius: var(--radius-md);
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--color-primary);
          flex-shrink: 0;
          transition: all var(--transition-fast);
        }

        .hdr-hamburger:hover {
          background: var(--color-accent);
          border-color: var(--color-accent);
          color: #fff;
        }

        /* ── MOBILE DRAWER ────────────────────────────────── */
        .mob-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(6px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.35s ease;
          z-index: 9998;
        }

        .mob-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }

        .mob-drawer {
          position: fixed;
          right: 0; top: 0;
          width: min(90vw, 400px);
          height: 100dvh;
          background: var(--color-bg);
          display: flex;
          flex-direction: column;
          transform: translateX(110%);
          transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1);
          z-index: 9999;
          box-shadow: var(--shadow-lg);
        }

        .mob-drawer.open { transform: translateX(0); }

        .mob-drawer-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          border-bottom: 1px solid var(--color-border);
          background: var(--color-bg-section);
        }

        .mob-drawer-logo {
          height: 34px;
          width: auto;
        }

        .mob-close {
          width: 38px; height: 38px;
          border: 1.5px solid var(--color-border);
          background: var(--color-bg);
          border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: var(--color-text-secondary);
          transition: all var(--transition-fast);
        }

        .mob-close:hover {
          background: var(--color-accent);
          border-color: var(--color-accent);
          color: #fff;
          transform: rotate(90deg);
        }

        .mob-body {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        .mob-search-box {
          background: var(--color-bg-section);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 14px;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .mob-input {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-md);
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 500;
          color: var(--color-primary);
          background: var(--color-bg);
          outline: none;
          box-sizing: border-box;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }

        .mob-input:focus {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px var(--color-accent-soft);
        }

        .mob-input::placeholder { color: var(--color-text-secondary); }

        .mob-search-submit {
          width: 100%;
          padding: 12px;
          background: var(--color-accent);
          color: #fff;
          border: none;
          border-radius: var(--radius-md);
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition:
            background var(--transition-fast),
            transform var(--transition-fast);
        }

        .mob-search-submit:hover {
          background: var(--color-accent-hover);
          transform: translateY(-1px);
        }

        .mob-section-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          color: var(--color-text-secondary);
          margin-bottom: 8px;
          padding-left: 4px;
        }

        .mob-nav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          padding: 12px 14px;
          border: none;
          border-radius: var(--radius-md);
          background: transparent;
          font-family: var(--font-primary);
          font-size: 15px;
          font-weight: 600;
          color: var(--color-primary);
          cursor: pointer;
          text-align: left;
          margin-bottom: 2px;
          transition: all var(--transition-fast);
        }

        .mob-nav-item:hover {
          background: var(--color-accent-soft);
          color: var(--color-accent);
          padding-left: 20px;
        }

        .mob-nav-item svg {
          color: var(--color-text-secondary);
          flex-shrink: 0;
          transition: color var(--transition-fast);
        }

        .mob-nav-item:hover svg { color: var(--color-accent); }

       /* Filled — Sign In mobile */
      .mob-signin-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        width: 100%;
        padding: 13px 16px;
        border: none;
        border-radius: var(--radius-md);
        background: var(--color-accent);
        font-family: var(--font-primary);
        font-size: 14px;
        font-weight: 700;
        color: #fff;
        cursor: pointer;
        margin-bottom: 2px;
        box-shadow: var(--shadow-sm);
        transition:
          background var(--transition-fast),
          transform var(--transition-fast),
          box-shadow var(--transition-fast);
      }

      .mob-signin-btn:hover {
        background: var(--color-accent-hover);
        transform: translateY(-1px);
        box-shadow: var(--shadow-md);
      }

      /* Outlined — Become a Provider mobile */
      .mob-cta {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        padding: 12px 16px;
        border: 1.5px solid var(--color-border);
        border-radius: var(--radius-md);
        background: transparent;
        font-family: var(--font-primary);
        font-size: 15px;
        font-weight: 700;
        color: var(--color-primary);
        cursor: pointer;
        text-align: left;
        transition: all var(--transition-fast);
      }

      .mob-cta:hover {
        border-color: var(--color-accent);
        color: var(--color-accent);
        background: var(--color-accent-soft);
        transform: translateY(-1px);
      }


        .mob-hr {
          height: 1px;
          background: var(--color-border);
          margin: 18px 0;
          border: none;
        }

        /* ── RESPONSIVE ───────────────────────────────────── */
        @media (max-width: 1100px) {
          .hdr-inner { gap: 24px; }
          .hdr-search-form { max-width: 460px; }
        }

        @media (max-width: 920px) {
          .hdr-inner {
            grid-template-columns: 1fr auto;
            gap: 16px;
            padding: 0 20px;
          }
          .hdr-search-wrap,
          .hdr-nav { display: none !important; }
          .hdr-hamburger { display: flex; }
        }

        @media (max-width: 480px) {
          .hdr-inner { padding: 0 16px; height: 64px; }
          .hdr-logo img { height: 34px; }
          .mob-drawer { width: 100%; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <header className={`hdr-root ${scrolled ? "scrolled" : ""}`}>
        <div className="hdr-bar">
          <div className="hdr-inner">
            {/* LOGO */}
            <div
              className="hdr-logo"
              onClick={handleLogoClick}
              role="button"
              aria-label="ZimServ home"
            >
              <img src="/assets/logo.png" alt="ZimServ" />
            </div>

            {/* SEARCH — appears after scrolling past hero */}
            <div className={`hdr-search-wrap ${showSearch ? "visible" : ""}`}>
              <form className="hdr-search-form" onSubmit={handleSearch}>
                <div className="hdr-search">
                  <div className="hdr-search-left">
                    <Search
                      size={16}
                      className="hdr-search-icon"
                      strokeWidth={2.2}
                    />
                    <input
                      type="text"
                      placeholder="What are you looking for?"
                      className="hdr-search-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search for services"
                    />
                  </div>
                  <button
                    type="submit"
                    className="hdr-search-btn"
                    disabled={!searchQuery.trim()}
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* RIGHT NAV — ghost → divider → outlined → filled */}
            <nav className="hdr-nav" aria-label="Main navigation">
              <button
                className="hdr-nav-link"
                onClick={() => navigate("/categories")}
              >
                <Grid size={15} strokeWidth={2.2} />
                Browse Categories
              </button>

              <div className="hdr-nav-divider" aria-hidden="true" />

              <button
                className="hdr-signin"
                onClick={() => navigate("/signin")}
              >
                <LogIn size={15} strokeWidth={2.2} />
                Sign In
              </button>

              <button
                className="hdr-cta"
                onClick={() => navigate("/become-provider")}
              >
                <Briefcase size={15} strokeWidth={2.2} />
                Become a Provider
              </button>
            </nav>

            {/* HAMBURGER — mobile only */}
            <button
              className="hdr-hamburger"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu size={20} strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      <div
        className={`mob-overlay ${mobileMenuOpen ? "open" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* MOBILE DRAWER */}
      <div
        className={`mob-drawer ${mobileMenuOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="mob-drawer-head">
          <img
            src="/assets/logo.png"
            alt="ZimServ"
            className="mob-drawer-logo"
          />
          <button
            className="mob-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={17} strokeWidth={2} />
          </button>
        </div>

        <div className="mob-body">
          {/* Search */}
          <div className="mob-search-box">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="mob-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              className="mob-search-submit"
              onClick={() => handleSearch()}
              disabled={!searchQuery.trim()}
            >
              Search Services
            </button>
          </div>

          {/* Explore */}
          <div className="mob-section-label">Explore</div>
          <button
            className="mob-nav-item"
            onClick={() => {
              navigate("/categories");
              setMobileMenuOpen(false);
            }}
          >
            <Grid size={19} strokeWidth={2} />
            Browse Categories
          </button>
          <button
            className="mob-nav-item"
            onClick={() => {
              navigate("/how-it-works");
              setMobileMenuOpen(false);
            }}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            How It Works
          </button>

          <hr className="mob-hr" />

          {/* Account */}
          <div className="mob-section-label">Account</div>
          <button
            className="mob-signin-btn"
            onClick={() => {
              navigate("/signin");
              setMobileMenuOpen(false);
            }}
          >
            <LogIn size={18} strokeWidth={2} />
            Sign In
          </button>

          <hr className="mob-hr" />

          {/* For Providers */}
          <div className="mob-section-label">For Providers</div>
          <button
            className="mob-cta"
            onClick={() => {
              navigate("/become-provider");
              setMobileMenuOpen(false);
            }}
          >
            <Briefcase size={19} strokeWidth={2} />
            Become a Provider
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;
