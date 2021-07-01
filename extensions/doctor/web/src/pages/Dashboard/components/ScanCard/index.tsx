import React, { useEffect, useState } from 'react';
import callService from '@/callService';
import WelcomeWrap from './components/WelcomeWrap';
import ScanningWrap from './components/ScanningWrap';
import ScanSuccessWrap from './components/ScanSuccessWrap';
import ScanFailedWrap from './components/ScanFailedWrap';

import styles from './index.module.scss';

const ScanCard = () => {
  const [data, setData] = useState({
    filesInfo: {},
    score: 100,
    codemod: {},
    ESLint: {},
    maintainability: {},
    repeatability: {},
  });
  // 1: welcome page; 2: scanning;  3: scan success;  4: scan failed;
  const [status, setStatus] = useState(1);

  async function getData(options?) {
    setStatus(2); // scanning
    try {
      const scanReport = await callService('action', 'getScanReport', options);
      if (scanReport.error) {
        setStatus(4); // scan failed
        console.error(scanReport.error);
      } else {
        setStatus(3); // scan success
        setData(scanReport);
      }
    } catch (e) {
      setStatus(4); // scan failed
      console.error(e);
    }
  }

  useEffect(() => {
    if ((window as any).AUTO_SCAN) {
      getData();
    } else if ((window as any).AUTO_FIX) {
      getData({ fix: true });
    }
  }, []);

  const getWrap = () => {
    switch (status) {
      case 1:
        return <WelcomeWrap getData={getData} />;
      case 2:
        return <ScanningWrap />;
      case 3:
        return <ScanSuccessWrap data={data} getData={getData} />;
      default:
        return <ScanFailedWrap />;
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.title}>{window.USE_EN ? 'Code Quality' : '代码质量'}</p>
      {getWrap()}
    </div>
  );
};

export default ScanCard;
