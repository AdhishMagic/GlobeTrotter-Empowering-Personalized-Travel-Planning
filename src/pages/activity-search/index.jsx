import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import TripPlanningBreadcrumbs from '../../components/ui/TripPlanningBreadcrumbs';
import BudgetIntegrationWidget from '../../components/ui/BudgetIntegrationWidget';
import ActivityCard from './components/ActivityCard';
import FilterPanel from './components/FilterPanel';
import SearchBar from './components/SearchBar';
import TripTimelinePanel from './components/TripTimelinePanel';
import ActivityDetailModal from './components/ActivityDetailModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ActivitySearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    categories: [],
    priceRanges: [],
    durations: [],
    sortBy: 'popularity'
  });
  const [addedActivities, setAddedActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState([]);

  const mockActivities = [
  {
    id: 1,
    name: "Eiffel Tower Summit Tour",
    description: "Experience breathtaking views of Paris from the iconic Eiffel Tower summit. Includes skip-the-line access and guided tour with historical insights about this architectural marvel.",
    image: "https://images.unsplash.com/photo-1514562514633-f56a2f7c58d5",
    imageAlt: "Majestic Eiffel Tower standing tall against clear blue sky with green park grounds and tourists in foreground",
    category: "Attractions",
    priceRange: "$$",
    estimatedCost: 45,
    duration: "2-3 hours",
    rating: 4.8,
    reviewCount: 2847,
    isFavorite: false
  },
  {
    id: 2,
    name: "Seine River Dinner Cruise",
    description: "Romantic evening cruise along the Seine River featuring gourmet French cuisine, live music, and illuminated views of Paris landmarks including Notre-Dame and the Louvre.",
    image: "https://images.unsplash.com/photo-1512907701168-46159697e058",
    imageAlt: "Elegant dinner cruise boat on Seine River at sunset with Paris cityscape and historic bridges in background",
    category: "Dining",
    priceRange: "$$$",
    estimatedCost: 120,
    duration: "3 hours",
    rating: 4.9,
    reviewCount: 1523,
    isFavorite: false
  },
  {
    id: 3,
    name: "Louvre Museum Guided Tour",
    description: "Comprehensive guided tour of the world's largest art museum. See masterpieces including the Mona Lisa, Venus de Milo, and Egyptian antiquities with expert commentary.",
    image: "https://images.unsplash.com/photo-1722929594276-fd5b29e13477",
    imageAlt: "Grand Louvre Museum glass pyramid entrance with classical palace architecture and tourists gathering in courtyard",
    category: "Attractions",
    priceRange: "$$",
    estimatedCost: 65,
    duration: "3-4 hours",
    rating: 4.7,
    reviewCount: 3156,
    isFavorite: false
  },
  {
    id: 4,
    name: "Montmartre Walking Tour",
    description: "Explore the charming bohemian neighborhood of Montmartre. Visit Sacré-Cœur Basilica, artists' square, and discover hidden gems with a local guide sharing stories of Parisian culture.",
    image: "https://images.unsplash.com/photo-1605623363394-e88efcf97b30",
    imageAlt: "Picturesque cobblestone streets of Montmartre with white Sacré-Cœur Basilica on hilltop and traditional French cafes",
    category: "Attractions",
    priceRange: "$",
    estimatedCost: 25,
    duration: "2 hours",
    rating: 4.6,
    reviewCount: 892,
    isFavorite: false
  },
  {
    id: 5,
    name: "Traditional French Cooking Class",
    description: "Hands-on cooking experience learning to prepare authentic French dishes. Includes market tour, professional chef instruction, and enjoy your creations with wine pairing.",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_116c755f5-1767267663199.png",
    imageAlt: "Professional chef demonstrating French cooking techniques in modern kitchen with fresh ingredients and cooking utensils",
    category: "Dining",
    priceRange: "$$",
    estimatedCost: 85,
    duration: "4 hours",
    rating: 4.9,
    reviewCount: 567,
    isFavorite: false
  },
  {
    id: 6,
    name: "Versailles Palace Day Trip",
    description: "Full-day excursion to the magnificent Palace of Versailles. Explore the opulent royal apartments, Hall of Mirrors, and stunning gardens with transportation included.",
    image: "https://images.unsplash.com/photo-1633158114565-ccefd0a8b49e",
    imageAlt: "Spectacular Palace of Versailles with golden gates, ornate architecture, and manicured gardens with fountains",
    category: "Attractions",
    priceRange: "$$$",
    estimatedCost: 95,
    duration: "Full day",
    rating: 4.8,
    reviewCount: 2134,
    isFavorite: false
  },
  {
    id: 7,
    name: "Paris Metro & Bus Pass",
    description: "Unlimited travel pass for Paris public transportation. Access metro, buses, and RER trains throughout the city for convenient sightseeing and exploration.",
    image: "https://images.unsplash.com/photo-1679507923240-e00ffdc8280c",
    imageAlt: "Modern Paris metro station platform with arriving train and passengers waiting with city map displays",
    category: "Transport",
    priceRange: "$",
    estimatedCost: 15,
    duration: "1 day",
    rating: 4.5,
    reviewCount: 4521,
    isFavorite: false
  },
  {
    id: 8,
    name: "Luxury Hotel Stay - Le Marais",
    description: "Boutique hotel accommodation in the historic Le Marais district. Features elegant rooms, rooftop terrace, and proximity to major attractions and trendy restaurants.",
    image: "https://images.unsplash.com/photo-1630142346495-8c0aa0c87842",
    imageAlt: "Elegant hotel room interior with king-size bed, modern furnishings, city view windows, and ambient lighting",
    category: "Accommodation",
    priceRange: "$$$",
    estimatedCost: 250,
    duration: "Per night",
    rating: 4.7,
    reviewCount: 1876,
    isFavorite: false
  },
  {
    id: 9,
    name: "Moulin Rouge Cabaret Show",
    description: "World-famous cabaret performance featuring spectacular costumes, choreography, and live music. Includes champagne and optional dinner package in historic venue.",
    image: "https://images.unsplash.com/photo-1590258971704-36ab834f0c4e",
    imageAlt: "Vibrant cabaret stage with performers in elaborate feathered costumes under dramatic red and gold lighting",
    category: "Entertainment",
    priceRange: "$$$",
    estimatedCost: 110,
    duration: "2 hours",
    rating: 4.8,
    reviewCount: 3421,
    isFavorite: false
  },
  {
    id: 10,
    name: "Champs-Élysées Shopping Tour",
    description: "Guided shopping experience along the famous Champs-Élysées avenue. Visit luxury boutiques, department stores, and discover the best French fashion and beauty products.",
    image: "https://images.unsplash.com/photo-1606755947057-027ee5eb63eb",
    imageAlt: "Illuminated Champs-Élysées avenue at night with Arc de Triomphe, luxury shops, and bustling pedestrian traffic",
    category: "Shopping",
    priceRange: "$$",
    estimatedCost: 35,
    duration: "3 hours",
    rating: 4.6,
    reviewCount: 678,
    isFavorite: false
  },
  {
    id: 11,
    name: "Latin Quarter Food Tour",
    description: "Culinary walking tour through the historic Latin Quarter. Sample authentic French cheeses, pastries, wines, and traditional dishes while learning about local food culture.",
    image: "https://images.unsplash.com/photo-1542751793-e616102c4a00",
    imageAlt: "Artisan French cheese and charcuterie display with fresh baguettes and wine bottles in traditional market setting",
    category: "Dining",
    priceRange: "$$",
    estimatedCost: 75,
    duration: "3 hours",
    rating: 4.9,
    reviewCount: 1245,
    isFavorite: false
  },
  {
    id: 12,
    name: "Private Airport Transfer",
    description: "Comfortable private car service between Charles de Gaulle Airport and your Paris hotel. Professional driver, meet and greet service, and luggage assistance included.",
    image: "https://images.unsplash.com/photo-1685363740842-38ed1852eaf5",
    imageAlt: "Luxury black sedan with professional chauffeur waiting at modern airport terminal entrance with luggage cart",
    category: "Transport",
    priceRange: "$$",
    estimatedCost: 55,
    duration: "1 hour",
    rating: 4.7,
    reviewCount: 2890,
    isFavorite: false
  }];


  const searchSuggestions = [
  "Eiffel Tower",
  "Louvre Museum",
  "Notre-Dame Cathedral",
  "Arc de Triomphe",
  "Seine River Cruise",
  "Versailles Palace",
  "Montmartre",
  "French Cooking Class",
  "Wine Tasting",
  "Shopping Tour"];


  const activitiesWithFavorites = mockActivities?.map((activity) => ({
    ...activity,
    isFavorite: favoriteIds?.includes(activity?.id)
  }));

  const filteredActivities = activitiesWithFavorites?.filter((activity) => {
    const matchesSearch = !searchQuery ||
    activity?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    activity?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase());

    const matchesCategory = filters?.categories?.length === 0 ||
    filters?.categories?.some((cat) => activity?.category?.toLowerCase()?.includes(cat));

    const matchesPrice = filters?.priceRanges?.length === 0 ||
    filters?.priceRanges?.some((price) => {
      if (price === 'budget') return activity?.priceRange === '$';
      if (price === 'moderate') return activity?.priceRange === '$$';
      if (price === 'expensive') return activity?.priceRange === '$$$';
      return false;
    });

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedActivities = [...filteredActivities]?.sort((a, b) => {
    switch (filters?.sortBy) {
      case 'rating':
        return b?.rating - a?.rating;
      case 'price-low':
        return a?.estimatedCost - b?.estimatedCost;
      case 'price-high':
        return b?.estimatedCost - a?.estimatedCost;
      case 'popularity':
      default:
        return b?.reviewCount - a?.reviewCount;
    }
  });

  const handleAddToTrip = (activity) => {
    setAddedActivities((prev) => [...prev, { ...activity, id: Date.now() }]);
  };

  const handleRemoveActivity = (activityId) => {
    setAddedActivities((prev) => prev?.filter((a) => a?.id !== activityId));
  };

  const handleReorderActivities = (draggedActivity, targetActivity) => {
    const newActivities = [...addedActivities];
    const draggedIndex = newActivities?.findIndex((a) => a?.id === draggedActivity?.id);
    const targetIndex = newActivities?.findIndex((a) => a?.id === targetActivity?.id);

    newActivities?.splice(draggedIndex, 1);
    newActivities?.splice(targetIndex, 0, draggedActivity);

    setAddedActivities(newActivities);
  };

  const handleToggleFavorite = (activityId) => {
    setFavoriteIds((prev) =>
    prev?.includes(activityId) ?
    prev?.filter((id) => id !== activityId) :
    [...prev, activityId]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TripPlanningBreadcrumbs />
      <main className="pt-6 pb-24 lg:pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-2">
                  Discover Activities
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Find and add activities to your Paris itinerary
                </p>
              </div>
              <button
                onClick={() => setIsBudgetOpen(!isBudgetOpen)}
                className="lg:hidden p-3 rounded-lg bg-card border border-border hover-lift transition-base focus-ring"
                aria-label="Toggle budget widget">

                <Icon name="Wallet" size={20} color="var(--color-primary)" />
              </button>
            </div>

            <div className="flex items-center space-x-3 mb-6">
              <div className="flex-1">
                <SearchBar
                  onSearch={setSearchQuery}
                  suggestions={searchSuggestions} />

              </div>
              <Button
                variant="outline"
                size="icon"
                iconName="SlidersHorizontal"
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden"
                aria-label="Open filters" />

            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-data font-semibold text-foreground">
                  {sortedActivities?.length}
                </span>
                {' '}activities found
              </p>
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={16} color="var(--color-primary)" />
                <span className="text-sm font-caption font-medium text-foreground">
                  Paris, France
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3">
              <FilterPanel
                onFilterChange={setFilters}
                resultCount={sortedActivities?.length}
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)} />

            </div>

            <div className="lg:col-span-6">
              {sortedActivities?.length === 0 ?
              <div className="text-center py-16">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Search" size={40} color="var(--color-muted-foreground)" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
                    No activities found
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Try adjusting your filters or search query
                  </p>
                  <Button
                  variant="outline"
                  iconName="RotateCcw"
                  iconPosition="left"
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({
                      categories: [],
                      priceRanges: [],
                      durations: [],
                      sortBy: 'popularity'
                    });
                  }}>

                    Clear All Filters
                  </Button>
                </div> :

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sortedActivities?.map((activity) =>
                <ActivityCard
                  key={activity?.id}
                  activity={activity}
                  onAddToTrip={handleAddToTrip}
                  onViewDetails={setSelectedActivity}
                  onToggleFavorite={handleToggleFavorite} />

                )}
                </div>
              }
            </div>

            <div className="lg:col-span-3">
              <TripTimelinePanel
                activities={addedActivities}
                onRemoveActivity={handleRemoveActivity}
                onReorderActivities={handleReorderActivities}
                isOpen={isTimelineOpen}
                onToggle={() => setIsTimelineOpen(!isTimelineOpen)} />

            </div>
          </div>
        </div>
      </main>
      <BudgetIntegrationWidget
        isExpanded={isBudgetOpen}
        onToggle={() => setIsBudgetOpen(!isBudgetOpen)} />

      {selectedActivity &&
      <ActivityDetailModal
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
        onAddToTrip={handleAddToTrip} />

      }
    </div>);

};

export default ActivitySearch;