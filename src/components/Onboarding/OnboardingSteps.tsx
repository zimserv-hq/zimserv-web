// Location: src/components/Onboarding/OnboardingSteps.tsx
import { useState, useEffect, useRef } from "react";
import type {
  OnboardingData,
  ServiceEntry,
} from "../../pages/ProviderOnboarding";
import { Eye, X } from "lucide-react";
import { useServicesByCategory } from "../../data/services";
import { useToast } from "../../contexts/ToastContext";
import { useLoadScript } from "@react-google-maps/api";
import "./OnboardingSteps.css";

interface OnboardingStepsProps {
  currentStep: number;
  formData: OnboardingData;
  updateFormData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  onAccountSubmit?: (email: string, password: string) => Promise<boolean>;
  onSubmitProfile?: (profileData: OnboardingData) => Promise<void>;
  loadError?: string | null;
}

// ── Draft helpers ────────────────────────────────────────────────────────────
const DRAFT_KEY = "zimserv_onboarding_draft";

type DraftData = {
  teamSize: string;
  callAvailable: boolean;
  whatsappAvailable: boolean;
  emergencyAvailable: boolean;
  selectedServices: ServiceEntry[];
  pricingModel: string;
  areas: string[];
  savedStep: number;
};

function saveDraft(data: DraftData) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}
function loadDraft(): DraftData | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as DraftData) : null;
  } catch {
    return null;
  }
}
function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
}

// ── Eye toggle SVG helpers ───────────────────────────────────────────────────
const EyeIcon = (
  <svg
    width={20}
    height={20}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx={12} cy={12} r={3} />
  </svg>
);
const EyeOffIcon = (
  <svg
    width={20}
    height={20}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1={1} y1={1} x2={23} y2={23} />
  </svg>
);

const eyeButtonStyle: React.CSSProperties = {
  position: "absolute",
  right: 12,
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 0,
  color: "var(--color-text-secondary)",
  display: "flex",
  alignItems: "center",
};

// ── Google Maps libraries (defined outside component to avoid re-renders) ────
const MAPS_LIBRARIES: "places"[] = ["places"];

// ── Component ────────────────────────────────────────────────────────────────
const OnboardingSteps = ({
  currentStep,
  formData,
  updateFormData,
  nextStep,
  prevStep,
  onAccountSubmit,
  onSubmitProfile,
  loadError,
}: OnboardingStepsProps) => {
  const { showError, showSuccess, showInfo } = useToast();

  // ── Google Maps ──────────────────────────────────────────────────────────
  const { isLoaded: mapsLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: MAPS_LIBRARIES,
  });
  const areaAutocompleteInputRef = useRef<HTMLInputElement>(null);
  const areaAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(
    null,
  );

  // Step 1: Account
  const [email, setEmail] = useState(formData.email);
  const [password, setPassword] = useState(formData.password);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "medium" | "strong" | null
  >(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  // Step 2: Profile
  const [teamSize, setTeamSize] = useState(formData.teamSize);
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
    formData.profilePhoto ?? null,
  );
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(
    null,
  );
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  // Preloaded but editable (except full name)
  const [fullName] = useState(formData.fullName); // read-only
  const [businessName, setBusinessName] = useState(formData.businessName);
  const [phoneNumber, setPhoneNumber] = useState(
    formData.phoneNumber || "+263",
  );
  const [whatsappNumber, setWhatsappNumber] = useState(
    formData.whatsappNumber || "+263",
  );
  const [description, setDescription] = useState(formData.description);
  const [experience, setExperience] = useState(""); // not preloaded
  const [website, setWebsite] = useState(formData.website);

  // Languages
  const QUICK_LANGUAGES = ["English", "Shona", "Ndebele"];
  const MAX_LANGUAGES = 3;
  const MAX_SERVICES = 8;
  const [languages, setLanguages] = useState<string[]>(
    formData.languages?.length > 0 ? formData.languages : ["English"],
  );
  const [languageInput, setLanguageInput] = useState("");
  const [showLanguageInput, setShowLanguageInput] = useState(false);

  const toggleQuickLanguage = (lang: string) => {
    if (languages.some((l) => l.toLowerCase() === lang.toLowerCase())) {
      const updated = languages.filter(
        (l) => l.toLowerCase() !== lang.toLowerCase(),
      );
      setLanguages(updated.length === 0 ? ["English"] : updated);
    } else if (languages.length >= MAX_LANGUAGES) {
      showError(
        "Maximum reached",
        `You can only add up to ${MAX_LANGUAGES} languages.`,
      );
    } else {
      setLanguages([...languages, lang]);
    }
  };

  const addLanguage = () => {
    const value = languageInput.trim();
    if (!value) return;
    if (languages.some((l) => l.toLowerCase() === value.toLowerCase())) {
      showInfo?.("Already added", `${value} is already in your languages.`);
      return;
    }
    if (languages.length >= MAX_LANGUAGES) {
      showError(
        "Maximum reached",
        `You can only add up to ${MAX_LANGUAGES} languages.`,
      );
      return;
    }
    setLanguages([...languages, value]);
    setLanguageInput("");
    setShowLanguageInput(false);
  };

  const handleLanguageKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addLanguage();
    }
    if (e.key === "Escape") {
      setShowLanguageInput(false);
      setLanguageInput("");
    }
  };

  const removeLanguage = (lang: string) => {
    const updated = languages.filter((l) => l !== lang);
    setLanguages(updated.length === 0 ? ["English"] : updated);
  };

  // Step 3: Services
  const [selectedServices, setSelectedServices] = useState<ServiceEntry[]>(
    formData.selectedServices,
  );
  const [pricingModel, setPricingModel] = useState<string>(
    formData.pricingModel ?? "Quote-based",
  );
  const [customServiceName, setCustomServiceName] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  // ── Load services from DB ────────────────────────────────────────────────
  const { services: availableServices, loading: servicesLoading } =
    useServicesByCategory(formData.category);

  // Step 4: Areas
  const city = formData.city;
  const [areas, setAreas] = useState<string[]>(formData.areas);
  const [areaInput, setAreaInput] = useState("");
  const [showAreaInput, setShowAreaInput] = useState(false);

  // ── Google Places Autocomplete for areas ─────────────────────────────────
  useEffect(() => {
    if (!mapsLoaded || !showAreaInput || !areaAutocompleteInputRef.current)
      return;

    areaAutocompleteRef.current = new google.maps.places.Autocomplete(
      areaAutocompleteInputRef.current,
      {
        componentRestrictions: { country: "zw" },
        fields: ["name", "address_components"],
        // No types filter — searches everything including suburbs
      },
    );

    const listener = areaAutocompleteRef.current.addListener(
      "place_changed",
      () => {
        const place = areaAutocompleteRef.current?.getPlace();
        if (!place) return;

        // ✅ Use place.name FIRST — it's always the exact name shown in the dropdown
        // Only fall back to address_components if place.name is empty
        const areaName =
          place.name ||
          place.address_components?.find(
            (c) =>
              c.types.includes("sublocality_level_1") ||
              c.types.includes("sublocality") ||
              c.types.includes("neighborhood") ||
              c.types.includes("locality"),
          )?.long_name ||
          "";

        if (!areaName) return;

        if (areas.includes(areaName)) {
          showInfo?.(
            "Already added",
            `${areaName} is already in your service areas.`,
          );
          return;
        }

        setAreas((prev) => [...prev, areaName]);
        setAreaInput("");
        setShowAreaInput(false);
      },
    );

    return () => {
      if (listener) google.maps.event.removeListener(listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapsLoaded, showAreaInput]);

  // Step 5: Portfolio / ID
  const [portfolioFiles, setPortfolioFiles] = useState<File[]>(
    formData.portfolioFiles,
  );
  const [licenseFiles] = useState<File[]>(formData.licenseFiles);
  const [idFile, setIdFile] = useState<File | null>(formData.idFile ?? null);
  const [portfolioPreviews, setPortfolioPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Draft banner state
  const [showResumeBanner, setShowResumeBanner] = useState(false);
  const [savedStep, setSavedStep] = useState<number | null>(null);

  // Draft logic
  useEffect(() => {
    const draft = loadDraft();
    if (draft && currentStep === 1 && draft.savedStep > 1) {
      setSavedStep(draft.savedStep);
      setShowResumeBanner(true);
    }
  }, [currentStep]);

  const applyDraft = () => {
    const draft = loadDraft();
    if (!draft) return;
    setTeamSize(draft.teamSize);
    setCallAvailable(draft.callAvailable ?? true);
    setWhatsappAvailable(draft.whatsappAvailable ?? true);
    setEmergencyAvailable(draft.emergencyAvailable ?? false);
    setSelectedServices(draft.selectedServices);
    setPricingModel(draft.pricingModel ?? "Quote-based");
    setAreas(draft.areas);
    setShowResumeBanner(false);
    showInfo?.(
      "Draft restored",
      "We loaded your saved progress from this device.",
    );
  };

  const discardDraft = () => {
    clearDraft();
    setShowResumeBanner(false);
    showInfo?.("Draft cleared", "Your saved onboarding progress was removed.");
  };

  // Save draft when key fields change
  useEffect(() => {
    if (!formData.email) return;
    saveDraft({
      teamSize,
      callAvailable,
      whatsappAvailable,
      emergencyAvailable,
      selectedServices,
      pricingModel,
      areas,
      savedStep: currentStep,
    });
  }, [
    teamSize,
    callAvailable,
    whatsappAvailable,
    emergencyAvailable,
    selectedServices,
    pricingModel,
    areas,
    currentStep,
    formData.email,
  ]);

  // Re-sync availability flags when returning to step 2
  useEffect(() => {
    if (currentStep === 2) {
      setTeamSize(formData.teamSize);
      setCallAvailable(formData.callAvailable ?? true);
      setWhatsappAvailable(formData.whatsappAvailable ?? true);
      setEmergencyAvailable(formData.emergencyAvailable ?? false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  // Clean up previews
  useEffect(() => {
    portfolioPreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [portfolioPreviews]);

  // Password strength helpers
  const checkPasswordStrength = (
    pwd: string,
  ): "weak" | "medium" | "strong" | null => {
    if (!pwd) return null;
    let score = 0;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (pwd.length >= 8) score++;
    if (score >= 4) return "strong";
    if (score >= 3) return "medium";
    return "weak";
  };

  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(password));
  }, [password]);

  const isValidEmail = (val: string) => /\S+@\S+\.\S+/.test(val);
  const isStrongPassword = (pwd: string) =>
    /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[0-9]/.test(pwd);

  // Step 1 validation
  const validateAccountAndContinue = async () => {
    if (!email || !password || !confirmPassword) {
      showError("Missing fields", "Please fill in all required fields.");
      return;
    }
    if (!isValidEmail(email)) {
      showError("Invalid email", "Please enter a valid email address.");
      return;
    }
    if (password !== confirmPassword) {
      showError("Password mismatch", "Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      showError(
        "Weak password",
        "Password must be at least 8 characters long.",
      );
      return;
    }
    if (!isStrongPassword(password)) {
      showError(
        "Weak password",
        "Password must contain uppercase, lowercase, and numbers.",
      );
      return;
    }
    if (!termsAccepted) {
      showError(
        "Terms not accepted",
        "You must accept the Terms of Service and Privacy Policy.",
      );
      return;
    }
    updateFormData({ email, password });
    if (onAccountSubmit) {
      setIsCreatingAccount(true);
      const ok = await onAccountSubmit(email, password);
      setIsCreatingAccount(false);
      if (!ok) return;
    }
    nextStep();
  };

  // Step 2 validation
  const validateProfileAndContinue = () => {
    if (!businessName.trim()) {
      showError(
        "Business name missing",
        "Please enter your business or trading name.",
      );
      return;
    }
    if (!phoneNumber.trim()) {
      showError(
        "Phone number missing",
        "Please enter your main contact phone number.",
      );
      return;
    }
    if (!whatsappNumber.trim()) {
      showError(
        "WhatsApp number missing",
        "Please enter the WhatsApp number customers can contact.",
      );
      return;
    }
    if (!teamSize) {
      showError("Team size missing", "Please provide your team size.");
      return;
    }
    if (
      !experience.trim() ||
      isNaN(Number(experience)) ||
      Number(experience) < 0
    ) {
      showError("Experience missing", "Please enter your years of experience.");
      return;
    }
    if (!profilePhoto) {
      showError("Profile photo missing", "Please upload a profile photo.");
      return;
    }
    const finalLanguages = languages.length > 0 ? languages : ["English"];
    updateFormData({
      businessName,
      phoneNumber,
      whatsappNumber,
      description,
      experience,
      website,
      teamSize,
      callAvailable,
      whatsappAvailable,
      emergencyAvailable,
      profilePhoto,
      languages: finalLanguages,
    });
    nextStep();
  };

  // Step 3 service logic
  const toggleService = (name: string) => {
    setSelectedServices((prev) => {
      const exists = prev.find((s) => s.name === name);
      if (exists) return prev.filter((s) => s.name !== name);
      if (prev.length >= MAX_SERVICES) {
        showError(
          "Limit reached",
          `You can only select up to ${MAX_SERVICES} services.`,
        );
        return prev;
      }
      return [...prev, { name, price: "", isCustom: false }];
    });
  };

  const updateServicePrice = (name: string, price: string) => {
    setSelectedServices((prev) =>
      prev.map((s) => (s.name === name ? { ...s, price } : s)),
    );
  };

  const addCustomService = () => {
    const trimmed = customServiceName.trim();
    if (!trimmed) {
      showError("Service name missing", "Please enter a service name.");
      return;
    }
    if (
      selectedServices.some(
        (s) => s.name.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      showError("Duplicate service", "This service is already added.");
      return;
    }
    if (selectedServices.length >= MAX_SERVICES) {
      showError(
        "Limit reached",
        `You can only select up to ${MAX_SERVICES} services.`,
      );
      return;
    }
    setSelectedServices((prev) => [
      ...prev,
      { name: trimmed, price: "", isCustom: true },
    ]);
    setCustomServiceName("");
    setShowCustomInput(false);
    showSuccess("Service added", `${trimmed} was added to your services.`);
  };

  const removeCustomService = (name: string) => {
    setSelectedServices((prev) => prev.filter((s) => s.name !== name));
    showInfo?.("Service removed", `${name} was removed from your services.`);
  };

  const validateServicesAndContinue = () => {
    if (selectedServices.length < 3) {
      showError("Not enough services", "Please select at least 3 services.");
      return;
    }
    const missingPrice = selectedServices.find(
      (s) => !s.price || isNaN(parseFloat(s.price)) || parseFloat(s.price) <= 0,
    );
    if (missingPrice) {
      showError(
        "Missing starting price",
        `Please enter a valid starting price for ${missingPrice.name}.`,
      );
      return;
    }
    updateFormData({ selectedServices, pricingModel });
    nextStep();
  };

  // Step 4 logic
  const removeArea = (area: string) =>
    setAreas(areas.filter((a) => a !== area));

  const validateAreasAndContinue = () => {
    if (!city) {
      showError(
        "City missing",
        "Your primary city is missing. Please contact support.",
      );
      return;
    }
    if (areas.length < 2) {
      showError("Not enough areas", "Please add at least 2 service areas.");
      return;
    }
    updateFormData({ areas });
    nextStep();
  };

  // File handlers
  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      showError(
        "Invalid file type",
        "Only JPG, PNG, or WebP images are allowed.",
      );
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showError("File too large", "Profile photo must be under 5MB.");
      return;
    }
    if (profilePhotoPreview) URL.revokeObjectURL(profilePhotoPreview);
    setProfilePhotoPreview(URL.createObjectURL(file));
    setProfilePhoto(file);
  };

  const removeProfilePhoto = () => {
    if (profilePhotoPreview) URL.revokeObjectURL(profilePhotoPreview);
    setProfilePhotoPreview(null);
    setProfilePhoto(null);
    const input = document.getElementById("photoInput") as HTMLInputElement;
    if (input) input.value = "";
  };

  const handlePortfolioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setPortfolioFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setIdFile(file);
  };

  const removePortfolioFile = (index: number) => {
    setPortfolioFiles((prev) => prev.filter((_, i) => i !== index));
    setPortfolioPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const clearIdFile = () => setIdFile(null);

  // Step 5 submit
  const submitProfile = async () => {
    if (portfolioFiles.length < 1) {
      showError(
        "Portfolio missing",
        "Please upload at least 1 portfolio image.",
      );
      return;
    }
    if (!idFile) {
      showError(
        "ID missing",
        "Please upload at least 1 government ID document.",
      );
      return;
    }
    setIsSubmitting(true);
    const profileData: OnboardingData = {
      ...formData,
      email,
      password,
      fullName,
      businessName,
      phoneNumber,
      whatsappNumber,
      description,
      experience,
      website,
      teamSize,
      callAvailable,
      whatsappAvailable,
      emergencyAvailable,
      profilePhoto,
      languages: languages.length > 0 ? languages : ["English"],
      selectedServices,
      pricingModel,
      areas,
      portfolioFiles,
      licenseFiles,
      idFile,
    };
    updateFormData(profileData);
    try {
      if (onSubmitProfile) {
        await onSubmitProfile(profileData);
        clearDraft();
      } else {
        showSuccess(
          "Profile submitted",
          "Your account is now ready to receive customers.",
        );
        clearDraft();
      }
    } catch (err) {
      console.error("Error submitting profile:", err);
      showError(
        "Submission error",
        "We could not submit your profile. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render
  const steps = [
    { number: 1, label: "Account" },
    { number: 2, label: "Profile" },
    { number: 3, label: "Services" },
    { number: 4, label: "Areas" },
    { number: 5, label: "Portfolio" },
  ];

  const customServices = selectedServices.filter((s) => s.isCustom);

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        {/* Draft banner */}
        {showResumeBanner && savedStep && (
          <div className="draft-resume-banner">
            <div className="draft-resume-text">
              You have an unfinished application saved, last on step {savedStep}
              .
            </div>
            <div className="draft-resume-actions">
              <button className="btn-primary btn-sm" onClick={applyDraft}>
                Resume where I left off
              </button>
              <button className="btn-secondary btn-sm" onClick={discardDraft}>
                Start fresh
              </button>
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="progress-section">
          <div className="progress-steps">
            {steps.map((step) => {
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              return (
                <div key={step.number} className="progress-step">
                  <div
                    className={`step-circle ${isActive ? "active" : isCompleted ? "completed" : "inactive"}`}
                  >
                    {isCompleted ? "✓" : step.number}
                  </div>
                  <div
                    className={`step-label ${isActive || isCompleted ? "active" : ""}`}
                  >
                    {step.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 1: Account */}
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
                style={{ marginBottom: 12, fontWeight: 500 }}
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
                Use the same email you used to apply.
              </span>
            </div>
            <div className="form-group">
              <label className="form-label required">Create Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a strong password"
                  className="form-input"
                  style={{ paddingRight: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  style={eyeButtonStyle}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? EyeOffIcon : EyeIcon}
                </button>
              </div>
              <span className="input-hint">
                At least 8 characters with uppercase, lowercase, and numbers.
              </span>
              {passwordStrength && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div className={`strength-bar-fill ${passwordStrength}`} />
                  </div>
                  <div className="strength-text">
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
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="form-input"
                  style={{ paddingRight: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  style={eyeButtonStyle}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? EyeOffIcon : EyeIcon}
                </button>
              </div>
            </div>
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="form-checkbox"
              />
              <label className="checkbox-label">
                I agree to ZimServ&apos;s{" "}
                <a href="/legal/terms.pdf" target="_blank" rel="noreferrer">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/legal/privacy.pdf" target="_blank" rel="noreferrer">
                  Privacy Policy
                </a>
                .
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
                disabled={isCreatingAccount}
              >
                {isCreatingAccount
                  ? "Creating account..."
                  : "Create Account & Continue"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Profile */}
        {currentStep === 2 && (
          <div className="form-section">
            <h2 className="form-title">Profile Information</h2>
            <p className="form-description">
              We&apos;ve pre-filled what we can from your application. Complete
              and update the rest.
            </p>
            <div className="form-group">
              <label className="form-label">Full Name (from application)</label>
              <input
                type="text"
                value={fullName}
                className="form-input"
                disabled
              />
            </div>
            <div className="form-group">
              <label className="form-label required">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g., Zimserv Plumbing"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label required">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your main contact number"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label required">WhatsApp Number</label>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="Enter your WhatsApp number"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">About Your Services</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your services, experience, and what makes you stand out."
                className="form-textarea"
              />
            </div>
            <div className="form-group">
              <label className="form-label required">Experience (years)</label>
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="e.g., 5"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Website (Optional)</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourbusiness.co.zw"
                className="form-input"
              />
            </div>

            {/* Languages */}
            <div className="form-group">
              <label className="form-label">
                Languages Spoken{" "}
                <span
                  style={{
                    fontWeight: 400,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  max {MAX_LANGUAGES}
                </span>
              </label>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginBottom: 12,
                }}
              >
                {QUICK_LANGUAGES.map((lang) => {
                  const isSelected = languages.some(
                    (l) => l.toLowerCase() === lang.toLowerCase(),
                  );
                  const isDisabled =
                    !isSelected && languages.length >= MAX_LANGUAGES;
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleQuickLanguage(lang)}
                      disabled={isDisabled}
                      style={{
                        padding: "7px 16px",
                        borderRadius: "var(--radius-full)",
                        border: `1.5px solid ${isSelected ? "var(--color-accent)" : "var(--color-border)"}`,
                        background: isSelected
                          ? "var(--color-accent)"
                          : "var(--color-bg)",
                        color: isSelected
                          ? "#fff"
                          : isDisabled
                            ? "var(--color-border)"
                            : "var(--color-text-secondary)",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        fontFamily: "var(--font-primary)",
                        transition: "all 0.2s ease",
                        opacity: isDisabled ? 0.5 : 1,
                      }}
                    >
                      {isSelected ? `✓ ${lang}` : lang}
                    </button>
                  );
                })}
              </div>
              {languages.filter(
                (l) =>
                  !QUICK_LANGUAGES.some(
                    (q) => q.toLowerCase() === l.toLowerCase(),
                  ),
              ).length > 0 && (
                <div
                  className="custom-services-list"
                  style={{ marginBottom: 10 }}
                >
                  {languages
                    .filter(
                      (l) =>
                        !QUICK_LANGUAGES.some(
                          (q) => q.toLowerCase() === l.toLowerCase(),
                        ),
                    )
                    .map((lang) => (
                      <div key={lang} className="custom-service-item">
                        <div className="custom-service-name">{lang}</div>
                        <div className="custom-service-right">
                          <button
                            type="button"
                            className="custom-service-remove"
                            onClick={() => removeLanguage(lang)}
                            aria-label={`Remove ${lang}`}
                          >
                            <X size={14} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
              {languages.length < MAX_LANGUAGES &&
                (showLanguageInput ? (
                  <div className="custom-service-input-row">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., Tonga, Venda, Kalanga"
                      value={languageInput}
                      onChange={(e) => setLanguageInput(e.target.value)}
                      onKeyDown={handleLanguageKeyDown}
                      autoFocus
                    />
                    <button
                      type="button"
                      className="btn-primary btn-sm"
                      onClick={addLanguage}
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      onClick={() => {
                        setShowLanguageInput(false);
                        setLanguageInput("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="add-custom-service-btn"
                    onClick={() => setShowLanguageInput(true)}
                  >
                    Add another language
                  </button>
                ))}
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label required">Team Size</label>
                <input
                  type="number"
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  placeholder="e.g., 3"
                  min={1}
                  className="form-input"
                />
                <span className="input-hint">Including yourself.</span>
              </div>
              <div className="form-group">
                <label className="form-label">Contact Availability</label>
                <div style={{ display: "grid", gap: 12 }}>
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

            {/* Profile Photo */}
            <div className="form-group">
              <label className="form-label required">Profile Photo</label>
              {profilePhoto && profilePhotoPreview ? (
                <div className="photo-preview-row">
                  <div
                    className="photo-thumbnail-wrap"
                    onClick={() => setShowPhotoModal(true)}
                    title="Click to preview"
                  >
                    <img
                      src={profilePhotoPreview}
                      alt="Profile preview"
                      className="photo-thumbnail"
                    />
                    <div className="photo-thumbnail-overlay">
                      <Eye size={18} color="#fff" strokeWidth={2.5} />
                    </div>
                  </div>
                  <div className="photo-preview-info">
                    <span className="photo-file-name">{profilePhoto.name}</span>
                    <span className="photo-file-size">
                      {(profilePhoto.size / 1024).toFixed(0)} KB
                    </span>
                  </div>
                  <div className="photo-preview-actions">
                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      onClick={() =>
                        document.getElementById("photoInput")?.click()
                      }
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      className="photo-remove-btn"
                      onClick={removeProfilePhoto}
                      aria-label="Remove photo"
                      title="Remove photo"
                    >
                      <X size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => document.getElementById("photoInput")?.click()}
                  className="file-upload-zone"
                >
                  <div className="file-upload-icon" />
                  <div className="file-upload-text">
                    Click to upload your profile photo
                  </div>
                  <div className="file-upload-hint">
                    JPG, PNG, or WebP. Max 5MB. Professional headshot
                    recommended.
                  </div>
                </div>
              )}
              <input
                type="file"
                id="photoInput"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleProfilePhotoChange}
                className="file-input"
              />
            </div>

            <div className="form-actions">
              <button onClick={prevStep} className="btn-secondary">
                Back
              </button>
              <button
                onClick={validateProfileAndContinue}
                className="btn-primary"
              >
                Continue to Services
              </button>
            </div>

            {/* Photo preview modal */}
            {showPhotoModal && profilePhotoPreview && (
              <div
                className="photo-modal-overlay"
                onClick={() => setShowPhotoModal(false)}
              >
                <div
                  className="photo-modal-content"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="photo-modal-close"
                    onClick={() => setShowPhotoModal(false)}
                    aria-label="Close preview"
                  >
                    <X size={20} strokeWidth={2.5} />
                  </button>
                  <img
                    src={profilePhotoPreview}
                    alt="Profile photo preview"
                    className="photo-modal-img"
                  />
                  <p className="photo-modal-name">{profilePhoto?.name}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Services */}
        {currentStep === 3 && (
          <div className="form-section">
            <h2 className="form-title">Services You Offer</h2>
            <p className="form-description">
              Select services and set a starting price for each. Add custom
              services if yours aren&apos;t listed.
            </p>

            <div className="form-group">
              <label className="form-label">Your Category</label>
              <div className="category-badge">{formData.category}</div>
              <span className="input-hint">From your application.</span>
            </div>

            <div className="form-group">
              <label className="form-label required">
                Select Services (Choose at least 3)
              </label>
              {servicesLoading ? (
                <p className="input-hint">Loading services...</p>
              ) : availableServices.length === 0 ? (
                <p
                  className="input-hint"
                  style={{ color: "var(--color-accent)" }}
                >
                  No catalog services found for {formData.category}. Use the
                  custom service option below.
                </p>
              ) : (
                <div className="services-grid">
                  {availableServices.map((serviceName: string) => {
                    const entry = selectedServices.find(
                      (s) => s.name === serviceName,
                    );
                    const isSelected = !!entry;
                    return (
                      <div
                        key={serviceName}
                        className={`service-checkbox-item${isSelected ? " selected" : ""}`}
                      >
                        <div
                          className="service-checkbox-row"
                          onClick={() => toggleService(serviceName)}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleService(serviceName)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <label className="service-checkbox-label">
                            {serviceName}
                          </label>
                        </div>
                        {isSelected && (
                          <div className="service-price-row">
                            <span className="service-price-currency">$</span>
                            <input
                              type="number"
                              className="service-price-input"
                              placeholder="Starting price"
                              min={1}
                              required
                              value={entry?.price ?? ""}
                              onChange={(e) =>
                                updateServicePrice(serviceName, e.target.value)
                              }
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="services-count">
                <span>{selectedServices.length}</span>/{MAX_SERVICES} services
                selected
              </div>
            </div>

            {/* Custom services */}
            <div className="form-group">
              <div className="custom-services-header">
                <label className="form-label" style={{ margin: 0 }}>
                  Custom Services
                </label>
                <span className="input-hint" style={{ margin: 0 }}>
                  Don&apos;t see your service above? Add it here.
                </span>
              </div>
              {customServices.length > 0 && (
                <div className="custom-services-list">
                  {customServices.map((svc) => (
                    <div key={svc.name} className="custom-service-item">
                      <div className="custom-service-name">
                        <span className="custom-badge">Custom</span> {svc.name}
                      </div>
                      <div className="custom-service-right">
                        <div className="service-price-row">
                          <span className="service-price-currency">$</span>
                          <input
                            type="number"
                            className="service-price-input"
                            placeholder="Starting price"
                            min={0}
                            value={svc.price}
                            onChange={(e) =>
                              updateServicePrice(svc.name, e.target.value)
                            }
                          />
                        </div>
                        <button
                          type="button"
                          className="custom-service-remove"
                          onClick={() => removeCustomService(svc.name)}
                          aria-label="Remove"
                        >
                          <X size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {showCustomInput ? (
                <div className="custom-service-input-row">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Solar panel cleaning"
                    value={customServiceName}
                    onChange={(e) => setCustomServiceName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomService();
                      }
                      if (e.key === "Escape") {
                        setShowCustomInput(false);
                        setCustomServiceName("");
                      }
                    }}
                    autoFocus
                  />
                  <button
                    type="button"
                    className="btn-primary btn-sm"
                    onClick={addCustomService}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() => {
                      setShowCustomInput(false);
                      setCustomServiceName("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="add-custom-service-btn"
                  onClick={() => setShowCustomInput(true)}
                >
                  Add a custom service
                </button>
              )}
            </div>

            {/* Pricing model */}
            <div className="form-group">
              <label className="form-label required">Pricing Model</label>
              <select
                value={pricingModel}
                onChange={(e) => setPricingModel(e.target.value)}
                className="form-input"
              >
                <option value="Quote-based">
                  Quote-based (Custom per job)
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
                Back
              </button>
              <button
                onClick={validateServicesAndContinue}
                className="btn-primary"
              >
                Continue to Service Areas
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Areas */}
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
                Add Service Areas (at least 2)
              </label>
              {areas.length > 0 && (
                <div className="custom-services-list">
                  {areas.map((area) => (
                    <div key={area} className="custom-service-item">
                      <div className="custom-service-name">{area}</div>
                      <div className="custom-service-right">
                        <button
                          type="button"
                          className="custom-service-remove"
                          onClick={() => removeArea(area)}
                          aria-label="Remove"
                        >
                          <X size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {showAreaInput ? (
                <div className="custom-service-input-row">
                  <input
                    ref={areaAutocompleteInputRef}
                    type="text"
                    className="form-input"
                    placeholder={
                      mapsLoaded
                        ? "Search suburb or area..."
                        : "Loading maps..."
                    }
                    value={areaInput}
                    onChange={(e) => setAreaInput(e.target.value)}
                    disabled={!mapsLoaded}
                    autoFocus
                  />
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() => {
                      setShowAreaInput(false);
                      setAreaInput("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="add-custom-service-btn"
                  onClick={() => setShowAreaInput(true)}
                >
                  Add a service area
                </button>
              )}
              <span className="input-hint">
                Start typing a suburb or area — select from the dropdown.
              </span>
            </div>
            <div className="form-actions">
              <button onClick={prevStep} className="btn-secondary">
                Back
              </button>
              <button
                onClick={validateAreasAndContinue}
                className="btn-primary"
              >
                Continue to Portfolio
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Portfolio & ID */}
        {currentStep === 5 && (
          <div className="form-section">
            <h2 className="form-title">Portfolio & ID Verification</h2>
            <p className="form-description">
              Showcase your work to build trust with customers and securely
              verify your identity with our team.
            </p>

            {/* Work Portfolio */}
            <div className="form-group">
              <label className="form-label required">
                Work Portfolio{" "}
                <span style={{ fontWeight: 400 }}>(at least 1 photo)</span>
              </label>
              <div
                onClick={() =>
                  document.getElementById("portfolioInput")?.click()
                }
                className="file-upload-zone"
                style={{ marginBottom: portfolioFiles.length > 0 ? 12 : 0 }}
              >
                <div className="file-upload-icon" />
                <div className="file-upload-text">
                  {portfolioFiles.length === 0
                    ? "Click to upload portfolio images"
                    : "Click to add more photos"}
                </div>
                <div className="file-upload-hint">
                  Upload photos of your completed work. JPG or PNG, max 5MB
                  each.
                  {portfolioFiles.length > 0 && (
                    <span
                      style={{
                        color: "var(--color-accent)",
                        fontWeight: 600,
                        marginLeft: 6,
                      }}
                    >
                      {portfolioFiles.length}{" "}
                      {portfolioFiles.length === 1 ? "photo" : "photos"} added
                    </span>
                  )}
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
              {portfolioFiles.length > 0 && (
                <div className="portfolio-previews">
                  {portfolioFiles.map((file, i) => {
                    const url = URL.createObjectURL(file);
                    return (
                      <div key={i} className="portfolio-preview-item">
                        <img src={url} alt={`Portfolio ${i + 1}`} />
                        <div className="portfolio-preview-badge">{i + 1}</div>
                        <button
                          type="button"
                          className="portfolio-remove-btn"
                          onClick={() => removePortfolioFile(i)}
                          aria-label="Remove image"
                        >
                          <X size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Government ID */}
            <div className="form-group">
              <label className="form-label required">
                Government ID{" "}
                <span style={{ fontWeight: 400 }}>
                  Private, not shown to customers
                </span>
              </label>
              {idFile ? (
                <div className="photo-preview-row">
                  <div className="id-file-icon">
                    {idFile.type.startsWith("image") ? (
                      <img
                        src={URL.createObjectURL(idFile)}
                        alt="ID preview"
                        style={{
                          width: 56,
                          height: 56,
                          objectFit: "cover",
                          borderRadius: 8,
                          display: "block",
                        }}
                      />
                    ) : (
                      <div className="id-file-placeholder" />
                    )}
                  </div>
                  <div className="photo-preview-info">
                    <span className="photo-file-name">{idFile.name}</span>
                    <span className="photo-file-size">
                      {(idFile.size / 1024).toFixed(0)} KB
                    </span>
                  </div>
                  <div className="photo-preview-actions">
                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      onClick={() =>
                        document.getElementById("idInput")?.click()
                      }
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      className="photo-remove-btn"
                      onClick={clearIdFile}
                      aria-label="Remove ID file"
                      title="Remove ID file"
                    >
                      <X size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => document.getElementById("idInput")?.click()}
                  className="file-upload-zone"
                >
                  <div className="file-upload-icon" />
                  <div className="file-upload-text">
                    Upload a photo or scan of your ID
                  </div>
                  <div className="file-upload-hint">
                    This is only visible to ZimServ staff for verification and
                    safety. It will never be publicly displayed on your profile.
                  </div>
                </div>
              )}
              <input
                type="file"
                id="idInput"
                accept="image/*,application/pdf"
                onChange={handleIdChange}
                className="file-input"
              />
            </div>

            <div className="form-actions">
              <button onClick={prevStep} className="btn-secondary">
                Back
              </button>
              <button
                onClick={submitProfile}
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit for Review"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingSteps;
