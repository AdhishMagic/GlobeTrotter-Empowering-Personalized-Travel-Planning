import React, { useState } from 'react';
import DashboardQuickActions from '../../components/ui/DashboardQuickActions';
import BudgetIntegrationWidget from '../../components/ui/BudgetIntegrationWidget';
import WelcomeSection from './components/WelcomeSection';
import SummaryCard from './components/SummaryCard';
import TripSection from './components/TripSection';
import RecentActivityFeed from './components/RecentActivityFeed';
import SuggestedDestinations from './components/SuggestedDestinations';
import BudgetAlerts from './components/BudgetAlerts';

const Dashboard = () => {
  const [isBudgetWidgetOpen, setIsBudgetWidgetOpen] = useState(false);

  const mockUser = {
    name: "Sarah Johnson"
  };

  const mockSummaryData = {
    totalTrips: 12,
    upcomingTrips: 3,
    totalBudget: 15750,
    budgetSpent: 8420
  };

  const mockOngoingTrips = [
  {
    id: 1,
    name: "European Adventure",
    description: "Exploring the historic cities and cultural landmarks across Western Europe with family",
    image: "https://images.unsplash.com/photo-1596729667954-53eda7509d96",
    imageAlt: "Aerial view of Paris cityscape with Eiffel Tower prominently visible among historic buildings and Seine River",
    cities: 4,
    duration: "14 days",
    budget: 5200,
    status: "ongoing",
    startDate: "2025-12-28",
    endDate: "2026-01-10"
  }];


  const mockUpcomingTrips = [
  {
    id: 2,
    name: "Tokyo Spring Festival",
    description: "Experience cherry blossom season and traditional Japanese culture in Tokyo and Kyoto",
    image: "https://images.unsplash.com/photo-1557409362-fb339d4a0cf5",
    imageAlt: "Traditional Japanese temple with red pagoda surrounded by pink cherry blossom trees in full bloom",
    cities: 2,
    duration: "10 days",
    budget: 4500,
    status: "upcoming",
    startDate: "2026-03-15",
    endDate: "2026-03-25"
  },
  {
    id: 3,
    name: "Australian Coastal Road Trip",
    description: "Drive along the Great Ocean Road and explore Sydney\'s iconic landmarks and beaches",
    image: "https://images.unsplash.com/photo-1671947975681-6bf1c322ee9d",
    imageAlt: "Sydney Opera House with distinctive white shell-shaped roof against blue harbor waters and clear sky",
    cities: 3,
    duration: "12 days",
    budget: 6050,
    status: "upcoming",
    startDate: "2026-05-20",
    endDate: "2026-06-01"
  }];


  const mockCompletedTrips = [
  {
    id: 4,
    name: "Bali Wellness Retreat",
    description: "Relaxing yoga retreat in Ubud with temple visits and traditional Balinese experiences",
    image: "https://images.unsplash.com/photo-1493813977327-6c0ada775232",
    imageAlt: "Traditional Balinese temple with ornate stone carvings and tropical palm trees in lush green setting",
    cities: 2,
    duration: "7 days",
    budget: 2800,
    status: "completed",
    startDate: "2025-11-10",
    endDate: "2025-11-17"
  },
  {
    id: 5,
    name: "New York City Explorer",
    description: "Urban adventure through Manhattan's museums, Broadway shows, and iconic neighborhoods",
    image: "https://images.unsplash.com/photo-1642266119576-0ee669a08706",
    imageAlt: "New York City skyline at sunset with Empire State Building and skyscrapers reflecting golden light",
    cities: 1,
    duration: "5 days",
    budget: 3200,
    status: "completed",
    startDate: "2025-09-05",
    endDate: "2025-09-10"
  }];


  const mockRecentActivities = [
  {
    id: 1,
    type: "trip_created",
    description: "Created new trip \'Tokyo Spring Festival\' with 2 cities",
    timestamp: new Date(Date.now() - 1800000)
  },
  {
    id: 2,
    type: "city_added",
    description: "Added Kyoto to \'Tokyo Spring Festival\' itinerary",
    timestamp: new Date(Date.now() - 3600000)
  },
  {
    id: 3,
    type: "activity_added",
    description: "Added \'Cherry Blossom Viewing\' to Tokyo schedule",
    timestamp: new Date(Date.now() - 7200000)
  },
  {
    id: 4,
    type: "budget_updated",
    description: "Updated budget for 'European Adventure' to $5,200",
    timestamp: new Date(Date.now() - 86400000)
  },
  {
    id: 5,
    type: "trip_shared",
    description: "Shared \'Bali Wellness Retreat\' with the community",
    timestamp: new Date(Date.now() - 172800000)
  }];


  const mockSuggestedDestinations = [
  {
    id: 1,
    name: "Santorini",
    country: "Greece",
    image: "https://images.unsplash.com/photo-1662121783914-9ee843f21504",
    imageAlt: "White-washed buildings with blue domed roofs overlooking azure Aegean Sea in Santorini Greece",
    rating: 4.8,
    attractions: 45
  },
  {
    id: 2,
    name: "Dubai",
    country: "United Arab Emirates",
    image: "https://images.unsplash.com/photo-1617559057121-5ccad3b7571b",
    imageAlt: "Dubai skyline at night with illuminated Burj Khalifa tower and modern skyscrapers reflecting in water",
    rating: 4.7,
    attractions: 78
  },
  {
    id: 3,
    name: "Reykjavik",
    country: "Iceland",
    image: "https://images.unsplash.com/photo-1567442089877-dddeff132609",
    imageAlt: "Colorful houses along waterfront in Reykjavik with snow-capped mountains in background under dramatic sky",
    rating: 4.6,
    attractions: 32
  }];


  const mockBudgetAlerts = [
  {
    id: 1,
    severity: "high",
    title: "Budget Exceeded",
    message: "European Adventure has exceeded planned budget by $420. Consider reviewing expenses.",
    tripName: "European Adventure"
  },
  {
    id: 2,
    severity: "medium",
    title: "Approaching Budget Limit",
    message: "Tokyo Spring Festival is at 85% of allocated budget with 45 days remaining.",
    tripName: "Tokyo Spring Festival"
  }];


  const budgetSpentPercentage = mockSummaryData?.budgetSpent / mockSummaryData?.totalBudget * 100;

  return (
    <div className="pb-20">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 lg:space-y-10">
          <WelcomeSection userName={mockUser?.name} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <SummaryCard
              title="Total Trips"
              value={mockSummaryData?.totalTrips}
              subtitle="All time"
              icon="Map"
              iconColor="var(--color-primary)"
              bgColor="bg-primary/10"
              trend={{ direction: 'up', value: '+2 this month' }} />

            <SummaryCard
              title="Upcoming Trips"
              value={mockSummaryData?.upcomingTrips}
              subtitle="Next 6 months"
              icon="Calendar"
              iconColor="var(--color-secondary)"
              bgColor="bg-secondary/10" />

            <SummaryCard
              title="Total Budget"
              value={`$${mockSummaryData?.totalBudget?.toLocaleString()}`}
              subtitle={`${budgetSpentPercentage?.toFixed(0)}% spent ($${mockSummaryData?.budgetSpent?.toLocaleString()})`}
              icon="Wallet"
              iconColor="var(--color-accent)"
              bgColor="bg-accent/10" />

          </div>

          <DashboardQuickActions />

          <TripSection
            title="Ongoing Trips"
            trips={mockOngoingTrips}
            icon="Play"
            emptyMessage="No ongoing trips. Start planning your next adventure!" />


          <TripSection
            title="Upcoming Trips"
            trips={mockUpcomingTrips}
            icon="Calendar"
            emptyMessage="No upcoming trips scheduled. Create a new trip to get started!" />


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              <TripSection
                title="Completed Trips"
                trips={mockCompletedTrips}
                icon="CheckCircle2"
                emptyMessage="No completed trips yet. Your travel memories will appear here!" />

            </div>

            <div className="space-y-6">
              <RecentActivityFeed activities={mockRecentActivities} />
              <SuggestedDestinations destinations={mockSuggestedDestinations} />
              <BudgetAlerts alerts={mockBudgetAlerts} />
            </div>
          </div>
      </div>
      <BudgetIntegrationWidget
        isExpanded={isBudgetWidgetOpen}
        onToggle={() => setIsBudgetWidgetOpen(!isBudgetWidgetOpen)} />

    </div>);

};

export default Dashboard;