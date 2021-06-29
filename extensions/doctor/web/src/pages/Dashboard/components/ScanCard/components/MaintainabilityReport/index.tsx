import * as React from 'react';
import { Element } from 'react-scroll';
import { Balloon, Icon } from '@alifd/next';
import { getReportKey } from '@/config';
import { getScoreLevelInfo } from '@appworks/doctor-ui/lib/config';
import callService from '@/callService';
import Appreciate from '../Appreciate';
import ReportHeader from '../ReportHeader';
import styles from './index.module.scss';

const { Tooltip } = Balloon;

const reportKey = getReportKey('maintainability');

const Description = () => {
  return (
    <div className={styles.description}>
      <p className={styles.title}>
        {window.USE_EN ? 'Use ' : '使用 '}
        <a href="https://www.npmjs.com/package/typhonjs-escomplex" target="_blank" rel="noreferrer">
          typhonjs-escomplex
        </a>
        {window.USE_EN ? 'scan your code ' : '扫描代码 '}
      </p>
      <div className={styles.message}>
        {window.USE_EN ? 'Explanation: ' : '指标：'}
        <Tooltip
          delay={100}
          align="t"
          trigger={
            <p className={styles.info}>
              <Icon type="prompt" size="xs" /> {window.USE_EN ? 'Cyclomatic Complexity ' : '圈复杂度 '}
            </p>
          }
        >
          <p>
            {window.USE_EN
              ? 'This metric counts the number of distinct paths through a block of code. Lower values are better.'
              : '此指标计算通过代码块的不同路径的数量。值越低越好。'}
            <a href="https://en.wikipedia.org/wiki/Cyclomatic_complexity" target="_blank" rel="noreferrer">
              https://en.wikipedia.org/wiki/Cyclomatic_complexity
            </a>
          </p>
        </Tooltip>
        <Tooltip
          delay={100}
          align="t"
          trigger={
            <p className={styles.info}>
              <Icon type="prompt" size="xs" />
              {window.USE_EN ? 'Difficulty ' : '可读性 '}
            </p>
          }
        >
          <p>
            {window.USE_EN
              ? 'The difficulty measure is related to the difficulty of the program to write or understand. Lower values are better.'
              : '难度测量与程序编写或理解的难度有关。值越低越好。'}
          </p>
        </Tooltip>
      </div>
    </div>
  );
};

const MaintainabilityReport = (props) => {
  const { data = {} } = props;

  const openFile = (item) => {
    const { filePath } = item;
    // VSCode position start with 1
    callService('action', 'open', { filePath, line: 1, column: 1, endLine: 1, endColumn: 1 });
  };

  return (
    <Element name={reportKey.key} className={styles.container}>
      <ReportHeader
        number={(data.reports || []).length}
        reportKey={reportKey}
        score={data.score}
        Description={<Description />}
      />
      {data.score === 100 ? (
        <Appreciate />
      ) : (
        <div>
          {(data.reports || []).map((report, index) => {
            const aggregate = report.aggregate || {};
            const lineNumber = aggregate.sloc && aggregate.sloc.physical;
            const { cyclomatic } = aggregate;
            const difficulty = (aggregate.halstead && aggregate.halstead.difficulty) || 0;
            const { maintainability } = report;
            return (
              <div
                key={`report${index}`}
                className={styles.report}
                onClick={() => {
                  openFile(report);
                }}
              >
                <a className={styles.file}>{report.filePath}</a>
                <div className={styles.card}>
                  <p className={styles.info} style={{ flex: 0, marginRight: 10 }}>
                    {window.USE_EN ? 'LoC ' : '行数 '}
                    {lineNumber}
                  </p>
                  <p className={styles.info}>
                    {window.USE_EN ? 'Cyclomatic Complexity ' : '圈复杂度 '}
                    {cyclomatic}
                  </p>
                  <p className={styles.info}>
                    {window.USE_EN ? 'Difficulty ' : '可读性 '}
                    {difficulty}
                  </p>
                  <p className={styles.info}>
                    {window.USE_EN ? 'Maintainability ' : '可维护度 '}
                    <span style={{ color: getScoreLevelInfo(maintainability).color }}>
                      {maintainability.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Element>
  );
};

export default MaintainabilityReport;
