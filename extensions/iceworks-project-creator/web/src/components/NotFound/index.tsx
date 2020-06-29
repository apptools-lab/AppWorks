import React from 'react';
import styles from './index.module.scss';

export default ({ description }) => {
  return (
    <div className={styles.container}>
      <img
        src="https://img.alicdn.com/tfs/TB1WNNxjBHH8KJjy0FbXXcqlpXa-780-780.png"
        width="250"
        height="250"
        alt=""
      />
      <div className={styles.description}>{description}</div>
    </div>
  )
}