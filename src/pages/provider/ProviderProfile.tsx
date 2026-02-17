// src/pages/provider/ProviderProfile.tsx
import { useState } from "react";
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
} from "lucide-react";
import PageHeader from "../../components/Admin/PageHeader";

interface ProviderProfile {
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  city: string;
  address: string;

  // Business Information
  businessName: string;
  category: string;
  yearsExperience: string;
  description: string;
  services: string[];
  website: string;
  certifications: string;

  // Images
  providerImage: string | null;
  galleryImages: string[];
}

const ProviderProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<ProviderProfile>({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+263 77 123 4567",
    city: "Harare",
    address: "123 Main Street, Borrowdale",
    businessName: "ABC Plumbing Services",
    category: "Plumbing",
    yearsExperience: "10",
    description:
      "Professional plumbing services with over 10 years of experience. We specialize in residential and commercial plumbing, emergency repairs, and installations.",
    services: [
      "Emergency repairs",
      "Geyser installation",
      "Bathroom renovations",
      "Pipe installations",
      "Leak detection",
    ],
    website: "https://www.abcplumbing.co.zw",
    certifications: "Licensed Plumber, Gas Safe Certified",
    providerImage: null,
    galleryImages: [],
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
    }, 1000);
  };

  const handleChange = (field: keyof ProviderProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleRemoveService = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  const handleProviderImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({
          ...prev,
          providerImage: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProviderImage = () => {
    setProfile((prev) => ({ ...prev, providerImage: null }));
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfile((prev) => ({
            ...prev,
            galleryImages: [...prev.galleryImages, reader.result as string],
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
  };

  return (
    <>
      <style>{`
        .provider-profile {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .profile-header-card {
          background: #fff;
          border: 1px solid #e3e5e8;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 24px;
        }

        .profile-header {
          background: linear-gradient(135deg, #FF6B35 0%, #E85A28 100%);
          padding: 32px 24px;
          color: #fff;
          position: relative;
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 700;
          border: 3px solid rgba(255, 255, 255, 0.3);
          margin-bottom: 16px;
        }

        .profile-name {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .profile-category {
          font-size: 14px;
          opacity: 0.9;
        }

        .profile-actions {
          position: absolute;
          top: 24px;
          right: 24px;
        }

        .edit-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          border: none;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          color: #fff;
        }

        .edit-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .edit-btn.save {
          background: #fff;
          color: #FF6B35;
        }

        .edit-btn.save:hover {
          background: #f8f9fa;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          padding: 24px;
          background: #f8f9fa;
        }

        .stat-box {
          text-align: center;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 600;
          color: #202124;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12px;
          color: #5f6368;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Main Content Grid */
        .profile-content-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 24px;
        }

        .profile-details {
          background: #fff;
          border: 1px solid #e3e5e8;
          border-radius: 12px;
          padding: 32px 24px;
        }

        .profile-images {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-section {
          margin-bottom: 32px;
        }

        .form-section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #202124;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-field.full-width {
          grid-column: 1 / -1;
        }

        .field-label {
          font-size: 13px;
          font-weight: 500;
          color: #5f6368;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .field-input {
          padding: 10px 12px;
          border: 1px solid #dadce0;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.15s;
          background: #fff;
        }

        .field-input:focus {
          outline: none;
          border-color: #FF6B35;
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
        }

        .field-input:disabled {
          background: #f8f9fa;
          color: #5f6368;
          cursor: not-allowed;
        }

        .field-textarea {
          min-height: 100px;
          resize: vertical;
          font-family: inherit;
        }

        .services-display {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }

        .service-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #f8f9fa;
          border: 1px solid #e3e5e8;
          border-radius: 6px;
          font-size: 13px;
          color: #202124;
        }

        .service-tag.editable {
          padding-right: 8px;
        }

        .remove-service-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border: none;
          background: transparent;
          color: #5f6368;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.15s;
        }

        .remove-service-btn:hover {
          background: #e3e5e8;
          color: #202124;
        }

        .services-empty {
          padding: 12px;
          background: #f8f9fa;
          border: 1px dashed #dadce0;
          border-radius: 8px;
          text-align: center;
          font-size: 13px;
          color: #5f6368;
        }

        /* Image Cards */
        .image-card {
          background: #fff;
          border: 1px solid #e3e5e8;
          border-radius: 12px;
          padding: 24px;
        }

        .image-card-title {
          font-size: 16px;
          font-weight: 600;
          color: #202124;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .image-card-description {
          font-size: 13px;
          color: #5f6368;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        /* Provider Image */
        .provider-image-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .provider-image-preview {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid #e3e5e8;
          position: relative;
        }

        .provider-image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .provider-image-placeholder {
          width: 100%;
          height: 100%;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 12px;
          color: #5f6368;
        }

        .image-remove-overlay {
          position: absolute;
          top: 12px;
          right: 12px;
        }

        .remove-image-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          border: none;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
        }

        .remove-image-btn:hover {
          background: rgba(239, 68, 68, 0.9);
        }

        .upload-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #FF6B35;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          width: 100%;
          justify-content: center;
        }

        .upload-btn:hover {
          background: #E85A28;
          transform: translateY(-1px);
        }

        .upload-btn:disabled {
          background: #dadce0;
          cursor: not-allowed;
          transform: none;
        }

        .file-input-hidden {
          display: none;
        }

        /* Gallery Grid */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-top: 16px;
        }

        .gallery-item {
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid #e3e5e8;
          position: relative;
          transition: all 0.15s;
        }

        .gallery-item:hover {
          border-color: #FF6B35;
        }

        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .gallery-empty {
          grid-column: 1 / -1;
          padding: 40px 20px;
          background: #f8f9fa;
          border: 2px dashed #dadce0;
          border-radius: 8px;
          text-align: center;
          color: #5f6368;
        }

        .gallery-empty-icon {
          font-size: 48px;
          margin-bottom: 12px;
          opacity: 0.5;
        }

        .gallery-count {
          font-size: 12px;
          color: #5f6368;
          margin-top: 12px;
          text-align: center;
        }

        @media (max-width: 1024px) {
          .profile-content-grid {
            grid-template-columns: 1fr;
          }

          .profile-images {
            flex-direction: row;
            gap: 16px;
          }

          .image-card {
            flex: 1;
          }
        }

        @media (max-width: 768px) {
          .provider-profile {
            padding: 16px;
          }

          .profile-header {
            padding: 24px 16px;
          }

          .profile-actions {
            position: static;
            margin-top: 16px;
          }

          .edit-btn {
            width: 100%;
            justify-content: center;
          }

          .profile-details {
            padding: 24px 16px;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .stats-row {
            grid-template-columns: 1fr;
            gap: 12px;
            padding: 16px;
          }

          .profile-images {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="provider-profile">
        <PageHeader
          title="Business Profile"
          subtitle="Manage your business information and settings"
          icon={User}
        />

        {/* Header Card */}
        <div className="profile-header-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {profile.businessName.charAt(0)}
            </div>
            <h1 className="profile-name">{profile.businessName}</h1>
            <p className="profile-category">{profile.category} Services</p>
            <div className="profile-actions">
              {isEditing ? (
                <button
                  className="edit-btn save"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  <Save size={16} />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              ) : (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  <User size={16} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-value">4.8</div>
              <div className="stat-label">Rating</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">156</div>
              <div className="stat-label">Jobs Completed</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{profile.yearsExperience}</div>
              <div className="stat-label">Years Experience</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid: Details Left, Images Right */}
        <div className="profile-content-grid">
          {/* Left Side: Profile Details */}
          <div className="profile-details">
            {/* Personal Information */}
            <div className="form-section">
              <h2 className="section-title">
                <User size={18} />
                Personal Information
              </h2>
              <div className="form-grid">
                <div className="form-field">
                  <label className="field-label">
                    <User size={14} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="field-input"
                    value={profile.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">
                    <Mail size={14} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="field-input"
                    value={profile.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">
                    <Phone size={14} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="field-input"
                    value={profile.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">
                    <MapPin size={14} />
                    City
                  </label>
                  <input
                    type="text"
                    className="field-input"
                    value={profile.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-field full-width">
                  <label className="field-label">
                    <MapPin size={14} />
                    Street Address
                  </label>
                  <input
                    type="text"
                    className="field-input"
                    value={profile.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="form-section">
              <h2 className="section-title">
                <Briefcase size={18} />
                Business Information
              </h2>
              <div className="form-grid">
                <div className="form-field">
                  <label className="field-label">
                    <Briefcase size={14} />
                    Business Name
                  </label>
                  <input
                    type="text"
                    className="field-input"
                    value={profile.businessName}
                    onChange={(e) =>
                      handleChange("businessName", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">
                    <Briefcase size={14} />
                    Service Category
                  </label>
                  <input
                    type="text"
                    className="field-input"
                    value={profile.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">
                    <Clock size={14} />
                    Years of Experience
                  </label>
                  <input
                    type="text"
                    className="field-input"
                    value={profile.yearsExperience}
                    onChange={(e) =>
                      handleChange("yearsExperience", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">
                    <Globe size={14} />
                    Website
                  </label>
                  <input
                    type="url"
                    className="field-input"
                    value={profile.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-field full-width">
                  <label className="field-label">
                    <FileText size={14} />
                    Business Description
                  </label>
                  <textarea
                    className="field-input field-textarea"
                    value={profile.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-field full-width">
                  <label className="field-label">
                    <Award size={14} />
                    Certifications & Licenses
                  </label>
                  <textarea
                    className="field-input field-textarea"
                    value={profile.certifications}
                    onChange={(e) =>
                      handleChange("certifications", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {/* Services Offered */}
            <div className="form-section">
              <h2 className="section-title">
                <Star size={18} />
                Services Offered
              </h2>
              {profile.services.length > 0 ? (
                <div className="services-display">
                  {profile.services.map((service, index) => (
                    <div
                      key={index}
                      className={`service-tag ${isEditing ? "editable" : ""}`}
                    >
                      {service}
                      {isEditing && (
                        <button
                          type="button"
                          className="remove-service-btn"
                          onClick={() => handleRemoveService(index)}
                          aria-label="Remove service"
                        >
                          <X size={14} strokeWidth={2.5} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="services-empty">No services added yet</div>
              )}
            </div>
          </div>

          {/* Right Side: Images */}
          <div className="profile-images">
            {/* Provider Image Card */}
            <div className="image-card">
              <h3 className="image-card-title">
                <User size={18} />
                Provider Image
              </h3>
              <p className="image-card-description">
                Upload a professional photo for your public profile.
              </p>

              <div className="provider-image-section">
                <div className="provider-image-preview">
                  {profile.providerImage ? (
                    <>
                      <img src={profile.providerImage} alt="Provider" />
                      <div className="image-remove-overlay">
                        <button
                          className="remove-image-btn"
                          onClick={handleRemoveProviderImage}
                          title="Remove image"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="provider-image-placeholder">
                      <ImageIcon size={56} strokeWidth={1.5} />
                      <span style={{ fontSize: "13px" }}>
                        No image uploaded
                      </span>
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  id="providerImage"
                  className="file-input-hidden"
                  accept="image/*"
                  onChange={handleProviderImageUpload}
                />
                <button
                  className="upload-btn"
                  onClick={() =>
                    document.getElementById("providerImage")?.click()
                  }
                  type="button"
                >
                  <Upload size={16} />
                  {profile.providerImage ? "Change Image" : "Upload Image"}
                </button>
              </div>
            </div>

            {/* Gallery Images Card */}
            <div className="image-card">
              <h3 className="image-card-title">
                <ImageIcon size={18} />
                Work Gallery
              </h3>
              <p className="image-card-description">
                Showcase your best work with up to 10 images.
              </p>

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
                disabled={profile.galleryImages.length >= 10}
                type="button"
                style={{ marginBottom: "16px" }}
              >
                <Upload size={16} />
                Add Images
              </button>

              <div className="gallery-grid">
                {profile.galleryImages.length > 0 ? (
                  profile.galleryImages.map((image, index) => (
                    <div key={index} className="gallery-item">
                      <img src={image} alt={`Gallery ${index + 1}`} />
                      <div className="image-remove-overlay">
                        <button
                          className="remove-image-btn"
                          onClick={() => handleRemoveGalleryImage(index)}
                          title="Remove image"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="gallery-empty">
                    <div className="gallery-empty-icon">🖼️</div>
                    <div>No images yet</div>
                    <div style={{ fontSize: "12px", marginTop: "8px" }}>
                      Click "Add Images"
                    </div>
                  </div>
                )}
              </div>

              {profile.galleryImages.length > 0 && (
                <div className="gallery-count">
                  {profile.galleryImages.length} of 10 images
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProviderProfile;
