const itineraryService = require('../services/itinerary.service');

async function getDaywise(req, res, next) {
  try {
    const userId = req.user?.id;
    const { tripId } = req.params;

    const itinerary = await itineraryService.getDaywiseItinerary(userId, tripId);

    return res.status(200).json({
      success: true,
      tripId,
      itinerary,
    });
  } catch (err) {
    return next(err);
  }
}

async function getCitywise(req, res, next) {
  try {
    const userId = req.user?.id;
    const { tripId } = req.params;

    const cities = await itineraryService.getCitywiseItinerary(userId, tripId);

    return res.status(200).json({
      success: true,
      tripId,
      cities,
    });
  } catch (err) {
    return next(err);
  }
}

async function getFull(req, res, next) {
  try {
    const userId = req.user?.id;
    const { tripId } = req.params;

    const full = await itineraryService.getFullItinerary(userId, tripId);

    return res.status(200).json({
      success: true,
      tripId,
      ...full,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getDaywise,
  getCitywise,
  getFull,
};
