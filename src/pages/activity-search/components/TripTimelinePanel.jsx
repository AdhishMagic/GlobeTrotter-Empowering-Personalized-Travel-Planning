import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TripTimelinePanel = ({ activities, onRemoveActivity, onReorderActivities, isOpen, onToggle }) => {
  const [draggedItem, setDraggedItem] = useState(null);

  const groupedActivities = activities?.reduce((acc, activity) => {
    const day = activity?.day || 'unscheduled';
    if (!acc?.[day]) acc[day] = [];
    acc?.[day]?.push(activity);
    return acc;
  }, {});

  const sortedDays = Object.keys(groupedActivities)?.sort();

  const handleDragStart = (e, activity) => {
    setDraggedItem(activity);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetActivity) => {
    e?.preventDefault();
    if (draggedItem && draggedItem?.id !== targetActivity?.id) {
      onReorderActivities(draggedItem, targetActivity);
    }
    setDraggedItem(null);
  };

  const totalCost = activities?.reduce((sum, activity) => sum + (activity?.cost || 0), 0);

  const timelineContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-semibold text-lg text-foreground">
          Trip Timeline
        </h3>
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-caption font-semibold">
          {activities?.length} Activities
        </span>
      </div>

      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-caption text-muted-foreground">Total Cost</span>
          <span className="font-data font-bold text-xl text-foreground">
            ${totalCost?.toLocaleString()}
          </span>
        </div>
      </div>

      {activities?.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Calendar" size={32} color="var(--color-muted-foreground)" />
          </div>
          <p className="text-sm text-muted-foreground">
            No activities added yet
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Start adding activities to build your itinerary
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDays?.map((day) => (
            <div key={day} className="space-y-3">
              <h4 className="font-caption font-semibold text-sm text-foreground flex items-center space-x-2">
                <Icon name="Calendar" size={16} color="var(--color-primary)" />
                <span>{day === 'unscheduled' ? 'Unscheduled' : day?.replace('day', 'Day ')}</span>
              </h4>
              <div className="space-y-2">
                {groupedActivities?.[day]?.sort((a, b) => (a?.time || '')?.localeCompare(b?.time || ''))?.map((activity) => (
                    <div
                      key={activity?.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, activity)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, activity)}
                      className="bg-card border border-border rounded-lg p-3 hover-lift transition-base cursor-move"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h5 className="font-caption font-semibold text-sm text-foreground line-clamp-1">
                            {activity?.name}
                          </h5>
                          <div className="flex items-center space-x-2 mt-1">
                            {activity?.time && (
                              <span className="text-xs text-muted-foreground flex items-center space-x-1">
                                <Icon name="Clock" size={12} />
                                <span>{activity?.time}</span>
                              </span>
                            )}
                            <span className="text-xs font-data font-semibold text-primary">
                              ${activity?.cost || activity?.estimatedCost}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => onRemoveActivity(activity?.id)}
                          className="p-1 rounded-lg hover:bg-error/10 transition-base focus-ring"
                          aria-label="Remove activity"
                        >
                          <Icon name="Trash2" size={16} color="var(--color-error)" />
                        </button>
                      </div>
                      {activity?.notes && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
                          {activity?.notes}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activities?.length > 0 && (
        <Button
          variant="default"
          fullWidth
          iconName="Eye"
          iconPosition="left"
          onClick={() => window.location.href = '/budget-summary'}
        >
          View Full Itinerary
        </Button>
      )}
    </div>
  );

  return (
    <>
      <div className="hidden lg:block bg-card rounded-lg border border-border p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
        {timelineContent}
      </div>
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 lg:hidden bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover-lift transition-base focus-ring z-100"
        aria-label="Toggle timeline"
      >
        <Icon name="Calendar" size={24} />
        {activities?.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-error text-error-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-caption font-bold">
            {activities?.length}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-200 lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onToggle}
          />
          <div className="absolute inset-x-0 bottom-0 bg-card rounded-t-2xl border-t border-border max-h-[85vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h3 className="font-heading font-semibold text-lg text-foreground">
                Trip Timeline
              </h3>
              <button
                onClick={onToggle}
                className="p-2 rounded-lg hover:bg-muted transition-base focus-ring"
                aria-label="Close timeline"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            <div className="p-6">
              {timelineContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TripTimelinePanel;