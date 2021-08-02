import React, { useState } from 'react';
import { Element } from 'react-scroll';
import { Icon } from '@alifd/next';
import { getReportKey } from '@/config';
import callService from '@/callService';
import Appreciate from '../Appreciate';
import ReportHeader from '../ReportHeader';
import styles from './index.module.scss';

const reportKey = getReportKey('codemod');

const STATUS = {
  running: '运行中...',
  running_en: 'Running...',
  done: '已完成',
  done_en: 'Done',
};

const CodemodReport = (props) => {
  const { data = {} } = props;
  const [status, setStatus] = useState({});

  const Description = (
    <p className={styles.description}>
      {window.USE_EN ? 'Use ' : '使用 '}
      <a href="https://www.npmjs.com/package/@appworks/codemod" target="_blank" rel="noreferrer">
        @appworks/codemod
      </a>
      {window.USE_EN ? ' check your code' : ' 扫描代码'}
    </p>
  );

  const handleClick = (transform: string) => {
    setStatus({ ...status, [transform]: window.USE_EN ? STATUS.running_en : STATUS.running });
    callService(
      'common', 'executeCommand',
      'doctor.codemod', { transform },
    ).then(() => {
      setStatus({ ...status, [transform]: window.USE_EN ? STATUS.done_en : STATUS.done });
    });
  };

  return (
    <Element name={reportKey.key} className={styles.container}>
      <ReportHeader
        number={(data.reports || []).length}
        reportKey={reportKey}
        score={data.score}
        Description={Description}
      />
      {data.score === 100 && (data.reports || []).length === 0 ? (
        <Appreciate />
      ) : (
        <div>
          {(data.reports || []).map((codemod, index) => {
            return (
              <div key={`codemod${index}`} className={styles.codemod}>
                <p className={styles.title}>
                  {codemod.severity > 0 ? (
                    <Icon
                      type="warning"
                      size="small"
                      className={styles.icon}
                      style={{ color: codemod.severity === 1 ? '#ff9300' : '#ff3000' }}
                    />
                  ) : null}
                  {window.USE_EN ? codemod.title_en : codemod.title}
                </p>
                <p className={styles.message}>
                  {window.USE_EN ? codemod.message_en : codemod.message}
                  <a target="_blank" href={codemod.docs} rel="noreferrer">{window.USE_EN ? ' [docs] ' : '【文档】'}</a>
                </p>
                <div className={styles.right}>
                  {codemod.mode === 'run' ? (
                    <p>{window.USE_EN ? STATUS.done_en : STATUS.done}</p>
                  ) : (
                    <div>
                      {!status[codemod.transform] ? (
                        <a className={styles.button} onClick={() => { handleClick(codemod.transform); }}>
                          {window.USE_EN ? 'Run a Codemod' : '运行 Codemod'}
                        </a>
                      ) : (
                        <p>{status[codemod.transform]}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )
      }
    </Element>
  );
};

export default CodemodReport;
