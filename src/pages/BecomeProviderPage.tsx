// src/pages/BecomeProviderPage.tsx
// Improved UI/UX with proper margins matching the rest of the site

import { useState, useEffect, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  TrendingUp,
  Shield,
  Clock,
  Star,
  DollarSign,
  ArrowRight,
  CheckCircle,
  Upload,
  X,
} from "lucide-react";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { supabase } from "../lib/supabaseClient";

const CITIES = [
  "Harare",
  "Bulawayo",
  "Chitungwiza",
  "Mutare",
  "Gweru",
  "Kwekwe",
  "Kadoma",
  "Masvingo",
  "Chinhoyi",
  "Marondera",
  "Bindura",
  "Victoria Falls",
  "Hwange",
  "Norton",
];

const BENEFITS = [
  {
    icon: Users,
    title: "Grow Your Customer Base",
    description:
      "Connect with thousands of potential customers actively searching for your services.",
  },
  {
    icon: TrendingUp,
    title: "Boost Your Revenue",
    description:
      "Get more bookings and increase your income with our platform's wide reach.",
  },
  {
    icon: Shield,
    title: "Build Your Reputation",
    description:
      "Showcase your skills and collect verified reviews to establish trust and credibility.",
  },
  {
    icon: Clock,
    title: "Flexible Schedule",
    description:
      "Work on your own terms. Accept jobs that fit your schedule and availability.",
  },
  {
    icon: Star,
    title: "Get Featured",
    description:
      "Stand out with premium listing options and featured placement in search results.",
  },
  {
    icon: DollarSign,
    title: "Simple Pricing",
    description:
      "No hidden fees. Pay only a small commission on completed jobs through the platform.",
  },
];

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  city: string;
  category: string;
  yearsExperience: string;
  workType: string;
  availability?: string;
  description: string;
  referral?: string;
  agreedToTerms: boolean;
};

const initialState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  whatsapp: "",
  city: "",
  category: "",
  yearsExperience: "",
  workType: "",
  availability: "",
  description: "",
  referral: "",
  agreedToTerms: false,
};

type CategoryRecord = {
  id: string;
  name: string;
  status: "Active" | "Inactive";
};

export default function BecomeProviderPage(): JSX.Element {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormState>(initialState);
  const [verificationFile, setVerificationFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Dynamic categories state
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoryLoading(true);
        setCategoryError(null);

        const { data, error } = await supabase
          .from("categories")
          .select("id, name, status")
          .eq("status", "Active")
          .order("display_order", { ascending: true });

        if (error) throw error;

        setCategories(data || []);
      } catch (err: any) {
        console.error("Error loading categories:", err);
        setCategoryError(
          "Failed to load service categories. Please refresh the page.",
        );
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  function handleInputChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked as any) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setVerificationFile(null);
      return;
    }

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        verificationFile: "Only JPG/PNG/PDF allowed",
      }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, verificationFile: "Max file size 5MB" }));
      return;
    }
    setVerificationFile(file);
    setErrors((prev) => ({ ...prev, verificationFile: "" }));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};

    if (!formData.fullName.trim()) e.fullName = "Full name is required";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Invalid email";
    if (!formData.phone.trim()) e.phone = "Phone number is required";
    else if (!/^\+?[0-9]{7,15}$/.test(formData.phone.replace(/\s/g, "")))
      e.phone = "Invalid phone number";
    if (!formData.city) e.city = "City is required";
    if (!formData.category) e.category = "Category is required";
    if (!formData.yearsExperience) e.yearsExperience = "Experience is required";
    if (!formData.workType) e.workType = "Work type is required";
    if (!formData.description.trim())
      e.description = "Brief description is required";
    else if (formData.description.length > 200)
      e.description = "Max 200 characters";
    if (!formData.agreedToTerms) e.agreedToTerms = "You must accept terms";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("=== FORM SUBMISSION STARTED ===");

    if (!validate()) {
      console.log("❌ Validation failed");
      const first = document.querySelector(".input-error");
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    console.log("✅ Validation passed");
    setIsSubmitting(true);

    try {
      let verificationFileUrl: string | null = null;

      // Step 1: Upload verification file (keep as is)
      if (verificationFile) {
        const fileExt = verificationFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("verification-documents")
          .upload(filePath, verificationFile);

        if (uploadError) {
          console.error("❌ File upload error:", uploadError);
          setErrors({
            verificationFile: "Failed to upload file. Please try again.",
          });
          setIsSubmitting(false);
          return;
        }

        verificationFileUrl = filePath;
        console.log("✅ File uploaded successfully:", filePath);
      }

      // Step 2: Validate category ID exists
      if (!formData.category) {
        setErrors({ category: "Please select a category" });
        setIsSubmitting(false);
        return;
      }

      // Step 3: Insert application with category ID (FIXED)
      const insertData = {
        full_name: formData.fullName.trim(),
        email: formData.email.toLowerCase().trim(),
        phone_number: formData.phone.trim(),
        whatsapp_number: formData.whatsapp?.trim() || null,
        city: formData.city,
        primary_category_id: formData.category, // ✅ Now sends UUID
        years_experience: formData.yearsExperience,
        work_type: formData.workType,
        availability: formData.availability || null,
        description: formData.description.trim(),
        referral_source: formData.referral || null,
        verification_file_url: verificationFileUrl,
        status: "pending",
      };

      console.log("💾 Inserting data into database:", insertData);

      const { data, error } = await supabase
        .from("provider_applications")
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error("❌ Database insertion error:", error);

        if (error.code === "23505" && error.message.includes("email")) {
          setErrors({
            email:
              "An application with this email already exists. Please check your inbox or contact support.",
          });
          const emailInput = document.querySelector('[name="email"]');
          emailInput?.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          setErrors({
            fullName:
              "Failed to submit application. Please try again or contact support.",
          });
        }

        setIsSubmitting(false);
        return;
      }

      // Success!
      console.log("✅ Application submitted successfully!");
      console.log("Application ID:", data?.id);
      setSubmitSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("❌ Unexpected error:", err);
      setErrors({
        fullName: "An unexpected error occurred. Please refresh and try again.",
      });
      setIsSubmitting(false);
    }
  }

  if (submitSuccess) {
    return (
      <>
        <style>{`
          .success-page {
            min-height: 70vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 80px 20px;
            background: var(--color-bg-section);
          }
          .success-container {
            max-width: 600px;
            text-align: center;
            background: var(--color-bg);
            padding: 48px 40px;
            border-radius: var(--radius-lg);
            border: 1.5px solid var(--color-border);
            box-shadow: var(--shadow-lg);
          }
          .success-icon {
            width: 100px;
            height: 100px;
            margin: 0 auto 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: var(--color-accent-soft);
            color: var(--color-accent);
          }
          .success-title {
            font-family: 'Fraunces', serif;
            font-size: 28px;
            font-weight: 800;
            color: var(--color-primary);
            margin-bottom: 12px;
            letter-spacing: -0.5px;
          }
          .success-message {
            color: var(--color-text-secondary);
            line-height: 1.6;
            margin-bottom: 28px;
            font-size: 15px;
          }
          .success-actions {
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
          }
          .btn-primary,
          .btn-secondary {
            padding: 14px 28px;
            border-radius: var(--radius-full);
            font-weight: 700;
            font-size: 15px;
            border: none;
            cursor: pointer;
            transition: all var(--transition-fast);
            font-family: var(--font-primary);
          }
          .btn-primary {
            background: var(--color-accent);
            color: #fff;
            box-shadow: 0 4px 14px rgba(255, 107, 53, 0.25);
          }
          .btn-primary:hover {
            background: var(--color-accent-hover);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
          }
          .btn-secondary {
            background: transparent;
            border: 1.5px solid var(--color-border);
            color: var(--color-text-secondary);
          }
          .btn-secondary:hover {
            background: var(--color-bg-section);
            border-color: var(--color-accent);
            color: var(--color-accent);
          }
          @media (max-width: 640px) {
            .success-container {
              padding: 32px 24px;
            }
            .success-actions {
              flex-direction: column;
              width: 100%;
            }
            .btn-primary,
            .btn-secondary {
              width: 100%;
            }
          }
        `}</style>

        <Breadcrumb items={[{ label: "Become a Provider" }]} />

        <div className="success-page">
          <div className="success-container">
            <div className="success-icon">
              <CheckCircle size={56} strokeWidth={2} />
            </div>
            <h1 className="success-title">Application Submitted!</h1>
            <p className="success-message">
              Thank you for applying to become a provider on ZimServ. We've
              received your application and will review it within 2–3 business
              days. You'll receive an email at <strong>{formData.email}</strong>{" "}
              with next steps if approved.
            </p>
            <div className="success-actions">
              <button className="btn-primary" onClick={() => navigate("/")}>
                Back to Home
              </button>
              <button
                className="btn-secondary"
                onClick={() => navigate("/providers")}
              >
                Browse Providers
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .become-provider-page {
          width: 100%;
          min-height: 100vh;
          background: var(--color-bg-section);
          padding: 40px 0 80px;
          font-family: var(--font-primary);
        }

        .provider-container {
          max-width: var(--container-max-width);
          margin: 0 auto;
          padding: 0 var(--container-padding);
        }

        .provider-header {
          margin-bottom: 32px;
        }

        .provider-title {
          font-family: 'Fraunces', serif;
          font-size: 32px;
          font-weight: 800;
          color: var(--color-primary);
          margin-bottom: 10px;
          letter-spacing: -0.8px;
        }

        .provider-subtitle {
          color: var(--color-text-secondary);
          font-weight: 500;
          font-size: 16px;
        }

        .benefits-section {
          margin-bottom: 48px;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .benefit-card {
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 24px;
          transition: all var(--transition-base);
        }

        .benefit-card:hover {
          border-color: var(--color-accent);
          box-shadow: 0 8px 24px rgba(255, 107, 53, 0.08);
          transform: translateY(-4px);
        }

        .benefit-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-accent-soft);
          color: var(--color-accent);
          margin-bottom: 16px;
        }

        .benefit-title {
          font-weight: 700;
          font-size: 16px;
          margin-bottom: 8px;
          color: var(--color-primary);
        }

        .benefit-description {
          color: var(--color-text-secondary);
          font-size: 14px;
          line-height: 1.6;
        }

        .form-section {
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 40px;
          box-shadow: var(--shadow-sm);
        }

        .form-title {
          font-family: 'Fraunces', serif;
          font-size: 24px;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 8px;
        }

        .form-description {
          color: var(--color-text-secondary);
          margin-bottom: 32px;
          font-size: 15px;
        }

        .section-label {
          font-size: 18px;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 20px;
          margin-top: 8px;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-weight: 600;
          font-size: 14px;
          color: var(--color-primary);
          margin-bottom: 8px;
        }

        .form-label .required {
          color: var(--color-accent);
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-bg);
          color: var(--color-primary);
          font-family: var(--font-primary);
          font-size: 15px;
          box-sizing: border-box;
          transition: all var(--transition-fast);
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px var(--color-accent-soft);
        }

        .form-input:disabled,
        .form-select:disabled {
          background: var(--color-bg-soft);
          cursor: not-allowed;
          opacity: 0.6;
        }

        .form-textarea {
          min-height: 100px;
          resize: vertical;
          line-height: 1.6;
        }

        .input-error {
          color: #ef4444;
          font-size: 13px;
          margin-top: 6px;
          display: block;
          font-weight: 500;
        }

        .upload-section {
          background: var(--color-bg-soft);
          border: 2px dashed var(--color-border);
          border-radius: var(--radius-md);
          padding: 20px;
          margin-bottom: 20px;
          text-align: center;
        }

        .upload-section.has-file {
          border-color: #10b981;
          background: #ECFDF5;
        }

        .file-input {
          display: none;
        }

        .file-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: var(--radius-md);
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          color: var(--color-primary);
          transition: all var(--transition-fast);
        }

        .file-label:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
          background: var(--color-accent-soft);
        }

        .file-info {
          margin-top: 16px;
          padding: 12px;
          background: var(--color-bg);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .file-name {
          font-weight: 600;
          color: var(--color-primary);
          font-size: 14px;
        }

        .file-remove {
          background: none;
          border: none;
          color: var(--color-text-secondary);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color var(--transition-fast);
        }

        .file-remove:hover {
          color: #ef4444;
        }

        .checkbox-row {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          margin-top: 16px;
        }

        .checkbox-row input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
          accent-color: var(--color-accent);
          margin-top: 2px;
        }

        .checkbox-row label {
          color: var(--color-text-secondary);
          font-size: 14px;
          line-height: 1.6;
        }

        .checkbox-row label a {
          color: var(--color-accent);
          font-weight: 600;
          text-decoration: none;
        }

        .checkbox-row label a:hover {
          text-decoration: underline;
        }

        .submit-row {
          margin-top: 32px;
          padding-top: 32px;
          border-top: 1.5px solid var(--color-border);
        }

        .submit-btn {
          padding: 14px 32px;
          border-radius: var(--radius-full);
          background: var(--color-accent);
          color: #fff;
          border: none;
          cursor: pointer;
          font-weight: 700;
          font-size: 16px;
          font-family: var(--font-primary);
          display: inline-flex;
          gap: 8px;
          align-items: center;
          transition: all var(--transition-fast);
          box-shadow: 0 4px 14px rgba(255, 107, 53, 0.25);
        }

        .submit-btn:hover:not(:disabled) {
          background: var(--color-accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 900px) {
          .provider-container {
            padding: 0 24px;
          }
          .benefits-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .form-section {
            padding: 32px 24px;
          }
        }

        @media (max-width: 640px) {
          .become-provider-page {
            padding: 24px 0 48px;
          }
          .provider-container {
            padding: 0 16px;
          }
          .provider-title {
            font-size: 26px;
          }
          .benefits-grid {
            grid-template-columns: 1fr;
          }
          .form-section {
            padding: 24px 20px;
          }
          .form-grid-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <Breadcrumb items={[{ label: "Become a Provider" }]} />

      <div className="become-provider-page">
        <div className="provider-container">
          <div className="provider-header">
            <h1 className="provider-title">Become a Provider</h1>
            <p className="provider-subtitle">
              Join Zimbabwe's leading service marketplace and grow your business
            </p>
          </div>

          <div className="benefits-section">
            <div className="benefits-grid">
              {BENEFITS.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div className="benefit-card" key={index}>
                    <div className="benefit-icon">
                      <Icon size={20} strokeWidth={2} />
                    </div>
                    <div className="benefit-title">{benefit.title}</div>
                    <div className="benefit-description">
                      {benefit.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="form-section">
            <h2 className="form-title">Provider Application</h2>
            <p className="form-description">
              Fill out this form to apply. We'll review your application and, if
              approved, invite you to complete your profile.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="section-label">Contact Information</div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    name="fullName"
                    className="form-input"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <span className="input-error">{errors.fullName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <span className="input-error">{errors.email}</span>
                  )}
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">
                    Phone Number <span className="required">*</span>
                  </label>
                  <input
                    name="phone"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+263 77 123 4567"
                  />
                  {errors.phone && (
                    <span className="input-error">{errors.phone}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    WhatsApp Number (Optional)
                  </label>
                  <input
                    name="whatsapp"
                    className="form-input"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    placeholder="If different from phone"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">
                    City <span className="required">*</span>
                  </label>
                  <select
                    name="city"
                    className="form-select"
                    value={formData.city}
                    onChange={handleInputChange}
                  >
                    <option value="">Select your city</option>
                    {CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <span className="input-error">{errors.city}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Service Category <span className="required">*</span>
                  </label>
                  <select
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleInputChange}
                    disabled={categoryLoading || !!categoryError}
                  >
                    <option value="">
                      {categoryLoading
                        ? "Loading categories..."
                        : categoryError
                          ? "Error loading categories"
                          : "Select a category"}
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <span className="input-error">{errors.category}</span>
                  )}
                  {categoryError && !errors.category && (
                    <span className="input-error">{categoryError}</span>
                  )}
                </div>
              </div>

              <div className="section-label">Work Information</div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">
                    Years of Experience <span className="required">*</span>
                  </label>
                  <select
                    name="yearsExperience"
                    className="form-select"
                    value={formData.yearsExperience}
                    onChange={handleInputChange}
                  >
                    <option value="">Select experience</option>
                    <option value="0-1">0–1 years</option>
                    <option value="2-5">2–5 years</option>
                    <option value="5-10">5–10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                  {errors.yearsExperience && (
                    <span className="input-error">
                      {errors.yearsExperience}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Work Type <span className="required">*</span>
                  </label>
                  <select
                    name="workType"
                    className="form-select"
                    value={formData.workType}
                    onChange={handleInputChange}
                  >
                    <option value="">Select type</option>
                    <option value="individual">Individual</option>
                    <option value="team">Small team (2–5)</option>
                    <option value="company">Registered company</option>
                  </select>
                  {errors.workType && (
                    <span className="input-error">{errors.workType}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Availability</label>
                <select
                  name="availability"
                  className="form-select"
                  value={formData.availability}
                  onChange={handleInputChange}
                >
                  <option value="">How soon can you start?</option>
                  <option value="immediately">Immediately</option>
                  <option value="week">Within a week</option>
                  <option value="month">Within a month</option>
                  <option value="exploring">Just exploring</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Brief Description (max 200 characters){" "}
                  <span className="required">*</span>
                </label>
                <textarea
                  name="description"
                  className="form-textarea"
                  maxLength={200}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Briefly describe the type of work you do and what makes you stand out..."
                />
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--color-text-secondary)",
                    marginTop: "4px",
                  }}
                >
                  {formData.description.length}/200 characters
                </div>
                {errors.description && (
                  <span className="input-error">{errors.description}</span>
                )}
              </div>

              <div className="section-label">Verification (Optional)</div>

              <div
                className={`upload-section ${verificationFile ? "has-file" : ""}`}
              >
                <label className="file-label" htmlFor="verificationFile">
                  <Upload size={16} strokeWidth={2} />
                  {verificationFile ? "Change File" : "Upload Proof Document"}
                </label>
                <input
                  id="verificationFile"
                  className="file-input"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--color-text-secondary)",
                    marginTop: "8px",
                  }}
                >
                  Upload a business license, certificate, or ID (speeds up
                  approval)
                </div>
                {verificationFile && (
                  <div className="file-info">
                    <span className="file-name">
                      📄 {verificationFile.name}
                    </span>
                    <button
                      type="button"
                      className="file-remove"
                      onClick={() => setVerificationFile(null)}
                      aria-label="Remove file"
                    >
                      <X size={18} strokeWidth={2} />
                    </button>
                  </div>
                )}
                {errors.verificationFile && (
                  <span className="input-error">{errors.verificationFile}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">How did you hear about us?</label>
                <select
                  name="referral"
                  className="form-select"
                  value={formData.referral}
                  onChange={handleInputChange}
                >
                  <option value="">Select (optional)</option>
                  <option value="facebook">Facebook</option>
                  <option value="friend">Friend or family</option>
                  <option value="google">Google search</option>
                  <option value="flyer">Flyer or poster</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="checkbox-row">
                <input
                  id="terms"
                  type="checkbox"
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleInputChange}
                />
                <label htmlFor="terms">
                  I agree to ZimServ's{" "}
                  <a href="/terms" target="_blank" rel="noreferrer">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" target="_blank" rel="noreferrer">
                    Privacy Policy
                  </a>
                </label>
              </div>
              {errors.agreedToTerms && (
                <div className="input-error" style={{ marginTop: "8px" }}>
                  {errors.agreedToTerms}
                </div>
              )}

              <div className="submit-row">
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Submitting Application..."
                  ) : (
                    <>
                      Submit Application
                      <ArrowRight size={18} strokeWidth={2.5} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
