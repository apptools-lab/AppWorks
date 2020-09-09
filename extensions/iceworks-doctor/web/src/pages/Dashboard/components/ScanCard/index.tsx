import React, { useState } from 'react';
import { Button, Loading } from '@alifd/next';
import { Element, animateScroll as scroll } from 'react-scroll';
import { reportKeys, IReportKeys } from '@/config';
import Header from './components/Header';
import ScoreBoard from './components/ScoreBoard';
import styles from './index.module.scss';

const ScanCard = () => {
  const [loading, setLoading] = useState(false);

  const scrollToTop = () => {
    scroll.scrollToTop({
      duration: 200,
    });
  };

  return (
    <Loading tip="代码扫描中" size="large" style={{ display: 'block' }} visible={loading}>
      <div className={styles.container}>
        <Header score={70.11} count={2} LoC={77} />
        <ScoreBoard />

        <div style={{ position: 'relative', width: 100, height: 20000 }}>
          {reportKeys.map((reportKey: IReportKeys, index) => {
            return (
              <Element
                name={reportKey.key}
                onClick={scrollToTop}
                style={{ position: 'relative', backgroundColor: `#${index}${index}${index}`, width: 300, height: 4000 }}
              ></Element>
            );
          })}
        </div>

        <div>
          <Button type="primary" size="large">
            一键修复
          </Button>
        </div>
      </div>
    </Loading>
  );
};

export default ScanCard;
