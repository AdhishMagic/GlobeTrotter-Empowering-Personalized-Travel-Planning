import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    const icons = {
      trip_created: 'Plus',
      city_added: 'MapPin',
      activity_added: 'Calendar',
      budget_updated: 'DollarSign',
      trip_shared: 'Share2'
    };
    return icons?.[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colors = {
      trip_created: 'text-success',
      city_added: 'text-primary',
      activity_added: 'text-secondary',
      budget_updated: 'text-warning',
      trip_shared: 'text-accent'
    };
    return colors?.[type] || 'text-muted-foreground';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMs = now - activityTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-md border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">
          Recent Activity
        </h3>
        <Icon name="Activity" size={20} color="var(--color-primary)" />
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities?.map((activity) => (
          <div
            key={activity?.id}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted transition-base"
          >
            <div className={`${getActivityColor(activity?.type)} mt-1`}>
              <Icon name={getActivityIcon(activity?.type)} size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground font-caption line-clamp-2">
                {activity?.description}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatTimeAgo(activity?.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivityFeed;