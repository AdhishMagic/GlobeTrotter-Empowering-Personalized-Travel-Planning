import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import Button from 'components/ui/Button';

const ActivityCard = ({ activity, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'booked':
        return 'bg-success/10 text-success border-success/20';
      case 'planned':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'wishlist':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Stay: 'Hotel',
      Transport: 'Car',
      Activities: 'Compass',
      Food: 'UtensilsCrossed',
      Shopping: 'ShoppingBag',
      Other: 'MoreHorizontal',
    };
    return icons?.[category] || 'Circle';
  };

  return (
    <div className="bg-card rounded-xl border border-border elevation-1 transition-smooth hover:elevation-2 overflow-hidden">
      <div className="p-4 md:p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Activity Image */}
          <div className="w-full lg:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
            <Image src={activity?.image} alt={activity?.imageAlt} className="w-full h-full object-cover" />
          </div>

          {/* Activity Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">{activity?.name}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-caption font-medium border ${getStatusColor(activity?.status)}`}
                  >
                    {activity?.status?.charAt(0)?.toUpperCase() + activity?.status?.slice(1)}
                  </span>
                </div>
                <p className="text-sm md:text-base text-muted-foreground font-body line-clamp-2">{activity?.description}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Edit"
                  onClick={() => onEdit(activity)}
                  className="h-9 w-9 p-0"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Trash2"
                  onClick={() => onDelete(activity?.id)}
                  className="h-9 w-9 p-0 text-destructive hover:text-destructive"
                />
              </div>
            </div>

            {/* Activity Meta Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Icon name="Clock" size={16} color="var(--color-muted-foreground)" />
                <span className="text-sm font-caption text-muted-foreground">{activity?.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Timer" size={16} color="var(--color-muted-foreground)" />
                <span className="text-sm font-caption text-muted-foreground">{activity?.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name={getCategoryIcon(activity?.category)} size={16} color="var(--color-muted-foreground)" />
                <span className="text-sm font-caption text-muted-foreground">{activity?.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="DollarSign" size={16} color="var(--color-muted-foreground)" />
                <span className="text-sm font-caption font-medium text-foreground whitespace-nowrap">
                  ${activity?.cost?.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-2 mb-3">
              <Icon name="MapPin" size={16} color="var(--color-primary)" className="mt-0.5 flex-shrink-0" />
              <span className="text-sm font-body text-foreground">{activity?.location}</span>
            </div>

            {/* Expandable Notes Section */}
            {activity?.notes && (
              <div className="border-t border-border pt-3">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-2 text-sm font-caption text-primary hover:text-primary/80 transition-smooth"
                >
                  <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={16} />
                  {isExpanded ? 'Hide' : 'Show'} Notes
                </button>
                {isExpanded && <p className="mt-2 text-sm font-body text-muted-foreground whitespace-pre-line">{activity?.notes}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
