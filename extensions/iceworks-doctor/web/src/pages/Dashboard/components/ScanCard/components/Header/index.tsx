import * as React from 'react';
import { Balloon, Icon } from '@alifd/next';
import { scoreLevelInfos, getScoreLevelInfo } from '@/config';
import styles from './index.module.scss';

const { Tooltip } = Balloon;

const Header = (props) => {
  const { filesInfo = {}, score } = props;
  return (
    <div className={styles.header}>
      <div className={styles.infos}>
        <div className={styles.info}>
          <Tooltip delay={100} align="t" trigger={<p className={styles.title}>{window.USE_EN ? 'Project Rating' : '项目评分'} <Icon type="prompt" size="small" /></p>}>
            <p>
              {window.USE_EN ? 'Have some problem? open ' : '对评分有异议？请至 '}
              <a href="https://github.com/ice-lab/iceworks/issues" target="_blank">
                https://github.com/ice-lab/iceworks/issues
              </a>
              {window.USE_EN ? ' report your problem' : ' 反馈'}
            </p>
          </Tooltip>
          <p className={styles.score} style={{ color: getScoreLevelInfo(score).color }}>
            {score}
          </p>
        </div>

        <div className={styles.info}>
          <p className={styles.title}>{window.USE_EN ? 'Project Scale' : '项目规模'}</p>
          <p className={styles.detail}>{`${window.USE_EN ? 'Files Number: ' : '文件总数：'} ${filesInfo.count || 0
          }`}
          </p>
          <p className={styles.label}>{window.USE_EN ? 'LoC/Average LoC' : '总行数/平均行数'}</p>
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

export default Header;
