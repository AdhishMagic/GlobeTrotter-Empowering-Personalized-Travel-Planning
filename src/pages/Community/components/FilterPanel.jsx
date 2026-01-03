import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const FilterPanel = ({ filters, onFilterChange, onReset, isOpen, onClose }) => {
  const destinationOptions = [
    { value: 'all', label: 'All Destinations' },
    { value: 'asia', label: 'Asia' },
    { value: 'europe', label: 'Europe' },
    { value: 'north-america', label: 'North America' },
    { value: 'south-america', label: 'South America' },
    { value: 'africa', label: 'Africa' },
    { value: 'oceania', label: 'Oceania' },
  ];

  const durationOptions = [
    { value: 'all', label: 'Any Duration' },
    { value: '1-3', label: '1-3 days' },
    { value: '4-7', label: '4-7 days' },
    { value: '8-14', label: '1-2 weeks' },
    { value: '15-30', label: '2-4 weeks' },
    { value: '30+', label: '1+ month' },
  ];

  const budgetOptions = [
    { value: 'all', label: 'Any Budget' },
    { value: '0-500', label: 'Under $500' },
    { value: '500-1000', label: '$500 - $1,000' },
    { value: '1000-2500', label: '$1,000 - $2,500' },
    { value: '2500-5000', label: '$2,500 - $5,000' },
    { value: '5000+', label: '$5,000+' },
  ];

  const travelStyleOptions = [
    { value: 'all', label: 'All Styles' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'relaxation', label: 'Relaxation' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'luxury', label: 'Luxury' },
    { value: 'budget', label: 'Budget' },
    { value: 'family', label: 'Family' },
    { value: 'solo', label: 'Solo Travel' },
    { value: 'romantic', label: 'Romantic' },
  ];

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'recent', label: 'Most Recent' },
    { value: 'views', label: 'Most Viewed' },
    { value: 'likes', label: 'Most Liked' },
    { value: 'budget-low', label: 'Budget: Low to High' },
    { value: 'budget-high', label: 'Budget: High to Low' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-foreground/50 z-[1001] lg:hidden" onClick={onClose} />
      )}

      {/* Filter Panel */}
      <div
        className={`
          fixed lg:sticky top-0 left-0 h-screen lg:h-auto w-80 lg:w-full
          bg-card border-r lg:border-r-0 lg:border border-border rounded-none lg:rounded-xl
          overflow-y-auto z-[1002] lg:z-auto elevation-3 lg:elevation-1
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-4 md:p-5 lg:p-6">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-xl font-heading font-semibold text-foreground">Filters</h2>
            <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <h2 className="text-lg font-heading font-semibold text-foreground">Filter Trips</h2>
            <Button variant="ghost" size="sm" onClick={onReset}>
              Reset
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <Input
              type="search"
              placeholder="Search destinations or activities..."
              value={filters?.search}
              onChange={(e) => onFilterChange('search', e?.target?.value)}
              className="mb-0"
            />
          </div>

          {/* Destination Filter */}
          <div className="mb-6">
            <Select
              label="Destination"
              options={destinationOptions}
              value={filters?.destination}
              onChange={(value) => onFilterChange('destination', value)}
            />
          </div>

          {/* Duration Filter */}
          <div className="mb-6">
            <Select
              label="Trip Duration"
              options={durationOptions}
              value={filters?.duration}
              onChange={(value) => onFilterChange('duration', value)}
            />
          </div>

          {/* Budget Filter */}
          <div className="mb-6">
            <Select
              label="Budget Range"
              options={budgetOptions}
              value={filters?.budget}
              onChange={(value) => onFilterChange('budget', value)}
            />
          </div>

          {/* Travel Style Filter */}
          <div className="mb-6">
            <Select
              label="Travel Style"
              options={travelStyleOptions}
              value={filters?.travelStyle}
              onChange={(value) => onFilterChange('travelStyle', value)}
            />
          </div>

          {/* Sort By */}
          <div className="mb-6">
            <Select
              label="Sort By"
              options={sortOptions}
              value={filters?.sortBy}
              onChange={(value) => onFilterChange('sortBy', value)}
            />
          </div>

          {/* Mobile Actions */}
          <div className="flex gap-3 lg:hidden">
            <Button variant="outline" fullWidth onClick={onReset}>
              Reset
            </Button>
            <Button variant="default" fullWidth onClick={onClose}>
              Apply
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;
