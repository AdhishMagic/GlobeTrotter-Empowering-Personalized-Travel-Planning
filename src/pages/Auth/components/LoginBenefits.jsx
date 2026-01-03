import React from "react";
import Icon from "components/AppIcon";

export default function LoginBenefits() {
  const benefits = [
    {
      icon: "CalendarDays",
      title: "Plan Multi-City Trips",
      description: "Create detailed itineraries with multiple destinations and activities",
      color: "var(--color-primary)"
    },
    {
      icon: "DollarSign",
      title: "Track Your Budget",
      description: "Monitor expenses across categories with visual budget breakdowns",
      color: "var(--color-secondary)"
    },
    {
      icon: "Users",
      title: "Share & Inspire",
      description: "Connect with travelers and share your amazing journey experiences",
      color: "var(--color-accent)"
    },
    {
      icon: "Calendar",
      title: "Visual Timeline",
      description: "View all your trips in an organized monthly calendar format",
      color: "var(--color-success)"
    }
  ];

  return (
    <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-8 lg:p-12">
      <div className="max-w-lg mx-auto">
        <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">Your Travel Companion</h2>
        <p className="text-lg text-muted-foreground font-body mb-8 lg:mb-12">
          Everything you need to plan, organize, and share your travel adventures in one place
        </p>

        <div className="space-y-6 lg:space-y-8">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-card flex items-center justify-center flex-shrink-0 elevation-1">
                <Icon name={benefit.icon} size={24} color={benefit.color} />
              </div>
              <div>
                <h3 className="text-lg font-heading font-semibold text-foreground mb-1">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground font-body">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-card rounded-xl elevation-1 border border-border">
          <div className="flex items-center gap-3 mb-3">
            <Icon name="Quote" size={24} color="var(--color-primary)" />
            <span className="text-sm font-caption text-muted-foreground">Traveler Testimonial</span>
          </div>
          <p className="text-base font-body text-foreground mb-3">
            "GlobeTrotter transformed how I plan my trips. Everything is organized, budgets are clear, and I love sharing
            my itineraries with friends!"
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="User" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <p className="text-sm font-body font-medium text-foreground">Sarah Johnson</p>
              <p className="text-xs font-caption text-muted-foreground">Frequent Traveler</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
