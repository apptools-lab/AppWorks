import React from 'react';
import styles from './index.module.scss';

const Header = () => {
  return (
    <div className={styles.header}>
      <h1>欢迎来到 Iceworks</h1>
      <div className={styles.desc}>可视化智能研发助手</div>
    </div>
  );
};

export default Header;
