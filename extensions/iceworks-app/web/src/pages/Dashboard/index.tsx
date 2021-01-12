import React, { useEffect, useState } from 'react';
import { LocaleProvider } from '@/i18n';
import Basic from './components/Basic';
import Doctor from './components/Doctor';
import Framework from './components/Framework';
import callService from '@/callService';
import styles from './index.module.scss';

export default () => {
  const [isTargetFramework, setIsTargetFramework] = useState(false);
  useEffect(() => {
    async function getIsTargetFramework() {
      try {
        setIsTargetFramework(await callService('project', 'checkIsTargetProjectFramework'));
      } catch (e) { /* ignore */ }
    }
    getIsTargetFramework();
  }, []);

  return (
    <LocaleProvider>
      <div className={styles.container}>
        <div className={styles.box}>
          <Basic />
        </div>
        {isTargetFramework &&
        <div className={styles.box}>
          <Framework />
        </div>}
        <div className={styles.box}>
          <Doctor />
        </div>
      </div>
    </LocaleProvider>
  );
};
