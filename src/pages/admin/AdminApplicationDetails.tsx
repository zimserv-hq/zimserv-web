// src/pages/admin/AdminApplicationDetails.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  XCircle,
  FileText,
  Briefcase,
  Calendar,
  Clock,
  User,
  Download,
  Eye,
  MessageCircle,
  UserCheck,
  Tag,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useToast } from "../../contexts/ToastContext";

type Application = {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  whatsapp_number: string | null;
  city: string;
  primary_category: string;
  primary_category_id: string | null;
  suggested_category: string | null;
  categories?: { name: string } | null;
  years_experience: string;
  work_type: string;
  availability: string | null;
  description: string;
  referral_source: string | null;
  verification_file_url: string | null;
  status:
    | "pending"
    | "pending_category_review"
    | "approved"
    | "rejected"
    | "onboarding"
    | "active"
    | "suspended";
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  rejection_reason: string | null;
};

// ── File helpers ──────────────────────────────────────────────────────────────

const BUCKET = "verification-documents";

function getStoragePath(rawUrl: string): string {
  const marker = `/${BUCKET}/`;
  const idx = rawUrl.indexOf(marker);
  if (idx !== -1) return rawUrl.slice(idx + marker.length).split("?")[0];
  return rawUrl.split("?")[0];
}

function getPublicUrl(rawUrl: string): string {
  const path = getStoragePath(rawUrl);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function getFileName(rawUrl: string): string {
  return getStoragePath(rawUrl).split("/").pop() || "document";
}

// ── Skeleton Components ───────────────────────────────────────────────────────

const SkeletonBlock = ({
  w,
  h,
  radius = 6,
}: {
  w: number | string;
  h: number;
  radius?: number;
}) => (
  <div
    className="sk-block"
    style={{ width: w, height: h, borderRadius: radius, flexShrink: 0 }}
  />
);

const SkeletonHeader = () => (
  <div className="sk-header-card">
    <div className="sk-block sk-avatar" />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
      <SkeletonBlock w={280} h={32} radius={8} />
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <SkeletonBlock w={120} h={16} />
        <SkeletonBlock w={100} h={16} />
        <SkeletonBlock w={140} h={16} />
      </div>
      <SkeletonBlock w={90} h={28} radius={20} />
    </div>
  </div>
);

const SkeletonCard = ({
  rows = 3,
  titleWidth = 160,
}: {
  rows?: number;
  titleWidth?: number;
}) => (
  <div className="sk-card">
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 20,
      }}
    >
      <SkeletonBlock w={22} h={22} radius={6} />
      <SkeletonBlock w={titleWidth} h={18} />
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "14px 0",
          borderBottom: i < rows - 1 ? "1px solid var(--border-color)" : "none",
        }}
      >
        <SkeletonBlock w={110} h={14} />
        <SkeletonBlock w={90} h={14} />
      </div>
    ))}
  </div>
);

const SkeletonContactCard = () => (
  <div className="sk-card">
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 20,
      }}
    >
      <SkeletonBlock w={22} h={22} radius={6} />
      <SkeletonBlock w={180} h={18} />
    </div>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: 14,
          marginBottom: 12,
        }}
      >
        <SkeletonBlock w={40} h={40} radius={10} />
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          <SkeletonBlock w={60} h={12} />
          <SkeletonBlock w={150} h={14} />
        </div>
      </div>
    ))}
  </div>
);

const SkeletonPage = () => (
  <div className="provider-details">
    <div
      className="sk-block"
      style={{ width: 180, height: 44, borderRadius: 12, marginBottom: 24 }}
    />
    <SkeletonHeader />
    <div className="sk-tabs-bar">
      <SkeletonBlock w={160} h={16} />
      <SkeletonBlock w={120} h={16} />
    </div>
    <div className="sk-content-grid">
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div className="sk-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <SkeletonBlock w={22} h={22} radius={6} />
            <SkeletonBlock w={120} h={18} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <SkeletonBlock w="100%" h={14} />
            <SkeletonBlock w="95%" h={14} />
            <SkeletonBlock w="88%" h={14} />
            <SkeletonBlock w="75%" h={14} />
          </div>
        </div>
        <SkeletonCard rows={4} titleWidth={160} />
        <div className="sk-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <SkeletonBlock w={22} h={22} radius={6} />
            <SkeletonBlock w={200} h={18} />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: 16,
              background: "var(--chip-bg)",
              borderRadius: 12,
            }}
          >
            <SkeletonBlock w={56} h={56} radius={12} />
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <SkeletonBlock w={180} h={14} />
              <SkeletonBlock w={120} h={12} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <SkeletonBlock w={80} h={38} radius={10} />
              <SkeletonBlock w={110} h={38} radius={10} />
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <SkeletonContactCard />
        <SkeletonCard rows={2} titleWidth={200} />
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

const AdminApplicationDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSuccess, showError } = useToast();

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"details" | "timeline">("details");
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileLoading, setFileLoading] = useState<"download" | null>(null);
  const [hasProviderProfile, setHasProviderProfile] = useState(false);

  // Editable category name — pre-filled from suggested_category when modal opens
  const [editedCategoryName, setEditedCategoryName] = useState("");

  useEffect(() => {
    if (id) fetchApplication();
  }, [id]);

  // ── Real-time subscription ──────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    const channel = supabase
      .channel(`application-${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "provider_applications",
          filter: `id=eq.${id}`,
        },
        () => fetchApplication(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  async function fetchApplication() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("provider_applications")
        .select("*, categories ( name )")
        .eq("id", id)
        .single();

      if (error) {
        showError("Load failed", "Failed to load application.");
        navigate("/admin/applications");
        return;
      }

      setApplication(data);

      const { data: providerProfile } = await supabase
        .from("providers")
        .select("id")
        .eq("email", data.email.toLowerCase())
        .maybeSingle();

      setHasProviderProfile(!!providerProfile);
    } catch {
      showError("Unexpected error", "An unexpected error occurred.");
      navigate("/admin/applications");
    } finally {
      setLoading(false);
    }
  }

  const isCustomCategory = (app: Application) => !!app.suggested_category;

  const canTakeAction = (app: Application) =>
    !hasProviderProfile &&
    ["pending", "pending_category_review"].includes(app.status);

  // Opens approve modal and pre-fills the editable category name
  const handleOpenApproveModal = () => {
    setEditedCategoryName(application?.suggested_category ?? "");
    setShowApproveModal(true);
  };

  const getStatusLabel = (status: Application["status"]) => {
    switch (status) {
      case "pending":
        return "Pending Review";
      case "pending_category_review":
        return "Category Review";
      case "approved":
        return "Approved";
      case "onboarding":
        return "Onboarding";
      case "active":
        return "Active";
      case "suspended":
        return "Suspended";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: Application["status"]) => {
    switch (status) {
      case "pending":
        return <Clock size={14} strokeWidth={2.5} />;
      case "pending_category_review":
        return <Tag size={14} strokeWidth={2.5} />;
      case "approved":
        return <CheckCircle size={14} strokeWidth={2.5} />;
      case "onboarding":
        return <Clock size={14} strokeWidth={2.5} />;
      case "active":
        return <CheckCircle size={14} strokeWidth={2.5} />;
      case "suspended":
        return <AlertTriangle size={14} strokeWidth={2.5} />;
      case "rejected":
        return <XCircle size={14} strokeWidth={2.5} />;
      default:
        return <Clock size={14} strokeWidth={2.5} />;
    }
  };

  // ── Unified confirm handler ───────────────────────────────────────────────
  const confirmStatusChange = async () => {
    if (!application) return;
    setIsProcessing(true);

    try {
      // ── Reject ──────────────────────────────────────────────────────────
      if (showRejectModal) {
        const { error } = await supabase
          .from("provider_applications")
          .update({ status: "rejected", reviewed_at: new Date().toISOString() })
          .eq("id", application.id);

        if (error) {
          showError("Update failed", "Failed to reject application.");
          return;
        }

        setApplication((prev) =>
          prev
            ? {
                ...prev,
                status: "rejected",
                reviewed_at: new Date().toISOString(),
              }
            : prev,
        );
        setShowRejectModal(false);
        showSuccess(
          "Application rejected",
          "The application has been rejected.",
        );
        return;
      }

      // ── Approve ─────────────────────────────────────────────────────────
      let resolvedCategoryId = application.primary_category_id;
      let resolvedCategoryName = application.primary_category;

      if (isCustomCategory(application)) {
        const finalName = editedCategoryName.trim();
        if (!finalName) {
          showError(
            "Name required",
            "Please enter a category name before approving.",
          );
          return;
        }

        // Check if this category name already exists (case-insensitive)
        const { data: existing } = await supabase
          .from("categories")
          .select("id, name")
          .ilike("name", finalName)
          .maybeSingle();

        if (existing) {
          resolvedCategoryId = existing.id;
          resolvedCategoryName = existing.name;
        } else {
          const { data: newCat, error: catError } = await supabase
            .from("categories")
            .insert({ name: finalName, status: "Active" })
            .select("id, name")
            .single();

          if (catError || !newCat) {
            showError(
              "Category creation failed",
              "Could not create the new category. Please try again.",
            );
            return;
          }
          resolvedCategoryId = newCat.id;
          resolvedCategoryName = newCat.name;
        }
      }

      const { error: approveError } = await supabase
        .from("provider_applications")
        .update({
          status: "approved",
          reviewed_at: new Date().toISOString(),
          primary_category: resolvedCategoryName,
          primary_category_id: resolvedCategoryId,
          suggested_category: null, // clear after resolution
        })
        .eq("id", application.id);

      if (approveError) {
        showError("Update failed", "Failed to approve application.");
        return;
      }

      // Fire-and-forget approval notification email
      supabase.functions
        .invoke("send-approval-notification", {
          body: {
            email: application.email,
            fullName: application.full_name,
            categoryName: isCustomCategory(application)
              ? resolvedCategoryName
              : null,
          },
        })
        .catch((err) => console.warn("Approval email failed:", err));

      setApplication((prev) =>
        prev
          ? {
              ...prev,
              status: "approved",
              reviewed_at: new Date().toISOString(),
              primary_category: resolvedCategoryName,
              primary_category_id: resolvedCategoryId,
              suggested_category: null,
            }
          : prev,
      );

      setShowApproveModal(false);
      showSuccess(
        "Application approved",
        isCustomCategory(application)
          ? `${application.full_name} approved. "${resolvedCategoryName}" added to categories.`
          : `${application.full_name} has been approved and notified.`,
      );
    } catch {
      showError("Unexpected error", "An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ── File handlers ─────────────────────────────────────────────────────────
  const handleViewFile = () => {
    if (!application?.verification_file_url) return;
    window.open(
      getPublicUrl(application.verification_file_url),
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleDownloadFile = async () => {
    if (!application?.verification_file_url) return;
    setFileLoading("download");
    try {
      const url = getPublicUrl(application.verification_file_url);
      const fileName = getFileName(application.verification_file_url);
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(blobUrl);
    } catch (err: any) {
      showError("Download failed", err?.message || "Unknown error.");
    } finally {
      setFileLoading(null);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading)
    return (
      <>
        <style>{pageStyles}</style>
        <SkeletonPage />
      </>
    );
  if (!application) return null;

  const isCategoryReview = application.status === "pending_category_review";

  const categoryDisplayName = application.suggested_category
    ? `${application.suggested_category} (Custom)`
    : (application.categories?.name ?? application.primary_category ?? "—");

  const fileName = application.verification_file_url
    ? getFileName(application.verification_file_url)
    : null;

  return (
    <>
      <style>{pageStyles}</style>

      <div className="provider-details">
        <button
          className="back-button"
          onClick={() => navigate("/admin/applications")}
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
          Back to Applications
        </button>

        {/* ── Already Onboarded Banner ────────────────────────────────────── */}
        {hasProviderProfile && (
          <div className="info-banner registered-banner">
            <div className="banner-left">
              <UserCheck
                size={18}
                strokeWidth={2.5}
                className="registered-icon"
              />
              <div>
                <div className="registered-title">
                  Provider Already Onboarded
                </div>
                <div className="banner-subtitle">
                  This provider has completed onboarding. Their profile exists
                  in the system — no further action needed.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Category Review Banner ──────────────────────────────────────── */}
        {isCategoryReview && !hasProviderProfile && (
          <div className="info-banner category-banner">
            <div className="banner-left">
              <Tag size={18} strokeWidth={2.5} className="category-icon" />
              <div>
                <div className="category-title">Custom Category Requested</div>
                <div className="banner-subtitle">
                  This provider suggested{" "}
                  <strong>"{application.suggested_category}"</strong> as a new
                  category. Click Approve to review and optionally rename it
                  before it's added to the platform.
                </div>
              </div>
            </div>
            <button
              className="approve-category-btn"
              onClick={handleOpenApproveModal}
            >
              <CheckCircle size={15} strokeWidth={2.5} />
              Review &amp; Approve
            </button>
          </div>
        )}

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="details-header">
          <div className="header-left">
            <div className="applicant-avatar">
              <User size={56} strokeWidth={2} />
            </div>
            <div className="provider-info">
              <h1>{application.full_name}</h1>
              <div className="provider-meta">
                <div className="meta-item">
                  <Briefcase size={16} strokeWidth={2} />
                  {categoryDisplayName}
                </div>
                <div className="meta-item">
                  <MapPin size={16} strokeWidth={2} />
                  {application.city}
                </div>
                <div className="meta-item">
                  <Calendar size={16} strokeWidth={2} />
                  Applied{" "}
                  {new Date(application.created_at).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    },
                  )}
                </div>
              </div>
              <span className={`status-badge status-${application.status}`}>
                {getStatusIcon(application.status)}
                {getStatusLabel(application.status)}
              </span>
            </div>
          </div>

          {canTakeAction(application) && (
            <div className="header-actions">
              <button
                className="action-btn-large approve"
                onClick={handleOpenApproveModal}
              >
                <CheckCircle size={18} strokeWidth={2.5} />
                {isCategoryReview ? "Review & Approve" : "Approve"}
              </button>
              <button
                className="action-btn-large reject"
                onClick={() => setShowRejectModal(true)}
              >
                <XCircle size={18} strokeWidth={2.5} />
                Reject
              </button>
            </div>
          )}
        </div>

        {/* ── Tabs ────────────────────────────────────────────────────────── */}
        <div className="tabs-container">
          <div className="tabs-header">
            <button
              className={`tab-button ${activeTab === "details" ? "active" : ""}`}
              onClick={() => setActiveTab("details")}
            >
              <FileText size={16} strokeWidth={2} />
              Application Details
            </button>
            <button
              className={`tab-button ${activeTab === "timeline" ? "active" : ""}`}
              onClick={() => setActiveTab("timeline")}
            >
              <Clock size={16} strokeWidth={2} />
              Timeline
            </button>
          </div>

          <div className="tab-content">
            {/* ── Details Tab ───────────────────────────────────────────── */}
            {activeTab === "details" && (
              <div className="content-grid">
                {/* Left column */}
                <div>
                  <div className="card" style={{ marginBottom: 24 }}>
                    <h2 className="card-title">
                      <FileText size={20} strokeWidth={2.5} />
                      Description
                    </h2>
                    <p className="description-text">
                      {application.description}
                    </p>
                  </div>

                  <div className="card" style={{ marginBottom: 24 }}>
                    <h2 className="card-title">
                      <Briefcase size={20} strokeWidth={2.5} />
                      Work Information
                    </h2>
                    <div className="info-row">
                      <span className="info-label">Years of Experience</span>
                      <span className="info-value">
                        {application.years_experience}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Work Type</span>
                      <span
                        className="info-value"
                        style={{ textTransform: "capitalize" }}
                      >
                        {application.work_type}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Availability</span>
                      <span
                        className="info-value"
                        style={{ textTransform: "capitalize" }}
                      >
                        {application.availability || "Not specified"}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Referral Source</span>
                      <span
                        className="info-value"
                        style={{ textTransform: "capitalize" }}
                      >
                        {application.referral_source || "Not specified"}
                      </span>
                    </div>
                  </div>

                  {application.verification_file_url && (
                    <div className="card">
                      <h2 className="card-title">
                        <FileText size={20} strokeWidth={2.5} />
                        Verification Document
                      </h2>
                      <div className="file-preview-card">
                        <div className="file-icon-large">
                          <FileText size={28} strokeWidth={2} />
                        </div>
                        <div className="file-info">
                          <div className="file-name">{fileName}</div>
                          <div className="file-meta">
                            Uploaded verification document
                          </div>
                        </div>
                        <div className="file-actions">
                          <button
                            className="file-btn view-btn"
                            onClick={handleViewFile}
                            title="Open in new tab"
                          >
                            <Eye size={15} strokeWidth={2.5} />
                            View
                          </button>
                          <button
                            className="file-btn download-btn"
                            onClick={handleDownloadFile}
                            disabled={fileLoading === "download"}
                            title="Download file"
                          >
                            <Download size={15} strokeWidth={2.5} />
                            {fileLoading === "download"
                              ? "Saving…"
                              : "Download"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right column */}
                <div>
                  <div className="card" style={{ marginBottom: 24 }}>
                    <h2 className="card-title">
                      <User size={20} strokeWidth={2.5} />
                      Contact Information
                    </h2>
                    <div className="contact-item">
                      <div className="contact-icon">
                        <Mail size={18} strokeWidth={2.5} />
                      </div>
                      <div className="contact-info">
                        <div className="contact-label">Email</div>
                        <div className="contact-value">{application.email}</div>
                      </div>
                    </div>
                    <div className="contact-item">
                      <div className="contact-icon">
                        <Phone size={18} strokeWidth={2.5} />
                      </div>
                      <div className="contact-info">
                        <div className="contact-label">Phone</div>
                        <div className="contact-value">
                          {application.phone_number}
                        </div>
                      </div>
                    </div>
                    {application.whatsapp_number && (
                      <div className="contact-item">
                        <div className="contact-icon">
                          <MessageCircle size={18} strokeWidth={2.5} />
                        </div>
                        <div className="contact-info">
                          <div className="contact-label">WhatsApp</div>
                          <div className="contact-value">
                            <a
                              href={`https://wa.me/${application.whatsapp_number.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "inherit",
                                textDecoration: "underline",
                                cursor: "pointer",
                              }}
                            >
                              {application.whatsapp_number}
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="card">
                    <h2 className="card-title">
                      <MapPin size={20} strokeWidth={2.5} />
                      Location &amp; Category
                    </h2>
                    <div className="info-row">
                      <span className="info-label">City</span>
                      <span className="info-value">{application.city}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Category</span>
                      <span className="info-value">{categoryDisplayName}</span>
                    </div>
                    {application.suggested_category && (
                      <div className="suggested-category-banner">
                        <span className="suggested-badge">CUSTOM</span>
                        <span className="suggested-name">
                          {application.suggested_category}
                        </span>
                        <span className="suggested-note">
                          Will be created on approval
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── Timeline Tab ──────────────────────────────────────────── */}
            {activeTab === "timeline" && (
              <div className="card">
                <h2 className="card-title">
                  <Clock size={20} strokeWidth={2.5} />
                  Application Timeline
                </h2>
                <div className="timeline">
                  {/* Node 1: Submitted */}
                  <div className="timeline-item">
                    <div className="timeline-dot">
                      <FileText size={12} strokeWidth={3} />
                    </div>
                    <div className="timeline-line" />
                    <div className="timeline-content">
                      <div className="timeline-title">
                        Application Submitted
                      </div>
                      <div className="timeline-date">
                        {new Date(application.created_at).toLocaleString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Node 2: Category review pending */}
                  {isCategoryReview && !hasProviderProfile && (
                    <div className="timeline-item">
                      <div
                        className="timeline-dot"
                        style={{
                          background: "rgba(255,107,53,0.1)",
                          borderColor: "var(--orange-primary)",
                        }}
                      >
                        <Tag size={12} strokeWidth={3} />
                      </div>
                      <div className="timeline-content">
                        <div
                          className="timeline-title"
                          style={{ color: "var(--orange-primary)" }}
                        >
                          Awaiting Category Review
                        </div>
                        <div className="timeline-date">
                          Provider suggested "{application.suggested_category}"
                          — admin review required before approval.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Node 2 alt: Reviewed */}
                  {application.reviewed_at && (
                    <div className="timeline-item">
                      <div className="timeline-dot">
                        {application.status === "rejected" ? (
                          <XCircle size={12} strokeWidth={3} />
                        ) : hasProviderProfile ? (
                          <UserCheck size={12} strokeWidth={3} />
                        ) : (
                          <CheckCircle size={12} strokeWidth={3} />
                        )}
                      </div>
                      {hasProviderProfile && <div className="timeline-line" />}
                      <div className="timeline-content">
                        <div className="timeline-title">
                          {application.status === "rejected"
                            ? "Application Rejected"
                            : hasProviderProfile
                              ? "Approved — Provider Registered"
                              : "Application Approved — Awaiting Profile Completion"}
                        </div>
                        <div className="timeline-date">
                          {new Date(application.reviewed_at).toLocaleString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Node 3: Onboarding completed */}
                  {hasProviderProfile && (
                    <div className="timeline-item">
                      <div
                        className="timeline-dot"
                        style={{
                          background: "rgba(16,185,129,0.15)",
                          borderColor: "#10b981",
                        }}
                      >
                        <CheckCircle size={12} strokeWidth={3} />
                      </div>
                      <div className="timeline-content">
                        <div
                          className="timeline-title"
                          style={{ color: "#059669" }}
                        >
                          Onboarding Completed
                        </div>
                        <div className="timeline-date">
                          Provider has completed registration and is active on
                          the platform.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Fallback: pending with no review yet */}
                  {!application.reviewed_at && !isCategoryReview && (
                    <div className="timeline-item">
                      <div
                        className="timeline-dot"
                        style={{
                          background: "rgba(245,158,11,0.12)",
                          borderColor: "#d97706",
                        }}
                      >
                        <Clock size={12} strokeWidth={3} />
                      </div>
                      <div className="timeline-content">
                        <div
                          className="timeline-title"
                          style={{ color: "#d97706" }}
                        >
                          Awaiting Admin Review
                        </div>
                        <div className="timeline-date">
                          Application is pending review.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Approve Modal (inline — supports category name editing) ───────── */}
        {showApproveModal && (
          <div
            className="modal-overlay"
            onClick={() => !isProcessing && setShowApproveModal(false)}
          >
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">
                <CheckCircle size={22} color="#10b981" strokeWidth={2.5} />
                {isCategoryReview
                  ? "Review Category & Approve"
                  : "Approve Application"}
              </h2>

              {isCategoryReview ? (
                <>
                  <p className="modal-text">
                    Review the category name suggested by{" "}
                    <strong>{application.full_name}</strong>. Edit it if needed,
                    then approve. The provider will be notified to log in and
                    complete their profile.
                  </p>

                  {/* ── Editable category name ── */}
                  <div className="modal-field">
                    <label className="modal-field-label">Category Name</label>
                    <div className="modal-field-original">
                      Provider submitted:{" "}
                      <em>"{application.suggested_category}"</em>
                    </div>
                    <input
                      className="modal-field-input"
                      value={editedCategoryName}
                      onChange={(e) => setEditedCategoryName(e.target.value)}
                      placeholder="Enter category name"
                      disabled={isProcessing}
                      autoFocus
                    />
                    <span className="modal-field-hint">
                      Edit to fix typos or rename before it's added to the
                      platform.
                    </span>
                  </div>
                </>
              ) : (
                <p className="modal-text">
                  Approve <strong>{application.full_name}</strong>? They'll
                  receive a notification email and can log in to complete their
                  provider profile.
                </p>
              )}

              <div className="modal-actions">
                <button
                  className="modal-btn cancel"
                  onClick={() => setShowApproveModal(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  className="modal-btn confirm"
                  onClick={confirmStatusChange}
                  disabled={
                    isProcessing ||
                    (isCategoryReview && !editedCategoryName.trim())
                  }
                >
                  {isProcessing ? "Processing…" : "Approve"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Reject Modal ────────────────────────────────────────────────── */}
        {showRejectModal && (
          <div
            className="modal-overlay"
            onClick={() => !isProcessing && setShowRejectModal(false)}
          >
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">
                <XCircle size={22} color="#ef4444" strokeWidth={2.5} />
                Reject Application
              </h2>
              <p className="modal-text">
                Are you sure you want to reject{" "}
                <strong>{application.full_name}</strong>? This action can be
                reversed later.
              </p>
              <div className="modal-actions">
                <button
                  className="modal-btn cancel"
                  onClick={() => setShowRejectModal(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  className="modal-btn confirm danger"
                  onClick={confirmStatusChange}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing…" : "Reject"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const pageStyles = `
  @keyframes skShimmer { 0% { background-position: -700px 0; } 100% { background-position: 700px 0; } }
  .sk-block {
    background: linear-gradient(90deg, var(--sk-base) 25%, var(--sk-hi) 50%, var(--sk-base) 75%);
    background-size: 700px 100%; animation: skShimmer 1.6s ease-in-out infinite; border-radius: 6px; flex-shrink: 0;
  }
  :root { --sk-base: #f0f0f0; --sk-hi: #e4e4e4; }
  .dark-mode { --sk-base: #374151; --sk-hi: #4b5563; }

  .sk-header-card { display:flex; gap:24px; align-items:flex-start; padding:28px; background:var(--card-bg); border:1.5px solid var(--border-color); border-radius:16px; margin-bottom:32px; }
  .sk-avatar { width:120px; height:120px; border-radius:16px; flex-shrink:0; }
  .sk-tabs-bar { display:flex; gap:32px; padding:0 20px; height:56px; align-items:center; background:var(--card-bg); border:1.5px solid var(--border-color); border-radius:16px 16px 0 0; border-bottom:none; }
  .sk-content-grid { display:grid; grid-template-columns:2fr 1fr; gap:24px; padding:28px; background:var(--card-bg); border:1.5px solid var(--border-color); border-radius:0 0 16px 16px; border-top:1.5px solid var(--border-color); }
  .sk-card { background:var(--card-bg); border:1.5px solid var(--border-color); border-radius:14px; padding:24px; }

  .provider-details { padding:28px; max-width:1600px; margin:0 auto; background:var(--bg-primary); min-height:100vh; }
  .back-button { display:inline-flex; align-items:center; gap:8px; padding:12px 20px; border-radius:12px; border:1.5px solid var(--border-color); background:var(--card-bg); color:var(--text-primary); font-size:14px; font-weight:600; cursor:pointer; transition:all 0.3s cubic-bezier(0.4,0,0.2,1); margin-bottom:24px; }
  .back-button:hover { background:var(--hover-bg); border-color:var(--border-hover); transform:translateX(-4px); }

  /* ── Banners ── */
  .info-banner { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:16px 20px; border-radius:14px; margin-bottom:20px; flex-wrap:wrap; border:1.5px solid; }
  .banner-left { display:flex; align-items:flex-start; gap:12px; flex:1; }
  .banner-subtitle { font-size:13px; color:var(--text-secondary); line-height:1.5; margin-top:3px; }

  .registered-banner { background:rgba(16,185,129,0.08); border-color:rgba(16,185,129,0.3); }
  .registered-icon { color:#065f46; flex-shrink:0; margin-top:2px; }
  .dark-mode .registered-icon { color:#10b981; }
  .registered-title { font-size:14px; font-weight:700; color:#065f46; }
  .dark-mode .registered-title { color:#10b981; }

  .category-banner { background:rgba(255,107,53,0.07); border-color:rgba(255,107,53,0.3); }
  .category-icon { color:var(--orange-primary); flex-shrink:0; margin-top:2px; }
  .category-title { font-size:14px; font-weight:700; color:var(--orange-primary); }
  .approve-category-btn { display:inline-flex; align-items:center; gap:8px; padding:10px 18px; border-radius:10px; border:none; background:#10b981; color:#fff; font-size:13px; font-weight:700; cursor:pointer; transition:all 0.2s ease; white-space:nowrap; flex-shrink:0; }
  .approve-category-btn:hover { background:#059669; transform:translateY(-1px); }

  /* ── Header ── */
  .details-header { display:flex; justify-content:space-between; align-items:flex-start; gap:24px; margin-bottom:32px; padding:28px; background:var(--card-bg); border:1.5px solid var(--border-color); border-radius:16px; box-shadow:0 2px 8px var(--card-shadow); }
  .header-left { display:flex; gap:24px; align-items:flex-start; flex:1; }
  .applicant-avatar { width:120px; height:120px; border-radius:16px; flex-shrink:0; display:flex; align-items:center; justify-content:center; background:var(--orange-light-bg); color:var(--orange-primary); border:2px solid var(--border-color); box-shadow:0 4px 16px var(--card-shadow); }
  .provider-info h1 { font-size:32px; font-weight:800; color:var(--text-primary); margin-bottom:12px; letter-spacing:-0.8px; }
  .provider-meta { display:flex; gap:20px; margin-bottom:16px; flex-wrap:wrap; }
  .meta-item { display:flex; align-items:center; gap:8px; font-size:15px; color:var(--text-secondary); font-weight:500; }

  /* ── Status badges ── */
  .status-badge { display:inline-flex; align-items:center; gap:6px; padding:8px 16px; border-radius:20px; font-size:13px; font-weight:700; }
  .status-badge.status-pending                  { background:#fef3c7; color:#92400e; }
  .status-badge.status-pending_category_review  { background:rgba(255,107,53,0.1); color:var(--orange-primary); border:1.5px solid rgba(255,107,53,0.3); }
  .status-badge.status-approved                 { background:#d1fae5; color:#065f46; }
  .status-badge.status-onboarding               { background:#ede9fe; color:#5b21b6; }
  .status-badge.status-active                   { background:#d1fae5; color:#065f46; }
  .status-badge.status-suspended                { background:#f3f4f6; color:#374151; }
  .status-badge.status-rejected                 { background:#fee2e2; color:#991b1b; }
  .dark-mode .status-badge.status-pending                  { background:rgba(251,191,36,0.2);   color:#fbbf24; }
  .dark-mode .status-badge.status-pending_category_review  { background:rgba(255,107,53,0.15);  color:#FF8A5B; border-color:rgba(255,107,53,0.35); }
  .dark-mode .status-badge.status-approved                 { background:rgba(16,185,129,0.2);   color:#10b981; }
  .dark-mode .status-badge.status-onboarding               { background:rgba(139,92,246,0.2);   color:#a78bfa; }
  .dark-mode .status-badge.status-active                   { background:rgba(16,185,129,0.2);   color:#10b981; }
  .dark-mode .status-badge.status-suspended                { background:rgba(156,163,175,0.2);  color:#9ca3af; }
  .dark-mode .status-badge.status-rejected                 { background:rgba(239,68,68,0.2);    color:#ef4444; }

  .header-actions { display:flex; gap:12px; }
  .action-btn-large { display:inline-flex; align-items:center; gap:10px; padding:13px 24px; border-radius:12px; font-size:14px; font-weight:700; cursor:pointer; transition:all 0.3s cubic-bezier(0.4,0,0.2,1); border:none; }
  .action-btn-large.approve { background:linear-gradient(135deg,#10b981 0%,#059669 100%); color:#fff; box-shadow:0 4px 16px rgba(16,185,129,0.3); }
  .action-btn-large.approve:hover { transform:translateY(-2px); box-shadow:0 6px 24px rgba(16,185,129,0.4); }
  .action-btn-large.reject  { background:linear-gradient(135deg,#ef4444 0%,#dc2626 100%); color:#fff; box-shadow:0 4px 16px rgba(239,68,68,0.3); }
  .action-btn-large.reject:hover  { transform:translateY(-2px); box-shadow:0 6px 24px rgba(239,68,68,0.4); }
  .action-btn-large:disabled { opacity:0.5; cursor:not-allowed; transform:none !important; }

  /* ── Tabs ── */
  .tabs-container { background:var(--card-bg); border:1.5px solid var(--border-color); border-radius:16px; overflow:hidden; margin-bottom:24px; box-shadow:0 2px 8px var(--card-shadow); }
  .tabs-header { display:flex; border-bottom:1.5px solid var(--border-color); background:var(--tabs-bg); padding:0 8px; }
  .tab-button { padding:16px 24px; border:none; background:transparent; color:var(--text-secondary); font-size:14px; font-weight:600; cursor:pointer; transition:all 0.2s ease; border-bottom:2px solid transparent; display:flex; align-items:center; gap:8px; }
  .tab-button:hover  { color:var(--text-primary); background:var(--hover-bg); }
  .tab-button.active { color:var(--orange-primary); border-bottom-color:var(--orange-primary); }
  .tab-content { padding:28px; }

  .content-grid { display:grid; grid-template-columns:2fr 1fr; gap:24px; }
  .card { background:var(--card-bg); border:1.5px solid var(--border-color); border-radius:14px; padding:24px; box-shadow:0 2px 8px var(--card-shadow); transition:all 0.3s ease; }
  .card:hover { border-color:var(--border-hover); box-shadow:0 4px 16px var(--card-shadow); }
  .card-title { font-size:18px; font-weight:700; color:var(--text-primary); margin-bottom:20px; display:flex; align-items:center; gap:10px; }

  .info-row { display:flex; justify-content:space-between; padding:14px 0; border-bottom:1px solid var(--border-color); }
  .info-row:last-child { border-bottom:none; }
  .info-label { font-size:14px; color:var(--text-secondary); font-weight:500; }
  .info-value { font-size:14px; color:var(--text-primary); font-weight:600; text-align:right; }

  .contact-item { display:flex; align-items:center; gap:12px; padding:14px; background:var(--chip-bg); border-radius:12px; margin-bottom:12px; transition:all 0.2s ease; }
  .contact-item:last-child { margin-bottom:0; }
  .contact-item:hover { background:var(--hover-bg); transform:translateX(4px); }
  .contact-icon { width:40px; height:40px; border-radius:10px; flex-shrink:0; background:var(--orange-light-bg); color:var(--orange-primary); display:flex; align-items:center; justify-content:center; }
  .contact-info { flex:1; }
  .contact-label { font-size:12px; color:var(--text-secondary); margin-bottom:4px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; }
  .contact-value { font-size:14px; color:var(--text-primary); font-weight:600; }
  .contact-value a:hover { color:var(--orange-primary); }

  .description-text { color:var(--text-secondary); line-height:1.8; font-size:15px; background:var(--chip-bg); padding:16px; border-radius:12px; margin:0; }

  .file-preview-card { padding:20px; background:var(--chip-bg); border-radius:12px; border:1.5px solid var(--border-color); display:flex; align-items:center; gap:16px; }
  .file-icon-large { width:56px; height:56px; border-radius:12px; flex-shrink:0; background:var(--orange-light-bg); color:var(--orange-primary); display:flex; align-items:center; justify-content:center; }
  .file-info { flex:1; min-width:0; }
  .file-name { font-size:15px; font-weight:600; color:var(--text-primary); margin-bottom:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .file-meta { font-size:13px; color:var(--text-secondary); }
  .file-actions { display:flex; gap:8px; flex-shrink:0; }
  .file-btn { padding:10px 16px; border:none; border-radius:10px; font-size:13px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:7px; transition:all 0.2s ease; white-space:nowrap; }
  .file-btn:disabled { opacity:0.6; cursor:not-allowed; }
  .file-btn.view-btn { background:var(--hover-bg); color:var(--text-primary); border:1.5px solid var(--border-color); }
  .file-btn.view-btn:hover { background:var(--border-color); transform:translateY(-1px); }
  .file-btn.download-btn { background:var(--orange-primary); color:#fff; box-shadow:0 2px 8px rgba(255,107,53,0.25); }
  .file-btn.download-btn:hover:not(:disabled) { background:#e85a28; transform:translateY(-1px); box-shadow:0 4px 14px rgba(255,107,53,0.35); }

  .suggested-category-banner { display:flex; align-items:center; gap:10px; margin-top:14px; padding:12px 16px; background:rgba(255,107,53,0.08); border:1.5px solid rgba(255,107,53,0.25); border-radius:10px; flex-wrap:wrap; }
  .suggested-badge { font-size:11px; font-weight:700; background:var(--orange-light-bg); color:var(--orange-primary); padding:2px 8px; border-radius:999px; flex-shrink:0; }
  .suggested-name { font-size:14px; font-weight:600; color:var(--text-primary); flex:1; }
  .suggested-note { font-size:12px; color:var(--text-secondary); margin-left:auto; white-space:nowrap; }

  /* ── Timeline ── */
  .timeline { position:relative; }
  .timeline-item { position:relative; padding-left:40px; padding-bottom:28px; }
  .timeline-item:last-child { padding-bottom:0; }
  .timeline-dot { position:absolute; left:0; top:0; width:24px; height:24px; border-radius:50%; background:var(--orange-light-bg); border:3px solid var(--orange-primary); display:flex; align-items:center; justify-content:center; color:var(--orange-primary); }
  .timeline-line { position:absolute; left:11px; top:24px; bottom:0; width:2px; background:var(--border-color); }
  .timeline-content { background:var(--chip-bg); padding:16px; border-radius:12px; }
  .timeline-title { font-size:15px; font-weight:600; color:var(--text-primary); margin-bottom:4px; }
  .timeline-date  { font-size:13px; color:var(--text-secondary); }

  /* ── Inline Modals ── */
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.55); display:flex; align-items:center; justify-content:center; z-index:1000; padding:20px; backdrop-filter:blur(2px); }
  .modal-box { background:var(--card-bg); border-radius:18px; padding:32px; max-width:480px; width:100%; box-shadow:0 24px 64px rgba(0,0,0,0.22); border:1.5px solid var(--border-color); }
  .modal-title { display:flex; align-items:center; gap:10px; font-size:20px; font-weight:800; color:var(--text-primary); margin-bottom:14px; letter-spacing:-0.4px; }
  .modal-text { font-size:15px; color:var(--text-secondary); line-height:1.65; margin-bottom:20px; }
  .modal-field { display:flex; flex-direction:column; gap:7px; margin-bottom:24px; }
  .modal-field-label { font-size:13px; font-weight:700; color:var(--text-primary); }
  .modal-field-original { font-size:12px; color:var(--text-secondary); padding:6px 10px; background:var(--chip-bg); border-radius:6px; border:1px solid var(--border-color); }
  .modal-field-input { padding:12px 16px; border:2px solid var(--border-color); border-radius:10px; background:var(--chip-bg); color:var(--text-primary); font-size:15px; font-weight:600; outline:none; transition:border-color 0.2s, box-shadow 0.2s; font-family:inherit; }
  .modal-field-input:focus { border-color:var(--orange-primary); box-shadow:0 0 0 3px rgba(255,107,53,0.12); }
  .modal-field-input:disabled { opacity:0.5; }
  .modal-field-hint { font-size:12px; color:var(--text-secondary); }
  .modal-actions { display:flex; gap:12px; justify-content:flex-end; }
  .modal-btn { padding:11px 26px; border-radius:100px; font-weight:700; font-size:14px; border:none; cursor:pointer; font-family:inherit; transition:all 0.2s ease; }
  .modal-btn:disabled { opacity:0.6; cursor:not-allowed; }
  .modal-btn.cancel { background:var(--hover-bg); color:var(--text-secondary); border:1.5px solid var(--border-color); }
  .modal-btn.cancel:hover:not(:disabled) { border-color:var(--orange-primary); color:var(--orange-primary); }
  .modal-btn.confirm { background:#10b981; color:#fff; box-shadow:0 3px 10px rgba(16,185,129,0.3); }
  .modal-btn.confirm:hover:not(:disabled) { background:#059669; transform:translateY(-1px); box-shadow:0 5px 16px rgba(16,185,129,0.4); }
  .modal-btn.confirm.danger { background:#ef4444; box-shadow:0 3px 10px rgba(239,68,68,0.3); }
  .modal-btn.confirm.danger:hover:not(:disabled) { background:#dc2626; box-shadow:0 5px 16px rgba(239,68,68,0.4); }

  /* ── CSS Variables ── */
  :root {
    --bg-primary:#f8f9fa; --text-primary:#111827; --text-secondary:#6b7280;
    --text-tertiary:#9ca3af; --card-bg:#ffffff; --border-color:#e5e7eb;
    --border-hover:#d1d5db; --hover-bg:#f3f4f6; --chip-bg:#f9fafb; --tabs-bg:#fafbfc;
    --card-shadow:rgba(0,0,0,0.05); --orange-primary:#FF6B35; --orange-light-bg:#FFF4ED;
  }
  .dark-mode {
    --bg-primary:#111827; --text-primary:#f9fafb; --text-secondary:#d1d5db;
    --text-tertiary:#9ca3af; --card-bg:#1f2937; --border-color:#374151;
    --border-hover:#4b5563; --hover-bg:#374151; --chip-bg:#374151; --tabs-bg:#1f2937;
    --card-shadow:rgba(0,0,0,0.3); --orange-primary:#FF8A5B; --orange-light-bg:rgba(255,107,53,0.15);
  }

  @media (max-width: 1024px) { .content-grid { grid-template-columns:1fr; } .sk-content-grid { grid-template-columns:1fr; } }
  @media (max-width: 768px) {
    .provider-details { padding:20px 16px; }
    .details-header { flex-direction:column; padding:20px; }
    .header-left { flex-direction:column; align-items:center; text-align:center; }
    .provider-info h1 { font-size:24px; }
    .provider-meta { justify-content:center; }
    .header-actions { width:100%; flex-direction:column; }
    .action-btn-large { width:100%; justify-content:center; }
    .tab-content { padding:20px; }
    .file-preview-card { flex-direction:column; align-items:flex-start; }
    .file-actions { width:100%; }
    .file-btn { flex:1; justify-content:center; }
    .suggested-note { display:none; }
    .info-banner { flex-direction:column; align-items:flex-start; }
    .approve-category-btn { width:100%; justify-content:center; }
    .modal-box { padding:24px; }
    .modal-actions { flex-direction:column-reverse; }
    .modal-btn { width:100%; justify-content:center; text-align:center; }
  }
`;

export default AdminApplicationDetails;
