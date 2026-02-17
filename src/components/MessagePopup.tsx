// src/components/MessagePopup.tsx
import { useEffect } from "react";

interface MessagePopupProps {
  isOpen: boolean;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const MessagePopup = ({
  isOpen,
  type,
  title,
  message,
  onClose,
  autoClose = true,
  autoCloseDelay = 3000,
}: MessagePopupProps) => {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  // ✅ Type-specific configurations
  const config = {
    success: {
      icon: "✓",
      color: "#4caf50",
      bgColor: "#e8f5e9",
      borderColor: "#4caf50",
    },
    error: {
      icon: "✕",
      color: "#f44336",
      bgColor: "#ffebee",
      borderColor: "#f44336",
    },
    warning: {
      icon: "⚠",
      color: "#ff9800",
      bgColor: "#fff3e0",
      borderColor: "#ff9800",
    },
    info: {
      icon: "ℹ",
      color: "#2196f3",
      bgColor: "#e3f2fd",
      borderColor: "#2196f3",
    },
  };

  const currentConfig = config[type];

  // ✅ Split message by newlines for multi-line display
  const messageLines = message.split("\n").filter((line) => line.trim());

  return (
    <>
      <style>{`
        .toast-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 10000;
          pointer-events: none;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 24px;
        }

        .toast-container {
          background: white;
          border-radius: 12px;
          padding: 20px 24px;
          min-width: 320px;
          max-width: 600px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          animation: slideDown 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          pointer-events: all;
          border-left: 4px solid ${currentConfig.borderColor};
          display: flex;
          gap: 14px;
          align-items: flex-start;
          position: relative;
          max-height: 80vh;
          overflow-y: auto;
        }

        .toast-icon-wrapper {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: ${currentConfig.bgColor};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: ${currentConfig.color};
          font-weight: bold;
        }

        .toast-content {
          flex: 1;
          min-width: 0;
        }

        .toast-title {
          font-size: 16px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 10px 0;
          line-height: 1.4;
        }

        .toast-message {
          font-size: 14px;
          color: #666;
          margin: 0;
          line-height: 1.6;
          white-space: pre-wrap;
        }

        /* ✅ Style for message list */
        .toast-message-list {
          margin: 0;
          padding-left: 20px;
          list-style: disc;
        }

        .toast-message-list li {
          font-size: 14px;
          color: #555;
          line-height: 1.7;
          margin-bottom: 6px;
          word-break: break-word;
        }

        .toast-message-list li:last-child {
          margin-bottom: 0;
        }

        .toast-close {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          color: #999;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: all 0.2s;
          padding: 0;
          line-height: 1;
        }

        .toast-close:hover {
          background: rgba(0, 0, 0, 0.06);
          color: #333;
        }

        .toast-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          background: ${currentConfig.color};
          border-bottom-left-radius: 12px;
          animation: progress ${autoCloseDelay}ms linear forwards;
        }

        /* ✅ Custom scrollbar */
        .toast-container::-webkit-scrollbar {
          width: 6px;
        }

        .toast-container::-webkit-scrollbar-track {
          background: #f5f5f5;
          border-radius: 10px;
        }

        .toast-container::-webkit-scrollbar-thumb {
          background: ${currentConfig.color};
          border-radius: 10px;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        @media (max-width: 640px) {
          .toast-overlay {
            padding: 16px;
          }

          .toast-container {
            min-width: auto;
            width: calc(100vw - 32px);
            max-width: calc(100vw - 32px);
            padding: 16px 18px;
          }

          .toast-icon-wrapper {
            width: 28px;
            height: 28px;
            font-size: 16px;
          }

          .toast-title {
            font-size: 15px;
          }

          .toast-message,
          .toast-message-list li {
            font-size: 13px;
          }

          .toast-close {
            width: 24px;
            height: 24px;
            font-size: 20px;
          }
        }
      `}</style>

      <div className="toast-overlay">
        <div className="toast-container">
          <div className="toast-icon-wrapper">{currentConfig.icon}</div>
          <div className="toast-content">
            <h3 className="toast-title">{title}</h3>
            {/* ✅ Display as list if multiple lines, otherwise as paragraph */}
            {messageLines.length > 1 ? (
              <ul className="toast-message-list">
                {messageLines.map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="toast-message">{message}</p>
            )}
          </div>
          <button
            className="toast-close"
            onClick={onClose}
            aria-label="Close notification"
          >
            ×
          </button>
          {autoClose && <div className="toast-progress" />}
        </div>
      </div>
    </>
  );
};

export default MessagePopup;
