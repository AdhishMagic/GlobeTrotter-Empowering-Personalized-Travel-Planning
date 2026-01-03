import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BudgetIntegrationWidget from '../../components/ui/BudgetIntegrationWidget';
import BudgetOverviewCard from './components/BudgetOverviewCard';
import CategoryBreakdownChart from './components/CategoryBreakdownChart';
import CityBudgetCard from './components/CityBudgetCard';
import ExpenseTable from './components/ExpenseTable';
import BudgetGoalsCard from './components/BudgetGoalsCard';
import ExportOptionsCard from './components/ExportOptionsCard';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const BudgetSummary = () => {
  const navigate = useNavigate();
  const [isBudgetWidgetExpanded, setIsBudgetWidgetExpanded] = useState(false);

  const budgetData = {
    totalBudget: 8500,
    totalSpent: 6850,
    remaining: 1650,
    currency: 'USD'
  };

  const categoryData = [
    { name: 'Stay', spent: 2800, budget: 3500 },
    { name: 'Transport', spent: 1500, budget: 2000 },
    { name: 'Activities', spent: 1850, budget: 2000 },
    { name: 'Food', spent: 600, budget: 800 },
    { name: 'Miscellaneous', spent: 100, budget: 200 }
  ];

  const cityBudgets = [
    { city: 'Paris', estimated: 3000, actual: 2850 },
    { city: 'Rome', estimated: 2500, actual: 2700 },
    { city: 'Barcelona', estimated: 3000, actual: 1300 }
  ];

  const expenses = [
    {
      id: 1,
      name: 'Hotel Le Marais',
      category: 'Stay',
      city: 'Paris',
      date: '2026-01-15',
      amount: 1200
    },
    {
      id: 2,
      name: 'Eiffel Tower Tour',
      category: 'Activities',
      city: 'Paris',
      date: '2026-01-16',
      amount: 85
    },
    {
      id: 3,
      name: 'Train to Rome',
      category: 'Transport',
      city: 'Paris',
      date: '2026-01-18',
      amount: 450
    },
    {
      id: 4,
      name: 'Colosseum Apartment',
      category: 'Stay',
      city: 'Rome',
      date: '2026-01-19',
      amount: 900
    },
    {
      id: 5,
      name: 'Vatican Museums',
      category: 'Activities',
      city: 'Rome',
      date: '2026-01-20',
      amount: 120
    },
    {
      id: 6,
      name: 'Roman Food Tour',
      category: 'Food',
      city: 'Rome',
      date: '2026-01-21',
      amount: 180
    },
    {
      id: 7,
      name: 'Flight to Barcelona',
      category: 'Transport',
      city: 'Rome',
      date: '2026-01-22',
      amount: 350
    },
    {
      id: 8,
      name: 'Gothic Quarter Hotel',
      category: 'Stay',
      city: 'Barcelona',
      date: '2026-01-23',
      amount: 700
    },
    {
      id: 9,
      name: 'Sagrada Familia Tickets',
      category: 'Activities',
      city: 'Barcelona',
      date: '2026-01-24',
      amount: 95
    },
    {
      id: 10,
      name: 'Park Güell Entry',
      category: 'Activities',
      city: 'Barcelona',
      date: '2026-01-25',
      amount: 65
    },
    {
      id: 11,
      name: 'Tapas Dinner',
      category: 'Food',
      city: 'Barcelona',
      date: '2026-01-25',
      amount: 120
    },
    {
      id: 12,
      name: 'Airport Transfer',
      category: 'Transport',
      city: 'Barcelona',
      date: '2026-01-26',
      amount: 45
    }
  ];

  const budgetGoals = [
    {
      name: 'Daily Spending Limit',
      description: 'Stay within $200 per day average',
      current: 180,
      target: 200,
      recommendation: 'Great job! You are maintaining your daily budget effectively'
    },
    {
      name: 'Accommodation Budget',
      description: 'Keep lodging costs under 40% of total',
      current: 2800,
      target: 3400,
      recommendation: 'Consider booking accommodations in advance for better rates'
    },
    {
      name: 'Activity Spending',
      description: 'Allocate sufficient funds for experiences',
      current: 1850,
      target: 2000,
      recommendation: 'You have $150 remaining for additional activities'
    }
  ];

  const handleEditExpense = (expense) => {
    console.log('Edit expense:', expense);
  };

  const handleDeleteExpense = (expenseId) => {
    console.log('Delete expense:', expenseId);
  };

  const handleExport = async (format) => {
    console.log('Exporting budget report as:', format);
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-2">
                Budget Summary
              </h1>
              <p className="text-base md:text-lg text-muted-foreground font-caption">
                Track and manage your travel expenses across all destinations
              </p>
            </div>
            <Button
              variant="outline"
              iconName="ArrowLeft"
              iconPosition="left"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>

          <BudgetOverviewCard
            totalBudget={budgetData?.totalBudget}
            totalSpent={budgetData?.totalSpent}
            remaining={budgetData?.remaining}
            currency={budgetData?.currency}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <CategoryBreakdownChart
              categories={categoryData}
              currency={budgetData?.currency}
            />
            <BudgetGoalsCard
              goals={budgetGoals}
              currency={budgetData?.currency}
            />
          </div>

          <div>
            <h2 className="font-heading font-semibold text-2xl md:text-3xl text-foreground mb-4 md:mb-6">
              Budget by City
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {cityBudgets?.map((city, index) => (
                <CityBudgetCard
                  key={index}
                  city={city?.city}
                  estimated={city?.estimated}
                  actual={city?.actual}
                  currency={budgetData?.currency}
                />
              ))}
            </div>
          </div>

          <ExpenseTable
            expenses={expenses}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
            currency={budgetData?.currency}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg p-6 md:p-8 shadow-md border border-border">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-accent/10 rounded-lg p-2">
                    <Icon name="TrendingUp" size={24} color="var(--color-accent)" />
                  </div>
                  <h2 className="font-heading font-semibold text-xl md:text-2xl text-foreground">
                    Cost Optimization Tips
                  </h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                    <Icon name="CheckCircle2" size={20} color="var(--color-success)" className="mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground font-caption">
                      Book accommodations at least 2 weeks in advance to save up to 25% on lodging costs
                    </p>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                    <Icon name="CheckCircle2" size={20} color="var(--color-success)" className="mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground font-caption">
                      Consider purchasing city passes for multiple attractions to reduce activity expenses by 15-30%
                    </p>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                    <Icon name="CheckCircle2" size={20} color="var(--color-success)" className="mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground font-caption">
                      Use public transportation instead of taxis to save approximately $50-100 per city
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <ExportOptionsCard onExport={handleExport} />
          </div>
        </div>
      </main>
      <BudgetIntegrationWidget
        isExpanded={isBudgetWidgetExpanded}
        onToggle={() => setIsBudgetWidgetExpanded(!isBudgetWidgetExpanded)}
      />
    </div>
  );
};

export default BudgetSummary;