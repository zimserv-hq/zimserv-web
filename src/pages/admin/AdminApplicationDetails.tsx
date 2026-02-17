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
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import ConfirmationModal from "../../components/Admin/ConfirmationModal";

type Application = {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  whatsapp_number: string | null;
  city: string;
  primary_category_id: string;
  categories?: { name: string } | null;
  years_experience: string;
  work_type: string;
  availability: string | null;
  description: string;
  referral_source: string | null;
  verification_file_url: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  rejection_reason: string | null;
};

// ── File helpers ──────────────────────────────────────────────────────────────

const BUCKET = "verification-documents";

/**
 * Extracts the bare storage path from whatever is stored in verification_file_url.
 *
 * The DB may store:
 *   (A) An old signed URL: https://…/object/sign/verification-documents/filename.jpg?token=…
 *   (B) A public URL:      https://…/object/public/verification-documents/filename.jpg
 *   (C) A bare path:       filename.jpg  or  folder/filename.jpg
 *
 * In all cases we extract the path after the bucket name, strip any query string,
 * then call getPublicUrl() — works now that the bucket is set to public.
 */
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
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"details" | "timeline">("details");
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileLoading, setFileLoading] = useState<"download" | null>(null);

  useEffect(() => {
    if (id) fetchApplication();
  }, [id]);

  async function fetchApplication() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("provider_applications")
        .select(
          `
          *,
          categories (
            name
          )
        `,
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error("❌ Error fetching application:", error);
        alert("Failed to load application");
        navigate("/admin/applications");
        return;
      }

      setApplication(data);
    } catch (err) {
      console.error("❌ Unexpected error:", err);
      alert("An unexpected error occurred");
      navigate("/admin/applications");
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async () => {
    if (!application) return;
    setIsProcessing(true);
    try {
      const { data, error } = await supabase
        .from("provider_applications")
        .update({ status: "approved", reviewed_at: new Date().toISOString() })
        .eq("id", application.id)
        .select(`*, categories ( name )`)
        .single();

      if (error) {
        alert("Failed to approve application");
        return;
      }

      setApplication(data);
      setShowApproveModal(false);

      const { error: fnError } = await supabase.functions.invoke(
        "send-provider-invite",
        {
          body: {
            applicationId: application.id,
            email: application.email,
            fullName: application.full_name,
          },
        },
      );
      alert(
        fnError
          ? "Application approved but failed to send invitation email. Please send manually."
          : `Application approved! Invitation email sent to ${application.email}`,
      );
    } catch (err) {
      alert("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!application) return;
    setIsProcessing(true);
    try {
      const { data, error } = await supabase
        .from("provider_applications")
        .update({ status: "rejected", reviewed_at: new Date().toISOString() })
        .eq("id", application.id)
        .select(`*, categories ( name )`)
        .single();

      if (error) {
        alert("Failed to reject application");
        return;
      }

      setApplication(data);
      setShowRejectModal(false);
    } catch (err) {
      alert("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  // ── View: resolve public URL → open in new tab (no loading state needed) ──
  const handleViewFile = () => {
    if (!application?.verification_file_url) return;
    const url = getPublicUrl(application.verification_file_url);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // ── Download: fetch public URL as blob → Save As dialog ───────────────────
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
      console.error("❌ Download error:", err);
      alert(`Download failed: ${err?.message || "unknown error"}`);
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

  const categoryName = application.categories?.name ?? "—";
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
                  {categoryName}
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
              <span className={`status-badge ${application.status}`}>
                {application.status === "pending" && (
                  <Clock size={14} strokeWidth={2.5} />
                )}
                {application.status === "approved" && (
                  <CheckCircle size={14} strokeWidth={2.5} />
                )}
                {application.status === "rejected" && (
                  <XCircle size={14} strokeWidth={2.5} />
                )}
                {application.status}
              </span>
            </div>
          </div>

          {application.status === "pending" && (
            <div className="header-actions">
              <button
                className="action-btn-large approve"
                onClick={() => setShowApproveModal(true)}
              >
                <CheckCircle size={18} strokeWidth={2.5} />
                Approve
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
            {/* Details */}
            {activeTab === "details" && (
              <div className="content-grid">
                {/* Left column */}
                <div>
                  {/* Description */}
                  <div className="card" style={{ marginBottom: 24 }}>
                    <h2 className="card-title">
                      <FileText size={20} strokeWidth={2.5} />
                      Description
                    </h2>
                    <p className="description-text">
                      {application.description}
                    </p>
                  </div>

                  {/* Work info */}
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

                  {/* Verification document */}
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
                  {/* Contact */}
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
                            {application.whatsapp_number}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Location & category */}
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
                      <span className="info-value">{categoryName}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline */}
            {activeTab === "timeline" && (
              <div className="card">
                <h2 className="card-title">
                  <Clock size={20} strokeWidth={2.5} />
                  Application Timeline
                </h2>
                <div className="timeline">
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
                  {application.reviewed_at && (
                    <div className="timeline-item">
                      <div className="timeline-dot">
                        {application.status === "approved" ? (
                          <CheckCircle size={12} strokeWidth={3} />
                        ) : (
                          <XCircle size={12} strokeWidth={3} />
                        )}
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-title">
                          Application{" "}
                          {application.status === "approved"
                            ? "Approved"
                            : "Rejected"}
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
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Modals ──────────────────────────────────────────────────────── */}
        <ConfirmationModal
          isOpen={showApproveModal}
          onClose={() => setShowApproveModal(false)}
          onConfirm={handleApprove}
          title="Approve Application"
          message={`Are you sure you want to approve "${application.full_name}"? An invitation email will be sent to complete their provider profile.`}
          confirmLabel="Approve"
          confirmStyle="success"
          icon={CheckCircle}
          isLoading={isProcessing}
        />
        <ConfirmationModal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          onConfirm={handleReject}
          title="Reject Application"
          message={`Are you sure you want to reject "${application.full_name}"? This action can be reversed later.`}
          confirmLabel="Reject"
          confirmStyle="danger"
          icon={XCircle}
          isLoading={isProcessing}
        />
      </div>
    </>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const pageStyles = `
  @keyframes skShimmer {
    0%   { background-position: -700px 0; }
    100% { background-position:  700px 0; }
  }
  .sk-block {
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

  .sk-header-card {
    display: flex; gap: 24px; align-items: flex-start;
    padding: 28px; background: var(--card-bg);
    border: 1.5px solid var(--border-color); border-radius: 16px; margin-bottom: 32px;
  }
  .sk-avatar { width: 120px; height: 120px; border-radius: 16px; flex-shrink: 0; }
  .sk-tabs-bar {
    display: flex; gap: 32px; padding: 0 20px; height: 56px; align-items: center;
    background: var(--card-bg); border: 1.5px solid var(--border-color);
    border-radius: 16px 16px 0 0; border-bottom: none;
  }
  .sk-content-grid {
    display: grid; grid-template-columns: 2fr 1fr; gap: 24px; padding: 28px;
    background: var(--card-bg); border: 1.5px solid var(--border-color);
    border-radius: 0 0 16px 16px; border-top: 1.5px solid var(--border-color);
  }
  .sk-card { background: var(--card-bg); border: 1.5px solid var(--border-color); border-radius: 14px; padding: 24px; }

  @media (max-width: 1024px) { .sk-content-grid { grid-template-columns: 1fr; } }
  @media (max-width: 768px)  { .sk-header-card  { flex-direction: column; align-items: center; } }

  .provider-details { padding: 28px; max-width: 1600px; margin: 0 auto; background: var(--bg-primary); min-height: 100vh; }

  .back-button { display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; border-radius: 12px; border: 1.5px solid var(--border-color); background: var(--card-bg); color: var(--text-primary); font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s cubic-bezier(0.4,0,0.2,1); margin-bottom: 24px; }
  .back-button:hover { background: var(--hover-bg); border-color: var(--border-hover); transform: translateX(-4px); }

  .details-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; margin-bottom: 32px; padding: 28px; background: var(--card-bg); border: 1.5px solid var(--border-color); border-radius: 16px; box-shadow: 0 2px 8px var(--card-shadow); }
  .header-left { display: flex; gap: 24px; align-items: flex-start; flex: 1; }
  .applicant-avatar { width: 120px; height: 120px; border-radius: 16px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: var(--orange-light-bg); color: var(--orange-primary); border: 2px solid var(--border-color); box-shadow: 0 4px 16px var(--card-shadow); }
  .provider-info h1 { font-size: 32px; font-weight: 800; color: var(--text-primary); margin-bottom: 12px; display: flex; align-items: center; gap: 12px; letter-spacing: -0.8px; }
  .provider-meta { display: flex; gap: 20px; margin-bottom: 16px; flex-wrap: wrap; }
  .meta-item { display: flex; align-items: center; gap: 8px; font-size: 15px; color: var(--text-secondary); font-weight: 500; }

  .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; text-transform: capitalize; }
  .status-badge.pending  { background: #fef3c7; color: #92400e; }
  .status-badge.approved { background: #d1fae5; color: #065f46; }
  .status-badge.rejected { background: #fee2e2; color: #991b1b; }
  .dark-mode .status-badge.pending  { background: rgba(251,191,36,0.2); color: #fbbf24; }
  .dark-mode .status-badge.approved { background: rgba(16,185,129,0.2); color: #10b981; }
  .dark-mode .status-badge.rejected { background: rgba(239,68,68,0.2);  color: #ef4444; }

  .header-actions { display: flex; gap: 12px; }
  .action-btn-large { display: inline-flex; align-items: center; gap: 10px; padding: 13px 24px; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.3s cubic-bezier(0.4,0,0.2,1); border: none; }
  .action-btn-large.approve { background: linear-gradient(135deg,#10b981 0%,#059669 100%); color:#fff; box-shadow:0 4px 16px rgba(16,185,129,0.3); }
  .action-btn-large.approve:hover { transform:translateY(-2px); box-shadow:0 6px 24px rgba(16,185,129,0.4); }
  .action-btn-large.reject  { background: linear-gradient(135deg,#ef4444 0%,#dc2626 100%); color:#fff; box-shadow:0 4px 16px rgba(239,68,68,0.3); }
  .action-btn-large.reject:hover  { transform:translateY(-2px); box-shadow:0 6px 24px rgba(239,68,68,0.4); }
  .action-btn-large:disabled { opacity:0.5; cursor:not-allowed; transform:none !important; }

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

  .timeline { position:relative; }
  .timeline-item { position:relative; padding-left:40px; padding-bottom:28px; }
  .timeline-item:last-child { padding-bottom:0; }
  .timeline-dot { position:absolute; left:0; top:0; width:24px; height:24px; border-radius:50%; background:var(--orange-light-bg); border:3px solid var(--orange-primary); display:flex; align-items:center; justify-content:center; }
  .timeline-line { position:absolute; left:11px; top:24px; bottom:0; width:2px; background:var(--border-color); }
  .timeline-content { background:var(--chip-bg); padding:16px; border-radius:12px; }
  .timeline-title { font-size:15px; font-weight:600; color:var(--text-primary); margin-bottom:4px; }
  .timeline-date  { font-size:13px; color:var(--text-secondary); }

  :root {
    --bg-primary:#f8f9fa; --text-primary:#111827; --text-secondary:#6b7280;
    --card-bg:#ffffff; --border-color:#e5e7eb; --border-hover:#d1d5db;
    --hover-bg:#f3f4f6; --chip-bg:#f9fafb; --tabs-bg:#fafbfc;
    --card-shadow:rgba(0,0,0,0.05); --orange-primary:#FF6B35; --orange-light-bg:#FFF4ED;
  }
  .dark-mode {
    --bg-primary:#111827; --text-primary:#f9fafb; --text-secondary:#d1d5db;
    --card-bg:#1f2937; --border-color:#374151; --border-hover:#4b5563;
    --hover-bg:#374151; --chip-bg:#374151; --tabs-bg:#1f2937;
    --card-shadow:rgba(0,0,0,0.3); --orange-primary:#FF8A5B; --orange-light-bg:rgba(255,107,53,0.15);
  }

  @media (max-width: 1024px) { .content-grid { grid-template-columns:1fr; } }
  @media (max-width: 768px) {
    .provider-details { padding:20px 16px; }
    .details-header { flex-direction:column; padding:20px; }
    .header-left { flex-direction:column; align-items:center; text-align:center; }
    .provider-info h1 { font-size:24px; justify-content:center; }
    .provider-meta { justify-content:center; }
    .header-actions { width:100%; flex-direction:column; }
    .action-btn-large { width:100%; justify-content:center; }
    .tab-content { padding:20px; }
    .file-preview-card { flex-direction:column; align-items:flex-start; }
    .file-actions { width:100%; }
    .file-btn { flex:1; justify-content:center; }
  }
`;

export default AdminApplicationDetails;
