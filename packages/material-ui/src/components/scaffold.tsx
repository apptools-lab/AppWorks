import * as React from 'react';
import { Icon } from '@alifd/next';
import { IMaterialScaffold, PLACEHOLDER_IMG } from '@appworks/material-utils';
import styles from './scaffold.module.scss';

export const MaterialScaffold: React.FC<{
  dataSource: IMaterialScaffold;
  onDownload?: (dataSource: IMaterialScaffold) => void;
  selected?: boolean;
  hiddenDownloadButton?: boolean;
  onClick?: any;
}> = ({ dataSource, onDownload, selected, hiddenDownloadButton, onClick }) => {
  function handleDownload() {
    onDownload && onDownload(dataSource);
  }

  return (
    <div className={styles.scaffold} style={selected ? { border: '1px solid #2f54eb' } : {}}>
      <div className={styles.body} onClick={onClick}>
        <div className={styles.screenshots}>
          {dataSource.isNewlyCreated ? <div className={styles.newly}>NEW</div> : null}
          {selected ? (
            <div className={styles.selected}>
              <Icon style={{ fontSize: '20px', color: '#2f54eb' }} type="check-circle" />
            </div>
          ) : null}
          {dataSource.screenshots && dataSource.screenshots.length ? (
            <img
              alt={dataSource.title}
              src={dataSource.screenshots[0] || PLACEHOLDER_IMG}
              draggable={false}
              className={styles.screenshotImg}
            />
          ) : (
            <img
              alt={dataSource.title}
              draggable={false}
              src={dataSource.screenshot || PLACEHOLDER_IMG}
              className={styles.screenshotImg}
            />
          )}
        </div>

        <div className={styles.info}>
          <div className={styles.title}>{dataSource.title}</div>
          <div className={styles.desc}>{dataSource.description || '-'}</div>
        </div>
      </div>

      <div className={styles.actions}>
        <a href={dataSource.homepage} rel="noopener noreferrer" target="_blank" className={styles.button}>
          预览
        </a>
        <a href={dataSource.repository} rel="noopener noreferrer" target="_blank" className={styles.button}>
          源码
        </a>
        {hiddenDownloadButton ? null : (
          <a className={styles.button} onClick={handleDownload}>
            Download
          </a>
        )}
      </div>
    </div>
  );
};
