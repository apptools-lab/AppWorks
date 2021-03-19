import React from 'react';
import { ResponsiveGrid } from '@alifd/next';
import { LocaleProvider } from '@/i18n';

const { Cell } = ResponsiveGrid;

const Dashboard = () => {
  return (
    <ResponsiveGrid gap={20}>
      <Cell colSpan={12}>
        Hi
      </Cell>
    </ResponsiveGrid>
  );
};

const IntlCreateProject = () => {
  return (
    <LocaleProvider>
      <Dashboard />
    </LocaleProvider>
  );
};

export default IntlCreateProject;
