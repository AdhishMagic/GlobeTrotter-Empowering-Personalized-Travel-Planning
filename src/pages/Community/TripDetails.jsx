import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "components/ui/Button";
import Icon from "components/AppIcon";
import Image from "components/AppImage";

import { findCommunityTripById } from "pages/Community/data";

export default function TripDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const trip = findCommunityTripById(id);

  if (!trip) {
    return (
      <div className="bg-background">
        <div className="max-w-screen-2xl mx-auto">
          <div className="bg-card rounded-xl border border-border elevation-1 p-8 text-center">
            <Icon name="Search" size={44} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
            <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Trip not found</h1>
            <p className="text-muted-foreground font-body mb-5">This community trip is not available.</p>
            <Button variant="default" iconName="ArrowLeft" iconPosition="left" onClick={() => navigate("/community")}
              >Back to Community</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="max-w-screen-2xl mx-auto">
        <div className="mb-6 md:mb-8 flex items-center justify-between gap-3">
          <Button variant="outline" iconName="ArrowLeft" iconPosition="left" onClick={() => navigate("/community")}
            >Back</Button>
          <Button variant="default" iconName="Copy" iconPosition="left" onClick={() => navigate("/trip/create")}
            >Clone to My Trips</Button>
        </div>

        <div className="bg-card rounded-xl overflow-hidden elevation-1 border border-border">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-64 md:h-80 lg:h-[420px] overflow-hidden">
              <Image src={trip.image} alt={trip.imageAlt} className="w-full h-full object-cover" />
              {(trip.isFeatured || trip.isNew) && (
                <div className="absolute top-4 left-4 flex gap-2">
                  {trip.isFeatured && (
                    <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-caption font-medium rounded-full elevation-2">
                      Featured
                    </span>
                  )}
                  {trip.isNew && (
                    <span className="px-3 py-1 bg-success text-success-foreground text-xs font-caption font-medium rounded-full elevation-2">
                      New
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
                {trip.title}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground font-body mb-6">{trip.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Icon name="MapPin" size={20} color="var(--color-primary)" />
                  <div>
                    <p className="text-lg font-heading font-semibold text-foreground">{trip.cities}</p>
                    <p className="text-xs text-muted-foreground font-caption">Cities</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Calendar" size={20} color="var(--color-secondary)" />
                  <div>
                    <p className="text-lg font-heading font-semibold text-foreground">{trip.duration}</p>
                    <p className="text-xs text-muted-foreground font-caption">Days</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="DollarSign" size={20} color="var(--color-accent)" />
                  <div>
                    <p className="text-lg font-heading font-semibold text-foreground">${trip.budget}</p>
                    <p className="text-xs text-muted-foreground font-caption">Budget</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Heart" size={20} color="var(--color-accent)" />
                  <div>
                    <p className="text-lg font-heading font-semibold text-foreground">{trip.likes}</p>
                    <p className="text-xs text-muted-foreground font-caption">Likes</p>
                  </div>
                </div>
              </div>

              {trip.traveler ? (
                <div className="flex items-center gap-3 pt-5 border-t border-border">
                  <Image
                    src={trip.traveler.avatar}
                    alt={trip.traveler.avatarAlt}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-caption font-medium text-foreground">{trip.traveler.name}</p>
                    <p className="text-xs text-muted-foreground font-caption">{trip.traveler.location}</p>
                  </div>
                </div>
              ) : null}

              {Array.isArray(trip.highlights) && trip.highlights.length ? (
                <div className="mt-6">
                  <h2 className="text-base md:text-lg font-heading font-semibold text-foreground mb-3">Highlights</h2>
                  <div className="flex flex-wrap gap-2">
                    {trip.highlights.slice(0, 8).map((h, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-muted text-muted-foreground text-xs font-caption rounded-md">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
