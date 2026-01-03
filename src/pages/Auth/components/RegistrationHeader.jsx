import React from "react";
import Icon from "components/AppIcon";

export default function RegistrationHeader() {
  return (
    <div className="text-center mb-6 md:mb-8 lg:mb-10">
      <div className="flex justify-center mb-4 md:mb-5 lg:mb-6">
        <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Icon name="Globe" size={44} color="var(--color-primary)" />
        </div>
      </div>

      <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2 md:mb-3">
        Join GlobeTrotter
      </h1>

      <p className="text-sm md:text-base lg:text-lg text-muted-foreground font-body max-w-md mx-auto">
        Create your account and start planning amazing travel adventures around the world
      </p>
    </div>
  );
}
