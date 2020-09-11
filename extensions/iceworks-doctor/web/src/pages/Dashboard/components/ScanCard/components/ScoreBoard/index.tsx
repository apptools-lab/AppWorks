import React, { useState, useEffect } from 'react';
import { Affix } from '@alifd/next';
import { Link } from 'react-scroll';
import classNames from 'classnames';
import { reportKeys, IReportKeys } from '@/config';
import ScoreRing from '../ScoreRing';
import styles from './index.module.scss';

const ScoreBoard = (props) => {
  const { data, onAffix } = props;

  const [resizeTemp, setResizeTemp] = useState(0);
  const [scoresAffixed, setScoresAffixed] = useState(false);
  const ScoreRingSize = scoresAffixed ? 'small' : 'normal';

  useEffect(() => {
    window.addEventListener('optimizedResize', () => {
      setResizeTemp(Date.now());
    });
  }, []);

  return (
    <Affix
      key={resizeTemp}
      style={{ zIndex: 999 }}
      onAffix={(affixed) => {
        onAffix(affixed);
        setScoresAffixed(affixed);
      }}
    >
      <div className={classNames(styles.scores, { [styles['scores-affixed']]: scoresAffixed })}>
        {reportKeys.map((reportKey: IReportKeys) => {
          return (
            <Link
              spy
              smooth
              offset={-70}
              to={reportKey.key}
              key={reportKey.key}
              duration={200}
              activeClass={styles['scoreInfo-active']}
              className={styles.scoreInfo}
            >
              <ScoreRing score={data[reportKey.key].score} size={ScoreRingSize} />
              {scoresAffixed ? null : <p>{window.USE_EN ? reportKey.nameEn : reportKey.name}</p>}
            </Link>
          );
        })}
      </div>
    </Affix>
  );
};

export default ScoreBoard;
