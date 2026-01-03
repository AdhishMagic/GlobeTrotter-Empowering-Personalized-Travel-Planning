import React, { useEffect, useState } from "react";

import Button from "components/ui/Button";
import Icon from "components/AppIcon";

import TripCard from "pages/Community/components/TripCard";
import FilterPanel from "pages/Community/components/FilterPanel";
import FeaturedSection from "pages/Community/components/FeaturedSection";
import StatsSection from "pages/Community/components/StatsSection";

const Community = () => {
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

  const communityStats = {
    popularDestinations: "156",
    trendingActivities: "892",
    activeTravelers: "12.5k",
    sharedTrips: "3,247",
  };

  const featuredTrips = [
    {
      id: "feat-1",
      title: "Ultimate European Adventure",
      description:
        "Experience the best of Europe with this comprehensive 21-day journey through iconic cities, hidden gems, and breathtaking landscapes. From the romantic streets of Paris to the historic ruins of Rome, this trip covers it all.",
      image: "https://images.unsplash.com/photo-1596729667954-53eda7509d96",
      imageAlt:
        "Aerial view of Paris cityscape with Eiffel Tower prominently featured against sunset sky with Seine River winding through historic buildings",
      cities: 8,
      duration: 21,
      budget: 4500,
      likes: 1247,
      views: 8934,
      highlights: ["Cultural Immersion", "Historic Sites", "Local Cuisine", "Photography"],
      travelStyle: "cultural",
      isFeatured: true,
      traveler: {
        name: "Sarah Mitchell",
        location: "New York, USA",
        avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_170699746-1763294878713.png",
        avatarAlt:
          "Professional headshot of Caucasian woman with long brown hair wearing blue blazer smiling warmly at camera",
      },
    },
    {
      id: "feat-2",
      title: "Southeast Asia Explorer",
      description: "Discover the vibrant cultures and stunning landscapes of Southeast Asia.",
      image: "https://images.unsplash.com/photo-1691430312264-553021370070",
      imageAlt:
        "Traditional Thai long-tail boats with colorful ribbons floating in turquoise water surrounded by limestone cliffs and tropical vegetation",
      cities: 6,
      duration: 18,
      budget: 2800,
      likes: 892,
      views: 5621,
      highlights: ["Beach Paradise", "Temple Tours", "Street Food"],
      travelStyle: "adventure",
      isFeatured: true,
      traveler: {
        name: "James Chen",
        location: "Singapore",
        avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1a0486763-1763298848491.png",
        avatarAlt: "Professional headshot of Asian man with short black hair wearing white shirt smiling confidently",
      },
    },
    {
      id: "feat-3",
      title: "African Safari Experience",
      description: "Witness the incredible wildlife and natural beauty of East Africa.",
      image: "https://images.unsplash.com/photo-1621404715237-762dac5bf2de",
      imageAlt:
        "Majestic African elephant walking through golden savanna grassland with acacia trees and dramatic sunset sky in background",
      cities: 4,
      duration: 12,
      budget: 5200,
      likes: 1034,
      views: 6789,
      highlights: ["Wildlife Safari", "Nature Photography", "Camping"],
      travelStyle: "adventure",
      isFeatured: true,
      traveler: {
        name: "Emma Thompson",
        location: "London, UK",
        avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1bc978942-1763294600439.png",
        avatarAlt:
          "Professional headshot of British woman with blonde hair wearing green jacket smiling warmly outdoors",
      },
    },
  ];

  const communityTrips = [
    {
      id: "trip-1",
      title: "Japanese Cherry Blossom Journey",
      description:
        "Experience the magical cherry blossom season across Japan's most beautiful cities and traditional gardens.",
      image: "https://images.unsplash.com/photo-1577899528830-dbf0cdbd1600",
      imageAlt:
        "Traditional Japanese pagoda surrounded by pink cherry blossom trees in full bloom with Mount Fuji visible in misty background",
      cities: 5,
      duration: 14,
      budget: 3800,
      likes: 756,
      views: 4523,
      highlights: ["Cherry Blossoms", "Traditional Culture", "Temple Visits", "Hot Springs"],
      travelStyle: "cultural",
      isFeatured: false,
      isNew: true,
      isSaved: false,
      traveler: {
        name: "Yuki Tanaka",
        location: "Tokyo, Japan",
        avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1419bb0f7-1763298187409.png",
        avatarAlt:
          "Professional headshot of Japanese woman with short black hair wearing traditional kimono smiling gently",
      },
    },
    {
      id: "trip-2",
      title: "New Zealand Adventure Trail",
      description:
        "Explore the stunning landscapes of New Zealand from mountains to beaches with thrilling outdoor activities.",
      image: "https://images.unsplash.com/photo-1508669439339-a2490c994c2f",
      imageAlt:
        "Dramatic mountain landscape with snow-capped peaks reflecting in crystal clear lake surrounded by lush green valleys",
      cities: 6,
      duration: 16,
      budget: 4200,
      likes: 923,
      views: 5834,
      highlights: ["Hiking", "Bungee Jumping", "Scenic Drives", "Wildlife"],
      travelStyle: "adventure",
      isFeatured: false,
      isNew: true,
      isSaved: true,
      traveler: {
        name: "Michael Roberts",
        location: "Auckland, NZ",
        avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_133574ff8-1763295468418.png",
        avatarAlt:
          "Professional headshot of Caucasian man with beard wearing outdoor hiking gear smiling confidently in mountain setting",
      },
    },
    {
      id: "trip-3",
      title: "Mediterranean Coastal Escape",
      description:
        "Sail through the beautiful Mediterranean coast visiting charming villages and pristine beaches.",
      image: "https://images.unsplash.com/photo-1694768303298-ca5e70d80432",
      imageAlt:
        "Picturesque Greek island village with white-washed buildings and blue domed churches overlooking azure Mediterranean Sea",
      cities: 7,
      duration: 15,
      budget: 3500,
      likes: 1089,
      views: 6234,
      highlights: ["Beach Relaxation", "Sailing", "Local Cuisine", "Island Hopping"],
      travelStyle: "relaxation",
      isFeatured: false,
      isNew: false,
      isSaved: false,
      traveler: {
        name: "Sofia Martinez",
        location: "Barcelona, Spain",
        avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1975607e9-1763295500639.png",
        avatarAlt:
          "Professional headshot of Hispanic woman with long dark hair wearing white summer dress smiling warmly by the sea",
      },
    },
  ];

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

    setFilteredTrips(filtered);
  }, [filters]);

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
    console.log("View trip:", tripId);
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
                    onSave={handleSaveTrip}
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
