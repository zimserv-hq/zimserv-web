// Location: src/pages/ProviderOnboarding.tsx
// Provider onboarding flow for approved providers to complete their profile

import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import OnboardingSteps from "../components/Onboarding/OnboardingSteps";
import { supabase } from "../lib/supabaseClient";
import { useToast } from "../contexts/ToastContext";

// ── ServiceEntry type ────────────────────────────────────────────────────────
export type ServiceEntry = {
  name: string;
  price: string;
  isCustom: boolean;
};

export interface OnboardingData {
  // Step 1: Account
  email: string;
  password: string;

  // Step 2: Profile
  fullName: string;
  businessName: string;
  phoneNumber: string;
  whatsappNumber?: string;
  description: string;
  experience: string;
  teamSize: string;
  website?: string;
  languages: string[];
  callAvailable: boolean;
  whatsappAvailable: boolean;
  emergencyAvailable: boolean;
  profilePhoto: File | null;

  // Step 3: Services
  category: string;
  selectedServices: ServiceEntry[];
  pricingModel: string;

  // Step 4: Areas
  city: string;
  areas: string[];

  // Step 5: Portfolio
  portfolioFiles: File[];
  licenseFiles: File[];
  idFile: File | null;
}

// ── Step persistence key ─────────────────────────────────────────────────────
const STEP_KEY = "zimserv_onboarding_step";

// ── Slug generator ───────────────────────────────────────────────────────────
const generateSlug = (businessName: string, fullName: string): string => {
  const rawName = (businessName || fullName).trim();
  return rawName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

const ProviderOnboarding = () => {
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("application_id");
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToast();

  const getInitialStep = () => {
    try {
      const saved = sessionStorage.getItem(STEP_KEY);
      const parsed = saved ? parseInt(saved, 10) : 1;
      return Number.isNaN(parsed) ? 1 : parsed;
    } catch {
      return 1;
    }
  };

  const [currentStep, setCurrentStep] = useState<number>(getInitialStep);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const [formData, setFormData] = useState<OnboardingData>({
    email: "",
    password: "",
    fullName: "",
    businessName: "",
    phoneNumber: "",
    whatsappNumber: "",
    description: "",
    experience: "",
    teamSize: "",
    website: "",
    languages: ["English"],
    callAvailable: true,
    whatsappAvailable: true,
    emergencyAvailable: false,
    profilePhoto: null,
    category: "Plumbing",
    selectedServices: [],
    pricingModel: "Quote-based",
    city: "",
    areas: [],
    portfolioFiles: [],
    licenseFiles: [],
    idFile: null,
  });

  const [loadError, setLoadError] = useState<string | null>(null);

  const setStep = (step: number) => {
    setCurrentStep(step);
    try {
      sessionStorage.setItem(STEP_KEY, String(step));
    } catch {
      // ignore
    }
  };

  const updateFormData = (data: Partial<OnboardingData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    const next = Math.min(currentStep + 1, 5);
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = () => {
    const prev = Math.max(currentStep - 1, 1);
    setStep(prev);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Preload application data ─────────────────────────────────────────────
  const preloadFromApplication = async (
    applicationId: string,
    email: string,
  ) => {
    try {
      setLoadError(null);

      const { data, error } = await supabase
        .from("provider_applications")
        .select("*")
        .eq("id", applicationId)
        .eq("email", email.toLowerCase())
        .single();

      if (error || !data) {
        console.error("Error loading application for onboarding:", error);
        setLoadError("Could not load your application details.");
        showError(
          "Application not found",
          "We could not find your application with this email. Please contact support.",
        );
        return;
      }

      setFormData((prev) => ({
        ...prev,
        email: data.email ?? prev.email,
        fullName: data.full_name ?? prev.fullName,
        phoneNumber: data.phone_number ?? prev.phoneNumber,
        whatsappNumber: data.whatsapp_number ?? prev.whatsappNumber,
        description: data.description ?? prev.description,
        city: data.city ?? prev.city,
        category: data.primary_category ?? prev.category,
      }));
    } catch (e) {
      console.error("Unexpected error while loading application:", e);
      setLoadError("Unexpected error while loading application details.");
      showError(
        "Error",
        "An unexpected error occurred while loading your application.",
      );
    }
  };

  // ── 1️⃣ FIRST: Handle invite hash tokens from email link ─────────────────
  useEffect(() => {
    const handleInviteHash = async () => {
      const hash = window.location.hash;
      if (!hash || !hash.includes("access_token")) return;

      const params = new URLSearchParams(hash.replace("#", ""));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const type = params.get("type");

      if (type !== "invite" || !accessToken || !refreshToken) return;

      console.log("📧 Invite hash detected — establishing session...");

      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (sessionError) {
        console.error(
          "❌ Failed to set session from invite hash:",
          sessionError,
        );
        showError(
          "Invite link expired",
          "Your invite link has expired. Please contact support for a new one.",
        );
        return;
      }

      // Clean tokens from URL bar — keep application_id query param
      window.history.replaceState(
        null,
        "",
        `/provider/onboarding${applicationId ? `?application_id=${applicationId}` : ""}`,
      );

      console.log("✅ Session established from invite link");
    };

    handleInviteHash();
  }, []);

  // ── 2️⃣ SECOND: Check session and decide starting step ───────────────────
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const userEmail = session.user.email ?? "";
          const passwordSet = session.user.user_metadata?.password_set === true;

          if (!passwordSet) {
            // Fresh invite — stay on Step 1, no toast
            setStep(1);
          } else {
            // Returning mid-onboarding user — resume from saved step
            const stored = getInitialStep();
            if (stored <= 1) {
              setStep(2);
            }
            showInfo?.(
              "Session restored",
              "We detected an active session and resumed your onboarding.",
            );
          }

          if (applicationId && userEmail) {
            await preloadFromApplication(applicationId, userEmail);
          }
        }
      } catch (err) {
        console.error("Error checking session on mount:", err);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkExistingSession();
  }, []);

  // ── 3️⃣ THIRD: Clear step on page unload ────────────────────────────────
  useEffect(() => {
    const handleUnload = () => {
      sessionStorage.removeItem(STEP_KEY);
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  // ── Step 1: Account submit ───────────────────────────────────────────────
  const handleAccountSubmit = async (
    email: string,
    password: string,
  ): Promise<boolean> => {
    setLoadError(null);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error getting session:", sessionError);
      }

      if (!session) {
        setLoadError(
          "Your invitation session has expired. Please click the invite link again.",
        );
        showError(
          "Session expired",
          "Your invite session is no longer active. Please reopen the link from your email.",
        );
        return false;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password,
        data: { password_set: true },
      });

      if (updateError) {
        const msg = String(updateError.message || "").toLowerCase();

        if (msg.includes("different from the old")) {
          await supabase.auth.updateUser({ data: { password_set: true } });
          showSuccess(
            "Account secured",
            "Your password was already set. Continuing to your profile.",
          );
        } else {
          console.error(
            "Auth updateUser error during onboarding:",
            updateError,
          );
          setLoadError("Could not set your password. Please try again.");
          showError(
            "Password error",
            updateError.message ||
              "We were unable to set your password. Please try again.",
          );
          return false;
        }
      } else {
        showSuccess(
          "Account secured",
          "Your password has been set successfully.",
        );
      }

      if (applicationId) {
        await preloadFromApplication(applicationId, email);
      }

      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return true;
    } catch (err) {
      console.error("Unexpected error in handleAccountSubmit:", err);
      setLoadError("Unexpected error while creating your account.");
      showError(
        "Unexpected error",
        "Something went wrong while creating your account. Please try again.",
      );
      return false;
    }
  };

  // ── File upload helper ───────────────────────────────────────────────────
  const uploadFile = async (
    file: File,
    _providerId: string,
    folder: string,
  ): Promise<string | null> => {
    try {
      const ext = file.name.split(".").pop() || "bin";
      const fileName = `${folder}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("provider-media")
        .upload(fileName, file);

      if (error) {
        console.error("Error uploading file to storage:", error);
        return null;
      }

      return fileName;
    } catch (err) {
      console.error("Unexpected error during file upload:", err);
      return null;
    }
  };

  // ── Send "profile received" email ────────────────────────────────────────
  const sendProfileReceivedEmail = async (email: string, fullName: string) => {
    try {
      const { error } = await supabase.functions.invoke(
        "send-profile-received-email",
        { body: { email, fullName } },
      );
      if (error) {
        console.error("Failed to send profile received email:", error);
      }
    } catch (err) {
      console.error("Unexpected error sending profile received email:", err);
    }
  };

  // ── Step 5: Full profile submit ──────────────────────────────────────────
  const handleSubmitProfile = async (profileData: OnboardingData) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("No authenticated user for onboarding:", userError);
        showError(
          "Not signed in",
          "You need to be signed in to submit your profile.",
        );
        return;
      }

      const slug = generateSlug(profileData.businessName, profileData.fullName);

      const yearsInt =
        typeof profileData.experience === "string"
          ? parseInt(profileData.experience, 10) || null
          : null;

      const providerPayload = {
        user_id: user.id,
        slug,
        status: "pending_review",
        activated_at: new Date().toISOString(),
        email: profileData.email,
        full_name: profileData.fullName,
        business_name: profileData.businessName || null,
        phone_number: profileData.phoneNumber,
        whatsapp_number: profileData.whatsappNumber || null,
        primary_category: profileData.category,
        city: profileData.city,
        bio: profileData.description,
        years_experience: yearsInt,
        call_available: profileData.callAvailable,
        whatsapp_available: profileData.whatsappAvailable,
        pricing_model: profileData.pricingModel,
        website: profileData.website || null,
        languages: profileData.languages,
        profile_completed: true,
      };

      const { data: providerInsert, error: providerError } = await supabase
        .from("providers")
        .insert(providerPayload)
        .select("id")
        .single();

      if (providerError || !providerInsert) {
        // Slug collision — retry once
        if (
          providerError?.code === "23505" &&
          providerError.message.includes("slug")
        ) {
          console.warn(
            "[handleSubmitProfile] slug collision — retrying with suffix...",
          );

          const suffix = Math.random().toString(36).slice(2, 6);
          const retrySlug = `${generateSlug(profileData.businessName, profileData.fullName)}-${suffix}`;

          const { data: retryInsert, error: retryError } = await supabase
            .from("providers")
            .insert({ ...providerPayload, slug: retrySlug })
            .select("id")
            .single();

          if (retryError || !retryInsert) {
            console.error("Retry insert failed:", retryError);
            showError(
              "Submission failed",
              "We could not save your profile. Please try again.",
            );
            return;
          }

          await insertRelatedData(profileData, retryInsert.id as string);
          await sendProfileReceivedEmail(
            profileData.email,
            profileData.fullName,
          );
          showSuccess(
            "Profile submitted!",
            "Check your email for instructions on how to access your dashboard.",
          );
          sessionStorage.removeItem(STEP_KEY);
          navigate("/provider/login");
          return;
        }

        // Phone number duplicate
        if (providerError?.code === "23505") {
          console.error("Duplicate provider phone number:", providerError);
          showError(
            "Phone already registered",
            "This phone number is already linked to a provider account. Try logging in or contact support.",
          );
          return;
        }

        console.error("Error inserting provider:", providerError);
        showError(
          "Submission failed",
          "We could not save your main profile. Please try again.",
        );
        return;
      }

      const providerId = providerInsert.id as string;
      await insertRelatedData(profileData, providerId);
      await sendProfileReceivedEmail(profileData.email, profileData.fullName);
      showSuccess(
        "Profile submitted!",
        "Check your email for instructions on how to access your dashboard.",
      );
      sessionStorage.removeItem(STEP_KEY);
      navigate("/provider/login");
    } catch (err) {
      console.error("Error submitting provider profile:", err);
      showError(
        "Submission failed",
        "We could not save your profile. Please try again.",
      );
    }
  };

  // ── Insert services, areas, media ────────────────────────────────────────
  const insertRelatedData = async (
    profileData: OnboardingData,
    providerId: string,
  ) => {
    // Services
    if (profileData.selectedServices.length > 0) {
      const servicesPayload = profileData.selectedServices.map((svc) => ({
        provider_id: providerId,
        service_name: svc.name,
        price:
          svc.price && !isNaN(parseFloat(svc.price))
            ? parseFloat(svc.price)
            : null,
        is_custom: svc.isCustom,
        service_keywords: [],
      }));

      const { error: servicesError } = await supabase
        .from("provider_services")
        .insert(servicesPayload);

      if (servicesError) {
        console.error("Error inserting provider_services:", servicesError);
        showError(
          "Services not saved",
          "We saved your profile but had trouble saving your services.",
        );
      }
    }

    // Service areas
    if (profileData.areas.length > 0) {
      const areasPayload = profileData.areas.map((suburb) => ({
        provider_id: providerId,
        city: profileData.city,
        suburb,
      }));

      const { error: areasError } = await supabase
        .from("provider_service_areas")
        .insert(areasPayload);

      if (areasError) {
        console.error("Error inserting provider_service_areas:", areasError);
        showError(
          "Areas not saved",
          "We saved your profile but had trouble saving your service areas.",
        );
      }
    }

    // Profile photo
    if (profileData.profilePhoto) {
      const path = await uploadFile(
        profileData.profilePhoto,
        providerId,
        `providers/${providerId}/profile`,
      );

      if (path) {
        const { data: urlData } = supabase.storage
          .from("provider-media")
          .getPublicUrl(path);
        const publicUrl = urlData.publicUrl;

        const { error: mediaError } = await supabase
          .from("provider_media")
          .insert({
            provider_id: providerId,
            media_type: "profile_photo",
            file_path: path,
          });
        if (mediaError) {
          console.error("Error inserting profile_photo media:", mediaError);
        }

        const { error: profileImgError } = await supabase
          .from("providers")
          .update({ profile_image_url: publicUrl })
          .eq("id", providerId);
        if (profileImgError) {
          console.error("Error updating profile_image_url:", profileImgError);
          showError(
            "Profile photo not linked",
            "Your photo was uploaded but could not be set as your profile image.",
          );
        }
      }
    }

    // Portfolio images
    if (profileData.portfolioFiles.length > 0) {
      const portfolioPayload: {
        provider_id: string;
        media_type: string;
        file_path: string;
      }[] = [];

      for (const file of profileData.portfolioFiles) {
        const path = await uploadFile(
          file,
          providerId,
          `providers/${providerId}/portfolio`,
        );
        if (path) {
          portfolioPayload.push({
            provider_id: providerId,
            media_type: "portfolio",
            file_path: path,
          });
        }
      }

      if (portfolioPayload.length > 0) {
        const { error: portfolioError } = await supabase
          .from("provider_media")
          .insert(portfolioPayload);
        if (portfolioError) {
          console.error("Error inserting portfolio media:", portfolioError);
          showError(
            "Portfolio not fully saved",
            "Some portfolio images could not be saved.",
          );
        }
      }
    }

    // License files
    if (profileData.licenseFiles.length > 0) {
      const licensePayload: {
        provider_id: string;
        media_type: string;
        file_path: string;
      }[] = [];

      for (const file of profileData.licenseFiles) {
        const path = await uploadFile(
          file,
          providerId,
          `providers/${providerId}/licenses`,
        );
        if (path) {
          licensePayload.push({
            provider_id: providerId,
            media_type: "license",
            file_path: path,
          });
        }
      }

      if (licensePayload.length > 0) {
        const { error: licenseError } = await supabase
          .from("provider_media")
          .insert(licensePayload);
        if (licenseError) {
          console.error("Error inserting license media:", licenseError);
          showError(
            "Licenses not fully saved",
            "Some license documents could not be saved.",
          );
        }
      }
    }

    // ID document
    if (profileData.idFile) {
      const path = await uploadFile(
        profileData.idFile,
        providerId,
        `providers/${providerId}/ID`,
      );

      if (path) {
        const { error: idError } = await supabase
          .from("provider_media")
          .insert({
            provider_id: providerId,
            media_type: "id_document",
            file_path: path,
          });
        if (idError) {
          console.error("Error inserting id_document media:", idError);
          showError(
            "ID not saved",
            "Your ID document was uploaded but could not be saved.",
          );
        }
      }
    }
  };

  const stepLabels = ["Account", "Profile", "Services", "Areas", "Portfolio"];

  if (isCheckingSession) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--color-bg-section)",
          fontFamily: "var(--font-primary)",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid var(--color-border)",
            borderTop: "3px solid var(--color-accent)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p style={{ color: "var(--color-text-secondary)", fontSize: "15px" }}>
          Checking your session...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Complete Your Provider Profile | ZimServ"
        description="Complete your ZimServ provider profile to start receiving customer inquiries."
        keywords="provider registration, service provider signup, ZimServ onboarding"
        url="/provider/onboarding"
      />

      <Breadcrumb
        items={[
          { label: "Provider Onboarding" },
          { label: stepLabels[currentStep - 1] },
        ]}
      />

      <OnboardingSteps
        currentStep={currentStep}
        formData={formData}
        updateFormData={updateFormData}
        nextStep={nextStep}
        prevStep={prevStep}
        onAccountSubmit={handleAccountSubmit}
        onSubmitProfile={handleSubmitProfile}
        loadError={loadError}
      />
    </>
  );
};

export default ProviderOnboarding;
