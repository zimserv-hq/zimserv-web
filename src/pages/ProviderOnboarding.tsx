// Location: src/pages/ProviderOnboarding.tsx
// Provider onboarding flow for approved providers to complete their profile

import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import SEO from "../components/SEO";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import OnboardingSteps from "../components/Onboarding/OnboardingSteps";
import { supabase } from "../lib/supabaseClient";
import { useToast } from "../contexts/ToastContext";

export interface OnboardingData {
  // Step 1: Account
  email: string;
  password: string;

  // Step 2: Profile - UPDATED WITH NEW FIELDS
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

  // Step 3: Services - UPDATED WITH PRICING MODEL
  category: string;
  selectedServices: string[];
  pricingModel: string;

  // Step 4: Areas - UPDATED WITH CITY
  city: string;
  areas: string[];

  // Step 5: Portfolio
  portfolioFiles: File[];
  licenseFiles: File[];
}

const ProviderOnboarding = () => {
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("application_id");
  const { showSuccess, showError } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    // Step 1: Account
    email: "",
    password: "",

    // Step 2: Profile
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

    // Step 3: Services
    category: "Plumbing", // will be overwritten from application if present
    selectedServices: [],
    pricingModel: "Quote-based",

    // Step 4: Areas
    city: "",
    areas: [],

    // Step 5: Portfolio
    portfolioFiles: [],
    licenseFiles: [],
  });

  const [loadError, setLoadError] = useState<string | null>(null);

  const updateFormData = (data: Partial<OnboardingData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
        experience: data.years_experience ?? prev.experience,
        city: data.city ?? prev.city,
        // Use category name from application if you stored it
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

  const handleAccountSubmit = async (
    email: string,
    password: string,
  ): Promise<boolean> => {
    setLoadError(null);

    try {
      // 1) Ensure the invited user has an active session from the invite link
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

      // 2) Set password for the current invited user (no signInWithPassword)
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        console.error("Auth updateUser error during onboarding:", updateError);
        setLoadError("Could not set your password. Please try again.");
        showError(
          "Password error",
          "We were unable to set your password. Please try again.",
        );
        return false;
      }

      showSuccess(
        "Account secured",
        "Your password has been set successfully.",
      );

      // 3) Preload application data (read/write in state)
      if (applicationId) {
        await preloadFromApplication(applicationId, email);
      }

      // 4) Move to next step
      setCurrentStep(2);
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

      return fileName; // path stored in provider_media.file_path
    } catch (err) {
      console.error("Unexpected error during file upload:", err);
      return null;
    }
  };

  const handleSubmitProfile = async (profileData: OnboardingData) => {
    try {
      // 1) Get current auth user
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

      // 2) Insert provider row
      const yearsInt =
        typeof profileData.experience === "string"
          ? parseInt(profileData.experience, 10) || null
          : null;

      const { data: providerInsert, error: providerError } = await supabase
        .from("providers")
        .insert({
          user_id: user.id,
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
        })
        .select("id")
        .single();

      if (providerError || !providerInsert) {
        // handle duplicate phone gracefully
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

      // 3) Insert provider_services
      if (profileData.selectedServices.length > 0) {
        const servicesPayload = profileData.selectedServices.map(
          (serviceName) => ({
            provider_id: providerId,
            service_name: serviceName,
            service_keywords: [],
          }),
        );

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

      // 4) Insert provider_service_areas
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

      // 5) Upload media + insert provider_media
      // 5a) Profile photo
      if (profileData.profilePhoto) {
        const path = await uploadFile(
          profileData.profilePhoto,
          providerId,
          `providers/${providerId}/profile`,
        );
        if (path) {
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
        }
      }

      // 5b) Portfolio images
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

      // 5c) License files
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

      showSuccess(
        "Profile submitted",
        "Your profile has been submitted and is pending review.",
      );
    } catch (err) {
      console.error("Error submitting provider profile:", err);
      showError(
        "Submission failed",
        "We could not save your profile. Please try again.",
      );
    }
  };

  const stepLabels = ["Account", "Profile", "Services", "Areas", "Portfolio"];

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
