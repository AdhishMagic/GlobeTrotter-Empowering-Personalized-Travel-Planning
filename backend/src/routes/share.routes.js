const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const shareController = require('../controllers/share.controller');

// Owner-only sharing toggle
const tripShareRouter = express.Router({ mergeParams: true });
tripShareRouter.use(authMiddleware);
tripShareRouter.put('/', shareController.setSharing);

// Public shared trip view + authenticated copy
const sharedRouter = express.Router({ mergeParams: true });
sharedRouter.get('/:shareToken', shareController.viewSharedTrip);
sharedRouter.post('/:shareToken/copy', authMiddleware, shareController.copySharedTrip);

// Optional public listing
const publicTripsRouter = express.Router();
publicTripsRouter.get('/', shareController.listPublicTrips);

module.exports = {
  tripShareRouter,
  sharedRouter,
  publicTripsRouter,
};
