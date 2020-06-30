import React, { useEffect, useState } from 'react';
import { Tab } from '@alifd/next';
import callService from '@/callService';
import { IMaterialSource } from '@iceworks/material-utils';
import LocalMaterialsPane from './components/LocalMaterialsPane';
import MaterialsPane from './components/MaterialsPane';

function Home() {
  const [tabs, setTabs] = useState([{ tab: '本地物料', key: '本地物料', content: <LocalMaterialsPane /> }]);
  useEffect(() => {
    async function getSources() {
      try {
        const sources = await callService('material', 'getSources');
        sources.forEach((source: IMaterialSource) => {
          tabs.push({ tab: source.name, key: source.name, content: <MaterialsPane materialSource={source} /> })
        });
        setTabs([...tabs])
      } catch (e) {
        // ignore   
      }
    }
    getSources();
  }, []);
  return (
    // <Tab>
    //   {tabs.map(item => <Tab.Item key={item.key} title={item.tab}>{item.content}</Tab.Item>)}

    // </Tab>
    <MaterialsPane />
  )
}

export default Home;
