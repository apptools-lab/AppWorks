import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Progress } from '@alifd/next';
import styles from './index.module.scss';

let progressTimer;

function LoadingPercent(props, ref) {
  const [show, setShow] = useState(false);
  const [percent, setPercent] = useState(0);

  useImperativeHandle(ref, () => ({
    start: () => {
      progressTimer && clearInterval(progressTimer);
      progressTimer = window.setInterval(() => {
        setPercent(prevPercent => prevPercent + (100 - percent) * (Math.random() * 0.2));
      }, Math.random() * 1000 + 2000);
      setShow(true);
      setPercent(5);
    },
    end: () => {
      progressTimer && clearInterval(progressTimer);
      setPercent(100);
      setTimeout(() => {
        setShow(false);
      }, 300);
    },
  }));

  return show ? (
    <div className={styles.container} >
      <Progress
        color="#5584ff"
        backgroundColor="#ebecf0"
        percent={percent}
        size="small"
        textRender={() => null}
      />
    </div>
  ) : null;
}

export default forwardRef(LoadingPercent);
