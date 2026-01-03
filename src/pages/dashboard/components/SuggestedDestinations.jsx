import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const SuggestedDestinations = ({ destinations }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-md border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">
          Suggested Destinations
        </h3>
        <Icon name="Compass" size={20} color="var(--color-accent)" />
      </div>
      <div className="space-y-3">
        {destinations?.map((destination) => (
          <div
            key={destination?.id}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-base cursor-pointer"
            onClick={() => navigate('/create-new-trip')}
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={destination?.image}
                alt={destination?.imageAlt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm md:text-base font-caption font-semibold text-foreground line-clamp-1">
                {destination?.name}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {destination?.country}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Icon name="Star" size={12} />
                  <span className="font-data">{destination?.rating}</span>
                </div>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  {destination?.attractions} attractions
                </span>
              </div>
            </div>
            <Icon name="ChevronRight" size={20} color="var(--color-muted-foreground)" />
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        fullWidth
        iconName="Plus"
        iconPosition="left"
        onClick={() => navigate('/create-new-trip')}
        className="mt-4"
      >
        Start Planning
      </Button>
    </div>
  );
};

export default SuggestedDestinations;