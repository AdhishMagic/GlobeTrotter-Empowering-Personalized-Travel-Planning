import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import LoginHeader from "pages/Auth/components/LoginHeader";
import SocialAuthButtons from "pages/Auth/components/SocialAuthButtons";
import LoginForm from "pages/Auth/components/LoginForm";
import RegistrationPrompt from "pages/Auth/components/RegistrationPrompt";
import LoginBenefits from "pages/Auth/components/LoginBenefits";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Preserve where the user was trying to go.
  const from = location?.state?.from;

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full max-w-screen-2xl mx-auto px-4 py-6 md:py-8 lg:py-12">
        <div className="bg-card rounded-xl md:rounded-2xl lg:rounded-3xl elevation-2 border border-border overflow-hidden">
          <div className="flex">
            <div className="w-full lg:w-1/2 p-6 md:p-8 lg:p-10">
              <LoginHeader />
              <div className="space-y-6">
                <SocialAuthButtons />
                <LoginForm redirectTo={typeof from === "string" ? from : "/dashboard"} />
                <RegistrationPrompt />
              </div>
            </div>
            <LoginBenefits />
          </div>
        </div>
      </div>
    </div>
  );
}
