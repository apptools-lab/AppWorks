import React from 'react';
import { Button, Loading } from '@alifd/next';
import { useRequest } from 'ahooks';
import classNames from 'classnames';
import callService from '@/callService';
import styles from './index.module.scss';

const TransformReport = ({ name, transformReport, setTransformReport }) => {
  const { name: tname, description, files } = transformReport;
  const { loading, run } = useRequest((c, n, f) => callService('codemod', 'runTransform', [c, n, f]), { initialData: [], manual: true });

  async function runTransform() {
    const data = await run(name, tname, getWantUpdateFiles());
    setTransformReport(tname, data);
  }

  function getWantUpdateFiles() {
    return files.filter(({ updated }) => !updated);
  }

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
          files.length > 0 && getWantUpdateFiles().length > 0 &&
          <Button type="secondary" className={styles.btn} onClick={runTransform}>
            Update
          </Button>
        }
      </div>
      <Loading visible={loading}>
        {
          files.length > 0 ?
            <ul className={styles.fileList}>
              {
                files.map(({ path, updated }) => {
                  return (
                    <li
                      key={path}
                      className={classNames({
                        [styles.title]: true,
                        [styles.fileItem]: true,
                      })}
                    >
                      <div className={styles.path}>{path}</div>
                      {
                        typeof updated === 'boolean' &&
                          <div
                            className={classNames({
                              [styles.updated]: true,
                              [styles.success]: updated,
                              [styles.error]: !updated,
                            })}
                          >
                            {updated ? 'Success' : 'Error'}
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
