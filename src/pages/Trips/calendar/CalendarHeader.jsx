import React from 'react';

import Button from 'components/ui/Button';

const CalendarHeader = ({ currentDate, onPrevMonth, onNextMonth, onToday }) => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const month = monthNames?.[currentDate?.getMonth()];
  const year = currentDate?.getFullYear();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-1">
          {month} {year}
        </h1>
        <p className="text-sm md:text-base text-muted-foreground font-body">
          View your travel schedule and upcoming activities
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="default"
          onClick={onPrevMonth}
          iconName="ChevronLeft"
          iconPosition="left"
          className="flex-shrink-0"
        >
          <span className="hidden md:inline">Previous</span>
        </Button>

        <Button variant="secondary" size="default" onClick={onToday} iconName="Calendar" iconPosition="left">
          Today
        </Button>

        <Button
          variant="outline"
          size="default"
          onClick={onNextMonth}
          iconName="ChevronRight"
          iconPosition="right"
          className="flex-shrink-0"
        >
          <span className="hidden md:inline">Next</span>
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
