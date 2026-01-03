import React from 'react';
import Icon from 'components/AppIcon';
import ActivityCard from './ActivityCard';

const CityWiseView = ({ itineraryData, onEditActivity, onDeleteActivity }) => {
  const groupByCity = () => {
    const cityGroups = {};

    itineraryData?.forEach((day) => {
      if (!cityGroups?.[day?.city]) {
        cityGroups[day.city] = {
          city: day?.city,
          days: [],
          totalCost: 0,
          activityCount: 0,
        };
      }

      cityGroups?.[day?.city]?.days?.push(day);
      cityGroups[day.city].totalCost += day?.activities?.reduce((sum, act) => sum + act?.cost, 0);
      cityGroups[day.city].activityCount += day?.activities?.length;
    });

    return Object.values(cityGroups);
  };

  const cityData = groupByCity();

  const formatDateRange = (days) => {
    if (days?.length === 0) return '';
    const firstDate = new Date(days[0].date);
    const lastDate = new Date(days[days.length - 1].date);

    return `${firstDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${lastDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {cityData?.map((cityGroup) => (
        <div key={cityGroup?.city} className="bg-card rounded-xl border border-border elevation-1 overflow-hidden">
          {/* City Header */}
          <div className="bg-secondary/5 border-b border-border p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="MapPin" size={24} color="var(--color-secondary)" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">{cityGroup?.city}</h2>
                  <p className="text-sm md:text-base text-muted-foreground font-caption">{formatDateRange(cityGroup?.days)}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
                  <Icon name="Calendar" size={18} color="var(--color-primary)" />
                  <span className="text-sm md:text-base font-caption font-medium text-primary">
                    {cityGroup?.days?.length} {cityGroup?.days?.length === 1 ? 'Day' : 'Days'}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-lg">
                  <Icon name="DollarSign" size={18} color="var(--color-accent)" />
                  <span className="text-sm md:text-base font-caption font-medium text-accent whitespace-nowrap">
                    ${cityGroup?.totalCost?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Days and Activities */}
          <div className="p-4 md:p-6 space-y-6">
            {cityGroup?.days?.map((day, dayIndex) => (
              <div key={day?.date} className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-heading font-semibold text-primary">{dayIndex + 1}</span>
                  </div>
                  <div>
                    <p className="text-base md:text-lg font-heading font-medium text-foreground">
                      {new Date(day.date)?.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground font-caption">
                      {day?.activities?.length} {day?.activities?.length === 1 ? 'Activity' : 'Activities'}
                    </p>
                  </div>
                </div>

                {day?.activities?.length > 0 ? (
                  <div className="space-y-4">
                    {day?.activities?.map((activity) => (
                      <ActivityCard key={activity?.id} activity={activity} onEdit={onEditActivity} onDelete={onDeleteActivity} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Icon name="Calendar" size={40} color="var(--color-muted-foreground)" className="mx-auto mb-3" />
                    <p className="text-sm md:text-base text-muted-foreground font-body">No activities planned</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CityWiseView;
