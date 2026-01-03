const express = require('express');
const adminMiddleware = require('../middlewares/admin.middleware');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

// Admin-only routes (JWT + role check)
router.use(adminMiddleware);

router.get('/overview', adminController.overview);
router.get('/popular-cities', adminController.popularCities);
router.get('/engagement', adminController.engagement);
router.get('/system-health', adminController.systemHealth);

module.exports = router;
