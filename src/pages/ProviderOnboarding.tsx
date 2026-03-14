// Location: src/pages/ProviderOnboarding.tsx
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import SEO from "../components/SEO";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import OnboardingSteps from "../components/Onboarding/OnboardingSteps";
import { supabase } from "../lib/supabaseClient";
import { useToast } from "../contexts/ToastContext";

export type ServiceEntry = {
  name: string;
  price: string;
  isCustom: boolean;
};

export interface OnboardingData {
  email: string;
  password: string;
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
  existingProfilePhotoUrl?: string; // ← restored from DB on refresh
  category: string;
  selectedServices: ServiceEntry[];
  pricingModel: string;
  city: string;
  areas: string[];
  portfolioFiles: File[];
  licenseFiles: File[];
  idFile: File | null;
}

const STEP_KEY = "zimserv_onboarding_step";
const PROVIDER_ID_KEY = "zimserv_onboarding_provider_id";

const generateSlug = (businessName: string, fullName: string): string => {
  const rawName = (businessName || fullName).trim();
  return rawName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

const compressImage = async (file: File): Promise<File> => {
  if (!file.type.startsWith("image/")) return file;
  try {
    return await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    });
  } catch {
    return file;
  }
};

const batchedUpload = async <T,>(
  items: T[],
  fn: (item: T) => Promise<string | null>,
  batchSize = 3,
): Promise<(string | null)[]> => {
  const results: (string | null)[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
};

// ─────────────────────────────────────────────────────────────────────────────

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

  const getStoredProviderId = (): string | null => {
    try {
      return sessionStorage.getItem(PROVIDER_ID_KEY);
    } catch {
      return null;
    }
  };

  const [currentStep, setCurrentStep] = useState<number>(getInitialStep);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [inviteExpired, setInviteExpired] = useState(false);
  const [providerId, setProviderId] = useState<string | null>(
    getStoredProviderId,
  );
  const providerIdRef = useRef<string | null>(providerId);

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
    existingProfilePhotoUrl: undefined,
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
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    providerIdRef.current = providerId;
  }, [providerId]);

  const storeProviderId = (id: string) => {
    setProviderId(id);
    providerIdRef.current = id;
    try {
      sessionStorage.setItem(PROVIDER_ID_KEY, id);
    } catch {}
  };

  const setStep = (step: number) => {
    setCurrentStep(step);
    try {
      sessionStorage.setItem(STEP_KEY, String(step));
    } catch {}
  };

  const updateFormData = (data: Partial<OnboardingData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const prevStep = () => {
    const prev = Math.max(currentStep - 1, 1);
    setStep(prev);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Preload application data ───────────────────────────────────────────
  const preloadFromApplication = async (appId: string, email: string) => {
    try {
      setLoadError(null);
      const { data, error } = await supabase
        .from("provider_applications")
        .select("*")
        .eq("id", appId)
        .eq("email", email.toLowerCase())
        .single();

      if (error || !data) {
        setLoadError("Could not load your application details.");
        showError(
          "Application not found",
          "We could not find your application. Please contact support.",
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
    } catch {
      setLoadError("Unexpected error while loading application details.");
      showError(
        "Error",
        "An unexpected error occurred loading your application.",
      );
    }
  };

  // ── Restore draft provider row on refresh ──────────────────────────────
  const restoreDraftProvider = async (userId: string) => {
    try {
      const { data } = await supabase
        .from("providers")
        .select(
          `id, full_name, business_name, phone_number, whatsapp_number,
           primary_category, city, bio, years_experience, call_available,
           whatsapp_available, pricing_model, website, languages,
           profile_completed, email, profile_image_url`,
        )
        .eq("user_id", userId)
        .eq("status", "draft")
        .maybeSingle();

      if (!data) return;

      storeProviderId(data.id);

      // Restore all text fields + existing profile photo URL
      setFormData((prev) => ({
        ...prev,
        email: data.email ?? prev.email,
        fullName: data.full_name ?? prev.fullName,
        businessName: data.business_name ?? prev.businessName,
        phoneNumber: data.phone_number ?? prev.phoneNumber,
        whatsappNumber: data.whatsapp_number ?? prev.whatsappNumber,
        description: data.bio ?? prev.description,
        experience: data.years_experience
          ? String(data.years_experience)
          : prev.experience,
        callAvailable: data.call_available ?? prev.callAvailable,
        whatsappAvailable: data.whatsapp_available ?? prev.whatsappAvailable,
        pricingModel: data.pricing_model ?? prev.pricingModel,
        website: data.website ?? prev.website,
        languages: data.languages ?? prev.languages,
        city: data.city ?? prev.city,
        category: data.primary_category ?? prev.category,
        // ── Restore profile photo URL so Step 2 shows the preview ────────
        existingProfilePhotoUrl: data.profile_image_url ?? undefined,
      }));

      // Restore services and areas in parallel
      const [{ data: services }, { data: areas }] = await Promise.all([
        supabase
          .from("provider_services")
          .select("service_name, price, is_custom")
          .eq("provider_id", data.id),
        supabase
          .from("provider_service_areas")
          .select("suburb")
          .eq("provider_id", data.id),
      ]);

      if (services?.length) {
        setFormData((prev) => ({
          ...prev,
          selectedServices: services.map((s) => ({
            name: s.service_name,
            price: s.price ? String(s.price) : "",
            isCustom: s.is_custom,
          })),
        }));
      }

      if (areas?.length) {
        setFormData((prev) => ({
          ...prev,
          areas: areas.map((a) => a.suburb),
        }));
      }
    } catch (err) {
      console.error("Error restoring draft provider:", err);
    }
  };

  // ── Effects ────────────────────────────────────────────────────────────

  // 1️⃣ Handle invite hash tokens
  useEffect(() => {
    const handleInviteHash = async () => {
      const hash = window.location.hash;
      if (!hash) return;
      const params = new URLSearchParams(hash.replace("#", ""));
      if (
        params.get("error") === "access_denied" ||
        params.get("error_code") === "otp_expired"
      )
        return;
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const type = params.get("type");
      if (type !== "invite" || !accessToken || !refreshToken) return;

      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (sessionError) {
        showError(
          "Invite link expired",
          "Your invite link has expired. Please contact support.",
        );
        return;
      }

      window.history.replaceState(
        null,
        "",
        `/provider/onboarding${applicationId ? `?application_id=${applicationId}` : ""}`,
      );
    };
    handleInviteHash();
  }, []);

  // 2️⃣ Check session and restore state
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
            setStep(1);
          } else {
            const stored = getInitialStep();
            if (stored <= 1) setStep(2);
            showInfo?.(
              "Session restored",
              "We resumed your onboarding where you left off.",
            );
          }

          // Restore draft from DB — handles refresh on any step
          await restoreDraftProvider(session.user.id);

          if (applicationId && userEmail) {
            await preloadFromApplication(applicationId, userEmail);
          }
        }
      } catch (err) {
        console.error("Error checking session:", err);
      } finally {
        setIsCheckingSession(false);
      }
    };
    checkExistingSession();
  }, []);

  // 3️⃣ Clear storage on tab close
  useEffect(() => {
    const handleUnload = () => {
      sessionStorage.removeItem(STEP_KEY);
      sessionStorage.removeItem(PROVIDER_ID_KEY);
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  // 4️⃣ Handle expired invite
  useEffect(() => {
    const handleExpiredInvite = async () => {
      const hash = window.location.hash;
      if (!hash) return;
      const params = new URLSearchParams(hash.replace("#", ""));
      const isExpired =
        (params.get("type") === "invite" &&
          params.get("error") === "access_denied") ||
        params.get("error_code") === "otp_expired";

      if (!isExpired || !applicationId) return;

      setInviteExpired(true);
      try {
        await supabase
          .from("provider_applications")
          .update({ status: "pending" })
          .eq("id", applicationId);
      } catch (err) {
        console.error("Error resetting application status:", err);
      }
      window.history.replaceState(
        null,
        "",
        `/provider/onboarding?application_id=${applicationId}`,
      );
    };
    handleExpiredInvite();
  }, [applicationId]);

  // ── File upload helper ─────────────────────────────────────────────────
  const uploadFile = async (
    file: File,
    _providerId: string,
    folder: string,
    retries = 3,
  ): Promise<string | null> => {
    const ext = file.name.split(".").pop() || "bin";
    const fileName = `${folder}/${crypto.randomUUID()}.${ext}`;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const { error } = await supabase.storage
          .from("provider-media")
          .upload(fileName, file, { upsert: false, cacheControl: "3600" });
        if (!error) return fileName;
      } catch {}
      if (attempt < retries)
        await new Promise<void>((res) =>
          setTimeout(res, Math.pow(2, attempt) * 1000),
        );
    }
    return null;
  };

  // ── STEP 1: Create account + draft provider row ────────────────────────
  const handleAccountSubmit = async (
    email: string,
    password: string,
  ): Promise<boolean> => {
    setLoadError(null);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        showError(
          "Session expired",
          "Your invite session expired. Please reopen the link from your email.",
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
        } else {
          showError(
            "Password error",
            updateError.message || "Could not set your password.",
          );
          return false;
        }
      }

      setIsSaving(true);
      const slug = generateSlug("", email.split("@")[0]);
      const suffix = Math.random().toString(36).slice(2, 6);

      const { data: draft, error: draftError } = await supabase
        .from("providers")
        .insert({
          user_id: session.user.id,
          email: email.toLowerCase(),
          slug: `${slug}-${suffix}`,
          status: "draft",
          profile_completed: false,
        })
        .select("id")
        .single();

      if (draftError || !draft) {
        // Draft row already exists (e.g. refresh after Step 1) — recover it
        const { data: existing } = await supabase
          .from("providers")
          .select("id")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (existing) {
          storeProviderId(existing.id);
        } else {
          showError(
            "Setup failed",
            "Could not create your profile draft. Please try again.",
          );
          return false;
        }
      } else {
        storeProviderId(draft.id);
      }

      if (applicationId) {
        await preloadFromApplication(applicationId, email);
      }

      showSuccess(
        "Account secured",
        "Your password has been set successfully.",
      );
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return true;
    } catch {
      showError("Unexpected error", "Something went wrong. Please try again.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // ── STEP 2: Save profile fields ────────────────────────────────────────
  const handleProfileSave = async (data: OnboardingData): Promise<boolean> => {
    const pid = providerIdRef.current;
    if (!pid) {
      showError("Session lost", "Please go back to Step 1.");
      return false;
    }

    setIsSaving(true);
    try {
      const yearsInt = data.experience
        ? parseInt(data.experience, 10) || null
        : null;
      const slug = generateSlug(data.businessName, data.fullName);
      const suffix = Math.random().toString(36).slice(2, 6);

      const { error } = await supabase
        .from("providers")
        .update({
          full_name: data.fullName,
          business_name: data.businessName || null,
          slug: data.businessName || data.fullName ? slug : `${slug}-${suffix}`,
          phone_number: data.phoneNumber,
          whatsapp_number: data.whatsappNumber || null,
          primary_category: data.category,
          city: data.city,
          bio: data.description,
          years_experience: yearsInt,
          call_available: data.callAvailable,
          whatsapp_available: data.whatsappAvailable,
          emergency_available: data.emergencyAvailable,
          pricing_model: data.pricingModel,
          website: data.website || null,
          languages: data.languages,
          team_size: data.teamSize || null,
        })
        .eq("id", pid);

      if (error) {
        if (error.code === "23505") {
          showError(
            "Phone already registered",
            "This phone number is linked to another account.",
          );
          return false;
        }
        showError(
          "Save failed",
          "Could not save your profile. Please try again.",
        );
        return false;
      }

      // ── Upload profile photo only if a NEW file was selected ──────────
      // If existingProfilePhotoUrl is set and profilePhoto is null,
      // the photo is already in storage — skip upload entirely.
      if (data.profilePhoto) {
        const compressed = await compressImage(data.profilePhoto);
        const path = await uploadFile(
          compressed,
          pid,
          `providers/${pid}/profile`,
        );
        if (path) {
          const { data: urlData } = supabase.storage
            .from("provider-media")
            .getPublicUrl(path);
          const publicUrl = urlData.publicUrl;

          await Promise.all([
            supabase.from("provider_media").upsert(
              {
                provider_id: pid,
                media_type: "profile_photo",
                file_path: path,
              },
              { onConflict: "provider_id,media_type" },
            ),
            supabase
              .from("providers")
              .update({ profile_image_url: publicUrl })
              .eq("id", pid),
          ]);

          // Update local state so preview stays correct
          updateFormData({
            profilePhoto: null,
            existingProfilePhotoUrl: publicUrl,
          });
        }
      }

      showSuccess("Profile saved", "Your profile details have been saved.");
      return true;
    } catch {
      showError(
        "Save failed",
        "Could not save your profile. Please try again.",
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // ── STEP 3: Save services ──────────────────────────────────────────────
  const handleServicesSave = async (data: OnboardingData): Promise<boolean> => {
    const pid = providerIdRef.current;
    if (!pid) {
      showError("Session lost", "Please go back to Step 1.");
      return false;
    }

    setIsSaving(true);
    try {
      await supabase.from("provider_services").delete().eq("provider_id", pid);

      if (data.selectedServices.length > 0) {
        const { error } = await supabase.from("provider_services").insert(
          data.selectedServices.map((svc) => ({
            provider_id: pid,
            service_name: svc.name,
            price:
              svc.price && !isNaN(parseFloat(svc.price))
                ? parseFloat(svc.price)
                : null,
            is_custom: svc.isCustom,
            service_keywords: [],
          })),
        );
        if (error) {
          showError(
            "Services not saved",
            "Could not save your services. Please try again.",
          );
          return false;
        }
      }

      await supabase
        .from("providers")
        .update({ primary_category: data.category })
        .eq("id", pid);

      showSuccess("Services saved", "Your services have been saved.");
      return true;
    } catch {
      showError("Save failed", "Could not save your services.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // ── STEP 4: Save service areas ─────────────────────────────────────────
  const handleAreasSave = async (data: OnboardingData): Promise<boolean> => {
    const pid = providerIdRef.current;
    if (!pid) {
      showError("Session lost", "Please go back to Step 1.");
      return false;
    }

    setIsSaving(true);
    try {
      await supabase
        .from("provider_service_areas")
        .delete()
        .eq("provider_id", pid);

      if (data.areas.length > 0) {
        const { error } = await supabase.from("provider_service_areas").insert(
          data.areas.map((suburb) => ({
            provider_id: pid,
            city: data.city,
            suburb,
          })),
        );
        if (error) {
          showError(
            "Areas not saved",
            "Could not save your service areas. Please try again.",
          );
          return false;
        }
      }

      showSuccess("Areas saved", "Your service areas have been saved.");
      return true;
    } catch {
      showError("Save failed", "Could not save your service areas.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // ── STEP 5: Upload portfolio + finalise ───────────────────────────────
  const handleSubmitProfile = async (profileData: OnboardingData) => {
    const pid = providerIdRef.current;
    if (!pid) {
      showError("Session lost", "Please go back to Step 1 and try again.");
      return;
    }

    setIsSaving(true);
    try {
      // Portfolio images
      if (profileData.portfolioFiles.length > 0) {
        const compressed = await Promise.all(
          profileData.portfolioFiles.map(compressImage),
        );
        const paths = await batchedUpload(
          compressed,
          (file) => uploadFile(file, pid, `providers/${pid}/portfolio`),
          3,
        );
        const payload = paths
          .filter((p): p is string => p !== null)
          .map((file_path) => ({
            provider_id: pid,
            media_type: "portfolio",
            file_path,
          }));
        if (payload.length > 0) {
          const { error } = await supabase
            .from("provider_media")
            .insert(payload);
          if (error)
            showError(
              "Portfolio not fully saved",
              "Some portfolio images could not be saved.",
            );
        }
      }

      // License files
      if (profileData.licenseFiles.length > 0) {
        const paths = await batchedUpload(
          profileData.licenseFiles,
          (file) => uploadFile(file, pid, `providers/${pid}/licenses`),
          3,
        );
        const payload = paths
          .filter((p): p is string => p !== null)
          .map((file_path) => ({
            provider_id: pid,
            media_type: "license",
            file_path,
          }));
        if (payload.length > 0) {
          await supabase.from("provider_media").insert(payload);
        }
      }

      // ID document
      if (profileData.idFile) {
        const path = await uploadFile(
          profileData.idFile,
          pid,
          `providers/${pid}/ID`,
        );
        if (path) {
          await supabase.from("provider_media").insert({
            provider_id: pid,
            media_type: "id_document",
            file_path: path,
          });
        }
      }

      // ── Finalise: flip status to pending_review ────────────────────────
      const { error: finalError } = await supabase
        .from("providers")
        .update({
          status: "pending_review",
          profile_completed: true,
          activated_at: new Date().toISOString(),
        })
        .eq("id", pid);

      if (finalError) {
        showError(
          "Submission failed",
          "Could not finalise your profile. Please try again.",
        );
        return;
      }

      try {
        await supabase.functions.invoke("send-profile-received-email", {
          body: { email: profileData.email, fullName: profileData.fullName },
        });
      } catch {}

      showSuccess("Profile submitted!", "Check your email for next steps.");
      sessionStorage.removeItem(STEP_KEY);
      sessionStorage.removeItem(PROVIDER_ID_KEY);
      navigate("/provider/login");
    } catch {
      showError(
        "Submission failed",
        "Could not save your profile. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // ── nextStep — saves before advancing ─────────────────────────────────
  const nextStep = async (stepData?: OnboardingData) => {
    const data = stepData ?? formData;
    let saved = true;

    if (currentStep === 2) saved = await handleProfileSave(data);
    else if (currentStep === 3) saved = await handleServicesSave(data);
    else if (currentStep === 4) saved = await handleAreasSave(data);

    if (!saved) return;

    const next = Math.min(currentStep + 1, 5);
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stepLabels = ["Account", "Profile", "Services", "Areas", "Portfolio"];

  // ── Expired invite screen ──────────────────────────────────────────────
  if (inviteExpired) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--color-bg-section)",
          fontFamily: "var(--font-primary)",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            maxWidth: 480,
            textAlign: "center",
            background: "var(--color-bg)",
            border: "1.5px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: "48px 40px",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "#FEF3C7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              fontSize: 36,
            }}
          >
            ⏰
          </div>
          <h1
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: 24,
              fontWeight: 800,
              color: "var(--color-primary)",
              marginBottom: 12,
              letterSpacing: "-0.5px",
            }}
          >
            Your Invite Has Expired
          </h1>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: 15,
              lineHeight: 1.7,
              marginBottom: 28,
            }}
          >
            Your invitation link was only valid for <strong>24 hours</strong>{" "}
            and has now expired. The ZimServ team has been notified and will
            send you a fresh invite shortly.
          </p>
          <div
            style={{
              padding: "14px 20px",
              background: "rgba(255,107,53,0.08)",
              border: "1.5px solid rgba(255,107,53,0.2)",
              borderRadius: 10,
              fontSize: 13,
              color: "var(--color-text-secondary)",
              lineHeight: 1.6,
            }}
          >
            📬 Keep an eye on your inbox. The new invite will arrive within 24
            hours.
          </div>
        </div>
      </div>
    );
  }

  // ── Checking session screen ────────────────────────────────────────────
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

  // ── Main UI ────────────────────────────────────────────────────────────
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
        isSaving={isSaving}
      />

      {/*
      
      {import.meta.env.DEV && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 9999,
            background: "#1a1a2e",
            border: "1.5px solid #ff6b35",
            borderRadius: 10,
            padding: "10px 14px",
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <span
            style={{
              color: "#ff6b35",
              fontSize: 12,
              fontWeight: 700,
              marginRight: 4,
            }}
          >
            DEV
          </span>
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStep(s);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: "none",
                background: currentStep === s ? "#ff6b35" : "#2a2a3e",
                color: currentStep === s ? "#fff" : "#aaa",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}*/}
    </>
  );
};

export default ProviderOnboarding;
