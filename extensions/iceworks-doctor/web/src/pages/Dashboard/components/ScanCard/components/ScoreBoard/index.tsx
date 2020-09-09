import * as React from 'react';
import { Progress } from '@alifd/next';
import classNames from 'classnames';
import getScoreLevelInfo from '../../getScoreLevelInfo';
import styles from './index.module.scss';

const ScoreBoard = (props) => {
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

export default ScoreBoard;
