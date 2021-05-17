import React from 'react';
import { Button, Loading, Balloon, Notification } from '@alifd/next';
import { useRequest } from 'ahooks';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import ServerError from '@/components/ServerError';
import callService from '@/callService';
import { updateTransformReportFiles } from '@/util';
import styles from './index.module.scss';

const TransformReport = ({ name: cname, transformReport, setTransformReport }) => {
  const intl = useIntl();
  const { name, filePath, description, files = [] } = transformReport;
  const wantUpdateFiles = files.filter(({ updated, status }) => !updated && status === 'ok');
  const { loading, run, error } = useRequest((n, c, f) => callService('codemod', 'runTransformUpdate', n, c, f), { initialData: [], manual: true });
  async function runTransformUpdate() {
    const updatedFiles = await run(filePath, cname, wantUpdateFiles.map(({ path }) => path));
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
            {intl.formatMessage({ id: 'web.codemod.update' })}
          </Button>
        }
      </div>
      <Loading visible={loading} className={styles.loading} tip={intl.formatMessage({ id: 'web.codemod.updating' })}>
        {
          !loading && files.length > 0 &&
          <div className={styles.summary}>
            {intl.formatMessage({ id: 'web.codemod.result' })}&nbsp;
            <span className={styles.green}>{okFiles.length} {intl.formatMessage({ id: 'web.codemod.fileMatch' })}</span>.
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
              {intl.formatMessage({ id: 'web.codemod.scan.notfound' })}.
            </div>
        }
        { error && <ServerError /> }
      </Loading>
    </div>
  );
};

export default TransformReport;
