import React from 'react';
import AddIcon from '@/assets/add.svg';
import styles from './index.module.scss';

const AddScaffoldCard = ({ onClick }) => {
  return (
    <div
      className={styles.addScaffoldCard}
      onClick={onClick}
    >
      <img src={AddIcon} alt="addIcon" className={styles.addIcon} />
    </div>
  );
};

export default AddScaffoldCard;
