import React, { useEffect, useState } from 'react';
import callService from '@/callService';
import styles from './index.module.scss';

const InfoCard = () => {

  const [data, setData] = useState({ name: '', description: '', list: [] });
  useEffect(() => {
    async function getData() {
      try {
        setData(await callService('data', 'projectInfo'));
      } catch (e) {
        // ignore
      }
    }
    getData();
  }, []);

  if (!data.name) return null;

  return (
    <div className={styles.container}>
      <p className={styles.title}>{data.name}</p>
      <p className={styles.description}>{data.description}</p>

      {(data.list || []).map((row: any, index) => {
        const items = row.items;
        const rowStyle = index === data.list.length - 1 ? { border: 'none' } : {};
        return (
          <div className={styles.row} style={rowStyle} key={`row-${index}`}>
            {items.map((item) => {
              return (
                <div className={styles.info} key={`value-${item.label}`}>
                  <p className={styles.label}>{item.label}</p>
                  {item.link ?
                    <a className={styles.detail} href={item.link} target="_blank">{item.value}</a> :
                    <p className={styles.detail}>{item.value}</p>
                  }
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default InfoCard;
