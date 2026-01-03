const cityService = require('../services/city.service');

async function addCity(req, res, next) {
  try {
    const userId = req.user?.id;
    const { tripId } = req.params;

    const city = await cityService.addCityToTrip(userId, tripId, req.body);

    return res.status(201).json({
      success: true,
      message: 'City added to trip',
      city: {
        id: city.id,
        cityName: city.cityName,
        country: city.country,
        orderIndex: city.orderIndex,
      },
    });
  } catch (err) {
    return next(err);
  }
}

async function getCities(req, res, next) {
  try {
    const userId = req.user?.id;
    const { tripId } = req.params;

    const cities = await cityService.getCitiesForTrip(userId, tripId);

    return res.status(200).json({
      success: true,
      cities,
    });
  } catch (err) {
    return next(err);
  }
}

async function updateCity(req, res, next) {
  try {
    const userId = req.user?.id;
    const { tripId, cityId } = req.params;

    const city = await cityService.updateCity(userId, tripId, cityId, req.body);

    return res.status(200).json({
      success: true,
      message: 'City updated successfully',
      city,
    });
  } catch (err) {
    return next(err);
  }
}

async function reorderCities(req, res, next) {
  try {
    const userId = req.user?.id;
    const { tripId } = req.params;

    await cityService.reorderCities(userId, tripId, req.body?.order);

    return res.status(200).json({
      success: true,
      message: 'Cities reordered successfully',
    });
  } catch (err) {
    return next(err);
  }
}

async function deleteCity(req, res, next) {
  try {
    const userId = req.user?.id;
    const { tripId, cityId } = req.params;

    await cityService.deleteCity(userId, tripId, cityId);

    return res.status(200).json({
      success: true,
      message: 'City deleted successfully',
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  addCity,
  getCities,
  updateCity,
  reorderCities,
  deleteCity,
};
