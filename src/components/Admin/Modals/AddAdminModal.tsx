import { useState } from "react";
import { X, Mail, Lock, User, AlertCircle } from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import { useToast } from "../../../contexts/ToastContext";
import type { Admin } from "../AdminsTable";

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (admin: Admin) => void;
}

const AddAdminModal = ({ isOpen, onClose, onSuccess }: AddAdminModalProps) => {
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("No active session");
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-admin-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create admin");
      }

      const newAdmin: Admin = {
        id: result.user.id,
        email: result.user.email,
        fullName: result.user.full_name,
        role: "admin",
        status: "Active",
        createdAt: new Date(),
        createdBy: result.user.created_by,
      };

      onSuccess(newAdmin);
      showSuccess("Success", "Admin created successfully!");
      onClose();
      setFormData({ email: "", password: "", fullName: "" });
    } catch (error: any) {
      console.error("Error creating admin:", error);
      showError("Error", error.message || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        /* Dark Mode Variables */
        :root {
          --modal-overlay-bg: rgba(0, 0, 0, 0.5);
          --modal-bg: #ffffff;
          --modal-text: #111827;
          --modal-text-secondary: #6b7280;
          --modal-border: #e5e7eb;
          --modal-hover-bg: #f3f4f6;
          --modal-input-bg: #ffffff;
          --modal-input-border: #d1d5db;
          --modal-input-focus: #3b82f6;
        }

        .dark-mode {
          --modal-overlay-bg: rgba(0, 0, 0, 0.75);
          --modal-bg: #1f2937;
          --modal-text: #f9fafb;
          --modal-text-secondary: #d1d5db;
          --modal-border: #374151;
          --modal-hover-bg: #374151;
          --modal-input-bg: #111827;
          --modal-input-border: #4b5563;
          --modal-input-focus: #60a5fa;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: var(--modal-overlay-bg);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 16px;
          animation: fadeIn 0.2s ease-out;
          overflow-y: auto;
        }

        .modal-container {
          background: var(--modal-bg);
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          border: 1px solid var(--modal-border);
          max-width: 520px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
          animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin: auto;
          position: relative;
        }

        /* Custom scrollbar for modal */
        .modal-container::-webkit-scrollbar {
          width: 8px;
        }

        .modal-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .modal-container::-webkit-scrollbar-thumb {
          background: var(--modal-input-border);
          border-radius: 4px;
        }

        .modal-container::-webkit-scrollbar-thumb:hover {
          background: var(--modal-text-secondary);
        }

        .modal-header {
          padding: 24px 28px;
          border-bottom: 1px solid var(--modal-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          background: var(--modal-bg);
          z-index: 10;
          border-radius: 16px 16px 0 0;
        }

        .modal-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--modal-text);
          margin: 0;
          letter-spacing: -0.3px;
        }

        .close-button {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          color: var(--modal-text-secondary);
          border-radius: 8px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          background: var(--modal-hover-bg);
          color: var(--modal-text);
          transform: rotate(90deg);
        }

        .modal-body {
          padding: 24px 28px;
        }

        .info-banner {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 12px;
          padding: 14px 16px;
          margin-bottom: 24px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .dark-mode .info-banner {
          background: rgba(96, 165, 250, 0.15);
          border-color: rgba(96, 165, 250, 0.3);
        }

        .info-banner-icon {
          color: #3b82f6;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .dark-mode .info-banner-icon {
          color: #60a5fa;
        }

        .info-banner-text {
          font-size: 13px;
          color: #1e40af;
          line-height: 1.6;
          font-weight: 500;
        }

        .dark-mode .info-banner-text {
          color: #bfdbfe;
        }

        .form-group {
          margin-bottom: 22px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 700;
          color: var(--modal-text);
          margin-bottom: 8px;
          letter-spacing: -0.1px;
        }

        .required {
          color: #ef4444;
          font-weight: 700;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--modal-text-secondary);
          pointer-events: none;
          z-index: 1;
        }

        .form-input {
          width: 100%;
          padding: 12px 14px 12px 44px;
          border: 1.5px solid var(--modal-input-border);
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
          background: var(--modal-input-bg);
          color: var(--modal-text);
          box-sizing: border-box;
        }

        .form-input::placeholder {
          color: var(--modal-text-secondary);
          opacity: 0.6;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--modal-input-focus);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          background: var(--modal-bg);
        }

        .dark-mode .form-input:focus {
          box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.15);
        }

        .form-input.error {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.05);
        }

        .form-input.error:focus {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #ef4444;
          font-size: 12px;
          margin-top: 8px;
          font-weight: 600;
        }

        .dark-mode .error-message {
          color: #fca5a5;
        }

        .form-hint {
          font-size: 12px;
          color: var(--modal-text-secondary);
          margin-top: 8px;
          font-weight: 500;
        }

        .modal-footer {
          padding: 20px 28px;
          border-top: 1px solid var(--modal-border);
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          position: sticky;
          bottom: 0;
          background: var(--modal-bg);
          border-radius: 0 0 16px 16px;
        }

        .btn {
          padding: 11px 24px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          letter-spacing: -0.1px;
        }

        .btn-secondary {
          background: var(--modal-input-bg);
          color: var(--modal-text);
          border: 1.5px solid var(--modal-input-border);
        }

        .btn-secondary:hover:not(:disabled) {
          background: var(--modal-hover-bg);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .btn-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
        }

        .dark-mode .btn-primary {
          background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
          box-shadow: 0 4px 12px rgba(96, 165, 250, 0.3);
        }

        .dark-mode .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          box-shadow: 0 6px 16px rgba(96, 165, 250, 0.4);
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }

        .btn-primary:disabled {
          background: #9ca3af;
          box-shadow: none;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        /* Tablet */
        @media (max-width: 640px) {
          .modal-container {
            max-height: 90vh;
            border-radius: 12px;
          }

          .modal-header,
          .modal-body,
          .modal-footer {
            padding-left: 20px;
            padding-right: 20px;
          }

          .modal-title {
            font-size: 18px;
          }

          .btn {
            padding: 10px 20px;
            font-size: 13px;
          }
        }

        /* Small mobile — bottom-sheet style, stacked full-width buttons */
        @media (max-width: 480px) {
          .modal-overlay {
            align-items: flex-end;
            padding: 0 0 100px;
          }

          .modal-container {
            border-radius: 20px 20px 16px 16px;
            max-height: 90vh;
            max-width: calc(100% - 24px);
            width: 100%;
            margin: 0 12px;
            animation: slideUpSheet 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          @keyframes slideUpSheet {
            from {
              transform: translateY(100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          .modal-header {
            padding: 18px 20px 16px;
            border-radius: 20px 20px 0 0;
          }

          .modal-header::before {
            content: '';
            display: block;
            width: 36px;
            height: 4px;
            background: var(--modal-border);
            border-radius: 2px;
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
          }

          .modal-title {
            font-size: 17px;
          }

          .modal-body {
            padding: 20px 20px 8px;
          }

          .modal-footer {
            flex-direction: column-reverse;
            gap: 10px;
            padding: 16px 20px 24px;
            border-radius: 0;
          }

          .btn {
            width: 100%;
            padding: 13px 20px;
            font-size: 14px;
            text-align: center;
            justify-content: center;
          }

          .form-group {
            margin-bottom: 18px;
          }
        }
      `}</style>

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">Create New Admin</h2>
            <button className="close-button" onClick={onClose} type="button">
              <X size={20} />
            </button>
          </div>

          <div className="modal-body">
            <div className="info-banner">
              <AlertCircle size={20} className="info-banner-icon" />
              <p className="info-banner-text">
                New admins will have full access to approve/reject applications
                and manage the platform, but cannot create other admin accounts.
              </p>
            </div>

            <form onSubmit={handleSubmit} id="create-admin-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-wrapper">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    className="form-input"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="John Doe"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Email Address <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    className={`form-input ${errors.email ? "error" : ""}`}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter the email"
                    disabled={loading}
                    required
                  />
                </div>
                {errors.email && (
                  <div className="error-message">
                    <AlertCircle size={14} />
                    {errors.email}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Password <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    className={`form-input ${errors.password ? "error" : ""}`}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Minimum 8 characters"
                    disabled={loading}
                    required
                  />
                </div>
                {errors.password ? (
                  <div className="error-message">
                    <AlertCircle size={14} />
                    {errors.password}
                  </div>
                ) : (
                  <div className="form-hint">
                    Must be at least 8 characters long
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              form="create-admin-form"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Admin"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAdminModal;
