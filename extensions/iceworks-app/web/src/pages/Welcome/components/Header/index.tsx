import React from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './index.module.scss';

const Header = () => {
  return (
    <div className={styles.header}>
      <h1><FormattedMessage id="web.iceworksApp.Welcome.Header.title" /></h1>
      <div className={styles.desc}>
        <FormattedMessage id="web.iceworksApp.Welcome.Header.desc" />
      </div>
    </div>
  );
};

export default Header;
