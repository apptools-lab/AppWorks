import * as React from 'react';
import i18n from '@/i18n';
import styles from './index.module.less';

const Guide = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{i18n.format('title')}</h2>

      <p className={styles.description}>{i18n.format('subTitle')}</p>

      <div className={styles.action}>
        <a
          href="https://ice.work/docs/guide/about"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginRight: 20,
          }}
        >
          {i18n.format('link')}
        </a>
        <a
          href="https://github.com/ice-lab/icejs"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
    </div>
  );
};

export default Guide;
