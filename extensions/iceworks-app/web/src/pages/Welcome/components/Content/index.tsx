import React, { useState } from 'react';
import { Divider, Tree } from '@alifd/next';
import styles from './index.module.scss';

const TreeNode = Tree.Node;

const videosList = [
  {
    name: '课程1',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  },
  {
    name: '课程2',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  },
  {
    name: '课程3',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  },
  {
    name: '课程4',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  },
];

const Content = () => {
  const [selectedKey, setSelectedKey] = useState(videosList[0].name);
  return (
    <div className={styles.content}>
      <div className={styles.title}>上手课程</div>
      <div className={styles.desc}>10分钟快速上手使用 Iceworks</div>
      <div className={styles.video}>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video controls>
          <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
        </video>
        <Divider direction="ver" className={styles.divider} />
        <Tree
          className={styles.videoList}
          selectedKeys={[selectedKey]}
          defaultSelectedKeys={[videosList[0].name]}
          onSelect={(selectedKeys: string[], extra: any) => {
            const { selected, node } = extra;
            if (selected) setSelectedKey(node.props.label);
          }}
        >
          {videosList.map((item) => (
            <TreeNode key={item.name} label={item.name} />
          ))}
        </Tree>
      </div>
    </div>
  );
};

export default Content;
