import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import SelectedCard from '@/components/SelectCard';
import callService from '@/service/index';

const ScaffoldMarket = ({ onScaffoldSelect }) => {
  const [materialTypeSelected, setMaterialTypeSelected] = useState('PCWeb');
  const [materialSelected, setMaterialSelected] = useState(null);
  const [scaffoldMaterials, setScaffoldMaterials] = useState({ PCWeb: [], wireless: [] });

  const scaffoldRegisterCard = [
    {
      title: 'PC Web',
      name: 'PCWeb',
      content: 'PC Web物料',
    },
    {
      title: '无线跨端',
      name: 'wireless',
      content: '无线跨端物料'
    }
  ];

  function onScaffoldTypeClick(type) {
    setMaterialTypeSelected(type.name);
  }

  function onScaffoldMaterialClick(scaffold) {
    setMaterialSelected(scaffold.name);
    onScaffoldSelect(scaffold);
  }
  useEffect(() => {
    async function getScaffolds() {
      const data = await callService('getScaffolds');
      setScaffoldMaterials(data as any);
    };
    getScaffolds();
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.scaffoldRegister}>
        {scaffoldRegisterCard.map(item => (
          <SelectedCard
            key={item.name}
            title={item.title}
            content={item.content}
            selected={materialTypeSelected === item.name}
            style={{ width: 180 }}
            onClick={() => onScaffoldTypeClick(item)}
          />
        ))}
      </div>
      <div className={styles.materialScaffold}>
        {scaffoldMaterials[materialTypeSelected].map(item => (
          <SelectedCard
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