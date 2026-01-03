import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const BudgetAlerts = ({ alerts }) => {
  const navigate = useNavigate();

  const getAlertStyle = (severity) => {
    const styles = {
      high: {
        bg: 'bg-error/10',
        text: 'text-error',
        icon: 'AlertTriangle'
      },
      medium: {
        bg: 'bg-warning/10',
        text: 'text-warning',
        icon: 'AlertCircle'
      },
      low: {
        bg: 'bg-primary/10',
        text: 'text-primary',
        icon: 'Info'
      }
    };
    return styles?.[severity] || styles?.low;
  };

  if (alerts?.length === 0) return null;

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-md border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">
          Budget Alerts
        </h3>
        <Icon name="Bell" size={20} color="var(--color-warning)" />
      </div>
      <div className="space-y-3">
        {alerts?.map((alert) => {
          const style = getAlertStyle(alert?.severity);
          return (
            <div
              key={alert?.id}
              className={`${style?.bg} rounded-lg p-4 transition-base`}
            >
              <div className="flex items-start space-x-3">
                <div className={style?.text}>
                  <Icon name={style?.icon} size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-caption font-semibold ${style?.text} mb-1`}>
                    {alert?.title}
                  </h4>
                  <p className="text-xs text-foreground/80 line-clamp-2">
                    {alert?.message}
                  </p>
                  {alert?.tripName && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Trip: {alert?.tripName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Button
        variant="outline"
        size="sm"
        fullWidth
        iconName="ExternalLink"
        iconPosition="right"
        onClick={() => navigate('/budget-summary')}
        className="mt-4"
      >
        View Budget Details
      </Button>
    </div>
  );
};

export default BudgetAlerts;