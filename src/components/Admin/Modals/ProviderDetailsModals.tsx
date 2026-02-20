// src/pages/admin/ProviderDetailsModals.tsx
import { useState } from "react";
import {
  XCircle,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ─── Skeleton Loader ──────────────────────────────────────────────────────────

export const SkeletonLoader = () => (
  <>
    <style>{`
      @keyframes skShimmer {
        0%   { background-position: -700px 0; }
        100% { background-position:  700px 0; }
      }
      .sk {
        background: linear-gradient(90deg, var(--sk-base) 25%, var(--sk-hi) 50%, var(--sk-base) 75%);
        background-size: 700px 100%;
        animation: skShimmer 1.6s ease-in-out infinite;
        border-radius: 6px;
        flex-shrink: 0;
      }
      :root { --sk-base: #f0f0f0; --sk-hi: #e4e4e4; }
      .dark-mode { --sk-base: #374151; --sk-hi: #4b5563; }
      .sk-back { height: 44px; width: 160px; border-radius: 12px; margin-bottom: 24px; }
      .sk-hdr {
        display: flex; justify-content: space-between; align-items: flex-start;
        gap: 24px; padding: 28px; background: var(--card-bg);
        border: 1.5px solid var(--border-color); border-radius: 16px; margin-bottom: 32px;
      }
      .sk-hdr-left { display: flex; gap: 24px; flex: 1; }
      .sk-avatar { width: 120px; height: 120px; border-radius: 16px; }
      .sk-hdr-info { display: flex; flex-direction: column; gap: 12px; padding-top: 4px; }
      .sk-hdr-meta { display: flex; gap: 14px; flex-wrap: wrap; }
      .sk-hdr-actions { display: flex; gap: 12px; }
      .sk-hdr-btn { height: 46px; width: 110px; border-radius: 12px; }
      .sk-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin-bottom: 32px; }
      .sk-stat {
        padding: 24px; background: var(--card-bg);
        border: 1.5px solid var(--border-color); border-radius: 16px;
        display: flex; flex-direction: column; gap: 16px; min-height: 110px;
      }
      .sk-stat-top { display: flex; justify-content: space-between; align-items: center; }
      .sk-stat-icon { width: 40px; height: 40px; border-radius: 10px; }
      .sk-tabs { background: var(--card-bg); border: 1.5px solid var(--border-color); border-radius: 16px; overflow: hidden; }
      .sk-tabs-nav {
        display: flex; gap: 8px; padding: 0 16px;
        border-bottom: 1.5px solid var(--border-color); background: var(--tabs-bg);
        height: 54px; align-items: center;
      }
      .sk-tab { height: 22px; border-radius: 6px; }
      .sk-tabs-body { padding: 28px; }
      .sk-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
      .sk-card {
        background: var(--card-bg); border: 1.5px solid var(--border-color);
        border-radius: 14px; padding: 24px; margin-bottom: 24px;
        display: flex; flex-direction: column; gap: 14px;
      }
      .sk-card-title { display: flex; gap: 10px; align-items: center; }
      .sk-row {
        display: flex; justify-content: space-between;
        padding: 14px 0; border-bottom: 1px solid var(--border-color);
      }
      .sk-row:last-child { border-bottom: none; }
      .sk-contact {
        display: flex; gap: 12px; align-items: center;
        padding: 14px; background: var(--chip-bg);
        border-radius: 12px; margin-bottom: 12px;
      }
      .sk-contact-icon { width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0; }
      @media (max-width: 1024px) { .sk-grid { grid-template-columns: 1fr; } }
      @media (max-width: 768px) {
        .sk-hdr { flex-direction: column; padding: 20px; }
        .sk-hdr-left { flex-direction: column; align-items: center; }
        .sk-avatar { width: 80px; height: 80px; }
        .sk-hdr-actions { width: 100%; flex-direction: column; }
        .sk-hdr-btn { width: 100%; }
        .sk-stats { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .sk-tabs-body { padding: 20px; }
      }
    `}</style>

    <div className="provider-details">
      <div className="sk sk-back" />
      <div className="sk-hdr">
        <div className="sk-hdr-left">
          <div className="sk sk-avatar" />
          <div className="sk-hdr-info">
            <div
              className="sk"
              style={{ width: 220, height: 32, borderRadius: 8 }}
            />
            <div className="sk-hdr-meta">
              <div className="sk" style={{ width: 110, height: 16 }} />
              <div className="sk" style={{ width: 90, height: 16 }} />
              <div className="sk" style={{ width: 130, height: 16 }} />
            </div>
            <div
              className="sk"
              style={{ width: 80, height: 30, borderRadius: 20 }}
            />
          </div>
        </div>
        <div className="sk-hdr-actions">
          <div className="sk sk-hdr-btn" />
          <div className="sk sk-hdr-btn" />
        </div>
      </div>
      <div className="sk-stats">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="sk-stat">
            <div className="sk-stat-top">
              <div className="sk" style={{ width: 80, height: 13 }} />
              <div className="sk sk-stat-icon" />
            </div>
            <div className="sk" style={{ width: 60, height: 28 }} />
          </div>
        ))}
      </div>
      <div className="sk-tabs">
        <div className="sk-tabs-nav">
          {[90, 90, 100, 110].map((w, i) => (
            <div key={i} className="sk sk-tab" style={{ width: w }} />
          ))}
        </div>
        <div className="sk-tabs-body">
          <div className="sk-grid">
            <div>
              <div className="sk-card">
                <div className="sk-card-title">
                  <div className="sk sk-stat-icon" />
                  <div className="sk" style={{ width: 60, height: 18 }} />
                </div>
                <div className="sk" style={{ width: "100%", height: 14 }} />
                <div className="sk" style={{ width: "92%", height: 14 }} />
                <div className="sk" style={{ width: "78%", height: 14 }} />
                <div>
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="sk-row">
                      <div className="sk" style={{ width: 80, height: 14 }} />
                      <div className="sk" style={{ width: 100, height: 14 }} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="sk-card">
                <div className="sk-card-title">
                  <div className="sk sk-stat-icon" />
                  <div className="sk" style={{ width: 160, height: 18 }} />
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[80, 110, 95, 70, 125, 85].map((w, i) => (
                    <div
                      key={i}
                      className="sk"
                      style={{ width: w, height: 34, borderRadius: 8 }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="sk-card">
                <div className="sk-card-title">
                  <div className="sk sk-stat-icon" />
                  <div className="sk" style={{ width: 160, height: 18 }} />
                </div>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="sk-contact">
                    <div className="sk sk-contact-icon" />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <div className="sk" style={{ width: 50, height: 11 }} />
                      <div className="sk" style={{ width: 150, height: 14 }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="sk-card">
                <div className="sk-card-title">
                  <div className="sk sk-stat-icon" />
                  <div className="sk" style={{ width: 110, height: 18 }} />
                </div>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="sk-row">
                    <div className="sk" style={{ width: 70, height: 14 }} />
                    <div className="sk" style={{ width: 90, height: 14 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

// ─── Reject Reason Modal ──────────────────────────────────────────────────────

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading: boolean;
}

export const RejectReasonModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: RejectModalProps) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(reason.trim());
    setReason("");
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <>
      <style>{`
        .rr-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 10000; padding: 20px;
          animation: rrFadeIn 0.2s ease;
        }
        @keyframes rrFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .rr-modal {
          background: var(--card-bg); border: 1.5px solid var(--border-color);
          border-radius: 16px; max-width: 480px; width: 100%;
          box-shadow: 0 24px 80px rgba(0,0,0,0.3);
          animation: rrSlideUp 0.3s cubic-bezier(0.4,0,0.2,1); overflow: hidden;
        }
        @keyframes rrSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .rr-header { padding: 24px 28px 20px; display: flex; align-items: flex-start; gap: 14px; }
        .rr-icon {
          width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
          background: var(--danger-bg); color: var(--danger-color);
          display: flex; align-items: center; justify-content: center;
        }
        .rr-title { font-size: 18px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; letter-spacing: -0.3px; }
        .rr-subtitle { font-size: 13px; color: var(--text-secondary); font-weight: 500; line-height: 1.5; }
        .rr-body { padding: 0 28px 20px; }
        .rr-label { display: block; font-size: 13px; font-weight: 700; color: var(--text-primary); margin-bottom: 10px; letter-spacing: -0.1px; }
        .rr-textarea {
          width: 100%; padding: 14px 16px;
          border: 1.5px solid var(--border-color); border-radius: 10px;
          background: var(--chip-bg); color: var(--text-primary);
          font-size: 14px; font-weight: 500; font-family: inherit;
          resize: vertical; min-height: 100px; outline: none;
          transition: all 0.2s ease; box-sizing: border-box; line-height: 1.6;
        }
        .rr-textarea::placeholder { color: var(--text-secondary); opacity: 0.6; }
        .rr-textarea:focus {
          border-color: var(--danger-color);
          box-shadow: 0 0 0 3px rgba(239,68,68,0.1);
          background: var(--card-bg);
        }
        .rr-hint { font-size: 12px; color: var(--text-secondary); margin-top: 8px; font-weight: 500; }
        .rr-footer {
          padding: 16px 28px 24px; display: flex; gap: 12px; justify-content: flex-end;
          border-top: 1.5px solid var(--border-color);
        }
        .rr-btn {
          padding: 12px 24px; border-radius: 10px; font-size: 14px;
          font-weight: 700; cursor: pointer; transition: all 0.2s ease;
          border: none; letter-spacing: -0.1px;
          display: inline-flex; align-items: center; gap: 7px;
        }
        .rr-btn-cancel { background: var(--chip-bg); color: var(--text-primary); border: 1.5px solid var(--border-color); }
        .rr-btn-cancel:hover:not(:disabled) { background: var(--hover-bg); transform: translateY(-1px); }
        .rr-btn-confirm {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: #fff; box-shadow: 0 4px 12px rgba(239,68,68,0.3);
        }
        .rr-btn-confirm:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(239,68,68,0.4); }
        .rr-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }
        @media (max-width: 480px) {
          .rr-footer { flex-direction: column-reverse; }
          .rr-btn { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="rr-overlay" onClick={handleClose}>
        <div className="rr-modal" onClick={(e) => e.stopPropagation()}>
          <div className="rr-header">
            <div className="rr-icon">
              <XCircle size={22} strokeWidth={2.5} />
            </div>
            <div>
              <div className="rr-title">Reject Sensitive Changes</div>
              <div className="rr-subtitle">
                The provider will be notified. Safe changes were already applied
                automatically.
              </div>
            </div>
          </div>
          <div className="rr-body">
            <label className="rr-label">Reason for Rejection</label>
            <textarea
              className="rr-textarea"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. The business name change does not match your submitted verification documents…"
              disabled={isLoading}
              autoFocus
            />
            <div className="rr-hint">
              Optional — leave blank to reject without an explanation
            </div>
          </div>
          <div className="rr-footer">
            <button
              className="rr-btn rr-btn-cancel"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className="rr-btn rr-btn-confirm"
              onClick={handleConfirm}
              disabled={isLoading}
            >
              <XCircle size={15} strokeWidth={2.5} />
              {isLoading ? "Rejecting…" : "Reject Changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Edit Comparison Modal ────────────────────────────────────────────────────

interface PendingEdit {
  id: string;
  auto_approved_fields: Record<string, any>;
  pending_review_fields: Record<string, any>;
  status: string;
  requested_at: string;
  auto_applied_at?: string;
}

interface EditComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  // FIX: accepts all pending edits, not just the first one
  editRequests: PendingEdit[];
  provider: any;
  isProcessing: boolean;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => void;
  getFieldLabel: (field: string) => string;
  formatValue: (value: any) => string;
}

export const EditComparisonModal = ({
  isOpen,
  onClose,
  editRequests,
  provider,
  isProcessing,
  onApprove,
  onReject,
  getFieldLabel,
  formatValue,
}: EditComparisonModalProps) => {
  // FIX: navigation state for multiple requests
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen || !editRequests || editRequests.length === 0) return null;

  const editRequest = editRequests[currentIndex];
  const hasAutoApproved =
    Object.keys(editRequest.auto_approved_fields || {}).length > 0;
  const hasPendingReview =
    Object.keys(editRequest.pending_review_fields || {}).length > 0;
  const hasMultiple = editRequests.length > 1;

  // FIX: await approve before closing
  const handleApprove = async () => {
    await onApprove(editRequest.id);
    // If this was the last request, close — otherwise move to next
    if (editRequests.length <= 1) {
      onClose();
    } else {
      setCurrentIndex((prev) => Math.min(prev, editRequests.length - 2));
    }
  };

  return (
    <>
      <style>{`
        .edit-modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px); display: flex; align-items: center;
          justify-content: center; z-index: 9999; padding: 20px;
        }
        .edit-modal {
          background: var(--card-bg); border-radius: 16px;
          max-width: 800px; width: 100%; max-height: 80vh;
          overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .edit-modal-header { padding: 24px; border-bottom: 1.5px solid var(--border-color); }
        .edit-modal-title { font-size: 20px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; }
        .edit-modal-subtitle { font-size: 14px; color: var(--text-secondary); }

        /* FIX: pagination nav styles */
        .edit-modal-nav {
          display: flex; align-items: center; gap: 12px;
          margin-top: 12px; padding-top: 12px;
          border-top: 1px solid var(--border-color);
        }
        .edit-nav-btn {
          display: flex; align-items: center; justify-content: center;
          width: 32px; height: 32px; border-radius: 8px;
          background: var(--chip-bg); border: 1.5px solid var(--border-color);
          color: var(--text-primary); cursor: pointer; transition: all 0.2s ease;
        }
        .edit-nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .edit-nav-btn:not(:disabled):hover { background: var(--hover-bg); }
        .edit-nav-label { font-size: 13px; font-weight: 600; color: var(--text-secondary); }

        .edit-modal-body { padding: 24px; }
        .edit-comparison {
          margin-bottom: 20px; padding: 16px; background: var(--chip-bg);
          border-radius: 12px; border: 2px solid transparent; transition: all 0.2s ease;
        }
        .edit-comparison:hover { border-color: var(--orange-primary); background: var(--hover-bg); }
        .edit-field-label {
          font-size: 12px; font-weight: 700; color: var(--text-secondary);
          text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;
        }
        .edit-values { display: grid; grid-template-columns: 1fr auto 1fr; gap: 16px; align-items: center; }
        .edit-value-box { padding: 12px; border-radius: 8px; font-size: 14px; }
        .edit-value-old { background: rgba(239,68,68,0.1); color: var(--text-secondary); text-decoration: line-through; }
        .edit-value-new { background: rgba(16,185,129,0.1); color: var(--text-primary); font-weight: 600; }
        .edit-arrow { color: var(--orange-primary); font-size: 20px; font-weight: 700; }

        /* FIX: empty state */
        .edit-empty-state {
          text-align: center; padding: 40px 20px;
          color: var(--text-secondary); font-size: 14px; font-weight: 500;
        }

        .edit-modal-footer {
          padding: 20px 24px; border-top: 1.5px solid var(--border-color);
          display: flex; gap: 12px; justify-content: flex-end;
        }
        .modal-btn {
          padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: 700;
          cursor: pointer; transition: all 0.2s ease; border: none;
          display: inline-flex; align-items: center; gap: 6px;
        }
        .modal-btn.cancel { background: var(--chip-bg); color: var(--text-primary); }
        .modal-btn.reject { background: var(--danger-color); color: white; }
        .modal-btn.approve { background: var(--success-color); color: white; }
        .modal-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .modal-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }
        @media (max-width: 1024px) {
          .edit-values { grid-template-columns: 1fr; gap: 8px; }
          .edit-arrow { transform: rotate(90deg); }
        }
        @media (max-width: 768px) {
          .edit-modal-footer { flex-direction: column; }
          .modal-btn { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="edit-modal-overlay" onClick={onClose}>
        <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="edit-modal-header">
            <div className="edit-modal-title">Review Profile Changes</div>
            <div className="edit-modal-subtitle">
              Requested on {new Date(editRequest.requested_at).toLocaleString()}
              {editRequest.auto_applied_at && (
                <span
                  style={{
                    color: "var(--success-color)",
                    marginLeft: "12px",
                    fontWeight: "600",
                  }}
                >
                  ✓ Safe fields auto-applied
                </span>
              )}
            </div>

            {/* FIX: multi-request navigation */}
            {hasMultiple && (
              <div className="edit-modal-nav">
                <button
                  className="edit-nav-btn"
                  onClick={() => setCurrentIndex((p) => p - 1)}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft size={16} strokeWidth={2.5} />
                </button>
                <span className="edit-nav-label">
                  Request {currentIndex + 1} of {editRequests.length}
                </span>
                <button
                  className="edit-nav-btn"
                  onClick={() => setCurrentIndex((p) => p + 1)}
                  disabled={currentIndex === editRequests.length - 1}
                >
                  <ChevronRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="edit-modal-body">
            {/* FIX: empty state */}
            {!hasAutoApproved && !hasPendingReview && (
              <div className="edit-empty-state">
                No field changes found for this request.
              </div>
            )}

            {/* Auto-approved section */}
            {hasAutoApproved && (
              <>
                <div
                  style={{
                    padding: "12px 16px",
                    background: "var(--success-bg)",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <CheckCircle2 size={18} color="var(--success-color)" />
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "var(--success-color)",
                    }}
                  >
                    ✓ Auto-Approved Changes (Already Applied)
                  </span>
                </div>
                {Object.entries(editRequest.auto_approved_fields).map(
                  ([field, newValue]) => (
                    <div
                      key={field}
                      className="edit-comparison"
                      style={{ opacity: 0.7, background: "var(--success-bg)" }}
                    >
                      <div className="edit-field-label">
                        {getFieldLabel(field)}{" "}
                        <span
                          style={{
                            color: "var(--success-color)",
                            fontSize: "11px",
                            fontWeight: "700",
                          }}
                        >
                          ✓ SAFE
                        </span>
                      </div>
                      <div className="edit-values">
                        {/* FIX: show a note instead of wrong old value since it was already applied */}
                        <div
                          className="edit-value-box edit-value-old"
                          style={{
                            fontStyle: "italic",
                            textDecoration: "none",
                          }}
                        >
                          Previous value replaced
                        </div>
                        <div className="edit-arrow">→</div>
                        <div className="edit-value-box edit-value-new">
                          {formatValue(newValue as any)}
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </>
            )}

            {/* Pending review section */}
            {hasPendingReview && (
              <>
                <div
                  style={{
                    padding: "12px 16px",
                    background: "var(--orange-light-bg)",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    marginTop: hasAutoApproved ? "24px" : "0",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <AlertCircle size={18} color="var(--orange-primary)" />
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "var(--orange-primary)",
                    }}
                  >
                    ⚠️ Sensitive Changes Requiring Review
                  </span>
                </div>
                {Object.entries(editRequest.pending_review_fields).map(
                  ([field, newValue]) => (
                    <div key={field} className="edit-comparison">
                      <div className="edit-field-label">
                        {getFieldLabel(field)}
                        <span
                          style={{
                            marginLeft: "8px",
                            color: "var(--danger-color)",
                            fontSize: "11px",
                            fontWeight: "700",
                          }}
                        >
                          🔒 SENSITIVE
                        </span>
                      </div>
                      <div className="edit-values">
                        <div className="edit-value-box edit-value-old">
                          {formatValue(provider?._rawData[field])}
                        </div>
                        <div className="edit-arrow">→</div>
                        <div className="edit-value-box edit-value-new">
                          {formatValue(newValue as any)}
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="edit-modal-footer">
            <button
              className="modal-btn cancel"
              onClick={onClose}
              disabled={isProcessing}
            >
              Close
            </button>
            {hasPendingReview && (
              <>
                <button
                  className="modal-btn reject"
                  onClick={() => onReject(editRequest.id)}
                  disabled={isProcessing}
                >
                  <XCircle size={16} strokeWidth={2.5} />
                  Reject Sensitive Changes
                </button>
                {/* FIX: awaits async approve before closing */}
                <button
                  className="modal-btn approve"
                  onClick={handleApprove}
                  disabled={isProcessing}
                >
                  <CheckCircle2 size={16} strokeWidth={2.5} />
                  {isProcessing ? "Approving…" : "Approve Sensitive Changes"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
