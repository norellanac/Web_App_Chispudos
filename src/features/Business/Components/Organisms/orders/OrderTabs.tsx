import React from 'react';
import { Tabs, Tab } from '@mui/material';

interface OrderTabsProps {
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
  options: { status: number; label: string; value: number }[];
}

const OrderTabs: React.FC<OrderTabsProps> = ({ value, onChange, options }) => {
  return (
    <Tabs
      value={value}
      onChange={onChange}
      variant="scrollable"
      scrollButtons="auto"
      sx={{ mb: 3 }}
    >
      {options.map(({ status, label, value }) => (
        <Tab key={status} label={`${label} (${value})`} value={status} />
      ))}
    </Tabs>
  );
};

export default OrderTabs;