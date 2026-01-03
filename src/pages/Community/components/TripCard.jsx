import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TripCard = ({ trip, onWishlistToggle, onShare, onClone, onView }) => {
  const formatDuration = (days) => {
    if (days === 1) return '1 day';
    if (days < 7) return `${days} days`;
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    if (remainingDays === 0) return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
    return `${weeks}w ${remainingDays}d`;
  };

  const formatBudget = (amount) => {
    if (amount >= 1000) {
      return `$${(amount / 1000)?.toFixed(1)}k`;
    }
    return `$${amount}`;
  };

  return (
    <div className="bg-card rounded-xl overflow-hidden elevation-1 border border-border transition-smooth hover:elevation-3 group">
      {/* Image Section */}
      <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden">
        <Image
          src={trip?.image}
          alt={trip?.imageAlt}
          className="w-full h-full object-cover transition-smooth group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          {trip?.isFeatured && (
            <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-caption font-medium rounded-full elevation-2">
              Featured
            </span>
          )}
          {trip?.isNew && (
            <span className="px-3 py-1 bg-success text-success-foreground text-xs font-caption font-medium rounded-full elevation-2">
              New
            </span>
          )}
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-lg">
            <Icon name="MapPin" size={16} color="var(--color-primary)" />
            <span className="text-sm font-caption font-medium text-foreground">
              {trip?.cities} {trip?.cities === 1 ? 'city' : 'cities'}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-lg">
            <Icon name="Calendar" size={16} color="var(--color-secondary)" />
            <span className="text-sm font-caption font-medium text-foreground">
              {formatDuration(trip?.duration)}
            </span>
          </div>
        </div>
      </div>
      {/* Content Section */}
      <div className="p-4 md:p-5 lg:p-6">
        {/* Title and Description */}
        <div className="mb-4">
          <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-2 line-clamp-2">
            {trip?.title}
          </h3>
          <p className="text-sm md:text-base text-muted-foreground font-body line-clamp-2">
            {trip?.description}
          </p>
        </div>

        {/* Trip Highlights */}
        <div className="flex flex-wrap gap-2 mb-4">
          {trip?.highlights?.slice(0, 3)?.map((highlight, index) => (
            <span
              key={index}
              className="px-2.5 py-1 bg-muted text-muted-foreground text-xs font-caption rounded-md"
            >
              {highlight}
            </span>
          ))}
          {trip?.highlights?.length > 3 && (
            <span className="px-2.5 py-1 bg-muted text-muted-foreground text-xs font-caption rounded-md">
              +{trip?.highlights?.length - 3} more
            </span>
          )}
        </div>

        {/* Budget and Style */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Icon name="DollarSign" size={16} color="var(--color-accent)" />
            <span className="text-sm font-caption text-foreground">{formatBudget(trip?.budget)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Compass" size={16} color="var(--color-primary)" />
            <span className="text-sm font-caption text-foreground capitalize">{trip?.travelStyle}</span>
          </div>
        </div>

        {/* Traveler Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Image
              src={trip?.traveler?.avatar}
              alt={trip?.traveler?.avatarAlt}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-caption font-medium text-foreground">{trip?.traveler?.name}</p>
              <p className="text-xs text-muted-foreground font-caption">{trip?.traveler?.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Icon name="Heart" size={16} color="var(--color-accent)" />
              <span className="text-xs font-caption text-muted-foreground">{trip?.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="Eye" size={16} color="var(--color-muted-foreground)" />
              <span className="text-xs font-caption text-muted-foreground">{trip?.views}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            fullWidth
            iconName="Eye"
            iconPosition="left"
            onClick={() => onView(trip?.id)}
          >
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Copy"
            onClick={() => onClone(trip?.id)}
            className="flex-shrink-0"
          />
          <Button
            variant="outline"
            size="sm"
            iconName="Heart"
            onClick={() => onWishlistToggle(trip)}
            className={
              [
                'flex-shrink-0',
                trip?.isWishlisted ? 'text-accent border-accent/30 hover:bg-accent/10 hover:text-accent' : ''
              ].join(' ')
            }
            aria-label={trip?.isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            title={trip?.isWishlisted ? 'Wishlisted' : 'Add to wishlist'}
          />
          <Button
            variant="outline"
            size="sm"
            iconName="Share2"
            onClick={() => onShare(trip?.id)}
            className="flex-shrink-0"
          />
        </div>
      </div>
    </div>
  );
};

export default TripCard;
