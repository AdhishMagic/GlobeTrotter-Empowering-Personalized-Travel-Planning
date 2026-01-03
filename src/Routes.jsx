import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import LandingPage from './pages/landing-page';
import AddCities from './pages/add-cities';
import ActivitySearch from './pages/activity-search';
import Dashboard from './pages/dashboard';
import BudgetSummary from './pages/budget-summary';
import CreateNewTrip from './pages/create-new-trip';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/add-cities" element={<AddCities />} />
        <Route path="/activity-search" element={<ActivitySearch />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/budget-summary" element={<BudgetSummary />} />
        <Route path="/create-new-trip" element={<CreateNewTrip />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
