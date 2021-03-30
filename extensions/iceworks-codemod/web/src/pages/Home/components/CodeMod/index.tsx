import React, { useRef, useState } from 'react';
import * as cloneDeep from 'lodash.clonedeep';
import { Button, Checkbox, Loading, Balloon } from '@alifd/next';
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
  const { loading, error, run } = useRequest((t) => callService('codemod', 'getTransformsReport', t), { initialData: [], manual: true });

  async function getTransformsReport() {
    // 赛选出所有勾选了的转换器
    const checkedTransforms = transforms.filter(({ checked }) => checked);
    const data = await run(checkedTransforms);
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
              transforms.map(({ name: tname, description, filename, checked }) => {
                const nameEle = (
                  <span>
                    {tname}
                  </span>
                );
                return (
                  <label className={styles.label} key={tname}>
                    <Checkbox
                      value={filename}
                      onChange={(v) => onChangeOne(v, cname, filename)}
                      checked={checked}
                    />
                    <Balloon align="t" trigger={nameEle} closable={false}>
                      {description || tname}
                    </Balloon>
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
      <Loading visible={loading} className={styles.report} tip={(<div>Scanning, this may take a few minutes or more...<br />(depending on the number of files in the project)</div>)}>
        {(!loading && transformsReport.length > 0) &&
          <CodeModReport
            name={cname}
            transformsReport={transformsReport}
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
