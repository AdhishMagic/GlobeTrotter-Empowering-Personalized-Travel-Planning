const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const calendarController = require('../controllers/calendar.controller');

const router = express.Router({ mergeParams: true });

router.use(authMiddleware);

router.get('/', calendarController.getTimeline);

module.exports = router;
