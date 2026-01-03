const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const tripController = require('../controllers/trip.controller');

const router = express.Router();

// All trip APIs require JWT auth
router.use(authMiddleware);

router.post('/', tripController.createTrip);
router.get('/', tripController.getMyTrips);
router.get('/:tripId', tripController.getTrip);
router.put('/:tripId', tripController.updateTrip);
router.delete('/:tripId', tripController.deleteTrip);

module.exports = router;
