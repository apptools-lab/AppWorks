import React, { useState } from 'react';
import { Divider, Tree } from '@alifd/next';
import { FormattedMessage, useIntl } from 'react-intl';
import styles from './index.module.scss';

const TreeNode = Tree.Node;

const Content = () => {
  const intl = useIntl();

  const videosList = [
    {
      title: intl.formatMessage({ id: 'web.applicationManager.Welcome.Content.videoTitle.createApplication' }),
      videoUrl:
        'https://iceworks.oss-cn-hangzhou.aliyuncs.com/iceworks-video/%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%20Hello%20World%20%E5%BA%94%E7%94%A8.mov',
    },
    {
      title: intl.formatMessage({ id: 'web.applicationManager.Welcome.Content.videoTitle.visualDevelopment' }),
      videoUrl:
        'https://iceworks.oss-cn-hangzhou.aliyuncs.com/iceworks-video/%E5%8F%AF%E8%A7%86%E5%8C%96%E5%BC%80%E5%8F%91.mov',
    },
    {
      title: intl.formatMessage({ id: 'web.applicationManager.Welcome.Content.videoTitle.genreateComponent' }),
      videoUrl:
        'https://iceworks.oss-cn-hangzhou.aliyuncs.com/iceworks-video/%E5%8F%AF%E8%A7%86%E5%8C%96%E6%90%AD%E5%BB%BA%E7%BB%84%E4%BB%B6.mov',
    },
    {
      title: intl.formatMessage({ id: 'web.applicationManager.Welcome.Content.videoTitle.customMaterial' }),
      videoUrl:
        'https://iceworks.oss-cn-hangzhou.aliyuncs.com/iceworks-video/%E8%87%AA%E5%AE%9A%E4%B9%89%E7%89%A9%E6%96%99%E6%BA%90.mov',
    },
  ];

  const [selectedKeyIndex, setSelectedKeyIndex] = useState<number>(0);

  return (
    <div className={styles.content}>
      <div className={styles.title}><FormattedMessage id="web.applicationManager.Welcome.Content.title" /></div>
      <div className={styles.desc}><FormattedMessage id="web.applicationManager.Welcome.Content.desc" /></div>
      <div className={styles.videoContainer}>
        <video src={videosList[selectedKeyIndex].videoUrl} controls />
        <Divider direction="ver" className={styles.divider} />
        <Tree
          className={styles.videoList}
          selectedKeys={[videosList[selectedKeyIndex].title]}
          defaultSelectedKeys={[videosList[0].title]}
          onSelect={(selectedKeys: string[], extra: any) => {
            const { selected, node } = extra;
            if (selected) setSelectedKeyIndex(node.props.pos.slice(2));
          }}
        >
          {videosList.map((item) => (
            <TreeNode key={item.title} label={item.title} />
          ))}
        </Tree>
      </div>
    </div>
  );
};

export default Content;
