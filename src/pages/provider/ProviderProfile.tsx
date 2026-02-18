// src/pages/provider/ProviderProfile.tsx
import { useState, useEffect } from "react";
import {
  User,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Star,
  Save,
  FileText,
  Award,
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
  Edit2,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import PageHeader from "../../components/Admin/PageHeader";
import { supabase } from "../../lib/supabaseClient";

interface ProviderProfileData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  businessName: string;
  category: string;
  yearsExperience: string;
  description: string;
  services: string[];
  website: string;
  certifications: string;
  profilePhotoUrl: string | null;
  galleryImages: string[];
  status: string;
}

const ProviderProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [providerId, setProviderId] = useState<string | null>(null);
  const [newService, setNewService] = useState("");

  const [profile, setProfile] = useState<ProviderProfileData>({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    businessName: "",
    category: "",
    yearsExperience: "",
    description: "",
    services: [],
    website: "",
    certifications: "",
    profilePhotoUrl: null,
    galleryImages: [],
    status: "",
  });

  const [editProfile, setEditProfile] = useState<ProviderProfileData>({ ...profile });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: provider } = await supabase
        .from("providers")
        .select("id, full_name, email, phone, city, business_name, category, status")
        .eq("email", user.email)
        .single();

      if (!provider) return;
      setProviderId(provider.id);

      const { data: profileData } = await supabase
        .from("provider_profile")
        .select("*")
        .eq("provider_id", provider.id)
        .single();

      const { data: services } = await supabase
        .from("provider_services")
        .select("service_name")
        .eq("provider_id", provider.id);

      const { data: media } = await supabase
        .from("provider_media")
        .select("file_url, type")
        .eq("provider_id", provider.id);

      const profilePhoto = media?.find((m) => m.type === "profile")?.file_url || null;
      const galleryImages = media?.filter((m) => m.type === "portfolio").map((m) => m.file_url) || [];

      const profileObj: ProviderProfileData = {
        fullName: provider.full_name || "",
        email: provider.email || "",
        phone: provider.phone || "",
        city: provider.city || "",
        address: profileData?.address || "",
        businessName: provider.business_name || "",
        category: provider.category || "",
        yearsExperience: profileData?.years_experience?.toString() || "",
        description: profileData?.description || "",
        services: services?.map((s) => s.service_name) || [],
        website: profileData?.website || "",
        certifications: profileData?.certifications || "",
        profilePhotoUrl: profilePhoto,
        galleryImages,
        status: provider.status || "",
      };

      setProfile(profileObj);
      setEditProfile(profileObj);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!providerId) return;
    setIsSaving(true);
    setSaveError("");
    try {
      // Update providers table
      await supabase.from("providers").update({
        full_name: editProfile.fullName,
        phone: editProfile.phone,
        city: editProfile.city,
        business_name: editProfile.businessName,
        category: editProfile.category,
        has_pending_edits: true,
        updated_at: new Date().toISOString(),
      }).eq("id", providerId);

      // Upsert provider_profile
      await supabase.from("provider_profile").upsert({
        provider_id: providerId,
        description: editProfile.description,
        years_experience: parseInt(editProfile.yearsExperience) || 0,
        certifications: editProfile.certifications,
        website: editProfile.website,
        address: editProfile.address,
      }, { onConflict: "provider_id" });

      // Update services - delete existing then insert new
      await supabase.from("provider_services").delete().eq("provider_id", providerId);
      if (editProfile.services.length > 0) {
        await supabase.from("provider_services").insert(
          editProfile.services.map((s) => ({ provider_id: providerId, service_name: s }))
        );
      }

      setProfile({ ...editProfile });
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveError("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof ProviderProfileData, value: string) => {
    setEditProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setEditProfile({ ...profile });
    setIsEditing(false);
    setSaveError("");
  };

  const handleAddService = () => {
    if (newService.trim() && !editProfile.services.includes(newService.trim())) {
      setEditProfile((prev) => ({ ...prev, services: [...prev.services, newService.trim()] }));
      setNewService("");
    }
  };

  const handleRemoveService = (index: number) => {
    setEditProfile((prev) => ({ ...prev, services: prev.services.filter((_, i) => i !== index) }));
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !providerId) return;
    try {
      const ext = file.name.split(".").pop();
      const path = `${providerId}/profile/photo.${ext}`;
      const { error: uploadError } = await supabase.storage.from("provider-media").upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("provider-media").getPublicUrl(path);

      await supabase.from("provider_media").upsert({
        provider_id: providerId,
        type: "profile",
        file_url: publicUrl,
      }, { onConflict: "provider_id,type" });

      setEditProfile((prev) => ({ ...prev, profilePhotoUrl: publicUrl }));
      if (!isEditing) setProfile((prev) => ({ ...prev, profilePhotoUrl: publicUrl }));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !providerId) return;
    for (const file of Array.from(files)) {
      try {
        const path = `${providerId}/portfolio/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage.from("provider-media").upload(path, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from("provider-media").getPublicUrl(path);
        await supabase.from("provider_media").insert({ provider_id: providerId, type: "portfolio", file_url: publicUrl });
        setEditProfile((prev) => ({ ...prev, galleryImages: [...prev.galleryImages, publicUrl] }));
        if (!isEditing) setProfile((prev) => ({ ...prev, galleryImages: [...prev.galleryImages, publicUrl] }));
      } catch (error) {
        console.error("Error uploading gallery image:", error);
      }
    }
  };

  const handleRemoveGalleryImage = async (index: number, url: string) => {
    try {
      await supabase.from("provider_media").delete().eq("file_url", url);
      setEditProfile((prev) => ({ ...prev, galleryImages: prev.galleryImages.filter((_, i) => i !== index) }));
      setProfile((prev) => ({ ...prev, galleryImages: prev.galleryImages.filter((_, i) => i !== index) }));
    } catch (error) {
      console.error("Error removing image:", error);
    }
  };

  const displayProfile = isEditing ? editProfile : profile;

  const getStatusColors = (status: string) => {
    if (status === "active") return { bg: "#dcfce7", color: "#15803d", darkBg: "rgba(21,128,61,0.2)", darkColor: "#4ade80" };
    if (status === "suspended") return { bg: "#fee2e2", color: "#dc2626", darkBg: "rgba(220,38,38,0.2)", darkColor: "#f87171" };
    return { bg: "#fef7e0", color: "#8f5d00", darkBg: "rgba(143,93,0,0.2)", darkColor: "#fcd34d" };
  };

  const statusColors = getStatusColors(profile.status);

  return (
    <>
      <style>{`
        .provider-profile {
          padding: 24px 28px;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
        }

        /* ===== HEADER CARD ===== */
        .profile-header-card {
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 24px;
        }

        .profile-hero {
          background: linear-gradient(135deg, #FF6B35 0%, #E85A28 100%);
          padding: 32px 28px;
          color: #fff;
          position: relative;
          display: flex;
          align-items: flex-end;
          gap: 24px;
        }

        .profile-avatar-wrap { position: relative; }

        .profile-avatar {
          width: 88px;
          height: 88px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 34px;
          font-weight: 800;
          border: 3px solid rgba(255, 255, 255, 0.35);
          overflow: hidden;
          flex-shrink: 0;
        }

        .profile-avatar img { width: 100%; height: 100%; object-fit: cover; }

        .upload-avatar-btn {
          position: absolute;
          bottom: -6px;
          right: -6px;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #fff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #FF6B35;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          transition: transform 0.2s;
        }

        .upload-avatar-btn:hover { transform: scale(1.1); }

        .profile-hero-info { flex: 1; }

        .profile-name {
          font-size: 26px;
          font-weight: 800;
          margin-bottom: 4px;
          letter-spacing: -0.5px;
        }

        .profile-business {
          font-size: 15px;
          opacity: 0.9;
          margin-bottom: 10px;
        }

        .profile-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: rgba(255,255,255,0.25);
          backdrop-filter: blur(10px);
          color: #fff;
        }

        .profile-hero-actions {
          position: absolute;
          top: 24px;
          right: 24px;
          display: flex;
          gap: 10px;
        }

        .hero-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .hero-btn.secondary {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          color: #fff;
          border: 1.5px solid rgba(255,255,255,0.3);
        }

        .hero-btn.secondary:hover { background: rgba(255,255,255,0.3); }

        .hero-btn.primary {
          background: #fff;
          color: #FF6B35;
        }

        .hero-btn.primary:hover { background: #f9fafb; }

        .hero-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Stats Row */
        .profile-stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          padding: 20px 28px;
          border-top: 1.5px solid var(--border-color);
          gap: 20px;
        }

        .stat-box { text-align: center; }

        .stat-number {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.5px;
          margin-bottom: 4px;
        }

        .stat-name { font-size: 12px; color: var(--text-secondary); font-weight: 500; }

        /* Content Grid */
        .profile-content-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 24px;
        }

        .profile-card {
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 20px;
          transition: border-color 0.3s ease;
        }

        .profile-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 24px;
          border-bottom: 1.5px solid var(--border-color);
        }

        .section-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--orange-light-bg);
          color: var(--orange-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .section-title { font-size: 15px; font-weight: 700; color: var(--text-primary); }

        .profile-card-body { padding: 24px; }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

        .form-field { display: flex; flex-direction: column; gap: 6px; }

        .form-field.full-width { grid-column: 1 / -1; }

        .field-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .field-input {
          padding: 11px 14px;
          border: 1.5px solid var(--input-border);
          border-radius: 10px;
          font-size: 14px;
          font-family: inherit;
          background: var(--input-bg);
          color: var(--text-primary);
          transition: all 0.2s ease;
          outline: none;
        }

        .field-input:focus {
          border-color: var(--orange-primary);
          box-shadow: 0 0 0 3px var(--orange-shadow);
        }

        .field-input:disabled {
          background: var(--disabled-bg);
          color: var(--text-primary);
          cursor: default;
          border-color: transparent;
        }

        .field-textarea {
          min-height: 100px;
          resize: vertical;
          line-height: 1.6;
        }

        /* Services */
        .services-display { display: flex; flex-wrap: wrap; gap: 8px; }

        .service-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: var(--orange-light-bg);
          color: var(--orange-primary);
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          border: 1px solid rgba(255, 107, 53, 0.2);
        }

        .remove-service-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--orange-primary);
          display: flex;
          padding: 0;
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .remove-service-btn:hover { opacity: 1; }

        .add-service-row { display: flex; gap: 8px; margin-top: 12px; }

        .service-input {
          flex: 1;
          padding: 9px 12px;
          border: 1.5px solid var(--input-border);
          border-radius: 8px;
          font-size: 13px;
          background: var(--input-bg);
          color: var(--text-primary);
          font-family: inherit;
          outline: none;
          transition: all 0.2s;
        }

        .service-input:focus { border-color: var(--orange-primary); }

        .add-service-btn {
          padding: 9px 14px;
          background: var(--orange-primary);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .add-service-btn:hover { filter: brightness(1.1); }

        /* Image Cards */
        .image-card {
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .image-card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }

        .image-card-title { font-size: 14px; font-weight: 700; color: var(--text-primary); }

        .image-card-desc { font-size: 12px; color: var(--text-secondary); margin-bottom: 16px; }

        .provider-image-preview {
          width: 100%;
          height: 180px;
          border-radius: 12px;
          overflow: hidden;
          background: var(--hover-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          margin-bottom: 12px;
          border: 1.5px dashed var(--border-color);
        }

        .provider-image-preview img { width: 100%; height: 100%; object-fit: cover; }

        .image-placeholder { display: flex; flex-direction: column; align-items: center; gap: 8px; color: var(--text-tertiary); }

        .image-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: none;
          align-items: center;
          justify-content: center;
        }

        .provider-image-preview:hover .image-overlay { display: flex; }

        .remove-image-btn {
          background: rgba(255,255,255,0.9);
          border: none;
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          color: #dc2626;
          display: flex;
          align-items: center;
          transition: background 0.2s;
        }

        .remove-image-btn:hover { background: #fff; }

        .upload-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          border: 1.5px solid var(--border-color);
          border-radius: 10px;
          background: var(--card-bg);
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .upload-btn:hover { border-color: var(--orange-primary); color: var(--orange-primary); }
        .upload-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }

        .gallery-item {
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          background: var(--hover-bg);
        }

        .gallery-item img { width: 100%; height: 100%; object-fit: cover; }

        .gallery-item:hover .image-overlay { display: flex; }

        .gallery-empty {
          grid-column: 1 / -1;
          padding: 24px;
          text-align: center;
          color: var(--text-tertiary);
          font-size: 13px;
          border: 1.5px dashed var(--border-color);
          border-radius: 10px;
        }

        .gallery-count { margin-top: 8px; font-size: 12px; color: var(--text-secondary); text-align: center; }

        /* Alerts */
        .save-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 20px;
          animation: fadeIn 0.2s ease;
        }

        .save-alert.success { background: #dcfce7; color: #15803d; border: 1.5px solid #86efac; }
        .save-alert.error { background: #fee2e2; color: #dc2626; border: 1.5px solid #fca5a5; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }

        .file-input-hidden { display: none; }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1200px) {
          .profile-content-grid { grid-template-columns: 1fr; }
          .profile-stats-row { grid-template-columns: repeat(4, 1fr); }
        }

        @media (max-width: 768px) {
          .provider-profile { padding: 16px; }
          .profile-hero { flex-direction: column; align-items: flex-start; padding: 20px 20px 72px; }
          .profile-hero-actions { top: auto; bottom: 16px; right: 20px; }
          .form-grid { grid-template-columns: 1fr; gap: 14px; }
          .profile-stats-row { grid-template-columns: repeat(2, 1fr); padding: 16px 20px; gap: 12px; }
          .profile-card-body { padding: 16px; }
          .profile-card-header { padding: 14px 16px; }
          .hero-btn { padding: 8px 14px; font-size: 13px; }
          .image-card { padding: 16px; }
          .gallery-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 480px) {
          .provider-profile { padding: 12px; }
          .profile-name { font-size: 20px; }
          .profile-stats-row { grid-template-columns: repeat(2, 1fr); }
          .profile-hero-actions { flex-direction: column; gap: 6px; }
          .hero-btn { font-size: 12px; padding: 7px 12px; }
          .gallery-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="provider-profile">
        <PageHeader title="My Profile" subtitle="Manage your provider profile and settings" icon={User} />

        {saveSuccess && (
          <div className="save-alert success">
            <CheckCircle size={16} strokeWidth={2.5} />
            Profile updated successfully! Changes are pending admin review.
          </div>
        )}
        {saveError && (
          <div className="save-alert error">
            <AlertCircle size={16} strokeWidth={2.5} />
            {saveError}
          </div>
        )}

        {/* Profile Hero */}
        <div className="profile-header-card">
          <div className="profile-hero">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar">
                {displayProfile.profilePhotoUrl ? (
                  <img src={displayProfile.profilePhotoUrl} alt="Profile" />
                ) : (
                  displayProfile.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "PR"
                )}
              </div>
              <input type="file" id="profilePhoto" className="file-input-hidden" accept="image/*" onChange={handleProfileImageUpload} />
              <button className="upload-avatar-btn" onClick={() => document.getElementById("profilePhoto")?.click()} title="Change photo">
                <Upload size={14} />
              </button>
            </div>

            <div className="profile-hero-info">
              <div className="profile-name">{profile.fullName || "Your Name"}</div>
              <div className="profile-business">{profile.businessName || "Your Business"} • {profile.category}</div>
              <div className="profile-status-badge">
                <CheckCircle size={12} />
                {profile.status || "Active"}
              </div>
            </div>

            <div className="profile-hero-actions">
              {isEditing ? (
                <>
                  <button className="hero-btn secondary" onClick={handleCancel} disabled={isSaving}>
                    <X size={16} />
                    Cancel
                  </button>
                  <button className="hero-btn primary" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              ) : (
                <button className="hero-btn secondary" onClick={() => setIsEditing(true)}>
                  <Edit2 size={16} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="profile-stats-row">
            <div className="stat-box">
              <div className="stat-number">{profile.yearsExperience || "—"}</div>
              <div className="stat-name">Years Experience</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{profile.services.length}</div>
              <div className="stat-name">Services</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{profile.city || "—"}</div>
              <div className="stat-name">City</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{profile.galleryImages.length}</div>
              <div className="stat-name">Gallery Photos</div>
            </div>
          </div>
        </div>

        <div className="profile-content-grid">
          {/* Left Column */}
          <div>
            {/* Personal Info */}
            <div className="profile-card">
              <div className="profile-card-header">
                <div className="section-icon"><User size={18} /></div>
                <div className="section-title">Personal Information</div>
              </div>
              <div className="profile-card-body">
                <div className="form-grid">
                  {[
                    { label: "Full Name", field: "fullName" as const, icon: <User size={12} />, type: "text" },
                    { label: "Email Address", field: "email" as const, icon: <Mail size={12} />, type: "email", disabled: true },
                    { label: "Phone Number", field: "phone" as const, icon: <Phone size={12} />, type: "tel" },
                    { label: "City", field: "city" as const, icon: <MapPin size={12} />, type: "text" },
                    { label: "Address", field: "address" as const, icon: <MapPin size={12} />, type: "text", fullWidth: true },
                  ].map(({ label, field, icon, type, disabled, fullWidth }) => (
                    <div key={field} className={`form-field ${fullWidth ? "full-width" : ""}`}>
                      <label className="field-label">{icon}{label}</label>
                      <input
                        type={type}
                        className="field-input"
                        value={displayProfile[field] as string}
                        onChange={(e) => handleChange(field, e.target.value)}
                        disabled={!isEditing || disabled}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Business Info */}
            <div className="profile-card">
              <div className="profile-card-header">
                <div className="section-icon"><Briefcase size={18} /></div>
                <div className="section-title">Business Information</div>
              </div>
              <div className="profile-card-body">
                <div className="form-grid">
                  <div className="form-field">
                    <label className="field-label"><Briefcase size={12} />Business Name</label>
                    <input type="text" className="field-input" value={displayProfile.businessName} onChange={(e) => handleChange("businessName", e.target.value)} disabled={!isEditing} />
                  </div>
                  <div className="form-field">
                    <label className="field-label"><Briefcase size={12} />Service Category</label>
                    <input type="text" className="field-input" value={displayProfile.category} onChange={(e) => handleChange("category", e.target.value)} disabled={!isEditing} />
                  </div>
                  <div className="form-field">
                    <label className="field-label"><Clock size={12} />Years of Experience</label>
                    <input type="number" className="field-input" value={displayProfile.yearsExperience} onChange={(e) => handleChange("yearsExperience", e.target.value)} disabled={!isEditing} min="0" />
                  </div>
                  <div className="form-field">
                    <label className="field-label"><Globe size={12} />Website</label>
                    <input type="url" className="field-input" value={displayProfile.website} onChange={(e) => handleChange("website", e.target.value)} disabled={!isEditing} placeholder="https://..." />
                  </div>
                  <div className="form-field full-width">
                    <label className="field-label"><FileText size={12} />Business Description</label>
                    <textarea className="field-input field-textarea" value={displayProfile.description} onChange={(e) => handleChange("description", e.target.value)} disabled={!isEditing} />
                  </div>
                  <div className="form-field full-width">
                    <label className="field-label"><Award size={12} />Certifications & Licenses</label>
                    <textarea className="field-input field-textarea" value={displayProfile.certifications} onChange={(e) => handleChange("certifications", e.target.value)} disabled={!isEditing} />
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="profile-card">
              <div className="profile-card-header">
                <div className="section-icon"><Star size={18} /></div>
                <div className="section-title">Services Offered</div>
              </div>
              <div className="profile-card-body">
                <div className="services-display">
                  {displayProfile.services.length === 0 && (
                    <p style={{ color: "var(--text-tertiary)", fontSize: 13 }}>No services added yet</p>
                  )}
                  {displayProfile.services.map((service, i) => (
                    <div key={i} className="service-tag">
                      {service}
                      {isEditing && (
                        <button className="remove-service-btn" onClick={() => handleRemoveService(i)}>
                          <X size={13} strokeWidth={2.5} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {isEditing && (
                  <div className="add-service-row">
                    <input
                      type="text"
                      className="service-input"
                      placeholder="Add a service..."
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddService()}
                    />
                    <button className="add-service-btn" onClick={handleAddService}>Add</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Images */}
          <div>
            {/* Profile Photo */}
            <div className="image-card">
              <div className="image-card-header">
                <div className="section-icon"><User size={16} /></div>
                <div className="image-card-title">Profile Photo</div>
              </div>
              <p className="image-card-desc">Upload a professional photo for your public profile.</p>

              <div className="provider-image-preview">
                {displayProfile.profilePhotoUrl ? (
                  <>
                    <img src={displayProfile.profilePhotoUrl} alt="Provider" />
                    <div className="image-overlay">
                      <button className="remove-image-btn" onClick={() => handleChange("profilePhotoUrl", "")} title="Remove">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="image-placeholder">
                    <ImageIcon size={40} strokeWidth={1.5} />
                    <span style={{ fontSize: 12 }}>No image uploaded</span>
                  </div>
                )}
              </div>

              <input type="file" id="providerImage" className="file-input-hidden" accept="image/*" onChange={handleProfileImageUpload} />
              <button className="upload-btn" onClick={() => document.getElementById("providerImage")?.click()}>
                <Upload size={15} />
                {displayProfile.profilePhotoUrl ? "Change Photo" : "Upload Photo"}
              </button>
            </div>

            {/* Gallery */}
            <div className="image-card">
              <div className="image-card-header">
                <div className="section-icon"><ImageIcon size={16} /></div>
                <div className="image-card-title">Work Gallery</div>
              </div>
              <p className="image-card-desc">Showcase your best work with up to 10 photos.</p>

              <input type="file" id="galleryImages" className="file-input-hidden" accept="image/*" multiple onChange={handleGalleryUpload} />
              <button
                className="upload-btn"
                onClick={() => document.getElementById("galleryImages")?.click()}
                disabled={displayProfile.galleryImages.length >= 10}
                style={{ marginBottom: 16 }}
              >
                <Upload size={15} />
                Add Photos ({displayProfile.galleryImages.length}/10)
              </button>

              <div className="gallery-grid">
                {displayProfile.galleryImages.length === 0 ? (
                  <div className="gallery-empty">
                    <div style={{ fontSize: 28, marginBottom: 8 }}>🖼️</div>
                    <div>No photos yet</div>
                  </div>
                ) : (
                  displayProfile.galleryImages.map((img, i) => (
                    <div key={i} className="gallery-item">
                      <img src={img} alt={`Gallery ${i + 1}`} />
                      <div className="image-overlay">
                        <button className="remove-image-btn" onClick={() => handleRemoveGalleryImage(i, img)}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {displayProfile.galleryImages.length > 0 && (
                <p className="gallery-count">{displayProfile.galleryImages.length} of 10 photos</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProviderProfile;
