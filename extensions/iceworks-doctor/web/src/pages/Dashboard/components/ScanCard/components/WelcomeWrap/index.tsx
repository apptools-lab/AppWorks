import * as React from 'react';
import { Button } from '@alifd/next';
import styles from './index.module.scss';

const WelcomeWrap = (props) => {
  const { getData } = props;

  return (
    <div className={styles.welcomeWrap}>
      <h1>{window.USE_EN ? 'No Scan Result found' : '未生成检测报告'}</h1>
      <p>{window.USE_EN ? 'Click the button to scan your project' : '点击下方按钮开始检测'}</p>
      <Button
        type="primary"
        size="medium"
        onClick={() => {
          getData();
        }}
      >
        {window.USE_EN ? 'Code Quality Scan' : '检测代码质量'}
      </Button>
    </div>
  );
};

export default WelcomeWrap;
