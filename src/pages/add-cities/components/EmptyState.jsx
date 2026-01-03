import React from 'react';
import Icon from '../../../components/AppIcon';

const EmptyState = () => {
  return (
    <div className="bg-card border-2 border-dashed border-border rounded-lg p-8 md:p-12 text-center">
      <div className="max-w-md mx-auto space-y-4">
        <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <Icon name="MapPin" size={40} color="var(--color-primary)" />
        </div>
        
        <h3 className="font-heading font-semibold text-xl md:text-2xl text-foreground">
          Start Building Your Journey
        </h3>
        
        <p className="text-sm md:text-base text-muted-foreground">
          Search and add cities to create your multi-destination travel itinerary. You can add dates, reorder cities, and estimate costs for each destination.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="flex flex-col items-center space-y-2 p-4 bg-muted rounded-lg">
            <Icon name="Search" size={24} className="text-primary" />
            <span className="text-xs font-caption text-foreground">Search Cities</span>
          </div>
          <div className="flex flex-col items-center space-y-2 p-4 bg-muted rounded-lg">
            <Icon name="Calendar" size={24} className="text-secondary" />
            <span className="text-xs font-caption text-foreground">Set Dates</span>
          </div>
          <div className="flex flex-col items-center space-y-2 p-4 bg-muted rounded-lg">
            <Icon name="GripVertical" size={24} className="text-accent" />
            <span className="text-xs font-caption text-foreground">Reorder</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;