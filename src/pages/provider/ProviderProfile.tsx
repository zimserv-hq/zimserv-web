// src/pages/provider/ProviderProfile.tsx
import { useState, useEffect, useRef } from "react";
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

interface ServiceItem {
  name: string;
  price: string; // "50.00"
}

interface GalleryImage {
  id: string;
  filePath: string;
  publicUrl: string;
}

interface ProviderProfileData {
  fullName: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  city: string;
  businessName: string;
  category: string;
  yearsExperience: string;
  description: string;
  services: ServiceItem[];
  website: string;
  certifications: string;
  profilePhotoUrl: string | null;
  galleryImages: GalleryImage[];
  status: string;
  avgRating: number;
  totalReviews: number;
  totalJobsCompleted: number;
  verificationLevel: string;
}

type FormField = {
  label: string;
  field: keyof ProviderProfileData;
  icon: React.ReactNode;
  type: string;
  disabled?: boolean;
  fullWidth?: boolean;
};

// ── Skeleton Components ────────────────────────────────────────────────────
const SkeletonBlock = ({
  w,
  h,
  radius = 6,
}: {
  w: string | number;
  h: number;
  radius?: number;
}) => (
  <div
    className="sk-block"
    style={{ width: w, height: h, borderRadius: radius }}
  />
);

const ProfileSkeleton = () => (
  <div className="provider-profile">
    <style>{`
      @keyframes sk-shimmer {
        0%   { background-position: -600px 0; }
        100% { background-position:  600px 0; }
      }
      .sk-block {
        background: linear-gradient(90deg, var(--sk-base) 25%, var(--sk-hi) 50%, var(--sk-base) 75%);
        background-size: 600px 100%;
        animation: sk-shimmer 1.6s ease-in-out infinite;
        display: block;
      }
      :root { --sk-base: #f0f0f0; --sk-hi: #e0e0e0; }
      .dark-mode { --sk-base: #374151; --sk-hi: #4b5563; }
    `}</style>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 24,
      }}
    >
      <SkeletonBlock w={40} h={40} radius={10} />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <SkeletonBlock w={120} h={20} />
        <SkeletonBlock w={220} h={13} />
      </div>
    </div>

    <div className="profile-header-card" style={{ marginBottom: 24 }}>
      <div className="profile-hero">
        <SkeletonBlock w={88} h={88} radius={16} />
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}
        >
          <SkeletonBlock w={200} h={24} />
          <SkeletonBlock w={260} h={14} />
          <SkeletonBlock w={80} h={26} radius={20} />
        </div>
        <SkeletonBlock w={130} h={42} radius={12} />
      </div>

      <div className="profile-stats-row">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="stat-box"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <SkeletonBlock w={44} h={26} />
            <SkeletonBlock w={72} h={12} />
          </div>
        ))}
      </div>
    </div>

    <div className="profile-content-grid">
      <div>
        <div className="profile-card" style={{ marginBottom: 20 }}>
          <div className="profile-card-header">
            <SkeletonBlock w={36} h={36} radius={10} />
            <SkeletonBlock w={180} h={15} />
          </div>
          <div className="profile-card-body">
            <div className="form-grid">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="form-field">
                  <SkeletonBlock w={90} h={11} />
                  <SkeletonBlock w="100%" h={44} radius={10} />
                </div>
              ))}
              <div className="form-field full-width">
                <SkeletonBlock w={40} h={11} />
                <SkeletonBlock w="100%" h={44} radius={10} />
              </div>
            </div>
          </div>
        </div>

        <div className="profile-card" style={{ marginBottom: 20 }}>
          <div className="profile-card-header">
            <SkeletonBlock w={36} h={36} radius={10} />
            <SkeletonBlock w={200} h={15} />
          </div>
          <div className="profile-card-body">
            <div className="form-grid">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="form-field">
                  <SkeletonBlock w={100} h={11} />
                  <SkeletonBlock w="100%" h={44} radius={10} />
                </div>
              ))}
              <div className="form-field full-width">
                <SkeletonBlock w={170} h={11} />
                <SkeletonBlock w="100%" h={100} radius={10} />
              </div>
              <div className="form-field full-width">
                <SkeletonBlock w={130} h={11} />
                <SkeletonBlock w="100%" h={44} radius={10} />
              </div>
            </div>
          </div>
        </div>

        <div className="profile-card" style={{ marginBottom: 20 }}>
          <div className="profile-card-header">
            <SkeletonBlock w={36} h={36} radius={10} />
            <SkeletonBlock w={150} h={15} />
          </div>
          <div className="profile-card-body">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[80, 110, 95, 130, 75].map((w, j) => (
                <SkeletonBlock key={j} w={w} h={32} radius={8} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="photo-card" style={{ marginBottom: 20 }}>
          <div className="photo-card-header">
            <SkeletonBlock w={36} h={36} radius={10} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <SkeletonBlock w={110} h={14} />
              <SkeletonBlock w={180} h={12} />
            </div>
          </div>
          <div className="photo-card-body">
            <div className="photo-avatar-area">
              <SkeletonBlock w={120} h={120} radius={20} />
              <div style={{ display: "flex", gap: 8, width: "100%" }}>
                <SkeletonBlock w="100%" h={42} radius={10} />
                <SkeletonBlock w="100%" h={42} radius={10} />
              </div>
            </div>
          </div>
        </div>

        <div className="photo-card">
          <div className="photo-card-header">
            <SkeletonBlock w={36} h={36} radius={10} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <SkeletonBlock w={100} h={14} />
              <SkeletonBlock w={160} h={12} />
            </div>
          </div>
          <div className="photo-card-body" style={{ paddingTop: 16 }}>
            <SkeletonBlock w="100%" h={42} radius={10} />
            <div className="gallery-grid" style={{ marginTop: 16 }}>
              {[...Array(3)].map((_, j) => (
                <SkeletonBlock key={j} w="100%" h={100} radius={8} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

const ProviderProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [providerId, setProviderId] = useState<string | null>(null);
  const [newService, setNewService] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");

  const profileImageInputRef = useRef<HTMLInputElement>(null);

  const emptyProfile: ProviderProfileData = {
    fullName: "",
    email: "",
    phone: "",
    whatsappNumber: "",
    city: "",
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
    avgRating: 0,
    totalReviews: 0,
    totalJobsCompleted: 0,
    verificationLevel: "Basic",
  };

  const [profile, setProfile] = useState<ProviderProfileData>(emptyProfile);
  const [editProfile, setEditProfile] =
    useState<ProviderProfileData>(emptyProfile);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!providerId) return;

    const channel = supabase
      .channel(`provider-profile-${providerId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "providers",
          filter: `id=eq.${providerId}`,
        },
        (payload) => {
          const updated = payload.new;
          setProfile((prev) => ({
            ...prev,
            fullName: updated.full_name ?? prev.fullName,
            email: updated.email ?? prev.email,
            phone: updated.phone_number ?? prev.phone,
            whatsappNumber: updated.whatsapp_number ?? prev.whatsappNumber,
            city: updated.city ?? prev.city,
            businessName: updated.business_name ?? prev.businessName,
            yearsExperience:
              updated.years_experience?.toString() ?? prev.yearsExperience,
            description: updated.bio ?? prev.description,
            website: updated.website ?? prev.website,
            avgRating: Number(updated.avg_rating) || prev.avgRating,
            totalReviews: updated.total_reviews ?? prev.totalReviews,
            totalJobsCompleted:
              updated.total_jobs_completed ?? prev.totalJobsCompleted,
            verificationLevel:
              updated.verification_level ?? prev.verificationLevel,
            status: updated.status ?? prev.status,
            profilePhotoUrl: updated.profile_image_url ?? prev.profilePhotoUrl,
          }));
          if (!isEditing) {
            setEditProfile((prev) => ({
              ...prev,
              fullName: updated.full_name ?? prev.fullName,
              email: updated.email ?? prev.email,
              phone: updated.phone_number ?? prev.phone,
              whatsappNumber: updated.whatsapp_number ?? prev.whatsappNumber,
              city: updated.city ?? prev.city,
              businessName: updated.business_name ?? prev.businessName,
              yearsExperience:
                updated.years_experience?.toString() ?? prev.yearsExperience,
              description: updated.bio ?? prev.description,
              website: updated.website ?? prev.website,
              status: updated.status ?? prev.status,
              profilePhotoUrl:
                updated.profile_image_url ?? prev.profilePhotoUrl,
            }));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [providerId, isEditing]);

  const getPublicUrl = (filePath: string): string => {
    const { data } = supabase.storage
      .from("provider-media")
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Not authenticated");

      const { data: provider, error: providerError } = await supabase
        .from("providers")
        .select(
          `id, full_name, email, phone_number, whatsapp_number, city,
           business_name, primary_category, bio, years_experience, website,
           status, avg_rating, total_reviews, total_jobs_completed,
           verification_level, profile_image_url`,
        )
        .eq("user_id", user.id)
        .single();

      if (providerError || !provider) {
        console.error("Provider not found:", providerError);
        setLoading(false);
        return;
      }

      setProviderId(provider.id);

      const { data: servicesData } = await supabase
        .from("provider_services")
        .select("service_name, price")
        .eq("provider_id", provider.id);

      const { data: mediaData } = await supabase
        .from("provider_media")
        .select("id, media_type, file_path")
        .eq("provider_id", provider.id);

      const profileMediaItem = mediaData?.find(
        (m) => m.media_type === "profile",
      );
      const profilePhotoUrl: string | null =
        provider.profile_image_url ??
        (profileMediaItem ? getPublicUrl(profileMediaItem.file_path) : null);

      const galleryImages: GalleryImage[] = (mediaData ?? [])
        .filter((m) => m.media_type === "portfolio")
        .map((m) => ({
          id: m.id,
          filePath: m.file_path,
          publicUrl: getPublicUrl(m.file_path),
        }));

      const profileObj: ProviderProfileData = {
        fullName: provider.full_name || "",
        email: provider.email || user.email || "",
        phone: provider.phone_number || "",
        whatsappNumber: provider.whatsapp_number || "",
        city: provider.city || "",
        businessName: provider.business_name || "",
        category: provider.primary_category || "",
        yearsExperience: provider.years_experience?.toString() || "",
        description: provider.bio || "",
        services:
          servicesData?.map((s) => ({
            name: s.service_name,
            price: s.price?.toString() || "",
          })) || [],
        website: provider.website || "",
        certifications: "",
        profilePhotoUrl,
        galleryImages,
        status: provider.status || "",
        avgRating: Number(provider.avg_rating) || 0,
        totalReviews: provider.total_reviews || 0,
        totalJobsCompleted: provider.total_jobs_completed || 0,
        verificationLevel: provider.verification_level || "Basic",
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
      const changedFields: Record<string, any> = {};
      if (editProfile.description !== profile.description)
        changedFields.bio = editProfile.description;
      if (editProfile.website !== profile.website)
        changedFields.website = editProfile.website || null;
      if (editProfile.yearsExperience !== profile.yearsExperience)
        changedFields.years_experience = editProfile.yearsExperience
          ? parseInt(editProfile.yearsExperience, 10)
          : null;
      if (editProfile.fullName !== profile.fullName)
        changedFields.full_name = editProfile.fullName;
      if (editProfile.businessName !== profile.businessName)
        changedFields.business_name = editProfile.businessName;
      if (editProfile.phone !== profile.phone)
        changedFields.phone_number = editProfile.phone;
      if (editProfile.whatsappNumber !== profile.whatsappNumber)
        changedFields.whatsapp_number = editProfile.whatsappNumber;
      if (editProfile.city !== profile.city)
        changedFields.city = editProfile.city;
      if (editProfile.email !== profile.email)
        changedFields.email = editProfile.email;

      const originalServices = profile.services || [];
      const editedServices = editProfile.services || [];
      const servicesChanged =
        originalServices.length !== editedServices.length ||
        originalServices.some((orig, i) => {
          const edited = editedServices[i];
          return (
            !edited || orig.name !== edited.name || orig.price !== edited.price
          );
        });

      if (Object.keys(changedFields).length === 0 && !servicesChanged) {
        setIsEditing(false);
        setIsSaving(false);
        return;
      }

      if (servicesChanged) {
        const { error: deleteError } = await supabase
          .from("provider_services")
          .delete()
          .eq("provider_id", providerId);
        if (deleteError) throw deleteError;

        if (editedServices.length > 0) {
          const { error: servicesError } = await supabase
            .from("provider_services")
            .insert(
              editedServices.map((s) => ({
                provider_id: providerId,
                service_name: s.name,
                price: s.price ? parseFloat(s.price) : null,
              })),
            );
          if (servicesError) throw servicesError;
        }
      }

      if (Object.keys(changedFields).length > 0) {
        const { error: insertError } = await supabase
          .from("provider_edit_requests")
          .insert({
            provider_id: providerId,
            edit_type: "profile_update",
            pending_review_fields: changedFields,
            auto_approved_fields: {},
          });
        if (insertError) throw insertError;
      }

      setProfile({
        ...editProfile,
        phone: editProfile.phone,
        whatsappNumber: editProfile.whatsappNumber,
        city: editProfile.city,
        email: editProfile.email,
      });
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
    if (
      newService.trim() &&
      newServicePrice.trim() &&
      !editProfile.services.some(
        (s) => s.name.toLowerCase() === newService.trim().toLowerCase(),
      )
    ) {
      setEditProfile((prev) => ({
        ...prev,
        services: [
          ...prev.services,
          { name: newService.trim(), price: newServicePrice.trim() },
        ],
      }));
      setNewService("");
      setNewServicePrice("");
    }
  };

  const handleRemoveService = (index: number) => {
    setEditProfile((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  const handleProfileImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file || !providerId) return;

    e.target.value = "";

    setIsUploadingPhoto(true);
    try {
      const ext = file.name.split(".").pop();
      const filePath = `${providerId}/profile/photo_${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("provider-media")
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const publicUrl = `${getPublicUrl(filePath)}?t=${Date.now()}`;

      await supabase.from("provider_media").upsert(
        {
          provider_id: providerId,
          media_type: "profile",
          file_path: filePath,
          is_verified: false,
        },
        { onConflict: "provider_id,media_type" },
      );

      await supabase
        .from("providers")
        .update({ profile_image_url: publicUrl })
        .eq("id", providerId);

      setProfile((prev) => ({ ...prev, profilePhotoUrl: publicUrl }));
      setEditProfile((prev) => ({ ...prev, profilePhotoUrl: publicUrl }));
    } catch (error) {
      console.error("Error uploading profile image:", error);
      setSaveError("Failed to upload image. Please try again.");
      setTimeout(() => setSaveError(""), 3000);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleDeleteProfilePhoto = async () => {
    if (!providerId || !profile.profilePhotoUrl) return;
    try {
      await supabase
        .from("provider_media")
        .delete()
        .eq("provider_id", providerId)
        .eq("media_type", "profile");
      await supabase
        .from("providers")
        .update({ profile_image_url: null })
        .eq("id", providerId);
      setProfile((prev) => ({ ...prev, profilePhotoUrl: null }));
      setEditProfile((prev) => ({ ...prev, profilePhotoUrl: null }));
    } catch (error) {
      console.error("Error deleting profile photo:", error);
    }
  };

  const handleGalleryUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || !providerId) return;
    e.target.value = "";

    for (const file of Array.from(files)) {
      try {
        const filePath = `${providerId}/portfolio/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("provider-media")
          .upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: inserted, error: insertError } = await supabase
          .from("provider_media")
          .insert({
            provider_id: providerId,
            media_type: "portfolio",
            file_path: filePath,
            is_verified: false,
          })
          .select("id")
          .single();
        if (insertError) throw insertError;

        const newImage: GalleryImage = {
          id: inserted.id,
          filePath,
          publicUrl: getPublicUrl(filePath),
        };

        setEditProfile((prev) => ({
          ...prev,
          galleryImages: [...prev.galleryImages, newImage],
        }));
        setProfile((prev) => ({
          ...prev,
          galleryImages: [...prev.galleryImages, newImage],
        }));
      } catch (error) {
        console.error("Error uploading gallery image:", error);
      }
    }
  };

  const handleRemoveGalleryImage = async (image: GalleryImage) => {
    try {
      await supabase.storage.from("provider-media").remove([image.filePath]);
      await supabase.from("provider_media").delete().eq("id", image.id);
      const filter = (prev: ProviderProfileData) => ({
        ...prev,
        galleryImages: prev.galleryImages.filter((g) => g.id !== image.id),
      });
      setEditProfile(filter);
      setProfile(filter);
    } catch (error) {
      console.error("Error removing gallery image:", error);
    }
  };

  const displayProfile = isEditing ? editProfile : profile;

  if (loading) return <ProfileSkeleton />;

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        /* ── CSS Variables (matching AdminLayout) ── */
        :root {
          --bg-primary: #f8f9fa;
          --text-primary: #111827;
          --text-secondary: #6b7280;
          --text-tertiary: #9ca3af;
          --card-bg: #ffffff;
          --border-color: #e5e7eb;
          --border-hover: #d1d5db;
          --hover-bg: #f3f4f6;
          --input-bg: #f9fafb;
          --input-border: #e5e7eb;
          --disabled-bg: #f3f4f6;
          --orange-primary: #FF6B35;
          --orange-hover: #E85A28;
          --orange-light: #FFF4ED;
          --orange-shadow: rgba(255,107,53,0.18);
          --sk-base: #f0f0f0;
          --sk-hi: #e0e0e0;
        }

        .dark-mode {
          --bg-primary: #111827;
          --text-primary: #f9fafb;
          --text-secondary: #d1d5db;
          --text-tertiary: #9ca3af;
          --card-bg: #1f2937;
          --border-color: #374151;
          --border-hover: #4b5563;
          --hover-bg: #374151;
          --input-bg: #374151;
          --input-border: #4b5563;
          --disabled-bg: #374151;
          --orange-primary: #FF8A5B;
          --orange-hover: #FF6B35;
          --orange-light: rgba(255,107,53,0.15);
          --orange-shadow: rgba(255,138,91,0.2);
          --sk-base: #374151;
          --sk-hi: #4b5563;
        }

        /* ── Skeleton ── */
        @keyframes sk-shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        .sk-block {
          background: linear-gradient(90deg, var(--sk-base) 25%, var(--sk-hi) 50%, var(--sk-base) 75%);
          background-size: 600px 100%;
          animation: sk-shimmer 1.6s ease-in-out infinite;
          display: block;
        }

        /* ── Page ── */
        .provider-profile {
          padding: 24px 28px;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
          min-width: 0;
        }

        /* ── Header Card ── */
        .profile-header-card {
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        /* ── Hero ── */
        .profile-hero {
          padding: 28px 32px;
          display: flex;
          align-items: center;
          gap: 24px;
          background: var(--card-bg);
          border-bottom: 1.5px solid var(--border-color);
          position: relative;
          min-height: 120px;
        }

        /* Avatar */
        .profile-avatar-wrap { position: relative; flex-shrink: 0; }

        .profile-avatar {
          width: 88px;
          height: 88px;
          border-radius: 16px;
          background: var(--orange-light);
          color: var(--orange-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -1px;
          border: 2px solid var(--border-color);
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }

        .profile-avatar img { width: 100%; height: 100%; object-fit: cover; }

        .upload-avatar-btn {
          position: absolute;
          bottom: -8px;
          right: -8px;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: var(--orange-primary);
          border: 2px solid var(--card-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #fff;
          box-shadow: 0 2px 8px var(--orange-shadow);
          transition: all 0.2s;
        }
        .upload-avatar-btn:hover { background: var(--orange-hover); transform: scale(1.1); }
        .upload-avatar-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .profile-hero-info { flex: 1; min-width: 0; }

        .profile-name {
          font-size: 24px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 4px;
          letter-spacing: -0.5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .profile-business {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 12px;
          font-weight: 500;
        }

        .profile-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: capitalize;
          background: rgba(16,185,129,0.12);
          color: #059669;
          border: 1px solid rgba(16,185,129,0.25);
        }
        .dark-mode .profile-status-badge { color: #4ade80; background: rgba(74,222,128,0.15); border-color: rgba(74,222,128,0.2); }
        .profile-status-badge.suspended { background: rgba(239,68,68,0.1); color: #ef4444; border-color: rgba(239,68,68,0.2); }
        .profile-status-badge.pending   { background: rgba(245,158,11,0.12); color: #d97706; border-color: rgba(245,158,11,0.2); }

        /* Hero action buttons */
        .profile-hero-actions {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
        }

        .hero-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 20px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          border: 1.5px solid;
          background: transparent;
          white-space: nowrap;
        }

        .hero-btn.secondary {
          border-color: var(--border-color);
          color: var(--text-primary);
          background: var(--card-bg);
        }
        .hero-btn.secondary:hover { background: var(--hover-bg); border-color: var(--border-hover); }

        .hero-btn.primary {
          border-color: var(--orange-primary);
          background: var(--orange-primary);
          color: #fff;
          box-shadow: 0 4px 14px var(--orange-shadow);
        }
        .hero-btn.primary:hover { background: var(--orange-hover); border-color: var(--orange-hover); transform: translateY(-1px); }
        .hero-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none !important; }

        /* Stats Row */
        .profile-stats-row {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          padding: 20px 28px;
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
          grid-template-columns: 1fr 360px;
          gap: 24px;
        }

        /* Cards */
        .profile-card {
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          transition: border-color 0.2s;
        }

        .profile-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 18px 24px;
          border-bottom: 1.5px solid var(--border-color);
        }

        .section-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--orange-light);
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
          width: 100%;
        }
        .field-input:focus { border-color: var(--orange-primary); box-shadow: 0 0 0 3px var(--orange-shadow); }
        .field-input:disabled { background: var(--disabled-bg); color: var(--text-secondary); cursor: default; border-color: var(--border-color); }
        .field-textarea { min-height: 100px; resize: vertical; line-height: 1.6; }

        /* Services */
        .services-display {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .service-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          background: var(--orange-light);
          color: var(--orange-primary);
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          border: 1px solid rgba(255,107,53,0.2);
        }

        .service-price-pill {
          font-size: 12px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 999px;
          background: #ffffff;
          color: var(--orange-primary);
          border: 1px solid rgba(255,107,53,0.25);
          white-space: nowrap;
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

        .add-service-row {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

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

        /* price input is narrower */
        .service-price-input {
          max-width: 140px;
          flex: 0 0 auto;
          text-align: right;
        }

        .add-service-btn {
          padding: 9px 16px;
          background: var(--orange-primary);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          white-space: nowrap;
        }
        .add-service-btn:hover { background: var(--orange-hover); }
        .add-service-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ── Photo Card ── */
        .photo-card {
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .photo-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-bottom: 1.5px solid var(--border-color);
        }

        .photo-card-title   { font-size: 14px; font-weight: 700; color: var(--text-primary); }
        .photo-card-subtitle { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }
        .photo-card-body    { padding: 20px; }

        .photo-avatar-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .photo-avatar-frame {
          width: 120px;
          height: 120px;
          border-radius: 20px;
          overflow: hidden;
          border: 2px solid var(--border-color);
          background: var(--hover-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          flex-shrink: 0;
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
          transition: border-color 0.2s;
          cursor: pointer;
        }
        .photo-avatar-frame:hover { border-color: var(--orange-primary); }

        .photo-avatar-frame:hover .photo-upload-overlay { opacity: 1; }
        .photo-upload-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.45);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          opacity: 0;
          transition: opacity 0.2s;
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          border-radius: 18px;
        }

        .photo-avatar-frame img { width: 100%; height: 100%; object-fit: cover; }

        .photo-avatar-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: var(--text-tertiary);
        }
        .photo-avatar-placeholder span { font-size: 11px; font-weight: 500; }

        .photo-actions { display: flex; gap: 8px; width: 100%; }

        .photo-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          border: 1.5px solid transparent;
        }

        .photo-btn.change {
          background: var(--orange-primary);
          color: #fff;
          border-color: var(--orange-primary);
          box-shadow: 0 3px 10px var(--orange-shadow);
        }
        .photo-btn.change:hover { background: var(--orange-hover); border-color: var(--orange-hover); }

        .photo-btn.remove {
          background: var(--card-bg);
          color: #ef4444;
          border-color: #fca5a5;
        }
        .photo-btn.remove:hover { background: #fee2e2; border-color: #ef4444; }
        .photo-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        /* Gallery */
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
          border: 1.5px solid var(--border-color);
        }
        .gallery-item img { width: 100%; height: 100%; object-fit: cover; }
        .gallery-item:hover .image-overlay { display: flex; }

        .image-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.52);
          display: none;
          align-items: center;
          justify-content: center;
        }

        .remove-image-btn {
          background: rgba(255,255,255,0.92);
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
          display: flex; align-items: center; gap: 10px;
          padding: 12px 16px; border-radius: 10px;
          font-size: 13px; font-weight: 500;
          margin-bottom: 20px;
          animation: fadeIn 0.2s ease;
        }
        .save-alert.success { background: #dcfce7; color: #15803d; border: 1.5px solid #86efac; }
        .save-alert.error   { background: #fee2e2; color: #dc2626; border: 1.5px solid #fca5a5; }
        .dark-mode .save-alert.success { background: rgba(74,222,128,0.15); color: #4ade80; border-color: rgba(74,222,128,0.3); }
        .dark-mode .save-alert.error   { background: rgba(239,68,68,0.15);  color: #f87171; border-color: rgba(239,68,68,0.3); }

        @keyframes fadeIn { from { opacity:0; transform: translateY(-4px); } to { opacity:1; transform: translateY(0); } }
        @keyframes spin    { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }

        .file-input-hidden { display: none; }

        /* ── Responsive ── */
        @media (max-width: 1200px) {
          .profile-content-grid { grid-template-columns: 1fr; }
          .profile-stats-row    { grid-template-columns: repeat(5, 1fr); }
        }

        @media (max-width: 768px) {
          .provider-profile    { padding: 16px; }
          .profile-hero        { flex-direction: column; align-items: flex-start; padding: 20px; gap: 16px; }
          .profile-hero-actions { position: static; flex-direction: row; width: 100%; }
          .hero-btn            { flex: 1; justify-content: center; padding: 10px; font-size: 13px; }
          .form-grid           { grid-template-columns: 1fr; gap: 14px; }
          .profile-stats-row   { grid-template-columns: repeat(3, 1fr); padding: 16px 20px; gap: 12px; }
          .profile-card-body   { padding: 16px; }
          .profile-card-header { padding: 14px 16px; }
          .add-service-row     { flex-direction: column; align-items: stretch; }
          .service-price-input { max-width: 100%; }
        }

        @media (max-width: 480px) {
          .provider-profile   { padding: 12px; }
          .profile-name       { font-size: 20px; }
          .profile-stats-row  { grid-template-columns: repeat(2, 1fr); }
          .gallery-grid       { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="provider-profile">
        <PageHeader
          title="My Profile"
          subtitle="Manage your provider profile and settings"
          icon={User}
        />

        {saveSuccess && (
          <div className="save-alert success">
            <CheckCircle size={16} strokeWidth={2.5} />
            Profile updated! Changes requiring review are pending admin
            approval.
          </div>
        )}
        {saveError && (
          <div className="save-alert error">
            <AlertCircle size={16} strokeWidth={2.5} />
            {saveError}
          </div>
        )}

        {/* ── Header Card ── */}
        <div className="profile-header-card">
          <div className="profile-hero">
            {/* Avatar with inline upload overlay */}
            <div className="profile-avatar-wrap">
              <div
                className="profile-avatar"
                onClick={() => profileImageInputRef.current?.click()}
                title="Click to change photo"
              >
                {displayProfile.profilePhotoUrl ? (
                  <img src={displayProfile.profilePhotoUrl} alt="Profile" />
                ) : (
                  displayProfile.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || "PR"
                )}
                <div className="photo-upload-overlay">
                  {isUploadingPhoto ? (
                    <Loader2 size={20} className="spin" />
                  ) : (
                    <>
                      <Upload size={18} />
                      <span>Change</span>
                    </>
                  )}
                </div>
              </div>

              {/* Hidden input wired to ref */}
              <input
                ref={profileImageInputRef}
                type="file"
                className="file-input-hidden"
                accept="image/*"
                onChange={handleProfileImageUpload}
              />

              <button
                className="upload-avatar-btn"
                onClick={() => profileImageInputRef.current?.click()}
                disabled={isUploadingPhoto}
                title="Change photo"
              >
                {isUploadingPhoto ? (
                  <Loader2 size={13} className="spin" />
                ) : (
                  <Upload size={13} />
                )}
              </button>
            </div>

            <div className="profile-hero-info">
              <div className="profile-name">
                {profile.fullName || "Your Name"}
              </div>
              <div className="profile-business">
                {profile.businessName || "Your Business"} •{" "}
                {profile.category || "Service Provider"}
              </div>
              <div
                className={`profile-status-badge ${
                  profile.status === "active" || profile.status === "Active"
                    ? ""
                    : profile.status === "suspended" ||
                        profile.status === "Suspended"
                      ? "suspended"
                      : "pending"
                }`}
              >
                <CheckCircle size={12} />
                {profile.status || "Active"}
              </div>
            </div>

            <div className="profile-hero-actions">
              {isEditing ? (
                <>
                  <button
                    className="hero-btn secondary"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    className="hero-btn primary"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 size={16} className="spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              ) : (
                <button
                  className="hero-btn secondary"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 size={16} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="profile-stats-row">
            <div className="stat-box">
              <div className="stat-number">
                {profile.yearsExperience || "—"}
              </div>
              <div className="stat-name">Yrs Experience</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{profile.services.length}</div>
              <div className="stat-name">Services</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">
                {profile.avgRating > 0 ? profile.avgRating.toFixed(1) : "—"}
              </div>
              <div className="stat-name">Avg Rating</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{profile.totalReviews}</div>
              <div className="stat-name">Reviews</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{profile.totalJobsCompleted}</div>
              <div className="stat-name">Jobs Done</div>
            </div>
          </div>
        </div>

        <div className="profile-content-grid">
          {/* ── Left Column ── */}
          <div>
            {/* Personal Info */}
            <div className="profile-card">
              <div className="profile-card-header">
                <div className="section-icon">
                  <User size={18} />
                </div>
                <div className="section-title">Personal Information</div>
              </div>
              <div className="profile-card-body">
                <div className="form-grid">
                  {(
                    [
                      {
                        label: "Full Name",
                        field: "fullName" as const,
                        icon: <User size={12} />,
                        type: "text",
                      },
                      {
                        label: "Email Address",
                        field: "email" as const,
                        icon: <Mail size={12} />,
                        type: "email",
                        disabled: true,
                      },
                      {
                        label: "Phone Number",
                        field: "phone" as const,
                        icon: <Phone size={12} />,
                        type: "tel",
                      },
                      {
                        label: "WhatsApp Number",
                        field: "whatsappNumber" as const,
                        icon: <Phone size={12} />,
                        type: "tel",
                      },
                      {
                        label: "City",
                        field: "city" as const,
                        icon: <MapPin size={12} />,
                        type: "text",
                        fullWidth: true,
                      },
                    ] as FormField[]
                  ).map(({ label, field, icon, type, disabled, fullWidth }) => (
                    <div
                      key={field}
                      className={`form-field ${fullWidth ? "full-width" : ""}`}
                    >
                      <label className="field-label">
                        {icon}
                        {label}
                      </label>
                      <input
                        type={type}
                        className="field-input"
                        value={displayProfile[field] as string}
                        onChange={(e) => handleChange(field, e.target.value)}
                        disabled={!isEditing || !!disabled}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Business Info */}
            <div className="profile-card">
              <div className="profile-card-header">
                <div className="section-icon">
                  <Briefcase size={18} />
                </div>
                <div className="section-title">Business Information</div>
              </div>
              <div className="profile-card-body">
                <div className="form-grid">
                  <div className="form-field">
                    <label className="field-label">
                      <Briefcase size={12} />
                      Business Name
                    </label>
                    <input
                      type="text"
                      className="field-input"
                      value={displayProfile.businessName}
                      onChange={(e) =>
                        handleChange("businessName", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-field">
                    <label className="field-label">
                      <Briefcase size={12} />
                      Service Category
                    </label>
                    <input
                      type="text"
                      className="field-input"
                      value={displayProfile.category}
                      disabled
                      title="Contact admin to change category"
                    />
                  </div>
                  <div className="form-field">
                    <label className="field-label">
                      <Clock size={12} />
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      className="field-input"
                      value={displayProfile.yearsExperience}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || /^\d+$/.test(val)) {
                          handleChange("yearsExperience", val);
                        }
                      }}
                      disabled={!isEditing}
                      min="0"
                      step="1"
                    />
                  </div>
                  <div className="form-field">
                    <label className="field-label">
                      <Globe size={12} />
                      Website
                    </label>
                    <input
                      type="url"
                      className="field-input"
                      value={displayProfile.website}
                      onChange={(e) => handleChange("website", e.target.value)}
                      disabled={!isEditing}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="form-field full-width">
                    <label className="field-label">
                      <FileText size={12} />
                      Bio / Business Description
                    </label>
                    <textarea
                      className="field-input field-textarea"
                      value={displayProfile.description}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-field full-width">
                    <label className="field-label">
                      <Award size={12} />
                      Verification Level
                    </label>
                    <input
                      type="text"
                      className="field-input"
                      value={displayProfile.verificationLevel}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Services WITH PRICE */}
            <div className="profile-card">
              <div className="profile-card-header">
                <div className="section-icon">
                  <Star size={18} />
                </div>
                <div className="section-title">Services Offered</div>
              </div>
              <div className="profile-card-body">
                {/* Display services */}
                <div className="services-display">
                  {displayProfile.services.length === 0 && !isEditing && (
                    <p style={{ color: "var(--text-tertiary)", fontSize: 13 }}>
                      No services added yet
                    </p>
                  )}
                  {displayProfile.services.map((service, i) => (
                    <div key={i} className="service-tag">
                      <span>{service.name}</span>
                      <span className="service-price-pill">
                        {service.price
                          ? `$${service.price}`
                          : "Price on request"}
                      </span>
                      {isEditing && (
                        <button
                          className="remove-service-btn"
                          onClick={() => handleRemoveService(i)}
                        >
                          <X size={13} strokeWidth={2.5} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add service + price when editing */}
                {isEditing && (
                  <div className="add-service-row">
                    <input
                      type="text"
                      className="service-input"
                      placeholder="Add a service (e.g. Door Installation)"
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddService())
                      }
                    />
                    <input
                      type="number"
                      className="service-input service-price-input"
                      placeholder="Price (e.g. 50.00)"
                      step="0.01"
                      min="0"
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddService())
                      }
                    />
                    <button
                      className="add-service-btn"
                      onClick={handleAddService}
                      disabled={!newService.trim() || !newServicePrice.trim()}
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Right Column ── */}
          <div>
            {/* Profile Photo Card */}
            <div className="photo-card">
              <div className="photo-card-header">
                <div className="section-icon">
                  <User size={16} />
                </div>
                <div>
                  <div className="photo-card-title">Profile Photo</div>
                  <div className="photo-card-subtitle">
                    Shown publicly on your profile
                  </div>
                </div>
              </div>
              <div className="photo-card-body">
                <div className="photo-avatar-area">
                  <div
                    className="photo-avatar-frame"
                    onClick={() =>
                      !isUploadingPhoto && profileImageInputRef.current?.click()
                    }
                    title="Click to change photo"
                  >
                    {displayProfile.profilePhotoUrl ? (
                      <img src={displayProfile.profilePhotoUrl} alt="Profile" />
                    ) : (
                      <div className="photo-avatar-placeholder">
                        <ImageIcon size={36} strokeWidth={1.5} />
                        <span>No photo yet</span>
                      </div>
                    )}
                    <div className="photo-upload-overlay">
                      {isUploadingPhoto ? (
                        <Loader2 size={22} className="spin" />
                      ) : (
                        <>
                          <Upload size={20} />
                          <span>Change Photo</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="photo-actions">
                    <button
                      className="photo-btn change"
                      onClick={() => profileImageInputRef.current?.click()}
                      disabled={isUploadingPhoto}
                    >
                      {isUploadingPhoto ? (
                        <>
                          <Loader2 size={14} className="spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload size={14} />
                          {displayProfile.profilePhotoUrl
                            ? "Change Photo"
                            : "Upload Photo"}
                        </>
                      )}
                    </button>
                    {displayProfile.profilePhotoUrl && (
                      <button
                        className="photo-btn remove"
                        onClick={handleDeleteProfilePhoto}
                        disabled={isUploadingPhoto}
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery */}
            <div className="photo-card">
              <div className="photo-card-header">
                <div className="section-icon">
                  <ImageIcon size={16} />
                </div>
                <div>
                  <div className="photo-card-title">Work Gallery</div>
                  <div className="photo-card-subtitle">
                    Showcase your best work (
                    {displayProfile.galleryImages.length}/10)
                  </div>
                </div>
              </div>
              <div className="photo-card-body" style={{ paddingTop: 16 }}>
                <input
                  type="file"
                  id="galleryImages"
                  className="file-input-hidden"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                />
                <button
                  className="upload-btn"
                  onClick={() =>
                    document.getElementById("galleryImages")?.click()
                  }
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
                    displayProfile.galleryImages.map((img) => (
                      <div key={img.id} className="gallery-item">
                        <img src={img.publicUrl} alt="Gallery" />
                        <div className="image-overlay">
                          <button
                            className="remove-image-btn"
                            onClick={() => handleRemoveGalleryImage(img)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {displayProfile.galleryImages.length > 0 && (
                  <p className="gallery-count">
                    {displayProfile.galleryImages.length} of 10 photos uploaded
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProviderProfile;
