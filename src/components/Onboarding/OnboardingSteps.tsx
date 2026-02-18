// src/components/Onboarding/OnboardingSteps.tsx
// Onboarding: only collect data NOT collected in the application

import { useState, useEffect } from "react";
import type { OnboardingData } from "../../pages/ProviderOnboarding";
import { SERVICES_BY_CATEGORY } from "../../data/services";
import "./OnboardingSteps.css";

interface OnboardingStepsProps {
  currentStep: number;
  formData: OnboardingData;
  updateFormData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  onAccountSubmit?: (email: string, password: string) => Promise<boolean>;
  loadError?: string | null;
}

const OnboardingSteps = ({
  currentStep,
  formData,
  updateFormData,
  nextStep,
  prevStep,
  onAccountSubmit,
  loadError,
}: OnboardingStepsProps) => {
  // STEP 1: ACCOUNT (new – not in application)
  const [email, setEmail] = useState(formData.email || "");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState(formData.password || "");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "medium" | "strong" | null
  >(null);

  // STEP 2: PROFILE (only fields NOT collected in application)
  const [teamSize, setTeamSize] = useState(formData.teamSize || "");
  const [callAvailable, setCallAvailable] = useState(
    formData.callAvailable ?? true,
  );
  const [whatsappAvailable, setWhatsappAvailable] = useState(
    formData.whatsappAvailable ?? true,
  );
  const [emergencyAvailable, setEmergencyAvailable] = useState(
    formData.emergencyAvailable ?? false,
  );
  const [profilePhoto, setProfilePhoto] = useState<File | null>(
    formData.profilePhoto || null,
  );

  // Read-only fields from application
  const fullName = formData.fullName;
  const businessName = formData.businessName;
  const phoneNumber = formData.phoneNumber;
  const whatsappNumber = formData.whatsappNumber;
  const description = formData.description;
  const experience = formData.experience;
  const website = formData.website;
  const languages = formData.languages || ["English"];

  // STEP 3: SERVICES
  const [selectedServices, setSelectedServices] = useState<string[]>(
    formData.selectedServices || [],
  );
  const [pricingModel, setPricingModel] = useState(
    formData.pricingModel || "Quote-based",
  );

  // STEP 4: AREAS
  const city = formData.city;
  const [areas, setAreas] = useState<string[]>(formData.areas || []);
  const [areaInput, setAreaInput] = useState("");

  // STEP 5: PORTFOLIO
  const [portfolioFiles, setPortfolioFiles] = useState<File[]>(
    formData.portfolioFiles || [],
  );
  const [licenseFiles, setLicenseFiles] = useState<File[]>(
    formData.licenseFiles || [],
  );
  const [portfolioPreviews, setPortfolioPreviews] = useState<string[]>([]);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const checkPasswordStrength = (
    pwd: string,
  ): "weak" | "medium" | "strong" | null => {
    if (!pwd) return null;
    let score = 0;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score++;
    if (pwd.length >= 8) score++;
    if (score >= 4) return "strong";
    if (score >= 3) return "medium";
    return "weak";
  };

  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(password));
  }, [password]);

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const isStrongPassword = (pwd: string) =>
    /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /\d/.test(pwd);

  // ── Step validation ───────────────────────────────────────────────────────

  const validateAccountAndContinue = async () => {
    if (!email || !confirmEmail || !password || !confirmPassword) {
      alert("Please fill in all required fields");
      return;
    }
    if (email !== confirmEmail) {
      alert("Email addresses do not match");
      return;
    }
    if (!isValidEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }
    if (!isStrongPassword(password)) {
      alert("Password must contain uppercase, lowercase, and numbers");
      return;
    }
    if (!termsAccepted) {
      alert("You must accept the Terms of Service and Privacy Policy");
      return;
    }

    // Save into parent state
    updateFormData({ email, password });

    // Delegate to parent for auth + application preload
    if (onAccountSubmit) {
      await onAccountSubmit(email, password);
      return;
    }

    // Fallback (if no handler provided)
    nextStep();
  };

  const validateProfileAndContinue = () => {
    if (!teamSize) {
      alert("Please provide your team size");
      return;
    }
    if (!profilePhoto) {
      alert("Please upload a profile photo");
      return;
    }

    updateFormData({
      teamSize,
      callAvailable,
      whatsappAvailable,
      emergencyAvailable,
      profilePhoto,
    });
    nextStep();
  };

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service],
    );
  };

  const validateServicesAndContinue = () => {
    if (selectedServices.length < 3) {
      alert("Please select at least 3 services");
      return;
    }
    updateFormData({ selectedServices, pricingModel });
    nextStep();
  };

  const addArea = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = areaInput.trim();
      if (value && !areas.includes(value)) {
        setAreas([...areas, value]);
        setAreaInput("");
      }
    }
  };

  const removeArea = (area: string) =>
    setAreas(areas.filter((a) => a !== area));

  const validateAreasAndContinue = () => {
    if (!city) {
      alert(
        "Your primary city is missing from your application. Please contact support.",
      );
      return;
    }
    if (areas.length < 2) {
      alert("Please add at least 2 service areas");
      return;
    }
    updateFormData({ areas });
    nextStep();
  };

  // ── File handlers ─────────────────────────────────────────────────────────

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setProfilePhoto(e.target.files[0]);
  };

  const handlePortfolioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setPortfolioFiles(files);
      setPortfolioPreviews(files.map((f) => URL.createObjectURL(f)));
    }
  };

  const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setLicenseFiles(Array.from(e.target.files));
  };

  const submitProfile = () => {
    if (portfolioFiles.length < 1) {
      alert("Please upload at least 1 portfolio image");
      return;
    }
    const profileData = {
      ...formData,
      email,
      password,
      teamSize,
      callAvailable,
      whatsappAvailable,
      emergencyAvailable,
      profilePhoto,
      selectedServices,
      pricingModel,
      areas,
      portfolioFiles,
      licenseFiles,
    };
    console.log("Profile Data:", profileData);
    alert(
      "Profile submitted successfully! Your account is now ready to receive customers.",
    );
  };

  // ── Step metadata ─────────────────────────────────────────────────────────

  const steps = [
    { number: 1, label: "Account" },
    { number: 2, label: "Profile" },
    { number: 3, label: "Services" },
    { number: 4, label: "Areas" },
    { number: 5, label: "Portfolio" },
  ];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        {/* Progress */}
        <div className="progress-section">
          <div className="progress-steps">
            {steps.map((step) => {
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              return (
                <div key={step.number} className="progress-step">
                  <div
                    className={`step-circle ${
                      isActive
                        ? "active"
                        : isCompleted
                          ? "completed"
                          : "inactive"
                    }`}
                  >
                    {!isCompleted && step.number}
                  </div>
                  <div
                    className={`step-label ${
                      isActive || isCompleted ? "active" : ""
                    }`}
                  >
                    {step.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 1: ACCOUNT */}
        {currentStep === 1 && (
          <div className="form-section">
            <h2 className="form-title">Create Your Account</h2>
            <p className="form-description">
              Set up your login credentials to access your ZimServ provider
              dashboard.
            </p>

            {loadError && (
              <div
                className="input-error"
                style={{ marginBottom: "12px", fontWeight: 500 }}
              >
                {loadError}
              </div>
            )}

            <div className="form-group">
              <label className="form-label required">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="form-input"
              />
              <span className="input-hint">
                Use the same email you used to apply
              </span>
            </div>

            <div className="form-group">
              <label className="form-label required">Confirm Email</label>
              <input
                type="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Create Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a strong password"
                className="form-input"
              />
              <span className="input-hint">
                At least 8 characters with uppercase, lowercase, and numbers
              </span>
              {passwordStrength && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div className={`strength-bar-fill ${passwordStrength}`} />
                  </div>
                  <div className={`strength-text ${passwordStrength}`}>
                    {passwordStrength === "weak"
                      ? "Weak password"
                      : passwordStrength === "medium"
                        ? "Medium password"
                        : "Strong password"}
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label required">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="form-input"
              />
            </div>

            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="form-checkbox"
              />
              <label className="checkbox-label">
                I agree to ZimServ's <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>
              </label>
            </div>

            <div className="form-actions">
              <button
                onClick={() => window.history.back()}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={validateAccountAndContinue}
                className="btn-primary"
              >
                Create Account &amp; Continue →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PROFILE (read-only summary + new fields) */}
        {currentStep === 2 && (
          <div className="form-section">
            <h2 className="form-title">Profile Information</h2>
            <p className="form-description">
              We’ve pre-filled your details from your application. Review them
              and add anything new.
            </p>

            {/* Read-only summary from application */}
            <div className="form-group">
              <label className="form-label">Full Name (from application)</label>
              <input
                type="text"
                value={fullName}
                className="form-input"
                disabled
              />
            </div>

            {businessName && (
              <div className="form-group">
                <label className="form-label">
                  Business Name (from application)
                </label>
                <input
                  type="text"
                  value={businessName}
                  className="form-input"
                  disabled
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                Phone Number (from application)
              </label>
              <input
                type="tel"
                value={phoneNumber}
                className="form-input"
                disabled
              />
            </div>

            {whatsappNumber && (
              <div className="form-group">
                <label className="form-label">
                  WhatsApp (from application)
                </label>
                <input
                  type="tel"
                  value={whatsappNumber}
                  className="form-input"
                  disabled
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                About Your Services (from application)
              </label>
              <textarea
                value={description}
                className="form-textarea"
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Experience (from application)
              </label>
              <input
                type="text"
                value={experience}
                className="form-input"
                disabled
              />
            </div>

            {website && (
              <div className="form-group">
                <label className="form-label">Website (from application)</label>
                <input
                  type="url"
                  value={website}
                  className="form-input"
                  disabled
                />
              </div>
            )}

            {languages && languages.length > 0 && (
              <div className="form-group">
                <label className="form-label">
                  Languages (from application)
                </label>
                <div className="tags-inline">
                  {languages.map((lang) => (
                    <span key={lang} className="pill-tag">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* New onboarding-only inputs */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label required">Team Size</label>
                <input
                  type="number"
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  placeholder="e.g., 3"
                  min="1"
                  className="form-input"
                />
                <span className="input-hint">Including yourself</span>
              </div>

              <div className="form-group">
                <label className="form-label">Contact Availability</label>
                <div style={{ display: "grid", gap: "12px" }}>
                  <div className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={callAvailable}
                      onChange={(e) => setCallAvailable(e.target.checked)}
                      className="form-checkbox"
                    />
                    <label className="checkbox-label">
                      Available for phone calls
                    </label>
                  </div>
                  <div className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={whatsappAvailable}
                      onChange={(e) => setWhatsappAvailable(e.target.checked)}
                      className="form-checkbox"
                    />
                    <label className="checkbox-label">
                      Available on WhatsApp
                    </label>
                  </div>
                  <div className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={emergencyAvailable}
                      onChange={(e) => setEmergencyAvailable(e.target.checked)}
                      className="form-checkbox"
                    />
                    <label className="checkbox-label">
                      Available 24/7 for emergencies
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label required">Profile Photo</label>
              <div
                onClick={() => document.getElementById("photoInput")?.click()}
                className={`file-upload-zone ${profilePhoto ? "has-file" : ""}`}
              >
                <div className="file-upload-icon">📸</div>
                <div className="file-upload-text">
                  {profilePhoto
                    ? `Selected: ${profilePhoto.name}`
                    : "Click to upload your profile photo"}
                </div>
                <div className="file-upload-hint">
                  JPG or PNG, max 5MB. Professional headshot recommended.
                </div>
              </div>
              <input
                type="file"
                id="photoInput"
                accept="image/*"
                onChange={handleProfilePhotoChange}
                className="file-input"
              />
            </div>

            <div className="form-actions">
              <button onClick={prevStep} className="btn-secondary">
                ← Back
              </button>
              <button
                onClick={validateProfileAndContinue}
                className="btn-primary"
              >
                Continue to Services →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SERVICES (new) */}
        {currentStep === 3 && (
          <div className="form-section">
            <h2 className="form-title">Services You Offer</h2>
            <p className="form-description">
              Select all services you can provide. This helps customers find
              you.
            </p>

            <div className="form-group">
              <label className="form-label">Your Category</label>
              <div className="category-badge">{formData.category}</div>
              <span className="input-hint">From your application</span>
            </div>

            <div className="form-group">
              <label className="form-label required">
                Select Services (Choose at least 3)
              </label>
              <div className="services-grid">
                {SERVICES_BY_CATEGORY[formData.category]?.map((service) => (
                  <label
                    key={service}
                    className={`service-checkbox-item ${
                      selectedServices.includes(service) ? "selected" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service)}
                      onChange={() => toggleService(service)}
                    />
                    <span className="service-checkbox-label">{service}</span>
                  </label>
                ))}
              </div>
              <div className="services-count">
                <span>{selectedServices.length}</span> services selected
              </div>
            </div>

            <div className="form-group">
              <label className="form-label required">Pricing Model</label>
              <select
                value={pricingModel}
                onChange={(e) => setPricingModel(e.target.value)}
                className="form-input"
              >
                <option value="Quote-based">
                  Quote-based (Custom pricing per job)
                </option>
                <option value="Fixed Price">
                  Fixed Price (Standard rates)
                </option>
                <option value="Hourly Rate">Hourly Rate</option>
                <option value="Project-based">Project-based</option>
              </select>
              <span className="input-hint">
                How do you typically charge customers?
              </span>
            </div>

            <div className="form-actions">
              <button onClick={prevStep} className="btn-secondary">
                ← Back
              </button>
              <button
                onClick={validateServicesAndContinue}
                className="btn-primary"
              >
                Continue to Service Areas →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: AREAS (city from application, only suburbs are new) */}
        {currentStep === 4 && (
          <div className="form-section">
            <h2 className="form-title">Service Areas</h2>
            <p className="form-description">
              Your primary city comes from your application. Add the suburbs or
              areas you serve.
            </p>

            <div className="form-group">
              <label className="form-label">
                Primary City (from application)
              </label>
              <input type="text" value={city} className="form-input" disabled />
            </div>

            <div className="form-group">
              <label className="form-label required">
                Add Service Areas (At least 2 required)
              </label>
              <div className="tag-input-container">
                {areas.map((area) => (
                  <span key={area} className="area-tag">
                    {area}
                    <button
                      onClick={() => removeArea(area)}
                      className="tag-remove-btn"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={areaInput}
                  onChange={(e) => setAreaInput(e.target.value)}
                  onKeyPress={addArea}
                  placeholder="Type a suburb/area and press Enter..."
                  className="tag-input"
                />
              </div>
              <span className="input-hint">
                Examples: Borrowdale, Mount Pleasant, Avondale, Glen Lorne
              </span>
            </div>

            <div className="form-actions">
              <button onClick={prevStep} className="btn-secondary">
                ← Back
              </button>
              <button
                onClick={validateAreasAndContinue}
                className="btn-primary"
              >
                Continue to Portfolio →
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: PORTFOLIO */}
        {currentStep === 5 && (
          <div className="form-section">
            <h2 className="form-title">Portfolio</h2>
            <p className="form-description">
              Showcase your work to build trust with potential customers.
            </p>

            <div className="form-group">
              <label className="form-label required">
                Work Portfolio (At least 1 photo required)
              </label>
              <div
                onClick={() =>
                  document.getElementById("portfolioInput")?.click()
                }
                className={`file-upload-zone ${
                  portfolioFiles.length > 0 ? "has-file" : ""
                }`}
              >
                <div className="file-upload-icon">🖼️</div>
                <div className="file-upload-text">
                  {portfolioFiles.length > 0
                    ? `${portfolioFiles.length} file(s) selected`
                    : "Click to upload portfolio images"}
                </div>
                <div className="file-upload-hint">
                  Upload photos of your completed work. JPG or PNG, max 5MB
                  each.
                </div>
              </div>
              <input
                type="file"
                id="portfolioInput"
                accept="image/*"
                multiple
                onChange={handlePortfolioChange}
                className="file-input"
              />
              {portfolioPreviews.length > 0 && (
                <div className="portfolio-previews">
                  {portfolioPreviews.map((preview, i) => (
                    <div key={i} className="portfolio-preview-item">
                      <img src={preview} alt={`Portfolio ${i + 1}`} />
                      <div className="portfolio-preview-badge">{i + 1}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                Licenses &amp; Certificates (Optional but recommended)
              </label>
              <div
                onClick={() => document.getElementById("licenseInput")?.click()}
                className={`file-upload-zone ${
                  licenseFiles.length > 0 ? "has-file" : ""
                }`}
              >
                <div className="file-upload-icon">📄</div>
                <div className="file-upload-text">
                  {licenseFiles.length > 0
                    ? `${licenseFiles.length} file(s) selected`
                    : "Upload licenses or certificates"}
                </div>
                <div className="file-upload-hint">
                  Professional licenses, training certificates increase
                  credibility. PDF or images accepted.
                </div>
              </div>
              <input
                type="file"
                id="licenseInput"
                accept="image/*,application/pdf"
                multiple
                onChange={handleLicenseChange}
                className="file-input"
              />
              {licenseFiles.length > 0 && (
                <div className="license-files-list">
                  {licenseFiles.map((file, i) => (
                    <div key={i} className="license-file-item">
                      📄 {file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-actions">
              <button onClick={prevStep} className="btn-secondary">
                ← Back
              </button>
              <button onClick={submitProfile} className="btn-primary">
                Submit for Review ✓
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingSteps;
