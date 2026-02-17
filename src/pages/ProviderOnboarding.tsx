// Location: src/pages/ProviderOnboarding.tsx
// Provider onboarding flow for approved providers to complete their profile

import { useState } from "react";
import SEO from "../components/SEO";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import OnboardingSteps from "../components/Onboarding/OnboardingSteps";

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
    category: "Plumbing", // This should come from application data or be selectable
    selectedServices: [],
    pricingModel: "Quote-based",

    // Step 4: Areas
    city: "",
    areas: [],

    // Step 5: Portfolio
    portfolioFiles: [],
    licenseFiles: [],
  });

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
      />
    </>
  );
};

export default ProviderOnboarding;
