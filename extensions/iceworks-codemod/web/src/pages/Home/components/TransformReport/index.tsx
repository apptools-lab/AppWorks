import React from 'react';
import { Button, Loading, Icon, Balloon, Notification } from '@alifd/next';
import { useRequest } from 'ahooks';
import classNames from 'classnames';
import ServerError from '@/components/ServerError';
import callService from '@/callService';
import { updateTransformReportFiles } from '@/util';
import styles from './index.module.scss';

const TransformReport = ({ transformReport, setTransformReport }) => {
  const { name, filePath, description, files = [] } = transformReport;
  const { loading, run, error } = useRequest((n, f) => callService('codemod', 'runTransformUpdate', n, f), { initialData: [], manual: true });
  async function runTransformUpdate() {
    const updatedFiles = await run(filePath, getWantUpdateFiles().map(({ path }) => path));
    const newTransformReport = updateTransformReportFiles(files, updatedFiles);
    setTransformReport(name, newTransformReport);
  }

  function getWantUpdateFiles() {
    return files.filter(({ updated }) => !updated);
  }

  async function handleOpenFile(fsPath) {
    try {
      await callService('common', 'openFileInEditor', fsPath);
    } catch (e) {
      Notification.error({ content: e.message });
    }
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
          okFiles.length > 0 && getWantUpdateFiles().length > 0 &&
          <Button type="secondary" className={styles.btn} onClick={runTransformUpdate}>
            Update
          </Button>
        }
      </div>
      <Loading visible={loading} className={styles.loading} tip="Updating...">
        {
          !loading && files.length > 0 &&
          <div className={styles.summary}>
            Results&nbsp;
            <Balloon align="r" trigger={<Icon type="help" size="xs" />} closable={false}>
              <ul className={styles.statusDes}>
                <li>
                  error: 解析失败的文件
                </li>
                <li>
                  unmodified: 无需更新的文件
                </li>
                <li>
                  skipped: 跳过检测的文件
                </li>
                <li>
                  ok: 需要更新的文件
                </li>
              </ul>
            </Balloon>
            &nbsp;:&nbsp;&nbsp;
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
                infoFiles.map(({ path, updated, updateMessage }) => {
                  // const StatusEle = (
                  //   <div
                  //     className={classNames({
                  //       [styles.status]: true,
                  //       [styles.green]: status === 'ok',
                  //       [styles.red]: status === 'error',
                  //     })}
                  //   >
                  //     {status}
                  //   </div>
                  // );
                  return (
                    <li
                      key={path}
                      className={classNames({
                        [styles.title]: true,
                        [styles.fileItem]: true,
                      })}
                    >
                      {/* {
                        message ?
                          <Balloon align="t" trigger={StatusEle} closable={false}>
                            {message}
                          </Balloon> :
                          StatusEle
                      } */}
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
