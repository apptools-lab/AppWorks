import React, { useState, useEffect } from 'react';
import { Tab, Icon, Loading } from '@alifd/next';
import * as cloneDeep from 'lodash.clonedeep';
import { useRequest } from 'ahooks';
import callService from '@/callService';
import CodeMod from '../CodeMod';
import ServerError from '@/components/ServerError';
import NotFound from '@/components/NotFound';
import styles from './index.module.scss';

const CodeMods = () => {
  const [codeMods, setCodeMods] = useState([]);
  const { data, loading, error } = useRequest(() => callService('codemod', 'getCodeMods'), { initialData: [] });

  useEffect(() => {
    setCodeMods(data);
  }, [data]);

  function onChangeAll(checked, cname) {
    const newCodeMods = cloneDeep(codeMods);
    const cIndex = codeMods.findIndex(({ name }) => name === cname);
    newCodeMods[cIndex].transforms = codeMods[cIndex].transforms.map((transform) => {
      return {
        ...transform,
        checked,
      };
    });
    setCodeMods(newCodeMods);
  }
  function onChangeOne(checked, cname, value) {
    const newCodeMods = cloneDeep(codeMods);
    const cIndex = codeMods.findIndex(({ name }) => name === cname);
    const tIndex = codeMods[cIndex].transforms.findIndex(({ filePath }) => filePath === value);
    newCodeMods[cIndex].transforms = cloneDeep(newCodeMods[cIndex].transforms);
    newCodeMods[cIndex].transforms[tIndex].checked = checked;
    setCodeMods(newCodeMods);
  }

  return (
    <Loading visible={loading} className={styles.wrap}>
      {(!loading && codeMods.length > 0) &&
        <Tab shape="pure">
          {
            codeMods.map((codeMod) => {
              const { name: cname, description, transforms = [] } = codeMod;
              const hasChecked = transforms.findIndex(({ checked }) => checked === true) > -1;
              return (
                <Tab.Item
                  title={
                    <div className={styles.title}>
                      {hasChecked && <Icon type="success-filling" />}
                      <span>{cname}</span>
                    </div>
                  }
                  key={cname}
                >
                  <div className={styles.content}>
                    <div className={styles.description}>
                      {description}
                    </div>
                    <CodeMod
                      codeMod={codeMod}
                      onChangeAll={onChangeAll}
                      onChangeOne={onChangeOne}
                    />
                  </div>
                </Tab.Item>
              );
            })
          }
        </Tab>
      }
      {(!loading && !codeMods.length) && <NotFound />}
      { error && <ServerError /> }
    </Loading>
  );
};

export default CodeMods;
