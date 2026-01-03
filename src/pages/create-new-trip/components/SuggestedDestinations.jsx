import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const SuggestedDestinations = ({ onSelectDestination }) => {
  const suggestedDestinations = [
  {
    id: 1,
    name: "Paris, France",
    image: "https://images.unsplash.com/photo-1514562514633-f56a2f7c58d5",
    imageAlt: "Iconic Eiffel Tower standing tall against clear blue sky with green Champ de Mars park in foreground during golden hour",
    description: "City of lights, art, and romance",
    highlights: ["Eiffel Tower", "Louvre Museum", "Notre-Dame"],
    bestTime: "Apr-Jun, Sep-Oct",
    avgBudget: "$150-200/day"
  },
  {
    id: 2,
    name: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1587542331372-4dcbe1f13184",
    imageAlt: "Modern Tokyo cityscape with illuminated skyscrapers and neon signs reflecting on wet streets during evening twilight",
    description: "Blend of tradition and technology",
    highlights: ["Shibuya Crossing", "Senso-ji Temple", "Mount Fuji"],
    bestTime: "Mar-May, Sep-Nov",
    avgBudget: "$120-180/day"
  },
  {
    id: 3,
    name: "New York, USA",
    image: "https://images.unsplash.com/photo-1496111557763-1e207933b3f0",
    imageAlt: "Manhattan skyline featuring Empire State Building and surrounding skyscrapers against dramatic sunset sky with orange and purple hues",
    description: "The city that never sleeps",
    highlights: ["Statue of Liberty", "Central Park", "Times Square"],
    bestTime: "Apr-Jun, Sep-Nov",
    avgBudget: "$200-300/day"
  },
  {
    id: 4,
    name: "Barcelona, Spain",
    image: "https://images.unsplash.com/photo-1659115665547-1102a864baa8",
    imageAlt: "Colorful mosaic-covered structures of Park Güell with curved architectural elements and Mediterranean Sea visible in background",
    description: "Gaudi\'s masterpiece by the sea",
    highlights: ["Sagrada Familia", "Park Güell", "La Rambla"],
    bestTime: "May-Jun, Sep-Oct",
    avgBudget: "$100-150/day"
  },
  {
    id: 5,
    name: "Dubai, UAE",
    image: "https://images.unsplash.com/photo-1667389411830-7116ed6d590d",
    imageAlt: "Burj Khalifa towering over modern Dubai skyline with luxury hotels and shopping centers along Sheikh Zayed Road at dusk",
    description: "Luxury and innovation in the desert",
    highlights: ["Burj Khalifa", "Palm Jumeirah", "Dubai Mall"],
    bestTime: "Nov-Mar",
    avgBudget: "$180-250/day"
  },
  {
    id: 6,
    name: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1627223664399-4f7e0c9de0c3",
    imageAlt: "Traditional Balinese temple with ornate stone carvings surrounded by lush tropical jungle and terraced rice paddies in morning mist",
    description: "Tropical paradise and culture",
    highlights: ["Ubud Rice Terraces", "Tanah Lot", "Beaches"],
    bestTime: "Apr-Oct",
    avgBudget: "$60-100/day"
  }];


  return (
    <div className="bg-card rounded-lg p-6 md:p-8 shadow-md border border-border">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-accent/10 rounded-lg p-2">
          <Icon name="MapPin" size={24} color="var(--color-accent)" />
        </div>
        <div>
          <h2 className="font-heading font-semibold text-2xl md:text-3xl text-foreground">
            Suggested Destinations
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Popular destinations to inspire your journey
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suggestedDestinations?.map((destination) =>
        <div
          key={destination?.id}
          className="group bg-background rounded-lg overflow-hidden border border-border hover-lift transition-base cursor-pointer"
          onClick={() => onSelectDestination(destination?.name)}>

            <div className="relative h-48 md:h-56 overflow-hidden">
              <Image
              src={destination?.image}
              alt={destination?.imageAlt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="font-heading font-semibold text-xl text-white mb-1">
                  {destination?.name}
                </h3>
                <p className="text-sm text-white/90">{destination?.description}</p>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-start space-x-2">
                <Icon name="Star" size={16} className="text-accent mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-caption font-medium text-muted-foreground mb-1">
                    Top Highlights
                  </p>
                  <p className="text-sm text-foreground line-clamp-2">
                    {destination?.highlights?.join(" • ")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                <div>
                  <p className="text-xs font-caption text-muted-foreground mb-1">
                    Best Time
                  </p>
                  <p className="text-sm font-data text-foreground whitespace-nowrap">
                    {destination?.bestTime}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-caption text-muted-foreground mb-1">
                    Avg Budget
                  </p>
                  <p className="text-sm font-data text-foreground whitespace-nowrap">
                    {destination?.avgBudget}
                  </p>
                </div>
              </div>

              <button
              onClick={(e) => {
                e?.stopPropagation();
                onSelectDestination(destination?.name);
              }}
              className="w-full mt-2 px-4 py-2 bg-primary/10 text-primary rounded-lg font-caption font-medium text-sm hover:bg-primary/20 transition-base flex items-center justify-center space-x-2">

                <Icon name="Plus" size={16} />
                <span>Add to Trip</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>);

};

export default SuggestedDestinations;