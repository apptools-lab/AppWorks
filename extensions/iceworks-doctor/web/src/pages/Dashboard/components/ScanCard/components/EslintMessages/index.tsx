import * as React from 'react';
import { Balloon, Icon } from '@alifd/next';
import { getScoreLevelInfo } from '@/config';
import styles from './index.module.scss';

const Tooltip = Balloon.Tooltip;

export function getMessagesLength(reports): number {
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

const ScoreBoard = (props) => {
  const { reports } = props;

  return (
    <div className={styles.container}>
      {(reports || []).map((report, index) => {
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
                <div className={styles.message} key={`message${idx}`}>
                  <Icon
                    type="error"
                    size="small"
                    className={styles.icon}
                    style={{ color: getScoreLevelInfo(0).color }}
                  />
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
  );
};

export default ScoreBoard;
