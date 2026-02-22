// src/pages/ProviderProfilePage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ProviderContent from "../components/Provider/ProviderContent";
import ProviderInfoCard from "../components/Provider/ProviderInfoCard";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { supabase } from "../lib/supabaseClient";
import type {
  ProviderPublic,
  ProviderService,
  ProviderGalleryImage,
} from "../types/provider";

const ProviderProfilePage = () => {
  // route is /providers/:slug
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [provider, setProvider] = useState<ProviderPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("[ProviderProfilePage] route param slug =", slug);
    if (slug) {
      fetchProviderData(slug);
    } else {
      console.warn("[ProviderProfilePage] slug is undefined, not fetching");
      setLoading(false);
    }
  }, [slug]);

  const fetchProviderData = async (slugValue: string) => {
    try {
      console.log("[fetchProviderData] start, slug =", slugValue);
      setLoading(true);
      setError(null);

      // 1) Provider core data (look up by slug)
      const { data: providerData, error: providerError } = await supabase
        .from("providers")
        .select(
          `
          id,
          slug,
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
        .eq("slug", slugValue)
        .single();

      console.log("[fetchProviderData] providerData =", providerData);
      if (providerError) {
        console.error("[fetchProviderData] providerError =", providerError);
        throw providerError;
      }
      if (!providerData) {
        console.error("[fetchProviderData] providerData is null");
        throw new Error("Provider not found");
      }

      const providerId = providerData.id as string;
      console.log("[fetchProviderData] providerId from DB =", providerId);

      // 2) Service areas
      const { data: serviceAreas, error: areasError } = await supabase
        .from("provider_service_areas")
        .select("city, suburb")
        .eq("provider_id", providerId);

      if (areasError) {
        console.error("[fetchProviderData] areasError =", areasError);
        throw areasError;
      }
      console.log("[fetchProviderData] serviceAreas =", serviceAreas);

      // 3) Services
      const { data: services, error: servicesError } = await supabase
        .from("provider_services")
        .select("service_name, price")
        .eq("provider_id", providerId);

      if (servicesError) {
        console.error("[fetchProviderData] servicesError =", servicesError);
        throw servicesError;
      }
      console.log("[fetchProviderData] services =", services);

      // 4) Media / gallery
      const { data: media, error: mediaError } = await supabase
        .from("provider_media")
        .select("id, file_path, media_type, is_verified")
        .eq("provider_id", providerId);

      if (mediaError) {
        console.error("[fetchProviderData] mediaError =", mediaError);
        throw mediaError;
      }
      console.log("[fetchProviderData] media =", media);

      const transformedServices: ProviderService[] =
        services?.map((s: any) => ({
          name: s.service_name,
          price: s.price ?? null,
        })) ?? [];

      const portfolioMedia =
        media?.filter(
          (m: any) => m.media_type === "portfolio" && m.is_verified,
        ) ?? [];

      const gallery: ProviderGalleryImage[] =
        portfolioMedia.length > 0
          ? portfolioMedia.map((m: any) => ({
              id: m.id,
              url: getMediaUrl(m.file_path),
            }))
          : [
              {
                id: "primary",
                url:
                  providerData.profile_image_url ||
                  getDefaultImage(providerData.primary_category),
              },
            ];

      const transformedProvider: ProviderPublic = {
        id: providerData.id,
        slug:
          providerData.slug ||
          providerData.business_name
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") ||
          providerData.id,
        name: providerData.business_name || providerData.full_name,
        category: providerData.primary_category,
        tagline: providerData.years_experience
          ? `${providerData.years_experience}+ Years Experience`
          : undefined,
        description: providerData.bio || "No description available",
        city: providerData.city,
        areas:
          serviceAreas
            ?.map((area: any) => area.suburb || area.city)
            .filter(Boolean) || [],
        rating: Number(providerData.avg_rating) || 0,
        reviewCount: providerData.total_reviews || 0,
        verified: providerData.verification_level !== "Basic",
        verificationLevel: providerData.verification_level || "Basic",
        yearsExperience: providerData.years_experience || 0,
        pricing: getPricingDisplay(providerData.pricing_model),
        priceLabel: getPricingLabel(providerData.pricing_model),
        pricingSummary: providerData.pricing_model || undefined,
        contact: {
          phone: providerData.phone_number,
          whatsapp:
            providerData.whatsapp_number || providerData.phone_number || "",
          email: providerData.email || undefined,
          website: providerData.website || undefined,
        },
        services: transformedServices,
        languages: providerData.languages || ["English"],
        workingHours: {
          weekdays: "8:00 AM - 6:00 PM",
          weekends: "9:00 AM - 4:00 PM",
          emergency: providerData.call_available ? "Available 24/7" : undefined,
        },
        gallery,
        stats: {
          jobsCompleted: providerData.total_jobs_completed || 0,
          responseTime: providerData.response_time_minutes
            ? `< ${Math.ceil(providerData.response_time_minutes / 60)} hours`
            : "N/A",
          repeatCustomers: 0,
        },
      };

      console.log(
        "[fetchProviderData] transformedProvider =",
        transformedProvider,
      );
      setProvider(transformedProvider);
    } catch (err: any) {
      console.error("Error fetching provider:", err);
      setError(err.message || "Failed to load provider data");
    } finally {
      console.log("[fetchProviderData] done, setting loading=false");
      setLoading(false);
    }
  };

  const getPricingDisplay = (pricingModel: string | null): string => {
    if (!pricingModel) return "Contact for quote";
    if (pricingModel === "Hourly Rate") return "USD 25";
    if (pricingModel === "Fixed Price") return "USD 50";
    return "Quote";
  };

  const getPricingLabel = (pricingModel: string | null): string => {
    if (!pricingModel) return "per job";
    if (pricingModel === "Hourly Rate") return "per hour";
    if (pricingModel === "Fixed Price") return "fixed price";
    return "based";
  };

  const getMediaUrl = (filePath: string): string => {
    const { data } = supabase.storage
      .from("provider-media")
      .getPublicUrl(filePath);
    console.log(
      "[getMediaUrl] filePath =",
      filePath,
      "publicUrl =",
      data.publicUrl,
    );
    return data.publicUrl;
  };

  const getDefaultImage = (category: string): string => {
    const placeholders: Record<string, string> = {
      Plumbing:
        "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop&q=80",
      Electrical:
        "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop&q=80",
      Carpentry:
        "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&h=600&fit=crop&q=80",
    };
    const url =
      placeholders[category] ||
      "https://placehold.co/800x600?text=Service+Provider";
    console.log("[getDefaultImage] category =", category, "url =", url);
    return url;
  };

  if (loading) {
    console.log("[ProviderProfilePage] loading=true, showing loader UI");
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

  if (error || !provider) {
    console.log("[ProviderProfilePage] error or no provider", {
      error,
      provider,
    });
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

  console.log(
    "[ProviderProfilePage] rendering page with provider id =",
    provider.id,
  );

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

        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
          align-items: start;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

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

      <Breadcrumb
        items={[
          { label: "Providers", path: "/providers" },
          { label: provider.city, path: `/providers?city=${provider.city}` },
          {
            label: provider.category,
            path: `/providers?category=${encodeURIComponent(
              provider.category,
            )}`,
          },
          { label: provider.name },
        ]}
      />

      <div className="profile-page">
        <div className="profile-container">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} strokeWidth={2} />
            Back to Results
          </button>

          <div className="profile-grid">
            <ProviderInfoCard provider={provider} />
            <ProviderContent provider={provider} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProviderProfilePage;
