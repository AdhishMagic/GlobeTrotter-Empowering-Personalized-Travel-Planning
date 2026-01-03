import React from 'react';
import Icon from 'components/AppIcon';
import { Checkbox } from 'components/ui/Checkbox';

const CalendarSidebar = ({ upcomingTrips, filteredCategories, onFilterChange, onTripClick }) => {
  const categories = [
    { id: 'ongoing', label: 'Ongoing Trips', colorVar: 'var(--color-success)', icon: 'Plane' },
    { id: 'upcoming', label: 'Upcoming Trips', colorVar: 'var(--color-primary)', icon: 'CalendarDays' },
    { id: 'completed', label: 'Completed Trips', colorVar: 'var(--color-muted-foreground)', icon: 'CheckCircle' },
  ];

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="bg-card rounded-xl border border-border p-4 md:p-6 elevation-1">
        <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Filter" size={20} color="var(--color-primary)" />
          Filter Events
        </h3>

        <div className="space-y-3">
          {categories?.map((category) => (
            <Checkbox
              key={category?.id}
              label={
                <div className="flex items-center gap-2">
                  <Icon name={category?.icon} size={16} color={category?.colorVar} />
                  <span className="text-sm font-body">{category?.label}</span>
                </div>
              }
              checked={filteredCategories?.includes(category?.id)}
              onChange={(e) => onFilterChange(category?.id, e?.target?.checked)}
            />
          ))}
        </div>
      </div>

      {/* Upcoming Trips */}
      <div className="bg-card rounded-xl border border-border p-4 md:p-6 elevation-1">
        <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="CalendarClock" size={20} color="var(--color-primary)" />
          Upcoming Trips
        </h3>

        {upcomingTrips?.length === 0 ? (
          <div className="text-center py-6">
            <Icon name="Calendar" size={32} color="var(--color-muted-foreground)" className="mx-auto mb-2" />
            <p className="text-sm text-muted-foreground font-body">No upcoming trips scheduled</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingTrips?.map((trip) => (
              <button
                key={trip?.id}
                onClick={() => onTripClick(trip)}
                className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/50 transition-smooth"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`
                    w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                    ${trip?.status === 'ongoing' ? 'bg-success/10' : ''}
                    ${trip?.status === 'upcoming' ? 'bg-primary/10' : ''}
                    ${trip?.status === 'completed' ? 'bg-muted' : ''}
                  `}
                  >
                    <Icon
                      name="MapPin"
                      size={20}
                      color={
                        trip?.status === 'ongoing'
                          ? 'var(--color-success)'
                          : trip?.status === 'upcoming'
                            ? 'var(--color-primary)'
                            : 'var(--color-muted-foreground)'
                      }
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-body font-medium text-foreground truncate mb-1">{trip?.name}</h4>
                    <p className="text-xs text-muted-foreground font-caption">
                      {new Date(trip.startDate)?.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      -{' '}
                      {new Date(trip.endDate)?.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground font-caption">{trip?.cities?.length || 0} cities</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground font-caption">{trip?.activities?.length || 0} activities</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-card rounded-xl border border-border p-4 md:p-6 elevation-1">
        <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Info" size={20} color="var(--color-primary)" />
          Legend
        </h3>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded bg-success/20 border border-success/40" />
            <span className="text-sm text-foreground font-body">Ongoing Trip</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded bg-primary/20 border border-primary/40" />
            <span className="text-sm text-foreground font-body">Upcoming Trip</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded bg-muted border border-border" />
            <span className="text-sm text-foreground font-body">Completed Trip</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-sm text-foreground font-body">Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarSidebar;
