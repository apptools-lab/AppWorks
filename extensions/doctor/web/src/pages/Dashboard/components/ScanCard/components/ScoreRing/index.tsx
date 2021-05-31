import * as React from 'react';
import { Progress } from '@alifd/next';
import classNames from 'classnames';
import { getScoreLevelInfo } from '@appworks/doctor-ui/lib/config';
import styles from './index.module.scss';

const ScoreRing = (props) => {
  const { score, size } = props;

  return (
    <Progress
      shape="circle"
      percent={score}
      color={getScoreLevelInfo(score).color}
      textRender={(percent) => percent}
      className={classNames(styles.scoreBoard, {
        [styles['scoreBoard-base']]: size !== 'small',
        [styles['scoreBoard-small']]: size === 'small',
      })}
    />
  );
};

export default ScoreRing;
