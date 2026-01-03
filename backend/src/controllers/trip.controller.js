const tripService = require('../services/trip.service');

async function createTrip(req, res, next) {
  try {
    const userId = req.user?.id;
    const trip = await tripService.createTrip(userId, req.body);

    return res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      trip: {
        id: trip.id,
        tripName: trip.tripName,
        startDate: trip.startDate,
        endDate: trip.endDate,
        status: trip.status,
      },
    });
  } catch (err) {
    return next(err);
  }
}

async function getMyTrips(req, res, next) {
  try {
    const userId = req.user?.id;
    const trips = await tripService.getTripsForUser(userId);

    return res.status(200).json({
      success: true,
      trips,
    });
  } catch (err) {
    return next(err);
  }
}

async function getTrip(req, res, next) {
  try {
    const userId = req.user?.id;
    const { tripId } = req.params;
    const trip = await tripService.getTripById(userId, tripId);

    return res.status(200).json({
      success: true,
      trip,
    });
  } catch (err) {
    return next(err);
  }
}

async function updateTrip(req, res, next) {
  try {
    const userId = req.user?.id;
    const { tripId } = req.params;
    const trip = await tripService.updateTrip(userId, tripId, req.body);

    return res.status(200).json({
      success: true,
      message: 'Trip updated successfully',
      trip,
    });
  } catch (err) {
    return next(err);
  }
}

async function deleteTrip(req, res, next) {
  try {
    const userId = req.user?.id;
    const { tripId } = req.params;
    await tripService.deleteTrip(userId, tripId);

    return res.status(200).json({
      success: true,
      message: 'Trip deleted successfully',
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createTrip,
  getMyTrips,
  getTrip,
  updateTrip,
  deleteTrip,
};
