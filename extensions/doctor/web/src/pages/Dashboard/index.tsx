import React from 'react';
import { ResponsiveGrid } from '@alifd/next';
import ScanCard from './components/ScanCard';

const { Cell } = ResponsiveGrid;

const Dashboard = () => {
  return (
    <ResponsiveGrid gap={10}>
      <Cell colSpan={12}>
        <ScanCard />
      </Cell>
    </ResponsiveGrid>
  );
};

export default Dashboard;
