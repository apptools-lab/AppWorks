import React from 'react';
import InfoCard from '../InfoCard';
import DingtalkIcon from '../../../../../public/assets/dingtalk.svg';
import DocIcon from '../../../../../public/assets/doc.svg';
import ArticleIcon from '../../../../../public/assets/article.svg';
import styles from './index.module.scss';

const cardList = [
  {
    imgUrl: DocIcon,
    title: '帮助文档',
    description: '查看更多 Iceworks 相关文档',
    linkName: '立即查看',
    link: 'https://ice.work/docs/iceworks/about',
  },
  {
    imgUrl: DingtalkIcon,
    title: '钉钉群',
    description: '加入官方钉钉群一起交流学习',
    linkName: '扫码加入',
    link: 'https://img.alicdn.com/tfs/TB1oDJzTeL2gK0jSZFmXXc7iXXa-379-378.png_360x10000.jpg',
  },
  {
    imgUrl: ArticleIcon,
    title: '文章',
    description: '查看 ICE 和 Rax 文章',
    linkName: '立即查看',
    link: 'https://zhuanlan.zhihu.com/ice-design',
  },
];
const Information = () => {
  return (
    <div className={styles.information}>
      <div className={styles.title}>更多信息</div>
      <div className={styles.cardList}>
        {cardList.map((item) => {
          return (
            <div className={styles.cardItem}>
              <InfoCard {...item} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Information;
