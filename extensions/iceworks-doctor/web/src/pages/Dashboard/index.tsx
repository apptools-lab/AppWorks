import React from 'react';
import { ResponsiveGrid } from '@alifd/next';
import InfoCard from './components/InfoCard';
import ScanCard from './components/ScanCard';

const { Cell } = ResponsiveGrid;

const Dashboard = () => {
  // @ts-ignore
  const autoScan = !!window.AUTO_SCAN;
  return (
    <ResponsiveGrid gap={10}>
      {autoScan ? null : (
        <Cell colSpan={12}>
          <InfoCard />
        </Cell>
      )}
      <Cell colSpan={12}>
        <ScanCard />
      </Cell>
    </ResponsiveGrid>
  );
};

export default Dashboard;
