// src/pages/provider/ProviderReviews.tsx
import { useState } from "react";
import { Star, Reply, MessageSquare, Send, X } from "lucide-react";
import PageHeader from "../../components/Admin/PageHeader";
import SearchBar from "../../components/Admin/SearchBar";

interface Review {
  id: string;
  customerNickname: string;
  rating: number;
  comment: string;
  createdAt: Date;
  providerReply?: {
    message: string;
    repliedAt: Date;
  };
}

const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    customerNickname: "John from Borrowdale",
    rating: 5,
    comment: "Excellent service! Fixed my geyser quickly and professionally.",
    createdAt: new Date("2026-02-14T10:30:00"),
    providerReply: {
      message:
        "Thank you so much for your kind words! We're glad we could help you quickly.",
      repliedAt: new Date("2026-02-14T14:20:00"),
    },
  },
  {
    id: "2",
    customerNickname: "Sarah M.",
    rating: 4,
    comment:
      "Good work but took longer than expected. Still satisfied overall.",
    createdAt: new Date("2026-02-14T09:15:00"),
  },
  {
    id: "3",
    customerNickname: "Mike",
    rating: 5,
    comment: "Amazing service. Very thorough and professional work.",
    createdAt: new Date("2026-02-13T14:20:00"),
  },
  {
    id: "4",
    customerNickname: "Anonymous",
    rating: 2,
    comment: "Poor communication and didn't solve my problem completely.",
    createdAt: new Date("2026-02-13T11:00:00"),
  },
  {
    id: "5",
    customerNickname: "Lisa K.",
    rating: 3,
    comment: "Average service. Could have been better.",
    createdAt: new Date("2026-02-12T16:45:00"),
  },
  {
    id: "6",
    customerNickname: "David T.",
    rating: 5,
    comment: "Outstanding work. Highly recommend!",
    createdAt: new Date("2026-02-12T08:30:00"),
    providerReply: {
      message:
        "We appreciate your recommendation! It was a pleasure working with you.",
      repliedAt: new Date("2026-02-12T11:00:00"),
    },
  },
  {
    id: "7",
    customerNickname: "Rachel P.",
    rating: 4,
    comment: "Professional and punctual. Would hire again.",
    createdAt: new Date("2026-02-11T15:20:00"),
  },
  {
    id: "8",
    customerNickname: "Peter W.",
    rating: 5,
    comment: "Exceeded expectations! Great attention to detail.",
    createdAt: new Date("2026-02-10T09:45:00"),
    providerReply: {
      message: "Thank you for the wonderful feedback!",
      repliedAt: new Date("2026-02-10T12:30:00"),
    },
  },
];

const ProviderReviews = () => {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReply = (reviewId: string) => {
    setReplyingToId(reviewId);
    const review = reviews.find((r) => r.id === reviewId);
    setReplyText(review?.providerReply?.message || "");
  };

  const cancelReply = () => {
    setReplyingToId(null);
    setReplyText("");
  };

  const submitReply = () => {
    if (!replyingToId || !replyText.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setReviews((prev) =>
        prev.map((review) =>
          review.id === replyingToId
            ? {
                ...review,
                providerReply: {
                  message: replyText.trim(),
                  repliedAt: new Date(),
                },
              }
            : review,
        ),
      );
      setIsSubmitting(false);
      setReplyingToId(null);
      setReplyText("");
    }, 800);
  };

  const getFilteredReviews = () => {
    let filtered = reviews;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.customerNickname.toLowerCase().includes(query) ||
          r.comment.toLowerCase().includes(query),
      );
    }

    return filtered.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  };

  const filteredReviews = getFilteredReviews();

  const avgRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <>
      <style>{`
        .provider-reviews {
          padding: 24px;
          max-width: 1600px;
          margin: 0 auto;
        }

        .reviews-summary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 24px;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.25);
        }

        .summary-main {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .rating-large {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.15);
          padding: 24px;
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .rating-number {
          font-size: 48px;
          font-weight: 700;
          line-height: 1;
        }

        .rating-stars {
          display: flex;
          gap: 4px;
        }

        .rating-count {
          font-size: 14px;
          opacity: 0.9;
        }

        .summary-divider {
          width: 1px;
          height: 80px;
          background: rgba(255, 255, 255, 0.25);
        }

        .summary-stats {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .stat-row {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
        }

        .stat-label {
          min-width: 80px;
          opacity: 0.95;
          font-weight: 500;
        }

        .stat-bar {
          flex: 1;
          height: 10px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 5px;
          overflow: hidden;
          min-width: 150px;
        }

        .stat-fill {
          height: 100%;
          background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%);
          border-radius: 5px;
          transition: width 0.3s ease;
          box-shadow: 0 0 8px rgba(251, 191, 36, 0.5);
        }

        .stat-value {
          min-width: 30px;
          text-align: right;
          font-weight: 600;
        }

        .search-wrapper {
          margin-bottom: 20px;
        }

        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .review-card {
          background: #fff;
          border: 1px solid #e3e5e8;
          border-radius: 12px;
          padding: 20px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
        }

        .review-card:hover {
          border-color: #d0d3d7;
          box-shadow: 0 1px 3px rgba(60, 64, 67, 0.12), 0 4px 8px 3px rgba(60, 64, 67, 0.08);
        }

        .review-card.needs-reply {
          border-color: #fbbf24;
          background: #fffbeb;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          gap: 12px;
        }

        .reviewer-info {
          flex: 1;
          min-width: 0;
        }

        .reviewer-nickname {
          font-size: 15px;
          font-weight: 600;
          color: #202124;
          margin-bottom: 4px;
        }

        .review-date {
          font-size: 12px;
          color: #5f6368;
        }

        .review-rating {
          display: flex;
          gap: 3px;
          flex-shrink: 0;
        }

        .review-body {
          flex: 1;
          margin-bottom: 16px;
        }

        .review-comment {
          font-size: 14px;
          color: #5f6368;
          line-height: 1.6;
          margin-bottom: 0;
        }

        /* Provider Reply Section */
        .provider-reply-section {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #f1f3f4;
        }

        .existing-reply {
          background: #f8f9fa;
          border-left: 3px solid #667eea;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 12px;
        }

        .reply-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }

        .reply-label {
          font-size: 11px;
          font-weight: 600;
          color: #667eea;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .reply-date {
          font-size: 11px;
          color: #5f6368;
        }

        .reply-message {
          font-size: 13px;
          color: #202124;
          line-height: 1.5;
        }

        /* Reply Form */
        .reply-form {
          background: #f8f9fa;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #e3e5e8;
        }

        .reply-textarea {
          width: 100%;
          min-height: 80px;
          padding: 10px;
          border: 1px solid #dadce0;
          border-radius: 6px;
          font-size: 13px;
          font-family: inherit;
          resize: vertical;
          margin-bottom: 8px;
          transition: border-color 0.15s;
        }

        .reply-textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .reply-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .reply-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
        }

        .reply-btn.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
        }

        .reply-btn.primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .reply-btn.primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .reply-btn.secondary {
          background: #fff;
          color: #5f6368;
          border: 1px solid #dadce0;
        }

        .reply-btn.secondary:hover {
          background: #f8f9fa;
        }

        .review-footer {
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }

        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid #dadce0;
          background: #fff;
          color: #667eea;
        }

        .action-btn:hover {
          background: #f5f7ff;
          border-color: #667eea;
        }

        .action-btn.edit {
          color: #1a73e8;
        }

        .action-btn.edit:hover {
          background: #e8f0fe;
          border-color: #1a73e8;
        }

        .empty-state {
          grid-column: 1 / -1;
          padding: 60px 20px;
          text-align: center;
          border: 1px dashed #dadce0;
          border-radius: 12px;
          background: #fafbfc;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .empty-title {
          font-size: 18px;
          font-weight: 500;
          color: #202124;
          margin-bottom: 8px;
        }

        .empty-text {
          font-size: 14px;
          color: #5f6368;
        }

        /* Tablet: 2 columns */
        @media (max-width: 1024px) and (min-width: 769px) {
          .reviews-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Mobile: 1 column */
        @media (max-width: 768px) {
          .provider-reviews {
            padding: 16px;
          }

          .reviews-summary {
            padding: 20px;
          }

          .summary-main {
            flex-direction: row;
            justify-content: space-between;
            width: 100%;
            gap: 16px;
          }

          .rating-large {
            padding: 16px;
            flex-shrink: 0;
          }

          .rating-number {
            font-size: 36px;
          }

          .rating-stars {
            gap: 2px;
          }

          .rating-stars svg {
            width: 16px;
            height: 16px;
          }

          .rating-count {
            font-size: 12px;
          }

          .summary-divider {
            display: block;
            height: 60px;
          }

          .summary-stats {
            width: auto;
            flex: 1;
            min-width: 0;
            gap: 8px;
          }

          .stat-row {
            font-size: 12px;
          }

          .stat-label {
            min-width: 60px;
            font-size: 12px;
          }

          .stat-bar {
            height: 8px;
            min-width: 80px;
          }

          .stat-value {
            font-size: 12px;
            min-width: 24px;
          }

          .reviews-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .review-card {
            padding: 16px;
          }

          .action-btn {
            width: 100%;
            justify-content: center;
          }

          .reply-actions {
            flex-direction: column-reverse;
          }

          .reply-btn {
            width: 100%;
            justify-content: center;
          }
        }

        /* Extra small mobile */
        @media (max-width: 480px) {
          .summary-main {
            flex-direction: column;
            gap: 12px;
          }

          .summary-divider {
            display: none;
          }

          .rating-large {
            width: 100%;
          }

          .summary-stats {
            width: 100%;
          }

          .stat-bar {
            min-width: 60px;
          }
        }
      `}</style>

      <div className="provider-reviews">
        <PageHeader
          title="Reviews & Ratings"
          subtitle="Manage and respond to customer reviews"
          icon={MessageSquare}
        />

        {/* Reviews Summary Card */}
        <div className="reviews-summary">
          <div className="summary-main">
            <div className="rating-large">
              <div className="rating-number">{avgRating}</div>
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    fill={
                      i < Math.round(parseFloat(avgRating)) ? "#fbbf24" : "none"
                    }
                    stroke="#fbbf24"
                    strokeWidth={2}
                  />
                ))}
              </div>
              <div className="rating-count">{reviews.length} reviews</div>
            </div>

            <div className="summary-divider" />

            <div className="summary-stats">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviews.filter((r) => r.rating === rating).length;
                const percentage = (count / reviews.length) * 100;
                return (
                  <div key={rating} className="stat-row">
                    <span className="stat-label">{rating} stars</span>
                    <div className="stat-bar">
                      <div
                        className="stat-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="stat-value">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="search-wrapper">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by reviewer or comment..."
          />
        </div>

        <div className="reviews-grid">
          {filteredReviews.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3 className="empty-title">No reviews found</h3>
              <p className="empty-text">No reviews match your search</p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div
                key={review.id}
                className={`review-card ${!review.providerReply ? "needs-reply" : ""}`}
              >
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-nickname">
                      {review.customerNickname}
                    </div>
                    <div className="review-date">
                      {review.createdAt.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < review.rating ? "#f9ab00" : "none"}
                        stroke={i < review.rating ? "#f9ab00" : "#dadce0"}
                        strokeWidth={2}
                      />
                    ))}
                  </div>
                </div>

                <div className="review-body">
                  <p className="review-comment">{review.comment}</p>
                </div>

                {/* Provider Reply Section */}
                <div className="provider-reply-section">
                  {replyingToId === review.id ? (
                    <div className="reply-form">
                      <textarea
                        className="reply-textarea"
                        placeholder="Write your response to this review..."
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
                          <X size={14} />
                          Cancel
                        </button>
                        <button
                          className="reply-btn primary"
                          onClick={submitReply}
                          disabled={!replyText.trim() || isSubmitting}
                        >
                          <Send size={14} />
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
                            <span className="reply-date">
                              {review.providerReply.repliedAt.toLocaleDateString(
                                "en-GB",
                                {
                                  day: "numeric",
                                  month: "short",
                                },
                              )}
                            </span>
                          </div>
                          <p className="reply-message">
                            {review.providerReply.message}
                          </p>
                        </div>
                      )}
                      <div className="review-footer">
                        <button
                          className={`action-btn ${review.providerReply ? "edit" : ""}`}
                          onClick={() => handleReply(review.id)}
                        >
                          <Reply size={14} strokeWidth={2} />
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
