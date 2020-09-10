import * as React from 'react';
import { Element } from 'react-scroll';
import { Balloon, Icon } from '@alifd/next';
import { getReportKey, getScoreLevelInfo } from '@/config';
import ReportHeader from '../ReportHeader';
import styles from './index.module.scss';

const Tooltip = Balloon.Tooltip;

const reportKey = getReportKey('maintainability');

const Description = (
  <p className={styles.description}>
    {window.USE_EN ? 'Use' : '使用'}
    <a href="https://www.npmjs.com/package/@jscpd/core" target="_blank">
      jscpd
    </a>
    {window.USE_EN ? 'scan your code' : '扫描代码'}
  </p>
);

const RepeatabilityReport = (props) => {
  const { data = {} } = props;

  return (
    <Element name={reportKey.key} className={styles.container}>
      <ReportHeader
        number={(data.reports || []).length}
        reportKey={reportKey}
        score={data.score}
        Description={Description}
      />
      2222
    </Element>
  );
};

export default RepeatabilityReport;
