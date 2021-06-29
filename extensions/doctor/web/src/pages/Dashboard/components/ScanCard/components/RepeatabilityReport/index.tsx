import * as React from 'react';
import { Element } from 'react-scroll';
import { Icon } from '@alifd/next';
import Code from 'react-code-space';
import { getReportKey } from '@/config';
import callService from '@/callService';
import Appreciate from '../Appreciate';
import ReportHeader from '../ReportHeader';
import styles from './index.module.scss';

const reportKey = getReportKey('repeatability');

const Description = () => {
  return (
    <p className={styles.description}>
      {window.USE_EN ? 'Use ' : '使用 '}
      <a href="https://www.npmjs.com/package/@jscpd/core" target="_blank" rel="noreferrer">
        jscpd
      </a>
      {window.USE_EN ? ' scan your code' : ' 扫描代码'}
    </p>
  );
};

const RepeatabilityReport = (props) => {
  const { data = {} } = props;

  const openFile = (item) => {
    const { sourceId, start, end } = item;
    callService('action', 'open', {
      filePath: sourceId,
      line: start.line,
      column: start.column,
      endLine: end.line,
      endColumn: end.column,
    });
  };

  return (
    <Element name={reportKey.key} className={styles.container}>
      <ReportHeader
        number={(data.clones || []).length}
        reportKey={reportKey}
        score={data.score}
        Description={<Description />}
      />

      {data.score === 100 ? (
        <Appreciate />
      ) : (
        <div>
          {(data.clones || []).map((clone, index) => {
            const duplicationA = clone.duplicationA || {};
            const duplicationB = clone.duplicationB || {};

            return (
              <div key={`clone${index}`} className={styles.clone}>
                <p className={styles.title}> {window.USE_EN ? 'Similar code detected' : '检测到相似重复代码'} </p>

                <a
                  className={styles.file}
                  onClick={() => {
                    openFile(duplicationA);
                  }}
                >
                  <Icon type="copy" size="small" />
                  {duplicationA.sourceId}
                </a>
                {index === 0 ? (
                  <Code dark theme="material" language="jsx">
                    <Code.Body numbered start={duplicationA.start.line} content={duplicationA.fragment} />
                  </Code>
                ) : null}
                <a
                  className={styles.file}
                  onClick={() => {
                    openFile(duplicationB);
                  }}
                >
                  <Icon type="copy" size="small" />
                  {duplicationB.sourceId}
                </a>
                {index === 0 ? (
                  <Code dark theme="material" language="jsx">
                    <Code.Body
                      numbered
                      start={duplicationB.start.line}
                      highlight={`${duplicationB.start.line}-${duplicationB.end.line}`}
                      content={duplicationB.fragment}
                    />
                  </Code>
                ) : null}
                <p className={styles.tips}>
                  <Icon type="prompt" size="small" />
                  {window.USE_EN
                    ? 'We recommend that you extract common code to reduce code duplication.'
                    : '建议提取公共代码，减低代码重复度'}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </Element>
  );
};

export default RepeatabilityReport;
