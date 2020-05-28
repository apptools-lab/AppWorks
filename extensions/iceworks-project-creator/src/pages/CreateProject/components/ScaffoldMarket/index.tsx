import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import SelectedCard from '@/components/SelectCard';

const ScaffoldMarket = ({ onScaffoldSelect }) => {
  const [materialTypeSelected, setMaterialTypeSelected] = useState('PCWeb');
  const [materialSelected, setMaterialSelected] = useState(null);
  const [scaffoldMaterials, setScaffoldMaterials] = useState({ PCWeb: [], wireless: [] });

  const scaffoldRegisterCard = [
    {
      title: 'PC Web',
      name: 'PCWeb',
      content: 'PC Web', // 描述
    },
    {
      title: '无线跨端',
      name: 'wireless',
      content: '无线跨端' // 描述
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
    const vscode = acquireVsCodeApi();
    vscode.postMessage({
      command: 'getScaffolds'
    });
    function listener(event) {
      const message = event.data;
      if (message.command === 'onGetScaffolds') {
        setScaffoldMaterials(message.scaffolds);
      }
    }
    window.addEventListener('message', listener);
    return () => {
      window.removeEventListener('message', listener);
    };
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
            width={180}
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
            width={200}
            onClick={() => onScaffoldMaterialClick(item)}
          />
        ))}
      </div>
    </div>
  );
};

export default ScaffoldMarket;