import React, { useEffect, useState } from 'react';
import { Button, Message, Loading } from '@alifd/next';
import { Element, animateScroll as scroll } from 'react-scroll';
import { reportKeys, IReportKeys } from '@/config';
import callService from '@/callService';
import Header from './components/Header';
import ScoreBoard from './components/ScoreBoard';
import BestPracticesReport from './components/BestPracticesReport';

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
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function getData() {
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
          <ScoreBoard data={data} />
          <div className={styles.reportWrap}>
            {reportKeys.map((reportKey: IReportKeys, index) => {
              switch (reportKey.key) {
                case 'bestPractices':
                  return <BestPracticesReport key={reportKey.key} data={data.bestPractices} />;
                default:
                  return (
                    <Element
                      key={reportKey.key}
                      name={reportKey.key}
                      onClick={scrollToTop}
                      style={{ position: 'relative', backgroundColor: `#${index}${index}${index}`, height: 4000 }}
                    />
                  );
              }
            })}
          </div>

          <div>
            <Button type="primary" size="large">
              一键修复
            </Button>
          </div>
        </div>
      )}
    </Loading>
  );
};

export default ScanCard;
