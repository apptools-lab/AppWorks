import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import InfoCard from '../InfoCard';
import DingtalkIcon from '../../../../../public/assets/dingtalk.svg';
import DocIcon from '../../../../../public/assets/doc.svg';
import UpdatesIcon from '../../../../../public/assets/updates.svg';
import styles from './index.module.scss';

const Information = () => {
  const intl = useIntl();

  const cardList = [
    {
      image: DocIcon,
      title: intl.formatMessage({ id: 'web.applicationManager.Welcome.Information.doc.title' }),
      description: intl.formatMessage({ id: 'web.applicationManager.Welcome.Information.doc.desc' }),
      linkName: intl.formatMessage({ id: 'web.applicationManager.Welcome.Information.doc.link' }),
      link: 'https://appworks.site',
    },
    {
      image: DingtalkIcon,
      title: intl.formatMessage({ id: 'web.applicationManager.Welcome.Information.dingtalk.title' }),
      description: intl.formatMessage({ id: 'web.applicationManager.Welcome.Information.dingtalk.desc' }),
      linkName: intl.formatMessage({ id: 'web.applicationManager.Welcome.Information.dingtalk.link' }),
      link: 'https://img.alicdn.com/tfs/TB1oDJzTeL2gK0jSZFmXXc7iXXa-379-378.png_360x10000.jpg',
    },
    {
      image: UpdatesIcon,
      title: intl.formatMessage({ id: 'web.applicationManager.Welcome.Information.updates.title' }),
      description: intl.formatMessage({ id: 'web.applicationManager.Welcome.Information.updates.desc' }),
      linkName: intl.formatMessage({ id: 'web.applicationManager.Welcome.Information.updates.link' }),
      link: 'https://github.com/apptools-lab/appworks/releases',
    },
  ];

  return (
    <div className={styles.information}>
      <div className={styles.title}>
        <FormattedMessage id="web.applicationManager.Welcome.Information.title" />
      </div>
      <div className={styles.cardList}>
        {cardList.map((item) => {
          return (
            <div className={styles.cardItem} key={item.title}>
              <InfoCard {...item} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Information;
