import React from 'react';
import Icon from '../../../components/AppIcon';

const TripTimeline = ({ cities }) => {
  const calculateTotalDuration = () => {
    return cities?.reduce((total, city) => {
      const start = new Date(city.startDate)?.getTime();
      const end = new Date(city.endDate)?.getTime();
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      return total + (days > 0 ? days : 0);
    }, 0);
  };

  const calculateTotalCost = () => {
    return cities?.reduce((total, city) => {
      const start = new Date(city.startDate)?.getTime();
      const end = new Date(city.endDate)?.getTime();
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      return total + (city?.estimatedCost * (days > 0 ? days : 0));
    }, 0);
  };

  const totalDuration = calculateTotalDuration();
  const totalCost = calculateTotalCost();

  if (cities?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 md:p-8 text-center">
        <Icon name="MapPin" size={48} className="mx-auto mb-4 text-muted-foreground" />
        <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
          No Cities Added Yet
        </h3>
        <p className="text-sm text-muted-foreground">
          Start building your journey by adding cities to your trip
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h3 className="font-heading font-semibold text-lg md:text-xl text-foreground">
          Trip Timeline
        </h3>
        <div className="flex items-center space-x-2 text-primary">
          <Icon name="Route" size={20} />
          <span className="font-caption font-medium text-sm">
            {cities?.length} {cities?.length === 1 ? 'City' : 'Cities'}
          </span>
        </div>
      </div>
      <div className="space-y-4">
        {cities?.map((city, index) => {
          const start = new Date(city.startDate)?.getTime();
          const end = new Date(city.endDate)?.getTime();
          const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

          return (
            <div key={city?.id} className="relative">
              <div className="flex items-start space-x-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-caption font-semibold flex-shrink-0">
                    {index + 1}
                  </div>
                  {index < cities?.length - 1 && (
                    <div className="w-0.5 h-16 bg-border my-2" />
                  )}
                </div>

                <div className="flex-1 pb-4">
                  <div className="font-caption font-semibold text-foreground mb-1">
                    {city?.name}, {city?.country}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {new Date(city.startDate)?.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })} - {new Date(city.endDate)?.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Icon name="Clock" size={14} />
                      <span>{days} {days === 1 ? 'day' : 'days'}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Icon name="DollarSign" size={14} />
                      <span className="font-data">${(city?.estimatedCost * days)?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="pt-4 border-t border-border space-y-3">
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={18} className="text-primary" />
            <span className="text-sm font-caption text-foreground">Total Duration</span>
          </div>
          <span className="font-data font-semibold text-foreground">
            {totalDuration} {totalDuration === 1 ? 'day' : 'days'}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Wallet" size={18} className="text-success" />
            <span className="text-sm font-caption text-foreground">Estimated Total</span>
          </div>
          <span className="font-data font-semibold text-lg text-foreground">
            ${totalCost?.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TripTimeline;