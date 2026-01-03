import React from 'react';
import Icon from '../../../components/AppIcon';

const CityBudgetCard = ({ city, estimated, actual, currency = 'USD' }) => {
  const variance = actual - estimated;
  const variancePercentage = ((variance / estimated) * 100)?.toFixed(1);
  const isOverBudget = variance > 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-md border border-border hover-lift transition-base">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 rounded-lg p-2">
            <Icon name="MapPin" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              {city}
            </h3>
            <p className="text-xs font-caption text-muted-foreground">
              Budget Comparison
            </p>
          </div>
        </div>
        {isOverBudget ? (
          <div className="flex items-center space-x-1 px-2 py-1 bg-error/10 rounded-full">
            <Icon name="TrendingUp" size={14} color="var(--color-error)" />
            <span className="text-xs font-data font-semibold text-error">
              +{variancePercentage}%
            </span>
          </div>
        ) : (
          <div className="flex items-center space-x-1 px-2 py-1 bg-success/10 rounded-full">
            <Icon name="TrendingDown" size={14} color="var(--color-success)" />
            <span className="text-xs font-data font-semibold text-success">
              {variancePercentage}%
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-caption text-muted-foreground">Estimated</p>
            <p className="font-data font-semibold text-base md:text-lg text-foreground">
              {formatCurrency(estimated)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-caption text-muted-foreground">Actual</p>
            <p className={`font-data font-semibold text-base md:text-lg ${isOverBudget ? 'text-error' : 'text-success'}`}>
              {formatCurrency(actual)}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-caption text-muted-foreground">Variance</span>
            <span className={`font-data font-semibold ${isOverBudget ? 'text-error' : 'text-success'}`}>
              {isOverBudget ? '+' : ''}{formatCurrency(variance)}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isOverBudget ? 'bg-error' : 'bg-success'
              }`}
              style={{ width: `${Math.min((actual / estimated) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityBudgetCard;