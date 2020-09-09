import * as React from 'react';
import styles from './index.module.scss';

const data = [
  {
    items: [
      {
        label: '版本',
        value: '1.0',
      },
      {
        label: '类型',
        value: 'Rax',
      },
      {
        label: 'targets',
        value: 'web, weex',
      },
    ],
  },
  {
    items: [
      {
        label: '分支',
        value: 'daily/0.1.0',
      },
      {
        label: '仓库地址',
        value: 'http://gitlab.alibaba-inc.com/ice/iceworks-pack',
        link: 'http://gitlab.alibaba-inc.com/ice/iceworks-pack',
      },
    ],
  },
  {
    items: [
      {
        label: 'DEF 构建类型',
        value: 'pegasus',
      },
      {
        label: '天马模块',
        value: 'https://banff.alibaba-inc.com/mdc',
        link: 'https://banff.alibaba-inc.com/mdc',
      },
    ],
  },
];

const InfoCard = () => {
  return (
    <div className={styles.container}>
      <p className={styles.title}>questions-and-answers</p>
      <p className={styles.description}>This is a awesome project, enjoy it!</p>

      {data.map((row, index) => {
        const items = row.items;
        const rowStyle = index === data.length - 1 ? { border: 'none' } : {};
        return (
          <div className={styles.row} style={rowStyle} key={`row-${index}`}>
            {items.map((item) => {
              return (
                <div className={styles.info} key={`value-${item.label}`}>
                  <p className={styles.label}>{item.label}</p>
                  {item.link ? (
                    <a className={styles.detail} href={item.link} target="_blank">
                      {item.value}
                    </a>
                  ) : (
                    <p className={styles.detail}>{item.value}</p>
                  )}
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
