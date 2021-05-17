import * as React from 'react';
import { IMaterialBlock, PLACEHOLDER_IMG } from '@appworks/material-utils';
import classnames from 'classnames';
import { Icon } from '@alifd/next';
import styles from './page.module.scss';

export const MaterialPage: React.FC<{
  dataSource: IMaterialBlock;
  onClick?: (dataSource: IMaterialBlock) => void;
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
      {selected && (
        <Icon
          type="select"
          size="small"
          className={classnames({
            [styles.selectedIcon]: true,
            'selected-icon': true,
          })}
        />
      )}
      <div className={styles.screenshot} onClick={handleClick}>
        {dataSource.isNewly ? <div className={styles.newly}>NEW</div> : null}
        <img draggable={false} alt={dataSource.title} src={dataSource.screenshot || PLACEHOLDER_IMG} />
      </div>
      <h5 className={styles.title}>{dataSource.title}</h5>
      <div className={styles.actions}>
        <a onClick={handleClick} className={styles.button}>
          添加
        </a>
        <a href={dataSource.homepage} rel="noopener noreferrer" target="_blank" className={styles.button}>
          预览
        </a>
        <a href={dataSource.repository} rel="noopener noreferrer" target="_blank" className={styles.button}>
          源码
        </a>
      </div>
    </div>
  );
};
