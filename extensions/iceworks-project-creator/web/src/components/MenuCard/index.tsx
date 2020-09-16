import React from 'react';
import classnames from 'classnames';
import successIcon from '@/assets/success.svg';
import styles from './index.module.scss';

interface IMenuCard {
  title: string;
  selected: boolean;
  icon?: string;
  style?: Record<string, unknown>;
  disabled?: boolean;
  onClick?: () => void;
  // only for Balloon Component
  // Ref: https://ice.work/component/balloon#%E4%BD%BF%E7%94%A8%E6%B3%A8%E6%84%8F
  onMouseLeave?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLInputElement>) => void;
}

const MenuCard: React.FC<IMenuCard> = ({
  style,
  title,
  icon,
  selected,
  disabled = false,
  onClick,
  onMouseLeave,
  onMouseEnter,
}) => {
  return (
    <div
      style={{ ...style }}
      className={classnames(styles.card, { [styles.active]: selected, [styles.disabled]: disabled })}
      onClick={onClick}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
    >
      {selected && <img src={successIcon} className={styles.successIcon} alt="success" />}
      {icon && <img src={icon} alt="icon" className={styles.icon} />}
      <div className={styles.title}>{title}</div>
    </div>
  );
};

export default MenuCard;
