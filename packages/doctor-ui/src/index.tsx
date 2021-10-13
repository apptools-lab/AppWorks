import * as React from 'react';
import { Balloon, Icon } from '@alifd/next';
import { scoreLevelInfos, getScoreLevelInfo } from './config';
import styles from './index.module.scss';

const { Tooltip } = Balloon;

interface Props {
  filesInfo: { count: number; lines: number };
  score: number;
  locale?: any;
}

const Dashboard = (props: Props) => {
  const {
    filesInfo = { count: 0, lines: 0 },
    score = 0,
    locale = {
      projectRating: '项目评分',
      haveProblem: '对评分有异议？请至 ',
      reportProblem: '反馈',
      projectScale: '项目规模',
      filesNumber: '文件总数：',
      LoC: '总行数/平均行数',
    },
  } = props;
  return (
    <div className={styles.dashboard}>
      <div className={styles.infos}>
        <div className={styles.info}>
          <Tooltip delay={100} align="t" trigger={<p className={styles.title}>{locale.projectRating} <Icon type="prompt" size="small" /></p>}>
            <p>
              {locale.haveProblem}
              <a href="https://github.com/apptools-lab/appworks/issues" target="_blank">
                https://github.com/apptools-lab/appworks/issues
              </a>
              {locale.reportProblem}
            </p>
          </Tooltip>
          <p className={styles.score} style={{ color: getScoreLevelInfo(score).color }}>
            {score}
          </p>
        </div>

        <div className={styles.info}>
          <p className={styles.title}>
            {locale.projectScale}
          </p>
          <p className={styles.detail}>
            {`${locale.filesNumber} ${filesInfo.count || 0}`}
          </p>
          <p className={styles.label}>{locale.LoC}</p>
          <p className={styles.detail}>
            {filesInfo.lines || 0}/{Math.round(filesInfo.lines / filesInfo.count) || 0}
          </p>
        </div>
      </div>
      <div className={styles.scoreRanges}>
        {scoreLevelInfos.map((scoreLevelInfo) => {
          return (
            <div key={scoreLevelInfo.name} className={styles.scoreRange}>
              <div className={styles.color} style={{ backgroundColor: scoreLevelInfo.color }} />
              <p className={styles.range}>
                {scoreLevelInfo.range.start} - {scoreLevelInfo.range.end}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
