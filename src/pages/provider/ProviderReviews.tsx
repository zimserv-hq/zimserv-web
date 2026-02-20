// src/pages/provider/ProviderReviews.tsx
import { useState, useEffect } from "react";
import { Star, Reply, MessageSquare, Send, X, Loader2 } from "lucide-react";
import PageHeader from "../../components/Admin/PageHeader";
import SearchBar from "../../components/Admin/SearchBar";
import { supabase } from "../../lib/supabaseClient";

interface Review {
  id: string;
  customerNickname: string;
  rating: number;
  comment: string;
  createdAt: string;
  providerReply: string | null;
  repliedAt: string | null;
}

const ProviderReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [providerId, setProviderId] = useState<string | null>(null);
  const [filterRating, setFilterRating] = useState<number | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: provider } = await supabase
        .from("providers")
        .select("id")
        .eq("email", user.email)
        .single();
      if (!provider) return;
      setProviderId(provider.id);

      const { data } = await supabase
        .from("reviews")
        .select(
          "id, customer_nickname, rating, comment, created_at, provider_reply, replied_at",
        )
        .eq("provider_id", provider.id)
        .order("created_at", { ascending: false });

      if (data) {
        setReviews(
          data.map((r) => ({
            id: r.id,
            customerNickname: r.customer_nickname,
            rating: r.rating,
            comment: r.comment,
            createdAt: r.created_at,
            providerReply: r.provider_reply,
            repliedAt: r.replied_at,
          })),
        );
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (reviewId: string) => {
    setReplyingToId(reviewId);
    const review = reviews.find((r) => r.id === reviewId);
    setReplyText(review?.providerReply || "");
  };

  const cancelReply = () => {
    setReplyingToId(null);
    setReplyText("");
  };

  const submitReply = async () => {
    if (!replyingToId || !replyText.trim() || !providerId) return;
    setIsSubmitting(true);
    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from("reviews")
        .update({ provider_reply: replyText.trim(), replied_at: now })
        .eq("id", replyingToId)
        .eq("provider_id", providerId);

      if (!error) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === replyingToId
              ? { ...r, providerReply: replyText.trim(), repliedAt: now }
              : r,
          ),
        );
        setReplyingToId(null);
        setReplyText("");
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      !searchQuery.trim() ||
      r.customerNickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = filterRating === null || r.rating === filterRating;
    return matchesSearch && matchesRating;
  });

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(
        1,
      )
    : "0.0";

  const ratingCounts = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: reviews.filter((rev) => rev.rating === r).length,
    percentage: reviews.length
      ? (reviews.filter((rev) => rev.rating === r).length / reviews.length) *
        100
      : 0,
  }));

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const getTimeAgo = (dateStr: string) => {
    const seconds = Math.floor(
      (Date.now() - new Date(dateStr).getTime()) / 1000,
    );
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        .provider-reviews {
          padding: 24px 28px;
          max-width: 1600px;
          margin: 0 auto;
          width: 100%;
        }

        /* ── Summary Card — matches profile-card / profile-header-card style ── */
        .reviews-summary {
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        .summary-inner {
          padding: 24px 28px;
          display: flex;
          align-items: center;
          gap: 32px;
        }

        /* Left — big rating number */
        .rating-large {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 20px 28px;
          background: var(--hover-bg);
          border-radius: 14px;
          border: 1.5px solid var(--border-color);
          min-width: 130px;
          flex-shrink: 0;
        }

        .rating-number {
          font-size: 48px;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1;
          letter-spacing: -2px;
        }

        .rating-stars   { display: flex; gap: 3px; }
        .rating-count   { font-size: 12px; color: var(--text-secondary); font-weight: 500; }

        /* Divider */
        .summary-divider {
          width: 1px;
          height: 80px;
          background: var(--border-color);
          flex-shrink: 0;
        }

        /* Right — bar breakdown */
        .summary-stats  { display: flex; flex-direction: column; gap: 9px; flex: 1; }

        .stat-row       { display: flex; align-items: center; gap: 12px; }

        .rating-label {
          min-width: 48px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: color 0.15s;
        }

        .rating-label:hover        { color: var(--text-primary); }
        .rating-label.active       { color: #f59e0b; }

        .stat-bar {
          flex: 1;
          height: 8px;
          background: var(--border-color);
          border-radius: 4px;
          overflow: hidden;
          cursor: pointer;
        }

        .stat-fill {
          height: 100%;
          background: #f59e0b;
          border-radius: 4px;
          transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .stat-count {
          min-width: 22px;
          text-align: right;
          font-weight: 700;
          font-size: 13px;
          color: var(--text-primary);
        }

        /* ── Filter Bar ── */
        .filter-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .search-wrapper { flex: 1; min-width: 240px; }

        .rating-filter-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          background: rgba(245,158,11,0.1);
          color: #d97706;
          border: 1.5px solid rgba(245,158,11,0.3);
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .rating-filter-pill:hover { background: rgba(245,158,11,0.18); }

        .dark-mode .rating-filter-pill {
          background: rgba(245,158,11,0.15);
          color: #fcd34d;
          border-color: rgba(245,158,11,0.3);
        }

        /* ── Reviews Grid ── */
        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .review-card {
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 14px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .review-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: #f59e0b;
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .review-card:hover {
          border-color: var(--border-hover);
          box-shadow: 0 8px 24px var(--card-shadow, rgba(0,0,0,0.08));
          transform: translateY(-2px);
        }

        .review-card:hover::before { transform: scaleX(1); }
        .review-card.needs-reply   { border-left: 3px solid #f59e0b; }

        .review-header { display: flex; justify-content: space-between; align-items: flex-start; }

        .reviewer-nickname { font-size: 14px; font-weight: 700; color: var(--text-primary); margin-bottom: 3px; }
        .review-date       { font-size: 11px; color: var(--text-tertiary); }
        .review-rating     { display: flex; gap: 2px; flex-shrink: 0; }
        .review-comment    { font-size: 13px; color: var(--text-secondary); line-height: 1.6; flex: 1; }

        /* Reply Section */
        .provider-reply-section { border-top: 1.5px solid var(--border-color); padding-top: 14px; }

        .existing-reply {
          background: var(--hover-bg);
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 10px;
          border-left: 3px solid var(--orange-primary);
        }

        .reply-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
          color: var(--text-secondary);
          font-size: 12px;
        }

        .reply-label  { font-weight: 600; }
        .reply-date   { margin-left: auto; color: var(--text-tertiary); }
        .reply-message { font-size: 13px; color: var(--text-secondary); line-height: 1.5; }

        .review-footer { display: flex; justify-content: flex-end; }

        /* Action buttons — neutral, no orange */
        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: 1.5px solid var(--border-color);
          background: var(--card-bg);
          color: var(--text-secondary);
        }

        .action-btn:hover {
          border-color: var(--border-hover);
          color: var(--text-primary);
          background: var(--hover-bg);
        }

        /* Reply Form */
        .reply-form         { display: flex; flex-direction: column; gap: 10px; }

        .reply-textarea {
          width: 100%;
          min-height: 90px;
          padding: 10px 12px;
          border: 1.5px solid var(--input-border);
          border-radius: 10px;
          font-size: 13px;
          font-family: inherit;
          background: var(--input-bg);
          color: var(--text-primary);
          resize: vertical;
          outline: none;
          transition: border-color 0.2s;
        }

        .reply-textarea:focus { border-color: var(--orange-primary); box-shadow: 0 0 0 3px var(--orange-shadow); }

        .reply-actions { display: flex; gap: 8px; justify-content: flex-end; }

        .reply-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: 1.5px solid;
        }

        .reply-btn.primary {
          background: var(--orange-primary);
          color: #fff;
          border-color: var(--orange-primary);
          box-shadow: 0 4px 12px var(--orange-shadow);
        }

        .reply-btn.primary:hover:not(:disabled) {
          background: var(--orange-hover);
          border-color: var(--orange-hover);
          transform: translateY(-1px);
        }

        .reply-btn.primary:disabled { opacity: 0.5; cursor: not-allowed; }

        .reply-btn.secondary {
          background: var(--card-bg);
          color: var(--text-secondary);
          border-color: var(--border-color);
        }

        .reply-btn.secondary:hover { border-color: var(--border-hover); color: var(--text-primary); }

        /* Empty State */
        .empty-state {
          grid-column: 1 / -1;
          padding: 80px 20px;
          text-align: center;
          border: 1.5px dashed var(--border-color);
          border-radius: 14px;
          background: var(--card-bg);
        }

        .empty-icon  { font-size: 48px; margin-bottom: 16px; }
        .empty-title { font-size: 18px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; }
        .empty-text  { font-size: 14px; color: var(--text-secondary); }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }

        /* ── Responsive ── */
        @media (max-width: 1200px) { .reviews-grid { grid-template-columns: repeat(2, 1fr); } }

        @media (max-width: 768px) {
          .provider-reviews { padding: 16px; }
          .summary-inner    { flex-direction: column; align-items: stretch; padding: 16px; gap: 16px; }
          .summary-divider  { display: none; }
          .rating-large     { flex-direction: row; justify-content: space-around; padding: 14px 18px; }
          .rating-number    { font-size: 38px; }
          .filter-bar       { flex-direction: column; align-items: stretch; }
          .reviews-grid     { grid-template-columns: 1fr; gap: 12px; }
          .review-card      { padding: 14px 16px; }
        }

        @media (max-width: 480px) {
          .provider-reviews { padding: 12px; }
          .summary-stats    { gap: 8px; }
          .stat-bar         { min-width: 60px; }
        }
      `}</style>

      <div className="provider-reviews">
        <PageHeader
          title="Reviews & Ratings"
          subtitle="Manage and respond to customer reviews"
          icon={MessageSquare}
        />

        {/* ── Summary Card ── */}
        <div className="reviews-summary">
          <div className="summary-inner">
            {/* Big rating number */}
            <div className="rating-large">
              <div className="rating-number">{avgRating}</div>
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={
                      i < Math.round(parseFloat(avgRating)) ? "#f59e0b" : "none"
                    }
                    stroke="#f59e0b"
                    strokeWidth={2}
                  />
                ))}
              </div>
              <div className="rating-count">{reviews.length} reviews</div>
            </div>

            <div className="summary-divider" />

            {/* Rating breakdown bars */}
            <div className="summary-stats">
              {ratingCounts.map(({ rating, count, percentage }) => (
                <div key={rating} className="stat-row">
                  <div
                    className={`rating-label ${filterRating === rating ? "active" : ""}`}
                    onClick={() =>
                      setFilterRating(filterRating === rating ? null : rating)
                    }
                  >
                    {rating}
                    <Star
                      size={12}
                      fill={
                        filterRating === rating ? "#f59e0b" : "currentColor"
                      }
                      strokeWidth={2}
                    />
                  </div>
                  <div
                    className="stat-bar"
                    onClick={() =>
                      setFilterRating(filterRating === rating ? null : rating)
                    }
                  >
                    <div
                      className="stat-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="stat-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Filter Bar ── */}
        <div className="filter-bar">
          <div className="search-wrapper">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by reviewer or comment..."
            />
          </div>
          {filterRating !== null && (
            <button
              className="rating-filter-pill"
              onClick={() => setFilterRating(null)}
              title="Clear filter"
            >
              {filterRating} Stars
              <X size={13} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* ── Reviews Grid ── */}
        <div className="reviews-grid">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="review-card"
                style={{
                  minHeight: 160,
                  background: "var(--border-color)",
                  opacity: 0.3,
                }}
              />
            ))
          ) : filteredReviews.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">⭐</div>
              <h3 className="empty-title">No reviews found</h3>
              <p className="empty-text">
                {searchQuery || filterRating
                  ? "No reviews match your search"
                  : "No reviews yet"}
              </p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div
                key={review.id}
                className={`review-card ${!review.providerReply ? "needs-reply" : ""}`}
              >
                <div className="review-header">
                  <div>
                    <div className="reviewer-nickname">
                      {review.customerNickname}
                    </div>
                    <div className="review-date">
                      {formatDate(review.createdAt)}
                    </div>
                  </div>
                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={15}
                        fill={i < review.rating ? "#f59e0b" : "none"}
                        stroke={
                          i < review.rating ? "#f59e0b" : "var(--border-color)"
                        }
                        strokeWidth={2}
                      />
                    ))}
                  </div>
                </div>

                <p className="review-comment">{review.comment}</p>

                <div className="provider-reply-section">
                  {replyingToId === review.id ? (
                    <div className="reply-form">
                      <textarea
                        className="reply-textarea"
                        placeholder="Write your professional response..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        autoFocus
                      />
                      <div className="reply-actions">
                        <button
                          className="reply-btn secondary"
                          onClick={cancelReply}
                          disabled={isSubmitting}
                        >
                          <X size={13} /> Cancel
                        </button>
                        <button
                          className="reply-btn primary"
                          onClick={submitReply}
                          disabled={!replyText.trim() || isSubmitting}
                        >
                          {isSubmitting ? (
                            <Loader2 size={13} className="spin" />
                          ) : (
                            <Send size={13} />
                          )}
                          {isSubmitting
                            ? "Sending..."
                            : review.providerReply
                              ? "Update Reply"
                              : "Send Reply"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {review.providerReply && (
                        <div className="existing-reply">
                          <div className="reply-header">
                            <Reply size={12} />
                            <span className="reply-label">Your Response</span>
                            {review.repliedAt && (
                              <span className="reply-date">
                                {getTimeAgo(review.repliedAt)}
                              </span>
                            )}
                          </div>
                          <p className="reply-message">
                            {review.providerReply}
                          </p>
                        </div>
                      )}
                      <div className="review-footer">
                        <button
                          className="action-btn"
                          onClick={() => handleReply(review.id)}
                        >
                          <Reply size={13} strokeWidth={2} />
                          {review.providerReply ? "Edit Reply" : "Reply"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ProviderReviews;
