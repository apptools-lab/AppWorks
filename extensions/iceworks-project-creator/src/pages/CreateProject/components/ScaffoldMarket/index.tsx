import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import SelectCard from '@/components/SelectCard';
import callService from '@/callService';
import { IMaterialSource, IMaterialScaffold } from '@/iceworks/material-utils';

const ScaffoldMarket = ({ onScaffoldSelect }) => {
  const [materialSourceSelected, setMaterialSourceSelected] = useState('');
  const [materialSelected, setMaterialSelected] = useState(null);
  const [materialSources, setMaterialSources] = useState<Array<IMaterialSource>>([]);
  const [scaffoldMaterials, setScaffoldMaterials] = useState<IMaterialScaffold[]>([]);

  async function onMaterialSourceClick(scaffold: IMaterialSource) {
    setMaterialSourceSelected(scaffold.name);
    const data = await getScaffolds(scaffold.source);
    setScaffoldMaterials(data);
  }

  function onScaffoldMaterialClick(scaffold) {
    setMaterialSelected(scaffold.name);
    onScaffoldSelect(scaffold);
  }

  async function getScaffoldResources() {
    const materialSources: any = await callService('project', 'getScaffoldResources') as IMaterialSource[];
    return materialSources;
  }

  async function getScaffolds(source: string) {
    try {
      const data = await callService('project', 'getScaffolds', source) as IMaterialScaffold[];
      return data;
    } catch (e) {
      return [];
    }
  }

  useEffect(() => {
    async function initData() {
      try {
        const materialSources = await getScaffoldResources();
        setMaterialSources(materialSources);
        setMaterialSourceSelected(materialSources[0].name);
        const source = materialSources[0].source;

        const data = await getScaffolds(source);
        setScaffoldMaterials(data);
      } catch (error) {
      }
    }

    initData();
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.scaffoldRegister}>
        {materialSources && materialSources.map(item => (
          <SelectCard
            key={item.name}
            title={item.name}
            content={item.description}
            selected={materialSourceSelected === item.name}
            style={{ width: 180 }}
            onClick={() => onMaterialSourceClick(item)}
          />
        ))}
      </div>
      <div className={styles.materialScaffold}>
        {scaffoldMaterials && scaffoldMaterials.map(item => (
          <SelectCard
            key={item.name}
            title={item.title}
            content={item.description}
            media={<img height={120} src={item.screenshot} />}
            selected={materialSelected === item.name}
            style={{ width: 200, height: 280 }}
            onClick={() => onScaffoldMaterialClick(item)}
          />
        ))}
      </div>
    </div>
  );
};

export default ScaffoldMarket;