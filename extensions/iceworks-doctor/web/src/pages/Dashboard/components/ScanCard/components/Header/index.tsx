import * as React from 'react';
import { scoreLevelInfos, getScoreLevelInfo } from '@/config';
import styles from './index.module.scss';

const ScoreBoard = (props) => {
  const { count, LoC, score } = props;
  return (
    <div className={styles.header}>
      <div className={styles.infos}>
        <div className={styles.info}>
          <p className={styles.title}>{window['USE_EN'] ? 'Project Rating' : '项目评分'}</p>
          <p className={styles.score} style={{ color: getScoreLevelInfo(score).color }}>
            {score}
          </p>
        </div>

        <div className={styles.info}>
          <p className={styles.title}>{window['USE_EN'] ? 'Project Scale' : '项目规模'}</p>
          <p className={styles.detail}>{`${window['USE_EN'] ? 'Files Number: ' : '文件总数：'} ${count}`}</p>
          <p className={styles.label}>{window['USE_EN'] ? 'LoC/Average LoC' : '总行数/平均行数'}</p>
          <p className={styles.detail}>
            {LoC}/{Math.round(LoC / count)}
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

export default ScoreBoard;
