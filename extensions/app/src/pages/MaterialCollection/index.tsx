import { store } from 'ice';
import React, { ReactElement, useEffect, useState } from 'react';
import { Loading, Search, Tab } from '@alifd/next';
import MaterialGroup from '@/components/MaterialGroup';
import styles from './index.module.scss';

const Material = (): ReactElement => {
  const parts = location.href.match(/\?url=(.*)$/);
  const url = parts ? parts[1] : '';

  const [{ currentCollection }, { fetchCollectionData }] = store.useModel('materials');
  const { fetchCollectionData: fetchCollectionDataStates } = store.useModelEffectsState('materials');
  const [tabActive, setTabActive] = useState<string>('scaffold');
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    fetchCollectionData(url);
  }, [url]);

  const { isLoading, error } = fetchCollectionDataStates;
  const { title = '', data: materialData } = currentCollection || {};
  let { blocks = [], components = [], scaffolds = [] } = materialData || {};

  // TODO: 处理异常 error

  function searchHandler(value): void {
    setKeyword(value);
  }
  function filterByKeyword(arr): IMaterialItem[] {
    return arr.filter((item) => {
      return (
        item.title.indexOf(keyword) > -1 || item.name.indexOf(keyword) > -1 || item.description.indexOf(keyword) > -1
      );
    });
  }

  blocks = filterByKeyword(blocks);
  components = filterByKeyword(components);
  scaffolds = filterByKeyword(scaffolds);

  return (
    <div className={styles.materialWrapper}>
      <h1 className={styles.materialTitler}>我的物料-{title}</h1>
      <Loading visible={isLoading} style={{ width: '100%' }}>
        <Tab
          contentStyle={{ height: 'calc(100vh - 140px)', overflowY: 'auto' }}
          activeKey={tabActive}
          onChange={(key: string): void => {
            setTabActive(key);
          }}
          extra={<Search shape='simple' size='medium' placeholder='请输入关键字查找物料' onChange={searchHandler} />}
        >
          <Tab.Item title='模板' key='scaffold'>
            {scaffolds.length > 0 ? (
              <MaterialGroup dataSource={scaffolds} showDownload />
            ) : (
              <div className={styles.notFound}>未找到与 {keyword} 相关的物料</div>
            )}
          </Tab.Item>
          <Tab.Item title='区块' key='block'>
            {blocks.length > 0 ? (
              <MaterialGroup dataSource={blocks} />
            ) : (
              <div className={styles.notFound}>未找到与 {keyword} 相关的物料</div>
            )}
          </Tab.Item>
          <Tab.Item title='业务组件' key='component'>
            {components.length > 0 ? (
              <MaterialGroup dataSource={components} previewText='文档' />
            ) : (
              <div className={styles.padding}>未找到与 {keyword} 相关的物料</div>
            )}
          </Tab.Item>
        </Tab>
      </Loading>
    </div>
  );
};

export default Material;
