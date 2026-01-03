import React from 'react';
import Icon from '../../../components/AppIcon';

const SummaryCard = ({ title, value, subtitle, icon, iconColor, bgColor, trend }) => {
  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-md border border-border hover-lift transition-base">
      <div className="flex items-start justify-between mb-4">
        <div className={`${bgColor} rounded-lg p-3 transition-base`}>
          <Icon name={icon} size={24} color={iconColor} />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-xs md:text-sm font-caption font-medium ${
            trend?.direction === 'up' ? 'text-success' : 'text-error'
          }`}>
            <Icon name={trend?.direction === 'up' ? 'TrendingUp' : 'TrendingDown'} size={16} />
            <span>{trend?.value}</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground font-data">
          {value}
        </h3>
        <p className="text-xs md:text-sm font-caption text-muted-foreground">
          {title}
        </p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-2">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;