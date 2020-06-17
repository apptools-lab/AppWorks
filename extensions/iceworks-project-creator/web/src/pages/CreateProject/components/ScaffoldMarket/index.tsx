import React, { useState, useEffect } from 'react';
import SelectCard from '@/components/SelectCard';
import callService from '@/callService';
import { IMaterialSource, IMaterialScaffold } from '@/iceworks/material-utils';
import styles from './index.module.scss';

const ScaffoldMarket = ({ onScaffoldSelect, children }) => {
  const [materialSourceSelected, setMaterialSourceSelected] = useState<IMaterialSource>({});
  const [materialSelected, setMaterialSelected] = useState(null);
  const [materialSources, setMaterialSources] = useState<Array<IMaterialSource>>([]);
  const [scaffoldMaterials, setScaffoldMaterials] = useState<IMaterialScaffold[]>([]);

  async function onMaterialSourceClick(scaffold: IMaterialSource) {
    try {
      setMaterialSourceSelected(scaffold);
      const data = await getScaffolds(scaffold.source);
      setScaffoldMaterials(data);
      setMaterialSelected(null)
    } catch (err) {
      // ignore
    }
  }

  function onScaffoldMaterialClick(scaffold) {
    setMaterialSelected(scaffold.name);
    onScaffoldSelect(scaffold);
  }

  async function getScaffoldResources() {
    const materialSources: any = await callService('material', 'getSources') as IMaterialSource[];
    return materialSources;
  }

  async function getScaffolds(source: string) {
    try {
      const scaffolds = await callService('project', 'getScaffolds', source) as IMaterialScaffold[];
      const whitelist = ['@alifd/fusion-design-pro', '@alifd/scaffold-lite', '@alifd/scaffold-simple', '@rax-materials/scaffolds-basic-app']
      return scaffolds.filter(scaffold => whitelist.includes(scaffold.source.npm));
    } catch (e) {
      return [];
    }
  }

  useEffect(() => {
    async function initData() {
      try {
        const materialSources = await getScaffoldResources();
        setMaterialSources(materialSources);
        setMaterialSourceSelected(materialSources[0]);
        const source = materialSources[0].source;

        const data = await getScaffolds(source);
        setScaffoldMaterials(data);
      } catch (error) {
        // ignore
      }
    }

    initData();
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.scaffoldRegistry}>
          {materialSources && materialSources.map(item => (
            <SelectCard
              key={item.name}
              title={item.name}
              content={<span className={styles.userSelect}>{item.description}</span>}
              selected={materialSourceSelected.name === item.name}
              style={{ width: 160 }}
              onClick={() => onMaterialSourceClick(item)}
            />
          ))}
        </div>
        <div className={styles.materialScaffold}>
          {scaffoldMaterials && scaffoldMaterials.map(item => (
            <SelectCard
              key={item.name}
              title={item.title}
              content={<span className={styles.userSelect}>{item.description}</span>}
              media={<img height={120} src={item.screenshot} alt="screenshot" style={{ padding: '10px 10px 0' }} />}
              selected={materialSelected === item.name}
              style={{ width: 180, height: 250 }}
              onClick={() => onScaffoldMaterialClick(item)}
            />
          ))}
        </div>
      </div>
      <div className={styles.action}>
        {children}
      </div>
    </div>
  );
};

export default ScaffoldMarket;
