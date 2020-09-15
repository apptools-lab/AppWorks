import React, { useState } from 'react';
import { Divider, Tree } from '@alifd/next';
import styles from './index.module.scss';

const TreeNode = Tree.Node;

const videosList = [
  {
    title: '创建 Hello World 应用',
    videoUrl:
      'https://lark-video.oss-cn-hangzhou.aliyuncs.com/outputs/prod/yuque/2020/371895/mov/1600147884257-e9253ef8-33d8-43e0-96f5-f4c0274fc776.mp4?OSSAccessKeyId=LTAI4GGhPJmQ4HWCmhDAn4F5&Expires=1600155163&Signature=QdnNfEXT4qp4Thv1jvhmX75SRzc%3D',
  },
  {
    title: '可视化开发',
    videoUrl:
      'https://lark-video.oss-cn-hangzhou.aliyuncs.com/outputs/prod/yuque/2020/371895/mov/1600148332610-e5ece777-aa3b-4f93-a9f7-42f28a5788db.mp4?OSSAccessKeyId=LTAI4GGhPJmQ4HWCmhDAn4F5&Expires=1600155763&Signature=jkHWSCSm0nnWEjAn9urDUGoT3i8%3D',
  },
  {
    title: '可视化搭建组件',
    videoUrl:
      'https://lark-video.oss-cn-hangzhou.aliyuncs.com/outputs/prod/yuque/2020/371895/mov/1600148288818-03996554-0beb-442e-9cf6-ab9c871db0d6.mp4?OSSAccessKeyId=LTAI4GGhPJmQ4HWCmhDAn4F5&Expires=1600155600&Signature=Bdr%2FJ5E5TDVGAN8KK9O6jUh1K5A%3D',
  },
  {
    title: '自定义物料',
    videoUrl:
      'https://lark-video.oss-cn-hangzhou.aliyuncs.com/outputs/prod/yuque/2020/371895/mov/1600148389645-736283ee-9552-409f-8698-acf27d8160b8.mp4?OSSAccessKeyId=LTAI4GGhPJmQ4HWCmhDAn4F5&Expires=1600156299&Signature=OjVEqiK%2BBB7glgCCyo%2B%2BVlBy1Po%3D',
  },
];

const Content = () => {
  const [selectedKeyIndex, setSelectedKeyIndex] = useState<number>(0);

  return (
    <div className={styles.content}>
      <div className={styles.title}>上手教程</div>
      <div className={styles.desc}>30分钟快速上手使用 Iceworks</div>
      <div className={styles.videoContainer}>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
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
