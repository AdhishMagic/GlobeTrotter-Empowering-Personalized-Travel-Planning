import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ExpenseTable = ({ expenses, onEdit, onDelete, currency = 'USD' }) => {
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'Stay', label: 'Stay' },
    { value: 'Transport', label: 'Transport' },
    { value: 'Activities', label: 'Activities' },
    { value: 'Food', label: 'Food' },
    { value: 'Miscellaneous', label: 'Miscellaneous' }
  ];

  const sortedAndFilteredExpenses = expenses?.filter(expense => {
      const matchesCategory = filterCategory === 'all' || expense?.category === filterCategory;
      const matchesSearch = expense?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                           expense?.city?.toLowerCase()?.includes(searchQuery?.toLowerCase());
      return matchesCategory && matchesSearch;
    })?.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'amount') {
        comparison = a?.amount - b?.amount;
      } else if (sortBy === 'name') {
        comparison = a?.name?.localeCompare(b?.name);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Stay: 'bg-primary/10 text-primary',
      Transport: 'bg-secondary/10 text-secondary',
      Activities: 'bg-accent/10 text-accent',
      Food: 'bg-success/10 text-success',
      Miscellaneous: 'bg-warning/10 text-warning'
    };
    return colors?.[category] || 'bg-muted text-foreground';
  };

  return (
    <div className="bg-card rounded-lg shadow-md border border-border overflow-hidden">
      <div className="p-4 md:p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <h2 className="font-heading font-semibold text-xl md:text-2xl text-foreground">
            Expense Details
          </h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <Input
              type="search"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              className="w-full sm:w-64"
            />
            <Select
              options={categoryOptions}
              value={filterCategory}
              onChange={setFilterCategory}
              className="w-full sm:w-48"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 md:px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 font-caption font-semibold text-sm text-foreground hover:text-primary transition-base"
                >
                  <span>Expense</span>
                  <Icon 
                    name={sortBy === 'name' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={16} 
                  />
                </button>
              </th>
              <th className="px-4 md:px-6 py-3 text-left">
                <span className="font-caption font-semibold text-sm text-foreground">Category</span>
              </th>
              <th className="px-4 md:px-6 py-3 text-left">
                <span className="font-caption font-semibold text-sm text-foreground">City</span>
              </th>
              <th className="px-4 md:px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center space-x-1 font-caption font-semibold text-sm text-foreground hover:text-primary transition-base"
                >
                  <span>Date</span>
                  <Icon 
                    name={sortBy === 'date' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={16} 
                  />
                </button>
              </th>
              <th className="px-4 md:px-6 py-3 text-right">
                <button
                  onClick={() => handleSort('amount')}
                  className="flex items-center justify-end space-x-1 font-caption font-semibold text-sm text-foreground hover:text-primary transition-base ml-auto"
                >
                  <span>Amount</span>
                  <Icon 
                    name={sortBy === 'amount' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={16} 
                  />
                </button>
              </th>
              <th className="px-4 md:px-6 py-3 text-right">
                <span className="font-caption font-semibold text-sm text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedAndFilteredExpenses?.map((expense, index) => (
              <tr key={index} className="hover:bg-muted/30 transition-base">
                <td className="px-4 md:px-6 py-4">
                  <p className="font-caption font-medium text-foreground text-sm">
                    {expense?.name}
                  </p>
                </td>
                <td className="px-4 md:px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-caption font-medium ${getCategoryColor(expense?.category)}`}>
                    {expense?.category}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-4">
                  <p className="text-sm text-muted-foreground font-caption">
                    {expense?.city}
                  </p>
                </td>
                <td className="px-4 md:px-6 py-4">
                  <p className="text-sm text-muted-foreground font-data whitespace-nowrap">
                    {formatDate(expense?.date)}
                  </p>
                </td>
                <td className="px-4 md:px-6 py-4 text-right">
                  <p className="font-data font-semibold text-foreground whitespace-nowrap">
                    {formatCurrency(expense?.amount)}
                  </p>
                </td>
                <td className="px-4 md:px-6 py-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Edit2"
                      onClick={() => onEdit(expense)}
                      className="hover:bg-primary/10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash2"
                      onClick={() => onDelete(expense?.id)}
                      className="hover:bg-error/10 hover:text-error"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sortedAndFilteredExpenses?.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Search" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground font-caption">
            No expenses found matching your criteria
          </p>
        </div>
      )}
      <div className="p-4 md:p-6 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <p className="text-sm font-caption text-muted-foreground">
            Showing {sortedAndFilteredExpenses?.length} of {expenses?.length} expenses
          </p>
          <p className="font-data font-bold text-lg text-foreground">
            Total: {formatCurrency(sortedAndFilteredExpenses?.reduce((sum, exp) => sum + exp?.amount, 0))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTable;