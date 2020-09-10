import * as React from 'react';
import { Element } from 'react-scroll';
import { getReportKey, getScoreLevelInfo } from '@/config';
import EslintMessages, { getMessagesLength } from '../EslintMessages';

import styles from './index.module.scss';

const reportKey = getReportKey('bestPractices');

const ScoreBoard = (props) => {
  const { data = {} } = props;
  console.log(data);
  return (
    <Element name={reportKey.key} className={styles.container}>
      <div className={styles.header}>
        <p className={styles.title}>
          {window.USE_EN ? reportKey.nameEn : reportKey.name}
          <span className={styles.number} style={{ backgroundColor: getScoreLevelInfo(data.score).color }}>
            {getMessagesLength(data.reports)}
          </span>
        </p>
        <p className={styles.description}>
          使用
          <a href="" target="_blank">
            @iceworks/eslint-plugin-best-practices
          </a>
          扫描代码
        </p>
      </div>
      <EslintMessages reports={data.reports} />
    </Element>
  );
};

export default ScoreBoard;
