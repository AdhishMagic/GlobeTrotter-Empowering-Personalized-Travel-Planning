const budgetService = require('../services/budget.service');

async function updateBudget(req, res, next) {
  try {
    const userId = req.user?.id;
    const { tripId } = req.params;

    const budget = await budgetService.updateTripBudget(userId, tripId, req.body || {});

    return res.status(200).json({
      success: true,
      message: 'Budget updated successfully',
      tripId: budget.tripId,
      currency: budget.currency,
      budgetTotal: budget.budgetTotal,
    });
  } catch (err) {
    return next(err);
  }
}

async function getBudget(req, res, next) {
  try {
    const userId = req.user?.id;
    const { tripId } = req.params;

    const summary = await budgetService.getTripBudgetSummary(userId, tripId);

    return res.status(200).json({
      success: true,
      tripId: summary.tripId,
      currency: summary.currency,
      budgetTotal: summary.budgetTotal,
      totalSpent: summary.totalSpent,
      remaining: summary.remaining,
      overBudget: summary.overBudget,
      byCategory: summary.byCategory,
      byCity: summary.byCity,
    });
  } catch (err) {
    return next(err);
  }
}

async function getDaily(req, res, next) {
  try {
    const userId = req.user?.id;
    const { tripId } = req.params;

    const daily = await budgetService.getTripDailyCostBreakdown(userId, tripId);

    return res.status(200).json({
      success: true,
      tripId,
      daily,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  updateBudget,
  getBudget,
  getDaily,
};
