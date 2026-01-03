import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const CitySearchBar = ({ onCitySelect, selectedCities }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);
  const searchRef = useRef(null);

  const popularCities = [
  {
    id: 'paris-fr',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    image: "https://images.unsplash.com/photo-1514562514633-f56a2f7c58d5",
    imageAlt: 'Iconic Eiffel Tower standing tall against blue sky with green Champ de Mars park in foreground',
    estimatedCost: 150
  },
  {
    id: 'tokyo-jp',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    image: "https://images.unsplash.com/photo-1665791094316-40c5d0c8a7b7",
    imageAlt: 'Modern Tokyo cityscape with illuminated skyscrapers and busy streets at night',
    estimatedCost: 180
  },
  {
    id: 'new-york-us',
    name: 'New York',
    country: 'United States',
    region: 'North America',
    image: "https://images.unsplash.com/photo-1559952446-1eacd6141eb8",
    imageAlt: 'Manhattan skyline with tall buildings and Brooklyn Bridge spanning East River',
    estimatedCost: 200
  },
  {
    id: 'london-uk',
    name: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    image: "https://images.unsplash.com/photo-1723760807783-532f38538320",
    imageAlt: 'Big Ben clock tower and Houses of Parliament beside River Thames in London',
    estimatedCost: 170
  },
  {
    id: 'dubai-ae',
    name: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    image: "https://images.unsplash.com/photo-1667389411830-7116ed6d590d",
    imageAlt: 'Burj Khalifa towering over Dubai skyline with modern architecture and desert landscape',
    estimatedCost: 160
  },
  {
    id: 'barcelona-es',
    name: 'Barcelona',
    country: 'Spain',
    region: 'Europe',
    image: "https://images.unsplash.com/photo-1666453217814-ed9dfed1dc63",
    imageAlt: 'Sagrada Familia basilica with intricate Gothic spires against blue Mediterranean sky',
    estimatedCost: 130
  },
  {
    id: 'singapore-sg',
    name: 'Singapore',
    country: 'Singapore',
    region: 'Asia',
    image: "https://images.unsplash.com/photo-1562285474-d12dece5d508",
    imageAlt: 'Marina Bay Sands hotel with rooftop infinity pool overlooking Singapore harbor at sunset',
    estimatedCost: 175
  },
  {
    id: 'rome-it',
    name: 'Rome',
    country: 'Italy',
    region: 'Europe',
    image: "https://images.unsplash.com/photo-1694544419577-1213b4fe02d6",
    imageAlt: 'Ancient Roman Colosseum amphitheater with stone arches under bright sunny sky',
    estimatedCost: 140
  },
  {
    id: 'sydney-au',
    name: 'Sydney',
    country: 'Australia',
    region: 'Oceania',
    image: "https://images.unsplash.com/photo-1603347943745-980463628c1f",
    imageAlt: 'Sydney Opera House with distinctive white shell-shaped roof beside harbor waters',
    estimatedCost: 190
  },
  {
    id: 'bangkok-th',
    name: 'Bangkok',
    country: 'Thailand',
    region: 'Asia',
    image: "https://images.unsplash.com/photo-1584946791776-6bd29590034b",
    imageAlt: 'Golden Buddhist temple with ornate Thai architecture and colorful decorative details',
    estimatedCost: 100
  }];


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery?.trim()) {
      const filtered = popularCities?.filter((city) => {
        const isAlreadySelected = selectedCities?.some((sc) => sc?.id === city?.id);
        const matchesSearch =
        city?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        city?.country?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        city?.region?.toLowerCase()?.includes(searchQuery?.toLowerCase());
        return !isAlreadySelected && matchesSearch;
      });
      setFilteredCities(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredCities([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, selectedCities]);

  const handleCitySelect = (city) => {
    onCitySelect(city);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <Input
          type="search"
          placeholder="Search for cities (e.g., Paris, Tokyo, New York)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e?.target?.value)}
          onFocus={() => searchQuery && setShowSuggestions(true)}
          className="pr-10" />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon name="Search" size={20} className="text-muted-foreground" />
        </div>
      </div>
      {showSuggestions && filteredCities?.length > 0 &&
      <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {filteredCities?.map((city) =>
        <button
          key={city?.id}
          onClick={() => handleCitySelect(city)}
          className="w-full flex items-center space-x-3 p-3 hover:bg-muted transition-base text-left border-b border-border last:border-b-0">

              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img
              src={city?.image}
              alt={city?.imageAlt}
              className="w-full h-full object-cover" />

              </div>
              <div className="flex-1 min-w-0">
                <div className="font-caption font-semibold text-foreground">
                  {city?.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {city?.country} • {city?.region}
                </div>
              </div>
              <div className="text-sm font-data text-muted-foreground">
                ~${city?.estimatedCost}/day
              </div>
            </button>
        )}
        </div>
      }
      {showSuggestions && searchQuery && filteredCities?.length === 0 &&
      <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-lg shadow-lg p-4 text-center">
          <Icon name="MapPinOff" size={32} className="mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No cities found matching "{searchQuery}"
          </p>
        </div>
      }
    </div>);

};

export default CitySearchBar;