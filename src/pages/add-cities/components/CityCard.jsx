import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CityCard = ({ city, index, onUpdate, onRemove, isDragging, dragHandleProps }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [startDate, setStartDate] = useState(city?.startDate);
  const [endDate, setEndDate] = useState(city?.endDate);
  const [estimatedCost, setEstimatedCost] = useState(city?.estimatedCost);
  const [error, setError] = useState('');

  const calculateDuration = (start, end) => {
    if (!start || !end) return 0;
    const startTime = new Date(start)?.getTime();
    const endTime = new Date(end)?.getTime();
    const days = Math.ceil((endTime - startTime) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const duration = calculateDuration(city?.startDate, city?.endDate);

  const handleSave = () => {
    setError('');

    if (!startDate || !endDate) {
      setError('Both start and end dates are required');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      setError('End date must be after start date');
      return;
    }

    const newDuration = calculateDuration(startDate, endDate);
    if (newDuration < 1) {
      setError('Minimum stay is 1 day');
      return;
    }

    onUpdate(city?.id, {
      startDate,
      endDate,
      estimatedCost: parseFloat(estimatedCost) || city?.estimatedCost
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setStartDate(city?.startDate);
    setEndDate(city?.endDate);
    setEstimatedCost(city?.estimatedCost);
    setError('');
    setIsEditing(false);
  };

  return (
    <div
      className={`bg-card border border-border rounded-lg overflow-hidden transition-base ${
        isDragging ? 'opacity-50 scale-95' : 'hover:shadow-md'
      }`}
    >
      <div className="flex flex-col md:flex-row">
        <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0 overflow-hidden">
          <Image
            src={city?.image}
            alt={city?.imageAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-caption font-semibold">
            City {index + 1}
          </div>
        </div>

        <div className="flex-1 p-4 md:p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div
                {...dragHandleProps}
                className="cursor-grab active:cursor-grabbing p-2 hover:bg-muted rounded-lg transition-base"
              >
                <Icon name="GripVertical" size={20} className="text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-xl md:text-2xl text-foreground">
                  {city?.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {city?.country} • {city?.region}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Edit2"
                  onClick={() => setIsEditing(true)}
                  aria-label="Edit city details"
                />
              )}
              <Button
                variant="ghost"
                size="sm"
                iconName="Trash2"
                onClick={() => onRemove(city?.id)}
                aria-label="Remove city"
              />
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e?.target?.value)}
                  required
                />
                <Input
                  type="date"
                  label="End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e?.target?.value)}
                  required
                />
              </div>

              <Input
                type="number"
                label="Estimated Daily Cost (USD)"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e?.target?.value)}
                min="0"
                step="10"
              />

              {error && (
                <div className="flex items-center space-x-2 text-error text-sm">
                  <Icon name="AlertCircle" size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <Button variant="default" size="sm" onClick={handleSave}>
                  Save Changes
                </Button>
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Icon name="Calendar" size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Start Date</div>
                  <div className="font-data font-medium text-foreground">
                    {new Date(city.startDate)?.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <div className="bg-secondary/10 p-2 rounded-lg">
                  <Icon name="CalendarCheck" size={20} color="var(--color-secondary)" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">End Date</div>
                  <div className="font-data font-medium text-foreground">
                    {new Date(city.endDate)?.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <div className="bg-accent/10 p-2 rounded-lg">
                  <Icon name="Clock" size={20} color="var(--color-accent)" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                  <div className="font-data font-medium text-foreground">
                    {duration} {duration === 1 ? 'day' : 'days'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isEditing && (
            <div className="mt-4 flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="DollarSign" size={18} color="var(--color-success)" />
                <span className="text-sm text-muted-foreground">Estimated Cost</span>
              </div>
              <span className="font-data font-semibold text-lg text-foreground">
                ${(city?.estimatedCost * duration)?.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CityCard;