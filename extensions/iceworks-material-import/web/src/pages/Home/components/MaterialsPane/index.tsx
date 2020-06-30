import React from 'react';
import { Notification } from '@alifd/next';
import callService from '@/callService';
import styles from './index.module.scss';
import Material from '@iceworks/material-ui';
import { IMaterialData, IMaterialBlock, IMaterialComponent, IMaterialBase } from '@iceworks/material-utils';

const MaterialsPane: React.FC<any> = () => {
  async function getSources() {
    let sources = [];
    try {
      sources = await callService('material', 'getSourcesByProjectType');
    } catch (e) {
      Notification.error({ content: '获取物料源信息失败，请稍后再试。' });
    }
    console.log('getSources', sources);
    return sources;
  }

  async function getData(source: string): Promise<IMaterialData> {
    let data = {} as IMaterialData;
    try {
      data = await callService('material', 'getData', source);
    } catch (e) {
      Notification.error({ content: '获取物料集合信息失败，请稍后再试。' });
    }
    console.log('getData', data);
    return data;
  }

  const onComponentClick = (component: IMaterialComponent) => {

  }

  const onBlockClick = (block: IMaterialBlock) => {

  }

  const onBaseClick = (base: IMaterialBase) => {

  }
  return (
    <div className={styles.container}>
      <div className={styles.materialsList}>
        <Material
          disableLazyLoad
          getSources={getSources}
          getData={getData}
          onBlockClick={onBlockClick}
          onBaseClick={onBaseClick}
          onComponentClick={onComponentClick}
          dataWhiteList={['blocks', 'components', 'bases']}
        />
      </div>
    </div>
  )
}

export default MaterialsPane;
