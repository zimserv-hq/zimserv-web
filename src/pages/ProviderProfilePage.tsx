// src/pages/ProviderProfilePage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ProviderContent from "../components/Provider/ProviderContent";
import ProviderInfoCard from "../components/Provider/ProviderInfoCard";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { supabase } from "../lib/supabaseClient";

interface Provider {
  id: string;
  slug: string;
  name: string;
  category: string;
  tagline?: string;
  description: string;
  city: string;
  areas: string[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  verificationLevel: string;
  yearsExperience: number;
  pricing?: string;
  priceLabel?: string;
  priceDetails?: string;
  contact: {
    phone: string;
    whatsapp?: string;
    email?: string;
    website?: string;
  };
  services: string[];
  languages: string[];
  workingHours?: {
    weekdays?: string;
    weekends?: string;
    emergency?: string;
  };
  gallery: string[];
  reviews: any[];
  stats: {
    jobsCompleted: number;
    responseTime?: string;
    repeatCustomers?: number;
  };
}

const ProviderProfilePage = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const navigate = useNavigate();

  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (providerId) {
      fetchProviderData(providerId);
    }
  }, [providerId]);

  const fetchProviderData = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch provider with related data
      const { data: providerData, error: providerError } = await supabase
        .from("providers")
        .select(
          `
          id,
          full_name,
          business_name,
          email,
          phone_number,
          whatsapp_number,
          primary_category,
          city,
          bio,
          years_experience,
          profile_image_url,
          website,
          languages,
          pricing_model,
          verification_level,
          avg_rating,
          total_reviews,
          total_jobs_completed,
          response_time_minutes,
          call_available,
          whatsapp_available,
          created_at
        `,
        )
        .eq("id", id)
        .single();

      if (providerError) throw providerError;
      if (!providerData) throw new Error("Provider not found");

      // Fetch service areas
      const { data: serviceAreas, error: areasError } = await supabase
        .from("provider_service_areas")
        .select("city, suburb")
        .eq("provider_id", id);

      if (areasError) throw areasError;

      // Fetch services
      const { data: services, error: servicesError } = await supabase
        .from("provider_services")
        .select("service_name")
        .eq("provider_id", id);

      if (servicesError) throw servicesError;

      // Fetch media/gallery
      const { data: media, error: mediaError } = await supabase
        .from("provider_media")
        .select("file_path, media_type")
        .eq("provider_id", id)
        .eq("media_type", "portfolio")
        .eq("is_verified", true);

      if (mediaError) throw mediaError;

      // Fetch reviews
      const { data: reviews, error: reviewsError } = await supabase
        .from("reviews")
        .select(
          `
          id,
          customer_nickname,
          rating,
          comment,
          created_at,
          is_verified,
          review_replies (
            id,
            reply_text,
            created_at
          )
        `,
        )
        .eq("provider_id", id)
        .order("created_at", { ascending: false });

      if (reviewsError) throw reviewsError;

      // Transform data to match component interface
      const transformedProvider: Provider = {
        id: providerData.id,
        slug:
          providerData.business_name
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-") || providerData.id,
        name: providerData.business_name || providerData.full_name,
        category: providerData.primary_category,
        tagline: `${providerData.years_experience}+ Years Experience`,
        description: providerData.bio || "No description available",
        city: providerData.city,
        areas:
          serviceAreas
            ?.map((area) => area.suburb || area.city)
            .filter(Boolean) || [],
        rating: Number(providerData.avg_rating) || 0,
        reviewCount: providerData.total_reviews || 0,
        verified: providerData.verification_level !== "Basic",
        verificationLevel: providerData.verification_level || "Basic",
        yearsExperience: providerData.years_experience || 0,
        pricing: getPricingDisplay(providerData.pricing_model),
        priceLabel: getPricingLabel(providerData.pricing_model),
        priceDetails: providerData.pricing_model,
        contact: {
          phone: providerData.phone_number,
          whatsapp: providerData.whatsapp_number || providerData.phone_number,
          email: providerData.email || undefined,
          website: providerData.website || undefined,
        },
        services: services?.map((s) => s.service_name) || [],
        languages: providerData.languages || ["English"],
        workingHours: {
          weekdays: "8:00 AM - 6:00 PM",
          weekends: "9:00 AM - 4:00 PM",
          emergency: providerData.call_available ? "Available 24/7" : undefined,
        },
        gallery: media?.map((m) => getMediaUrl(m.file_path)) || [
          providerData.profile_image_url ||
            getDefaultImage(providerData.primary_category),
        ],
        reviews:
          reviews?.map((review) => ({
            id: review.id,
            author: review.customer_nickname,
            rating: review.rating,
            date: getTimeAgo(review.created_at),
            comment: review.comment,
            verified: review.is_verified,
            reply: review.review_replies?.[0]
              ? {
                  text: review.review_replies[0].reply_text,
                  date: getTimeAgo(review.review_replies[0].created_at),
                }
              : undefined,
          })) || [],
        stats: {
          jobsCompleted: providerData.total_jobs_completed || 0,
          responseTime: providerData.response_time_minutes
            ? `< ${Math.ceil(providerData.response_time_minutes / 60)} hours`
            : "N/A",
          repeatCustomers: 0, // Calculate from bookings if needed
        },
      };

      setProvider(transformedProvider);
    } catch (err: any) {
      console.error("Error fetching provider:", err);
      setError(err.message || "Failed to load provider data");
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getPricingDisplay = (pricingModel: string | null): string => {
    if (!pricingModel) return "Contact for quote";
    if (pricingModel === "Hourly Rate") return "$25";
    if (pricingModel === "Fixed Price") return "$50";
    return "Quote";
  };

  const getPricingLabel = (pricingModel: string | null): string => {
    if (!pricingModel) return "per job";
    if (pricingModel === "Hourly Rate") return "per hour";
    if (pricingModel === "Fixed Price") return "fixed price";
    return "based";
  };

  const getMediaUrl = (filePath: string): string => {
    // Get public URL from Supabase Storage
    const { data } = supabase.storage
      .from("provider-media")
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const getDefaultImage = (category: string): string => {
    // Return category-specific placeholder
    const placeholders: Record<string, string> = {
      Plumbing:
        "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop&q=80",
      Electrical:
        "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop&q=80",
      Carpentry:
        "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&h=600&fit=crop&q=80",
    };
    return (
      placeholders[category] ||
      "https://via.placeholder.com/800x600?text=No+Image"
    );
  };

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)} weeks ago`;
    return `${Math.floor(seconds / 2592000)} months ago`;
  };

  // Loading state
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--color-bg-section)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "4px solid var(--color-border)",
              borderTop: "4px solid var(--color-accent)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: "var(--color-text-secondary)" }}>
            Loading provider...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !provider) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--color-bg-section)",
        }}
      >
        <div
          style={{ textAlign: "center", maxWidth: "400px", padding: "0 20px" }}
        >
          <h2 style={{ color: "var(--color-text)", marginBottom: "12px" }}>
            Provider Not Found
          </h2>
          <p
            style={{
              color: "var(--color-text-secondary)",
              marginBottom: "24px",
            }}
          >
            {error || "The provider you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate("/providers")}
            style={{
              padding: "12px 24px",
              background: "var(--color-accent)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Browse All Providers
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .profile-page {
          width: 100%;
          min-height: 100vh;
          background: var(--color-bg-section);
          padding: 40px 0 80px;
          font-family: var(--font-primary);
        }

        .profile-container {
          max-width: var(--container-max-width);
          margin: 0 auto;
          padding: 0 var(--container-padding);
        }

        /* Back Button */
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-full);
          color: var(--color-text-secondary);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
          margin-bottom: 28px;
        }

        .back-btn:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
          background: var(--color-accent-soft);
          transform: translateX(-4px);
        }

        /* Grid Layout: Equal width left and right */
        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
          align-items: start;
        }

        /* Loading spinner animation */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .profile-container { 
            padding: 0 32px; 
          }
          .profile-grid { 
            gap: 24px; 
          }
        }

        @media (max-width: 1024px) {
          .profile-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        @media (max-width: 920px) {
          .profile-page { 
            padding: 32px 0 60px; 
          }
          .profile-container { 
            padding: 0 20px; 
          }
        }

        @media (max-width: 640px) {
          .profile-page { 
            padding: 24px 0 48px; 
          }
          .profile-container { 
            padding: 0 16px; 
          }
          .profile-grid {
            gap: 20px;
          }
        }
      `}</style>

      {/* Breadcrumb - OUTSIDE profile-page */}
      <Breadcrumb
        items={[
          { label: "Providers", path: "/providers" },
          { label: provider.city, path: `/providers?city=${provider.city}` },
          {
            label: provider.category,
            path: `/providers?category=${provider.category}`,
          },
          { label: provider.name },
        ]}
      />

      {/* Main Content */}
      <div className="profile-page">
        <div className="profile-container">
          {/* Back Button */}
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} strokeWidth={2} />
            Back to Results
          </button>

          {/* Grid: Equal Left (Provider Info) | Right (About/Reviews/Gallery) */}
          <div className="profile-grid">
            {/* LEFT: Provider details in button-style cards */}
            <ProviderInfoCard provider={provider} />

            {/* RIGHT: About, Reviews, Gallery tabs */}
            <ProviderContent provider={provider} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProviderProfilePage;
