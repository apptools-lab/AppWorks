import React from 'react';
import Header from './components/Header';
import Content from './components/Content';
import Information from './components/Information';
import styles from './index.module.scss';

export default () => {
  return (
    <div className={styles.container}>
      <Header />
      <Content />
      <Information />
    </div>
  );
};
