import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const DashboardQuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Create New Trip',
      description: 'Start planning your next adventure',
      icon: 'PlusCircle',
      iconColor: 'var(--color-primary)',
      bgColor: 'bg-primary/10',
      action: () => navigate('/create-new-trip')
    },
    {
      title: 'View Budget',
      description: 'Track your travel expenses',
      icon: 'Wallet',
      iconColor: 'var(--color-secondary)',
      bgColor: 'bg-secondary/10',
      action: () => navigate('/budget-summary')
    },
    {
      title: 'Find Activities',
      description: 'Discover things to do',
      icon: 'Compass',
      iconColor: 'var(--color-accent)',
      bgColor: 'bg-accent/10',
      action: () => navigate('/activity-search')
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {quickActions?.map((action, index) => (
        <div
          key={index}
          className="bg-card rounded-lg p-6 shadow-md hover-lift cursor-pointer transition-base border border-border"
          onClick={action?.action}
        >
          <div className="flex items-start space-x-4">
            <div className={`${action?.bgColor} rounded-lg p-3 transition-base`}>
              <Icon name={action?.icon} size={24} color={action?.iconColor} />
            </div>
            <div className="flex-1">
              <h3 className="font-heading font-semibold text-lg text-foreground mb-1">
                {action?.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {action?.description}
              </p>
              <Button 
                variant="outline" 
                size="sm"
                iconName="ArrowRight"
                iconPosition="right"
                onClick={(e) => {
                  e?.stopPropagation();
                  action?.action();
                }}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardQuickActions;
