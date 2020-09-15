import React from 'react';
import { useIntl } from 'react-intl';
import classnames from 'classnames';
import styles from './index.module.scss';

export default (props) => {
  const { onClick, selected } = props;
  const intl = useIntl();

  return (
    <div onClick={onClick} className={classnames(styles.container, { [styles.active]: selected })}>
      <img alt="" className={styles.newTag} src="https://img.alicdn.com/tfs/TB101VOfsVl614jSZKPXXaGjpXa-64-64.png" />
      <img alt="" className={styles.icon} src="https://img.alicdn.com/tfs/TB1qZXjiiqAXuNjy1XdXXaYcVXa-128-128.ico" />
      <p className={styles.title}>{intl.formatMessage({ id: 'web.iceworksProjectCreator.ScaffoldMarket.pegasus' })}</p>
    </div>
  );
};
