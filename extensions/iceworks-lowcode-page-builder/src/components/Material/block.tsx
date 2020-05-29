import * as React from 'react';
import { PLACEHOLDER_IMG } from '../../config/material';
import { IMaterialBlock } from '../../types/material';
import * as styles from './block.module.scss';

export const MaterialBlock: React.FC<{
  dataSource: IMaterialBlock,
  onClick?(dataSource: IMaterialBlock): void,
}> = ({ dataSource, onClick }) => {
  function handleClick() {
    onClick && onClick(dataSource);
  }

  return (
    <div className={styles.container}>
      <div className={styles.screenshot} onClick={handleClick}>
        {dataSource.isNewly ? <div className={styles.newly}>NEW</div> : null}
        <img draggable={false} alt={dataSource.title} src={dataSource.screenshot || PLACEHOLDER_IMG} />
      </div>
      <h5 className={styles.title}>{dataSource.title}</h5>
      <div className={styles.actions}>
        <a
          href={dataSource.homepage}
          rel="noopener noreferrer"
          target="_blank"
          className={styles.button}
        >
          预览
        </a>
        <a
          href={dataSource.repository}
          rel="noopener noreferrer"
          target="_blank"
          className={styles.button}
        >
          源码
        </a>
      </div>
    </div>
  );
};
