import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TripPlanningBreadcrumbs from '../../components/ui/TripPlanningBreadcrumbs';
import BudgetIntegrationWidget from '../../components/ui/BudgetIntegrationWidget';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import CitySearchBar from './components/CitySearchBar';
import CityCard from './components/CityCard';
import TripTimeline from './components/TripTimeline';
import EmptyState from './components/EmptyState';

const AddCities = () => {
  const navigate = useNavigate();
  const { id: tripId } = useParams();
  const effectiveTripId = tripId || 'trip-1';
  const [selectedCities, setSelectedCities] = useState([]);
  const [isBudgetWidgetOpen, setIsBudgetWidgetOpen] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCitySelect = (city) => {
    const today = new Date()?.toISOString()?.split('T')?.[0];
    const tomorrow = new Date(Date.now() + 86400000)?.toISOString()?.split('T')?.[0];

    const newCity = {
      ...city,
      startDate: today,
      endDate: tomorrow,
      order: selectedCities?.length
    };

    setSelectedCities([...selectedCities, newCity]);
    setValidationError('');
  };

  const handleCityUpdate = (cityId, updates) => {
    setValidationError('');

    const updatedCities = selectedCities?.map(city => {
      if (city?.id === cityId) {
        return { ...city, ...updates };
      }
      return city;
    });

    const hasOverlap = checkDateOverlaps(updatedCities);
    if (hasOverlap) {
      setValidationError('Date ranges cannot overlap between cities');
      return;
    }

    setSelectedCities(updatedCities);
  };

  const handleCityRemove = (cityId) => {
    setSelectedCities(selectedCities?.filter(city => city?.id !== cityId));
    setValidationError('');
  };

  const checkDateOverlaps = (cities) => {
    for (let i = 0; i < cities?.length; i++) {
      for (let j = i + 1; j < cities?.length; j++) {
        const start1 = new Date(cities[i].startDate)?.getTime();
        const end1 = new Date(cities[i].endDate)?.getTime();
        const start2 = new Date(cities[j].startDate)?.getTime();
        const end2 = new Date(cities[j].endDate)?.getTime();

        if ((start1 <= end2 && end1 >= start2) || (start2 <= end1 && end2 >= start1)) {
          return true;
        }
      }
    }
    return false;
  };

  const handleDragEnd = (result) => {
    if (!result?.destination) return;

    const items = Array.from(selectedCities);
    const [reorderedItem] = items?.splice(result?.source?.index, 1);
    items?.splice(result?.destination?.index, 0, reorderedItem);

    setSelectedCities(items);
  };

  const handleContinue = () => {
    if (selectedCities?.length === 0) {
      setValidationError('Please add at least one city to continue');
      return;
    }

    const hasInvalidDates = selectedCities?.some(city => {
      const start = new Date(city.startDate)?.getTime();
      const end = new Date(city.endDate)?.getTime();
      return end <= start;
    });

    if (hasInvalidDates) {
      setValidationError('All cities must have valid date ranges');
      return;
    }

    navigate(`/trip/${effectiveTripId}/activities`);
  };

  return (
    <div className="bg-background">
      <TripPlanningBreadcrumbs />
      <main className="pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-2">
              Add Cities to Your Trip
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              Build your multi-city itinerary by selecting destinations and setting date ranges
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card border border-border rounded-lg p-4 md:p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Icon name="Search" size={20} className="text-primary" />
                  <h2 className="font-heading font-semibold text-lg text-foreground">
                    Search Cities
                  </h2>
                </div>
                <CitySearchBar 
                  onCitySelect={handleCitySelect}
                  selectedCities={selectedCities}
                />
              </div>

              {validationError && (
                <div className="flex items-center space-x-3 p-4 bg-error/10 border border-error/20 rounded-lg">
                  <Icon name="AlertCircle" size={20} className="text-error flex-shrink-0" />
                  <p className="text-sm text-error">{validationError}</p>
                </div>
              )}

              {selectedCities?.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-heading font-semibold text-lg md:text-xl text-foreground">
                      Selected Cities ({selectedCities?.length})
                    </h2>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Icon name="Info" size={16} />
                      <span className="hidden sm:inline">Drag to reorder</span>
                    </div>
                  </div>

                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="cities">
                      {(provided) => (
                        <div
                          {...provided?.droppableProps}
                          ref={provided?.innerRef}
                          className="space-y-4"
                        >
                          {selectedCities?.map((city, index) => (
                            <Draggable key={city?.id} draggableId={city?.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided?.innerRef}
                                  {...provided?.draggableProps}
                                >
                                  <CityCard
                                    city={city}
                                    index={index}
                                    onUpdate={handleCityUpdate}
                                    onRemove={handleCityRemove}
                                    isDragging={snapshot?.isDragging}
                                    dragHandleProps={provided?.dragHandleProps}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided?.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              )}

              {selectedCities?.length > 0 && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <Button
                    variant="default"
                    size="lg"
                    iconName="ArrowRight"
                    iconPosition="right"
                    onClick={handleContinue}
                    fullWidth
                    className="sm:flex-1"
                  >
                    Continue to Activities
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    iconName="Plus"
                    iconPosition="left"
                    onClick={() => document.querySelector('input[type="search"]')?.focus()}
                    fullWidth
                    className="sm:flex-1"
                  >
                    Add Another City
                  </Button>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <TripTimeline cities={selectedCities} />

                <div className="bg-card border border-border rounded-lg p-4 md:p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Icon name="Lightbulb" size={20} className="text-accent" />
                    <h3 className="font-heading font-semibold text-base text-foreground">
                      Planning Tips
                    </h3>
                  </div>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start space-x-2">
                      <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                      <span>Allow at least 2-3 days per city for a relaxed experience</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                      <span>Consider travel time between cities when setting dates</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                      <span>Budget estimates include accommodation and daily expenses</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                      <span>You can adjust dates and costs after adding activities</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <BudgetIntegrationWidget 
        isExpanded={isBudgetWidgetOpen}
        onToggle={() => setIsBudgetWidgetOpen(!isBudgetWidgetOpen)}
      />
    </div>
  );
};

export default AddCities;