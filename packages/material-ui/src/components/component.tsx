import * as React from 'react';
import { IMaterialComponent } from '@appworks/material-utils';
import classnames from 'classnames';
import styles from './component.module.scss';

export const MaterialComponent: React.FC<{
  dataSource: IMaterialComponent;
  onClick?: (dataSource: IMaterialComponent) => void;
  selected?: boolean;
}> = ({ dataSource, onClick, selected }) => {
  function handleClick() {
    onClick && onClick(dataSource);
  }

  return (
    <div
      className={classnames({
        [styles.container]: true,
        [styles.selected]: selected,
        selected,
      })}
    >
      <div onClick={handleClick}>
        <h5 className={styles.title}>{dataSource.name}</h5>
        <p className={styles.desc}>{dataSource.description || dataSource.name}</p>
      </div>
      <div className={styles.actions}>
        <a onClick={handleClick} className={styles.button}>
          添加
        </a>
        <a href={dataSource.homepage} rel="noopener noreferrer" target="_blank" className={styles.button}>
          文档
        </a>
        <a className={styles.button} rel="noopener noreferrer" target="_blank" href={dataSource.repository}>
          源码
        </a>
      </div>
    </div>
  );
};
