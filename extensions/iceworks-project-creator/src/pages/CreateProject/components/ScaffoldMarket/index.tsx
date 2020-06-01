import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import SelectCard from '@/components/SelectCard';
import callService from '@/service/index';
import { IMaterialSource, IMaterialItem } from '@/types';

interface IScaffolds {
  [key: string]: IMaterialItem
}
const ScaffoldMarket = ({ onScaffoldSelect }) => {
  const [materialSourceSelected, setMaterialSourceSelected] = useState('');
  const [materialSelected, setMaterialSelected] = useState(null);
  const [materialSources, setMaterialSources] = useState<Array<IMaterialSource>>([]);
  const [scaffoldMaterials, setScaffoldMaterials] = useState<IScaffolds>({});

  function onScaffoldTypeClick(type) {
    setMaterialSourceSelected(type.name);
  }

  function onScaffoldMaterialClick(scaffold) {
    setMaterialSelected(scaffold.name);
    onScaffoldSelect(scaffold);
  }

  useEffect(() => {
    async function getMaterialSources() {
      try {
        const data: any = await callService('getScaffoldResources') as IMaterialSource[];
        setMaterialSources(data);
        setMaterialSourceSelected(data[0].name);
      } catch (error) {
      }
    }

    async function getScaffolds() {
      try {
        const data = await callService('getScaffolds') as IScaffolds;
        setScaffoldMaterials(data);
      } catch (error) {
      }
    };
    getMaterialSources();
    getScaffolds();
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
            onClick={() => onScaffoldTypeClick(item)}
          />
        ))}
      </div>
      <div className={styles.materialScaffold}>
        {scaffoldMaterials[materialSourceSelected] && scaffoldMaterials[materialSourceSelected].map(item => (
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