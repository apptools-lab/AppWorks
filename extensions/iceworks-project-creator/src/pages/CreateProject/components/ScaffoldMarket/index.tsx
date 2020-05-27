import React, { useState, useMemo } from 'react';
import styles from './index.module.scss';
import MaterialScaffold from '@/components/MaterialScaffold';

function ScaffoldMarket() {
  const [registerSelected, setRegisterSelected] = useState(null);
  const [materialSelected, setMaterialSelected] = useState(null);

  const scaffoldRegisterCard = [
    {
      title: 'PC Web',
      name: 'PCWeb',
      content: '描述描述描述描述描述描述描述描述描述描述',
    },
    {
      title: '无线跨端',
      name: 'wireless',
      content: '描述描述描述描述描述描述描述描述描述描述'
    }
  ];

  const scaffoldMaterialCard = [
    {
      title: 'Lite',
      name: 'lite',
      media: <img height={120} src="https://img.alicdn.com/tfs/TB1FNIOSFXXXXaWXXXXXXXXXXXX-260-188.png" />,
      content: '这是一段描述这是一段描述这是一段描述这是一段描述'
    },
    {
      title: 'Ice Pro',
      name: 'icePro',
      media: <img height={120} src="https://img.alicdn.com/tfs/TB1FNIOSFXXXXaWXXXXXXXXXXXX-260-188.png" />,
      content: '这是一段描述这是一段描述这是一段描述这是一段描述'
    },
    {
      title: 'Ice Pro',
      name: 'icePro1',
      media: <img height={120} src="https://img.alicdn.com/tfs/TB1FNIOSFXXXXaWXXXXXXXXXXXX-260-188.png" />,
      content: '这是一段描述这是一段描述这是一段描述这是一段描述'
    },
  ];

  function onScaffoldRegisterClick(register) {
    setRegisterSelected(register.name);
  }

  function onScaffoldMaterialClick(material) {
    setMaterialSelected(material.name);
  }

  return (
    <div className={styles.container}>
      <div className={styles.scaffoldRegister}>
        {scaffoldRegisterCard.map(item => (
          <MaterialScaffold
            key={item.name}
            title={item.title}
            content={item.content}
            selected={registerSelected === item.name}
            width={180}
            onClick={() => onScaffoldRegisterClick(item)}
          />
        ))}
      </div>
      <div className={styles.materialScaffold}>
        {scaffoldMaterialCard.map(item => (
          <MaterialScaffold
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