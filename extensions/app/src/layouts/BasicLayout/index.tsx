import React from 'react';
import PageNav from './PageNav';
import styles from './index.module.scss';

export default function BasicLayout(props) {
  return (
    <div className={`${styles.layout} iceworks-layout`}>
      <div className={styles.aside}>
        <PageNav pathname={props.pathname} />
      </div>
      <div className={styles.main}>{props.children}</div>
    </div>
  );
}
