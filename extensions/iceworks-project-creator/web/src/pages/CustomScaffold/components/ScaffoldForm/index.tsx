import React from 'react';
import { ResponsiveGrid } from '@alifd/next';
import ScaffoldConfig from '../ScaffoldConfig';
import ScaffoldLayout from '../ScaffoldLayout';
import styles from './index.module.scss';

const { Cell } = ResponsiveGrid;

const Scaffoldform = ({ children, onChange, value }) => {
  const { scaffold } = value;
  function handleScaffoldChange(configValue) {
    onChange({ scaffold: { ...scaffold, ...configValue } });
  }
  return (
    <div className={styles.scaffoldScaffold}>
      <ResponsiveGrid gap={30}>
        <Cell colSpan={6}>
          <ScaffoldLayout onChange={handleScaffoldChange} value={scaffold} />
        </Cell>
        <Cell colSpan={6}>
          <ScaffoldConfig onChange={handleScaffoldChange} value={scaffold} />
        </Cell>
      </ResponsiveGrid>
      <div className={styles.action}>{children}</div>
    </div>
  );
};

export default Scaffoldform;
