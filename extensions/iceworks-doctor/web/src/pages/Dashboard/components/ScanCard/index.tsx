import React, { useState } from 'react';
import { Affix, Button, Loading } from '@alifd/next';
import classNames from 'classnames';
import Code from 'react-code-space';
import { Link, Element, animateScroll as scroll } from 'react-scroll';
import ScoreBoard from './components/ScoreBoard';
import getScoreLevelInfo, { scoreLevelInfos } from './getScoreLevelInfo';
import styles from './index.module.scss';

const ScanCard = () => {
  const [scoresAffixed, setScoresAffixed] = useState(false);

  const scoreBoradSize = scoresAffixed ? 'small' : 'normal';

  const scrollToTop = () => {
    scroll.scrollToTop({
      duration: 200,
    });
  };

  const codeString = `
  // 111
  const t = 1;
  t++;
  `;

  return (
    <Loading tip="代码扫描中" size="large" style={{ display: 'block' }} visible={false}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.infos}>
            <div className={styles.info}>
              <p className={styles.title}>项目评分</p>
              <p className={styles.score} style={{ color: getScoreLevelInfo(71.11).color }}>
                71.11
              </p>
            </div>

            <div className={styles.info}>
              <p className={styles.title}>项目规模</p>
              <p className={styles.detail}>文件总数 39 个</p>
              <p className={styles.label}>总行数/平均行数</p>
              <p className={styles.detail}>5736/200</p>
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

        <Affix
          style={{ zIndex: 999 }}
          onAffix={(affixed) => {
            setScoresAffixed(affixed);
          }}
        >
          <div className={classNames(styles.scores, { [styles['scores-affixed']]: scoresAffixed })}>
            <Link
              to="test1"
              spy
              smooth
              duration={200}
              activeClass={styles['scoreInfo-active']}
              className={styles.scoreInfo}
            >
              <ScoreBoard score={95.99} size={scoreBoradSize} />
              {scoresAffixed ? null : <p>最佳实践</p>}
            </Link>

            <Link
              to="test2"
              spy
              smooth
              duration={200}
              activeClass={styles['scoreInfo-active']}
              className={styles.scoreInfo}
            >
              <ScoreBoard score={75.99} size={scoreBoradSize} />
              {scoresAffixed ? null : <p>安全实践</p>}
            </Link>

            <Link
              to="test3"
              spy
              smooth
              duration={200}
              activeClass={styles['scoreInfo-active']}
              className={styles.scoreInfo}
            >
              <ScoreBoard score={85.99} size={scoreBoradSize} />
              {scoresAffixed ? null : <p>阿里规约</p>}
            </Link>

            <Link
              to="test4"
              spy
              smooth
              duration={200}
              activeClass={styles['scoreInfo-active']}
              className={styles.scoreInfo}
            >
              <ScoreBoard score={55.99} size={scoreBoradSize} />
              {scoresAffixed ? null : <p>代码可维护度</p>}
            </Link>

            <Link
              to="test5"
              spy
              smooth
              duration={200}
              activeClass={styles['scoreInfo-active']}
              className={styles.scoreInfo}
            >
              <ScoreBoard score={59.55} size={scoreBoradSize} />
              {scoresAffixed ? null : <p>代码重复度</p>}
            </Link>
          </div>
        </Affix>

        <div style={{ position: 'relative', width: 100, height: 20000 }}>
          <Element
            name="test1"
            onClick={scrollToTop}
            style={{ position: 'relative', backgroundColor: '#666', width: 300, height: 4000 }}
          >
            <Code dark theme="material" language="jsx">
              <Code.Body numbered start={11} highlight="13-14" content={codeString} />
              <Code.Doc>Some simple text explaining the code above or below.</Code.Doc>
            </Code>
          </Element>
          <Element
            name="test2"
            onClick={scrollToTop}
            style={{ position: 'relative', backgroundColor: '#999', width: 100, height: 4000 }}
          />
          <Element
            name="test3"
            onClick={scrollToTop}
            style={{ position: 'relative', backgroundColor: '#333', width: 100, height: 4000 }}
          />
          <Element
            name="test4"
            onClick={scrollToTop}
            style={{ position: 'relative', backgroundColor: '#fff', width: 100, height: 4000 }}
          />
          <Element
            name="test5"
            onClick={scrollToTop}
            style={{ position: 'relative', backgroundColor: '#000', width: 100, height: 4000 }}
          />
        </div>

        <div>
          <Button type="primary" size="large">
            一键修复
          </Button>
        </div>
      </div>
    </Loading>
  );
};

export default ScanCard;
