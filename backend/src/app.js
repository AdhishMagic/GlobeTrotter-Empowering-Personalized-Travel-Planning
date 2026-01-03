require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const tripRoutes = require('./routes/trip.routes');
const cityRoutes = require('./routes/city.routes');
const activityRoutes = require('./routes/activity.routes');
const tripActivityRoutes = require('./routes/trip-activity.routes');
const itineraryRoutes = require('./routes/itinerary.routes');
const budgetRoutes = require('./routes/budget.routes');
const calendarRoutes = require('./routes/calendar.routes');
const timelineRoutes = require('./routes/timeline.routes');
const shareRoutes = require('./routes/share.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  return res.status(200).json({ success: true, message: 'OK' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/trips/:tripId/cities', cityRoutes);
app.use('/api/trips/:tripId/cities/:cityId/activities', activityRoutes);
app.use('/api/trips/:tripId/activities', tripActivityRoutes);
app.use('/api/trips/:tripId/itinerary', itineraryRoutes);
app.use('/api/trips/:tripId/budget', budgetRoutes);
app.use('/api/trips/:tripId/calendar', calendarRoutes);
app.use('/api/trips/:tripId/timeline', timelineRoutes);
app.use('/api/trips/:tripId/share', shareRoutes.tripShareRouter);
app.use('/api/shared', shareRoutes.sharedRouter);
app.use('/api/trips/public', shareRoutes.publicTripsRouter);

// 404
app.use((req, res) => {
  return res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-unused-vars
  const _next = next;

  // Translate common Postgres/config errors into user-facing messages.
  if (err && !err.status) {
    // Postgres error codes: https://www.postgresql.org/docs/current/errcodes-appendix.html
    if (err.code === '23505') {
      err.status = 409;
      err.expose = true;
      if (err.constraint === 'users_email_key') {
        err.message = 'Email already exists';
      } else {
        err.message = 'Duplicate value';
      }
    }

    if (err.code === '42P01') {
      err.status = 500;
      err.expose = true;
      err.message = 'Database schema not initialized. Run backend/src/db/schema.sql';
    }

    if (err.code === '3D000') {
      err.status = 500;
      err.expose = true;
      err.message = 'Database does not exist. Create the database specified in DATABASE_URL.';
    }

    if (err.code === '28P01') {
      err.status = 500;
      err.expose = true;
      err.message = 'Database authentication failed. Check DATABASE_URL username/password.';
    }

    if (err.code === 'ECONNREFUSED') {
      err.status = 500;
      err.expose = true;
      err.message = 'Cannot connect to PostgreSQL. Ensure Postgres is running and DATABASE_URL is correct.';
    }

    if (err.code === 'ENOTFOUND' || err.code === 'EAI_AGAIN') {
      err.status = 500;
      err.expose = true;
      err.message = 'Cannot resolve PostgreSQL host from DATABASE_URL.';
    }
  }

  const status = Number.isInteger(err.status) ? err.status : 500;
  const message = err.expose ? err.message : 'Internal server error';

  // eslint-disable-next-line no-console
  console.error(err);

  return res.status(status).json({ success: false, message });
});

module.exports = app;
