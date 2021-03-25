import React from 'react';
import { Button, Loading } from '@alifd/next';
import { useRequest } from 'ahooks';
import classNames from 'classnames';
import callService from '@/callService';
import ServerError from '@/components/ServerError';
import TransformReport from '../TransformReport';
import styles from './index.module.scss';

const CodeModReport = ({ name, transforms = [], setTransformReport, setTransformsReport }) => {
  const { loading, run, error } = useRequest((c, f) => callService('codemod', 'runTransforms', [c, f]), { initialData: [], manual: true });
  async function runTransforms() {
    const data = await run(name, transforms);
    setTransformsReport(data);
  }

  return (
    <div className={styles.wrap}>
      <div
        className={classNames({
          [styles.title]: true,
          [styles.header]: true,
        })}
      >
        <div>
          {name}
        </div>
        <Button type="secondary" className={styles.btn} onClick={runTransforms}>
          Update All
        </Button>
      </div>
      <Loading visible={loading} className={styles.transformList} tip="Updating...">
        {
          transforms.map((transform) => {
            return (
              <TransformReport
                key={transform.name}
                name={name}
                transformReport={transform}
                setTransformReport={setTransformReport}
              />
            );
          })
        }
        { error && <ServerError /> }
      </Loading>
    </div>
  );
};

export default CodeModReport;
