import React from 'react';
import { ResponsiveGrid } from '@alifd/next';

const { Cell } = ResponsiveGrid;

const Dashboard = () => {
  return (
    <ResponsiveGrid gap={10}>
      <Cell colSpan={12}>
        <h1>Hello World!</h1>
      </Cell>
    </ResponsiveGrid>
  );
};

export default Dashboard;
