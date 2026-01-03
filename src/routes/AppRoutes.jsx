import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "pages/Landing/Landing";
import Login from "pages/Auth/Login";
import Register from "pages/Auth/Register";
import Dashboard from "pages/Dashboard/Dashboard";
import CreateTrip from "pages/Trips/CreateTrip";
import AddCities from "pages/Trips/AddCities";
import ActivitySearch from "pages/Trips/ActivitySearch";
import Itinerary from "pages/Trips/Itinerary";
import Budget from "pages/Trips/Budget";
import Calendar from "pages/Trips/Calendar";
import Community from "pages/Community/Community";
import Profile from "pages/Profile/Profile";
import NotFound from "pages/NotFound";

import ProtectedRoute from "components/common/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trip/create" element={<CreateTrip />} />
        <Route path="/trip/:id/cities" element={<AddCities />} />
        <Route path="/trip/:id/activities" element={<ActivitySearch />} />
        <Route path="/trip/:id/itinerary" element={<Itinerary />} />
        <Route path="/trip/:id/budget" element={<Budget />} />
        <Route path="/trip/:id/calendar" element={<Calendar />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />

        {/* Backwards-compatible routes (existing links) */}
        <Route path="/create-new-trip" element={<Navigate to="/trip/create" replace />} />
        <Route path="/budget-summary" element={<Navigate to="/trip/trip-1/budget" replace />} />
        <Route path="/add-cities" element={<Navigate to="/trip/trip-1/cities" replace />} />
        <Route path="/activity-search" element={<Navigate to="/trip/trip-1/activities" replace />} />
        <Route path="/landing-page" element={<Navigate to="/" replace />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
