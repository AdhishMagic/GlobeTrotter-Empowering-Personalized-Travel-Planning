const shareService = require('../services/share.service');

async function setSharing(req, res, next) {
  try {
    const userId = req.user?.id;
    const { tripId } = req.params;
    const isPublic = req.body?.isPublic;

    const result = await shareService.setTripSharing(userId, tripId, isPublic);

    return res.status(200).json({
      success: true,
      shareUrl: result.shareUrl,
      shareToken: result.shareToken,
    });
  } catch (err) {
    return next(err);
  }
}

async function viewSharedTrip(req, res, next) {
  try {
    const { shareToken } = req.params;

    const data = await shareService.getSharedTripByToken(shareToken);

    return res.status(200).json({
      success: true,
      trip: data.trip,
      cities: data.cities,
      activities: data.activities,
      itinerary: data.itinerary,
    });
  } catch (err) {
    return next(err);
  }
}

async function copySharedTrip(req, res, next) {
  try {
    const userId = req.user?.id;
    const { shareToken } = req.params;

    const result = await shareService.copySharedTripToUser(userId, shareToken);

    return res.status(201).json({
      success: true,
      message: 'Trip copied successfully',
      newTripId: result.newTripId,
    });
  } catch (err) {
    return next(err);
  }
}

async function listPublicTrips(req, res, next) {
  try {
    const { limit } = req.query;
    const trips = await shareService.listPublicTrips(limit);

    return res.status(200).json({
      success: true,
      trips,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  setSharing,
  viewSharedTrip,
  copySharedTrip,
  listPublicTrips,
};
