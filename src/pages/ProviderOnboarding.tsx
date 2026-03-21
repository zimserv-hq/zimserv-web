// Location: src/pages/ProviderOnboarding.tsx
// Provider onboarding flow — starts immediately after application submission

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  // Step 2: Profile
  email: string;
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

export interface OnboardingDraftPatch {
  businessName?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  description?: string;
  experience?: string;
  teamSize?: string;
  website?: string;
  languages?: string[];
  callAvailable?: boolean;
  whatsappAvailable?: boolean;
  emergencyAvailable?: boolean;
  profilePhotoPath?: string;
  selectedServices?: ServiceEntry[];
  pricingModel?: string;
  areas?: string[];
  portfolioPaths?: string[];
  idFilePath?: string;
}

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
      maxWidthOrHeight: 800,
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

const ProviderOnboarding = () => {
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToast();

  const [currentStep, setCurrentStep] = useState<number>(2);
  const [, setValidatedApplicationId] = useState<string>("");
  const [initializing, setInitializing] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [formData, setFormData] = useState<OnboardingData>({
    email: "",
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

  const [draftFilePaths, setDraftFilePaths] = useState<{
    profilePhotoPath?: string;
    portfolioPaths: string[];
    idFilePath?: string;
  }>({ portfolioPaths: [] });

  const setStep = (step: number) => {
    // Step 1 (Account) no longer exists — clamp between 2 and 5
    const safeStep = Math.min(Math.max(step, 2), 5);
    setCurrentStep(safeStep);
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
    const prev = Math.max(currentStep - 1, 2);
    setStep(prev);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
        console.error("Error loading application for onboarding:", error);
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
    } catch (e) {
      console.error("Unexpected error while loading application:", e);
      setLoadError("Unexpected error while loading application details.");
      showError(
        "Error",
        "An unexpected error occurred while loading your application.",
      );
    }
  };

  const saveStepDraft = async (
    step: number,
    patch: OnboardingDraftPatch,
  ): Promise<void> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("provider_drafts").upsert(
        {
          user_id: user.id,
          step_reached: step,
          business_name: patch.businessName,
          phone_number: patch.phoneNumber,
          whatsapp_number: patch.whatsappNumber,
          description: patch.description,
          experience: patch.experience,
          team_size: patch.teamSize,
          website: patch.website,
          languages: patch.languages,
          call_available: patch.callAvailable,
          whatsapp_available: patch.whatsappAvailable,
          emergency_available: patch.emergencyAvailable,
          profile_photo_path: patch.profilePhotoPath,
          selected_services: patch.selectedServices,
          pricing_model: patch.pricingModel,
          areas: patch.areas,
          portfolio_paths: patch.portfolioPaths,
          id_file_path: patch.idFilePath,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );

      if (error) {
        console.warn("Draft save failed (non-critical):", error.message);
      }
    } catch (e) {
      console.warn("Draft save threw (non-critical):", e);
    }
  };

  const restoreDraft = async (): Promise<number> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return 2;

      const { data: draft, error } = await supabase
        .from("provider_drafts")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error || !draft) return 2;

      setFormData((prev) => ({
        ...prev,
        businessName: draft.business_name ?? prev.businessName,
        phoneNumber: draft.phone_number ?? prev.phoneNumber,
        whatsappNumber: draft.whatsapp_number ?? prev.whatsappNumber,
        description: draft.description ?? prev.description,
        experience: draft.experience ?? prev.experience,
        teamSize: draft.team_size ?? prev.teamSize,
        website: draft.website ?? prev.website,
        languages: draft.languages ?? prev.languages,
        callAvailable: draft.call_available ?? prev.callAvailable,
        whatsappAvailable: draft.whatsapp_available ?? prev.whatsappAvailable,
        emergencyAvailable:
          draft.emergency_available ?? prev.emergencyAvailable,
        selectedServices: draft.selected_services ?? prev.selectedServices,
        pricingModel: draft.pricing_model ?? prev.pricingModel,
        areas: draft.areas ?? prev.areas,
      }));

      setDraftFilePaths({
        profilePhotoPath: draft.profile_photo_path ?? undefined,
        portfolioPaths: draft.portfolio_paths ?? [],
        idFilePath: draft.id_file_path ?? undefined,
      });

      return Math.max(draft.step_reached ?? 2, 2);
    } catch (e) {
      console.warn("Draft restore threw (non-critical):", e);
      return 2;
    }
  };

  const deleteDraft = async (): Promise<void> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from("provider_drafts").delete().eq("user_id", user.id);
    } catch (e) {
      console.warn("Draft delete threw (non-critical):", e);
    }
  };

  // ── Init: verify session and load data ───────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // Not signed in — send them to apply
        navigate("/become-provider");
        return;
      }

      const applicationId = user.user_metadata?.application_id as
        | string
        | undefined;

      if (!applicationId) {
        showError(
          "Session error",
          "Could not find your application. Please re-apply or contact support.",
        );
        navigate("/become-provider");
        return;
      }

      setValidatedApplicationId(applicationId);

      // Restore draft first (returns the step to resume at)
      const restoredStep = await restoreDraft();

      // Preload application data (fills email, fullName, city, etc.)
      await preloadFromApplication(applicationId, user.email ?? "");

      // Set step from draft, or start at 2
      setCurrentStep(restoredStep);

      if (restoredStep > 2) {
        showInfo?.(
          "Progress restored",
          `We resumed your onboarding from step ${restoredStep}.`,
        );
      }

      setInitializing(false);
    };

    init();
  }, []);

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

        console.warn(
          `Upload attempt ${attempt}/${retries} failed for ${fileName}:`,
          error.message,
        );
      } catch (err) {
        console.warn(`Upload attempt ${attempt}/${retries} threw:`, err);
      }

      if (attempt < retries) {
        await new Promise<void>((res) =>
          setTimeout(res, Math.pow(2, attempt) * 1000),
        );
      }
    }

    console.error(`All ${retries} upload attempts failed for ${fileName}`);
    return null;
  };

  const handleSaveProfileDraft = async (
    profilePatch: Omit<OnboardingDraftPatch, "profilePhotoPath">,
    profilePhotoFile: File | null,
  ): Promise<void> => {
    let profilePhotoPath: string | undefined;

    if (profilePhotoFile) {
      const compressed = await compressImage(profilePhotoFile);
      const path = await uploadFile(
        compressed,
        "",
        `drafts/${crypto.randomUUID()}/profile`,
      );
      if (path) {
        profilePhotoPath = path;
        setDraftFilePaths((prev) => ({ ...prev, profilePhotoPath: path }));
      }
    }

    await saveStepDraft(2, { ...profilePatch, profilePhotoPath });
  };

  const handleSaveServicesDraft = async (
    selectedServices: ServiceEntry[],
    pricingModel: string,
  ): Promise<void> => {
    await saveStepDraft(3, { selectedServices, pricingModel });
  };

  const handleSaveAreasDraft = async (areas: string[]): Promise<void> => {
    await saveStepDraft(4, { areas });
  };

  const handleUploadPortfolio = async (files: File[]): Promise<void> => {
    const compressed = await Promise.all(files.map(compressImage));
    const paths = await batchedUpload(
      compressed,
      (file: File) =>
        uploadFile(file, "", `drafts/${crypto.randomUUID()}/portfolio`),
      3,
    );
    const validPaths = paths.filter((p): p is string => p !== null);

    setDraftFilePaths((prev) => {
      const merged = [...prev.portfolioPaths, ...validPaths];
      saveStepDraft(5, { portfolioPaths: merged, idFilePath: prev.idFilePath });
      return { ...prev, portfolioPaths: merged };
    });
  };

  const handleUploadIdFile = async (file: File): Promise<void> => {
    const path = await uploadFile(file, "", `drafts/${crypto.randomUUID()}/id`);
    if (path) {
      setDraftFilePaths((prev) => {
        saveStepDraft(5, {
          portfolioPaths: prev.portfolioPaths,
          idFilePath: path,
        });
        return { ...prev, idFilePath: path };
      });
    }
  };

  const handleRemovePortfolioPath = (index: number): void => {
    setDraftFilePaths((prev) => {
      const updated = prev.portfolioPaths.filter((_, i) => i !== index);
      saveStepDraft(5, {
        portfolioPaths: updated,
        idFilePath: prev.idFilePath,
      });
      return { ...prev, portfolioPaths: updated };
    });
  };

  const handleRemoveIdFilePath = (): void => {
    setDraftFilePaths((prev) => {
      saveStepDraft(5, {
        portfolioPaths: prev.portfolioPaths,
        idFilePath: undefined,
      });
      return { ...prev, idFilePath: undefined };
    });
  };

  const sendProfileReceivedEmail = async (email: string, fullName: string) => {
    try {
      const { error } = await supabase.functions.invoke(
        "send-profile-received-email",
        { body: { email, fullName } },
      );
      if (error) console.error("Failed to send profile received email:", error);
    } catch (err) {
      console.error("Unexpected error sending profile received email:", err);
    }
  };

  const handleSubmitProfile = async (profileData: OnboardingData) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
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
        if (
          providerError?.code === "23505" &&
          providerError.message.includes("slug")
        ) {
          const suffix = Math.random().toString(36).slice(2, 6);
          const retrySlug = `${generateSlug(
            profileData.businessName,
            profileData.fullName,
          )}-${suffix}`;

          const { data: retryInsert, error: retryError } = await supabase
            .from("providers")
            .insert({ ...providerPayload, slug: retrySlug })
            .select("id")
            .single();

          if (retryError || !retryInsert) {
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

          // notify admin after successful onboarding (slug retry branch)
          supabase.functions
            .invoke("notify-new-application", {
              body: { fullName: profileData.fullName },
            })
            .catch((err) => console.warn("Admin notification failed:", err));

          await deleteDraft();
          showSuccess("Profile submitted!", "Check your email for next steps.");
          navigate("/provider/login");
          return;
        }

        if (providerError?.code === "23505") {
          showError(
            "Phone already registered",
            "This phone number is already linked to a provider account.",
          );
          return;
        }

        console.error("Error inserting provider:", providerError);
        showError(
          "Submission failed",
          "We could not save your profile. Please try again.",
        );
        return;
      }

      const providerId = providerInsert.id as string;
      await insertRelatedData(profileData, providerId);
      await sendProfileReceivedEmail(profileData.email, profileData.fullName);

      // notify admin after successful onboarding (normal branch)
      supabase.functions
        .invoke("notify-new-application", {
          body: { fullName: profileData.fullName },
        })
        .catch((err) => console.warn("Admin notification failed:", err));

      await deleteDraft();

      showSuccess("Profile submitted!", "Check your email for next steps.");
      navigate("/provider/login");
    } catch (err) {
      console.error("Error submitting provider profile:", err);
      showError(
        "Submission failed",
        "We could not save your profile. Please try again.",
      );
    }
  };

  const insertRelatedData = async (
    profileData: OnboardingData,
    providerId: string,
  ) => {
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
      const { error } = await supabase
        .from("provider_services")
        .insert(servicesPayload);
      if (error) {
        console.error("Error inserting provider_services:", error);
        showError(
          "Services not saved",
          "We saved your profile but had trouble saving your services.",
        );
      }
    }

    if (profileData.areas.length > 0) {
      const areasPayload = profileData.areas.map((suburb) => ({
        provider_id: providerId,
        city: profileData.city,
        suburb,
      }));
      const { error } = await supabase
        .from("provider_service_areas")
        .insert(areasPayload);
      if (error) {
        console.error("Error inserting provider_service_areas:", error);
        showError(
          "Areas not saved",
          "We saved your profile but had trouble saving your service areas.",
        );
      }
    }

    let profilePhotoPath = draftFilePaths.profilePhotoPath ?? null;
    if (!profilePhotoPath && profileData.profilePhoto) {
      const compressed = await compressImage(profileData.profilePhoto);
      profilePhotoPath = await uploadFile(
        compressed,
        providerId,
        `providers/${providerId}/profile`,
      );
    }
    if (profilePhotoPath) {
      const finalPath = `providers/${providerId}/profile/${crypto.randomUUID()}.${profilePhotoPath.split(".").pop()}`;
      await supabase.storage
        .from("provider-media")
        .copy(profilePhotoPath, finalPath)
        .catch(() => {
          console.warn("Profile photo copy failed — using draft path");
        });
      const resolvedPath = finalPath ?? profilePhotoPath;
      const { data: urlData } = supabase.storage
        .from("provider-media")
        .getPublicUrl(resolvedPath);
      await supabase.from("provider_media").insert({
        provider_id: providerId,
        media_type: "profile_photo",
        file_path: resolvedPath,
      });
      await supabase
        .from("providers")
        .update({ profile_image_url: urlData.publicUrl })
        .eq("id", providerId);
    }

    const portfolioPaths = draftFilePaths.portfolioPaths;
    if (portfolioPaths.length > 0) {
      const payload = portfolioPaths.map((file_path) => ({
        provider_id: providerId,
        media_type: "portfolio",
        file_path,
      }));
      const { error } = await supabase.from("provider_media").insert(payload);
      if (error)
        showError(
          "Portfolio not fully saved",
          "Some portfolio images could not be saved.",
        );
    } else if (profileData.portfolioFiles.length > 0) {
      const compressed = await Promise.all(
        profileData.portfolioFiles.map(compressImage),
      );
      const paths = await batchedUpload(
        compressed,
        (file) =>
          uploadFile(file, providerId, `providers/${providerId}/portfolio`),
        3,
      );
      const payload = paths
        .filter((p): p is string => p !== null)
        .map((file_path) => ({
          provider_id: providerId,
          media_type: "portfolio",
          file_path,
        }));
      if (payload.length > 0)
        await supabase.from("provider_media").insert(payload);
    }

    if (profileData.licenseFiles.length > 0) {
      const paths = await batchedUpload(
        profileData.licenseFiles,
        (file) =>
          uploadFile(file, providerId, `providers/${providerId}/licenses`),
        3,
      );
      const payload = paths
        .filter((p): p is string => p !== null)
        .map((file_path) => ({
          provider_id: providerId,
          media_type: "license",
          file_path,
        }));
      if (payload.length > 0)
        await supabase.from("provider_media").insert(payload);
    }

    const idFilePath = draftFilePaths.idFilePath ?? null;
    if (idFilePath) {
      await supabase.from("provider_media").insert({
        provider_id: providerId,
        media_type: "id_document",
        file_path: idFilePath,
      });
    } else if (profileData.idFile) {
      const path = await uploadFile(
        profileData.idFile,
        providerId,
        `providers/${providerId}/ID`,
      );
      if (path)
        await supabase.from("provider_media").insert({
          provider_id: providerId,
          media_type: "id_document",
          file_path: path,
        });
    }
  };

  // Step labels now start from 2 — but display numbers 1–4 to the user
  const stepLabels = ["Profile", "Services", "Areas", "Portfolio"];

  if (initializing) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--color-bg-section)",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <p style={{ color: "var(--color-text-secondary)", fontSize: 15 }}>
          Loading your profile...
        </p>
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
          { label: stepLabels[currentStep - 2] },
        ]}
      />

      <OnboardingSteps
        currentStep={currentStep}
        formData={formData}
        updateFormData={updateFormData}
        nextStep={nextStep}
        prevStep={prevStep}
        onSubmitProfile={handleSubmitProfile}
        onSaveProfileDraft={handleSaveProfileDraft}
        onSaveServicesDraft={handleSaveServicesDraft}
        onSaveAreasDraft={handleSaveAreasDraft}
        onUploadPortfolio={handleUploadPortfolio}
        onUploadIdFile={handleUploadIdFile}
        onRemovePortfolioPath={handleRemovePortfolioPath}
        onRemoveIdFilePath={handleRemoveIdFilePath}
        draftFilePaths={draftFilePaths}
        loadError={loadError}
      />
    </>
  );
};

export default ProviderOnboarding;
