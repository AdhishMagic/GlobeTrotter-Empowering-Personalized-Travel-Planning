import React from 'react';
import Button from 'components/ui/Button';

const ViewToggle = ({ activeView, onViewChange }) => {
  return (
    <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
      <Button
        variant={activeView === 'day' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('day')}
        iconName="Calendar"
        iconPosition="left"
        className="min-w-[120px]"
      >
        Day-wise
      </Button>
      <Button
        variant={activeView === 'city' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('city')}
        iconName="MapPin"
        iconPosition="left"
        className="min-w-[120px]"
      >
        City-wise
      </Button>
    </div>
  );
};

export default ViewToggle;
