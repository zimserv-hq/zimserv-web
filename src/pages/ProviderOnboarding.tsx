// Location: src/pages/ProviderOnboarding.tsx
// Provider onboarding flow for approved providers to complete their profile

import { useState, useEffect } from "react";
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

// What we persist in provider_drafts (paths instead of File objects)
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

// include "checking" here to fix the TS error
type InviteStatus = "checking" | "valid" | "expired" | "used" | "invalid";

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
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToast();

  // current step now comes from DB (provider_drafts.step_reached)
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [inviteStatus, setInviteStatus] = useState<InviteStatus>("checking");
  const [_validatedEmail, setValidatedEmail] = useState<string>("");
  const [validatedApplicationId, setValidatedApplicationId] =
    useState<string>("");

  // separate flag so we can show loading UI until draft+application are loaded
  const [initializing, setInitializing] = useState<boolean>(true);

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

  const [draftFilePaths, setDraftFilePaths] = useState<{
    profilePhotoPath?: string;
    portfolioPaths: string[];
    idFilePath?: string;
  }>({ portfolioPaths: [] });

  const [loadError, setLoadError] = useState<string | null>(null);

  const setStep = (step: number) => {
    const safeStep = Math.min(Math.max(step, 1), 5);
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
    const prev = Math.max(currentStep - 1, 1);
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

  // Save draft keyed by user_id (like old working version)
  const saveStepDraft = async (
    step: number,
    patch: OnboardingDraftPatch,
  ): Promise<void> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.warn("[saveStepDraft] no authenticated user, skipping");
        return;
      }

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

  // Restore draft by user_id and set step from step_reached
  const restoreDraft = async (): Promise<void> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.log("[restoreDraft] no authenticated user, skipping");
        return;
      }

      const { data: draft, error } = await supabase
        .from("provider_drafts")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error || !draft) {
        console.log("[restoreDraft] no draft found", { error, draft });
        return;
      }

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

      if (draft.step_reached && draft.step_reached > 1) {
        setStep(draft.step_reached);
        showInfo?.(
          "Progress restored",
          `We resumed your onboarding from step ${draft.step_reached}.`,
        );
      } else {
        setStep(1);
      }
    } catch (e) {
      console.warn("Draft restore threw (non-critical):", e);
    }
  };

  // Delete draft by user_id after successful final submit
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

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setInviteStatus("invalid");
        setInitializing(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke(
          "validate-invite",
          { body: { token } },
        );

        if (error || !data) {
          console.error("validate-invite error:", error);
          setInviteStatus("invalid");
          setInitializing(false);
          return;
        }

        if (!data.valid) {
          const reasonMap: Record<string, InviteStatus> = {
            expired: "expired",
            already_used: "used",
            invalid: "invalid",
            server_error: "invalid",
          };
          setInviteStatus(reasonMap[data.reason] ?? "invalid");
          setInitializing(false);
          return;
        }

        setValidatedEmail(data.email);
        const appIdFromFn = data.applicationId ?? data.application_id;
        setValidatedApplicationId(appIdFromFn);
        setFormData((prev) => ({ ...prev, email: data.email }));

        // Check if user is already signed in
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          // Returning user – restore draft and at least skip Account (step 1)
          await restoreDraft();
          await preloadFromApplication(appIdFromFn, data.email);

          // If restoreDraft already set a higher step, keep it; otherwise force 2.
          // Since setStep clamps 1–5 and restoreDraft already called setStep,
          // just forcing 2 here is enough for the “no draft” case.
          if (currentStep < 2) {
            setStep(2);
          }

          setInviteStatus("valid");
          setInitializing(false);
          return;
        }

        // First-time user – only preload application, they start on step 1
        await preloadFromApplication(appIdFromFn, data.email);
        setInviteStatus("valid");
        setInitializing(false);
      } catch (err) {
        console.error("Unexpected error validating invite:", err);
        setInviteStatus("invalid");
        setInitializing(false);
      }
    };

    validateToken();
  }, [token]);

  const handleAccountSubmit = async (
    email: string,
    password: string,
  ): Promise<boolean> => {
    setLoadError(null);

    try {
      const { data, error } = await supabase.functions.invoke(
        "complete-provider-registration",
        {
          body: {
            token,
            email,
            password,
            applicationId: validatedApplicationId,
          },
        },
      );

      if (error || !data?.success) {
        const msg = data?.error ?? error?.message ?? "Unknown error";
        console.error("Registration error:", msg);
        setLoadError("Could not create your account. Please try again.");
        showError("Registration failed", msg);
        return false;
      }

      // Sign in so we have a user to update
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("Sign-in after registration failed:", signInError);
        showError(
          "Sign-in failed",
          "Your account was created but we couldn't sign you in. Try the login page.",
        );
        return false;
      }

      // After sign-in, set display name = full name from application
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!user || userError) {
        console.warn("Could not load user to set display name:", userError);
      } else {
        // fullName is already in formData from preloadFromApplication
        const fullName = formData.fullName;
        if (fullName.trim()) {
          const { error: metaError } = await supabase.auth.updateUser({
            data: {
              display_name: fullName,
            },
          });
          if (metaError) {
            console.warn("Failed to set display_name:", metaError);
          }
        }
      }

      showSuccess(
        "Account secured",
        "Your password has been set successfully.",
      );

      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return true;
    } catch (err) {
      console.error("Unexpected error in handleAccountSubmit:", err);
      setLoadError("Unexpected error while creating your account.");
      showError("Unexpected error", "Something went wrong. Please try again.");
      return false;
    }
  };

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
          await markTokenUsed();
          await sendProfileReceivedEmail(
            profileData.email,
            profileData.fullName,
          );
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
      await markTokenUsed();
      await sendProfileReceivedEmail(profileData.email, profileData.fullName);
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

  const markTokenUsed = async (): Promise<void> => {
    if (!token) return;
    try {
      await supabase.functions.invoke("validate-invite", {
        body: { token, markUsed: true },
      });
    } catch (err) {
      console.warn("Failed to mark token as used (non-critical):", err);
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
      const finalPath = `providers/${providerId}/profile/${crypto
        .randomUUID()
        .toString()}.${profilePhotoPath.split(".").pop()}`;
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

  const stepLabels = ["Account", "Profile", "Services", "Areas", "Portfolio"];

  // Loading guard: don't render onboarding UI until invite + drafts are loaded
  if (inviteStatus === "checking" || initializing) {
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
          Loading your invite...
        </p>
      </div>
    );
  }

  if (inviteStatus === "valid" && !validatedApplicationId) {
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
          Loading your invite...
        </p>
      </div>
    );
  }

  if (inviteStatus === "expired") {
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
            Your invitation link was only valid for <strong>72 hours</strong>{" "}
            and has now expired. Don't worry — contact an admin and they can
            resend a fresh link instantly.
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
            📬 Contact us at{" "}
            <a
              href="mailto:support@zimserv.co.zw"
              style={{ color: "var(--color-accent)" }}
            >
              support@zimserv.co.zw
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (inviteStatus === "used") {
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
              background: "#D1FAE5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              fontSize: 36,
            }}
          >
            ✅
          </div>
          <h1
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: 24,
              fontWeight: 800,
              color: "var(--color-primary)",
              marginBottom: 12,
            }}
          >
            Already Registered
          </h1>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: 15,
              lineHeight: 1.7,
              marginBottom: 28,
            }}
          >
            This invite link has already been used to complete registration. Try
            logging in to your provider account instead.
          </p>
          <button
            onClick={() => navigate("/provider/login")}
            style={{
              background: "var(--color-accent)",
              color: "#fff",
              padding: "12px 28px",
              borderRadius: 8,
              border: "none",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Go to Login →
          </button>
        </div>
      </div>
    );
  }

  if (inviteStatus === "invalid") {
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
              background: "#FEE2E2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              fontSize: 36,
            }}
          >
            🔗
          </div>
          <h1
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: 24,
              fontWeight: 800,
              color: "var(--color-primary)",
              marginBottom: 12,
            }}
          >
            Invalid Invite Link
          </h1>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: 15,
              lineHeight: 1.7,
              marginBottom: 28,
            }}
          >
            This link doesn't look right or may have already been used. Please
            use the link directly from your invitation email, or contact support
            for a fresh one.
          </p>
          <div
            style={{
              padding: "14px 20px",
              background: "rgba(255,107,53,0.08)",
              border: "1.5px solid rgba(255,107,53,0.2)",
              borderRadius: 10,
              fontSize: 13,
              color: "var(--color-text-secondary)",
            }}
          >
            📬{" "}
            <a
              href="mailto:support@zimserv.co.zw"
              style={{ color: "var(--color-accent)" }}
            >
              support@zimserv.co.zw
            </a>
          </div>
        </div>
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
