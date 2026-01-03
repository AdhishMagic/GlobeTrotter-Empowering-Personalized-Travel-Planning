import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const TripCard = ({ trip }) => {
  const navigate = useNavigate();

  const getDaysRemaining = (startDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const diffTime = start - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (status) => {
    const badges = {
      ongoing: { text: 'In Progress', color: 'bg-success/10 text-success', icon: 'Play' },
      upcoming: { text: 'Upcoming', color: 'bg-primary/10 text-primary', icon: 'Calendar' },
      completed: { text: 'Completed', color: 'bg-muted text-muted-foreground', icon: 'CheckCircle2' }
    };
    return badges?.[status] || badges?.upcoming;
  };

  const badge = getStatusBadge(trip?.status);
  const daysRemaining = trip?.status === 'upcoming' ? getDaysRemaining(trip?.startDate) : null;

  return (
    <div className="bg-card rounded-lg shadow-md border border-border overflow-hidden hover-lift transition-base">
      <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden">
        <Image
          src={trip?.image}
          alt={trip?.imageAlt}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className={`${badge?.color} px-3 py-1 rounded-full text-xs font-caption font-medium flex items-center space-x-1`}>
            <Icon name={badge?.icon} size={14} />
            <span>{badge?.text}</span>
          </span>
        </div>
        {daysRemaining !== null && daysRemaining > 0 && (
          <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-xs font-caption font-medium text-foreground">
              {daysRemaining} days to go
            </span>
          </div>
        )}
      </div>
      <div className="p-4 md:p-5 space-y-3">
        <div>
          <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-1 line-clamp-1">
            {trip?.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {trip?.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-xs md:text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="MapPin" size={16} />
            <span className="font-caption">{trip?.cities} {trip?.cities === 1 ? 'city' : 'cities'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Calendar" size={16} />
            <span className="font-caption">{trip?.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="DollarSign" size={16} />
            <span className="font-caption font-data">${trip?.budget?.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Button
            variant="default"
            size="sm"
            fullWidth
            iconName="Eye"
            iconPosition="left"
            onClick={() => navigate('/activity-search')}
          >
            View Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Edit"
            onClick={() => navigate('/create-new-trip')}
          />
        </div>
      </div>
    </div>
  );
};

export default TripCard;