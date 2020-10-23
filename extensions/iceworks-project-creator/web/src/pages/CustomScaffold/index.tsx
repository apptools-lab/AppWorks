import React, { useState } from 'react';
import { ResponsiveGrid } from '@alifd/next';
import ScaffoldConfig from './components/ScaffoldConfig';
import ScaffoldLayout from './components/ScaffoldLayout';
import styles from './index.module.scss';

const { Cell } = ResponsiveGrid;

const CustomScaffold = () => {
  const [value, setValue] = useState({});

  function handleScaffoldChange(config) {
    console.log('value ===>', { ...value, ...config });
    setValue({ ...value, ...config });
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
