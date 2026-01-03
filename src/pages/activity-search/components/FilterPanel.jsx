import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox, CheckboxGroup } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const FilterPanel = ({ onFilterChange, resultCount, isOpen, onClose }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [sortBy, setSortBy] = useState('popularity');

  const categories = [
    { id: 'dining', label: 'Dining & Food', icon: 'UtensilsCrossed' },
    { id: 'attractions', label: 'Attractions', icon: 'Landmark' },
    { id: 'transport', label: 'Transport', icon: 'Car' },
    { id: 'accommodation', label: 'Accommodation', icon: 'Hotel' },
    { id: 'entertainment', label: 'Entertainment', icon: 'Music' },
    { id: 'shopping', label: 'Shopping', icon: 'ShoppingBag' }
  ];

  const priceRanges = [
    { id: 'budget', label: 'Budget ($)', value: '$' },
    { id: 'moderate', label: 'Moderate ($$)', value: '$$' },
    { id: 'expensive', label: 'Expensive ($$$)', value: '$$$' }
  ];

  const durations = [
    { id: 'short', label: 'Under 2 hours' },
    { id: 'medium', label: '2-4 hours' },
    { id: 'long', label: '4+ hours' },
    { id: 'fullday', label: 'Full day' }
  ];

  const sortOptions = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'duration', label: 'Duration' }
  ];

  const handleCategoryToggle = (categoryId) => {
    const updated = selectedCategories?.includes(categoryId)
      ? selectedCategories?.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    setSelectedCategories(updated);
    applyFilters({ categories: updated });
  };

  const handlePriceToggle = (priceId) => {
    const updated = selectedPriceRanges?.includes(priceId)
      ? selectedPriceRanges?.filter(id => id !== priceId)
      : [...selectedPriceRanges, priceId];
    setSelectedPriceRanges(updated);
    applyFilters({ priceRanges: updated });
  };

  const handleDurationToggle = (durationId) => {
    const updated = selectedDurations?.includes(durationId)
      ? selectedDurations?.filter(id => id !== durationId)
      : [...selectedDurations, durationId];
    setSelectedDurations(updated);
    applyFilters({ durations: updated });
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    applyFilters({ sortBy: value });
  };

  const applyFilters = (updates) => {
    onFilterChange({
      categories: updates?.categories || selectedCategories,
      priceRanges: updates?.priceRanges || selectedPriceRanges,
      durations: updates?.durations || selectedDurations,
      sortBy: updates?.sortBy || sortBy
    });
  };

  const handleClearAll = () => {
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setSelectedDurations([]);
    setSortBy('popularity');
    onFilterChange({
      categories: [],
      priceRanges: [],
      durations: [],
      sortBy: 'popularity'
    });
  };

  const filterContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-semibold text-lg text-foreground">
          Filters
        </h3>
        <Button
          variant="ghost"
          size="sm"
          iconName="RotateCcw"
          iconPosition="left"
          onClick={handleClearAll}
        >
          Clear All
        </Button>
      </div>

      <div className="pb-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-caption font-medium text-foreground">
            Results Found
          </span>
          <span className="font-data font-semibold text-lg text-primary">
            {resultCount}
          </span>
        </div>
      </div>

      <div>
        <Select
          label="Sort By"
          options={sortOptions}
          value={sortBy}
          onChange={handleSortChange}
        />
      </div>

      <div>
        <h4 className="font-caption font-semibold text-sm text-foreground mb-3">
          Categories
        </h4>
        <CheckboxGroup>
          {categories?.map((category) => (
            <div key={category?.id} className="flex items-center space-x-2 mb-2">
              <Checkbox
                checked={selectedCategories?.includes(category?.id)}
                onChange={() => handleCategoryToggle(category?.id)}
              />
              <Icon name={category?.icon} size={16} color="var(--color-muted-foreground)" />
              <label className="text-sm text-foreground cursor-pointer flex-1">
                {category?.label}
              </label>
            </div>
          ))}
        </CheckboxGroup>
      </div>

      <div className="pt-4 border-t border-border">
        <h4 className="font-caption font-semibold text-sm text-foreground mb-3">
          Price Range
        </h4>
        <CheckboxGroup>
          {priceRanges?.map((price) => (
            <Checkbox
              key={price?.id}
              label={price?.label}
              checked={selectedPriceRanges?.includes(price?.id)}
              onChange={() => handlePriceToggle(price?.id)}
              className="mb-2"
            />
          ))}
        </CheckboxGroup>
      </div>

      <div className="pt-4 border-t border-border">
        <h4 className="font-caption font-semibold text-sm text-foreground mb-3">
          Duration
        </h4>
        <CheckboxGroup>
          {durations?.map((duration) => (
            <Checkbox
              key={duration?.id}
              label={duration?.label}
              checked={selectedDurations?.includes(duration?.id)}
              onChange={() => handleDurationToggle(duration?.id)}
              className="mb-2"
            />
          ))}
        </CheckboxGroup>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block bg-card rounded-lg border border-border p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
        {filterContent}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-200 lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="absolute inset-x-0 bottom-0 bg-card rounded-t-2xl border-t border-border max-h-[85vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h3 className="font-heading font-semibold text-lg text-foreground">
                Filters
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-base focus-ring"
                aria-label="Close filters"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            <div className="p-6">
              {filterContent}
            </div>
            <div className="sticky bottom-0 bg-card border-t border-border p-4">
              <Button
                variant="default"
                fullWidth
                onClick={onClose}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterPanel;