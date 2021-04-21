import React, { useState, useEffect, useRef } from 'react';
import { Tab, Loading } from '@alifd/next';
import { useIntl } from 'react-intl';
import * as cloneDeep from 'lodash.clonedeep';
import { useRequest } from 'ahooks';
import callService from '@/callService';
import CodeMod from '../CodeMod';
import ServerError from '@/components/ServerError';
import NotFound from '@/components/NotFound';
import styles from './index.module.scss';

const CodeMods = () => {
  const intl = useIntl();
  const [codeMods, setCodeMods] = useState([]);
  const initCon = useRef(false);
  const { loading, error, run } = useRequest(() => callService('codemod', 'getCodeMods'), { initialData: [], manual: true });

  useEffect(() => {
    async function init() {
      const data = await run();
      initCon.current = true;
      setCodeMods(data);
    }

    init();
  }, []);

  function onChangeOne(checked, cname, value) {
    const newCodeMods = cloneDeep(codeMods);
    const cIndex = codeMods.findIndex(({ name }) => name === cname);
    const tIndex = codeMods[cIndex].transforms.findIndex(({ filename }) => filename === value);
    newCodeMods[cIndex].transforms = cloneDeep(newCodeMods[cIndex].transforms);
    newCodeMods[cIndex].transforms[tIndex].checked = checked;
    setCodeMods(newCodeMods);
  }

  return (
    <Loading visible={loading} className={styles.wrap} tip={intl.formatMessage({ id: 'web.codemod.fetching' })}>
      {(!loading && codeMods.length > 0) &&
        <Tab shape="pure">
          {
            codeMods.map((codeMod) => {
              const { name: cname, description } = codeMod;
              return (
                <Tab.Item
                  title={
                    <div className={styles.title}>
                      <span>{cname}</span>
                    </div>
                  }
                  key={cname}
                >
                  <div className={styles.content}>
                    <div className={styles.description}>
                      {'>'} {description}
                    </div>
                    <CodeMod
                      codeMod={codeMod}
                      onChangeOne={onChangeOne}
                    />
                  </div>
                </Tab.Item>
              );
            })
          }
        </Tab>
      }
      {(initCon.current && !codeMods.length) && <NotFound />}
      { error && <ServerError /> }
    </Loading>
  );
};

export default CodeMods;
