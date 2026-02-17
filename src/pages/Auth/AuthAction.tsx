// src/pages/Auth/AuthAction.tsx
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { applyActionCode } from "firebase/auth";
import { auth } from "../../config/firebase.config";

const AuthAction = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");

  useEffect(() => {
    const handle = async () => {
      if (!mode || !oobCode) {
        navigate("/login");
        return;
      }

      if (mode === "resetPassword") {
        navigate(`/reset-password?${searchParams.toString()}`);
        return;
      }

      if (mode === "verifyEmail") {
        try {
          await applyActionCode(auth, oobCode);
          // optionally force reload user state later
          navigate("/login", {
            state: {
              message: "Email verified successfully! You can now log in.",
            },
          });
        } catch (e) {
          navigate("/login", {
            state: {
              message:
                "Verification link is invalid or expired. Please request a new one.",
            },
          });
        }
      }
    };

    handle();
  }, [mode, oobCode, searchParams, navigate]);

  return null; // or a small loading spinner
};

export default AuthAction;
