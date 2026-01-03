import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import RegistrationHeader from "pages/Auth/components/RegistrationHeader";
import RegistrationForm from "pages/Auth/components/RegistrationForm";
import LoginRedirect from "pages/Auth/components/LoginRedirect";
import RegistrationBenefits from "pages/Auth/components/RegistrationBenefits";

export default function Register() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full max-w-screen-2xl mx-auto px-4 py-6 md:py-8 lg:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-xl md:rounded-2xl lg:rounded-3xl elevation-2 border border-border p-6 md:p-8 lg:p-10">
            <RegistrationHeader />
            <RegistrationForm />
            <LoginRedirect />
            <RegistrationBenefits />
          </div>

          <div className="mt-6 md:mt-8 text-center">
            <p className="text-xs md:text-sm text-muted-foreground font-caption">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
              <br className="hidden md:block" />
              We respect your privacy and will never share your personal information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
