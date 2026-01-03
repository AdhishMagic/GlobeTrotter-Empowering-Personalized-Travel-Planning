import React from "react";
import Icon from "components/AppIcon";

export default function SocialAuthButtons() {
  const handleSocialAuth = (provider) => {
    alert(
      `${provider} authentication would be implemented here.\nFor demo purposes, please use the email/password login.`
    );
  };

  const socialProviders = [
    { name: "Google", icon: "Chrome", tone: "primary" },
    { name: "Facebook", icon: "Facebook", tone: "secondary" },
    { name: "Apple", icon: "Apple", tone: "accent" }
  ];

  const toneClasses = {
    primary: "bg-primary/10 hover:bg-primary/15",
    secondary: "bg-secondary/10 hover:bg-secondary/15",
    accent: "bg-accent/10 hover:bg-accent/15"
  };

  const toneIconColor = {
    primary: "var(--color-primary)",
    secondary: "var(--color-secondary)",
    accent: "var(--color-accent)"
  };

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs md:text-sm">
          <span className="px-2 md:px-4 bg-card text-muted-foreground font-caption">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {socialProviders.map((provider) => (
          <button
            key={provider.name}
            type="button"
            onClick={() => handleSocialAuth(provider.name)}
            className={
              "flex items-center justify-center gap-2 md:gap-3 px-4 py-3 rounded-lg border border-border transition-base font-body font-medium text-sm md:text-base " +
              (toneClasses[provider.tone] || "bg-muted/50 hover:bg-muted")
            }
            aria-label={`Sign in with ${provider.name}`}
          >
            <Icon name={provider.icon} size={20} color={toneIconColor[provider.tone] || "var(--color-foreground)"} />
            <span className="text-foreground">{provider.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
