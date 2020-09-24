import React from 'react';
import { ResponsiveGrid } from '@alifd/next';
import ScaffoldConfig from '../ScaffoldConfig';
import ScaffoldLayout from '../ScaffoldLayout';
import styles from './index.module.scss';

const { Cell } = ResponsiveGrid;

const CustomScaffold = () => {
  return (
    <div className={styles.customScaffold}>
      <ResponsiveGrid gap={10}>
        <Cell colSpan={6}>
          <ScaffoldLayout />
        </Cell>
        <Cell colSpan={6}>
          <ScaffoldConfig />
        </Cell>
      </ResponsiveGrid>
    </div>
  );
};

export default CustomScaffold;
