import React from 'react';
import Icon from 'components/AppIcon';
import ActivityCard from './ActivityCard';

const DayWiseView = ({ itineraryData, onEditActivity, onDeleteActivity }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateDayTotal = (activities) => {
    return activities?.reduce((sum, activity) => sum + activity?.cost, 0);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {itineraryData?.map((day, index) => (
        <div key={day?.date} className="bg-card rounded-xl border border-border elevation-1 overflow-hidden">
          {/* Day Header */}
          <div className="bg-primary/5 border-b border-border p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl md:text-2xl font-heading font-bold text-primary">{index + 1}</span>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">Day {index + 1}</h2>
                  <p className="text-sm md:text-base text-muted-foreground font-caption">{formatDate(day?.date)}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-lg">
                  <Icon name="MapPin" size={18} color="var(--color-secondary)" />
                  <span className="text-sm md:text-base font-caption font-medium text-secondary">{day?.city}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-lg">
                  <Icon name="DollarSign" size={18} color="var(--color-accent)" />
                  <span className="text-sm md:text-base font-caption font-medium text-accent whitespace-nowrap">
                    ${calculateDayTotal(day?.activities)?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Activities Timeline */}
          <div className="p-4 md:p-6 space-y-4">
            {day?.activities?.length > 0 ? (
              day?.activities?.map((activity) => (
                <ActivityCard key={activity?.id} activity={activity} onEdit={onEditActivity} onDelete={onDeleteActivity} />
              ))
            ) : (
              <div className="text-center py-8 md:py-12">
                <Icon name="Calendar" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
                <p className="text-base md:text-lg text-muted-foreground font-body">No activities planned for this day</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DayWiseView;
