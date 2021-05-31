import * as React from 'react';
import { Element } from 'react-scroll';
import { Balloon, Icon } from '@alifd/next';
import { getScoreLevelInfo } from '@appworks/doctor-ui/lib/config';
import callService from '@/callService';
import Appreciate from '../Appreciate';
import ReportHeader from '../ReportHeader';
import styles from './index.module.scss';

const { Tooltip } = Balloon;

function getMessagesLength(reports): number {
  let length = 0;

  (reports || []).forEach((report) => {
    try {
      length += report.messages.length;
    } catch (e) {
      // ignore
    }
  });

  return length;
}

const EslintMessages = (props) => {
  const { reportKey, reports, score, Description } = props;

  const openFile = (item) => {
    const { filePath, line, column, endLine, endColumn } = item;
    callService('action', 'open', { filePath, line, column, endLine, endColumn });
  };

  return (
    <Element name={reportKey.key} className={styles.container}>
      <ReportHeader number={getMessagesLength(reports)} reportKey={reportKey} score={score} Description={Description} />
      {score === 100 ? (
        <Appreciate />
      ) : (
        <div className={styles.wrap}>
          {(reports || []).map((report, index) => {
            if (!report.messages || report.messages.length === 0) return null;
            return (
              <div className={styles.item} key={`report${index}`}>
                <a className={styles.file}>{report.filePath}</a>

                {(report.messages || []).map((message, idx) => {
                  const messageItem = (
                    <p className={styles.detail}>
                      <span className={styles.positionInfo}>
                        {message.line}:{message.column}
                      </span>
                      {message.message}
                    </p>
                  );

                  return (
                    <div
                      className={styles.message}
                      key={`message${idx}`}
                      onClick={() => {
                        openFile({ ...message, filePath: report.filePath });
                      }}
                    >
                      {message.severity === 2 ? (
                        <Icon
                          type="error"
                          size="small"
                          className={styles.icon}
                          style={{ color: getScoreLevelInfo(0).color }}
                        />
                      ) : (
                        <Icon
                          type="warning"
                          size="small"
                          className={styles.icon}
                          style={{ color: getScoreLevelInfo(60).color }}
                        />
                      )}
                      <Tooltip delay={100} align="t" trigger={messageItem} className={styles.tooltip}>
                        <p className={styles.ruleId}>{message.ruleId}</p>
                        <p className={styles.messageText}>{message.message}</p>
                      </Tooltip>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </Element>
  );
};

export default EslintMessages;
