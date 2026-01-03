import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ExportOptionsCard = ({ onExport, onShare }) => {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    { value: 'pdf', label: 'PDF Document' },
    { value: 'excel', label: 'Excel Spreadsheet' },
    { value: 'csv', label: 'CSV File' },
    { value: 'json', label: 'JSON Data' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport?.(exportFormat);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-md border border-border">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-secondary/10 rounded-lg p-2">
          <Icon name="Download" size={20} color="var(--color-secondary)" />
        </div>
        <h3 className="font-heading font-semibold text-lg text-foreground">
          Export Budget Report
        </h3>
      </div>

      <p className="text-sm text-muted-foreground font-caption mb-4">
        Download your complete budget summary and expense details in your preferred format
      </p>

      <div className="space-y-4">
        <Select
          label="Export Format"
          options={formatOptions}
          value={exportFormat}
          onChange={setExportFormat}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="default"
            fullWidth
            iconName="Download"
            iconPosition="left"
            loading={isExporting}
            onClick={handleExport}
          >
            Export Report
          </Button>
          <Button
            variant="outline"
            fullWidth
            iconName="Share2"
            iconPosition="left"
            onClick={() => onShare?.()}
            disabled={isExporting}
          >
            Share with Team
          </Button>
        </div>

        <div className="flex items-start space-x-2 p-3 bg-muted/50 rounded-lg border border-border">
          <Icon name="Info" size={16} color="var(--color-primary)" className="mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground font-caption">
            Exported reports include all expense details, category breakdowns, and visual charts for comprehensive budget analysis
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExportOptionsCard;