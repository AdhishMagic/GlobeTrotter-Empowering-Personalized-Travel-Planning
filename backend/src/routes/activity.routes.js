const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const activityController = require('../controllers/activity.controller');

const router = express.Router({ mergeParams: true });

// All activity APIs require JWT auth
router.use(authMiddleware);

// City-level activities
router.post('/', activityController.addActivity);
router.get('/', activityController.getActivitiesForCity);
router.put('/:activityId', activityController.updateActivity);
router.delete('/:activityId', activityController.deleteActivity);

module.exports = router;
