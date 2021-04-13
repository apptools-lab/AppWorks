import React, { useRef, useState } from 'react';
import * as cloneDeep from 'lodash.clonedeep';
import { Button, Checkbox, Loading, Balloon } from '@alifd/next';
import { useRequest } from 'ahooks';
import { useIntl } from 'react-intl';
import callService from '@/callService';
import CodeModReport from '../CodeModReport';
import ServerError from '@/components/ServerError';
import Exception from '@/components/Exception';
import styles from './index.module.scss';

const CodeMod = ({ codeMod, onChangeOne }) => {
  const { name: cname, transforms = [] } = codeMod;
  const initCon = useRef(false);
  const intl = useIntl();
  const [transformsReport, setTransformsReport] = useState([]);
  const { loading, error, run } = useRequest((t, c) => callService('codemod', 'getTransformsReport', t, c), { initialData: [], manual: true });

  async function getTransformsReport() {
    // 赛选出所有勾选了的转换器
    const checkedTransforms = transforms.filter(({ checked }) => checked);
    const data = await run(checkedTransforms, cname);
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
          {/* <label className={styles.label}>
            <Checkbox onChange={(v) => onChangeAll(v, cname)} />
            <span>
              Select All
            </span>
          </label> */}
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
            {intl.formatMessage({ id: 'web.codemod.main.scan' })}
          </Button>
        </div>
      </div>
      <Loading
        visible={loading}
        className={styles.report}
        tip={(
          <div>
            {intl.formatMessage({ id: 'web.codemod.main.scan.title' })}
            <br />
            {intl.formatMessage({ id: 'web.codemod.main.scan.content' })}
          </div>
        )}
      >
        {(!loading && transformsReport.length > 0) &&
          <CodeModReport
            name={cname}
            transformsReport={transformsReport}
            setTransformReport={setTransformReport}
            // setTransformsReport={setTransformsReport}
          />
        }
        {(initCon.current && !transformsReport.length) &&
          <Exception
            statusCode="404"
            image="https://img.alicdn.com/tfs/TB11TaSopY7gK0jSZKzXXaikpXa-200-200.png"
            description={intl.formatMessage({ id: 'web.codemod.main.scan.notfound' })}
          />
        }
        { error && <ServerError /> }
      </Loading>
    </div>
  );
};

export default CodeMod;
