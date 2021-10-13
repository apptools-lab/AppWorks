import * as React from 'react';
import { Message } from '@alifd/next';
import styles from './index.module.scss';

const ScanFailedWrap = () => {
  return (
    <div className={styles.scanFailedWrap}>
      <Message title="Error" type="error">
        {window.USE_EN ? 'Scan Failed, open ' : '扫描失败，请至 '}
        <a href="https://github.com/apptools-lab/appworks/issues" target="_blank">
          https://github.com/apptools-lab/appworks/issues
        </a>
        {window.USE_EN ? ' report your problem' : ' 反馈'}
      </Message>
    </div>
  );
};

export default ScanFailedWrap;
