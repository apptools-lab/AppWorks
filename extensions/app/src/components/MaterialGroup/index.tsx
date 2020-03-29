import React, { ReactElement } from 'react';
import { Message } from '@alifd/next';
import styles from './index.module.scss';

interface IMaterialGroupProps {
  dataSource: IMaterialItem[];
  showDownload?: boolean;
  previewText?: string;
}
interface IMaterialItemProps extends IMaterialItem {
  key?: string | number;
}

function MaterialItem(props: IMaterialItemProps): ReactElement {
  const desc = props.description || props.title;
  const title = props.title || props.name;

  return (
    <div className={styles.item}>
      {props.screenshot && <div className={styles.cover} style={{ backgroundImage: `url(${props.screenshot})` }} />}
      <div className={styles.title}>{title}</div>
      <div className={styles.desc}>{desc}</div>
      <div className={styles.ops}>
        <a
          className={styles.opButton}
          href={props.homepage}
          target="_blank"
        >
          {props.previewText || '预览'}
        </a>
        <a
          href={props.repository}
          target="_blank"
          className={styles.opButton}
        >
          源码
        </a>
        {props.showDownload && (
          <div
            className={styles.opButton}
            onClick={(): void => {
              // TODO
              Message.warning('TODOTODOTODOTODOTODO');
            }}
          >
            创建项目
          </div>
        )}
      </div>
    </div>
  );
}

export default function MaterialGroup(props: IMaterialGroupProps): ReactElement {
  return (
    <div className={styles.group}>
      {props.dataSource.map((item, index) => {
        return <MaterialItem key={index} {...item} showDownload={props.showDownload} previewText={props.previewText} />;
      })}
    </div>
  );
}
