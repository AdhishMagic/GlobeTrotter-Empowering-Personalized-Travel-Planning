import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsSection = ({ stats }) => {
  const statItems = [
    {
      icon: 'MapPin',
      label: 'Popular Destinations',
      value: stats?.popularDestinations,
      color: 'var(--color-primary)',
      bgColor: 'bg-primary/10',
    },
    {
      icon: 'TrendingUp',
      label: 'Trending Activities',
      value: stats?.trendingActivities,
      color: 'var(--color-secondary)',
      bgColor: 'bg-secondary/10',
    },
    {
      icon: 'Users',
      label: 'Active Travelers',
      value: stats?.activeTravelers,
      color: 'var(--color-accent)',
      bgColor: 'bg-accent/10',
    },
    {
      icon: 'Globe',
      label: 'Shared Trips',
      value: stats?.sharedTrips,
      color: 'var(--color-success)',
      bgColor: 'bg-success/10',
    },
  ];

  return (
    <div className="mb-8 md:mb-10 lg:mb-12">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">Community Insights</h2>
        <p className="text-sm md:text-base text-muted-foreground font-body">Discover what's trending in the travel community</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
        {statItems?.map((item, index) => (
          <div
            key={index}
            className="bg-card rounded-xl p-6 elevation-1 border border-border transition-smooth hover:elevation-2"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${item?.bgColor} flex items-center justify-center`}>
                <Icon name={item?.icon} size={24} color={item?.color} />
              </div>
            </div>
            <p className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">{item?.value}</p>
            <p className="text-sm text-muted-foreground font-caption">{item?.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsSection;
