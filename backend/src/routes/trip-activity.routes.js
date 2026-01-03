const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const activityController = require('../controllers/activity.controller');

const router = express.Router({ mergeParams: true });

router.use(authMiddleware);

// Trip-level activities (useful for itinerary/budget)
router.get('/', activityController.getActivitiesForTrip);

module.exports = router;
