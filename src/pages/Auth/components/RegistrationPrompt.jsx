import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "components/ui/Button";

export default function RegistrationPrompt() {
  const navigate = useNavigate();

  return (
    <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-border text-center">
      <p className="text-sm md:text-base text-muted-foreground font-body mb-3 md:mb-4">Don't have an account yet?</p>
      <Button
        variant="outline"
        size="lg"
        fullWidth
        onClick={() => navigate("/register")}
        iconName="UserPlus"
        iconPosition="left"
      >
        Create New Account
      </Button>
      <p className="text-xs md:text-sm text-muted-foreground font-caption mt-3 md:mt-4">
        Join our community of travelers and start planning your adventures
      </p>
    </div>
  );
}
