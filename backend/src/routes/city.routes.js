const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const cityController = require('../controllers/city.controller');

const router = express.Router({ mergeParams: true });

// All city APIs require JWT auth
router.use(authMiddleware);

router.post('/', cityController.addCity);
router.get('/', cityController.getCities);

// Important: define reorder before :cityId
router.put('/reorder', cityController.reorderCities);
router.put('/:cityId', cityController.updateCity);
router.delete('/:cityId', cityController.deleteCity);

module.exports = router;
