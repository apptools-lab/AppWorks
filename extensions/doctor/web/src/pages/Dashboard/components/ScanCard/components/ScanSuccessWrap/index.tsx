import React, { useState } from 'react';
import { Button } from '@alifd/next';
import { animateScroll as scroll } from 'react-scroll';
import { reportKeys, IReportKeys } from '@/config';
import DoctorDashboard from '@appworks/doctor-ui';
import ScoreBoard from '../ScoreBoard';
import CodemodReport from '../CodemodReport';
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

  const locale = {
    projectRating: window.USE_EN ? 'Project Rating' : '项目评分',
    haveProblem: window.USE_EN ? 'Have some problem? open ' : '对评分有异议？请至 ',
    reportProblem: window.USE_EN ? ' report your problem' : '反馈',
    projectScale: window.USE_EN ? 'Project Scale' : '项目规模',
    filesNumber: window.USE_EN ? 'Files Number' : '文件总数：',
    LoC: window.USE_EN ? 'LoC/Average LoC' : '总行数/平均行数',
  };

  return (
    <div className={styles.scanSuccessWrap}>
      <DoctorDashboard score={data.score} filesInfo={data.filesInfo} locale={locale} />
      <ScoreBoard data={data} onAffix={(newAffixed) => setAffixed(newAffixed)} />
      <div className={styles.reportWrap}>
        {reportKeys.map((reportKey: IReportKeys) => {
          const { key } = reportKey;
          switch (key) {
            case 'codemod':
              return <CodemodReport key={key} data={data[key]} />;
            case 'ESLint':
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
          {window.USE_EN ? 'Fix Problems' : '一键修复'}
        </Button>
      </div>
    </div>
  );
};

export default ScanSuccessWrap;
