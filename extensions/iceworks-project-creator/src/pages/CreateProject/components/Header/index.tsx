import React from 'react';
import styles from './index.module.scss';

function Header({ scaffoldTypeSelected }) {
  return (
    <div className={styles.header}>
      <h1>创建你的 {!scaffoldTypeSelected ? 'React or Rax' : scaffoldTypeSelected.slice(0, 1).toUpperCase() + scaffoldTypeSelected.slice(1)} 项目</h1>
      <h5>享受开发新体验！</h5>
    </div>
  );
}

export default Header;
