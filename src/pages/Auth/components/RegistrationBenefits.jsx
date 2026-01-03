import React from "react";
import Icon from "components/AppIcon";

export default function RegistrationBenefits() {
  const benefits = [
    {
      icon: "MapPin",
      title: "Multi-City Planning",
      description: "Plan complex trips across multiple destinations with ease"
    },
    {
      icon: "DollarSign",
      title: "Budget Tracking",
      description: "Keep track of expenses and stay within your travel budget"
    },
    {
      icon: "Calendar",
      title: "Visual Timeline",
      description: "See your entire trip schedule in an intuitive calendar view"
    },
    {
      icon: "Users",
      title: "Community Sharing",
      description: "Share your itineraries and get inspired by other travelers"
    }
  ];

  return (
    <div className="mt-8 md:mt-10 lg:mt-12 pt-6 md:pt-8 lg:pt-10 border-t border-border">
      <h2 className="text-lg md:text-xl lg:text-2xl font-heading font-semibold text-foreground text-center mb-4 md:mb-6 lg:mb-8">
        Why Join GlobeTrotter?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="flex gap-3 md:gap-4 p-4 md:p-5 lg:p-6 bg-muted/50 rounded-lg md:rounded-xl transition-base hover:bg-muted"
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon name={benefit.icon} size={22} color="var(--color-primary)" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm md:text-base lg:text-lg font-heading font-semibold text-foreground mb-1">
                {benefit.title}
              </h3>
              <p className="text-xs md:text-sm lg:text-base text-muted-foreground font-body">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
