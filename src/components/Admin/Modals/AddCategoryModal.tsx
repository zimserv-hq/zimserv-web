// src/components/Admin/Modals/AddCategoryModal.tsx
import { useState } from "react";
import {
  X,
  Upload,
  FolderOpen,
  AlertCircle,
  Tag,
  FileText,
} from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import { useToast } from "../../../contexts/ToastContext";
import type { Category } from "../CategoriesTable";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (category: Category) => void;
}

const AddCategoryModal = ({
  isOpen,
  onClose,
  onSuccess,
}: AddCategoryModalProps) => {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    iconUrl: "",
    status: "Active",
  });
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        showError("File Too Large", "Please upload an image smaller than 2MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        showError("Invalid File", "Please upload an image file");
        return;
      }

      setIconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadIcon = async (): Promise<string | null> => {
    if (!iconFile) return formData.iconUrl || null;

    try {
      const fileExt = iconFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `category-icons/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("public")
        .upload(filePath, iconFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("public").getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading icon:", error);
      showError("Upload Failed", "Could not upload icon image");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Upload icon if provided
      const iconUrl = await uploadIcon();

      // Insert category
      const { data, error } = await supabase
        .from("categories")
        .insert({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          icon_url: iconUrl,
          status: formData.status,
        })
        .select()
        .single();

      if (error) throw error;

      const newCategory: Category = {
        id: data.id,
        name: data.name,
        description: data.description || "",
        status: data.status as "Active" | "Inactive",
        servicesCount: 0,
        iconUrl: data.icon_url,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      onSuccess(newCategory);
      showSuccess("Success", "Category created successfully!");
      onClose();

      // Reset form
      setFormData({ name: "", description: "", iconUrl: "", status: "Active" });
      setIconFile(null);
      setIconPreview("");
    } catch (error: any) {
      console.error("Error creating category:", error);
      showError("Error", error.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

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

        .form-input, .form-textarea, .form-select {
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
          font-family: inherit;
        }

        .form-textarea {
          min-height: 100px;
          resize: vertical;
          line-height: 1.6;
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: var(--modal-text-secondary);
          opacity: 0.6;
        }

        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          outline: none;
          border-color: var(--modal-input-focus);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          background: var(--modal-bg);
        }

        .dark-mode .form-input:focus,
        .dark-mode .form-textarea:focus,
        .dark-mode .form-select:focus {
          box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.15);
        }

        .form-input.error,
        .form-textarea.error,
        .form-select.error {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.05);
        }

        .form-input.error:focus,
        .form-textarea.error:focus,
        .form-select.error:focus {
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

        .icon-upload-section {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }

        .icon-preview-container {
          flex-shrink: 0;
        }

        .icon-preview {
          width: 100px;
          height: 100px;
          border: 2px dashed var(--modal-input-border);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: var(--modal-hover-bg);
          transition: all 0.2s;
        }

        .icon-preview:hover {
          border-color: var(--modal-input-focus);
        }

        .icon-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .icon-preview-placeholder {
          color: var(--modal-text-secondary);
        }

        .upload-controls {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .upload-btn-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: var(--modal-input-bg);
          border: 1.5px solid var(--modal-input-border);
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          color: var(--modal-text);
          font-size: 13px;
          transition: all 0.2s;
          width: fit-content;
        }

        .upload-btn-label:hover {
          background: var(--modal-hover-bg);
          border-color: var(--modal-input-focus);
          transform: translateY(-1px);
        }

        .upload-or {
          font-size: 12px;
          color: var(--modal-text-secondary);
          font-weight: 600;
          text-align: center;
        }

        .url-input-wrapper .form-input {
          padding: 12px 14px;
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

          .icon-upload-section {
            flex-direction: column;
            gap: 16px;
          }

          .icon-preview {
            width: 80px;
            height: 80px;
          }
        }

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
            <h2 className="modal-title">Add New Category</h2>
            <button className="close-button" onClick={onClose} type="button">
              <X size={20} />
            </button>
          </div>

          <div className="modal-body">
            <div className="info-banner">
              <AlertCircle size={20} className="info-banner-icon" />
              <p className="info-banner-text">
                Categories help organize service providers. After creating a
                category, you can add specific services to it from the Services
                management page.
              </p>
            </div>

            <form onSubmit={handleSubmit} id="add-category-form">
              <div className="form-group">
                <label className="form-label">
                  Category Name <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <Tag size={18} className="input-icon" />
                  <input
                    type="text"
                    className={`form-input ${errors.name ? "error" : ""}`}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Plumbing, Electrical, Carpentry"
                    disabled={loading}
                    required
                  />
                </div>
                {errors.name && (
                  <div className="error-message">
                    <AlertCircle size={14} />
                    {errors.name}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <div className="input-wrapper">
                  <FileText size={18} className="input-icon" />
                  <textarea
                    className="form-textarea"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Brief description of this category (will be replaced by services list)"
                    disabled={loading}
                  />
                </div>
                <div className="form-hint">
                  This will be replaced by service names once services are added
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Category Icon</label>
                <div className="icon-upload-section">
                  <div className="icon-preview-container">
                    <div className="icon-preview">
                      {iconPreview ? (
                        <img src={iconPreview} alt="Icon preview" />
                      ) : formData.iconUrl ? (
                        <img src={formData.iconUrl} alt="Icon" />
                      ) : (
                        <FolderOpen
                          size={40}
                          className="icon-preview-placeholder"
                        />
                      )}
                    </div>
                  </div>
                  <div className="upload-controls">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleIconChange}
                      style={{ display: "none" }}
                      id="icon-upload"
                      disabled={loading}
                    />
                    <label htmlFor="icon-upload" className="upload-btn-label">
                      <Upload size={16} />
                      Upload Image
                    </label>
                    <div className="upload-or">OR</div>
                    <div className="url-input-wrapper">
                      <input
                        type="url"
                        className="form-input"
                        placeholder="Paste image URL"
                        value={formData.iconUrl}
                        onChange={(e) => {
                          setFormData({ ...formData, iconUrl: e.target.value });
                          setIconPreview(""); // Clear file preview
                          setIconFile(null);
                        }}
                        disabled={loading}
                      />
                    </div>
                    <div className="form-hint">Max 2MB • JPG, PNG, or WEBP</div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <div className="input-wrapper">
                  <FolderOpen size={18} className="input-icon" />
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    disabled={loading}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="form-hint">
                  Inactive categories won't be visible to users
                </div>
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
              form="add-category-form"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Category"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCategoryModal;
