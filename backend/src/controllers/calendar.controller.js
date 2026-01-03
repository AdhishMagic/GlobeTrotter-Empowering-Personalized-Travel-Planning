const calendarService = require('../services/calendar.service');

async function getMonthly(req, res, next) {
  try {
    const userId = req.user?.id;
    const { tripId } = req.params;
    const { month, year } = req.query;

    const calendar = await calendarService.getMonthlyCalendar(userId, tripId, month, year);

    return res.status(200).json({
      success: true,
      tripId: calendar.tripId,
      month: calendar.month,
      year: calendar.year,
      days: calendar.days,
    });
  } catch (err) {
    return next(err);
  }
}

async function getDay(req, res, next) {
  try {
    const userId = req.user?.id;
    const { tripId } = req.params;
    const { date } = req.query;

    const timeline = await calendarService.getDayTimeline(userId, tripId, date);

    return res.status(200).json({
      success: true,
      tripId: timeline.tripId,
      date: timeline.date,
      activities: timeline.activities,
    });
  } catch (err) {
    return next(err);
  }
}

async function getTimeline(req, res, next) {
  try {
    const userId = req.user?.id;
    const { tripId } = req.params;
    const { startDate, endDate } = req.query;

    const range = await calendarService.getTimelineRange(userId, tripId, startDate, endDate);

    return res.status(200).json({
      success: true,
      tripId: range.tripId,
      startDate: range.startDate,
      endDate: range.endDate,
      activities: range.activities,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getMonthly,
  getDay,
  getTimeline,
};
