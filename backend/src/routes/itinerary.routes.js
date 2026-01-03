const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const itineraryController = require('../controllers/itinerary.controller');

const router = express.Router({ mergeParams: true });

router.use(authMiddleware);

router.get('/daywise', itineraryController.getDaywise);
router.get('/citywise', itineraryController.getCitywise);

// Optional combined itinerary
router.get('/', itineraryController.getFull);

module.exports = router;
