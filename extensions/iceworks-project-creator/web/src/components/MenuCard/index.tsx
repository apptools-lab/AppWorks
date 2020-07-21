import React from 'react';
import classnames from 'classnames';
import successIcon from '@/assets/success.svg';
import styles from './index.module.scss';

interface IMenuCard {
  title: string;
  selected: boolean;
  icon?: string;
  style?: object;
  onClick?: any;
}

const MenuCard: React.FC<IMenuCard> = ({ style, title, icon, onClick, selected }) => {
  return (
    <div
      style={{ ...style }}
      className={classnames(styles.card, { [styles.active]: selected })}
      onClick={onClick}
    >
      {selected && <img src={successIcon} className={styles.successIcon} alt="success" />}
      {icon && <img src={icon} alt="icon" className={styles.icon} />}
      <div className={styles.title}>{title}</div>
    </div>
  )
}

export default MenuCard