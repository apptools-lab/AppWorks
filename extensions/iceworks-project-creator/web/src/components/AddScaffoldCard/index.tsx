import React from 'react';
import { FormattedMessage } from 'react-intl';
import AddIcon from '@/assets/add.svg';
import styles from './index.module.scss';

const AddScaffoldCard = ({ onClick }) => {
  return (
    <div
      className={styles.addScaffoldCard}
      onClick={onClick}
    >
      <img src={AddIcon} alt="addIcon" className={styles.addIcon} />
      <div className={styles.content}>
        <FormattedMessage id="web.iceworksProjectCreator.customScaffold.title" />
      </div>
    </div>
  );
};

export default AddScaffoldCard;
