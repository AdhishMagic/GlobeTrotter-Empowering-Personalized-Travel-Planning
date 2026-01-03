const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const budgetController = require('../controllers/budget.controller');

const router = express.Router({ mergeParams: true });

router.use(authMiddleware);

router.put('/', budgetController.updateBudget);
router.get('/', budgetController.getBudget);
router.get('/daily', budgetController.getDaily);

module.exports = router;
