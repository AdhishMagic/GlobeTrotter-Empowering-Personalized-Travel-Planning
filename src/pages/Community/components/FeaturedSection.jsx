import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FeaturedSection = ({ featuredTrips, onView, onClone }) => {
  if (!featuredTrips || featuredTrips?.length === 0) return null;

  const mainFeatured = featuredTrips?.[0];

  return (
    <div className="mb-8 md:mb-10 lg:mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">Featured Trips</h2>
          <p className="text-sm md:text-base text-muted-foreground font-body">Editor's picks and community favorites</p>
        </div>
      </div>

      {/* Main Featured Trip */}
      <div className="bg-card rounded-xl overflow-hidden elevation-2 border border-border mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
            <Image src={mainFeatured?.image} alt={mainFeatured?.imageAlt} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4">
              <span className="px-4 py-2 bg-accent text-accent-foreground text-sm font-caption font-medium rounded-full elevation-2">
                Editor's Choice
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
              {mainFeatured?.title}
            </h3>
            <p className="text-base md:text-lg text-muted-foreground font-body mb-6 line-clamp-3">
              {mainFeatured?.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Icon name="MapPin" size={20} color="var(--color-primary)" />
                <div>
                  <p className="text-lg font-heading font-semibold text-foreground">{mainFeatured?.cities}</p>
                  <p className="text-xs text-muted-foreground font-caption">Cities</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Calendar" size={20} color="var(--color-secondary)" />
                <div>
                  <p className="text-lg font-heading font-semibold text-foreground">{mainFeatured?.duration}</p>
                  <p className="text-xs text-muted-foreground font-caption">Days</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="DollarSign" size={20} color="var(--color-accent)" />
                <div>
                  <p className="text-lg font-heading font-semibold text-foreground">${mainFeatured?.budget}</p>
                  <p className="text-xs text-muted-foreground font-caption">Budget</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Heart" size={20} color="var(--color-accent)" />
                <div>
                  <p className="text-lg font-heading font-semibold text-foreground">{mainFeatured?.likes}</p>
                  <p className="text-xs text-muted-foreground font-caption">Likes</p>
                </div>
              </div>
            </div>

            {/* Traveler */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
              <Image
                src={mainFeatured?.traveler?.avatar}
                alt={mainFeatured?.traveler?.avatarAlt}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-caption font-medium text-foreground">{mainFeatured?.traveler?.name}</p>
                <p className="text-xs text-muted-foreground font-caption">{mainFeatured?.traveler?.location}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="default"
                size="lg"
                iconName="Eye"
                iconPosition="left"
                onClick={() => onView(mainFeatured?.id)}
                className="flex-1"
              >
                View Trip
              </Button>
              <Button
                variant="outline"
                size="lg"
                iconName="Copy"
                iconPosition="left"
                onClick={() => onClone(mainFeatured?.id)}
                className="flex-1"
              >
                Clone
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Featured Trips */}
      {featuredTrips?.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
          {featuredTrips?.slice(1, 4)?.map((trip) => (
            <div
              key={trip?.id}
              className="bg-card rounded-xl overflow-hidden elevation-1 border border-border transition-smooth hover:elevation-2 cursor-pointer"
              onClick={() => onView(trip?.id)}
            >
              <div className="relative h-40 md:h-48 overflow-hidden">
                <Image src={trip?.image} alt={trip?.imageAlt} className="w-full h-full object-cover transition-smooth hover:scale-105" />
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-caption font-medium rounded-full elevation-2">
                    Featured
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-base md:text-lg font-heading font-semibold text-foreground mb-2 line-clamp-2">{trip?.title}</h4>
                <div className="flex items-center justify-between text-sm text-muted-foreground font-caption">
                  <span>{trip?.cities} cities</span>
                  <span>{trip?.duration} days</span>
                  <span className="flex items-center gap-1">
                    <Icon name="Heart" size={14} color="var(--color-accent)" />
                    {trip?.likes}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedSection;
