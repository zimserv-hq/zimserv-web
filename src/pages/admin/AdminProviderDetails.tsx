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
} from "lucide-react";
import StatCard from "../../components/Admin/StatCard";
import ConfirmationModal from "../../components/Admin/ConfirmationModal";
import { supabase } from "../../lib/supabaseClient";
import { useToast } from "../../contexts/ToastContext";
import {
  SkeletonLoader,
  RejectReasonModal,
  EditComparisonModal,
} from "../../components/Admin/Modals/ProviderDetailsModals";
import {
  mapStatus,
  formatMediaType,
  getDefaultAvatar,
  getFieldLabel,
  formatValue,
  PROVIDER_DETAILS_CSS,
} from "../../components/Admin/Modals/ProviderDetailsHelpers";

interface PendingEdit {
  id: string;
  auto_approved_fields: Record<string, any>;
  pending_review_fields: Record<string, any>;
  status: string;
  requested_at: string;
  auto_applied_at?: string;
}

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
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [pendingRejectId, setPendingRejectId] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchProviderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ─── Data Fetching ──────────────────────────────────────────────────────────

  async function fetchProviderDetails() {
    try {
      setLoading(true);

      // 1) Base provider row
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

      // 2) Profile image URL
      const profileImageUrl: string | undefined =
        providerData.profile_image_url || undefined;

      // 3) Pending edits — single fetch, single setState
      const { data: editsData } = await supabase
        .from("provider_edit_requests")
        .select("*")
        .eq("provider_id", id)
        .in("status", ["pending", "partially_approved"])
        .order("requested_at", { ascending: false });
      setPendingEdits(editsData || []);

      // 4) Parallel fetch
      const [
        { data: servicesData },
        { data: areasData },
        { data: photosData },
        { data: documentsData },
      ] = await Promise.all([
        supabase
          .from("provider_services")
          .select("service_name")
          .eq("provider_id", id),
        supabase
          .from("provider_service_areas")
          .select("city, suburb")
          .eq("provider_id", id),
        supabase
          .from("provider_media")
          .select("file_path")
          .eq("provider_id", id)
          .eq("media_type", "portfolio"),
        supabase
          .from("provider_media")
          .select("*")
          .eq("provider_id", id)
          .in("media_type", ["certificate", "license", "id_document"]),
      ]);

      // 5) Build provider view-model
      const name = providerData.business_name || providerData.full_name;

      setProvider({
        id: providerData.id,
        name,
        email: providerData.email ?? "Not provided",
        phone: providerData.phone_number,
        whatsapp: providerData.whatsapp_number || providerData.phone_number,
        website: providerData.website,
        category: providerData.primary_category,
        subcategories:
          servicesData?.map((s: any) => s.service_name as string) ?? [],
        city: providerData.city,
        areasServed:
          areasData?.map((a: any) => (a.suburb ? a.suburb : a.city)) ?? [],
        description: providerData.bio ?? "No description provided.",
        experience: providerData.years_experience
          ? `${providerData.years_experience} years`
          : "Not specified",
        languages: providerData.languages ?? ["English"],
        pricingModel: providerData.pricing_model ?? "Quote-based",
        rating: Number(providerData.avg_rating ?? 0),
        reviewCount: providerData.total_reviews ?? 0,
        jobsCompleted: providerData.total_jobs_completed ?? 0,
        status: mapStatus(providerData.status),
        verified: providerData.status === "active",
        verificationLevel: providerData.verification_level ?? "Basic",
        joinedDate: new Date(providerData.created_at),
        lastActive: providerData.last_active_at
          ? new Date(providerData.last_active_at)
          : new Date(providerData.created_at),
        profileImage: profileImageUrl || getDefaultAvatar(name),
        photos:
          photosData?.map(
            (p: any) =>
              `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/provider-media/${p.file_path}`,
          ) ?? [],
        documents:
          documentsData?.map((d: any) => ({
            name: formatMediaType(d.media_type),
            status: d.is_verified ? "Verified" : "Pending",
            uploadedAt: new Date(d.uploaded_at),
          })) ?? [],
        analytics: {
          profileViews: providerData.profile_views ?? 0,
          clickToCall: providerData.click_to_call_count ?? 0,
          clickToWhatsApp: providerData.click_to_whatsapp_count ?? 0,
          clickToWebsite: providerData.click_to_website_count ?? 0,
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
      // ← function ends here, nothing after this brace
    }
  }

  // ─── Actions ────────────────────────────────────────────────────────────────

  async function handleApproveEdits(editRequestId: string) {
    if (!provider) return;
    setIsProcessing(true);
    try {
      const editRequest = pendingEdits.find((e) => e.id === editRequestId);
      if (!editRequest) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Apply sensitive fields to provider
      const { error: updateError } = await supabase
        .from("providers")
        .update({
          ...editRequest.pending_review_fields,
          updated_at: new Date().toISOString(),
          reviewed_by: user?.id, // ✅ added
        })
        .eq("id", provider.id);
      if (updateError) throw updateError;

      // Only mark approved after provider update succeeds
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
        `Provider ${
          newStatus === "active" ? "activated" : "suspended"
        } successfully`,
      );
      setShowSuspendModal(false);
    } catch (error: any) {
      showError("Error", error.message || "Failed to update provider status");
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── Sub-renders ────────────────────────────────────────────────────────────

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

  const renderTabContent = () => {
    if (activeTab === "overview")
      return (
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
                  <span className="info-value">{provider.experience}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Pricing Model</span>
                  <span className="info-value">{provider.pricingModel}</span>
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
                <div className="info-label" style={{ marginBottom: "12px" }}>
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
                <div className="info-label" style={{ marginBottom: "12px" }}>
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
                    <div className="contact-value">{provider.website}</div>
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
                <span className="info-value">{provider.subscription.plan}</span>
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
                  {provider.subscription.startDate.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">End Date</span>
                <span className="info-value">
                  {provider.subscription.startDate.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      );

    if (activeTab === "analytics")
      return (
        <div className="card">
          <h2 className="card-title">
            <TrendingUp size={20} strokeWidth={2.5} />
            Performance Metrics
          </h2>
          {[
            ["Total Profile Views", provider.analytics.profileViews],
            ["Click-to-Call", provider.analytics.clickToCall],
            ["Click-to-WhatsApp", provider.analytics.clickToWhatsApp],
            ["Website Clicks", provider.analytics.clickToWebsite],
            ["Total Jobs Completed", provider.jobsCompleted],
            ["Average Rating", `${provider.rating.toFixed(1)} / 5.0`],
            ["Total Reviews", provider.reviewCount],
          ].map(([label, value]) => (
            <div key={label as string} className="info-row">
              <span className="info-label">{label}</span>
              <span className="info-value">{value}</span>
            </div>
          ))}
        </div>
      );

    if (activeTab === "photos")
      return (
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
      );

    if (activeTab === "documents")
      return (
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
      );
  };

  // ─── Early returns ──────────────────────────────────────────────────────────

  if (loading) return <SkeletonLoader />;
  if (!provider)
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

  // ─── Main Render ────────────────────────────────────────────────────────────

  return (
    <>
      <style>{PROVIDER_DETAILS_CSS}</style>

      <div
        className="provider-details"
        style={{
          maxWidth: "100%",
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >
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
            <div className="provider-info" style={{ flex: 1, minWidth: 0 }}>
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
              <span
                className={`status-badge ${
                  provider.status === "Active"
                    ? "active"
                    : provider.status === "Suspended"
                      ? "suspended"
                      : "pending"
                }`}
              >
                {provider.status}
              </span>
            </div>
          </div>

          <div className="header-actions">
            <button
              className="action-btn-large edit"
              onClick={() => {
                /* your edit handler */
              }}
            >
              <Edit2 size={18} strokeWidth={2.5} />
              Edit
            </button>

            {provider.status === "Active" ? (
              <button
                className="action-btn-large suspend"
                onClick={() => setShowSuspendModal(true)}
              >
                <XCircle size={18} strokeWidth={2.5} />
                Suspend
              </button>
            ) : (
              <button
                className="action-btn-large approve"
                onClick={() => setShowSuspendModal(true)}
              >
                <CheckCircle size={18} strokeWidth={2.5} />
                Approve
              </button>
            )}
          </div>
        </div>

        <div className="stats-grid">
          <StatCard
            label="Profile Views"
            value={provider.analytics.profileViews}
            icon={Eye}
            iconColor="blue"
          />
          <StatCard
            label="Click-to-Call"
            value={provider.analytics.clickToCall}
            icon={Phone}
            iconColor="green"
          />
          <StatCard
            label="WhatsApp Clicks"
            value={provider.analytics.clickToWhatsApp}
            icon={MessageCircle}
            iconColor="purple"
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
          <div className="tab-content">{renderTabContent()}</div>
        </div>

        <EditComparisonModal
          isOpen={showEditComparison}
          onClose={() => setShowEditComparison(false)}
          editRequests={pendingEdits}
          provider={provider}
          isProcessing={isProcessing}
          onApprove={handleApproveEdits}
          onReject={openRejectModal}
          getFieldLabel={getFieldLabel}
          formatValue={formatValue}
        />

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
          message={`Are you sure you want to ${
            provider.status === "Active" ? "suspend" : "activate"
          } "${provider.name}"?`}
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
