import React from 'react';
import { LocaleProvider } from '@/i18n';
import Basic from './components/Basic';
import Doctor from './components/Doctor';
import Framework from './components/Framework';
import styles from './index.module.scss';

export default () => {
  return (
    <LocaleProvider>
      <div className={styles.container}>
        <div className={styles.box}>
          <Basic />
        </div>
        <div className={styles.box}>
          <Framework />
        </div>
        <div className={styles.box}>
          <Doctor />
        </div>
      </div>
    </LocaleProvider>
  );
};
