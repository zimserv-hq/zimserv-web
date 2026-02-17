// src/components/Admin/Modals/EditCategoryModal.tsx
import { useState, useEffect } from "react";
import {
  X,
  Upload,
  FolderOpen,
  AlertCircle,
  Tag,
  FileText,
  Plus,
  Edit2,
  Trash2,
  Settings,
} from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import { useToast } from "../../../contexts/ToastContext";

export interface Category {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Inactive";
  servicesCount: number;
  iconUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Service {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  display_order: number;
}

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (category: Category) => void;
  category: Category;
}

const EditCategoryModal = ({
  isOpen,
  onClose,
  onSuccess,
  category,
}: EditCategoryModalProps) => {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: category.description,
    iconUrl: category.iconUrl,
    status: category.status,
  });
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>(category.iconUrl);

  // Services state
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newService, setNewService] = useState({ name: "", description: "" });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        description: category.description,
        iconUrl: category.iconUrl,
        status: category.status,
      });
      setIconPreview(category.iconUrl);
      setIconFile(null);
      setShowAddService(false);
      setEditingService(null);
      fetchServices();
    }
  }, [isOpen, category]);

  const fetchServices = async () => {
    try {
      setLoadingServices(true);
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("category_id", category.id)
        .order("display_order");

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoadingServices(false);
    }
  };

  const handleAddService = async () => {
    if (!newService.name.trim()) {
      showError("Validation Error", "Service name is required");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("services")
        .insert({
          category_id: category.id,
          name: newService.name.trim(),
          description: newService.description.trim(),
          display_order: services.length + 1,
        })
        .select()
        .single();

      if (error) throw error;

      setServices([...services, data]);
      setNewService({ name: "", description: "" });
      setShowAddService(false);
      showSuccess("Success", "Service added successfully");
    } catch (error: any) {
      showError("Error", error.message || "Failed to add service");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateService = async () => {
    if (!editingService || !editingService.name.trim()) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from("services")
        .update({
          name: editingService.name.trim(),
          description: editingService.description.trim(),
        })
        .eq("id", editingService.id);

      if (error) throw error;

      setServices(
        services.map((s) => (s.id === editingService.id ? editingService : s)),
      );
      setEditingService(null);
      showSuccess("Success", "Service updated successfully");
    } catch (error: any) {
      showError("Error", error.message || "Failed to update service");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", serviceId);

      if (error) throw error;

      setServices(services.filter((s) => s.id !== serviceId));
      showSuccess("Success", "Service deleted successfully");
    } catch (error: any) {
      showError("Error", error.message || "Failed to delete service");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleServiceStatus = async (service: Service) => {
    try {
      const newStatus = !service.is_active;
      const { error } = await supabase
        .from("services")
        .update({ is_active: newStatus })
        .eq("id", service.id);

      if (error) throw error;

      setServices(
        services.map((s) =>
          s.id === service.id ? { ...s, is_active: newStatus } : s,
        ),
      );
      showSuccess(
        "Success",
        `Service ${newStatus ? "activated" : "deactivated"}`,
      );
    } catch (error: any) {
      showError("Error", error.message || "Failed to update service status");
    }
  };

  if (!isOpen) return null;

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showError("File Too Large", "Please upload an image smaller than 2MB");
        return;
      }

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
      if (category.iconUrl && category.iconUrl.includes("supabase")) {
        const oldPath = category.iconUrl.split("/").pop();
        if (oldPath) {
          await supabase.storage
            .from("public")
            .remove([`category-icons/${oldPath}`]);
        }
      }

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
      return formData.iconUrl;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const iconUrl = await uploadIcon();

      const { data, error } = await supabase
        .from("categories")
        .update({
          description: formData.description.trim() || null,
          icon_url: iconUrl,
          status: formData.status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", category.id)
        .select()
        .single();

      if (error) throw error;

      const updatedCategory: Category = {
        ...category,
        description: data.description || "",
        status: data.status as "Active" | "Inactive",
        iconUrl: data.icon_url,
        updatedAt: new Date(data.updated_at),
        servicesCount: services.length,
      };

      onSuccess(updatedCategory);
      showSuccess("Success", "Category updated successfully!");
      onClose();
    } catch (error: any) {
      console.error("Error updating category:", error);
      showError("Error", error.message || "Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    onClose();
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
          --modal-input-disabled: #f9fafb;
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
          --modal-input-disabled: #374151;
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
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
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
          background: rgba(251, 191, 36, 0.1);
          border: 1px solid rgba(251, 191, 36, 0.3);
          border-radius: 12px;
          padding: 14px 16px;
          margin-bottom: 24px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .dark-mode .info-banner {
          background: rgba(251, 191, 36, 0.15);
          border-color: rgba(251, 191, 36, 0.3);
        }

        .info-banner-icon {
          color: #f59e0b;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .dark-mode .info-banner-icon {
          color: #fbbf24;
        }

        .info-banner-text {
          font-size: 13px;
          color: #92400e;
          line-height: 1.6;
          font-weight: 500;
        }

        .dark-mode .info-banner-text {
          color: #fef3c7;
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
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .label-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          color: #6b7280;
          background: var(--modal-hover-bg);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .dark-mode .label-badge {
          color: #9ca3af;
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

        .form-input,
        .form-textarea,
        .form-select {
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

        .form-input:disabled {
          background: var(--modal-input-disabled);
          color: var(--modal-text-secondary);
          cursor: not-allowed;
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

        /* Services Section Styles */
        .services-section {
          margin-top: 28px;
          padding-top: 24px;
          border-top: 1px solid var(--modal-border);
        }

        .services-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .services-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 700;
          color: var(--modal-text);
        }

        .services-count {
          background: var(--modal-hover-bg);
          color: var(--modal-text-secondary);
          padding: 2px 10px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
        }

        .add-service-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: var(--modal-input-bg);
          border: 1.5px solid var(--modal-input-border);
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          color: var(--modal-text);
          font-size: 13px;
          transition: all 0.2s;
        }

        .add-service-btn:hover {
          background: var(--modal-hover-bg);
          border-color: var(--modal-input-focus);
          transform: translateY(-1px);
        }

        .services-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 300px;
          overflow-y: auto;
        }

        .service-item {
          padding: 12px;
          background: var(--modal-hover-bg);
          border: 1px solid var(--modal-border);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .service-item.inactive {
          opacity: 0.6;
        }

        .service-info {
          flex: 1;
          min-width: 0;
        }

        .service-name {
          font-weight: 600;
          color: var(--modal-text);
          font-size: 14px;
          margin-bottom: 2px;
        }

        .service-desc {
          font-size: 12px;
          color: var(--modal-text-secondary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .service-actions {
          display: flex;
          gap: 4px;
        }

        .icon-btn {
          background: none;
          border: none;
          padding: 6px;
          cursor: pointer;
          color: var(--modal-text-secondary);
          border-radius: 6px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
        }

        .icon-btn:hover {
          background: var(--modal-input-bg);
          color: var(--modal-text);
        }

        .icon-btn.delete:hover {
          color: #ef4444;
        }

        .service-form {
          padding: 16px;
          background: var(--modal-hover-bg);
          border: 1px solid var(--modal-border);
          border-radius: 10px;
          margin-bottom: 12px;
        }

        .service-form-row {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 12px;
        }

        .service-form-input {
          width: 100%;
          padding: 10px 12px;
          border: 1.5px solid var(--modal-input-border);
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          background: var(--modal-input-bg);
          color: var(--modal-text);
          font-family: inherit;
        }

        .service-form-input:focus {
          outline: none;
          border-color: var(--modal-input-focus);
        }

        .service-form-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .small-btn {
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .small-btn-cancel {
          background: var(--modal-input-bg);
          color: var(--modal-text);
          border: 1.5px solid var(--modal-input-border);
        }

        .small-btn-save {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .small-btn:hover {
          transform: translateY(-1px);
        }

        .small-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .empty-services {
          text-align: center;
          padding: 32px 20px;
          color: var(--modal-text-secondary);
          font-size: 14px;
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
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
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
            padding: 0;
          }

          .modal-container {
            border-radius: 20px 20px 0 0;
            max-height: 90vh;
            max-width: 100%;
            width: 100%;
            margin: 0;
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
            content: "";
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

          .services-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .add-service-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">Edit Category</h2>
            <button
              className="close-button"
              onClick={handleClose}
              type="button"
              disabled={loading}
            >
              <X size={20} />
            </button>
          </div>

          <div className="modal-body">
            <div className="info-banner">
              <AlertCircle size={20} className="info-banner-icon" />
              <p className="info-banner-text">
                Category name cannot be changed to maintain data consistency.
                You can update the description, icon, status, and manage
                services.
              </p>
            </div>

            <form onSubmit={handleSubmit} id="edit-category-form">
              {/* Category Name - Disabled */}
              <div className="form-group">
                <label className="form-label">
                  <Tag size={16} />
                  Category Name
                  <span className="label-badge">Not editable</span>
                </label>
                <div className="input-wrapper">
                  <Tag size={18} className="input-icon" />
                  <input
                    type="text"
                    className="form-input"
                    value={category.name}
                    disabled
                    readOnly
                  />
                </div>
              </div>

              {/* Description - Editable */}
              <div className="form-group">
                <label className="form-label">
                  <FileText size={16} />
                  Description
                </label>
                <div className="input-wrapper">
                  <FileText size={18} className="input-icon" />
                  <textarea
                    className="form-textarea"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Brief description of this category"
                    disabled={loading}
                  />
                </div>
                <div className="form-hint">
                  This will be replaced by service names once services are added
                </div>
              </div>

              {/* Category Icon - Editable */}
              <div className="form-group">
                <label className="form-label">
                  <FolderOpen size={16} />
                  Category Icon
                </label>
                <div className="icon-upload-section">
                  <div className="icon-preview-container">
                    <div className="icon-preview">
                      {iconPreview ? (
                        <img src={iconPreview} alt="Icon preview" />
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
                      id="icon-upload-edit"
                      disabled={loading}
                    />
                    <label
                      htmlFor="icon-upload-edit"
                      className="upload-btn-label"
                    >
                      <Upload size={16} />
                      Change Image
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
                          setIconPreview(e.target.value);
                          setIconFile(null);
                        }}
                        disabled={loading}
                      />
                    </div>
                    <div className="form-hint">Max 2MB • JPG, PNG, or WEBP</div>
                  </div>
                </div>
              </div>

              {/* Status - Editable */}
              <div className="form-group">
                <label className="form-label">
                  <FolderOpen size={16} />
                  Status
                </label>
                <div className="input-wrapper">
                  <FolderOpen size={18} className="input-icon" />
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as "Active" | "Inactive",
                      })
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

            {/* Services Section */}
            <div className="services-section">
              <div className="services-header">
                <div className="services-title">
                  <Settings size={16} />
                  Manage Services
                  <span className="services-count">{services.length}</span>
                </div>
                <button
                  className="add-service-btn"
                  onClick={() => setShowAddService(!showAddService)}
                  type="button"
                >
                  <Plus size={16} />
                  Add Service
                </button>
              </div>

              {/* Add Service Form */}
              {showAddService && (
                <div className="service-form">
                  <div className="service-form-row">
                    <input
                      type="text"
                      className="service-form-input"
                      placeholder="Service name *"
                      value={newService.name}
                      onChange={(e) =>
                        setNewService({ ...newService, name: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      className="service-form-input"
                      placeholder="Description (optional)"
                      value={newService.description}
                      onChange={(e) =>
                        setNewService({
                          ...newService,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="service-form-actions">
                    <button
                      className="small-btn small-btn-cancel"
                      onClick={() => {
                        setShowAddService(false);
                        setNewService({ name: "", description: "" });
                      }}
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      className="small-btn small-btn-save"
                      onClick={handleAddService}
                      type="button"
                      disabled={!newService.name.trim()}
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* Services List */}
              <div className="services-list">
                {loadingServices ? (
                  <div className="empty-services">Loading services...</div>
                ) : services.length === 0 ? (
                  <div className="empty-services">
                    No services yet. Click "Add Service" to create one.
                  </div>
                ) : (
                  services.map((service) => (
                    <div
                      key={service.id}
                      className={`service-item ${!service.is_active ? "inactive" : ""}`}
                    >
                      {editingService?.id === service.id ? (
                        <div
                          style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <input
                            type="text"
                            className="service-form-input"
                            value={editingService.name}
                            onChange={(e) =>
                              setEditingService({
                                ...editingService,
                                name: e.target.value,
                              })
                            }
                          />
                          <input
                            type="text"
                            className="service-form-input"
                            value={editingService.description}
                            onChange={(e) =>
                              setEditingService({
                                ...editingService,
                                description: e.target.value,
                              })
                            }
                          />
                          <div className="service-form-actions">
                            <button
                              className="small-btn small-btn-cancel"
                              onClick={() => setEditingService(null)}
                            >
                              Cancel
                            </button>
                            <button
                              className="small-btn small-btn-save"
                              onClick={handleUpdateService}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="service-info">
                            <div className="service-name">{service.name}</div>
                            {service.description && (
                              <div className="service-desc">
                                {service.description}
                              </div>
                            )}
                          </div>
                          <div className="service-actions">
                            <button
                              className="icon-btn"
                              onClick={() => handleToggleServiceStatus(service)}
                              title={
                                service.is_active ? "Deactivate" : "Activate"
                              }
                            >
                              {service.is_active ? "👁️" : "🚫"}
                            </button>
                            <button
                              className="icon-btn"
                              onClick={() => setEditingService(service)}
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              className="icon-btn delete"
                              onClick={() => handleDeleteService(service.id)}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              form="edit-category-form"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Category"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditCategoryModal;
