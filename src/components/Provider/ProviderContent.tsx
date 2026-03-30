// src/components/Provider/ProviderContent.tsx
import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  Star,
  CheckCircle,
  ImageOff,
  MessageSquare,
  DollarSign,
  Award,
  Users,
  Globe,
  TrendingUp,
  Clock,
  ShieldCheck,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Send,
  ThumbsUp,
  Reply,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import type { ProviderPublic } from "../../types/provider";
import { supabase } from "../../lib/supabaseClient";

interface ProviderContentProps {
  provider: ProviderPublic;
}

export interface ProviderContentHandle {
  switchToReviews: () => void;
}

type Review = {
  id: string;
  customer_nickname: string;
  rating: number;
  comment: string;
  created_at: string;
  is_verified: boolean;
  provider_reply: string | null;
  provider_reply_at: string | null;
};

const ProviderContent = forwardRef<ProviderContentHandle, ProviderContentProps>(
  ({ provider }, ref) => {
    const location = useLocation();
    const wrapRef = useRef<HTMLDivElement>(null);

    const [activeTab, setActiveTab] = useState<"about" | "reviews" | "gallery">(
      "about",
    );
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const [currentUser, setCurrentUser] = useState<any>(null);
    const [currentUserName, setCurrentUserName] = useState<string>("");
    const [signingIn, setSigningIn] = useState(false);

    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [reviewCount, setReviewCount] = useState(provider.reviewCount);
    const [avgRating, setAvgRating] = useState(provider.rating);

    const [showForm, setShowForm] = useState(false);
    const [formRating, setFormRating] = useState(0);
    const [formHoverRating, setFormHoverRating] = useState(0);
    const [formComment, setFormComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [rateLimited, setRateLimited] = useState(false);

    const realGallery =
      provider.gallery?.filter((img) => img.id !== "primary") ?? [];
    const hasGallery = realGallery.length > 0;
    const hasServices = provider.services && provider.services.length > 0;

    useImperativeHandle(ref, () => ({
      switchToReviews: () => {
        setActiveTab("reviews");
        setTimeout(() => {
          wrapRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 50);
      },
    }));

    // ── AUTH ──
    useEffect(() => {
      const loadUser = async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const user = session?.user ?? null;
        setCurrentUser(user);
        if (user) {
          const { data } = await supabase
            .from("users")
            .select("full_name")
            .eq("id", user.id)
            .single();
          setCurrentUserName(
            data?.full_name ||
              user.user_metadata?.full_name ||
              user.email?.split("@")[0] ||
              "Anonymous",
          );
        }
      };
      loadUser();
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (_e, session) => {
        const user = session?.user ?? null;
        setCurrentUser(user);
        if (user) {
          const { data } = await supabase
            .from("users")
            .select("full_name")
            .eq("id", user.id)
            .single();
          setCurrentUserName(
            data?.full_name ||
              user.user_metadata?.full_name ||
              user.email?.split("@")[0] ||
              "Anonymous",
          );
        } else {
          setCurrentUserName("");
        }
      });
      return () => subscription.unsubscribe();
    }, []);

    // ── Rate limit check ──
    const checkRateLimit = async (userId: string): Promise<boolean> => {
      const since = new Date(
        Date.now() - 3 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const { count } = await supabase
        .from("reviews")
        .select("id", { count: "exact", head: true })
        .eq("reviewer_user_id", userId)
        .gte("created_at", since);
      return (count ?? 0) >= 2;
    };

    // ── Fetch reviews ──
    const fetchReviews = async () => {
      setReviewsLoading(true);
      const { data, error } = await supabase
        .from("reviews")
        .select(
          "id, customer_nickname, rating, comment, created_at, is_verified, provider_reply, provider_reply_at",
        )
        .eq("provider_id", provider.id)
        .eq("is_flagged", false)
        .order("created_at", { ascending: false });
      if (!error && data) {
        setReviews(data as Review[]);
        setReviewCount(data.length);
        if (data.length > 0) {
          setAvgRating(
            parseFloat(
              (
                data.reduce((sum, r) => sum + r.rating, 0) / data.length
              ).toFixed(1),
            ),
          );
        }
      }
      setReviewsLoading(false);
    };

    useEffect(() => {
      if (activeTab !== "reviews") return;
      fetchReviews();
    }, [activeTab, provider.id]);

    // ── Open form ──
    const handleOpenForm = async () => {
      if (!currentUser) return;
      const limited = await checkRateLimit(currentUser.id);
      setRateLimited(limited);
      setShowForm(true);
      setSubmitSuccess(false);
      setSubmitError(null);
    };

    // ── Google sign-in ──
    const handleSignIn = async () => {
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

    // ── Submit review ──
    const handleSubmitReview = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError(null);
      if (!currentUser) return;
      if (formRating === 0)
        return setSubmitError("Please select a star rating.");
      if (formComment.trim().length < 10)
        return setSubmitError("Comment must be at least 10 characters.");

      const limited = await checkRateLimit(currentUser.id);
      if (limited) {
        setRateLimited(true);
        return setSubmitError("You can only submit 2 reviews every 3 days.");
      }

      setSubmitting(true);
      const { error } = await supabase.from("reviews").insert({
        provider_id: provider.id,
        reviewer_user_id: currentUser.id,
        customer_nickname: currentUserName,
        rating: formRating,
        comment: formComment.trim(),
      });

      if (error) {
        setSubmitError(
          error.message.includes("3 days")
            ? "You can only submit 2 reviews every 3 days."
            : "Failed to submit review. Please try again.",
        );
      } else {
        setSubmitSuccess(true);
        setShowForm(false);
        setFormRating(0);
        setFormComment("");
        await fetchReviews();
      }
      setSubmitting(false);
    };

    // ── Lightbox keyboard nav ──
    useEffect(() => {
      if (lightboxIndex === null) return;
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setLightboxIndex(null);
        if (e.key === "ArrowRight")
          setLightboxIndex((i) =>
            i !== null ? (i + 1) % realGallery.length : null,
          );
        if (e.key === "ArrowLeft")
          setLightboxIndex((i) =>
            i !== null
              ? (i - 1 + realGallery.length) % realGallery.length
              : null,
          );
      };
      window.addEventListener("keydown", handleKey);
      return () => window.removeEventListener("keydown", handleKey);
    }, [lightboxIndex, realGallery.length]);

    const formatDate = (iso: string) =>
      new Date(iso).toLocaleDateString("en-ZW", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

    const getInitials = (name: string) =>
      name
        .trim()
        .split(" ")
        .map((w) => w[0]?.toUpperCase())
        .slice(0, 2)
        .join("");

    return (
      <>
        <style>{`
          .pc-wrap {
            background: var(--color-bg);
            border: 1.5px solid var(--color-border);
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04);
          }

          /* ── TABS ── */
          .pc-tabs {
            display: flex;
            background: var(--color-bg-section);
            border-bottom: 1.5px solid var(--color-border);
            padding: 0 8px;
            gap: 2px;
          }
          .pc-tab {
            position: relative;
            padding: 16px 20px 14px;
            background: transparent;
            border: none;
            color: var(--color-text-secondary);
            font-family: var(--font-primary);
            font-size: 13.5px;
            font-weight: 600;
            cursor: pointer;
            transition: color 0.2s;
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 7px;
            letter-spacing: 0.1px;
          }
          .pc-tab::after {
            content: '';
            position: absolute;
            bottom: 0; left: 16px; right: 16px;
            height: 2.5px;
            background: var(--color-accent);
            border-radius: 2px 2px 0 0;
            transform: scaleX(0);
            transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          }
          .pc-tab.active { color: var(--color-accent); font-weight: 800; }
          .pc-tab.active::after { transform: scaleX(1); }
          .pc-tab:hover:not(.active) {
            color: var(--color-primary);
            background: rgba(0,0,0,0.025);
            border-radius: 10px 10px 0 0;
          }
          .pc-tab-count {
            display: inline-flex;
            align-items: center; justify-content: center;
            min-width: 20px; height: 20px; padding: 0 6px;
            background: var(--color-bg);
            border: 1px solid var(--color-border);
            color: var(--color-text-secondary);
            border-radius: 999px;
            font-size: 10.5px; font-weight: 700;
            transition: background 0.2s, color 0.2s, border-color 0.2s;
          }
          .pc-tab.active .pc-tab-count {
            background: var(--color-accent); color: #fff; border-color: var(--color-accent);
          }

          /* ── BODY ── */
          .pc-body { padding: 28px; }
          .pc-section-title {
            font-family: var(--font-primary);
            font-size: 14px; font-weight: 800;
            color: var(--color-primary);
            letter-spacing: -0.1px;
            margin-bottom: 16px;
            display: flex; align-items: center; gap: 10px;
          }
          .pc-section-title::before { display: none; }
          .pc-description {
            font-size: 14px; color: var(--color-text-secondary);
            line-height: 1.85; margin-bottom: 24px;
            padding: 16px 18px;
            background: var(--color-bg-section);
            border-radius: 12px; border: 1px solid var(--color-border);
            overflow-wrap: break-word; word-break: break-word; overflow: hidden; min-width: 0;
          }
          .pc-divider { height: 1px; background: var(--color-border); margin: 24px 0; }

          .pc-about-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px; margin-bottom: 28px;
          }
          .pc-about-item {
            display: flex; align-items: flex-start; gap: 10px;
            padding: 12px 14px; border-radius: 12px;
            background: var(--color-bg-section);
            border: 1px solid var(--color-border); transition: all 0.2s ease;
          }
          .pc-about-item:hover {
            border-color: rgba(236,111,22,0.3); background: var(--color-accent-soft);
            transform: translateY(-1px); box-shadow: 0 4px 12px rgba(236,111,22,0.08);
          }
          .pc-about-icon {
            width: 30px; height: 30px; border-radius: 8px;
            display: flex; align-items: center; justify-content: center; flex-shrink: 0;
            background: var(--color-accent-soft); color: var(--color-accent);
            border: 1px solid rgba(236,111,22,0.15);
          }
          .pc-about-label {
            font-size: 10px; font-weight: 700; text-transform: uppercase;
            letter-spacing: 0.6px; color: var(--color-text-secondary); margin-bottom: 3px;
          }
          .pc-about-value {
            font-size: 13px; color: var(--color-primary); font-weight: 600; line-height: 1.35;
          }
          .pc-about-value a { color: var(--color-accent); text-decoration: none; font-weight: 600; }
          .pc-about-value a:hover { text-decoration: underline; }

          /* ── SERVICES ── */
          .pc-services-grid {
            display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 28px;
          }
          .pc-service-item {
            display: flex; align-items: center; gap: 10px;
            padding: 12px 14px; background: var(--color-bg-section);
            border: 1px solid var(--color-border); border-radius: 12px;
            transition: all 0.22s ease; cursor: default; position: relative; overflow: hidden;
          }
          .pc-service-item::before {
            content: ''; position: absolute; left: 0; top: 0; bottom: 0;
            width: 0; background: var(--color-accent);
            transition: width 0.2s ease; border-radius: 0 2px 2px 0;
          }
          .pc-service-item:hover::before { width: 3px; }
          .pc-service-item:hover {
            border-color: rgba(236,111,22,0.35); background: var(--color-accent-soft);
            transform: translateX(2px); box-shadow: 0 2px 10px rgba(236,111,22,0.09);
          }
          .pc-service-icon {
            width: 28px; height: 28px; background: var(--color-accent-soft); border-radius: 7px;
            display: flex; align-items: center; justify-content: center; flex-shrink: 0;
            color: var(--color-accent); transition: background 0.2s, color 0.2s;
            border: 1px solid rgba(236,111,22,0.12);
          }
          .pc-service-item:hover .pc-service-icon {
            background: var(--color-accent); color: #fff; border-color: var(--color-accent);
          }
          .pc-service-name {
            flex: 1; font-size: 12.5px; font-weight: 600;
            color: var(--color-primary); min-width: 0; line-height: 1.3;
          }
          .pc-service-price {
            font-size: 13px; font-weight: 800; padding: 4px 10px;
            border-radius: 999px; white-space: nowrap; flex-shrink: 0; letter-spacing: 0.2px;
          }
          .pc-service-price.has-price {
            color: var(--color-primary); background: var(--color-accent-soft);
            border: 1px solid rgba(236,111,22,0.2);
          }
          .pc-service-price.no-price {
            color: var(--color-text-secondary); background: var(--color-bg);
            border: 1px solid var(--color-border);
          }

          /* ── PRICING BOX ── */
          .pc-pricing-box {
            display: flex; gap: 14px; align-items: flex-start;
            padding: 18px 20px; background: var(--color-bg-section);
            border: 1px solid var(--color-border); border-radius: 14px;
            position: relative; overflow: hidden;
          }
          .pc-pricing-box::before { display: none; }
          .pc-pricing-icon {
            width: 38px; height: 38px; background: var(--color-accent-soft); border-radius: 10px;
            display: flex; align-items: center; justify-content: center;
            color: var(--color-accent); flex-shrink: 0; border: 1px solid rgba(236,111,22,0.15);
          }
          .pc-pricing-label {
            font-size: 10px; font-weight: 800; color: var(--color-text-secondary);
            text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 5px;
          }
          .pc-pricing-text { font-size: 14px; color: black; line-height: 1.6; font-weight: 600; }

          /* ── REVIEWS ── */
          .pc-reviews-panel {
            border: 1px solid var(--color-border); border-radius: 16px;
            overflow: hidden; margin-bottom: 20px;
          }
          .pc-reviews-header { display: flex; align-items: stretch; }
          .pc-reviews-score-col {
            padding: 22px 26px; text-align: center;
            background: var(--color-bg-section);
            border-right: 1px solid var(--color-border);
            flex-shrink: 0; display: flex; flex-direction: column;
            align-items: center; justify-content: center; gap: 5px; min-width: 120px;
          }
          .pc-reviews-big {
            font-size: 52px; font-weight: 800; color: var(--color-primary);
            letter-spacing: -4px; line-height: 1;
          }
          .pc-reviews-stars { display: flex; gap: 3px; justify-content: center; }
          .pc-reviews-ct {
            font-size: 11.5px; color: var(--color-text-secondary); font-weight: 500; margin-top: 1px;
          }
          .pc-reviews-meta-col {
            flex: 1; padding: 18px 22px; display: flex; flex-direction: column;
            gap: 8px; justify-content: center;
          }
          .pc-reviews-meta-row {
            display: flex; align-items: center; justify-content: space-between;
            font-size: 13px; padding: 6px 10px; border-radius: 8px; transition: background 0.15s;
          }
          .pc-reviews-meta-row:hover { background: var(--color-bg-section); }
          .pc-reviews-meta-row-icon {
            display: flex; align-items: center; gap: 7px; color: var(--color-text-secondary);
          }
          .pc-reviews-meta-row-icon svg { color: var(--color-accent); }
          .pc-reviews-meta-row strong { color: var(--color-primary); font-weight: 700; font-size: 13px; }

          /* ── SIGN IN PROMPT ── */
          .pc-signin-prompt {
            display: flex; flex-direction: column; align-items: center;
            text-align: center; gap: 12px;
            padding: 28px 24px;
            background: var(--color-bg-section);
            border: 1.5px dashed var(--color-border);
            border-radius: 16px; margin-bottom: 24px;
          }
          .pc-signin-prompt p {
            font-size: 13.5px; color: var(--color-text-secondary);
            line-height: 1.6; margin: 0; max-width: 300px;
          }
          .pc-signin-prompt strong { color: var(--color-primary); }
          .pc-gbtn {
            display: flex; align-items: center; justify-content: center; gap: 10px;
            padding: 11px 22px;
            background: #fff; border: 1.5px solid var(--color-border);
            border-radius: 10px;
            font-family: var(--font-primary); font-size: 13.5px; font-weight: 700;
            color: var(--color-primary); cursor: pointer;
            box-shadow: 0 1px 4px rgba(0,0,0,0.06);
            transition: all 0.2s;
          }
          .pc-gbtn:hover:not(:disabled) {
            border-color: #4285F4; box-shadow: 0 4px 16px rgba(66,133,244,0.14);
            transform: translateY(-1px);
          }
          .pc-gbtn:disabled { opacity: 0.6; cursor: not-allowed; }

          /* ── WRITE REVIEW BUTTON ── */
          .pc-write-review-btn {
            display: flex; align-items: center; justify-content: center; gap: 8px;
            width: 100%; padding: 13px 20px;
            background: var(--color-accent); color: #fff;
            border: none; border-radius: 12px;
            font-family: var(--font-primary); font-size: 14px; font-weight: 700;
            cursor: pointer; transition: all 0.2s ease;
            margin-bottom: 24px;
            box-shadow: 0 2px 10px rgba(236,111,22,0.25);
          }
          .pc-write-review-btn:hover {
            background: #C8570A; transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(236,111,22,0.35);
          }

          /* ── REVIEW AS label ── */
          .pc-reviewing-as {
            display: flex; align-items: center; gap: 8px;
            font-size: 12.5px; color: var(--color-text-secondary);
            margin-bottom: 20px; padding: 9px 14px;
            background: var(--color-bg-section);
            border: 1px solid var(--color-border); border-radius: 10px;
          }
          .pc-reviewing-as strong { color: var(--color-primary); font-weight: 700; }

          /* ── RATE LIMITED ── */
          .pc-rate-limited {
            display: flex; align-items: flex-start; gap: 12px;
            padding: 16px 18px;
            background: #FEF3C7; border: 1.5px solid #FDE68A;
            border-radius: 12px; margin-bottom: 24px;
            font-size: 13.5px; font-weight: 600; color: #92400E;
          }

          /* ── REVIEW FORM ── */
          .pc-review-form-wrap {
            border: 1.5px solid var(--color-accent); border-radius: 16px;
            padding: 22px; margin-bottom: 24px;
            background: var(--color-accent-soft);
            animation: pc-form-in 0.25s cubic-bezier(0.22,1,0.36,1);
          }
          @keyframes pc-form-in {
            from { opacity: 0; transform: translateY(-8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .pc-form-title {
            font-size: 14px; font-weight: 800; color: var(--color-primary);
            margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between;
          }
          .pc-form-close {
            width: 28px; height: 28px; border-radius: 50%;
            background: var(--color-bg); border: 1px solid var(--color-border);
            display: flex; align-items: center; justify-content: center;
            color: var(--color-text-secondary); cursor: pointer; transition: all 0.15s;
          }
          .pc-form-close:hover { background: #FEF2F2; color: #EF4444; border-color: #EF4444; }
          .pc-form-field { margin-bottom: 14px; }
          .pc-form-label {
            display: block; font-size: 11.5px; font-weight: 700;
            color: var(--color-text-secondary); text-transform: uppercase;
            letter-spacing: 0.5px; margin-bottom: 6px;
          }
          .pc-star-picker { display: flex; gap: 6px; align-items: center; }
          .pc-star-picker-star { cursor: pointer; transition: transform 0.15s; color: #D1D5DB; }
          .pc-star-picker-star:hover,
          .pc-star-picker-star.filled { color: #F59E0B; transform: scale(1.15); }
          .pc-form-textarea {
            width: 100%; padding: 10px 14px;
            background: var(--color-bg); border: 1.5px solid var(--color-border);
            border-radius: 10px; font-family: var(--font-primary);
            font-size: 14px; color: var(--color-primary);
            box-sizing: border-box; resize: vertical; min-height: 90px;
            transition: border-color 0.2s;
          }
          .pc-form-textarea:focus { outline: none; border-color: var(--color-accent); background: #fff; }
          .pc-form-error {
            font-size: 12.5px; color: #EF4444;
            background: #FEF2F2; border: 1px solid #FECACA;
            border-radius: 8px; padding: 8px 12px; margin-bottom: 12px;
          }
          .pc-form-submit {
            display: flex; align-items: center; justify-content: center; gap: 8px;
            width: 100%; padding: 11px 20px;
            background: var(--color-accent); color: #fff; border: none; border-radius: 10px;
            font-family: var(--font-primary); font-size: 13.5px; font-weight: 700;
            cursor: pointer; transition: all 0.2s;
          }
          .pc-form-submit:hover:not(:disabled) { background: #C8570A; transform: translateY(-1px); }
          .pc-form-submit:disabled { opacity: 0.6; cursor: not-allowed; }

          /* ── SUCCESS BANNER ── */
          .pc-review-success {
            display: flex; align-items: center; gap: 12px;
            padding: 14px 18px;
            background: #F0FDF4; border: 1.5px solid #BBF7D0; border-radius: 12px;
            margin-bottom: 20px;
            font-size: 13.5px; font-weight: 600; color: #16A34A;
            animation: pc-form-in 0.25s ease;
          }

          /* ── REVIEW LIST ── */
          .pc-review-list { display: flex; flex-direction: column; gap: 14px; }
          .pc-review-card {
            padding: 16px 18px; background: var(--color-bg-section);
            border: 1px solid var(--color-border); border-radius: 14px;
            transition: box-shadow 0.2s;
          }
          .pc-review-card:hover {
            box-shadow: 0 4px 16px rgba(0,0,0,0.06); border-color: rgba(236,111,22,0.2);
          }
          .pc-review-top {
            display: flex; align-items: flex-start;
            justify-content: space-between; gap: 12px; margin-bottom: 10px;
          }
          .pc-review-author { display: flex; align-items: center; gap: 10px; }
          .pc-review-avatar {
            width: 36px; height: 36px; border-radius: 50%;
            background: var(--color-accent);
            display: flex; align-items: center; justify-content: center;
            color: #fff; font-size: 13px; font-weight: 800; flex-shrink: 0;
          }
          .pc-review-name { font-size: 13.5px; font-weight: 700; color: var(--color-primary); }
          .pc-review-date {
            font-size: 11.5px; color: var(--color-text-secondary); font-weight: 400; margin-top: 1px;
          }
          .pc-review-stars { display: flex; gap: 2px; }
          .pc-review-verified {
            display: inline-flex; align-items: center; gap: 4px;
            font-size: 10.5px; font-weight: 700; color: #16A34A;
            background: #F0FDF4; border: 1px solid #BBF7D0;
            border-radius: 999px; padding: 2px 8px; margin-top: 4px;
          }
          .pc-review-comment {
            font-size: 13.5px; color: var(--color-text-secondary); line-height: 1.7; margin: 0;
          }

          /* ── PROVIDER REPLY ── */
          .pc-provider-reply {
            margin-top: 12px;
            padding: 10px 14px;
            background: var(--color-bg);
            border-left: 3px solid var(--color-accent);
            border-radius: 0 10px 10px 0;
            border: 1px solid var(--color-border);
            border-left: 3px solid var(--color-accent);
          }
          .pc-reply-header {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            font-weight: 700;
            color: var(--color-accent);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
          }
          .pc-reply-date {
            margin-left: auto;
            font-size: 11px;
            font-weight: 500;
            color: var(--color-text-secondary);
            text-transform: none;
            letter-spacing: 0;
          }
          .pc-reply-text {
            font-size: 13px;
            color: var(--color-text-secondary);
            line-height: 1.6;
            margin: 0;
          }

          .pc-review-empty {
            display: flex; flex-direction: column; align-items: center;
            text-align: center; padding: 36px 20px; gap: 8px;
            border: 1px dashed var(--color-border); border-radius: 14px;
            background: var(--color-bg-section);
          }
          .pc-review-empty p { font-size: 14px; color: var(--color-text-secondary); margin: 0; }

          /* ── GALLERY ── */
          .pc-gallery-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .pc-gal-item {
            aspect-ratio: 4/3; border-radius: 14px; overflow: hidden;
            position: relative; border: 1.5px solid var(--color-border);
            cursor: pointer; transition: all 0.25s ease; background: var(--color-bg-section);
          }
          .pc-gal-item:hover {
            border-color: var(--color-accent); transform: scale(1.015);
            box-shadow: 0 8px 28px rgba(0,0,0,0.13);
          }
          .pc-gal-img {
            width: 100%; height: 100%; object-fit: cover; object-position: center;
            transition: transform 0.5s ease; display: block;
          }
          .pc-gal-item:hover .pc-gal-img { transform: scale(1.07); }
          .pc-gal-overlay {
            position: absolute; inset: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 55%);
            opacity: 0; transition: opacity 0.25s ease;
            display: flex; align-items: center; justify-content: center;
          }
          .pc-gal-item:hover .pc-gal-overlay { opacity: 1; }
          .pc-gal-zoom-icon {
            width: 36px; height: 36px; border-radius: 50%;
            background: rgba(255,255,255,0.9);
            display: flex; align-items: center; justify-content: center;
            color: var(--color-primary); box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          }

          /* ── LIGHTBOX ── */
          .pc-lightbox-overlay {
            position: fixed; inset: 0; background: rgba(0,0,0,0.92); z-index: 10000;
            display: flex; align-items: center; justify-content: center;
            animation: pc-lb-fade 0.2s ease; backdrop-filter: blur(6px);
          }
          @keyframes pc-lb-fade { from { opacity: 0; } to { opacity: 1; } }
          .pc-lightbox-close {
            position: absolute; top: 16px; right: 16px;
            width: 40px; height: 40px; border-radius: 50%;
            background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
            color: #fff; display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: background 0.2s; z-index: 2;
          }
          .pc-lightbox-close:hover { background: rgba(255,255,255,0.22); }
          .pc-lightbox-counter {
            position: absolute; top: 20px; left: 50%; transform: translateX(-50%);
            color: rgba(255,255,255,0.7); font-size: 13px; font-weight: 600; letter-spacing: 0.5px;
          }
          .pc-lightbox-img-wrap {
            max-width: 90vw; max-height: 82vh;
            display: flex; align-items: center; justify-content: center;
            animation: pc-lb-scale 0.2s cubic-bezier(0.22,1,0.36,1);
          }
          @keyframes pc-lb-scale {
            from { opacity: 0; transform: scale(0.95); }
            to   { opacity: 1; transform: scale(1); }
          }
          .pc-lightbox-img {
            max-width: 90vw; max-height: 82vh; object-fit: contain;
            border-radius: 10px; box-shadow: 0 24px 80px rgba(0,0,0,0.6); display: block;
          }
          .pc-lightbox-nav {
            position: absolute; top: 50%; transform: translateY(-50%);
            width: 44px; height: 44px; border-radius: 50%;
            background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
            color: #fff; display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: background 0.2s; z-index: 2;
          }
          .pc-lightbox-nav:hover { background: rgba(255,255,255,0.22); }
          .pc-lightbox-nav.prev { left: 16px; }
          .pc-lightbox-nav.next { right: 16px; }

          .pc-empty {
            display: flex; flex-direction: column; align-items: center;
            text-align: center; padding: 40px 20px; gap: 8px;
            border: 1px dashed var(--color-border); border-radius: 14px;
            background: var(--color-bg-section);
          }
          .pc-empty-icon {
            width: 48px; height: 48px; background: var(--color-bg); border-radius: 12px;
            border: 1px solid var(--color-border);
            display: flex; align-items: center; justify-content: center;
            color: var(--color-text-secondary); margin-bottom: 6px;
          }
          .pc-empty p { font-size: 14px; color: var(--color-text-secondary); margin: 0; }

          @media (max-width: 900px) {
            .pc-body { padding: 20px; }
            .pc-services-grid { grid-template-columns: 1fr; }
            .pc-gallery-grid { grid-template-columns: 1fr; }
            .pc-about-grid { grid-template-columns: 1fr; }
            .pc-reviews-header { flex-direction: column; }
            .pc-reviews-score-col {
              border-right: none; border-bottom: 1px solid var(--color-border);
              flex-direction: row; gap: 16px; padding: 16px 20px; min-width: auto;
            }
            .pc-reviews-big { font-size: 40px; letter-spacing: -2px; }
          }
          @media (max-width: 640px) {
            .pc-body { padding: 16px; }
            .pc-tab { padding: 14px 12px; font-size: 12.5px; }
            .pc-section-title { font-size: 13.5px; }
          }
        `}</style>

        <div className="pc-wrap" ref={wrapRef}>
          {/* Tabs */}
          <div className="pc-tabs">
            <button
              className={`pc-tab ${activeTab === "about" ? "active" : ""}`}
              onClick={() => setActiveTab("about")}
            >
              About
            </button>
            <button
              className={`pc-tab ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
              <span className="pc-tab-count">{reviewCount}</span>
            </button>
            <button
              className={`pc-tab ${activeTab === "gallery" ? "active" : ""}`}
              onClick={() => setActiveTab("gallery")}
            >
              Gallery
              {hasGallery && (
                <span className="pc-tab-count">{realGallery.length}</span>
              )}
            </button>
          </div>

          <div className="pc-body">
            {/* ── ABOUT ── */}
            {activeTab === "about" && (
              <>
                <div className="pc-section-title">About {provider.name}</div>
                <p className="pc-description">
                  {provider.description || "No description provided yet."}
                </p>

                <div className="pc-about-grid">
                  <div className="pc-about-item">
                    <div className="pc-about-icon">
                      <Award size={14} strokeWidth={2} />
                    </div>
                    <div>
                      <div className="pc-about-label">Experience</div>
                      <div className="pc-about-value">
                        {provider.yearsExperience} years in the field
                      </div>
                    </div>
                  </div>

                  {provider.languages.length > 0 && (
                    <div className="pc-about-item">
                      <div className="pc-about-icon">
                        <Users size={14} strokeWidth={2} />
                      </div>
                      <div>
                        <div className="pc-about-label">Languages</div>
                        <div className="pc-about-value">
                          {provider.languages.join(", ")}
                        </div>
                      </div>
                    </div>
                  )}

                  {provider.contact.website && (
                    <div className="pc-about-item">
                      <div className="pc-about-icon">
                        <Globe size={14} strokeWidth={2} />
                      </div>
                      <div>
                        <div className="pc-about-label">Website</div>
                        <div className="pc-about-value">
                          <a
                            href={
                              provider.contact.website.startsWith("http")
                                ? provider.contact.website
                                : `https://${provider.contact.website}`
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            {provider.contact.website}
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pc-divider" />

                <div className="pc-section-title">Services Offered</div>
                {hasServices ? (
                  <div className="pc-services-grid">
                    {provider.services.map((service, index) => (
                      <div key={index} className="pc-service-item">
                        <div className="pc-service-icon">
                          <CheckCircle size={13} strokeWidth={2.5} />
                        </div>
                        <span className="pc-service-name">{service.name}</span>
                        <span
                          className={`pc-service-price ${service.price != null ? "has-price" : "no-price"}`}
                        >
                          {service.price != null
                            ? `$${service.price}`
                            : "Quote"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--color-text-secondary)",
                      marginBottom: 24,
                    }}
                  >
                    No services listed yet.
                  </p>
                )}

                <div className="pc-divider" />

                <div className="pc-section-title">Pricing</div>
                <div className="pc-pricing-box">
                  <div className="pc-pricing-icon">
                    <DollarSign size={16} strokeWidth={2} />
                  </div>
                  <div>
                    <div className="pc-pricing-label">Rate Details</div>
                    <div className="pc-pricing-text">
                      {provider.pricingSummary ||
                        "Contact this provider for a detailed quote based on your specific job requirements."}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── REVIEWS ── */}
            {activeTab === "reviews" && (
              <>
                <div className="pc-section-title">Customer Reviews</div>

                <div className="pc-reviews-panel">
                  <div className="pc-reviews-header">
                    <div className="pc-reviews-score-col">
                      <div className="pc-reviews-big">
                        {reviewCount > 0 ? avgRating.toFixed(1) : "—"}
                      </div>
                      <div className="pc-reviews-stars">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={13}
                            fill={
                              s <= Math.floor(avgRating) ? "#F59E0B" : "none"
                            }
                            stroke="#F59E0B"
                            strokeWidth={1.5}
                          />
                        ))}
                      </div>
                      <div className="pc-reviews-ct">
                        {reviewCount} review{reviewCount !== 1 ? "s" : ""}
                      </div>
                    </div>

                    <div className="pc-reviews-meta-col">
                      <div className="pc-reviews-meta-row">
                        <div className="pc-reviews-meta-row-icon">
                          <TrendingUp size={14} strokeWidth={2} /> Jobs
                          completed
                        </div>
                        <strong>{provider.stats.jobsCompleted}</strong>
                      </div>
                      <div className="pc-reviews-meta-row">
                        <div className="pc-reviews-meta-row-icon">
                          <ShieldCheck size={14} strokeWidth={2} /> Verification
                        </div>
                        <strong>{provider.verificationLevel || "Basic"}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {submitSuccess && (
                  <div className="pc-review-success">
                    <ThumbsUp size={18} strokeWidth={2} />
                    Thank you! Your review has been submitted.
                  </div>
                )}

                {!currentUser ? (
                  <div className="pc-signin-prompt">
                    <MessageSquare
                      size={28}
                      strokeWidth={1.5}
                      style={{ color: "var(--color-accent)", opacity: 0.7 }}
                    />
                    <p>
                      <strong>Sign in to leave a review.</strong>
                      <br />
                      Share your experience with this provider to help others in
                      the community.
                    </p>
                    <button
                      className="pc-gbtn"
                      onClick={handleSignIn}
                      disabled={signingIn}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24">
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
                      {signingIn ? "Redirecting…" : "Continue with Google"}
                    </button>
                  </div>
                ) : rateLimited && !showForm ? (
                  <div className="pc-rate-limited">
                    <Clock
                      size={20}
                      strokeWidth={2}
                      style={{ flexShrink: 0, marginTop: 1 }}
                    />
                    <div>
                      <div style={{ fontWeight: 800, marginBottom: 3 }}>
                        Review limit reached
                      </div>
                      You can submit up to 2 reviews every 3 days. Please come
                      back later.
                    </div>
                  </div>
                ) : !showForm ? (
                  <button
                    className="pc-write-review-btn"
                    onClick={handleOpenForm}
                  >
                    <MessageSquare size={16} strokeWidth={2} />
                    Write a Review
                  </button>
                ) : (
                  <div className="pc-review-form-wrap">
                    <div className="pc-form-title">
                      Share your experience
                      <button
                        className="pc-form-close"
                        onClick={() => setShowForm(false)}
                      >
                        <X size={14} strokeWidth={2.5} />
                      </button>
                    </div>

                    <div className="pc-reviewing-as">
                      <CheckCircle
                        size={14}
                        strokeWidth={2.5}
                        style={{ color: "var(--color-accent)", flexShrink: 0 }}
                      />
                      Reviewing as <strong>{currentUserName}</strong>
                    </div>

                    <form onSubmit={handleSubmitReview}>
                      <div className="pc-form-field">
                        <label className="pc-form-label">Rating</label>
                        <div className="pc-star-picker">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={28}
                              className={`pc-star-picker-star ${s <= (formHoverRating || formRating) ? "filled" : ""}`}
                              fill={
                                s <= (formHoverRating || formRating)
                                  ? "#F59E0B"
                                  : "none"
                              }
                              stroke={
                                s <= (formHoverRating || formRating)
                                  ? "#F59E0B"
                                  : "#D1D5DB"
                              }
                              strokeWidth={1.5}
                              onMouseEnter={() => setFormHoverRating(s)}
                              onMouseLeave={() => setFormHoverRating(0)}
                              onClick={() => setFormRating(s)}
                              style={{ cursor: "pointer" }}
                            />
                          ))}
                          {formRating > 0 && (
                            <span
                              style={{
                                fontSize: 13,
                                color: "var(--color-text-secondary)",
                                marginLeft: 8,
                              }}
                            >
                              {
                                [
                                  "",
                                  "Poor",
                                  "Fair",
                                  "Good",
                                  "Very Good",
                                  "Excellent",
                                ][formRating]
                              }
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pc-form-field">
                        <label className="pc-form-label">Your Review</label>
                        <textarea
                          className="pc-form-textarea"
                          placeholder="Describe your experience with this provider..."
                          value={formComment}
                          onChange={(e) => setFormComment(e.target.value)}
                          maxLength={1000}
                        />
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--color-text-secondary)",
                            textAlign: "right",
                            marginTop: 4,
                          }}
                        >
                          {formComment.length}/1000
                        </div>
                      </div>

                      {submitError && (
                        <div className="pc-form-error">{submitError}</div>
                      )}

                      <button
                        type="submit"
                        className="pc-form-submit"
                        disabled={submitting}
                      >
                        <Send size={14} strokeWidth={2} />
                        {submitting ? "Submitting…" : "Submit Review"}
                      </button>
                    </form>
                  </div>
                )}

                {reviewsLoading ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "32px 0",
                      color: "var(--color-text-secondary)",
                      fontSize: 14,
                    }}
                  >
                    Loading reviews…
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="pc-review-empty">
                    <MessageSquare
                      size={28}
                      strokeWidth={1.5}
                      style={{
                        color: "var(--color-text-secondary)",
                        opacity: 0.4,
                      }}
                    />
                    <p style={{ fontWeight: 600 }}>No reviews yet</p>
                    <p>Be the first to review this provider!</p>
                  </div>
                ) : (
                  <div className="pc-review-list">
                    {reviews.map((review) => (
                      <div key={review.id} className="pc-review-card">
                        <div className="pc-review-top">
                          <div className="pc-review-author">
                            <div className="pc-review-avatar">
                              {getInitials(review.customer_nickname)}
                            </div>
                            <div>
                              <div className="pc-review-name">
                                {review.customer_nickname}
                              </div>
                              <div className="pc-review-date">
                                {formatDate(review.created_at)}
                              </div>
                              {review.is_verified && (
                                <div className="pc-review-verified">
                                  <CheckCircle size={10} strokeWidth={2.5} />{" "}
                                  Verified
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="pc-review-stars">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={13}
                                fill={s <= review.rating ? "#F59E0B" : "none"}
                                stroke="#F59E0B"
                                strokeWidth={1.5}
                              />
                            ))}
                          </div>
                        </div>

                        <p className="pc-review-comment">{review.comment}</p>

                        {/* ── Provider reply ── */}
                        {review.provider_reply && (
                          <div className="pc-provider-reply">
                            <div className="pc-reply-header">
                              <Reply size={11} strokeWidth={2.5} />
                              {provider.name} replied
                              {review.provider_reply_at && (
                                <span className="pc-reply-date">
                                  {formatDate(review.provider_reply_at)}
                                </span>
                              )}
                            </div>
                            <p className="pc-reply-text">
                              {review.provider_reply}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── GALLERY ── */}
            {activeTab === "gallery" && (
              <>
                <div className="pc-section-title">Work Gallery</div>
                {hasGallery ? (
                  <div className="pc-gallery-grid">
                    {realGallery.map((image, index) => (
                      <div
                        key={image.id}
                        className="pc-gal-item"
                        onClick={() => setLightboxIndex(index)}
                      >
                        <img
                          src={image.url}
                          alt={`Work sample ${index + 1}`}
                          className="pc-gal-img"
                          loading="lazy"
                        />
                        <div className="pc-gal-overlay">
                          <div className="pc-gal-zoom-icon">
                            <ZoomIn size={16} strokeWidth={2} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="pc-empty">
                    <div className="pc-empty-icon">
                      <ImageOff size={20} strokeWidth={1.5} />
                    </div>
                    <p>No photos uploaded yet.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── LIGHTBOX ── */}
        {lightboxIndex !== null && (
          <div
            className="pc-lightbox-overlay"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              className="pc-lightbox-close"
              onClick={() => setLightboxIndex(null)}
            >
              <X size={18} strokeWidth={2.5} />
            </button>
            {realGallery.length > 1 && (
              <div className="pc-lightbox-counter">
                {lightboxIndex + 1} / {realGallery.length}
              </div>
            )}
            {realGallery.length > 1 && (
              <button
                className="pc-lightbox-nav prev"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(
                    (lightboxIndex - 1 + realGallery.length) %
                      realGallery.length,
                  );
                }}
              >
                <ChevronLeft size={22} strokeWidth={2} />
              </button>
            )}
            <div
              className="pc-lightbox-img-wrap"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={realGallery[lightboxIndex].url}
                alt={`Work sample ${lightboxIndex + 1}`}
                className="pc-lightbox-img"
              />
            </div>
            {realGallery.length > 1 && (
              <button
                className="pc-lightbox-nav next"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((lightboxIndex + 1) % realGallery.length);
                }}
              >
                <ChevronRight size={22} strokeWidth={2} />
              </button>
            )}
          </div>
        )}
      </>
    );
  },
);

ProviderContent.displayName = "ProviderContent";

export default ProviderContent;
