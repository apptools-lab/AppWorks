import React from 'react';
import styles from './index.module.scss';

const Header = () => {
  return (
    <div className={styles.header}>
      <h1>欢迎来到 Iceworks</h1>
      <div className={styles.desc}>Iceworks 是可视化智能研发助手，帮助你快速开发前端应用</div>
    </div>
  );
};

export default Header;
