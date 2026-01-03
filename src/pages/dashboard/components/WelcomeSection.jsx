import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeSection = ({ userName }) => {
  const currentHour = new Date()?.getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 md:p-8 lg:p-10 text-primary-foreground shadow-lg">
      <div className="flex items-center justify-between">
        <div className="space-y-2 md:space-y-3">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold">
            {greeting}, {userName}!
          </h1>
          <p className="text-sm md:text-base lg:text-lg opacity-90 max-w-2xl">
            Ready to plan your next adventure? Start creating your dream itinerary or explore your upcoming trips.
          </p>
        </div>
        <div className="hidden lg:block">
          <div className="w-20 h-20 bg-primary-foreground/20 rounded-full flex items-center justify-center">
            <Icon name="Plane" size={40} color="var(--color-primary-foreground)" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;