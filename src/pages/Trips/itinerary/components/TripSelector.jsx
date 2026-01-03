import React from 'react';
import Select from 'components/ui/Select';

const TripSelector = ({ trips, selectedTrip, onTripChange }) => {
  const tripOptions = trips?.map((trip) => ({
    value: trip?.id,
    label: trip?.name,
    description: `${trip?.startDate} - ${trip?.endDate}`,
  }));

  return (
    <div className="w-full md:w-80">
      <Select
        label="Select Trip"
        options={tripOptions}
        value={selectedTrip}
        onChange={onTripChange}
        searchable
        placeholder="Choose a trip to view"
      />
    </div>
  );
};

export default TripSelector;
