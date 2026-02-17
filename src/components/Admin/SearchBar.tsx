// src/components/Admin/SearchBar.tsx
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search...",
}: SearchBarProps) => {
  return (
    <>
      <style>{`
        .search-container {
          position: relative;
          width: 100%;
          margin-bottom: 20px;
        }

        .search-input {
          width: 100%;
          padding: 13px 16px 13px 48px;
          border-radius: 12px;
          border: 1.5px solid var(--border-color);
          background: var(--search-bg);
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 500;
          outline: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .search-input::placeholder {
          color: var(--text-tertiary);
        }

        .search-input:focus {
          border-color: var(--orange-primary);
          background: var(--card-bg);
          box-shadow: 0 0 0 4px var(--orange-shadow);
          transform: translateY(-1px);
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-tertiary);
          transition: all 0.3s ease;
          pointer-events: none;
        }

        .search-input:focus ~ .search-icon {
          color: var(--orange-primary);
          transform: translateY(-50%) scale(1.1);
        }

        .clear-search {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-secondary);
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: all 0.2s ease;
          opacity: 0;
          visibility: hidden;
        }

        .search-input:not(:placeholder-shown) ~ .clear-search {
          opacity: 1;
          visibility: visible;
        }

        .clear-search:hover {
          background: var(--hover-bg);
          color: var(--text-primary);
          transform: translateY(-50%) scale(1.1);
        }

        .clear-search:active {
          transform: translateY(-50%) scale(0.95);
        }

        /* CSS Variables */
        :root {
          --search-bg: #f9fafb;
          --card-bg: #ffffff;
          --border-color: #e5e7eb;
          --text-primary: #111827;
          --text-secondary: #6b7280;
          --text-tertiary: #9ca3af;
          --hover-bg: #f3f4f6;
          --orange-primary: #FF6B35;
          --orange-shadow: rgba(255, 107, 53, 0.1);
        }

        .dark-mode {
          --search-bg: #374151;
          --card-bg: #1f2937;
          --border-color: #4b5563;
          --text-primary: #f9fafb;
          --text-secondary: #d1d5db;
          --text-tertiary: #9ca3af;
          --hover-bg: #4b5563;
          --orange-primary: #FF8A5B;
          --orange-shadow: rgba(255, 138, 91, 0.15);
        }

        @media (max-width: 768px) {
          .search-input {
            padding: 12px 16px 12px 44px;
            font-size: 14px;
          }
        }
      `}</style>

      <div className="search-container">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="search-input"
        />
        <Search size={18} className="search-icon" strokeWidth={2.5} />
        {value && (
          <button
            onClick={() => onChange("")}
            className="clear-search"
            title="Clear search"
            aria-label="Clear search"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </>
  );
};

export default SearchBar;
