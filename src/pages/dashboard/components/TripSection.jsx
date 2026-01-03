import React from 'react';
import TripCard from './TripCard';
import Icon from '../../../components/AppIcon';

const TripSection = ({ title, trips, icon, emptyMessage }) => {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center space-x-3">
        <div className="bg-primary/10 rounded-lg p-2">
          <Icon name={icon} size={20} color="var(--color-primary)" />
        </div>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-heading font-semibold text-foreground">
          {title}
        </h2>
        <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm font-caption font-medium">
          {trips?.length}
        </span>
      </div>
      {trips?.length === 0 ? (
        <div className="bg-card rounded-lg p-8 md:p-12 text-center border border-border">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Inbox" size={32} color="var(--color-muted-foreground)" />
          </div>
          <p className="text-muted-foreground font-caption">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {trips?.map((trip) => (
            <TripCard key={trip?.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TripSection;