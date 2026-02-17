// src/components/Admin/FilterDropdown.tsx
import { useState, useRef, useEffect } from "react";
import { Filter, Check } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const FilterDropdown = ({
  options,
  value,
  onChange,
  label = "Filter",
}: FilterDropdownProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <>
      <style>{`
        .filter-wrapper {
          position: relative;
        }

        .filter-btn {
          padding: 13px 20px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 10px;
          white-space: nowrap;
          background: var(--filter-btn-bg);
          color: var(--text-primary);
          border: 1.5px solid var(--border-color);
          position: relative;
          overflow: hidden;
        }

        .filter-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, var(--hover-bg), transparent);
          transition: left 0.5s ease;
        }

        .filter-btn:hover::before {
          left: 100%;
        }

        .filter-btn:hover {
          background: var(--filter-btn-hover);
          border-color: var(--border-hover);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px var(--card-shadow);
        }

        .filter-btn:active {
          transform: translateY(0);
        }

        .filter-btn.open {
          border-color: var(--orange-primary);
          background: var(--orange-light-bg);
          color: var(--orange-primary);
        }

        .filter-icon {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .filter-btn.open .filter-icon {
          transform: rotate(180deg);
        }

        .filter-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 12px;
          box-shadow: 0 12px 48px var(--dropdown-shadow);
          padding: 8px;
          min-width: 200px;
          z-index: 100;
          animation: slideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .filter-option {
          padding: 12px 14px;
          cursor: pointer;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .filter-option:hover {
          background: var(--hover-bg);
          color: var(--orange-primary);
          transform: translateX(4px);
        }

        .filter-option.active {
          background: var(--orange-light-bg);
          color: var(--orange-primary);
          font-weight: 600;
        }

        .check-icon {
          opacity: 0;
          transform: scale(0);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .filter-option.active .check-icon {
          opacity: 1;
          transform: scale(1);
        }

        /* CSS Variables */
        :root {
          --filter-btn-bg: #ffffff;
          --filter-btn-hover: #f9fafb;
          --card-bg: #ffffff;
          --border-color: #e5e7eb;
          --border-hover: #d1d5db;
          --text-primary: #111827;
          --hover-bg: #f3f4f6;
          --card-shadow: rgba(0, 0, 0, 0.1);
          --dropdown-shadow: rgba(0, 0, 0, 0.15);
          --orange-primary: #FF6B35;
          --orange-light-bg: #FFF4ED;
        }

        .dark-mode {
          --filter-btn-bg: #1f2937;
          --filter-btn-hover: #374151;
          --card-bg: #1f2937;
          --border-color: #374151;
          --border-hover: #4b5563;
          --text-primary: #f9fafb;
          --hover-bg: #374151;
          --card-shadow: rgba(0, 0, 0, 0.4);
          --dropdown-shadow: rgba(0, 0, 0, 0.6);
          --orange-primary: #FF8A5B;
          --orange-light-bg: rgba(255, 107, 53, 0.15);
        }

        @media (max-width: 768px) {
          .filter-btn {
            padding: 12px 18px;
            font-size: 13px;
          }

          .filter-dropdown {
            min-width: 180px;
          }
        }
      `}</style>

      <div className="filter-wrapper" ref={dropdownRef}>
        <button
          className={`filter-btn ${showDropdown ? "open" : ""}`}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <Filter size={18} strokeWidth={2.5} className="filter-icon" />
          {selectedOption?.label || label}
        </button>

        {showDropdown && (
          <div className="filter-dropdown">
            {options.map((option) => (
              <div
                key={option.value}
                className={`filter-option ${value === option.value ? "active" : ""}`}
                onClick={() => {
                  onChange(option.value);
                  setShowDropdown(false);
                }}
              >
                <span>{option.label}</span>
                <Check size={16} strokeWidth={2.5} className="check-icon" />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FilterDropdown;
