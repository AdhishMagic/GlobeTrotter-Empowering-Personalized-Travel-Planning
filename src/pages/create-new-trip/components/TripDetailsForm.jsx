import React from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const TripDetailsForm = ({ 
  formData, 
  errors, 
  onChange, 
  onSubmit, 
  onCancel,
  isSubmitting 
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    onChange(name, value);
  };

  const today = new Date()?.toISOString()?.split('T')?.[0];

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="bg-card rounded-lg p-6 md:p-8 shadow-md border border-border">
        <h2 className="font-heading font-semibold text-2xl md:text-3xl text-foreground mb-6">
          Trip Details
        </h2>

        <div className="space-y-6">
          <Input
            label="Trip Name"
            type="text"
            name="tripName"
            placeholder="e.g., European Summer Adventure"
            value={formData?.tripName}
            onChange={handleInputChange}
            error={errors?.tripName}
            required
            maxLength={100}
            description="Give your trip a memorable name"
          />

          <div>
            <label className="block text-sm font-caption font-medium text-foreground mb-2">
              Trip Description
            </label>
            <textarea
              name="description"
              placeholder="Describe your trip plans, goals, and what you're looking forward to..."
              value={formData?.description}
              onChange={handleInputChange}
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-base resize-none"
            />
            {errors?.description && (
              <p className="mt-2 text-sm text-error">{errors?.description}</p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              {formData?.description?.length}/500 characters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Start Date"
              type="date"
              name="startDate"
              value={formData?.startDate}
              onChange={handleInputChange}
              error={errors?.startDate}
              required
              min={today}
            />

            <Input
              label="End Date"
              type="date"
              name="endDate"
              value={formData?.endDate}
              onChange={handleInputChange}
              error={errors?.endDate}
              required
              min={formData?.startDate || today}
            />
          </div>

          {formData?.startDate && formData?.endDate && (
            <div className="bg-primary/10 rounded-lg p-4 flex items-center space-x-3">
              <div className="bg-primary/20 rounded-full p-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-foreground">
                Trip duration: <span className="font-data font-semibold">
                  {Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24)) + 1} days
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col-reverse md:flex-row gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="default"
          loading={isSubmitting}
          iconName="ArrowRight"
          iconPosition="right"
        >
          Continue to Add Cities
        </Button>
      </div>
    </form>
  );
};

export default TripDetailsForm;