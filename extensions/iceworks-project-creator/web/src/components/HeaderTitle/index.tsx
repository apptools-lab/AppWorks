import React from 'react';
import styles from './index.module.scss';

interface IHeaderTitle {
  title?: string
}

const HeaderTitle = ({ title = '' }: IHeaderTitle) => {
  return (
    <div className={styles.headerTitle}>
      {title}
    </div>
  );
};

export default HeaderTitle;
