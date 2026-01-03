-- GlobeTrotter: Auth schema
-- Run this against your PostgreSQL database (DATABASE_URL)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  name VARCHAR,
  email VARCHAR NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  profile_photo TEXT,
  language VARCHAR NOT NULL DEFAULT 'en',
  timezone VARCHAR,
  role VARCHAR NOT NULL DEFAULT 'user',
  phone VARCHAR,
  country VARCHAR,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- User profile/settings fields (Step 9)
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS name VARCHAR,
  ADD COLUMN IF NOT EXISTS profile_photo TEXT,
  ADD COLUMN IF NOT EXISTS language VARCHAR NOT NULL DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS timezone VARCHAR,
  ADD COLUMN IF NOT EXISTS role VARCHAR NOT NULL DEFAULT 'user';

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Trips
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trip_name VARCHAR NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  cover_image TEXT,
  status VARCHAR NOT NULL DEFAULT 'upcoming',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT trips_status_check CHECK (status IN ('upcoming', 'ongoing', 'completed')),
  CONSTRAINT trips_dates_check CHECK (start_date <= end_date)
);

-- Trip budget fields (Step 6)
ALTER TABLE trips
  ADD COLUMN IF NOT EXISTS budget_total NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS currency VARCHAR NOT NULL DEFAULT 'USD';

-- Trip sharing fields (Step 8)
ALTER TABLE trips
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS share_token VARCHAR UNIQUE;

CREATE INDEX IF NOT EXISTS idx_trips_public ON trips(is_public) WHERE is_public = TRUE;

-- Trip cities (stops)
CREATE TABLE IF NOT EXISTS trip_cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  city_name VARCHAR NOT NULL,
  country VARCHAR NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT trip_cities_dates_check CHECK (start_date <= end_date),
  CONSTRAINT trip_cities_order_check CHECK (order_index >= 1),
  CONSTRAINT trip_cities_trip_order_unique UNIQUE (trip_id, order_index)
);

-- Activities
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  city_id UUID NOT NULL REFERENCES trip_cities(id) ON DELETE CASCADE,
  activity_name VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  activity_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT activities_category_check CHECK (category IN ('sightseeing', 'food', 'travel', 'stay', 'other')),
  CONSTRAINT activities_cost_check CHECK (cost >= 0),
  CONSTRAINT activities_time_check CHECK (start_time IS NULL OR end_time IS NULL OR start_time < end_time)
);

CREATE INDEX IF NOT EXISTS idx_activities_trip_id ON activities(trip_id);
CREATE INDEX IF NOT EXISTS idx_activities_city_id ON activities(city_id);
CREATE INDEX IF NOT EXISTS idx_activities_city_date_time ON activities(city_id, activity_date, start_time);
CREATE INDEX IF NOT EXISTS idx_activities_trip_category ON activities(trip_id, category);
CREATE INDEX IF NOT EXISTS idx_activities_trip_date ON activities(trip_id, activity_date);

CREATE INDEX IF NOT EXISTS idx_trip_cities_trip_id ON trip_cities(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_cities_trip_order ON trip_cities(trip_id, order_index);

CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_user_start_date ON trips(user_id, start_date);

-- Keep updated_at current on updates
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_trips_updated_at ON trips;
CREATE TRIGGER trg_trips_updated_at
BEFORE UPDATE ON trips
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_trip_cities_updated_at ON trip_cities;
CREATE TRIGGER trg_trip_cities_updated_at
BEFORE UPDATE ON trip_cities
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_activities_updated_at ON activities;
CREATE TRIGGER trg_activities_updated_at
BEFORE UPDATE ON activities
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
