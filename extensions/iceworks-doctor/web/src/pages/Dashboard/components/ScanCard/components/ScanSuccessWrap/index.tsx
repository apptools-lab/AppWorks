import React, { useState } from 'react';
import { Button } from '@alifd/next';
import { animateScroll as scroll } from 'react-scroll';
import { reportKeys, IReportKeys } from '@/config';
import Header from '../Header';
import ScoreBoard from '../ScoreBoard';
import BestPracticesReport from '../BestPracticesReport';
import SecurityPracticesReport from '../SecurityPracticesReport';
import AliEslintReport from '../AliEslintReport';
import MaintainabilityReport from '../MaintainabilityReport';
import RepeatabilityReport from '../RepeatabilityReport';

import styles from './index.module.scss';

const ScanSuccessWrap = (props) => {
  const { data, getData } = props;

  const [affixed, setAffixed] = useState(false);

  const scrollToTop = () => {
    scroll.scrollToTop({
      duration: 200,
    });
  };

  return (
    <div className={styles.scanSuccessWrap}>
      <Header score={data.score} filesInfo={data.filesInfo} />
      <ScoreBoard data={data} onAffix={(affixed) => setAffixed(affixed)} />
      <div className={styles.reportWrap}>
        {reportKeys.map((reportKey: IReportKeys) => {
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
        <img src="https://img.alicdn.com/tfs/TB1yC3ghypE_u4jSZKbXXbCUVXa-128-128.png" alt="back top" />
      </div>

      <div className={styles.actions} style={{ visibility: affixed ? 'visible' : 'hidden' }}>
        <Button
          type="primary"
          size="medium"
          onClick={() => {
            getData({ fix: true });
          }}
        >
          一键修复
        </Button>
      </div>
    </div>
  );
};

export default ScanSuccessWrap;
