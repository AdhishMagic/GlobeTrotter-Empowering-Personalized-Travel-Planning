import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CalendarHeader from "pages/Trips/calendar/CalendarHeader";
import CalendarGrid from "pages/Trips/calendar/CalendarGrid";
import CalendarSidebar from "pages/Trips/calendar/CalendarSidebar";
import DateDetailsModal from "pages/Trips/calendar/DateDetailsModal";

const Calendar = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState(["ongoing", "upcoming", "completed"]);

  const mockTrips = [
    {
      id: "trip-1",
      name: "European Adventure",
      startDate: "2026-01-15",
      endDate: "2026-01-25",
      status: "upcoming",
      cities: ["Paris", "Rome", "Barcelona"],
      activities: [
        {
          id: 1,
          name: "Eiffel Tower Visit",
          date: "2026-01-16",
          time: "10:00 AM",
          location: "Paris, France",
          cost: 45.0,
          category: "Sightseeing",
          description: "Visit the iconic Eiffel Tower and enjoy panoramic views of Paris",
        },
        {
          id: 2,
          name: "Louvre Museum Tour",
          date: "2026-01-17",
          time: "2:00 PM",
          location: "Paris, France",
          cost: 60.0,
          category: "Culture",
          description: "Explore world-famous art collections including the Mona Lisa",
        },
      ],
    },
    {
      id: "trip-2",
      name: "Asian Exploration",
      startDate: "2026-01-05",
      endDate: "2026-01-12",
      status: "ongoing",
      cities: ["Tokyo", "Kyoto"],
      activities: [
        {
          id: 4,
          name: "Tokyo Tower",
          date: "2026-01-06",
          time: "11:00 AM",
          location: "Tokyo, Japan",
          cost: 30.0,
          category: "Sightseeing",
          description: "Visit Tokyo's iconic landmark with observation decks",
        },
        {
          id: 5,
          name: "Fushimi Inari Shrine",
          date: "2026-01-10",
          time: "8:00 AM",
          location: "Kyoto, Japan",
          cost: 0.0,
          category: "Cultural",
          description: "Walk through thousands of vermillion torii gates",
        },
      ],
    },
    {
      id: "trip-3",
      name: "Beach Getaway",
      startDate: "2025-12-20",
      endDate: "2025-12-28",
      status: "completed",
      cities: ["Maldives"],
      activities: [
        {
          id: 6,
          name: "Snorkeling Adventure",
          date: "2025-12-22",
          time: "10:00 AM",
          location: "Maldives",
          cost: 120.0,
          category: "Water Sports",
          description: "Explore vibrant coral reefs and marine life",
        },
      ],
    },
    {
      id: "trip-4",
      name: "Mountain Retreat",
      startDate: "2026-02-10",
      endDate: "2026-02-17",
      status: "upcoming",
      cities: ["Swiss Alps"],
      activities: [
        {
          id: 7,
          name: "Skiing Lessons",
          date: "2026-02-11",
          time: "9:00 AM",
          location: "Zermatt, Switzerland",
          cost: 200.0,
          category: "Adventure",
          description: "Professional skiing instruction for all levels",
        },
      ],
    },
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const handleFilterChange = (categoryId, checked) => {
    if (checked) {
      setFilteredCategories([...filteredCategories, categoryId]);
    } else {
      setFilteredCategories(filteredCategories?.filter((cat) => cat !== categoryId));
    }
  };

  const handleTripClick = (trip) => {
    navigate(`/trip/${trip?.id}/itinerary`);
  };

  const handleNavigateToTrip = (tripId) => {
    navigate(`/trip/${tripId}/itinerary`);
  };

  const upcomingTrips = mockTrips
    ?.filter((trip) => trip?.status === "upcoming" || trip?.status === "ongoing")
    ?.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    ?.slice(0, 5);

  const tripsForSelectedDate = selectedDate
    ? mockTrips?.filter((trip) => {
        const startDate = new Date(trip.startDate);
        const endDate = new Date(trip.endDate);
        return selectedDate >= startDate && selectedDate <= endDate;
      })
    : [];

  return (
    <div className="bg-background">
      <div className="max-w-screen-2xl mx-auto">
        <CalendarHeader currentDate={currentDate} onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth} onToday={handleToday} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Calendar */}
          <div className="lg:col-span-3">
            <CalendarGrid
              currentDate={currentDate}
              trips={mockTrips}
              onDateClick={handleDateClick}
              selectedDate={selectedDate}
              filteredCategories={filteredCategories}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CalendarSidebar
              upcomingTrips={upcomingTrips}
              filteredCategories={filteredCategories}
              onFilterChange={handleFilterChange}
              onTripClick={handleTripClick}
            />
          </div>
        </div>

        {/* Date Details Modal */}
        {showModal && (
          <DateDetailsModal
            date={selectedDate}
            trips={tripsForSelectedDate}
            onClose={() => setShowModal(false)}
            onNavigateToTrip={handleNavigateToTrip}
          />
        )}

        {/* TripId is currently not used beyond routing; keep a minimal reference to avoid unused param confusion. */}
        <span className="sr-only">Active trip: {id}</span>
      </div>
    </div>
  );
};

export default Calendar;
