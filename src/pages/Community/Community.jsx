import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "components/ui/Button";
import Icon from "components/AppIcon";

import TripCard from "pages/Community/components/TripCard";
import FilterPanel from "pages/Community/components/FilterPanel";
import FeaturedSection from "pages/Community/components/FeaturedSection";
import StatsSection from "pages/Community/components/StatsSection";

import { useAuth } from "context/AuthContext";
import { loadWishlistMap, toggleWishlistItem } from "utils/wishlist";

import { communityTrips, featuredTrips } from "pages/Community/data";

const Community = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id;

  const [filters, setFilters] = useState({
    search: "",
    destination: "all",
    duration: "all",
    budget: "all",
    travelStyle: "all",
    sortBy: "popular",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [wishlistMap, setWishlistMap] = useState({});

  const communityStats = {
    popularDestinations: "156",
    trendingActivities: "892",
    activeTravelers: "12.5k",
    sharedTrips: "3,247",
  };


  useEffect(() => {
    setWishlistMap(loadWishlistMap(userId));
  }, [userId]);

  const handleWishlistToggle = (trip) => {
    const { map } = toggleWishlistItem(userId, trip);
    setWishlistMap({ ...map });
  };

  useEffect(() => {
    let filtered = [...communityTrips];

    if (filters?.search) {
      const searchLower = filters?.search?.toLowerCase();
      filtered = filtered?.filter(
        (trip) =>
          trip?.title?.toLowerCase()?.includes(searchLower) ||
          trip?.description?.toLowerCase()?.includes(searchLower) ||
          trip?.highlights?.some((h) => h?.toLowerCase()?.includes(searchLower))
      );
    }

    if (filters?.travelStyle !== "all") {
      filtered = filtered?.filter((trip) => trip?.travelStyle === filters?.travelStyle);
    }

    if (filters?.duration !== "all") {
      const [min, max] = filters?.duration?.split("-")?.map((v) => v?.replace("+", ""));
      filtered = filtered?.filter((trip) => {
        if (max) {
          return trip?.duration >= parseInt(min) && trip?.duration <= parseInt(max);
        }
        return trip?.duration >= parseInt(min);
      });
    }

    if (filters?.budget !== "all") {
      const [min, max] = filters?.budget?.split("-")?.map((v) => v?.replace("+", ""));
      filtered = filtered?.filter((trip) => {
        if (max) {
          return trip?.budget >= parseInt(min) && trip?.budget <= parseInt(max);
        }
        return trip?.budget >= parseInt(min);
      });
    }

    switch (filters?.sortBy) {
      case "recent":
        filtered?.sort((a, b) => (b?.isNew ? 1 : 0) - (a?.isNew ? 1 : 0));
        break;
      case "views":
        filtered?.sort((a, b) => b?.views - a?.views);
        break;
      case "likes":
        filtered?.sort((a, b) => b?.likes - a?.likes);
        break;
      case "budget-low":
        filtered?.sort((a, b) => a?.budget - b?.budget);
        break;
      case "budget-high":
        filtered?.sort((a, b) => b?.budget - a?.budget);
        break;
      default:
        filtered?.sort((a, b) => b?.likes - a?.likes);
    }

    // Decorate with wishlist state.
    setFilteredTrips(
      filtered.map((t) => ({
        ...t,
        isWishlisted: Boolean(wishlistMap && wishlistMap[String(t.id)]),
      }))
    );
  }, [filters, wishlistMap]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      destination: "all",
      duration: "all",
      budget: "all",
      travelStyle: "all",
      sortBy: "popular",
    });
  };

  const handleSaveTrip = (tripId) => {
    console.log("Save trip:", tripId);
  };

  const handleShareTrip = (tripId) => {
    console.log("Share trip:", tripId);
  };

  const handleCloneTrip = (tripId) => {
    console.log("Clone trip:", tripId);
  };

  const handleViewTrip = (tripId) => {
    navigate(`/community/${tripId}`);
  };

  return (
    <div className="bg-background">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-10 lg:mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-2">
                Travel Community
              </h1>
              <p className="text-base md:text-lg text-muted-foreground font-body">
                Discover inspiring trips and connect with fellow travelers
              </p>
            </div>
            <Button
              variant="outline"
              size="lg"
              iconName="Filter"
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden"
            />
          </div>
        </div>

        {/* Stats Section */}
        <StatsSection stats={communityStats} />

        {/* Featured Section */}
        <FeaturedSection featuredTrips={featuredTrips} onView={handleViewTrip} onClone={handleCloneTrip} />

        {/* Main Content */}
        <div className="flex gap-6 lg:gap-8">
          {/* Filter Panel */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-20">
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                isOpen={false}
                onClose={() => {}}
              />
            </div>
          </div>

          {/* Mobile Filter Panel */}
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />

          {/* Trip Grid */}
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">
                  All Trips
                  <span className="ml-2 text-base text-muted-foreground font-caption">({filteredTrips?.length} results)</span>
                </h2>
              </div>
            </div>

            {filteredTrips?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
                {filteredTrips?.map((trip) => (
                  <TripCard
                    key={trip?.id}
                    trip={trip}
                    onWishlistToggle={handleWishlistToggle}
                    onShare={handleShareTrip}
                    onClone={handleCloneTrip}
                    onView={handleViewTrip}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-xl p-12 text-center elevation-1 border border-border">
                <Icon name="Search" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
                <h3 className="text-xl font-heading font-semibold text-foreground mb-2">No trips found</h3>
                <p className="text-muted-foreground font-body mb-6">Try adjusting your filters to see more results</p>
                <Button variant="outline" onClick={handleResetFilters}>
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
