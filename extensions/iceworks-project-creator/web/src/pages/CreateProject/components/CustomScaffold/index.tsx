import React from 'react';
import { ResponsiveGrid } from '@alifd/next';
import ScaffoldConfig from '../ScaffoldConfig';
import ScaffoldLayout from '../ScaffoldLayout';
import styles from './index.module.scss';

const { Cell } = ResponsiveGrid;

const CustomScaffold = ({ onChange, value }) => {
  function handleScaffoldChange(config) {
    console.log('config ===>', { ...value, ...config });
    onChange({ ...value, ...config });
  }
  return (
    <div className={styles.customScaffold}>
      <ResponsiveGrid gap={30}>
        <Cell colSpan={6}>
          <ScaffoldLayout onChange={handleScaffoldChange} value={value} />
        </Cell>
        <Cell colSpan={6}>
          <ScaffoldConfig onChange={handleScaffoldChange} value={value} />
        </Cell>
      </ResponsiveGrid>
    </div>
  );
};

export default CustomScaffold;
