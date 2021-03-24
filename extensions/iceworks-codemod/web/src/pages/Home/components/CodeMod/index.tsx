import React, { useRef, useState } from 'react';
import * as cloneDeep from 'lodash.clonedeep';
import { Button, Checkbox, Loading } from '@alifd/next';
import { useRequest } from 'ahooks';
import callService from '@/callService';
import Report from '../Report';
import ServerError from '@/components/ServerError';
import Exception from '@/components/Exception';
import styles from './index.module.scss';

const CodeMod = ({ codeMod, onChangeAll, onChangeOne }) => {
  const { name: cname, transforms = [] } = codeMod;
  const initCon = useRef(false);
  const [transformReports, setTransformReports] = useState([]);
  const { loading, run, error } = useRequest(() => callService('codemod', 'getReports'), { initialData: [], manual: true });

  async function getReports() {
    const data = await run();
    initCon.current = true;
    setTransformReports(data);
  }

  async function setTransformReport(tname, files) {
    const newData = cloneDeep(transformReports);
    const fIndex = newData.findIndex(({ name }) => tname === name);
    newData[fIndex].files = files;
    setTransformReports(newData);
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
          <Button type="primary" onClick={getReports}>
            Scan
          </Button>
        </div>
      </div>
      <Loading visible={loading} className={styles.report}>
        {(!loading && transformReports.length > 0) && <Report name={cname} transforms={transformReports} setTransformReport={setTransformReport} setTransformReports={setTransformReports} />}
        {(initCon.current && !transformReports.length) &&
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
