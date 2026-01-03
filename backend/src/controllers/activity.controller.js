const activityService = require('../services/activity.service');

async function addActivity(req, res, next) {
  try {
    const userId = req.user?.id;
    const { tripId, cityId } = req.params;

    const activity = await activityService.addActivity(userId, tripId, cityId, req.body);

    return res.status(201).json({
      success: true,
      message: 'Activity added successfully',
      activity: {
        id: activity.id,
        activityName: activity.activityName,
        cost: activity.cost,
      },
    });
  } catch (err) {
    return next(err);
  }
}

async function getActivitiesForCity(req, res, next) {
  try {
    const userId = req.user?.id;
    const { tripId, cityId } = req.params;

    const activities = await activityService.getActivitiesForCity(userId, tripId, cityId);

    return res.status(200).json({
      success: true,
      activities,
    });
  } catch (err) {
    return next(err);
  }
}

async function updateActivity(req, res, next) {
  try {
    const userId = req.user?.id;
    const { tripId, cityId, activityId } = req.params;

    const activity = await activityService.updateActivity(
      userId,
      tripId,
      cityId,
      activityId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: 'Activity updated successfully',
      activity,
    });
  } catch (err) {
    return next(err);
  }
}

async function deleteActivity(req, res, next) {
  try {
    const userId = req.user?.id;
    const { tripId, cityId, activityId } = req.params;

    await activityService.deleteActivity(userId, tripId, cityId, activityId);

    return res.status(200).json({
      success: true,
      message: 'Activity deleted successfully',
    });
  } catch (err) {
    return next(err);
  }
}

async function getActivitiesForTrip(req, res, next) {
  try {
    const userId = req.user?.id;
    const { tripId } = req.params;

    const activities = await activityService.getActivitiesForTrip(userId, tripId);

    return res.status(200).json({
      success: true,
      activities,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  addActivity,
  getActivitiesForCity,
  updateActivity,
  deleteActivity,
  getActivitiesForTrip,
};
