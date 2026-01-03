import React from 'react';
import Icon from 'components/AppIcon';

const CalendarGrid = ({ currentDate, trips, onDateClick, selectedDate, filteredCategories }) => {
  const getDaysInMonth = (date) => {
    const year = date?.getFullYear();
    const month = date?.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay?.getDate();
    const startingDayOfWeek = firstDay?.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  const isToday = (day) => {
    const today = new Date();
    return today?.getDate() === day && today?.getMonth() === month && today?.getFullYear() === year;
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    return (
      selectedDate?.getDate() === day &&
      selectedDate?.getMonth() === month &&
      selectedDate?.getFullYear() === year
    );
  };

  const getTripsForDate = (day) => {
    const dateToCheck = new Date(year, month, day);
    return trips?.filter((trip) => {
      if (!filteredCategories?.includes(trip?.status)) return false;
      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);
      return dateToCheck >= startDate && dateToCheck <= endDate;
    });
  };

  const getActivityCountForDate = (day) => {
    const tripsOnDate = getTripsForDate(day);
    return tripsOnDate?.reduce((total, trip) => {
      return (
        total +
        (trip?.activities
          ?.filter((activity) => {
            const activityDate = new Date(activity.date);
            return (
              activityDate?.getDate() === day &&
              activityDate?.getMonth() === month &&
              activityDate?.getFullYear() === year
            );
          })
          ?.length || 0)
      );
    }, 0);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calendarDays = [];

  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays?.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays?.push(day);
  }

  return (
    <div className="bg-card rounded-xl border border-border elevation-1">
      {/* Week day headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {weekDays?.map((day) => (
          <div
            key={day}
            className="p-2 md:p-4 text-center font-caption font-medium text-muted-foreground text-xs md:text-sm"
          >
            <span className="hidden md:inline">{day}</span>
            <span className="md:hidden">{day?.charAt(0)}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {calendarDays?.map((day, index) => {
          if (day === null) {
            return (
              <div
                key={`empty-${index}`}
                className="min-h-[80px] md:min-h-[120px] border-r border-b border-border bg-muted/30"
              />
            );
          }

          const tripsOnDate = getTripsForDate(day);
          const activityCount = getActivityCountForDate(day);
          const today = isToday(day);
          const selected = isSelected(day);

          return (
            <button
              key={day}
              onClick={() => onDateClick(new Date(year, month, day))}
              className={`
                min-h-[80px] md:min-h-[120px] p-1 md:p-2 border-r border-b border-border
                transition-smooth hover:bg-muted/50 text-left relative
                ${today ? 'bg-primary/5' : ''}
                ${selected ? 'bg-primary/10 ring-2 ring-primary ring-inset' : ''}
              `}
            >
              {/* Date number */}
              <div
                className={`
                text-xs md:text-sm font-caption font-medium mb-1
                ${today ? 'text-primary font-semibold' : 'text-foreground'}
              `}
              >
                {day}
              </div>

              {/* Trip indicators */}
              <div className="space-y-0.5 md:space-y-1">
                {tripsOnDate?.slice(0, 2)?.map((trip, idx) => (
                  <div
                    key={idx}
                    className={`
                      text-[10px] md:text-xs px-1 md:px-2 py-0.5 rounded truncate
                      ${trip?.status === 'ongoing' ? 'bg-success/20 text-success' : ''}
                      ${trip?.status === 'upcoming' ? 'bg-primary/20 text-primary' : ''}
                      ${trip?.status === 'completed' ? 'bg-muted text-muted-foreground' : ''}
                    `}
                    title={trip?.name}
                  >
                    {trip?.name}
                  </div>
                ))}
                {tripsOnDate?.length > 2 && (
                  <div className="text-[10px] md:text-xs text-muted-foreground px-1 md:px-2">
                    +{tripsOnDate?.length - 2} more
                  </div>
                )}
              </div>

              {/* Activity count badge */}
              {activityCount > 0 && (
                <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 flex items-center gap-0.5 md:gap-1 bg-accent/20 text-accent px-1 md:px-1.5 py-0.5 rounded text-[10px] md:text-xs">
                  <Icon name="Calendar" size={10} className="md:w-3 md:h-3" />
                  <span>{activityCount}</span>
                </div>
              )}

              {/* Today indicator */}
              {today && (
                <div className="absolute top-1 right-1 md:top-2 md:right-2 w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
