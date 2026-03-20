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

    // ✅ Password reset flow — handle before OAuth listener
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
      return; // ✅ Stop here — don't run the OAuth listener below
    }

    // ✅ Google OAuth flow — unchanged from your original
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        const role = session.user.user_metadata?.role;

        if (role === "admin" || role === "super_admin") {
          navigate("/admin/dashboard", { replace: true });
        } else if (role === "provider") {
          navigate("/provider/dashboard", { replace: true });
        } else {
          const returnTo = sessionStorage.getItem("returnTo");
          sessionStorage.removeItem("returnTo");
          navigate(returnTo || "/", { replace: true });
        }

        return;
      }

      if (event === "INITIAL_SESSION" && !session) {
        setError("Sign in failed. Please try again.");
        setTimeout(() => navigate("/signin"), 3000);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]); // ✅ searchParams intentionally omitted — runs once on mount

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
