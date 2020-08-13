import React from 'react';
import { useIntl } from 'react-intl';
import callService from '@/callService';

import styles from './index.module.scss';

export default () => {
  const intl = useIntl();
  const createPegasus = () => {
    callService('pegasus', 'create');
  };
  return (
    <div onClick={createPegasus} className={styles.container}>
      <img alt="" className={styles.newTag} src="https://img.alicdn.com/tfs/TB101VOfsVl614jSZKPXXaGjpXa-64-64.png" />
      <img alt="" className={styles.icon} src="https://img.alicdn.com/tfs/TB1qZXjiiqAXuNjy1XdXXaYcVXa-128-128.ico" />
      <p className={styles.title}>{intl.formatMessage({ id: 'web.iceworksProjectCreator.ScaffoldMarket.pegasus' })}</p>
    </div>
  );
};
