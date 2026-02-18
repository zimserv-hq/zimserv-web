// Location: src/pages/ProviderOnboarding.tsx
// Provider onboarding flow for approved providers to complete their profile

import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import SEO from "../components/SEO";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import OnboardingSteps from "../components/Onboarding/OnboardingSteps";
import { supabase } from "../lib/supabaseClient";

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
    }
  };

  const handleAccountSubmit = async (
    email: string,
    password: string,
  ): Promise<boolean> => {
    setLoadError(null);

    // 1) Verify email + password via Supabase Auth
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Auth error during onboarding:", error);
      setLoadError("Invalid email or password. Please try again.");
      return false;
    }

    // 2) Preload application data (read/write in state)
    if (applicationId) {
      await preloadFromApplication(applicationId, email);
    }

    // 3) Move to next step
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return true;
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
        loadError={loadError}
      />
    </>
  );
};

export default ProviderOnboarding;
