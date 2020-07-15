import React, { useState } from 'react';
import { Notification, Button, Input } from '@alifd/next';
import Material from '@iceworks/material-ui';
import callService from '../../callService';
import styles from './index.module.scss';

async function onSettingsClick() {
  try {
    await callService('common', 'executeCommand', 'iceworksApp.configHelper.start');
  } catch (e) {
    Notification.error({ content: e.message });
  }
}

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

async function getData(source: string) {
  let data = {};
  try {
    data = await callService('material', 'getData', source);
  } catch (e) {
    Notification.error({ content: '获取物料集合信息失败，请稍后再试。' });
  }
  console.log('getData', data);
  return data;
}

function validateData({ block, componentName }) {
  if (!componentName) {
    return '请填写组件名。';
  }

  if (!block) {
    return '请选择使用的区块。';
  }

  return '';
}

const Home = () => {
  const [selectedBlock, setSelectedBlock] = useState();
  const [componentName, setComponentName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  function onSelect(block) {
    setSelectedBlock(block);
  }

  function resetData() {
    setSelectedBlock(undefined);
    setComponentName('');
  }

  async function handleCreate(data) {
    setIsCreating(true);
    try {
      const data = {
        block: selectedBlock,
        componentName,
      };

      const errorMessage = validateData(data);
      if (errorMessage) {
        Notification.error({ content: errorMessage });
        setIsCreating(false);
        return;
      }

      await callService('block', 'bulkGenerate', [{
        ...selectedBlock,
        name: componentName
      }]);
    } catch (error) {
      Notification.error({ content: error.message });
      setIsCreating(false);
      throw error;
    }

    setIsCreating(false);
    Notification.success({ content: '组件生成成功！' });
    resetData();
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.list}>
        <div className={styles.item}>
          <div className={styles.label}>
            1. 填写组件名：
          </div>
          <div className={styles.field}>
            <Input
              placeholder="名称必须英文字母 A-Z 开头，只包含英文和数字，不允许有特殊字符"
              className={styles.pageNameInput}
              value={componentName}
              onChange={(value) => setComponentName(value)}
              disabled={isCreating}
            />
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>
            2. 选择使用的区块：
          </div>
          <div className={styles.select}>
            <Material
              disableLazyLoad
              getSources={getSources}
              onSettingsClick={onSettingsClick}
              getData={getData}
              onBlockClick={onSelect}
              selectedBlocks={selectedBlock ? [selectedBlock] : []}
              dataWhiteList={['blocks']}
            />
          </div>
        </div>
      </div>
      <div className={styles.opts}>
        <Button type="primary" loading={isCreating} onClick={handleCreate}>
          生成组件
        </Button>
      </div>
    </div>
  );
};

export default Home;
