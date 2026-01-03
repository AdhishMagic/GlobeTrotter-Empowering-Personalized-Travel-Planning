import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TripPlanningBreadcrumbs from '../../components/ui/TripPlanningBreadcrumbs';
import TripDetailsForm from './components/TripDetailsForm';
import SuggestedDestinations from './components/SuggestedDestinations';
import TripCreationTips from './components/TripCreationTips';
import Icon from '../../components/AppIcon';

const CreateNewTrip = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    tripName: '',
    description: '',
    startDate: '',
    endDate: '',
    selectedDestination: ''
  });
  const [errors, setErrors] = useState({});

  const handleFormChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.tripName?.trim()) {
      newErrors.tripName = 'Trip name is required';
    } else if (formData?.tripName?.length < 3) {
      newErrors.tripName = 'Trip name must be at least 3 characters';
    }

    if (!formData?.description?.trim()) {
      newErrors.description = 'Trip description is required';
    } else if (formData?.description?.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData?.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData?.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData?.startDate && formData?.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      console.log('Trip created:', formData);
      const tripId = `trip-${Date.now()}`;
      navigate(`/trip/${tripId}/cities`, {
        state: {
          tripData: formData,
          tripId
        }
      });
    }, 1500);
  };

  const handleCancel = () => {
    if (formData?.tripName || formData?.description || formData?.startDate || formData?.endDate) {
      const confirmCancel = window.confirm('Are you sure you want to cancel? All entered data will be lost.');
      if (confirmCancel) {
        navigate('/dashboard');
      }
    } else {
      navigate('/dashboard');
    }
  };

  const handleSelectDestination = (destinationName) => {
    setFormData(prev => ({
      ...prev,
      selectedDestination: destinationName
    }));

    const element = document.getElementById('trip-form');
    if (element) {
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-background">
      <TripPlanningBreadcrumbs />
      <main className="pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-primary/10 rounded-lg p-3">
                <Icon name="PlusCircle" size={32} color="var(--color-primary)" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground">
                  Create New Trip
                </h1>
                <p className="text-base md:text-lg text-muted-foreground mt-1">
                  Start planning your next adventure
                </p>
              </div>
            </div>
          </div>

          {formData?.selectedDestination && (
            <div className="mb-6 bg-success/10 border border-success/20 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="CheckCircle2" size={20} color="var(--color-success)" />
                <p className="text-sm text-foreground">
                  <span className="font-semibold">{formData?.selectedDestination}</span> added to your trip
                </p>
              </div>
              <button
                onClick={() => setFormData(prev => ({ ...prev, selectedDestination: '' }))}
                className="text-muted-foreground hover:text-foreground transition-base"
              >
                <Icon name="X" size={18} />
              </button>
            </div>
          )}

          <div id="trip-form" className="space-y-8">
            <TripDetailsForm
              formData={formData}
              errors={errors}
              onChange={handleFormChange}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
            />

            <SuggestedDestinations onSelectDestination={handleSelectDestination} />

            <TripCreationTips />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateNewTrip;