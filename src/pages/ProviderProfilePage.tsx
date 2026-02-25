// src/pages/ProviderProfilePage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
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
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [provider, setProvider] = useState<ProviderPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── AUTH STATE ────────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleContactClick = (action: () => void) => {
    if (!currentUser) {
      setShowLoginPrompt(true);
    } else {
      action();
    }
  };

  const handleSignInRedirect = async () => {
    setSigningIn(true);
    sessionStorage.setItem("returnTo", location.pathname + location.search);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    setSigningIn(false);
  };
  // ─────────────────────────────────────────────────────────────────────────

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

      const { data: serviceAreas, error: areasError } = await supabase
        .from("provider_service_areas")
        .select("city, suburb")
        .eq("provider_id", providerId);

      if (areasError) {
        console.error("[fetchProviderData] areasError =", areasError);
        throw areasError;
      }

      const { data: services, error: servicesError } = await supabase
        .from("provider_services")
        .select("service_name, price")
        .eq("provider_id", providerId);

      if (servicesError) {
        console.error("[fetchProviderData] servicesError =", servicesError);
        throw servicesError;
      }

      const { data: media, error: mediaError } = await supabase
        .from("provider_media")
        .select("id, file_path, media_type, is_verified")
        .eq("provider_id", providerId);

      if (mediaError) {
        console.error("[fetchProviderData] mediaError =", mediaError);
        throw mediaError;
      }

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

  // ── LOADING STATE ─────────────────────────────────────────────────────────
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
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Loading provider...
          </p>
        </div>
      </div>
    );
  }

  // ── ERROR STATE ───────────────────────────────────────────────────────────
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

        /* ── LOGIN PROMPT MODAL ───────────────────────────── */
        .pp-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(4px);
          animation: pp-fade-in 0.2s ease;
        }

        @keyframes pp-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .pp-modal {
          background: var(--color-bg);
          border-radius: var(--radius-xl);
          padding: 40px 36px 36px;
          max-width: 380px;
          width: 90%;
          text-align: center;
          position: relative;
          border: 1.5px solid var(--color-border);
          box-shadow: var(--shadow-lg);
          animation: pp-slide-up 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        }

        @keyframes pp-slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .pp-modal-stripe {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--color-accent), var(--color-accent-light));
          border-radius: var(--radius-xl) var(--radius-xl) 0 0;
        }

        .pp-modal-close {
          position: absolute;
          top: 14px; right: 14px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--color-text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: var(--radius-sm);
          transition: color var(--transition-fast), background var(--transition-fast);
        }

        .pp-modal-close:hover {
          color: var(--color-primary);
          background: var(--color-bg-section);
        }

        .pp-modal-icon { font-size: 44px; margin-bottom: 14px; }

        .pp-modal-title {
          font-size: 20px;
          font-weight: 800;
          color: var(--color-primary);
          letter-spacing: -0.4px;
          margin-bottom: 8px;
        }

        .pp-modal-text {
          font-size: 14px;
          color: var(--color-text-secondary);
          margin-bottom: 28px;
          line-height: 1.6;
        }

        .pp-modal-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }

        .pp-modal-google-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          padding: 13px 20px;
          border-radius: var(--radius-md);
          font-family: var(--font-primary);
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          color: var(--color-primary);
          box-shadow: var(--shadow-sm);
          transition:
            border-color var(--transition-fast),
            box-shadow var(--transition-fast),
            transform var(--transition-fast);
        }

        .pp-modal-google-btn:hover {
          border-color: #4285F4;
          box-shadow: 0 4px 16px rgba(66,133,244,0.15);
          transform: translateY(-1px);
        }

        .pp-modal-google-btn:active { transform: scale(0.98); }

        .pp-modal-google-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        .pp-modal-google-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .pp-modal-cancel-btn {
          width: 100%;
          padding: 13px 20px;
          border-radius: var(--radius-md);
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          background: transparent;
          border: 1.5px solid var(--color-border);
          color: var(--color-text-secondary);
          transition: all var(--transition-fast);
        }

        .pp-modal-cancel-btn:hover {
          background: var(--color-bg-section);
          border-color: var(--color-text-secondary);
          color: var(--color-primary);
        }

        @keyframes spin {
          0%  { transform: rotate(0deg); }
          100%{ transform: rotate(360deg); }
        }

        @media (max-width: 1200px) {
          .profile-container { padding: 0 32px; }
          .profile-grid { gap: 24px; }
        }

        @media (max-width: 1024px) {
          .profile-grid { grid-template-columns: 1fr; gap: 24px; }
        }

        @media (max-width: 920px) {
          .profile-page { padding: 32px 0 60px; }
          .profile-container { padding: 0 20px; }
        }

        @media (max-width: 640px) {
          .profile-page { padding: 24px 0 48px; }
          .profile-container { padding: 0 16px; }
          .profile-grid { gap: 20px; }
          .pp-modal { padding: 36px 20px 28px; }
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
            {/* ✅ Auth props passed down to ProviderInfoCard */}
            <ProviderInfoCard
              provider={provider}
              currentUser={currentUser}
              onContactClick={handleContactClick}
            />
            <ProviderContent provider={provider} />
          </div>
        </div>
      </div>

      {/* ── Login Prompt Modal ── */}
      {showLoginPrompt && (
        <div
          className="pp-modal-overlay"
          onClick={() => !signingIn && setShowLoginPrompt(false)}
        >
          <div className="pp-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="pp-modal-close"
              onClick={() => setShowLoginPrompt(false)}
              aria-label="Close"
              disabled={signingIn}
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            {signingIn ? (
              <>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    border: "3px solid var(--color-border)",
                    borderTopColor: "var(--color-accent)",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                    margin: "14px auto 20px",
                  }}
                />
                <p
                  style={{
                    color: "var(--color-text-secondary)",
                    fontSize: 14,
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  Redirecting to Google...
                </p>
              </>
            ) : (
              <>
                <div className="pp-modal-icon">🔒</div>
                <h3 className="pp-modal-title">Sign in to Contact</h3>
                <p className="pp-modal-text">
                  Sign in with your Google account to contact service providers
                  via WhatsApp or phone call.
                </p>
                <div className="pp-modal-actions">
                  <button
                    className="pp-modal-google-btn"
                    onClick={handleSignInRedirect}
                    disabled={signingIn}
                  >
                    <svg className="pp-modal-google-icon" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </button>
                  <button
                    className="pp-modal-cancel-btn"
                    onClick={() => setShowLoginPrompt(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProviderProfilePage;
