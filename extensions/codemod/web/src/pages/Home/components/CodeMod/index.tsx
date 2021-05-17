import React, { useRef, useEffect, useState } from 'react';
import * as cloneDeep from 'lodash.clonedeep';
import { Button, Checkbox, Balloon } from '@alifd/next';
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
  const logEl = useRef(null);
  const intl = useIntl();
  const [transformsReport, setTransformsReport] = useState([]);
  const [logs, setLogs] = useState([]);
  const { loading, error, run } = useRequest((t, c) => callService('codemod', 'getTransformsReport', t, c), { initialData: [], manual: true });

  async function getTransformsReport() {
    // 赛选出所有勾选了的转换器
    setLogs([]);
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

  useEffect(() => {
    window.addEventListener('message', ({ data }) => {
      const { eventId, text } = data;
      if (eventId === 'codemodMessage') {
        setLogs((ls) => {
          return ls.concat(text);
        });
        logEl.current.scrollTop = logEl.current.scrollHeight;
      }
    });
  }, []);

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
      <div className={styles.report}>
        {loading &&
        <div className={styles.logs} ref={logEl}>
          <div>
            <div>
              {intl.formatMessage({ id: 'web.codemod.main.scan.title' })}
              {intl.formatMessage({ id: 'web.codemod.main.scan.content' })}
            </div>
          </div>
          {
            logs.map((log, idx) => {
              return (<p key={idx}>{'> ' + log}</p>);
            })
          }
        </div>}
        {(!loading && transformsReport.length > 0) &&
          <CodeModReport
            name={cname}
            transformsReport={transformsReport}
            setTransformReport={setTransformReport}
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
      </div>
    </div>
  );
};

export default CodeMod;
