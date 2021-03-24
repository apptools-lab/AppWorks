import React, { useRef, useState } from 'react';
import * as cloneDeep from 'lodash.clonedeep';
import { Button, Checkbox, Loading } from '@alifd/next';
import { useRequest } from 'ahooks';
import callService from '@/callService';
import CodeModReport from '../CodeModReport';
import ServerError from '@/components/ServerError';
import Exception from '@/components/Exception';
import styles from './index.module.scss';

const CodeMod = ({ codeMod, onChangeAll, onChangeOne }) => {
  const { name: cname, transforms = [] } = codeMod;
  const initCon = useRef(false);
  const [transformsReport, setTransformsReport] = useState([]);
  const { loading, error, run } = useRequest(() => callService('codemod', 'getTransformsReport'), { initialData: [], manual: true });

  async function getTransformsReport() {
    const data = await run();
    initCon.current = true;
    setTransformsReport(data);
  }

  async function setTransformReport(tname, files) {
    const data = cloneDeep(transformsReport);
    const fIndex = data.findIndex(({ name }) => tname === name);
    data[fIndex].files = files;
    setTransformsReport(data);
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.opts}>
        <div className={styles.selectWrap}>
          <label className={styles.label}>
            <Checkbox onChange={(v) => onChangeAll(v, cname)} />
            <span>
              Select All
            </span>
          </label>
          <div className={styles.selects}>
            {
              transforms.map(({ name: tname, filePath, checked }) => {
                return (
                  <label className={styles.label} key={tname}>
                    <Checkbox
                      value={filePath}
                      onChange={(v) => onChangeOne(v, cname, filePath)}
                      checked={checked}
                    />
                    <span>
                      {tname}
                    </span>
                  </label>
                );
              })
            }
          </div>
        </div>
        <div className={styles.submit}>
          <Button type="primary" onClick={getTransformsReport}>
            Scan
          </Button>
        </div>
      </div>
      <Loading visible={loading} className={styles.report}>
        {(!loading && transformsReport.length > 0) &&
          <CodeModReport
            name={cname}
            transforms={transformsReport}
            setTransformReport={setTransformReport}
            setTransformsReport={setTransformsReport}
          />
        }
        {(initCon.current && !transformsReport.length) &&
          <Exception
            statusCode="404"
            image="https://img.alicdn.com/tfs/TB11TaSopY7gK0jSZKzXXaikpXa-200-200.png"
            description="没有需要更新的文件"
          />
        }
        { error && <ServerError /> }
      </Loading>
    </div>
  );
};

export default CodeMod;
