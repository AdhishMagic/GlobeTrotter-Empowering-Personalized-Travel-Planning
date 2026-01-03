import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DestinationsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const destinations = [
  {
    name: 'Paris, France',
    image: "https://images.unsplash.com/photo-1652117524855-1648ca528798",
    imageAlt: 'Iconic Eiffel Tower standing tall against clear blue sky with Seine River and historic Parisian buildings in foreground during golden hour',
    description: 'City of lights and romance',
    trips: 1247
  },
  {
    name: 'Tokyo, Japan',
    image: "https://images.unsplash.com/photo-1705615791233-7d9d9a5fe12a",
    imageAlt: 'Modern Tokyo skyline with illuminated skyscrapers and neon signs reflecting on wet streets during vibrant evening twilight',
    description: 'Blend of tradition and technology',
    trips: 1089
  },
  {
    name: 'Bali, Indonesia',
    image: "https://images.unsplash.com/photo-1555400038-a088c772c8cd",
    imageAlt: 'Lush green rice terraces cascading down hillside with traditional Balinese temple and palm trees under bright tropical sunshine',
    description: 'Tropical paradise and culture',
    trips: 956
  },
  {
    name: 'New York, USA',
    image: "https://images.unsplash.com/photo-1656875123327-878f02acd2c8",
    imageAlt: 'Manhattan skyline with tall skyscrapers and Brooklyn Bridge spanning East River during dramatic sunset with orange and purple clouds',
    description: 'The city that never sleeps',
    trips: 1534
  },
  {
    name: 'Barcelona, Spain',
    image: "https://images.unsplash.com/photo-1643170750649-fb9415c6a45d",
    imageAlt: 'Colorful mosaic architecture of Park Guell with curved benches and Mediterranean Sea visible in background under clear blue sky',
    description: 'Art, architecture, and beaches',
    trips: 823
  },
  {
    name: 'Dubai, UAE',
    image: "https://images.unsplash.com/photo-1732968616742-d342a483202c",
    imageAlt: 'Futuristic Dubai skyline featuring Burj Khalifa towering over modern glass buildings with desert landscape in background at dusk',
    description: 'Luxury and innovation',
    trips: 1156
  }];


  const itemsPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  };

  const maxIndex = destinations?.length - itemsPerView?.desktop;

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center space-y-4 md:space-y-6 mb-12 md:mb-16">
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground">
            Popular Destinations
            <span className="block text-primary mt-2">Start Your Adventure</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore the most loved destinations by our community of travelers and get inspired for your next journey.
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out gap-6"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView?.desktop)}%)`
              }}>

              {destinations?.map((destination, index) =>
              <div
                key={index}
                className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3">

                  <div className="bg-card rounded-xl overflow-hidden shadow-md hover-lift transition-base border border-border group">
                    <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden">
                      <Image
                      src={destination?.image}
                      alt={destination?.imageAlt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />

                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-heading font-semibold text-xl md:text-2xl text-white mb-1">
                          {destination?.name}
                        </h3>
                        <p className="text-sm text-white/90">
                          {destination?.description}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 md:p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Icon name="Users" size={16} color="var(--color-muted-foreground)" />
                          <span className="text-sm text-muted-foreground">
                            {destination?.trips?.toLocaleString()} trips planned
                          </span>
                        </div>
                        <Icon name="ArrowRight" size={20} className="text-primary group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:block">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-card rounded-full shadow-lg flex items-center justify-center hover-lift transition-base disabled:opacity-50 disabled:cursor-not-allowed border border-border focus-ring"
              aria-label="Previous destinations">

              <Icon name="ChevronLeft" size={24} />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-card rounded-full shadow-lg flex items-center justify-center hover-lift transition-base disabled:opacity-50 disabled:cursor-not-allowed border border-border focus-ring"
              aria-label="Next destinations">

              <Icon name="ChevronRight" size={24} />
            </button>
          </div>

          <div className="flex items-center justify-center space-x-2 mt-8 lg:hidden">
            {destinations?.map((_, index) =>
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ?
              'bg-primary w-8' : 'bg-muted-foreground/30'}`
              }
              aria-label={`Go to destination ${index + 1}`} />

            )}
          </div>
        </div>

        <div className="text-center mt-12 md:mt-16">
          <Button
            variant="outline"
            size="lg"
            iconName="Compass"
            iconPosition="left">

            Explore All Destinations
          </Button>
        </div>
      </div>
    </section>);

};

export default DestinationsCarousel;