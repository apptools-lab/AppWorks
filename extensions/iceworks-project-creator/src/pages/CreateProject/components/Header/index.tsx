import React from 'react';
import styles from './index.module.scss';

function Header({ scaffoldTypeSelected }) {
  return (
    <div className={styles.header}>
      <h1>Create Your {!scaffoldTypeSelected ? 'React or Rax' : scaffoldTypeSelected.slice(0, 1).toUpperCase() + scaffoldTypeSelected.slice(1)} app.</h1>
      <h5>Enjoy rapid development and new experience.</h5>
    </div>
  );
}

export default Header;
