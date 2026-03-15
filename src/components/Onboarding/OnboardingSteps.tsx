// Location: src/components/Onboarding/OnboardingSteps.tsx
import { useState, useEffect, useRef } from "react";
import type {
  OnboardingData,
  ServiceEntry,
  OnboardingDraftPatch,
} from "../../pages/ProviderOnboarding";
import { Eye, X } from "lucide-react";
import { useServicesByCategory } from "../../data/services";
import { useToast } from "../../contexts/ToastContext";
import { useLoadScript } from "@react-google-maps/api";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import type { Value as PhoneValue } from "react-phone-number-input";
import "react-phone-number-input/style.css";
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

  // ── Draft callbacks ──────────────────────────────────────────────────────
  onSaveProfileDraft?: (
    patch: Omit<OnboardingDraftPatch, "profilePhotoPath">,
    profilePhotoFile: File | null,
  ) => Promise<void>;
  onSaveServicesDraft?: (
    selectedServices: ServiceEntry[],
    pricingModel: string,
  ) => Promise<void>;
  onSaveAreasDraft?: (areas: string[]) => Promise<void>;

  // ── Eager file upload callbacks ──────────────────────────────────────────
  onUploadPortfolio?: (files: File[]) => Promise<void>;
  onUploadIdFile?: (file: File) => Promise<void>;
  onRemovePortfolioPath?: (index: number) => void;
  onRemoveIdFilePath?: () => void;

  // ── Eagerly uploaded paths from parent ──────────────────────────────────
  draftFilePaths?: {
    profilePhotoPath?: string;
    portfolioPaths: string[];
    idFilePath?: string;
  };
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

// ── Block non-integer keystrokes (e, +, -, .) ────────────────────────────────
const blockNonInteger = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (["e", "E", "+", "-", "."].includes(e.key)) e.preventDefault();
};

// ── Google Maps libraries ────────────────────────────────────────────────────
const MAPS_LIBRARIES: "places"[] = ["places"];

// ── Max portfolio photos ─────────────────────────────────────────────────────
const MAX_PORTFOLIO = 3;

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
  onSaveProfileDraft,
  onSaveServicesDraft,
  onSaveAreasDraft,
  onUploadPortfolio,
  onUploadIdFile,
  onRemovePortfolioPath,
  onRemoveIdFilePath,
  draftFilePaths,
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

  // ── Step 1: Account ──────────────────────────────────────────────────────
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

  // ── Step 2: Profile ──────────────────────────────────────────────────────
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
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Preloaded but editable (except full name)
  const [fullName] = useState(formData.fullName); // read-only
  const [businessName, setBusinessName] = useState(formData.businessName);

  // ── Phone inputs using react-phone-number-input ──────────────────────────
  const [phone, setPhone] = useState<PhoneValue | undefined>(
    (formData.phoneNumber as PhoneValue) || undefined,
  );
  const [whatsapp, setWhatsapp] = useState<PhoneValue | undefined>(
    (formData.whatsappNumber as PhoneValue) || undefined,
  );

  const [description, setDescription] = useState(formData.description);
  const [experience, setExperience] = useState(formData.experience || "");
  const [website, setWebsite] = useState(formData.website);

  // Languages
  const QUICK_LANGUAGES = ["English", "Shona", "Ndebele"];
  const MAX_LANGUAGES = 3;
  const MAX_SERVICES = 8;
  const MAX_AREAS = 8;
  const [languages, setLanguages] = useState<string[]>(
    formData.languages?.length > 0 ? formData.languages : ["English"],
  );
  const [languageInput, setLanguageInput] = useState("");
  const [showLanguageInput, setShowLanguageInput] = useState(false);

  // ── Step 3: Services ─────────────────────────────────────────────────────
  const [selectedServices, setSelectedServices] = useState<ServiceEntry[]>(
    formData.selectedServices,
  );
  const [pricingModel, setPricingModel] = useState<string>(
    formData.pricingModel ?? "Quote-based",
  );
  const [customServiceName, setCustomServiceName] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isSavingServices, setIsSavingServices] = useState(false);

  const { services: availableServices, loading: servicesLoading } =
    useServicesByCategory(formData.category);

  // ── Step 4: Areas ────────────────────────────────────────────────────────
  const city = formData.city;
  const [areas, setAreas] = useState<string[]>(formData.areas);
  const [areaInput, setAreaInput] = useState("");
  const [showAreaInput, setShowAreaInput] = useState(false);
  const [isSavingAreas, setIsSavingAreas] = useState(false);

  // ── Step 5: Portfolio / ID ───────────────────────────────────────────────
  const [portfolioFiles, setPortfolioFiles] = useState<File[]>(
    formData.portfolioFiles,
  );
  const [licenseFiles] = useState<File[]>(formData.licenseFiles);
  const [idFile, setIdFile] = useState<File | null>(formData.idFile ?? null);
  const [portfolioPreviews, setPortfolioPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPortfolio, setIsUploadingPortfolio] = useState(false);
  const [isUploadingId, setIsUploadingId] = useState(false);

  // ── Re-sync all local state when formData changes (draft restore) ────────
  useEffect(() => {
    setBusinessName(formData.businessName);
    setPhone((formData.phoneNumber as PhoneValue) || undefined);
    setWhatsapp((formData.whatsappNumber as PhoneValue) || undefined);
    setDescription(formData.description);
    setExperience(formData.experience || "");
    setWebsite(formData.website);
    setTeamSize(formData.teamSize);
    setCallAvailable(formData.callAvailable ?? true);
    setWhatsappAvailable(formData.whatsappAvailable ?? true);
    setEmergencyAvailable(formData.emergencyAvailable ?? false);
    setLanguages(
      formData.languages?.length > 0 ? formData.languages : ["English"],
    );
    setSelectedServices(formData.selectedServices);
    setPricingModel(formData.pricingModel ?? "Quote-based");
    setAreas(formData.areas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  // ── Google Places Autocomplete for areas ─────────────────────────────────
  useEffect(() => {
    if (!mapsLoaded || !showAreaInput || !areaAutocompleteInputRef.current)
      return;

    areaAutocompleteRef.current = new google.maps.places.Autocomplete(
      areaAutocompleteInputRef.current,
      {
        componentRestrictions: { country: "zw" },
        fields: ["name", "address_components"],
      },
    );

    const listener = areaAutocompleteRef.current.addListener(
      "place_changed",
      () => {
        const place = areaAutocompleteRef.current?.getPlace();
        if (!place) return;

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

        if (areas.length >= MAX_AREAS) {
          showError(
            "Limit reached",
            `You can only add up to ${MAX_AREAS} service areas.`,
          );
          setShowAreaInput(false);
          setAreaInput("");
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

  // ── Clean up portfolio object URL previews on unmount ───────────────────
  useEffect(() => {
    return () => {
      portfolioPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [portfolioPreviews]);

  // ── Password strength ────────────────────────────────────────────────────
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

  // ── Language helpers ─────────────────────────────────────────────────────
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

  // ── Step 1 validation ────────────────────────────────────────────────────
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

  // ── Step 2 validation + draft save ──────────────────────────────────────
  const validateProfileAndContinue = async () => {
    if (!businessName.trim()) {
      showError(
        "Business name missing",
        "Please enter your business or trading name.",
      );
      return;
    }
    if (!phone || !isValidPhoneNumber(phone)) {
      showError("Invalid phone number", "Please enter a valid phone number.");
      return;
    }
    if (whatsapp && !isValidPhoneNumber(whatsapp)) {
      showError(
        "Invalid WhatsApp number",
        "Please enter a valid WhatsApp number.",
      );
      return;
    }
    if (!teamSize || parseInt(teamSize, 10) < 1) {
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
    // Allow passing if a photo was already uploaded in a previous session
    if (!profilePhoto && !draftFilePaths?.profilePhotoPath) {
      showError("Profile photo missing", "Please upload a profile photo.");
      return;
    }

    const finalLanguages = languages.length > 0 ? languages : ["English"];

    const patch: Omit<OnboardingDraftPatch, "profilePhotoPath"> = {
      businessName,
      phoneNumber: phone ?? "",
      whatsappNumber: whatsapp ?? "",
      description,
      experience,
      website,
      teamSize,
      callAvailable,
      whatsappAvailable,
      emergencyAvailable,
      languages: finalLanguages,
    };

    updateFormData({
      ...patch,
      profilePhoto,
      languages: finalLanguages,
    });

    // Upload photo eagerly + persist draft before advancing
    if (onSaveProfileDraft) {
      setIsSavingProfile(true);
      await onSaveProfileDraft(patch, profilePhoto);
      setIsSavingProfile(false);
    }

    nextStep();
  };

  // ── Step 3 service helpers ───────────────────────────────────────────────
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

  // ── Step 3 validation + draft save ──────────────────────────────────────
  const validateServicesAndContinue = async () => {
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

    if (onSaveServicesDraft) {
      setIsSavingServices(true);
      await onSaveServicesDraft(selectedServices, pricingModel);
      setIsSavingServices(false);
    }

    nextStep();
  };

  // ── Step 4 helpers ───────────────────────────────────────────────────────
  const removeArea = (area: string) =>
    setAreas(areas.filter((a) => a !== area));

  // ── Step 4 validation + draft save ──────────────────────────────────────
  const validateAreasAndContinue = async () => {
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
    if (areas.length > MAX_AREAS) {
      showError(
        "Too many areas",
        `Please remove some areas. Maximum is ${MAX_AREAS}.`,
      );
      return;
    }

    updateFormData({ areas });

    if (onSaveAreasDraft) {
      setIsSavingAreas(true);
      await onSaveAreasDraft(areas);
      setIsSavingAreas(false);
    }

    nextStep();
  };

  // ── File handlers ────────────────────────────────────────────────────────
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

  // ── Portfolio: upload immediately on selection ───────────────────────────
  const handlePortfolioChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files) return;
    const incoming = Array.from(e.target.files);
    const currentCount =
      draftFilePaths?.portfolioPaths.length ?? portfolioFiles.length;
    const remaining = MAX_PORTFOLIO - currentCount;

    if (remaining <= 0) {
      showError(
        "Limit reached",
        `You can only upload up to ${MAX_PORTFOLIO} portfolio photos.`,
      );
      e.target.value = "";
      return;
    }

    const accepted = incoming.slice(0, remaining);
    if (incoming.length > remaining) {
      showInfo?.(
        "Some photos skipped",
        `Only ${remaining} more photo${remaining === 1 ? "" : "s"} allowed. The rest were not added.`,
      );
    }

    // Keep File objects for local previews
    setPortfolioFiles((prev) => [...prev, ...accepted]);
    const newPreviews = accepted.map((f) => URL.createObjectURL(f));
    setPortfolioPreviews((prev) => [...prev, ...newPreviews]);

    // Upload immediately + save to draft
    if (onUploadPortfolio) {
      setIsUploadingPortfolio(true);
      await onUploadPortfolio(accepted);
      setIsUploadingPortfolio(false);
    }

    e.target.value = "";
  };

  const removePortfolioFile = (index: number) => {
    setPortfolioFiles((prev) => prev.filter((_, i) => i !== index));
    if (portfolioPreviews[index]) URL.revokeObjectURL(portfolioPreviews[index]);
    setPortfolioPreviews((prev) => prev.filter((_, i) => i !== index));
    onRemovePortfolioPath?.(index);
  };

  // ── ID: upload immediately on selection ─────────────────────────────────
  const handleIdChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIdFile(file);

    if (onUploadIdFile) {
      setIsUploadingId(true);
      await onUploadIdFile(file);
      setIsUploadingId(false);
    }
  };

  const clearIdFile = () => {
    setIdFile(null);
    onRemoveIdFilePath?.();
    const input = document.getElementById("idInput") as HTMLInputElement;
    if (input) input.value = "";
  };

  // ── Step 5 submit ────────────────────────────────────────────────────────
  const submitProfile = async () => {
    const hasPortfolio =
      (draftFilePaths?.portfolioPaths.length ?? 0) > 0 ||
      portfolioFiles.length > 0;
    const hasId = !!draftFilePaths?.idFilePath || !!idFile;

    if (!hasPortfolio) {
      showError(
        "Portfolio missing",
        "Please upload at least 1 portfolio image.",
      );
      return;
    }
    if (!hasId) {
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
      phoneNumber: phone ?? "",
      whatsappNumber: whatsapp ?? "",
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
      } else {
        showSuccess(
          "Profile submitted",
          "Your account is now ready to receive customers.",
        );
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

  // ── Step labels ──────────────────────────────────────────────────────────
  const steps = [
    { number: 1, label: "Account" },
    { number: 2, label: "Profile" },
    { number: 3, label: "Services" },
    { number: 4, label: "Areas" },
    { number: 5, label: "Portfolio" },
  ];

  const customServices = selectedServices.filter((s) => s.isCustom);

  // ── Render ───────────────────────────────────────────────────────────────
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

        {/* ── STEP 1: Account ─────────────────────────────────────────────── */}
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

        {/* ── STEP 2: Profile ──────────────────────────────────────────────── */}
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

            {/* ── Phone Number (PhoneInput) ── */}
            <div className="form-group">
              <label className="form-label required">Phone Number</label>
              <div className="phone-input-wrapper">
                <PhoneInput
                  defaultCountry="ZW"
                  international
                  countryCallingCodeEditable={false}
                  limitMaxLength
                  value={phone}
                  onChange={(val) => {
                    if (val) {
                      const digits = val.replace(/\D/g, "");
                      const isZimbabwe = digits.startsWith("263");
                      if (isZimbabwe && digits.length > 12) return;
                    }
                    setPhone(val);
                  }}
                  placeholder="+263 77 123 4567"
                />
              </div>
              <span className="input-hint">
                Your main contact number for customers.
              </span>
            </div>

            {/* ── WhatsApp Number (PhoneInput) ── */}
            <div className="form-group">
              <label className="form-label required">WhatsApp Number</label>
              <div className="phone-input-wrapper">
                <PhoneInput
                  defaultCountry="ZW"
                  international
                  countryCallingCodeEditable={false}
                  limitMaxLength
                  value={whatsapp}
                  onChange={(val) => {
                    if (val) {
                      const digits = val.replace(/\D/g, "");
                      const isZimbabwe = digits.startsWith("263");
                      if (isZimbabwe && digits.length > 12) return;
                    }
                    setWhatsapp(val);
                  }}
                  placeholder="+263 77 123 4567"
                />
              </div>
              <span className="input-hint">
                The WhatsApp number customers can message you on.
              </span>
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

            {/* ── Experience — numbers only ── */}
            <div className="form-group">
              <label className="form-label required">Years of Experience</label>
              <input
                type="number"
                value={experience}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^\d+$/.test(val)) setExperience(val);
                }}
                onKeyDown={blockNonInteger}
                placeholder="e.g. 5"
                min={0}
                max={60}
                className="form-input"
              />
              <span className="input-hint">
                How many years have you worked in this field?
              </span>
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
              {/* ── Team Size — numbers only ── */}
              <div className="form-group">
                <label className="form-label required">Team Size</label>
                <input
                  type="number"
                  value={teamSize}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || /^\d+$/.test(val)) setTeamSize(val);
                  }}
                  onKeyDown={blockNonInteger}
                  placeholder="e.g. 3"
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

              {/* Show "already uploaded" banner if draft has a path but no local file */}
              {!profilePhoto && draftFilePaths?.profilePhotoPath && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 14px",
                    background: "rgba(34,197,94,0.06)",
                    border: "1.5px solid rgba(34,197,94,0.2)",
                    borderRadius: 10,
                    marginBottom: 12,
                    fontSize: 13,
                    color: "var(--color-text-secondary)",
                    fontWeight: 500,
                  }}
                >
                  ✅ Profile photo already uploaded from a previous session.
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() =>
                      document.getElementById("photoInput")?.click()
                    }
                    style={{ marginLeft: "auto" }}
                  >
                    Replace
                  </button>
                </div>
              )}

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
                !draftFilePaths?.profilePhotoPath && (
                  <div
                    onClick={() =>
                      document.getElementById("photoInput")?.click()
                    }
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
                )
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
                disabled={isSavingProfile}
              >
                {isSavingProfile ? "Saving..." : "Continue to Services"}
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

        {/* ── STEP 3: Services ─────────────────────────────────────────────── */}
        {currentStep === 3 && (
          <div className="form-section">
            <h2 className="form-title">Services You Offer</h2>
            <p className="form-description">
              Select services and set a starting price for each. Add custom
              services if yours aren&apos;t listed.
            </p>

            {/* NB: Starting price notice */}
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                background: "rgba(255,107,53,0.06)",
                border: "1.5px solid rgba(255,107,53,0.2)",
                borderRadius: 10,
                padding: "12px 16px",
                marginBottom: 24,
              }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>💡</span>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                <strong style={{ color: "var(--color-primary)" }}>NB:</strong>{" "}
                The price you enter for each service is a{" "}
                <strong>starting price only</strong> — it gives customers an
                idea of your rates. The final price will be agreed upon between
                you and the customer based on the specific job requirements.
              </p>
            </div>

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
                disabled={isSavingServices}
              >
                {isSavingServices ? "Saving..." : "Continue to Service Areas"}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Areas ────────────────────────────────────────────────── */}
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <label className="form-label required" style={{ margin: 0 }}>
                  Add Service Areas (at least 2)
                </label>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color:
                      areas.length >= MAX_AREAS
                        ? "#ef4444"
                        : "var(--color-text-secondary)",
                    background:
                      areas.length >= MAX_AREAS
                        ? "rgba(239,68,68,0.08)"
                        : "var(--color-bg-section)",
                    padding: "3px 10px",
                    borderRadius: 999,
                    border: `1px solid ${areas.length >= MAX_AREAS ? "rgba(239,68,68,0.2)" : "var(--color-border)"}`,
                  }}
                >
                  {areas.length}/{MAX_AREAS}
                </span>
              </div>

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
              ) : areas.length >= MAX_AREAS ? (
                <div
                  style={{
                    fontSize: 13,
                    color: "#d97706",
                    background: "rgba(245,158,11,0.08)",
                    border: "1.5px solid rgba(245,158,11,0.2)",
                    borderRadius: 8,
                    padding: "9px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontWeight: 500,
                    marginTop: 4,
                  }}
                >
                  Maximum of {MAX_AREAS} service areas reached. Remove one to
                  add another.
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
                disabled={isSavingAreas}
              >
                {isSavingAreas ? "Saving..." : "Continue to Portfolio"}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5: Portfolio & ID ────────────────────────────────────────── */}
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
                <span style={{ fontWeight: 400 }}>
                  (at least 1, max {MAX_PORTFOLIO} photos)
                </span>
              </label>

              {/* Already uploaded from draft — no local files present */}
              {(draftFilePaths?.portfolioPaths.length ?? 0) > 0 &&
                portfolioFiles.length === 0 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 14px",
                      background: "rgba(34,197,94,0.06)",
                      border: "1.5px solid rgba(34,197,94,0.2)",
                      borderRadius: 10,
                      marginBottom: 12,
                      fontSize: 13,
                      color: "var(--color-text-secondary)",
                      fontWeight: 500,
                    }}
                  >
                    ✅ {draftFilePaths!.portfolioPaths.length} portfolio photo
                    {draftFilePaths!.portfolioPaths.length > 1 ? "s" : ""}{" "}
                    already uploaded from a previous session.
                  </div>
                )}

              {/* Upload zone — hidden once limit reached */}
              {(draftFilePaths?.portfolioPaths.length ??
                portfolioFiles.length) < MAX_PORTFOLIO && (
                <div
                  onClick={() =>
                    !isUploadingPortfolio &&
                    document.getElementById("portfolioInput")?.click()
                  }
                  className="file-upload-zone"
                  style={{
                    marginBottom: portfolioFiles.length > 0 ? 12 : 0,
                    opacity: isUploadingPortfolio ? 0.6 : 1,
                    cursor: isUploadingPortfolio ? "not-allowed" : "pointer",
                  }}
                >
                  <div className="file-upload-icon" />
                  <div className="file-upload-text">
                    {isUploadingPortfolio
                      ? "Uploading..."
                      : portfolioFiles.length === 0 &&
                          (draftFilePaths?.portfolioPaths.length ?? 0) === 0
                        ? "Click to upload portfolio images"
                        : "Click to add more photos"}
                  </div>
                  <div className="file-upload-hint">
                    Upload photos of your completed work. JPG or PNG, max 5MB
                    each.
                    {(draftFilePaths?.portfolioPaths.length ??
                      portfolioFiles.length) > 0 && (
                      <span
                        style={{
                          color: "var(--color-accent)",
                          fontWeight: 600,
                          marginLeft: 6,
                        }}
                      >
                        {draftFilePaths?.portfolioPaths.length ??
                          portfolioFiles.length}
                        /{MAX_PORTFOLIO} photos added
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Limit reached notice */}
              {(draftFilePaths?.portfolioPaths.length ??
                portfolioFiles.length) >= MAX_PORTFOLIO && (
                <div
                  style={{
                    fontSize: 13,
                    color: "#d97706",
                    background: "rgba(245,158,11,0.08)",
                    border: "1.5px solid rgba(245,158,11,0.2)",
                    borderRadius: 8,
                    padding: "9px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontWeight: 500,
                    marginBottom: 12,
                  }}
                >
                  Maximum of {MAX_PORTFOLIO} portfolio photos reached. Remove
                  one to add another.
                </div>
              )}

              <input
                type="file"
                id="portfolioInput"
                accept="image/*"
                multiple
                onChange={handlePortfolioChange}
                className="file-input"
                disabled={isUploadingPortfolio}
              />

              {/* Local file previews */}
              {portfolioFiles.length > 0 && (
                <div className="portfolio-previews">
                  {portfolioFiles.map((file, i) => {
                    const url =
                      portfolioPreviews[i] ?? URL.createObjectURL(file);
                    return (
                      <div key={i} className="portfolio-preview-item">
                        <img src={url} alt={`Portfolio ${i + 1}`} />
                        <div className="portfolio-preview-badge">{i + 1}</div>
                        <button
                          type="button"
                          className="portfolio-remove-btn"
                          onClick={() => removePortfolioFile(i)}
                          aria-label="Remove image"
                          disabled={isUploadingPortfolio}
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
                Government ID or Business Registration{" "}
              </label>

              {/* NB: ID purpose notice */}
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  background: "rgba(59,130,246,0.05)",
                  border: "1.5px solid rgba(59,130,246,0.18)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  marginBottom: 14,
                }}
              >
                <span style={{ fontSize: 16, lineHeight: 1.2 }}>🔒</span>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  <strong style={{ color: "var(--color-primary)" }}>NB:</strong>{" "}
                  Your government-issued ID or business registration document
                  serves as an official point of reference in the unlikely event
                  of a dispute between you and a client. It is stored securely,
                  accessible only to authorised ZimServ staff, and will{" "}
                  <strong>never</strong> be shared with or disclosed to
                  customers under any circumstances.
                </p>
              </div>

              {/* Already uploaded from draft — no local file */}
              {!idFile && draftFilePaths?.idFilePath && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 14px",
                    background: "rgba(34,197,94,0.06)",
                    border: "1.5px solid rgba(34,197,94,0.2)",
                    borderRadius: 10,
                    marginBottom: 12,
                    fontSize: 13,
                    color: "var(--color-text-secondary)",
                    fontWeight: 500,
                  }}
                >
                  ✅ ID document already uploaded from a previous session.
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() => document.getElementById("idInput")?.click()}
                    style={{ marginLeft: "auto" }}
                    disabled={isUploadingId}
                  >
                    Replace
                  </button>
                </div>
              )}

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
                    {isUploadingId && (
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--color-accent)",
                          fontWeight: 600,
                        }}
                      >
                        Uploading...
                      </span>
                    )}
                  </div>
                  <div className="photo-preview-actions">
                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      onClick={() =>
                        document.getElementById("idInput")?.click()
                      }
                      disabled={isUploadingId}
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      className="photo-remove-btn"
                      onClick={clearIdFile}
                      aria-label="Remove ID file"
                      title="Remove ID file"
                      disabled={isUploadingId}
                    >
                      <X size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              ) : (
                !draftFilePaths?.idFilePath && (
                  <div
                    onClick={() =>
                      !isUploadingId &&
                      document.getElementById("idInput")?.click()
                    }
                    className="file-upload-zone"
                    style={{
                      opacity: isUploadingId ? 0.6 : 1,
                      cursor: isUploadingId ? "not-allowed" : "pointer",
                    }}
                  >
                    <div className="file-upload-icon" />
                    <div className="file-upload-text">
                      {isUploadingId
                        ? "Uploading..."
                        : "Upload a photo or scan of your ID or business registration"}
                    </div>
                    <div className="file-upload-hint">
                      This is only visible to ZimServ staff for verification and
                      safety. It will never be publicly displayed on your
                      profile.
                    </div>
                  </div>
                )
              )}
              <input
                type="file"
                id="idInput"
                accept="image/*,application/pdf"
                onChange={handleIdChange}
                className="file-input"
                disabled={isUploadingId}
              />
            </div>

            <div className="form-actions">
              <button
                onClick={prevStep}
                className="btn-secondary"
                disabled={isSubmitting}
              >
                Back
              </button>
              <button
                onClick={submitProfile}
                className="btn-primary"
                disabled={isSubmitting || isUploadingPortfolio || isUploadingId}
              >
                {isSubmitting
                  ? "Submitting..."
                  : isUploadingPortfolio || isUploadingId
                    ? "Uploading files..."
                    : "Submit for Review"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingSteps;
