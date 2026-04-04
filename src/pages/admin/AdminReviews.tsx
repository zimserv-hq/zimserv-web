// src/pages/admin/AdminReviews.tsx
import { useState, useRef, useEffect } from "react";
import {
  Star,
  Trash2,
  MessageSquare,
  Search,
  Filter,
  X,
  Flag,
} from "lucide-react";
import PageHeader from "../../components/Admin/PageHeader";
import StatCard from "../../components/Admin/StatCard";
import ConfirmationModal from "../../components/Admin/ConfirmationModal";
import { supabase } from "../../lib/supabaseClient";

interface Review {
  id: string;
  provider_id: string;
  providerName: string;
  providerCategory: string;
  customerNickname: string;
  rating: number;
  comment: string;
  proofHint?: string;
  createdAt: Date;
  is_verified: boolean;
  is_flagged: boolean;
}

// ── Skeletons ──────────────────────────────────────────────────────────────
const SkeletonStatCard = () => (
  <div className="skeleton-stat-card">
    <div className="skeleton-stat-top">
      <div className="skeleton-block skeleton-stat-label" />
      <div className="skeleton-circle skeleton-stat-icon" />
    </div>
    <div className="skeleton-block skeleton-stat-value" />
  </div>
);

const SkeletonCard = () => (
  <div className="review-card skeleton-review-card">
    <div className="skeleton-header">
      <div className="skeleton-block skeleton-provider-name" />
      <div className="skeleton-rating" />
    </div>
    <div className="skeleton-block skeleton-category" />
    <div className="skeleton-block skeleton-comment" />
    <div className="skeleton-block skeleton-comment-short" />
  </div>
);

// ── Component ──────────────────────────────────────────────────────────────
const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState<string>("All");
  const [filterFlagged, setFilterFlagged] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [togglingFlagId, setTogglingFlagId] = useState<string | null>(null);

  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // ── Fetch ────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select(
          `id, provider_id, customer_nickname, rating, comment,
     created_at, is_verified, is_flagged,
     providers ( business_name, full_name, primary_category )`,
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reviews:", error);
        return;
      }

      setReviews(
        (data || []).map((r: any) => ({
          id: r.id,
          provider_id: r.provider_id,
          providerName:
            r.providers?.business_name ||
            r.providers?.full_name ||
            "Unknown Provider",
          providerCategory: r.providers?.primary_category || "Uncategorized",
          customerNickname: r.customer_nickname,
          rating: r.rating,
          comment: r.comment,
          proofHint: r.proof_hint,
          createdAt: new Date(r.created_at),
          is_verified: r.is_verified,
          is_flagged: r.is_flagged,
        })),
      );
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Real-time channel ────────────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel("admin-reviews-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "reviews" },
        () => {
          fetchReviews();
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "reviews" },
        (payload) => {
          setReviews((prev) =>
            prev.map((r) =>
              r.id === payload.new.id
                ? {
                    ...r,
                    is_flagged: payload.new.is_flagged,
                    is_verified: payload.new.is_verified,
                  }
                : r,
            ),
          );
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "reviews" },
        (payload) => {
          setReviews((prev) => prev.filter((r) => r.id !== payload.old.id));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ── Outside click closes filter ──────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(e.target as Node)
      ) {
        setShowFilter(false);
      }
    };
    if (showFilter) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showFilter]);

  // ── Actions ──────────────────────────────────────────────────────────────
  const handleToggleFlag = async (review: Review) => {
    setTogglingFlagId(review.id);
    const newVal = !review.is_flagged;
    const { error } = await supabase
      .from("reviews")
      .update({ is_flagged: newVal })
      .eq("id", review.id);

    if (!error) {
      setReviews((prev) =>
        prev.map((r) =>
          r.id === review.id ? { ...r, is_flagged: newVal } : r,
        ),
      );
    }
    setTogglingFlagId(null);
  };

  const confirmRemove = async () => {
    if (!selectedReview) return;
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", selectedReview.id);

      if (error) {
        alert("Failed to remove review");
        return;
      }

      setReviews((prev) => prev.filter((r) => r.id !== selectedReview.id));
      setShowRemoveModal(false);
      setSelectedReview(null);
    } catch {
      alert("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Filtering ────────────────────────────────────────────────────────────
  const filteredReviews = reviews.filter((r) => {
    if (filterFlagged && !r.is_flagged) return false;
    if (filterRating !== "All" && r.rating !== parseInt(filterRating))
      return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.providerName.toLowerCase().includes(q) ||
        r.customerNickname.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q) ||
        r.providerCategory.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const stats = {
    total: reviews.length,
    flagged: reviews.filter((r) => r.is_flagged).length,
    fiveStar: reviews.filter((r) => r.rating === 5).length,
    avgRating:
      reviews.length > 0
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(
            1,
          )
        : "0.0",
    lowRated: reviews.filter((r) => r.rating <= 2).length,
  };

  const getFilterLabel = () => {
    const parts: string[] = [];
    if (filterFlagged) parts.push("Flagged");
    if (filterRating !== "All") parts.push(`${filterRating}★`);
    return parts.length ? parts.join(" · ") : "Filter";
  };

  const isFilterActive = filterRating !== "All" || filterFlagged;

  const clearFilters = () => {
    setFilterRating("All");
    setFilterFlagged(false);
    setShowFilter(false);
  };

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }

        .skeleton-block, .skeleton-circle, .skeleton-rating,
        .skeleton-stat-card, .skeleton-review-card {
          background: linear-gradient(90deg,
            var(--skeleton-base) 25%,
            var(--skeleton-highlight) 50%,
            var(--skeleton-base) 75%);
          background-size: 600px 100%;
          animation: shimmer 1.6s ease-in-out infinite;
          border-radius: 6px;
        }

        :root {
          --skeleton-base: #f0f0f0;
          --skeleton-highlight: #e0e0e0;
          --bg-primary: #f8f9fa;
          --text-primary: #111827;
          --text-secondary: #6b7280;
          --text-tertiary: #9ca3af;
          --card-bg: #ffffff;
          --border-color: #e5e7eb;
          --border-hover: #d1d5db;
          --hover-bg: #f3f4f6;
          --search-bg: #f9fafb;
          --filter-btn-bg: #ffffff;
          --filter-btn-hover: #f9fafb;
          --card-shadow: rgba(0, 0, 0, 0.08);
          --dropdown-shadow: rgba(0, 0, 0, 0.15);
          --chip-bg: #f3f4f6;
          --empty-bg: #fafbfc;
          --danger-color: #ef4444;
          --danger-bg: #fee2e2;
          --danger-shadow: rgba(239, 68, 68, 0.2);
          --flag-color: #f59e0b;
          --flag-bg: rgba(245, 158, 11, 0.1);
          --rating-color: #f59e0b;
          --orange-primary: #FF6B35;
          --orange-light-bg: #fff4ed;
          --orange-shadow: rgba(255, 107, 53, 0.1);
        }
        .dark-mode {
          --skeleton-base: #374151;
          --skeleton-highlight: #4b5563;
          --bg-primary: #111827;
          --text-primary: #f9fafb;
          --text-secondary: #d1d5db;
          --text-tertiary: #9ca3af;
          --card-bg: #1f2937;
          --border-color: #374151;
          --border-hover: #4b5563;
          --hover-bg: #374151;
          --search-bg: #374151;
          --filter-btn-bg: #1f2937;
          --filter-btn-hover: #374151;
          --card-shadow: rgba(0, 0, 0, 0.5);
          --dropdown-shadow: rgba(0, 0, 0, 0.6);
          --chip-bg: #374151;
          --empty-bg: #1f2937;
          --danger-color: #f87171;
          --danger-bg: rgba(239, 68, 68, 0.15);
          --danger-shadow: rgba(248, 113, 113, 0.3);
          --flag-color: #fbbf24;
          --flag-bg: rgba(251, 191, 36, 0.12);
          --rating-color: #fcd34d;
          --orange-primary: #FF8A5B;
          --orange-light-bg: rgba(255, 107, 53, 0.15);
          --orange-shadow: rgba(255, 138, 91, 0.15);
        }

        /* ── Layout ────────────────────────────────────────────── */
        .admin-reviews {
          padding: 28px;
          max-width: 1600px;
          margin: 0 auto;
          background: var(--bg-primary);
          min-height: 100vh;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        /* ── Skeleton stat card ────────────────────────────────── */
        .skeleton-stat-card {
          border-radius: 16px;
          padding: 24px;
          border: 1.5px solid var(--border-color);
          background: var(--card-bg);
          min-height: 110px;
        }
        .skeleton-stat-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .skeleton-stat-label  { height: 13px; width: 80px; }
        .skeleton-stat-icon   { width: 40px; height: 40px; border-radius: 10px; }
        .skeleton-stat-value  { height: 28px; width: 60px; }

        /* ── Skeleton review card ──────────────────────────────── */
        .skeleton-review-card {
          padding: 24px;
          border-radius: 14px;
          border: 1.5px solid var(--border-color);
        }
        .skeleton-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .skeleton-provider-name  { height: 18px; width: 150px; }
        .skeleton-rating         { height: 16px; width: 100px; }
        .skeleton-category       { height: 14px; width: 100px; margin-bottom: 16px; }
        .skeleton-comment        { height: 14px; width: 100%; margin-bottom: 8px; }
        .skeleton-comment-short  { height: 14px; width: 70%; }

        /* ── Toolbar ───────────────────────────────────────────── */
        .toolbar {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 20px;
        }
        .toolbar-left {
          flex: 1;
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .results-count {
          font-size: 13px;
          color: var(--text-tertiary);
          font-weight: 500;
          white-space: nowrap;
        }
        .results-count strong {
          color: var(--text-secondary);
          font-weight: 700;
        }

        /* ── Search ────────────────────────────────────────────── */
        .search-container {
          position: relative;
          flex: 1;
          max-width: 480px;
        }
        .search-input {
          width: 100%;
          padding: 12px 16px 12px 46px;
          border-radius: 12px;
          border: 1.5px solid var(--border-color);
          background: var(--search-bg);
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 500;
          outline: none;
          transition: all 0.25s ease;
        }
        .search-input::placeholder { color: var(--text-tertiary); }
        .search-input:focus {
          border-color: var(--orange-primary);
          background: var(--card-bg);
          box-shadow: 0 0 0 3px var(--orange-shadow);
        }
        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-tertiary);
          pointer-events: none;
          transition: color 0.2s;
        }
        .search-input:focus + .search-icon { color: var(--orange-primary); }
        .clear-search {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-tertiary);
          padding: 5px;
          display: flex;
          align-items: center;
          border-radius: 6px;
          transition: all 0.15s;
        }
        .clear-search:hover { background: var(--hover-bg); color: var(--text-primary); }

        /* ── Filter ────────────────────────────────────────────── */
        .filter-wrapper { position: relative; }
        .filter-btn {
          padding: 12px 18px;
          border-radius: 12px;
          border: 1.5px solid var(--border-color);
          background: var(--filter-btn-bg);
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .filter-btn:hover {
          background: var(--filter-btn-hover);
          border-color: var(--border-hover);
          box-shadow: 0 2px 8px var(--card-shadow);
        }
        .filter-btn.active {
          background: var(--orange-light-bg);
          border-color: var(--orange-primary);
          color: var(--orange-primary);
        }
        .filter-clear-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--orange-primary);
          display: inline-block;
        }
        .filter-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 14px;
          box-shadow: 0 12px 40px var(--dropdown-shadow);
          padding: 8px;
          min-width: 200px;
          z-index: 100;
          animation: slideDown 0.18s ease;
        }
        .filter-section-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.6px;
          padding: 8px 12px 4px;
        }
        .filter-option {
          padding: 10px 12px;
          cursor: pointer;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .filter-option:hover { background: var(--hover-bg); color: var(--orange-primary); }
        .filter-option.active {
          background: var(--orange-light-bg);
          color: var(--orange-primary);
          font-weight: 600;
        }
        .filter-option .check {
          font-size: 12px;
          opacity: 0;
        }
        .filter-option.active .check { opacity: 1; }
        .filter-divider {
          height: 1px;
          background: var(--border-color);
          margin: 6px 8px;
        }
        .filter-clear-btn {
          width: 100%;
          padding: 9px 12px;
          border-radius: 8px;
          border: none;
          background: none;
          font-size: 13px;
          font-weight: 600;
          color: var(--danger-color);
          cursor: pointer;
          text-align: left;
          transition: background 0.15s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .filter-clear-btn:hover { background: var(--danger-bg); }

        /* ── Review grid ───────────────────────────────────────── */
        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .review-card {
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 16px;
          padding: 22px;
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          animation: fadeInUp 0.3s ease both;
        }
        .review-card.flagged {
          border-color: var(--flag-color);
          background: linear-gradient(
            to bottom,
            var(--flag-bg) 0%,
            var(--card-bg) 60px
          );
        }
        .review-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--rating-color), transparent);
          opacity: 0;
          transition: opacity 0.25s;
        }
        .review-card.flagged::before { opacity: 1; background: linear-gradient(90deg, var(--flag-color), transparent); }
        .review-card:hover::before   { opacity: 1; }
        .review-card:hover {
          border-color: var(--border-hover);
          box-shadow: 0 8px 28px var(--card-shadow);
          transform: translateY(-3px);
        }

        /* ── Review header ─────────────────────────────────────── */
        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 14px;
          gap: 10px;
        }
        .review-provider { flex: 1; min-width: 0; }
        .provider-name {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 3px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .provider-category-chip {
          display: inline-flex;
          align-items: center;
          padding: 2px 9px;
          background: var(--chip-bg);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          font-size: 11px;
          font-weight: 500;
          color: var(--text-tertiary);
        }
        .review-rating-row {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
          flex-shrink: 0;
        }
        .review-stars { display: flex; gap: 3px; }
        .flagged-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          background: var(--flag-bg);
          border: 1px solid var(--flag-color);
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          color: var(--flag-color);
        }

        /* ── Review body ───────────────────────────────────────── */
        .review-body  { flex: 1; margin-bottom: 18px; }
        .reviewer-info {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }
        .reviewer-nickname {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }
        .reviewer-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--text-tertiary);
        }
        .review-date {
          font-size: 12px;
          color: var(--text-tertiary);
          font-weight: 500;
        }
        .review-comment {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.7;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .proof-hint {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--text-secondary);
          background: var(--chip-bg);
          padding: 5px 10px;
          border-radius: 8px;
          font-weight: 500;
          margin-top: 10px;
        }

        /* ── Review footer ─────────────────────────────────────── */
        .review-footer {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 8px;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
        }
        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 14px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1.5px solid transparent;
          background: none;
        }
        .action-btn.flag {
          color: var(--flag-color);
          border-color: var(--flag-color);
        }
        .action-btn.flag:hover {
          background: var(--flag-bg);
          transform: translateY(-1px);
        }
        .action-btn.unflag {
          color: var(--text-secondary);
          border-color: var(--border-color);
        }
        .action-btn.unflag:hover {
          background: var(--hover-bg);
          border-color: var(--border-hover);
        }
        .action-btn.remove {
          color: var(--danger-color);
          border-color: var(--danger-color);
        }
        .action-btn.remove:hover {
          background: var(--danger-bg);
          box-shadow: 0 4px 10px var(--danger-shadow);
          transform: translateY(-1px);
        }
        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }

        /* ── Empty state ───────────────────────────────────────── */
        .empty-state {
          grid-column: 1 / -1;
          padding: 72px 20px;
          text-align: center;
          border: 2px dashed var(--border-color);
          border-radius: 16px;
          background: var(--empty-bg);
        }
        .empty-icon  { font-size: 56px; margin-bottom: 16px; }
        .empty-title { font-size: 18px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; }
        .empty-text  { font-size: 14px; color: var(--text-secondary); }

        /* ── Responsive ────────────────────────────────────────── */
        @media (max-width: 1200px) {
          .reviews-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .admin-reviews { padding: 20px 16px; }
          .stats-grid    { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .toolbar       { flex-direction: column; align-items: stretch; }
          .toolbar-left  { flex-direction: column; }
          .search-container { max-width: 100%; }
          .filter-btn    { width: 100%; justify-content: center; }
          .reviews-grid  { grid-template-columns: 1fr; gap: 16px; }
          .review-footer { flex-direction: column; }
          .action-btn    { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="admin-reviews">
        <PageHeader
          title="Reviews & Ratings"
          subtitle="View and moderate customer reviews"
          icon={MessageSquare}
        />

        {/* ── Stat Cards ──────────────────────────────────────────────── */}
        <div className="stats-grid">
          {loading ? (
            [1, 2, 3, 4].map((i) => <SkeletonStatCard key={i} />)
          ) : (
            <>
              <StatCard
                label="Total Reviews"
                value={stats.total}
                icon={MessageSquare}
                iconColor="orange"
              />
              <StatCard
                label="Avg Rating"
                value={stats.avgRating}
                icon={Star}
                iconColor="yellow"
              />
              <StatCard
                label="5-Star Reviews"
                value={stats.fiveStar}
                icon={Star}
                iconColor="green"
              />
              <StatCard
                label="Flagged"
                value={stats.flagged}
                icon={Flag}
                iconColor="red"
              />
            </>
          )}
        </div>

        {/* ── Toolbar ─────────────────────────────────────────────────── */}
        <div className="toolbar">
          <div className="toolbar-left">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search provider, reviewer or comment…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <Search size={17} className="search-icon" strokeWidth={2.5} />
              {searchQuery && (
                <button
                  className="clear-search"
                  onClick={() => setSearchQuery("")}
                >
                  <X size={15} strokeWidth={2.5} />
                </button>
              )}
            </div>

            <div className="filter-wrapper" ref={filterDropdownRef}>
              <button
                className={`filter-btn ${isFilterActive ? "active" : ""}`}
                onClick={() => setShowFilter(!showFilter)}
              >
                <Filter size={16} strokeWidth={2.5} />
                {getFilterLabel()}
                {isFilterActive && <span className="filter-clear-dot" />}
              </button>

              {showFilter && (
                <div className="filter-dropdown">
                  <div className="filter-section-label">Rating</div>
                  {(["All", "5", "4", "3", "2", "1"] as const).map((val) => (
                    <div
                      key={val}
                      className={`filter-option ${filterRating === val ? "active" : ""}`}
                      onClick={() => {
                        setFilterRating(val);
                        setShowFilter(false);
                      }}
                    >
                      <span>
                        {val === "All"
                          ? "All ratings"
                          : `${val} Star${val !== "1" ? "s" : ""}`}
                      </span>
                      <span className="check">✓</span>
                    </div>
                  ))}
                  <div className="filter-divider" />
                  <div className="filter-section-label">Status</div>
                  <div
                    className={`filter-option ${filterFlagged ? "active" : ""}`}
                    onClick={() => {
                      setFilterFlagged(!filterFlagged);
                      setShowFilter(false);
                    }}
                  >
                    <span>Flagged only</span>
                    <span className="check">✓</span>
                  </div>
                  {isFilterActive && (
                    <>
                      <div className="filter-divider" />
                      <button
                        className="filter-clear-btn"
                        onClick={clearFilters}
                      >
                        <X size={13} strokeWidth={2.5} /> Clear filters
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {!loading && (
              <span className="results-count">
                <strong>{filteredReviews.length}</strong> of {reviews.length}{" "}
                reviews
              </span>
            )}
          </div>
        </div>

        {/* ── Reviews Grid ────────────────────────────────────────────── */}
        <div className="reviews-grid">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filteredReviews.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3 className="empty-title">No reviews found</h3>
              <p className="empty-text">
                {searchQuery || isFilterActive
                  ? "No reviews match your current filters"
                  : "Reviews will appear here once customers submit them"}
              </p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div
                key={review.id}
                className={`review-card ${review.is_flagged ? "flagged" : ""}`}
              >
                <div className="review-header">
                  <div className="review-provider">
                    <div className="provider-name" title={review.providerName}>
                      {review.providerName}
                    </div>
                    <span className="provider-category-chip">
                      {review.providerCategory}
                    </span>
                  </div>
                  <div className="review-rating-row">
                    <div className="review-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={
                            i < review.rating ? "var(--rating-color)" : "none"
                          }
                          stroke={
                            i < review.rating
                              ? "var(--rating-color)"
                              : "var(--border-color)"
                          }
                          strokeWidth={2}
                        />
                      ))}
                    </div>
                    {review.is_flagged && (
                      <span className="flagged-badge">
                        <Flag size={10} strokeWidth={2.5} />
                        Flagged
                      </span>
                    )}
                  </div>
                </div>

                <div className="review-body">
                  <div className="reviewer-info">
                    <span className="reviewer-nickname">
                      {review.customerNickname}
                    </span>
                    <span className="reviewer-dot" />
                    <span className="review-date">
                      {review.createdAt.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>

                <div className="review-footer">
                  <button
                    className={`action-btn ${review.is_flagged ? "unflag" : "flag"}`}
                    onClick={() => handleToggleFlag(review)}
                    disabled={togglingFlagId === review.id}
                  >
                    <Flag size={12} strokeWidth={2.5} />
                    {togglingFlagId === review.id
                      ? "…"
                      : review.is_flagged
                        ? "Unflag"
                        : "Flag"}
                  </button>
                  <button
                    className="action-btn remove"
                    onClick={() => {
                      setSelectedReview(review);
                      setShowRemoveModal(true);
                    }}
                  >
                    <Trash2 size={12} strokeWidth={2.5} />
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <ConfirmationModal
          isOpen={showRemoveModal}
          onClose={() => {
            setShowRemoveModal(false);
            setSelectedReview(null);
          }}
          onConfirm={confirmRemove}
          title="Remove Review"
          message={`Are you sure you want to remove this review from "${selectedReview?.providerName}"? This action cannot be undone.`}
          confirmLabel="Remove"
          confirmStyle="danger"
          icon={Trash2}
          isLoading={isProcessing}
        />
      </div>
    </>
  );
};

export default AdminReviews;
