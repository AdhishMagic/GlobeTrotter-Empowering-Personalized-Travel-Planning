import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const BudgetIntegrationWidget = ({ isExpanded = false, onToggle }) => {
  const [budgetData] = useState({
    totalBudget: 5000,
    spent: 2350,
    remaining: 2650,
    categories: [
      { name: 'Accommodation', spent: 1200, budget: 2000 },
      { name: 'Activities', spent: 650, budget: 1500 },
      { name: 'Food', spent: 500, budget: 1000 }
    ]
  });

  const spentPercentage = (budgetData?.spent / budgetData?.totalBudget) * 100;

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 right-6 z-200 lg:bottom-auto lg:top-24 lg:right-6">
        <button
          onClick={onToggle}
          className="bg-card shadow-lg rounded-full p-4 hover-lift transition-base focus-ring border border-border"
          aria-label="Open budget widget"
        >
          <Icon name="Wallet" size={24} color="var(--color-primary)" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-200 lg:fixed lg:top-24 lg:right-6 lg:bottom-auto lg:w-80 animate-slide-up">
      <div className="bg-card shadow-xl rounded-t-2xl lg:rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Wallet" size={20} color="var(--color-primary)" />
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Budget Tracker
            </h3>
          </div>
          <button
            onClick={onToggle}
            className="p-1 rounded-lg hover:bg-muted transition-base focus-ring"
            aria-label="Close budget widget"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-caption text-muted-foreground">Total Budget</span>
              <span className="font-data font-semibold text-xl text-foreground">
                ${budgetData?.totalBudget?.toLocaleString()}
              </span>
            </div>
            
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-500 rounded-full"
                style={{ width: `${spentPercentage}%` }}
              />
            </div>

            <div className="flex justify-between text-sm">
              <div>
                <span className="text-muted-foreground">Spent: </span>
                <span className="font-data font-medium text-foreground">
                  ${budgetData?.spent?.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Remaining: </span>
                <span className="font-data font-medium text-success">
                  ${budgetData?.remaining?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-border">
            <h4 className="font-caption font-semibold text-sm text-foreground">
              By Category
            </h4>
            {budgetData?.categories?.map((category, index) => {
              const categoryPercentage = (category?.spent / category?.budget) * 100;
              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">{category?.name}</span>
                    <span className="font-data text-muted-foreground">
                      ${category?.spent} / ${category?.budget}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        categoryPercentage > 80 ? 'bg-warning' : 'bg-secondary'
                      }`}
                      style={{ width: `${categoryPercentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <Button 
            variant="outline" 
            fullWidth
            iconName="ExternalLink"
            iconPosition="right"
            onClick={() => window.location.href = '/budget-summary'}
          >
            View Full Budget
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BudgetIntegrationWidget;