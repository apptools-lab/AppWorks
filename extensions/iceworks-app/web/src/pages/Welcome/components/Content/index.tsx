import React from 'react';
import styles from './index.module.scss';

const Content = () => {
  return (
    <div className={styles.content}>
      <div className={styles.title}>上手课程</div>
      <div className={styles.desc}>10分钟快速上手使用 Iceworks</div>
    </div>
  );
};

export default Content;
