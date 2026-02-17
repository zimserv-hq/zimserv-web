// src/components/Admin/ConfirmationModal.tsx
import { type LucideIcon } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmStyle?: "danger" | "success" | "primary";
  icon?: LucideIcon;
  isLoading?: boolean;
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmStyle = "primary",
  icon: Icon,
  isLoading = false,
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  const styleMap = {
    danger: { bg: "#ef4444", hover: "#dc2626" },
    success: { bg: "#10b981", hover: "#059669" },
    primary: { bg: "#FF6B35", hover: "#E85A28" },
  };

  const style = styleMap[confirmStyle];

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: #fff;
          border-radius: 16px;
          padding: 28px;
          max-width: 480px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .modal-title {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .modal-message {
          color: #6b7280;
          line-height: 1.6;
          margin-bottom: 24px;
          font-size: 15px;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
        }

        .btn-modal {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cancel {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-cancel:hover:not(:disabled) {
          background: #e5e7eb;
        }

        .btn-confirm {
          color: #fff;
        }

        .btn-modal:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      <div className="modal-overlay" onClick={isLoading ? undefined : onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2 className="modal-title">
            {Icon && <Icon size={24} strokeWidth={2.5} />}
            {title}
          </h2>
          <p className="modal-message">{message}</p>
          <div className="modal-actions">
            <button
              className="btn-modal btn-cancel"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelLabel}
            </button>
            <button
              className="btn-modal btn-confirm"
              onClick={onConfirm}
              disabled={isLoading}
              style={{
                background: style.bg,
              }}
              onMouseEnter={(e) =>
                !isLoading && (e.currentTarget.style.background = style.hover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = style.bg)
              }
            >
              {isLoading ? "Processing..." : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;
