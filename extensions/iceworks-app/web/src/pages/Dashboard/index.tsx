import React, { useEffect, useState } from 'react';
import { LocaleProvider } from '@/i18n';
import callService from '@/callService';
import Basic from './components/Basic';
import Doctor from './components/Doctor';
import Framework from './components/Framework';
import styles from './index.module.scss';

export default () => {
  const [isTargetFramework, setIsTargetFramework] = useState(false);
  async function getIsTargetFramework() {
    setIsTargetFramework(await callService('project', 'checkIsTargetProjectFramework'));
  }

  const [isShowDoctor, setIsShowDoctor] = useState(false);
  async function getIsShowDoctor() {
    setIsShowDoctor(await callService('common', 'checkIsInstalledDoctor'));
  }

  useEffect(() => {
    getIsTargetFramework();
    getIsShowDoctor();
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
        {isShowDoctor &&
        <div className={styles.box}>
          <Doctor />
        </div>}
      </div>
    </LocaleProvider>
  );
};
