import React from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const ItinerarySidebar = ({ tripData, onExport, onPrint, onShare }) => {
  const calculateTripStats = () => {
    let totalCost = 0;
    let totalActivities = 0;
    let totalDays = tripData?.itinerary?.length;

    tripData?.itinerary?.forEach((day) => {
      totalActivities += day?.activities?.length;
      day?.activities?.forEach((activity) => {
        totalCost += activity?.cost;
      });
    });

    return { totalCost, totalActivities, totalDays };
  };

  const stats = calculateTripStats();

  const getCategoryBreakdown = () => {
    const breakdown = {};

    tripData?.itinerary?.forEach((day) => {
      day?.activities?.forEach((activity) => {
        if (!breakdown?.[activity?.category]) {
          breakdown[activity.category] = 0;
        }
        breakdown[activity.category] += activity?.cost;
      });
    });

    return Object.entries(breakdown)?.map(([category, cost]) => ({
      category,
      cost,
      percentage: ((cost / stats?.totalCost) * 100)?.toFixed(1),
    }));
  };

  const categoryBreakdown = getCategoryBreakdown();

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Trip Summary Card */}
      <div className="bg-card rounded-xl border border-border elevation-1 p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4">Trip Summary</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Icon name="Calendar" size={18} color="var(--color-primary)" />
              <span className="text-sm md:text-base font-body text-muted-foreground">Total Days</span>
            </div>
            <span className="text-base md:text-lg font-heading font-semibold text-foreground">{stats?.totalDays}</span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Icon name="Compass" size={18} color="var(--color-secondary)" />
              <span className="text-sm md:text-base font-body text-muted-foreground">Activities</span>
            </div>
            <span className="text-base md:text-lg font-heading font-semibold text-foreground">{stats?.totalActivities}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="DollarSign" size={18} color="var(--color-accent)" />
              <span className="text-sm md:text-base font-body text-muted-foreground">Total Cost</span>
            </div>
            <span className="text-base md:text-lg font-heading font-semibold text-accent whitespace-nowrap">
              ${stats?.totalCost?.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Budget Breakdown Card */}
      <div className="bg-card rounded-xl border border-border elevation-1 p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4">Budget Breakdown</h3>

        <div className="space-y-3">
          {categoryBreakdown?.map((item) => (
            <div key={item?.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm md:text-base font-body text-foreground">{item?.category}</span>
                <span className="text-sm md:text-base font-caption font-medium text-muted-foreground whitespace-nowrap">
                  ${item?.cost?.toFixed(2)} ({item?.percentage}%)
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-smooth" style={{ width: `${item?.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Card */}
      <div className="bg-card rounded-xl border border-border elevation-1 p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4">Quick Actions</h3>

        <div className="space-y-3">
          <Button variant="outline" fullWidth iconName="Download" iconPosition="left" onClick={onExport}>
            Export Itinerary
          </Button>

          <Button variant="outline" fullWidth iconName="Printer" iconPosition="left" onClick={onPrint}>
            Print Itinerary
          </Button>

          <Button variant="outline" fullWidth iconName="Share2" iconPosition="left" onClick={onShare}>
            Share Trip
          </Button>
        </div>
      </div>

      {/* Trip Details Card */}
      <div className="bg-card rounded-xl border border-border elevation-1 p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4">Trip Details</h3>

        <div className="space-y-3">
          <div>
            <p className="text-xs md:text-sm font-caption text-muted-foreground mb-1">Trip Name</p>
            <p className="text-sm md:text-base font-body text-foreground">{tripData?.name}</p>
          </div>

          <div>
            <p className="text-xs md:text-sm font-caption text-muted-foreground mb-1">Duration</p>
            <p className="text-sm md:text-base font-body text-foreground">
              {tripData?.startDate} - {tripData?.endDate}
            </p>
          </div>

          <div>
            <p className="text-xs md:text-sm font-caption text-muted-foreground mb-1">Cities</p>
            <p className="text-sm md:text-base font-body text-foreground">{tripData?.cities?.join(', ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItinerarySidebar;
