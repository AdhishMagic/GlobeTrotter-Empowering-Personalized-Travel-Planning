import React from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const DateDetailsModal = ({ date, trips, onClose, onNavigateToTrip }) => {
  if (!date) return null;

  const formattedDate = date?.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const activitiesOnDate = trips?.flatMap((trip) =>
    (trip?.activities || [])
      ?.filter((activity) => {
        const activityDate = new Date(activity.date);
        return activityDate?.toDateString() === date?.toDateString();
      })
      ?.map((activity) => ({ ...activity, tripName: trip?.name, tripId: trip?.id }))
  );

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card rounded-xl border border-border elevation-4 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-1">{formattedDate}</h2>
            <p className="text-sm text-muted-foreground font-body">
              {activitiesOnDate?.length} {activitiesOnDate?.length === 1 ? 'activity' : 'activities'} scheduled
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} iconName="X" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-custom">
          {activitiesOnDate?.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Calendar" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
              <p className="text-base text-muted-foreground font-body">No activities scheduled for this date</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activitiesOnDate?.map((activity, index) => (
                <div
                  key={index}
                  className="bg-background rounded-lg border border-border p-4 hover:elevation-1 transition-smooth"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h3 className="text-base md:text-lg font-body font-semibold text-foreground mb-1">{activity?.name}</h3>
                      <p className="text-sm text-muted-foreground font-caption">{activity?.tripName}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigateToTrip(activity?.tripId)}
                      iconName="ExternalLink"
                      iconPosition="right"
                    >
                      View Trip
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Clock" size={16} />
                      <span className="font-caption">{activity?.time || 'Time not set'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="MapPin" size={16} />
                      <span className="font-caption">{activity?.location || 'Location not set'}</span>
                    </div>
                    {activity?.cost && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon name="DollarSign" size={16} />
                        <span className="font-caption">${activity?.cost?.toFixed(2)}</span>
                      </div>
                    )}
                    {activity?.category && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon name="Tag" size={16} />
                        <span className="font-caption">{activity?.category}</span>
                      </div>
                    )}
                  </div>

                  {activity?.description && (
                    <p className="text-sm text-muted-foreground font-body mt-3 pt-3 border-t border-border">
                      {activity?.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-border flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DateDetailsModal;
