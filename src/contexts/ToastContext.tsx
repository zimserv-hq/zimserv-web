// src/contexts/ToastContext.tsx
import React, { createContext, useContext, useState, useCallback } from "react";
import MessagePopup from "../components/MessagePopup";

interface ToastConfig {
  isOpen: boolean;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
}

interface ToastContextType {
  showToast: (
    type: "success" | "error" | "info" | "warning",
    title: string,
    message: string,
    autoClose?: boolean,
    autoCloseDelay?: number,
  ) => void;
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
  showInfo: (title: string, message: string) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toastConfig, setToastConfig] = useState<ToastConfig>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  const [autoClose, setAutoClose] = useState(true);
  const [autoCloseDelay, setAutoCloseDelay] = useState(3000);

  const showToast = useCallback(
    (
      type: "success" | "error" | "info" | "warning",
      title: string,
      message: string,
      shouldAutoClose = true,
      delay = 3000,
    ) => {
      // ✅ FIX: Force close first, then open with new content
      setToastConfig((prev) => ({ ...prev, isOpen: false }));

      // ✅ Use setTimeout to ensure state updates properly
      setTimeout(() => {
        setToastConfig({
          isOpen: true,
          type,
          title,
          message,
        });
        setAutoClose(shouldAutoClose);
        setAutoCloseDelay(delay);
      }, 10); // Small delay to ensure re-render
    },
    [],
  );

  const showSuccess = useCallback(
    (title: string, message: string) => {
      showToast("success", title, message);
    },
    [showToast],
  );

  const showError = useCallback(
    (title: string, message: string) => {
      showToast("error", title, message);
    },
    [showToast],
  );

  const showWarning = useCallback(
    (title: string, message: string) => {
      showToast("warning", title, message);
    },
    [showToast],
  );

  const showInfo = useCallback(
    (title: string, message: string) => {
      showToast("info", title, message);
    },
    [showToast],
  );

  const hideToast = useCallback(() => {
    setToastConfig((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        hideToast,
      }}
    >
      {children}
      <MessagePopup
        isOpen={toastConfig.isOpen}
        type={toastConfig.type}
        title={toastConfig.title}
        message={toastConfig.message}
        onClose={hideToast}
        autoClose={autoClose}
        autoCloseDelay={autoCloseDelay}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
