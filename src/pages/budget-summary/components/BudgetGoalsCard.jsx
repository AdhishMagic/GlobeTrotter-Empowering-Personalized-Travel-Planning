import React from 'react';
import Icon from '../../../components/AppIcon';

const BudgetGoalsCard = ({ goals, currency = 'USD' }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const getGoalStatus = (current, target) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) return { status: 'achieved', color: 'success', icon: 'CheckCircle2' };
    if (percentage >= 80) return { status: 'on-track', color: 'warning', icon: 'TrendingUp' };
    return { status: 'needs-attention', color: 'error', icon: 'AlertCircle' };
  };

  return (
    <div className="bg-card rounded-lg p-6 md:p-8 shadow-md border border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-semibold text-xl md:text-2xl text-foreground">
          Budget Goals
        </h2>
        <div className="bg-accent/10 rounded-lg p-3">
          <Icon name="Target" size={24} color="var(--color-accent)" />
        </div>
      </div>
      <div className="space-y-4">
        {goals?.map((goal, index) => {
          const progress = (goal?.current / goal?.target) * 100;
          const goalStatus = getGoalStatus(goal?.current, goal?.target);

          return (
            <div key={index} className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon 
                      name={goalStatus?.icon} 
                      size={18} 
                      color={`var(--color-${goalStatus?.color})`} 
                    />
                    <h3 className="font-caption font-semibold text-foreground">
                      {goal?.name}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground font-caption">
                    {goal?.description}
                  </p>
                </div>
                <span className={`text-xs font-data font-semibold px-2 py-1 rounded-full bg-${goalStatus?.color}/10 text-${goalStatus?.color}`}>
                  {progress?.toFixed(0)}%
                </span>
              </div>
              <div className="space-y-2">
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full bg-${goalStatus?.color}`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs">
                  <span className="font-data text-muted-foreground">
                    Current: {formatCurrency(goal?.current)}
                  </span>
                  <span className="font-data text-muted-foreground">
                    Target: {formatCurrency(goal?.target)}
                  </span>
                </div>
              </div>
              {goal?.recommendation && (
                <div className="flex items-start space-x-2 p-2 bg-background rounded border border-border">
                  <Icon name="Lightbulb" size={16} color="var(--color-accent)" className="mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground font-caption">
                    {goal?.recommendation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetGoalsCard;