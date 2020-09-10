import React, { useEffect, useState } from 'react';
import { Button, Message, Loading } from '@alifd/next';
import { animateScroll as scroll } from 'react-scroll';
import { reportKeys, IReportKeys } from '@/config';
import callService from '@/callService';
import Header from './components/Header';
import ScoreBoard from './components/ScoreBoard';
import BestPracticesReport from './components/BestPracticesReport';
import SecurityPracticesReport from './components/SecurityPracticesReport';
import AliEslintReport from './components/AliEslintReport';
import MaintainabilityReport from './components/MaintainabilityReport';
import RepeatabilityReport from './components/RepeatabilityReport';

import styles from './index.module.scss';

const ScanCard = () => {
  const [data, setData] = useState({
    filesInfo: {},
    score: 100,
    aliEslint: {},
    bestPractices: {},
    securityPractices: {},
    maintainability: {},
    repeatability: {},
  });

  const [loading, setLoading] = useState(true);
  const [affixed, setAffixed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function getData() {
    setLoading(true);
    try {
      const scanReport = await callService('data', 'scanReport');
      if (scanReport.errorMsg) {
        setErrorMsg(scanReport.errorMsg);
      } else {
        setErrorMsg('');
        setData(scanReport);
      }
    } catch (e) {
      // ignore
    }
    setLoading(false);
  }

  useEffect(() => {
    getData();
  }, []);

  const scrollToTop = () => {
    scroll.scrollToTop({
      duration: 200,
    });
  };

  return (
    <Loading
      tip={window.USE_EN ? 'Scanning' : '代码扫描中'}
      size="large"
      style={{ display: 'block' }}
      visible={loading}
    >
      {errorMsg ? (
        <Message title="Error" type="error">
          {`${window.USE_EN ? 'Scan Failed: ' : '扫描失败：'} ${errorMsg}`}
        </Message>
      ) : (
        <div className={styles.container}>
          <Header score={data.score} filesInfo={data.filesInfo} />
          <ScoreBoard data={data} onAffix={(affixed) => setAffixed(affixed)} />
          <div className={styles.reportWrap}>
            {reportKeys.map((reportKey: IReportKeys, index) => {
              const key = reportKey.key;
              switch (key) {
                case 'bestPractices':
                  return <BestPracticesReport key={key} data={data[key]} />;
                case 'securityPractices':
                  return <SecurityPracticesReport key={key} data={data[key]} />;
                case 'aliEslint':
                  return <AliEslintReport key={key} data={data[key]} />;
                case 'maintainability':
                  return <MaintainabilityReport key={key} data={data[key]} />;
                case 'repeatability':
                  return <RepeatabilityReport key={key} data={data[key]} />;
                default:
                  return null;
              }
            })}
          </div>

          <div onClick={scrollToTop} className={styles.backTop} style={{ visibility: affixed ? 'visible' : 'hidden' }}>
            <img src="https://img.alicdn.com/tfs/TB1ce16k79l0K4jSZFKXXXFjpXa-128-128.png" alt="back top" />
          </div>

          <div className={styles.actions} style={{ visibility: affixed ? 'visible' : 'hidden' }}>
            <Button type="primary" size="medium" onClick={getData}>
              一键修复
            </Button>
          </div>
        </div>
      )}
    </Loading>
  );
};

export default ScanCard;
