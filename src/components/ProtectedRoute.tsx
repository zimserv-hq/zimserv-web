// src/components/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "super_admin" | "provider";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsAuthenticated(false);
        setHasAccess(false);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);

      // ── Provider routes ──────────────────────────────────────────────────
      if (requiredRole === "provider") {
        const { data: providerRow, error } = await supabase
          .from("providers")
          .select("id, status")
          .eq("email", user.email)
          .maybeSingle();

        if (error || !providerRow) {
          setHasAccess(false);
        } else if (
          ["suspended", "banned", "rejected"].includes(providerRow.status)
        ) {
          setHasAccess(false);
          setIsSuspended(true);
        } else {
          setHasAccess(true);
        }

        setLoading(false);
        return;
      }

      // ── Admin routes ─────────────────────────────────────────────────────
      if (requiredRole) {
        const userRole = user.app_metadata?.role;

        // Super admin has access to everything
        if (userRole === "super_admin") {
          setHasAccess(true);
        } else if (requiredRole === "admin") {
          // Regular admin can access admin routes but not super_admin-only routes
          setHasAccess(userRole === "admin" || userRole === "super_admin");
        } else {
          setHasAccess(false);
        }
      } else {
        setHasAccess(true);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "var(--bg-primary, #f8f9fa)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "4px solid #e5e7eb",
              borderTopColor: "#FF6B35",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          ></div>
          <p style={{ color: "#6b7280", fontSize: "14px", fontWeight: 500 }}>
            Verifying access...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to the correct login page based on route type
    const loginPath =
      requiredRole === "provider" ? "/provider/login" : "/admin/login";
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (!hasAccess) {
    // Suspended / banned provider
    if (isSuspended) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            background: "var(--bg-primary, #f8f9fa)",
            padding: "20px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              maxWidth: "400px",
              background: "white",
              padding: "40px",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                background: "#FEF2F2",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: "30px",
              }}
            >
              🚫
            </div>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#111827",
                margin: "0 0 12px 0",
              }}
            >
              Account Suspended
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "#6b7280",
                margin: "0 0 24px 0",
                lineHeight: 1.6,
              }}
            >
              Your provider account has been suspended or is no longer active.
              Please contact our support team if you believe this is a mistake.
            </p>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/provider/login";
              }}
              style={{
                padding: "10px 24px",
                background: "#FF6B35",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      );
    }

    // Authenticated but doesn't have required admin role
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "var(--bg-primary, #f8f9fa)",
          padding: "20px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: "400px",
            background: "white",
            padding: "40px",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 12px 0",
            }}
          >
            Access Denied
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#6b7280",
              margin: "0 0 24px 0",
              lineHeight: 1.6,
            }}
          >
            You don't have permission to access this page. Please contact a
            Super Administrator if you need access.
          </p>
          <button
            onClick={() => window.history.back()}
            style={{
              padding: "10px 24px",
              background: "#FF6B35",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
