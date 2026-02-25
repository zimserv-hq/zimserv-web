// src/pages/AuthCallbackPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ✅ onAuthStateChange waits for Supabase to finish the OAuth token exchange
    // before firing — getSession() fires immediately and can return null too early
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
          // ✅ Read returnTo saved before OAuth redirect
          const returnTo = sessionStorage.getItem("returnTo");
          sessionStorage.removeItem("returnTo");
          navigate(returnTo || "/", { replace: true });
        }

        return; // stop processing after redirect
      }

      // ✅ Only treat it as an error after INITIAL_SESSION fires with no session
      // Avoids false-positive errors on the first render tick
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
