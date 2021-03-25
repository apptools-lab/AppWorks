import React from 'react';
import { Button, Loading, Balloon } from '@alifd/next';
import { useRequest } from 'ahooks';
import classNames from 'classnames';
import callService from '@/callService';
import styles from './index.module.scss';

const TransformReport = ({ name, transformReport, setTransformReport }) => {
  const { name: tname, description, files = [] } = transformReport;
  const { loading, run } = useRequest((c, n, f) => callService('codemod', 'runTransform', [c, n, f]), { initialData: [], manual: true });

  async function runTransform() {
    const data = await run(name, tname, getWantUpdateFiles());
    setTransformReport(tname, data);
  }

  function getWantUpdateFiles() {
    return files.filter(({ updated }) => !updated);
  }

  const errorFiles = [];
  let unmodifiedFileLength = 0;
  let skippedFileLength = 0;
  const okFiles = files.filter((fileInfo) => {
    const { status } = fileInfo;
    if (status === 'error') {
      errorFiles.push(fileInfo);
    }
    if (status === 'nochange') {
      unmodifiedFileLength++;
    }
    if (status === 'skip') {
      skippedFileLength++;
    }
    return status === 'ok';
  });
  const infoFiles = okFiles;

  return (
    <div key={tname} className={styles.transformItem}>
      <div
        className={classNames({
          [styles.title]: true,
          [styles.header]: true,
        })}
      >
        <div>
          <span>{tname}</span>
          <p>{description}</p>
        </div>
        {
          okFiles.length > 0 && getWantUpdateFiles().length > 0 &&
          <Button type="secondary" className={styles.btn} onClick={runTransform}>
            Update
          </Button>
        }
      </div>
      <Loading visible={loading} className={styles.loading}>
        {
          !loading && files.length > 0 &&
          <div className={styles.summary}>
            Results:&nbsp;
            <span className={styles.red}>{errorFiles.length} errors</span>,&nbsp;
            <span className={styles.yellow}>{unmodifiedFileLength} unmodified</span>,&nbsp;
            <span className={styles.yellow}>{skippedFileLength} skipped</span>,&nbsp;
            <span className={styles.green}>{okFiles.length} ok</span>.
          </div>
        }
        {
          infoFiles.length > 0 ?
            <ul className={styles.fileList}>
              {
                infoFiles.map(({ path, updated, status, message }) => {
                  const StatusEle = (
                    <div
                      className={classNames({
                        [styles.status]: true,
                        [styles.green]: status === 'ok',
                        [styles.red]: status === 'error',
                      })}
                    >
                      {status}
                    </div>
                  );
                  return (
                    <li
                      key={path}
                      className={classNames({
                        [styles.title]: true,
                        [styles.fileItem]: true,
                      })}
                    >
                      {
                        message ?
                          <Balloon align="t" trigger={StatusEle} closable={false}>
                            {message}
                          </Balloon> :
                          StatusEle
                      }
                      <div className={styles.path}>{path}</div>
                      {
                        typeof updated === 'boolean' &&
                          <div
                            className={classNames({
                              [styles.updated]: true,
                              [styles.green]: updated,
                              [styles.red]: !updated,
                            })}
                          >
                            {updated ? 'Success' : 'Fail'}
                          </div>
                      }
                    </li>
                  );
                })
              }
            </ul> :
            <div className={styles.noFiles}>
              No match files.
            </div>
        }
      </Loading>
    </div>
  );
};

export default TransformReport;
