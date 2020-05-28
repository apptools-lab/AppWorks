import React, { useState, useEffect } from 'react';
import { request } from 'ice';
import styles from './index.module.scss';
import SelectedCard from '@/components/SelectCard';
import { officialMaterialSource } from '@/constants';

function ScaffoldMarket() {
  const [materialTypeSelected, setMaterialTypeSelected] = useState('PCWeb');
  const [materialSelected, setMaterialSelected] = useState(null);

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
  let scaffoldMaterials = {
    PCWeb: [],
    wireless: [],
  };
  // const scaffoldMaterialCard = [
  //   {
  //     title: 'Lite',
  //     name: 'lite',
  //     media: <img height={120} src="https://img.alicdn.com/tfs/TB1FNIOSFXXXXaWXXXXXXXXXXXX-260-188.png" />,
  //     content: '这是一段描述这是一段描述这是一段描述这是一段描述'
  //   },
  //   {
  //     title: 'Ice Pro',
  //     name: 'icePro',
  //     media: <img height={120} src="https://img.alicdn.com/tfs/TB1FNIOSFXXXXaWXXXXXXXXXXXX-260-188.png" />,
  //     content: '这是一段描述这是一段描述这是一段描述这是一段描述'
  //   },
  //   {
  //     title: 'Ice Pro',
  //     name: 'icePro1',
  //     media: <img height={120} src="https://img.alicdn.com/tfs/TB1FNIOSFXXXXaWXXXXXXXXXXXX-260-188.png" />,
  //     content: '这是一段描述这是一段描述这是一段描述这是一段描述'
  //   },
  // ];



  function onScaffoldTypeClick(type) {
    setMaterialTypeSelected(type.name);
  }

  function onScaffoldMaterialClick(material) {
    setMaterialSelected(material.name);
  }
  useEffect(() => {
    async function getScaffoldMaterial() {
      for (let key of Object.keys(officialMaterialSource)) {
        const url = officialMaterialSource[key];
        try {
          const data = await request({ method: 'GET', url });
          console.log(data);
          scaffoldMaterials[key] = data;
        } catch (err) {
          console.log(err);
        }
      }
    }
    getScaffoldMaterial();
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
            content={item.content}
            media={item.media}
            selected={materialSelected === item.name}
            width={200}
            onClick={() => onScaffoldMaterialClick(item)}
          />
        ))}
      </div>
    </div>
  );
}

export default ScaffoldMarket;