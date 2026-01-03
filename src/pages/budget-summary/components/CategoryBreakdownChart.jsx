import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

import Button from '../../../components/ui/Button';

const CategoryBreakdownChart = ({ categories, currency = 'USD' }) => {
  const [chartType, setChartType] = useState('pie');

  const COLORS = {
    Stay: 'var(--color-primary)',
    Transport: 'var(--color-secondary)',
    Activities: 'var(--color-accent)',
    Food: 'var(--color-success)',
    Miscellaneous: 'var(--color-warning)'
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-caption font-semibold text-foreground mb-1">
            {payload?.[0]?.name}
          </p>
          <p className="font-data text-sm text-muted-foreground">
            {formatCurrency(payload?.[0]?.value)}
          </p>
          <p className="font-data text-xs text-muted-foreground mt-1">
            {payload?.[0]?.payload?.percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  const totalSpent = categories?.reduce((sum, cat) => sum + cat?.spent, 0);
  const chartData = categories?.map(cat => ({
    name: cat?.name,
    value: cat?.spent,
    percentage: ((cat?.spent / totalSpent) * 100)?.toFixed(1)
  }));

  return (
    <div className="bg-card rounded-lg p-6 md:p-8 shadow-md border border-border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className="font-heading font-semibold text-xl md:text-2xl text-foreground">
          Category Breakdown
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={chartType === 'pie' ? 'default' : 'outline'}
            size="sm"
            iconName="PieChart"
            onClick={() => setChartType('pie')}
          >
            Pie
          </Button>
          <Button
            variant={chartType === 'bar' ? 'default' : 'outline'}
            size="sm"
            iconName="BarChart3"
            onClick={() => setChartType('bar')}
          >
            Bar
          </Button>
        </div>
      </div>
      <div className="space-y-6">
        <div className="w-full h-64 md:h-80" aria-label="Category spending breakdown chart">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'pie' ? (
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={window.innerWidth < 768 ? 80 : 100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS?.[entry?.name]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: '14px' }}
                />
              </PieChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'var(--color-foreground)', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fill: 'var(--color-foreground)', fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {chartData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS?.[entry?.name]} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories?.map((category, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS?.[category?.name] }}
                />
                <div>
                  <p className="font-caption font-medium text-foreground text-sm">
                    {category?.name}
                  </p>
                  <p className="font-data text-xs text-muted-foreground">
                    {((category?.spent / totalSpent) * 100)?.toFixed(1)}%
                  </p>
                </div>
              </div>
              <p className="font-data font-semibold text-foreground">
                {formatCurrency(category?.spent)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBreakdownChart;