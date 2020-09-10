import * as React from 'react';
import styles from './index.module.scss';

const Appreciate = () => {
  return (
    <div className={styles.container}>
      <img src="https://img.alicdn.com/tfs/TB19IRxhypE_u4jSZKbXXbCUVXa-134-128.png" alt="excellent" />
      <p>{window.USE_EN ? 'Excellent，keep moving forward！' : '太棒了，请再接再厉！'}</p>
    </div>
  );
};

export default Appreciate;
