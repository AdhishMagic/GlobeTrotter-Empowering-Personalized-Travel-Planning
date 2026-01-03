import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ActivityCard = ({ activity, onAddToTrip, onViewDetails, onToggleFavorite }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [cost, setCost] = useState(activity?.estimatedCost || '');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  const dayOptions = [
    { value: 'day1', label: 'Day 1 - January 15' },
    { value: 'day2', label: 'Day 2 - January 16' },
    { value: 'day3', label: 'Day 3 - January 17' },
    { value: 'day4', label: 'Day 4 - January 18' }
  ];

  const timeOptions = [
    { value: '09:00', label: '9:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '17:00', label: '5:00 PM' },
    { value: '18:00', label: '6:00 PM' },
    { value: '19:00', label: '7:00 PM' },
    { value: '20:00', label: '8:00 PM' }
  ];

  const handleAddToTrip = () => {
    if (!selectedDay || !selectedTime) {
      alert('Please select day and time for this activity');
      return;
    }

    onAddToTrip({
      ...activity,
      cost: parseFloat(cost) || activity?.estimatedCost,
      day: selectedDay,
      time: selectedTime,
      notes
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const getPriceRangeColor = () => {
    if (activity?.priceRange === '$') return 'text-success';
    if (activity?.priceRange === '$$') return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden hover-lift transition-base">
      <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden">
        <Image
          src={activity?.image}
          alt={activity?.imageAlt}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => onToggleFavorite(activity?.id)}
          className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full p-2 hover-lift transition-base focus-ring"
          aria-label={activity?.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Icon
            name={activity?.isFavorite ? 'Heart' : 'Heart'}
            size={20}
            color={activity?.isFavorite ? 'var(--color-error)' : 'var(--color-foreground)'}
            className={activity?.isFavorite ? 'fill-current' : ''}
          />
        </button>
        <div className="absolute bottom-3 left-3 flex items-center space-x-2">
          <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-caption font-medium">
            {activity?.category}
          </span>
          <span className={`bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-caption font-semibold ${getPriceRangeColor()}`}>
            {activity?.priceRange}
          </span>
        </div>
      </div>
      <div className="p-4 md:p-5 lg:p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-heading font-semibold text-lg md:text-xl text-foreground line-clamp-2 flex-1">
            {activity?.name}
          </h3>
          <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
            <Icon name="Star" size={16} color="var(--color-accent)" className="fill-current" />
            <span className="font-data font-semibold text-sm text-foreground">
              {activity?.rating}
            </span>
            <span className="text-xs text-muted-foreground">
              ({activity?.reviewCount})
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {activity?.description}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} color="var(--color-secondary)" />
            <span className="text-sm text-foreground">{activity?.duration}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="DollarSign" size={16} color="var(--color-accent)" />
            <span className="font-data font-semibold text-sm text-foreground">
              ${activity?.estimatedCost}
            </span>
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-4 mb-4 pt-4 border-t border-border animate-slide-down">
            <Input
              type="number"
              label="Actual Cost (USD)"
              placeholder="Enter cost"
              value={cost}
              onChange={(e) => setCost(e?.target?.value)}
              className="mb-3"
            />

            <Select
              label="Select Day"
              placeholder="Choose day"
              options={dayOptions}
              value={selectedDay}
              onChange={setSelectedDay}
              required
              className="mb-3"
            />

            <Select
              label="Select Time"
              placeholder="Choose time"
              options={timeOptions}
              value={selectedTime}
              onChange={setSelectedTime}
              required
              className="mb-3"
            />

            <Input
              type="text"
              label="Notes (Optional)"
              placeholder="Add personal notes"
              value={notes}
              onChange={(e) => setNotes(e?.target?.value)}
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          {!isExpanded ? (
            <>
              <Button
                variant="default"
                fullWidth
                iconName="Plus"
                iconPosition="left"
                onClick={() => setIsExpanded(true)}
              >
                Add to Trip
              </Button>
              <Button
                variant="outline"
                size="icon"
                iconName="Info"
                onClick={() => onViewDetails(activity)}
                aria-label="View details"
              />
            </>
          ) : (
            <>
              <Button
                variant={isAdded ? 'success' : 'default'}
                fullWidth
                iconName={isAdded ? 'Check' : 'Plus'}
                iconPosition="left"
                onClick={handleAddToTrip}
                disabled={isAdded}
              >
                {isAdded ? 'Added!' : 'Confirm Add'}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                iconName="X"
                onClick={() => setIsExpanded(false)}
                aria-label="Cancel"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
