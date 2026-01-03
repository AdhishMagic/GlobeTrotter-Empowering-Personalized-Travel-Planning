import React from 'react';
import Icon from '../../../components/AppIcon';

const FeaturesSection = () => {
  const features = [
    {
      icon: 'MapPin',
      iconColor: 'var(--color-primary)',
      bgColor: 'bg-primary/10',
      title: 'Multi-City Planning',
      description: 'Create comprehensive itineraries spanning multiple destinations with flexible date ranges and seamless city transitions.'
    },
    {
      icon: 'Wallet',
      iconColor: 'var(--color-secondary)',
      bgColor: 'bg-secondary/10',
      title: 'Smart Budget Tracking',
      description: 'Monitor expenses across accommodation, transport, and activities with real-time cost calculations and visual breakdowns.'
    },
    {
      icon: 'Calendar',
      iconColor: 'var(--color-accent)',
      bgColor: 'bg-accent/10',
      title: 'Visual Timeline',
      description: 'Organize activities with intuitive day-wise and city-wise layouts, complete with monthly calendar views and scheduling tools.'
    },
    {
      icon: 'Users',
      iconColor: 'var(--color-success)',
      bgColor: 'bg-success/10',
      title: 'Community Sharing',
      description: 'Share your travel experiences, discover inspiring itineraries, and connect with fellow travelers worldwide.'
    },
    {
      icon: 'Search',
      iconColor: 'var(--color-warning)',
      bgColor: 'bg-warning/10',
      title: 'Activity Discovery',
      description: 'Find and add activities to your itinerary with cost assignment, time scheduling, and easy management capabilities.'
    },
    {
      icon: 'BarChart3',
      iconColor: 'var(--color-error)',
      bgColor: 'bg-error/10',
      title: 'Analytics Dashboard',
      description: 'Track your travel statistics, view trip summaries, and gain insights into your travel patterns and preferences.'
    }
  ];

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center space-y-4 md:space-y-6 mb-12 md:mb-16 lg:mb-20">
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground">
            Everything You Need to Plan
            <span className="block text-primary mt-2">Your Perfect Journey</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Powerful features designed to make travel planning effortless, organized, and enjoyable from start to finish.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features?.map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 md:p-8 shadow-md hover-lift transition-base border border-border group"
            >
              <div className={`${feature?.bgColor} rounded-lg p-4 w-fit mb-4 md:mb-6 transition-base group-hover:scale-110`}>
                <Icon name={feature?.icon} size={28} color={feature?.iconColor} />
              </div>
              <h3 className="font-heading font-semibold text-xl md:text-2xl text-foreground mb-3 md:mb-4">
                {feature?.title}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {feature?.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;