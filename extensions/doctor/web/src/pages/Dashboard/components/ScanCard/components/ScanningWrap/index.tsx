import * as React from 'react';
import Scanning from '../Scanning';
import styles from './index.module.scss';

const ScanningWrap = () => {
  return (
    <div className={styles.scanningWrap}>
      <h1>{window.USE_EN ? 'Code quality scan has started' : '开始代码质量检测'}</h1>
      <p>{window.USE_EN ? 'Scan findings would appear here shortly' : '检测报告生成中'}</p>
      <Scanning />
    </div>
  );
};

export default ScanningWrap;
