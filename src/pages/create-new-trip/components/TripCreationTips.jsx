import React from 'react';
import Icon from '../../../components/AppIcon';

const TripCreationTips = () => {
  const tips = [
    {
      icon: "Calendar",
      iconColor: "var(--color-primary)",
      title: "Plan Ahead",
      description: "Book flights and accommodations 2-3 months in advance for better deals"
    },
    {
      icon: "DollarSign",
      iconColor: "var(--color-secondary)",
      title: "Budget Wisely",
      description: "Allocate 30% for accommodation, 25% for food, 20% for activities, and 25% buffer"
    },
    {
      icon: "MapPin",
      iconColor: "var(--color-accent)",
      title: "Research Destinations",
      description: "Check visa requirements, local customs, and weather conditions before traveling"
    },
    {
      icon: "Clock",
      iconColor: "var(--color-success)",
      title: "Allow Flexibility",
      description: "Leave some unplanned time for spontaneous discoveries and rest"
    }
  ];

  return (
    <div className="bg-card rounded-lg p-6 md:p-8 shadow-md border border-border">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-success/10 rounded-lg p-2">
          <Icon name="Lightbulb" size={24} color="var(--color-success)" />
        </div>
        <h2 className="font-heading font-semibold text-2xl md:text-3xl text-foreground">
          Trip Planning Tips
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips?.map((tip, index) => (
          <div
            key={index}
            className="flex items-start space-x-4 p-4 bg-background rounded-lg border border-border hover-lift transition-base"
          >
            <div className="bg-muted rounded-lg p-3 flex-shrink-0">
              <Icon name={tip?.icon} size={24} color={tip?.iconColor} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-caption font-semibold text-base text-foreground mb-1">
                {tip?.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tip?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripCreationTips;