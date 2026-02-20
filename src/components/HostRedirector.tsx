// src/components/HostRedirector.tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const HostRedirector = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const host = window.location.hostname;

    // Admin subdomain → ensure we're in /admin
    if (host === "admin.zimserv.co.zw") {
      if (!location.pathname.startsWith("/admin")) {
        navigate("/admin/dashboard", { replace: true });
      }
      return;
    }

    // Provider subdomain → ensure we're in /provider
    if (host === "provider.zimserv.co.zw") {
      if (!location.pathname.startsWith("/provider")) {
        navigate("/provider/dashboard", { replace: true });
      }
      return;
    }

    // localhost, www.zimserv.co.zw, preview URLs → do nothing
  }, [location.pathname, navigate]);

  return null;
};

export default HostRedirector;
