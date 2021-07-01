import * as React from 'react';
import { getReportKey } from '@/config';
import EslintMessages from '../EslintMessages';
import styles from './index.module.scss';

const AliEslintReport = (props) => {
  const { data = {} } = props;

  const Description = (
    <p className={styles.description}>
      {window.USE_EN ? 'Use ' : '使用 '}
      <a href="https://www.npmjs.com/package/@iceworks/spec" target="_blank">
        @iceworks/spec
      </a>
      {window.USE_EN ? ' scan your code' : ' 扫描代码'}
    </p>
  );

  return (
    <EslintMessages
      Description={Description}
      reportKey={getReportKey('ESLint')}
      reports={data.reports}
      score={data.score}
    />
  );
};

export default AliEslintReport;
