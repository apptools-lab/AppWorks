import React, { useEffect } from 'react';
import { Tab } from '@alifd/next';
import { IMaterialSource } from '@iceworks/material-utils';
import callService from '@/callService';
import styles from './index.module.scss';

interface IMaterialsPane {
  source: IMaterialSource
}

const tabs = [
  { tab: '区块', key: 'blocks', content: '' },
  { tab: '组件', key: 'components', content: '' }
]
const MaterialsPane: React.FC<IMaterialsPane> = ({ source }) => {
  useEffect(() => {
    async function getData() {
      try {
        const data = await callService('material', 'getData', source.source);

      } catch (e) {
        // ignore
      }
    }
    getData();
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Tab shape="capsule" size="small" className={styles.materialTab}>
          {tabs.map(item => <Tab.Item key={item.key} title={item.tab}>{item.content}</Tab.Item>)}
        </Tab>
      </div>

    </div>
  )
}

export default MaterialsPane;
