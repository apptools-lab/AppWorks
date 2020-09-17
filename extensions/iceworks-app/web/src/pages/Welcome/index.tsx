import React from 'react';
import { LocaleProvider } from '@/i18n';
import Header from './components/Header';
import Content from './components/Content';
import Information from './components/Information';
import ShowPageOption from './components/ShowPageOption';
import styles from './index.module.scss';

export default () => {
  return (
    <LocaleProvider>
      <div className={styles.container}>
        <Header />
        <Content />
        <Information />
        <ShowPageOption />
      </div>
    </LocaleProvider>
  );
};
