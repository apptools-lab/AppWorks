import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import InfoCard from '../InfoCard';
import DingtalkIcon from '../../../../../public/assets/dingtalk.svg';
import DocIcon from '../../../../../public/assets/doc.svg';
import ArticleIcon from '../../../../../public/assets/article.svg';
import styles from './index.module.scss';

const Information = () => {
  const intl = useIntl();

  const cardList = [
    {
      image: DocIcon,
      title: intl.formatMessage({ id: 'web.iceworksApp.Welcome.Information.doc.title' }),
      description: intl.formatMessage({ id: 'web.iceworksApp.Welcome.Information.doc.desc' }),
      linkName: intl.formatMessage({ id: 'web.iceworksApp.Welcome.Information.doc.link' }),
      link: 'https://ice.work/docs/iceworks/about',
    },
    {
      image: DingtalkIcon,
      title: intl.formatMessage({ id: 'web.iceworksApp.Welcome.Information.dingtalk.title' }),
      description: intl.formatMessage({ id: 'web.iceworksApp.Welcome.Information.dingtalk.desc' }),
      linkName: intl.formatMessage({ id: 'web.iceworksApp.Welcome.Information.dingtalk.link' }),
      link: 'https://img.alicdn.com/tfs/TB1oDJzTeL2gK0jSZFmXXc7iXXa-379-378.png_360x10000.jpg',
    },
    {
      image: ArticleIcon,
      title: intl.formatMessage({ id: 'web.iceworksApp.Welcome.Information.article.title' }),
      description: intl.formatMessage({ id: 'web.iceworksApp.Welcome.Information.article.desc' }),
      linkName: intl.formatMessage({ id: 'web.iceworksApp.Welcome.Information.article.link' }),
      link: 'https://zhuanlan.zhihu.com/ice-design',
    },
  ];

  return (
    <div className={styles.information}>
      <div className={styles.title}>
        <FormattedMessage id="web.iceworksApp.Welcome.Information.title" />
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
