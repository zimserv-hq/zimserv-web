// src/pages/admin/AdminProviderDetails.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle,
  XCircle,
  Edit2,
  Briefcase,
  TrendingUp,
  Eye,
  MessageCircle,
  Award,
  Globe,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import StatCard from "../../components/Admin/StatCard";
import ConfirmationModal from "../../components/Admin/ConfirmationModal";
import { supabase } from "../../lib/supabaseClient";
import { useToast } from "../../contexts/ToastContext";

interface PendingEdit {
  id: string;
  auto_approved_fields: Record<string, any>;
  pending_review_fields: Record<string, any>;
  status: string;
  requested_at: string;
  auto_applied_at?: string;
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

const SkeletonLoader = () => (
  <>
    <style>{`
      @keyframes skShimmer {
        0%   { background-position: -700px 0; }
        100% { background-position:  700px 0; }
      }

      .sk {
        background: linear-gradient(
          90deg,
          var(--sk-base) 25%,
          var(--sk-hi)   50%,
          var(--sk-base) 75%
        );
        background-size: 700px 100%;
        animation: skShimmer 1.6s ease-in-out infinite;
        border-radius: 6px;
        flex-shrink: 0;
      }

      :root { --sk-base: #f0f0f0; --sk-hi: #e4e4e4; }
      .dark-mode { --sk-base: #374151; --sk-hi: #4b5563; }

      /* back btn */
      .sk-back { height: 44px; width: 160px; border-radius: 12px; margin-bottom: 24px; }

      /* header card */
      .sk-hdr {
        display: flex; justify-content: space-between; align-items: flex-start;
        gap: 24px; padding: 28px; background: var(--card-bg);
        border: 1.5px solid var(--border-color); border-radius: 16px;
        margin-bottom: 32px;
      }
      .sk-hdr-left { display: flex; gap: 24px; flex: 1; }
      .sk-avatar { width: 120px; height: 120px; border-radius: 16px; }
      .sk-hdr-info { display: flex; flex-direction: column; gap: 12px; padding-top: 4px; }
      .sk-hdr-meta { display: flex; gap: 14px; flex-wrap: wrap; }
      .sk-hdr-actions { display: flex; gap: 12px; }
      .sk-hdr-btn { height: 46px; width: 110px; border-radius: 12px; }

      /* stats */
      .sk-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin-bottom: 32px; }
      .sk-stat {
        padding: 24px; background: var(--card-bg);
        border: 1.5px solid var(--border-color); border-radius: 16px;
        display: flex; flex-direction: column; gap: 16px; min-height: 110px;
      }
      .sk-stat-top { display: flex; justify-content: space-between; align-items: center; }
      .sk-stat-icon { width: 40px; height: 40px; border-radius: 10px; }

      /* tabs shell */
      .sk-tabs {
        background: var(--card-bg); border: 1.5px solid var(--border-color);
        border-radius: 16px; overflow: hidden;
      }
      .sk-tabs-nav {
        display: flex; gap: 8px; padding: 0 16px;
        border-bottom: 1.5px solid var(--border-color); background: var(--tabs-bg);
        height: 54px; align-items: center;
      }
      .sk-tab { height: 22px; border-radius: 6px; }
      .sk-tabs-body { padding: 28px; }

      /* content grid inside tabs */
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

      {/* Header card */}
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

      {/* Stats */}
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

      {/* Tabs */}
      <div className="sk-tabs">
        <div className="sk-tabs-nav">
          {[90, 90, 100, 110].map((w, i) => (
            <div key={i} className="sk sk-tab" style={{ width: w }} />
          ))}
        </div>
        <div className="sk-tabs-body">
          <div className="sk-grid">
            {/* Left column */}
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
            {/* Right column */}
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

// ─── Rejection Reason Modal ───────────────────────────────────────────────────

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading: boolean;
}

const RejectReasonModal = ({
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
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 10000; padding: 20px;
          animation: rrFadeIn 0.2s ease;
        }
        @keyframes rrFadeIn { from { opacity: 0; } to { opacity: 1; } }

        .rr-modal {
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 16px;
          max-width: 480px; width: 100%;
          box-shadow: 0 24px 80px rgba(0,0,0,0.3);
          animation: rrSlideUp 0.3s cubic-bezier(0.4,0,0.2,1);
          overflow: hidden;
        }
        @keyframes rrSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .rr-header {
          padding: 24px 28px 20px;
          display: flex; align-items: flex-start; gap: 14px;
        }

        .rr-icon {
          width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
          background: var(--danger-bg); color: var(--danger-color);
          display: flex; align-items: center; justify-content: center;
        }

        .rr-title {
          font-size: 18px; font-weight: 700; color: var(--text-primary);
          margin-bottom: 4px; letter-spacing: -0.3px;
        }

        .rr-subtitle {
          font-size: 13px; color: var(--text-secondary);
          font-weight: 500; line-height: 1.5;
        }

        .rr-body { padding: 0 28px 20px; }

        .rr-label {
          display: block; font-size: 13px; font-weight: 700;
          color: var(--text-primary); margin-bottom: 10px; letter-spacing: -0.1px;
        }

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

        .rr-hint {
          font-size: 12px; color: var(--text-secondary);
          margin-top: 8px; font-weight: 500;
        }

        .rr-footer {
          padding: 16px 28px 24px;
          display: flex; gap: 12px; justify-content: flex-end;
          border-top: 1.5px solid var(--border-color);
        }

        .rr-btn {
          padding: 12px 24px; border-radius: 10px; font-size: 14px;
          font-weight: 700; cursor: pointer; transition: all 0.2s ease;
          border: none; letter-spacing: -0.1px;
          display: inline-flex; align-items: center; gap: 7px;
        }
        .rr-btn-cancel {
          background: var(--chip-bg); color: var(--text-primary);
          border: 1.5px solid var(--border-color);
        }
        .rr-btn-cancel:hover:not(:disabled) {
          background: var(--hover-bg); transform: translateY(-1px);
        }
        .rr-btn-confirm {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: #fff;
          box-shadow: 0 4px 12px rgba(239,68,68,0.3);
        }
        .rr-btn-confirm:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(239,68,68,0.4);
        }
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

// ─── Main Component ───────────────────────────────────────────────────────────

const AdminProviderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSuccess, showError } = useToast();

  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pendingEdits, setPendingEdits] = useState<PendingEdit[]>([]);
  const [showEditComparison, setShowEditComparison] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "analytics" | "photos" | "documents"
  >("overview");
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Rejection reason modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [pendingRejectId, setPendingRejectId] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchProviderDetails();
  }, [id]);

  async function fetchProviderDetails() {
    try {
      setLoading(true);

      const { data: providerData, error: providerError } = await supabase
        .from("providers")
        .select("*")
        .eq("id", id)
        .single();
      if (providerError) throw providerError;
      if (!providerData) {
        showError("Error", "Provider not found");
        navigate("/admin/providers");
        return;
      }

      const { data: editsData } = await supabase
        .from("provider_edit_requests")
        .select("*")
        .eq("provider_id", id)
        .in("status", ["pending", "partially_approved"])
        .order("requested_at", { ascending: false });
      setPendingEdits(editsData || []);

      const { data: servicesData } = await supabase
        .from("provider_services")
        .select("service_name")
        .eq("provider_id", id);
      const { data: areasData } = await supabase
        .from("provider_service_areas")
        .select("city, suburb")
        .eq("provider_id", id);
      const { data: photosData } = await supabase
        .from("provider_media")
        .select("file_path")
        .eq("provider_id", id)
        .eq("media_type", "portfolio");
      const { data: documentsData } = await supabase
        .from("provider_media")
        .select("*")
        .eq("provider_id", id)
        .in("media_type", ["certificate", "license", "id_document"]);

      setProvider({
        id: providerData.id,
        name: providerData.business_name || providerData.full_name,
        email: providerData.email || "Not provided",
        phone: providerData.phone_number,
        whatsapp: providerData.whatsapp_number || providerData.phone_number,
        website: providerData.website,
        category: providerData.primary_category,
        subcategories: servicesData?.map((s: any) => s.service_name) || [],
        city: providerData.city,
        areasServed:
          areasData?.map((a: any) =>
            a.suburb ? `${a.suburb}, ${a.city}` : a.city,
          ) || [],
        description: providerData.bio || "No description provided.",
        experience: providerData.years_experience
          ? `${providerData.years_experience} years`
          : "Not specified",
        languages: providerData.languages || ["English"],
        pricingModel: providerData.pricing_model || "Quote-based",
        rating: Number(providerData.avg_rating) || 0,
        reviewCount: providerData.total_reviews || 0,
        jobsCompleted: providerData.total_jobs_completed || 0,
        status: mapStatus(providerData.status),
        verified: providerData.status === "active",
        verificationLevel: providerData.verification_level || "Basic",
        joinedDate: new Date(providerData.created_at),
        lastActive: providerData.last_active_at
          ? new Date(providerData.last_active_at)
          : new Date(providerData.created_at),
        profileImage:
          providerData.profile_image_url ||
          getDefaultAvatar(
            providerData.business_name || providerData.full_name,
          ),
        photos:
          photosData?.map(
            (p: any) =>
              `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${p.file_path}`,
          ) || [],
        documents:
          documentsData?.map((d: any) => ({
            name: formatMediaType(d.media_type),
            status: d.is_verified ? "Verified" : "Pending",
            uploadedAt: new Date(d.uploaded_at),
          })) || [],
        analytics: {
          profileViews: providerData.profile_views || 0,
          clickToCall: providerData.click_to_call_count || 0,
          clickToWhatsApp: providerData.click_to_whatsapp_count || 0,
          clickToWebsite: providerData.click_to_website_count || 0,
        },
        subscription: {
          plan: "Free",
          status: "Active",
          startDate: new Date(providerData.created_at),
          endDate: new Date(
            new Date(providerData.created_at).setFullYear(
              new Date().getFullYear() + 1,
            ),
          ),
        },
        _rawData: providerData,
      });
    } catch (error: any) {
      showError("Error", error.message || "Failed to load provider details");
    } finally {
      setLoading(false);
    }
  }

  async function handleApproveEdits(editRequestId: string) {
    if (!provider) return;
    setIsProcessing(true);
    try {
      const editRequest = pendingEdits.find((e) => e.id === editRequestId);
      if (!editRequest) return;
      const { error: updateError } = await supabase
        .from("providers")
        .update({
          ...editRequest.pending_review_fields,
          updated_at: new Date().toISOString(),
        })
        .eq("id", provider.id);
      if (updateError) throw updateError;
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { error: approveError } = await supabase
        .from("provider_edit_requests")
        .update({
          status: "approved",
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id,
        })
        .eq("id", editRequestId);
      if (approveError) throw approveError;
      showSuccess("Success", "Sensitive changes approved successfully");
      fetchProviderDetails();
    } catch (error: any) {
      showError("Error", error.message || "Failed to approve changes");
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleRejectEdits(editRequestId: string, reason: string) {
    setIsProcessing(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("provider_edit_requests")
        .update({
          status: "rejected",
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id,
          rejection_reason: reason,
        })
        .eq("id", editRequestId);
      if (error) throw error;
      showSuccess(
        "Success",
        "Sensitive changes rejected — safe changes were already applied",
      );
      fetchProviderDetails();
    } catch (error: any) {
      showError("Error", error.message || "Failed to reject changes");
    } finally {
      setIsProcessing(false);
    }
  }

  // Opens the modal instead of prompt()
  const openRejectModal = (editRequestId: string) => {
    setPendingRejectId(editRequestId);
    setShowRejectModal(true);
  };

  const confirmReject = async (reason: string) => {
    if (!pendingRejectId) return;
    await handleRejectEdits(pendingRejectId, reason);
    setShowRejectModal(false);
    setShowEditComparison(false);
    setPendingRejectId(null);
  };

  function mapStatus(dbStatus: string): string {
    const map: Record<string, string> = {
      active: "Active",
      pending_review: "Pending",
      needs_changes: "Pending",
      suspended: "Suspended",
      banned: "Banned",
    };
    return map[dbStatus] || "Unknown";
  }
  function formatMediaType(mediaType: string): string {
    const map: Record<string, string> = {
      certificate: "Certificate",
      license: "Business License",
      id_document: "ID Document",
      insurance: "Insurance Certificate",
    };
    return map[mediaType] || mediaType.replace("_", " ").toUpperCase();
  }
  function getDefaultAvatar(name: string): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=FF6B35&color=fff&bold=true`;
  }
  function getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      bio: "Description",
      years_experience: "Years of Experience",
      website: "Website",
      languages: "Languages",
      pricing_model: "Pricing Model",
      business_name: "Business Name",
      phone_number: "Phone Number",
      whatsapp_number: "WhatsApp Number",
      email: "Email",
      city: "City",
      call_available: "Call Availability",
      whatsapp_available: "WhatsApp Availability",
      profile_image_url: "Profile Image",
    };
    return labels[fieldName] || fieldName;
  }
  function formatValue(value: any): string {
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (value === null || value === undefined) return "Not provided";
    return String(value);
  }

  const handleSuspend = async () => {
    if (!provider) return;
    setIsProcessing(true);
    try {
      const newStatus =
        provider._rawData.status === "active" ? "suspended" : "active";
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("providers")
        .update({
          status: newStatus,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id,
        })
        .eq("id", provider.id);
      if (error) throw error;
      setProvider({
        ...provider,
        status: mapStatus(newStatus),
        verified: newStatus === "active",
        _rawData: { ...provider._rawData, status: newStatus },
      });
      showSuccess(
        "Success",
        `Provider ${newStatus === "active" ? "activated" : "suspended"} successfully`,
      );
      setShowSuspendModal(false);
    } catch (error: any) {
      showError("Error", error.message || "Failed to update provider status");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPendingEditsBanner = () => {
    if (pendingEdits.length === 0) return null;
    const hasSensitiveChanges = pendingEdits.some(
      (e) => Object.keys(e.pending_review_fields || {}).length > 0,
    );
    return (
      <div className="pending-edits-banner">
        <div className="pending-icon">
          <AlertCircle size={24} strokeWidth={2.5} />
        </div>
        <div className="pending-content">
          <div className="pending-title">
            {pendingEdits.length} Pending Edit
            {pendingEdits.length > 1 ? "s" : ""}
          </div>
          <div className="pending-description">
            {hasSensitiveChanges
              ? "This provider has sensitive changes requiring your review. Safe changes were auto-applied."
              : "All changes have been auto-approved."}
          </div>
        </div>
        <div className="pending-actions">
          <button
            className="review-btn"
            onClick={() => setShowEditComparison(true)}
          >
            Review Changes
          </button>
        </div>
      </div>
    );
  };

  const renderEditComparisonModal = () => {
    if (!showEditComparison || pendingEdits.length === 0) return null;
    const editRequest = pendingEdits[0];
    const hasAutoApproved =
      Object.keys(editRequest.auto_approved_fields || {}).length > 0;
    const hasPendingReview =
      Object.keys(editRequest.pending_review_fields || {}).length > 0;

    return (
      <div
        className="edit-modal-overlay"
        onClick={() => setShowEditComparison(false)}
      >
        <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
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
          </div>

          <div className="edit-modal-body">
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
                        <div
                          className="edit-value-box"
                          style={{
                            background: "rgba(220,252,231,0.3)",
                            textDecoration: "line-through",
                          }}
                        >
                          {formatValue(
                            provider?._rawData[field] ||
                              editRequest.auto_approved_fields[field],
                          )}
                        </div>
                        <div className="edit-arrow">→</div>
                        <div className="edit-value-box edit-value-new">
                          {formatValue(newValue)}
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </>
            )}

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
                          {formatValue(newValue)}
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </>
            )}
          </div>

          <div className="edit-modal-footer">
            <button
              className="modal-btn cancel"
              onClick={() => setShowEditComparison(false)}
              disabled={isProcessing}
            >
              Close
            </button>
            {hasPendingReview && (
              <>
                {/* ← Opens RejectReasonModal instead of prompt() */}
                <button
                  className="modal-btn reject"
                  onClick={() => openRejectModal(editRequest.id)}
                  disabled={isProcessing}
                >
                  <XCircle
                    size={16}
                    strokeWidth={2.5}
                    style={{ display: "inline" }}
                  />
                  Reject Sensitive Changes
                </button>
                <button
                  className="modal-btn approve"
                  onClick={() => {
                    handleApproveEdits(editRequest.id);
                    setShowEditComparison(false);
                  }}
                  disabled={isProcessing}
                >
                  <CheckCircle2
                    size={16}
                    strokeWidth={2.5}
                    style={{ display: "inline" }}
                  />
                  Approve Sensitive Changes
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) return <SkeletonLoader />;

  if (!provider) {
    return (
      <div
        className="provider-details"
        style={{ textAlign: "center", padding: "60px 20px" }}
      >
        <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
          Provider not found
        </p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .provider-details {
          padding: 28px; max-width: 1600px; margin: 0 auto;
          background: var(--bg-primary); min-height: 100vh;
        }

        .back-button {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 20px; border-radius: 12px;
          border: 1.5px solid var(--border-color); background: var(--card-bg);
          color: var(--text-primary); font-size: 14px; font-weight: 600;
          cursor: pointer; transition: all 0.3s cubic-bezier(0.4,0,0.2,1); margin-bottom: 24px;
        }
        .back-button:hover { background: var(--hover-bg); border-color: var(--border-hover); transform: translateX(-4px); }

        .pending-edits-banner {
          background: linear-gradient(135deg, #FFF4ED 0%, #FFE8D9 100%);
          border: 2px solid var(--orange-primary); border-radius: 16px;
          padding: 20px 24px; margin-bottom: 24px;
          display: flex; align-items: center; gap: 16px;
          box-shadow: 0 4px 12px rgba(255,107,53,0.15);
        }
        .dark-mode .pending-edits-banner { background: rgba(255,107,53,0.15); }
        .pending-icon { width: 48px; height: 48px; border-radius: 12px; background: var(--orange-primary); color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .pending-content { flex: 1; }
        .pending-title { font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
        .pending-description { font-size: 14px; color: var(--text-secondary); }
        .pending-actions { display: flex; gap: 12px; }
        .review-btn { padding: 10px 20px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; border: none; background: var(--orange-primary); color: white; }
        .review-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(255,107,53,0.3); }

        .edit-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px; }
        .edit-modal { background: var(--card-bg); border-radius: 16px; max-width: 800px; width: 100%; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        .edit-modal-header { padding: 24px; border-bottom: 1.5px solid var(--border-color); }
        .edit-modal-title { font-size: 20px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; }
        .edit-modal-subtitle { font-size: 14px; color: var(--text-secondary); }
        .edit-modal-body { padding: 24px; }
        .edit-comparison { margin-bottom: 20px; padding: 16px; background: var(--chip-bg); border-radius: 12px; border: 2px solid transparent; transition: all 0.2s ease; }
        .edit-comparison:hover { border-color: var(--orange-primary); background: var(--hover-bg); }
        .edit-field-label { font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
        .edit-values { display: grid; grid-template-columns: 1fr auto 1fr; gap: 16px; align-items: center; }
        .edit-value-box { padding: 12px; border-radius: 8px; font-size: 14px; }
        .edit-value-old { background: rgba(239,68,68,0.1); color: var(--text-secondary); text-decoration: line-through; }
        .edit-value-new { background: rgba(16,185,129,0.1); color: var(--text-primary); font-weight: 600; }
        .edit-arrow { color: var(--orange-primary); font-size: 20px; font-weight: 700; }
        .edit-modal-footer { padding: 20px 24px; border-top: 1.5px solid var(--border-color); display: flex; gap: 12px; justify-content: flex-end; }
        .modal-btn { padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s ease; border: none; display: inline-flex; align-items: center; gap: 6px; }
        .modal-btn.cancel { background: var(--chip-bg); color: var(--text-primary); }
        .modal-btn.reject { background: var(--danger-color); color: white; }
        .modal-btn.approve { background: var(--success-color); color: white; }
        .modal-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .modal-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }

        .details-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; margin-bottom: 32px; padding: 28px; background: var(--card-bg); border: 1.5px solid var(--border-color); border-radius: 16px; box-shadow: 0 2px 8px var(--card-shadow); }
        .header-left { display: flex; gap: 24px; align-items: flex-start; flex: 1; }
        .provider-avatar { width: 120px; height: 120px; border-radius: 16px; object-fit: cover; border: 2px solid var(--border-color); box-shadow: 0 4px 16px var(--card-shadow); }
        .provider-info h1 { font-size: 32px; font-weight: 800; color: var(--text-primary); margin-bottom: 12px; display: flex; align-items: center; gap: 12px; letter-spacing: -0.8px; }
        .verified-badge { color: var(--verified-color); }
        .provider-meta { display: flex; gap: 20px; margin-bottom: 16px; flex-wrap: wrap; }
        .meta-item { display: flex; align-items: center; gap: 8px; font-size: 15px; color: var(--text-secondary); font-weight: 500; }
        .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; }
        .status-badge.active { background: var(--success-bg); color: var(--success-color); }
        .header-actions { display: flex; gap: 12px; }
        .action-btn-large { display: inline-flex; align-items: center; gap: 10px; padding: 13px 24px; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.3s cubic-bezier(0.4,0,0.2,1); border: 1.5px solid; background: transparent; }
        .action-btn-large.edit { border-color: var(--orange-primary); color: var(--orange-primary); }
        .action-btn-large.edit:hover { background: var(--orange-light-bg); transform: translateY(-2px); box-shadow: 0 4px 12px var(--orange-shadow); }
        .action-btn-large.suspend { border-color: var(--danger-color); color: var(--danger-color); }
        .action-btn-large.suspend:hover { background: var(--danger-bg); transform: translateY(-2px); box-shadow: 0 4px 12px var(--danger-shadow); }

        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin-bottom: 32px; }

        .tabs-container { background: var(--card-bg); border: 1.5px solid var(--border-color); border-radius: 16px; overflow: hidden; margin-bottom: 24px; box-shadow: 0 2px 8px var(--card-shadow); }
        .tabs-header { display: flex; border-bottom: 1.5px solid var(--border-color); background: var(--tabs-bg); padding: 0 8px; }
        .tab-button { padding: 16px 24px; border: none; background: transparent; color: var(--text-secondary); font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; position: relative; border-bottom: 2px solid transparent; display: inline-flex; align-items: center; gap: 7px; }
        .tab-button:hover { color: var(--text-primary); background: var(--hover-bg); }
        .tab-button.active { color: var(--orange-primary); border-bottom-color: var(--orange-primary); }
        .tab-content { padding: 28px; }
        .content-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
        .card { background: var(--card-bg); border: 1.5px solid var(--border-color); border-radius: 14px; padding: 24px; box-shadow: 0 2px 8px var(--card-shadow); transition: all 0.3s ease; }
        .card:hover { border-color: var(--border-hover); box-shadow: 0 4px 16px var(--card-shadow); }
        .card-title { font-size: 18px; font-weight: 700; color: var(--text-primary); margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .info-row { display: flex; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--border-color); }
        .info-row:last-child { border-bottom: none; }
        .info-label { font-size: 14px; color: var(--text-secondary); font-weight: 500; }
        .info-value { font-size: 14px; color: var(--text-primary); font-weight: 600; }
        .contact-item { display: flex; align-items: center; gap: 12px; padding: 14px; background: var(--chip-bg); border-radius: 12px; margin-bottom: 12px; transition: all 0.2s ease; }
        .contact-item:hover { background: var(--hover-bg); transform: translateX(4px); }
        .contact-icon { width: 40px; height: 40px; border-radius: 10px; background: var(--orange-light-bg); color: var(--orange-primary); display: flex; align-items: center; justify-content: center; }
        .contact-info { flex: 1; }
        .contact-label { font-size: 12px; color: var(--text-secondary); margin-bottom: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .contact-value { font-size: 14px; color: var(--text-primary); font-weight: 600; }
        .photos-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .photo-item { aspect-ratio: 1; border-radius: 12px; overflow: hidden; border: 1.5px solid var(--border-color); cursor: pointer; transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
        .photo-item:hover { border-color: var(--orange-primary); transform: scale(1.05); box-shadow: 0 8px 24px var(--card-shadow); }
        .photo-item img { width: 100%; height: 100%; object-fit: cover; }
        .document-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; background: var(--chip-bg); border-radius: 12px; margin-bottom: 12px; transition: all 0.2s ease; }
        .document-item:hover { background: var(--hover-bg); }
        .document-left { display: flex; align-items: center; gap: 12px; }
        .document-icon { width: 40px; height: 40px; border-radius: 10px; background: var(--orange-light-bg); color: var(--orange-primary); display: flex; align-items: center; justify-content: center; }
        .document-info h4 { font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; }
        .document-date { font-size: 12px; color: var(--text-secondary); }
        .document-status { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--success-color); font-weight: 700; padding: 6px 12px; background: var(--success-bg); border-radius: 8px; }
        .tags { display: flex; flex-wrap: wrap; gap: 10px; }
        .tag { padding: 8px 14px; background: var(--chip-bg); color: var(--text-primary); font-size: 13px; font-weight: 600; border-radius: 8px; transition: all 0.2s ease; }
        .tag:hover { background: var(--orange-light-bg); color: var(--orange-primary); transform: translateY(-2px); }
        .description-text { color: var(--text-secondary); line-height: 1.8; font-size: 15px; }
        .empty-state { text-align: center; padding: 40px 20px; color: var(--text-secondary); }

        :root {
          --bg-primary: #f8f9fa; --text-primary: #111827; --text-secondary: #6b7280;
          --card-bg: #ffffff; --border-color: #e5e7eb; --border-hover: #d1d5db;
          --hover-bg: #f3f4f6; --chip-bg: #f9fafb; --tabs-bg: #fafbfc;
          --card-shadow: rgba(0,0,0,0.05); --orange-primary: #FF6B35;
          --orange-light-bg: #FFF4ED; --orange-shadow: rgba(255,107,53,0.2);
          --verified-color: #2563EB; --success-bg: #DCFCE7; --success-color: #15803D;
          --danger-color: #ef4444; --danger-bg: #FEE2E2; --danger-shadow: rgba(239,68,68,0.2);
        }
        .dark-mode {
          --bg-primary: #111827; --text-primary: #f9fafb; --text-secondary: #d1d5db;
          --card-bg: #1f2937; --border-color: #374151; --border-hover: #4b5563;
          --hover-bg: #374151; --chip-bg: #374151; --tabs-bg: #1f2937;
          --card-shadow: rgba(0,0,0,0.3); --orange-primary: #FF8A5B;
          --orange-light-bg: rgba(255,107,53,0.15); --orange-shadow: rgba(255,138,91,0.3);
          --verified-color: #60A5FA; --success-bg: rgba(21,128,61,0.2); --success-color: #4ADE80;
          --danger-color: #F87171; --danger-bg: rgba(239,68,68,0.15); --danger-shadow: rgba(248,113,113,0.3);
        }

        @media (max-width: 1024px) {
          .content-grid { grid-template-columns: 1fr; }
          .edit-values { grid-template-columns: 1fr; gap: 8px; }
          .edit-arrow { transform: rotate(90deg); }
        }
        @media (max-width: 768px) {
          .provider-details { padding: 20px 16px; }
          .details-header { flex-direction: column; padding: 20px; }
          .header-left { flex-direction: column; align-items: center; text-align: center; }
          .provider-info h1 { font-size: 24px; justify-content: center; }
          .provider-meta { justify-content: center; }
          .header-actions { width: 100%; flex-direction: column; }
          .action-btn-large { width: 100%; justify-content: center; }
          .stats-grid { grid-template-columns: 1fr; gap: 12px; }
          .tabs-header { overflow-x: auto; }
          .tab-button { white-space: nowrap; }
          .tab-content { padding: 20px; }
          .photos-grid { grid-template-columns: 1fr; }
          .pending-edits-banner { flex-direction: column; text-align: center; }
          .pending-actions { width: 100%; }
          .review-btn { width: 100%; }
          .edit-modal-footer { flex-direction: column; }
          .modal-btn { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="provider-details">
        <button
          className="back-button"
          onClick={() => navigate("/admin/providers")}
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
          Back to Providers
        </button>

        {renderPendingEditsBanner()}

        <div className="details-header">
          <div className="header-left">
            <img
              src={provider.profileImage}
              alt={provider.name}
              className="provider-avatar"
            />
            <div className="provider-info">
              <h1>
                {provider.name}
                {provider.verified && (
                  <CheckCircle
                    size={28}
                    className="verified-badge"
                    strokeWidth={2.5}
                  />
                )}
              </h1>
              <div className="provider-meta">
                <div className="meta-item">
                  <Briefcase size={16} strokeWidth={2} />
                  {provider.category}
                </div>
                <div className="meta-item">
                  <MapPin size={16} strokeWidth={2} />
                  {provider.city}
                </div>
                <div className="meta-item">
                  <Star
                    size={16}
                    fill="#F59E0B"
                    stroke="#F59E0B"
                    strokeWidth={0}
                  />
                  {provider.rating.toFixed(1)} ({provider.reviewCount} reviews)
                </div>
              </div>
              <span className="status-badge active">{provider.status}</span>
            </div>
          </div>
          <div className="header-actions">
            <button className="action-btn-large edit">
              <Edit2 size={18} strokeWidth={2.5} />
              Edit
            </button>
            <button
              className="action-btn-large suspend"
              onClick={() => setShowSuspendModal(true)}
            >
              <XCircle size={18} strokeWidth={2.5} />
              {provider.status === "Active" ? "Suspend" : "Activate"}
            </button>
          </div>
        </div>

        <div className="stats-grid">
          <StatCard
            label="Profile Views"
            value={provider.analytics.profileViews}
            icon={Eye}
            iconColor="blue"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            label="Click-to-Call"
            value={provider.analytics.clickToCall}
            icon={Phone}
            iconColor="green"
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            label="WhatsApp Clicks"
            value={provider.analytics.clickToWhatsApp}
            icon={MessageCircle}
            iconColor="purple"
            trend={{ value: 15, isPositive: true }}
          />
          <StatCard
            label="Jobs Completed"
            value={provider.jobsCompleted}
            icon={CheckCircle}
            iconColor="orange"
          />
        </div>

        <div className="tabs-container">
          <div className="tabs-header">
            {(["overview", "analytics", "photos", "documents"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  className={`tab-button ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "overview" && (
                    <>
                      <Briefcase size={16} strokeWidth={2} />
                      Overview
                    </>
                  )}
                  {tab === "analytics" && (
                    <>
                      <TrendingUp size={16} strokeWidth={2} />
                      Analytics
                    </>
                  )}
                  {tab === "photos" && (
                    <>
                      <ImageIcon size={16} strokeWidth={2} />
                      Photos ({provider.photos.length})
                    </>
                  )}
                  {tab === "documents" && (
                    <>
                      <FileText size={16} strokeWidth={2} />
                      Documents ({provider.documents.length})
                    </>
                  )}
                </button>
              ),
            )}
          </div>

          <div className="tab-content">
            {activeTab === "overview" && (
              <div className="content-grid">
                <div>
                  <div className="card" style={{ marginBottom: "24px" }}>
                    <h2 className="card-title">
                      <Briefcase size={20} strokeWidth={2.5} />
                      About
                    </h2>
                    <p className="description-text">{provider.description}</p>
                    <div style={{ marginTop: "24px" }}>
                      <div className="info-row">
                        <span className="info-label">Experience</span>
                        <span className="info-value">
                          {provider.experience}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Pricing Model</span>
                        <span className="info-value">
                          {provider.pricingModel}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Languages</span>
                        <span className="info-value">
                          {provider.languages.join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <h2 className="card-title">
                      <MapPin size={20} strokeWidth={2.5} />
                      Services & Coverage
                    </h2>
                    <div style={{ marginBottom: "20px" }}>
                      <div
                        className="info-label"
                        style={{ marginBottom: "12px" }}
                      >
                        Subcategories
                      </div>
                      {provider.subcategories.length > 0 ? (
                        <div className="tags">
                          {provider.subcategories.map((s: string) => (
                            <span key={s} className="tag">
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="description-text">No services listed</p>
                      )}
                    </div>
                    <div>
                      <div
                        className="info-label"
                        style={{ marginBottom: "12px" }}
                      >
                        Areas Served
                      </div>
                      {provider.areasServed.length > 0 ? (
                        <div className="tags">
                          {provider.areasServed.map((a: string) => (
                            <span key={a} className="tag">
                              {a}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="description-text">No areas listed</p>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="card" style={{ marginBottom: "24px" }}>
                    <h2 className="card-title">
                      <Phone size={20} strokeWidth={2.5} />
                      Contact Information
                    </h2>
                    <div className="contact-item">
                      <div className="contact-icon">
                        <Phone size={18} strokeWidth={2.5} />
                      </div>
                      <div className="contact-info">
                        <div className="contact-label">Phone</div>
                        <div className="contact-value">{provider.phone}</div>
                      </div>
                    </div>
                    <div className="contact-item">
                      <div className="contact-icon">
                        <Mail size={18} strokeWidth={2.5} />
                      </div>
                      <div className="contact-info">
                        <div className="contact-label">Email</div>
                        <div className="contact-value">{provider.email}</div>
                      </div>
                    </div>
                    {provider.website && (
                      <div className="contact-item">
                        <div className="contact-icon">
                          <Globe size={18} strokeWidth={2.5} />
                        </div>
                        <div className="contact-info">
                          <div className="contact-label">Website</div>
                          <div className="contact-value">
                            {provider.website}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="card">
                    <h2 className="card-title">
                      <Award size={20} strokeWidth={2.5} />
                      Subscription
                    </h2>
                    <div className="info-row">
                      <span className="info-label">Plan</span>
                      <span className="info-value">
                        {provider.subscription.plan}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Status</span>
                      <span className="info-value">
                        {provider.subscription.status}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Start Date</span>
                      <span className="info-value">
                        {provider.subscription.startDate.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">End Date</span>
                      <span className="info-value">
                        {provider.subscription.endDate.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="card">
                <h2 className="card-title">
                  <TrendingUp size={20} strokeWidth={2.5} />
                  Performance Metrics
                </h2>
                <div className="info-row">
                  <span className="info-label">Total Profile Views</span>
                  <span className="info-value">
                    {provider.analytics.profileViews}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Click-to-Call</span>
                  <span className="info-value">
                    {provider.analytics.clickToCall}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Click-to-WhatsApp</span>
                  <span className="info-value">
                    {provider.analytics.clickToWhatsApp}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Website Clicks</span>
                  <span className="info-value">
                    {provider.analytics.clickToWebsite}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Total Jobs Completed</span>
                  <span className="info-value">{provider.jobsCompleted}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Average Rating</span>
                  <span className="info-value">
                    {provider.rating.toFixed(1)} / 5.0
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Total Reviews</span>
                  <span className="info-value">{provider.reviewCount}</span>
                </div>
              </div>
            )}

            {activeTab === "photos" && (
              <div className="card">
                <h2 className="card-title">
                  <ImageIcon size={20} strokeWidth={2.5} />
                  Work Photos ({provider.photos.length})
                </h2>
                {provider.photos.length > 0 ? (
                  <div className="photos-grid">
                    {provider.photos.map((photo: string, i: number) => (
                      <div key={i} className="photo-item">
                        <img src={photo} alt={`Work ${i + 1}`} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <ImageIcon size={48} style={{ margin: "0 auto 16px" }} />
                    <p>No portfolio photos uploaded yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "documents" && (
              <div className="card">
                <h2 className="card-title">
                  <FileText size={20} strokeWidth={2.5} />
                  Verification Documents ({provider.documents.length})
                </h2>
                {provider.documents.length > 0 ? (
                  provider.documents.map((doc: any, i: number) => (
                    <div key={i} className="document-item">
                      <div className="document-left">
                        <div className="document-icon">
                          <FileText size={18} strokeWidth={2.5} />
                        </div>
                        <div className="document-info">
                          <h4>{doc.name}</h4>
                          <div className="document-date">
                            Uploaded {doc.uploadedAt.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <span className="document-status">
                        <CheckCircle size={14} strokeWidth={2.5} />
                        {doc.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <FileText size={48} style={{ margin: "0 auto 16px" }} />
                    <p>No documents uploaded yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {renderEditComparisonModal()}

        {/* Rejection reason modal — replaces browser prompt() */}
        <RejectReasonModal
          isOpen={showRejectModal}
          onClose={() => {
            setShowRejectModal(false);
            setPendingRejectId(null);
          }}
          onConfirm={confirmReject}
          isLoading={isProcessing}
        />

        <ConfirmationModal
          isOpen={showSuspendModal}
          onClose={() => setShowSuspendModal(false)}
          onConfirm={handleSuspend}
          title={
            provider.status === "Active"
              ? "Suspend Provider"
              : "Activate Provider"
          }
          message={`Are you sure you want to ${provider.status === "Active" ? "suspend" : "activate"} "${provider.name}"?`}
          confirmLabel={provider.status === "Active" ? "Suspend" : "Activate"}
          confirmStyle={provider.status === "Active" ? "danger" : "success"}
          icon={provider.status === "Active" ? XCircle : CheckCircle}
          isLoading={isProcessing}
        />
      </div>
    </>
  );
};

export default AdminProviderDetails;
