// src/pages/admin/AdminReviews.tsx
import { useState, useRef, useEffect } from "react";
import { Star, Trash2, MessageSquare, Search, Filter, X } from "lucide-react";
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
  createdAt: Date;
  is_verified: boolean;
  is_flagged: boolean;
}

// Skeleton Components
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

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState<string>("All");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const filterDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select(
          `
          id,
          provider_id,
          customer_nickname,
          rating,
          comment,
          proof_hint,
          created_at,
          is_verified,
          is_flagged,
          providers (
            business_name,
            full_name,
            primary_category
          )
        `,
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reviews:", error);
        return;
      }

      const formattedReviews: Review[] = (data || []).map((review: any) => ({
        id: review.id,
        provider_id: review.provider_id,
        providerName:
          review.providers?.business_name ||
          review.providers?.full_name ||
          "Unknown Provider",
        providerCategory: review.providers?.primary_category || "Uncategorized",
        customerNickname: review.customer_nickname,
        rating: review.rating,
        comment: review.comment,
        proofHint: review.proof_hint,
        createdAt: new Date(review.created_at),
        is_verified: review.is_verified,
        is_flagged: review.is_flagged,
      }));

      setReviews(formattedReviews);
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setShowFilter(false);
      }
    };

    if (showFilter) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilter]);

  const handleRemove = (review: Review) => {
    setSelectedReview(review);
    setShowRemoveModal(true);
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
    } catch (err) {
      alert("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const getFilteredReviews = () => {
    let filtered = reviews;

    if (filterRating !== "All") {
      const rating = parseInt(filterRating);
      filtered = filtered.filter((r) => r.rating === rating);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.providerName.toLowerCase().includes(query) ||
          r.customerNickname.toLowerCase().includes(query) ||
          r.comment.toLowerCase().includes(query) ||
          r.providerCategory.toLowerCase().includes(query),
      );
    }

    return filtered;
  };

  const filteredReviews = getFilteredReviews();

  const stats = {
    total: reviews.length,
    fiveStar: reviews.filter((r) => r.rating === 5).length,
    fourStar: reviews.filter((r) => r.rating === 4).length,
    threeStar: reviews.filter((r) => r.rating === 3).length,
    lowRated: reviews.filter((r) => r.rating <= 2).length,
  };

  const getFilterLabel = () => {
    if (filterRating === "All") return "Filter";
    return `${filterRating} Star${filterRating === "1" ? "" : "s"}`;
  };

  return (
    <>
      <style>{`
        /* Skeleton Animations */
        @keyframes shimmer {
          0% { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }

        .skeleton-block,
        .skeleton-circle,
        .skeleton-rating,
        .skeleton-stat-card,
        .skeleton-review-card {
          background: linear-gradient(
            90deg,
            var(--skeleton-base) 25%,
            var(--skeleton-highlight) 50%,
            var(--skeleton-base) 75%
          );
          background-size: 600px 100%;
          animation: shimmer 1.6s ease-in-out infinite;
          border-radius: 6px;
        }

        :root {
          --skeleton-base: #f0f0f0;
          --skeleton-highlight: #e0e0e0;
        }

        .dark-mode {
          --skeleton-base: #374151;
          --skeleton-highlight: #4b5563;
        }

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

        .skeleton-stat-label {
          height: 13px;
          width: 80px;
        }

        .skeleton-stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .skeleton-stat-value {
          height: 28px;
          width: 60px;
        }

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

        .skeleton-provider-name {
          height: 18px;
          width: 150px;
        }

        .skeleton-rating {
          height: 16px;
          width: 100px;
        }

        .skeleton-category {
          height: 14px;
          width: 100px;
          margin-bottom: 16px;
        }

        .skeleton-comment {
          height: 14px;
          width: 100%;
          margin-bottom: 8px;
        }

        .skeleton-comment-short {
          height: 14px;
          width: 70%;
        }

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
        }

        .search-container {
          position: relative;
          flex: 1;
          max-width: 500px;
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
          pointer-events: none;
          transition: all 0.3s ease;
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
        }

        .clear-search:hover {
          background: var(--hover-bg);
          color: var(--text-primary);
          transform: translateY(-50%) scale(1.1);
        }

        .filter-wrapper {
          position: relative;
        }

        .filter-btn {
          padding: 13px 20px;
          border-radius: 12px;
          border: 1.5px solid var(--border-color);
          background: var(--filter-btn-bg);
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
        }

        .filter-btn:hover {
          background: var(--filter-btn-hover);
          border-color: var(--border-hover);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px var(--card-shadow);
        }

        .filter-btn.active {
          background: var(--orange-light-bg);
          border-color: var(--orange-primary);
          color: var(--orange-primary);
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
          min-width: 180px;
          z-index: 100;
          animation: slideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1);
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

        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .review-card {
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 14px;
          padding: 24px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .review-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--rating-color) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .review-card:hover::before {
          opacity: 1;
        }

        .review-card:hover {
          border-color: var(--border-hover);
          box-shadow: 0 8px 24px var(--card-shadow);
          transform: translateY(-4px);
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          gap: 12px;
        }

        .review-provider {
          flex: 1;
          min-width: 0;
        }

        .provider-name {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .provider-category {
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .review-rating {
          display: flex;
          gap: 4px;
          flex-shrink: 0;
        }

        .review-body {
          flex: 1;
          margin-bottom: 20px;
        }

        .reviewer-info {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .reviewer-nickname {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .review-date {
          font-size: 13px;
          color: var(--text-tertiary);
          font-weight: 500;
        }

        .review-comment {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 12px;
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
          padding: 6px 12px;
          border-radius: 8px;
          font-weight: 600;
        }

        .review-footer {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding-top: 20px;
          border-top: 1.5px solid var(--border-color);
        }

        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1.5px solid var(--danger-color);
          background: transparent;
          color: var(--danger-color);
        }

        .action-btn:hover {
          background: var(--danger-bg);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px var(--danger-shadow);
        }

        .empty-state {
          grid-column: 1 / -1;
          padding: 80px 20px;
          text-align: center;
          border: 2px dashed var(--border-color);
          border-radius: 16px;
          background: var(--empty-bg);
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .empty-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .empty-text {
          font-size: 15px;
          color: var(--text-secondary);
        }

        :root {
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
          --card-shadow: rgba(0, 0, 0, 0.1);
          --dropdown-shadow: rgba(0, 0, 0, 0.15);
          --chip-bg: #f3f4f6;
          --empty-bg: #fafbfc;
          --danger-color: #ef4444;
          --danger-bg: #FEE2E2;
          --danger-shadow: rgba(239, 68, 68, 0.2);
          --rating-color: #F59E0B;
          --orange-primary: #FF6B35;
          --orange-light-bg: #FFF4ED;
          --orange-shadow: rgba(255, 107, 53, 0.1);
        }

        .dark-mode {
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
          --danger-color: #F87171;
          --danger-bg: rgba(239, 68, 68, 0.15);
          --danger-shadow: rgba(248, 113, 113, 0.3);
          --rating-color: #FCD34D;
          --orange-primary: #FF8A5B;
          --orange-light-bg: rgba(255, 107, 53, 0.15);
          --orange-shadow: rgba(255, 138, 91, 0.15);
        }

        @media (max-width: 1200px) {
          .reviews-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .admin-reviews {
            padding: 20px 16px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .toolbar-left {
            flex-direction: column;
          }

          .search-container {
            max-width: 100%;
          }

          .filter-btn {
            width: 100%;
            justify-content: center;
          }

          .reviews-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .review-comment {
            -webkit-line-clamp: 4;
          }

          .action-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="admin-reviews">
        <PageHeader
          title="Reviews & Ratings"
          subtitle="View and manage customer reviews"
          icon={MessageSquare}
        />

        <div className="stats-grid">
          {loading ? (
            <>
              <SkeletonStatCard />
              <SkeletonStatCard />
              <SkeletonStatCard />
              <SkeletonStatCard />
            </>
          ) : (
            <>
              <StatCard
                label="Total Reviews"
                value={stats.total}
                icon={MessageSquare}
                iconColor="orange"
              />
              <StatCard
                label="5 Star Reviews"
                value={stats.fiveStar}
                icon={Star}
                iconColor="green"
              />
              <StatCard
                label="4 Star Reviews"
                value={stats.fourStar}
                icon={Star}
                iconColor="blue"
              />
              <StatCard
                label="Low Rated (≤2)"
                value={stats.lowRated}
                icon={Star}
                iconColor="red"
              />
            </>
          )}
        </div>

        <div className="toolbar">
          <div className="toolbar-left">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by provider, reviewer, or comment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <Search size={18} className="search-icon" strokeWidth={2.5} />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="clear-search"
                  title="Clear search"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              )}
            </div>

            <div className="filter-wrapper" ref={filterDropdownRef}>
              <button
                className={`filter-btn ${filterRating !== "All" ? "active" : ""}`}
                onClick={() => setShowFilter(!showFilter)}
              >
                <Filter size={18} strokeWidth={2.5} />
                {getFilterLabel()}
              </button>

              {showFilter && (
                <div className="filter-dropdown">
                  <div
                    className={`filter-option ${filterRating === "All" ? "active" : ""}`}
                    onClick={() => {
                      setFilterRating("All");
                      setShowFilter(false);
                    }}
                  >
                    All Ratings
                  </div>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div
                      key={rating}
                      className={`filter-option ${filterRating === String(rating) ? "active" : ""}`}
                      onClick={() => {
                        setFilterRating(String(rating));
                        setShowFilter(false);
                      }}
                    >
                      {rating} Star{rating !== 1 ? "s" : ""}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="reviews-grid">
          {loading ? (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </>
          ) : filteredReviews.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3 className="empty-title">No reviews found</h3>
              <p className="empty-text">
                {searchQuery || filterRating !== "All"
                  ? "No reviews match your current filters"
                  : "Reviews will appear here once customers submit them"}
              </p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="review-provider">
                    <div className="provider-name" title={review.providerName}>
                      {review.providerName}
                    </div>
                    <div className="provider-category">
                      {review.providerCategory}
                    </div>
                  </div>
                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
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
                </div>

                <div className="review-body">
                  <div className="reviewer-info">
                    <span className="reviewer-nickname">
                      {review.customerNickname}
                    </span>
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
                    className="action-btn"
                    onClick={() => handleRemove(review)}
                  >
                    <Trash2 size={14} strokeWidth={2.5} />
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <ConfirmationModal
          isOpen={showRemoveModal}
          onClose={() => setShowRemoveModal(false)}
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
