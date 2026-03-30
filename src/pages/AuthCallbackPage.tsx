// src/pages/AuthCallbackPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tokenHash = searchParams.get("token_hash");
    const type = searchParams.get("type");

    // ── Password reset flow ──
    if (tokenHash && type === "recovery") {
      supabase.auth
        .verifyOtp({ token_hash: tokenHash, type: "recovery" })
        .then(({ error }) => {
          if (error) {
            setError("This reset link has expired or is invalid.");
            setTimeout(() => navigate("/signin"), 3000);
          } else {
            navigate("/reset-password", { replace: true });
          }
        });
      return;
    }

    // ── Google OAuth flow ──
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        const role = session.user.user_metadata?.role;

        if (role === "admin" || role === "super_admin") {
          navigate("/admin/dashboard", { replace: true });
          return;
        }

        if (role === "provider") {
          navigate("/provider/dashboard", { replace: true });
          return;
        }

        // ── Regular user: return to where they came from ──
        const returnTo = sessionStorage.getItem("returnTo");
        sessionStorage.removeItem("returnTo");

        // Fall back to /providers (not home) so the context isn't lost
        navigate(returnTo || "/providers", { replace: true });
        return;
      }

      if (event === "INITIAL_SESSION" && !session) {
        setError("Sign in failed. Please try again.");
        setTimeout(() => navigate("/signin"), 3000);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-bg-section)",
        fontFamily: "var(--font-primary)",
        gap: "16px",
      }}
    >
      {error ? (
        <>
          <p style={{ color: "#DC2626", fontWeight: 600, fontSize: "15px" }}>
            ⚠ {error}
          </p>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>
            Redirecting you back to sign in...
          </p>
        </>
      ) : (
        <>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid var(--color-border)",
              borderTopColor: "var(--color-accent)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Completing sign in...
          </p>
        </>
      )}
    </div>
  );
};

export default AuthCallbackPage;
