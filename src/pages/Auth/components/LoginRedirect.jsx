import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "components/AppIcon";

export default function LoginRedirect() {
  const navigate = useNavigate();

  return (
    <div className="mt-6 md:mt-8 lg:mt-10 text-center">
      <div className="flex items-center justify-center gap-2 text-sm md:text-base text-muted-foreground font-body">
        <span>Already have an account?</span>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-primary hover:text-primary/80 font-medium transition-base inline-flex items-center gap-1"
        >
          Sign In
          <Icon name="ArrowRight" size={16} />
        </button>
      </div>
    </div>
  );
}
