import React from 'react';
import Icon from '../../../components/AppIcon';

const BudgetOverviewCard = ({ totalBudget, totalSpent, remaining, currency = 'USD' }) => {
  const spentPercentage = (totalSpent / totalBudget) * 100;
  const isOverBudget = totalSpent > totalBudget;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  return (
    <div className="bg-card rounded-lg p-6 md:p-8 shadow-md border border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-semibold text-2xl md:text-3xl text-foreground">
          Budget Overview
        </h2>
        <div className="bg-primary/10 rounded-lg p-3">
          <Icon name="Wallet" size={28} color="var(--color-primary)" />
        </div>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="space-y-2">
            <p className="text-sm font-caption text-muted-foreground">Total Budget</p>
            <p className="font-data font-bold text-2xl md:text-3xl text-foreground">
              {formatCurrency(totalBudget)}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-caption text-muted-foreground">Total Spent</p>
            <p className={`font-data font-bold text-2xl md:text-3xl ${isOverBudget ? 'text-error' : 'text-foreground'}`}>
              {formatCurrency(totalSpent)}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-caption text-muted-foreground">Remaining</p>
            <p className={`font-data font-bold text-2xl md:text-3xl ${isOverBudget ? 'text-error' : 'text-success'}`}>
              {formatCurrency(remaining)}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="font-caption text-muted-foreground">Budget Utilization</span>
            <span className="font-data font-semibold text-foreground">
              {spentPercentage?.toFixed(1)}%
            </span>
          </div>

          <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                spentPercentage > 100 ? 'bg-error' : spentPercentage > 80 ? 'bg-warning' : 'bg-success'
              }`}
              style={{ width: `${Math.min(spentPercentage, 100)}%` }}
            />
          </div>

          {isOverBudget && (
            <div className="flex items-center space-x-2 p-3 bg-error/10 rounded-lg border border-error/20">
              <Icon name="AlertTriangle" size={20} color="var(--color-error)" />
              <p className="text-sm text-error font-caption">
                You have exceeded your budget by {formatCurrency(Math.abs(remaining))}
              </p>
            </div>
          )}

          {!isOverBudget && spentPercentage > 80 && (
            <div className="flex items-center space-x-2 p-3 bg-warning/10 rounded-lg border border-warning/20">
              <Icon name="AlertCircle" size={20} color="var(--color-warning)" />
              <p className="text-sm text-warning font-caption">
                You are approaching your budget limit
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetOverviewCard;