import React from 'react';
import classnames from 'classnames';
import AddIcon from '@/assets/add.svg';
import successIcon from '@/assets/success.svg';
import styles from './index.module.scss';

const AddScaffoldCard = ({ selected, onClick }) => {
  return (
    <div
      className={classnames(styles.addScaffoldCard, { [styles.active]: selected })}
      onClick={onClick}
    >
      {selected && <img src={successIcon} className={styles.successIcon} alt="success" />}
      <img src={AddIcon} alt="addIcon" className={styles.addIcon} />
    </div>
  );
};

export default AddScaffoldCard;
