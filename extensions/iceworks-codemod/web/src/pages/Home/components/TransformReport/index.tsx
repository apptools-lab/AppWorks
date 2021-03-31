import React from 'react';
import { Button, Loading, Balloon, Notification } from '@alifd/next';
import { useRequest } from 'ahooks';
import classNames from 'classnames';
import ServerError from '@/components/ServerError';
import callService from '@/callService';
import { updateTransformReportFiles } from '@/util';
import styles from './index.module.scss';

const TransformReport = ({ transformReport, setTransformReport }) => {
  const { name, filePath, description, files = [] } = transformReport;
  const wantUpdateFiles = files.filter(({ updated, status }) => !updated && status === 'ok');
  const { loading, run, error } = useRequest((n, f) => callService('codemod', 'runTransformUpdate', n, f), { initialData: [], manual: true });
  async function runTransformUpdate() {
    const updatedFiles = await run(filePath, wantUpdateFiles.map(({ path }) => path));
    const newTransformReport = updateTransformReportFiles(files, updatedFiles);
    setTransformReport(name, newTransformReport);
  }
  async function handleOpenFile(fsPath) {
    try {
      await callService('common', 'openFileInEditor', fsPath);
    } catch (e) {
      Notification.error({ content: e.message });
    }
  }

  const okFiles = files.filter((fileInfo) => {
    const { status } = fileInfo;
    return status === 'ok';
  });
  const infoFiles = okFiles;

  return (
    <div key={name} className={styles.transformItem}>
      <div
        className={classNames({
          [styles.title]: true,
          [styles.header]: true,
        })}
      >
        <div>
          <span>{name}</span>
          <p>{description}</p>
        </div>
        {
          okFiles.length > 0 && wantUpdateFiles.length > 0 &&
          <Button type="secondary" className={styles.btn} onClick={runTransformUpdate}>
            Update
          </Button>
        }
      </div>
      <Loading visible={loading} className={styles.loading} tip="Updating...">
        {
          !loading && files.length > 0 &&
          <div className={styles.summary}>
            Results:&nbsp;
            <span className={styles.green}>{okFiles.length} files match</span>.
          </div>
        }
        {
          infoFiles.length > 0 ?
            <ul className={styles.fileList}>
              {
                infoFiles.map(({ path, updated, updateMessage }) => {
                  return (
                    <li
                      key={path}
                      className={classNames({
                        [styles.title]: true,
                        [styles.fileItem]: true,
                      })}
                    >
                      <div className={styles.path} onClick={() => handleOpenFile(path)}>{path}</div>
                      {
                        typeof updated === 'boolean' &&
                          <Balloon
                            align="t"
                            trigger={
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
                            closable={false}
                          >
                            {updateMessage || 'Done'}
                          </Balloon>
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
        { error && <ServerError /> }
      </Loading>
    </div>
  );
};

export default TransformReport;
