import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const TripPlanningBreadcrumbs = () => {
  const location = useLocation();

  const planningSteps = [
    { label: 'Create Trip', path: '/create-new-trip', icon: 'Plus' },
    { label: 'Add Cities', path: '/add-cities', icon: 'MapPin' },
    { label: 'Find Activities', path: '/activity-search', icon: 'Search' }
  ];

  const currentStepIndex = planningSteps?.findIndex(
    step => step?.path === location?.pathname
  );

  if (currentStepIndex === -1) return null;

  return (
    <div className="sticky top-16 z-100 bg-background border-b border-border py-3 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <nav aria-label="Trip planning progress" className="flex items-center justify-center md:justify-start">
          <ol className="flex items-center space-x-2 md:space-x-4">
            {planningSteps?.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isCompleted = index < currentStepIndex;
              const isClickable = index <= currentStepIndex;

              return (
                <li key={step?.path} className="flex items-center">
                  {index > 0 && (
                    <Icon 
                      name="ChevronRight" 
                      size={16} 
                      className="mx-1 md:mx-2 text-muted-foreground"
                    />
                  )}
                  {isClickable ? (
                    <Link
                      to={step?.path}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-caption font-medium transition-base hover-lift focus-ring ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : isCompleted
                          ? 'bg-success/10 text-success hover:bg-success/20' :'text-muted-foreground'
                      }`}
                    >
                      <Icon 
                        name={isCompleted ? 'CheckCircle2' : step?.icon} 
                        size={18} 
                      />
                      <span className="hidden sm:inline">{step?.label}</span>
                    </Link>
                  ) : (
                    <div className="flex items-center space-x-2 px-3 py-2 rounded-lg font-caption font-medium text-muted-foreground opacity-50">
                      <Icon name={step?.icon} size={18} />
                      <span className="hidden sm:inline">{step?.label}</span>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default TripPlanningBreadcrumbs;