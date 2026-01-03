import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Icon from "components/AppIcon";
import Button from "components/ui/Button";

import ViewToggle from "pages/Trips/itinerary/components/ViewToggle";
import TripSelector from "pages/Trips/itinerary/components/TripSelector";
import DayWiseView from "pages/Trips/itinerary/components/DayWiseView";
import CityWiseView from "pages/Trips/itinerary/components/CityWiseView";
import ItinerarySidebar from "pages/Trips/itinerary/components/ItinerarySidebar";

import { useAuth } from "context/AuthContext";

function getApiBaseUrl() {
  const raw = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return String(raw).replace(/\/+$/, "");
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value || "")
  );
}

const Itinerary = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuth();

  const [activeView, setActiveView] = useState("day");
  const [selectedTripId, setSelectedTripId] = useState(id || "trip-1");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (id) setSelectedTripId(id);
  }, [id]);

  const mockTrips = useMemo(
    () => [
      {
        id: "trip-1",
        name: "European Adventure 2026",
        startDate: "01/15/2026",
        endDate: "01/28/2026",
        cities: ["Paris", "Rome", "Barcelona"],
        itinerary: [
          {
            date: "2026-01-15",
            city: "Paris",
            activities: [
              {
                id: "act-1",
                name: "Eiffel Tower Visit",
                description:
                  "Iconic iron lattice tower offering panoramic views of Paris from observation decks",
                time: "09:00 AM",
                duration: "3 hours",
                category: "Activities",
                cost: 45.0,
                location: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris",
                status: "booked",
                image: "https://images.unsplash.com/photo-1514562514633-f56a2f7c58d5",
                imageAlt:
                  "Majestic Eiffel Tower standing tall against clear blue sky with green Champ de Mars park in foreground",
                notes:
                  "Book tickets online in advance to skip the queue.\nBest time to visit is early morning for fewer crowds.\nBring a camera for stunning city views from the top.",
              },
              {
                id: "act-2",
                name: "Louvre Museum Tour",
                description:
                  "World's largest art museum featuring masterpieces including Mona Lisa and Venus de Milo",
                time: "02:00 PM",
                duration: "4 hours",
                category: "Activities",
                cost: 35.0,
                location: "Rue de Rivoli, 75001 Paris",
                status: "planned",
                image: "https://img.rocket.new/generatedImages/rocket_gen_img_157c3fa1a-1767276385223.png",
                imageAlt:
                  "Historic Louvre Museum with iconic glass pyramid entrance reflecting sunlight in courtyard",
                notes:
                  "Audio guide recommended for detailed artwork information.\nWear comfortable shoes as the museum is extensive.\nAllow extra time to explore Egyptian antiquities section.",
              },
            ],
          },
          {
            date: "2026-01-16",
            city: "Paris",
            activities: [
              {
                id: "act-4",
                name: "Versailles Palace Day Trip",
                description:
                  "Opulent royal château with Hall of Mirrors, ornate gardens, and Marie Antoinette's estate",
                time: "08:30 AM",
                duration: "6 hours",
                category: "Activities",
                cost: 65.0,
                location: "Place d'Armes, 78000 Versailles",
                status: "planned",
                image: "https://images.unsplash.com/photo-1574877692608-0550d3c86634",
                imageAlt:
                  "Grand Palace of Versailles with golden gates and manicured gardens under sunny blue sky",
                notes:
                  "Take RER C train from Paris to Versailles.\nExplore the gardens and Grand Trianon estate.\nBring picnic lunch to enjoy in the palace gardens.",
              },
            ],
          },
          {
            date: "2026-01-18",
            city: "Rome",
            activities: [
              {
                id: "act-7",
                name: "Colosseum & Roman Forum",
                description:
                  "Ancient amphitheater and archaeological site showcasing Roman Empire's architectural grandeur",
                time: "09:00 AM",
                duration: "4 hours",
                category: "Activities",
                cost: 55.0,
                location: "Piazza del Colosseo, 00184 Roma",
                status: "booked",
                image: "https://images.unsplash.com/photo-1684197506281-9ed2245b5cca",
                imageAlt:
                  "Ancient Roman Colosseum amphitheater with weathered stone arches against clear Mediterranean sky",
                notes:
                  "Combined ticket includes Colosseum, Forum, and Palatine Hill.\nGuided tour recommended for historical context.\nWear sun protection and comfortable walking shoes.",
              },
            ],
          },
        ],
      },
      {
        id: "trip-2",
        name: "Japan Highlights",
        startDate: "03/22/2026",
        endDate: "04/02/2026",
        cities: ["Tokyo", "Kyoto"],
        itinerary: [
          {
            date: "2026-03-22",
            city: "Tokyo",
            activities: [
              {
                id: "act-j1",
                name: "Shibuya Crossing",
                description: "Experience the world's busiest pedestrian crossing.",
                time: "06:00 PM",
                duration: "1 hour",
                category: "Activities",
                cost: 0.0,
                location: "Shibuya City, Tokyo",
                status: "planned",
                image: "https://images.unsplash.com/photo-1526481280695-3c687fd5432c",
                imageAlt: "Crowds crossing at Shibuya Crossing with neon signs",
                notes: "Grab a coffee at a nearby cafe to watch from above.",
              },
            ],
          },
        ],
      },
    ],
    []
  );

  const selectedTrip = mockTrips?.find((trip) => trip?.id === selectedTripId) || null;

  const handleTripChange = (nextTripId) => {
    setSelectedTripId(nextTripId);
    navigate(`/trip/${nextTripId}/itinerary`, { replace: true });
  };

  const handleEditActivity = (activity) => {
    console.log("Edit activity:", activity);
  };

  const handleDeleteActivity = (activityId) => {
    console.log("Delete activity:", activityId);
  };

  const handleExport = () => {
    console.log("Export itinerary");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const tripId = selectedTripId;

    if (!token) {
      alert("Please login to share your trip.");
      return;
    }

    // Backend share endpoints require a real trip UUID.
    if (!isUuid(tripId)) {
      alert("Sharing is available only for saved trips. Open a real trip (UUID) and try again.");
      return;
    }

    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/trips/${tripId}/share`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isPublic: true }),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      alert(data?.message || "Failed to create share link");
      return;
    }

    const shareToken = data?.shareToken;
    const shareUrl = data?.shareUrl || (shareToken ? `${window.location.origin}/shared/${shareToken}` : null);

    if (!shareUrl) {
      alert("Could not generate a share link.");
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Share link copied. Send it to your friend.");
    } catch {
      window.prompt("Copy this link:", shareUrl);
    }
  };

  return (
    <div className="bg-background">
      <div className="max-w-screen-2xl mx-auto">
        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">My Itinerary</h1>
              <p className="text-base md:text-lg text-muted-foreground font-body">
                View and manage your complete travel timeline
              </p>
            </div>

            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              className="w-full md:w-auto"
            >
              Add Activity
            </Button>
          </div>

          {/* Trip Selector and View Toggle */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <TripSelector trips={mockTrips} selectedTrip={selectedTripId} onTripChange={handleTripChange} />
            <ViewToggle activeView={activeView} onViewChange={setActiveView} />
          </div>
        </div>

        {/* Main Content Area */}
        {selectedTrip ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            {/* Itinerary Content */}
            <div className="lg:col-span-8">
              {activeView === "day" ? (
                <DayWiseView
                  itineraryData={selectedTrip?.itinerary}
                  onEditActivity={handleEditActivity}
                  onDeleteActivity={handleDeleteActivity}
                />
              ) : (
                <CityWiseView
                  itineraryData={selectedTrip?.itinerary}
                  onEditActivity={handleEditActivity}
                  onDeleteActivity={handleDeleteActivity}
                />
              )}
            </div>

            {/* Sidebar - Desktop */}
            <div className="hidden lg:block lg:col-span-4">
              <div className="sticky top-20">
                <ItinerarySidebar tripData={selectedTrip} onExport={handleExport} onPrint={handlePrint} onShare={handleShare} />
              </div>
            </div>

            {/* Sidebar - Mobile (Collapsible) */}
            <div className="lg:hidden fixed bottom-20 right-4 z-[999]">
              <Button
                variant="default"
                size="lg"
                iconName={isSidebarOpen ? "X" : "Menu"}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="w-14 h-14 rounded-full elevation-3"
              />
            </div>

            {isSidebarOpen && (
              <div className="lg:hidden fixed inset-0 z-[998] bg-background/95 backdrop-blur-sm overflow-y-auto pt-20 pb-24 px-4">
                <ItinerarySidebar tripData={selectedTrip} onExport={handleExport} onPrint={handlePrint} onShare={handleShare} />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 md:py-20">
            <Icon name="Calendar" size={64} color="var(--color-muted-foreground)" className="mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-foreground mb-3">No Trip Selected</h2>
            <p className="text-base md:text-lg text-muted-foreground font-body mb-6 max-w-md mx-auto">
              Select a trip from the dropdown above to view your itinerary
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Itinerary;
