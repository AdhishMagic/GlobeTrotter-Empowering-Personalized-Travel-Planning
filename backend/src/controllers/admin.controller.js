const adminService = require('../services/admin.service');

async function overview(req, res, next) {
  try {
    const metrics = await adminService.getOverview();

    return res.status(200).json({
      success: true,
      metrics,
    });
  } catch (err) {
    return next(err);
  }
}

async function popularCities(req, res, next) {
  try {
    const { limit } = req.query;
    const cities = await adminService.getPopularCities(limit);

    return res.status(200).json({
      success: true,
      cities,
    });
  } catch (err) {
    return next(err);
  }
}

async function engagement(req, res, next) {
  try {
    const { limit } = req.query;
    const data = await adminService.getEngagement(limit);

    return res.status(200).json({
      success: true,
      tripsPerUser: data.tripsPerUser,
      averageActivitiesPerTrip: data.averageActivitiesPerTrip,
      mostActiveUsers: data.mostActiveUsers,
    });
  } catch (err) {
    return next(err);
  }
}

async function systemHealth(req, res, next) {
  try {
    const health = await adminService.getSystemHealth();

    return res.status(200).json({
      success: true,
      health,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  overview,
  popularCities,
  engagement,
  systemHealth,
};
