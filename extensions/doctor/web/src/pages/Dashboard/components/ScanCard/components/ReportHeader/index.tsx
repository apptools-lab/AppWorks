import * as React from 'react';
import { getScoreLevelInfo } from '@appworks/doctor-ui/lib/config';
import styles from './index.module.scss';

const ReportHeader = (props) => {
  const { number, reportKey, score, Description } = props;

  return (
    <div className={styles.header}>
      <p className={styles.title}>
        {window.USE_EN ? reportKey.nameEn : reportKey.name}
        <span className={styles.number} style={{ backgroundColor: getScoreLevelInfo(score).color }}>
          {number}
        </span>
      </p>
      {Description}
    </div>
  );
};

export default ReportHeader;
