import React, { useState } from 'react';
import { Notification, Button, Input } from '@alifd/next';
import Material from '@iceworks/material-ui';
import callService from '../../callService';
import styles from './index.module.scss';

async function getSources() {
  let sources = [];
  try {
    sources = await callService('material', 'getSourcesByProjectType');
  } catch (e) {
    Notification.error({ content: 'Get Material Sourcess got error, please try aging.' });
  }

  console.log('getSources', sources);
  return sources;
}

async function getData(source: string) {
  let data = {};
  try {
    data = await callService('material', 'getData', source);
  } catch (e) {
    Notification.error({ content: 'Get Material Data got error, please try aging.' });
  }
  console.log('getData', data);
  return data;
}

function validateData({ block, componentName }) {
  if (!componentName) {
    return 'Please set name of component';
  }

  if (!block) {
    return 'Please select blocks';
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
    Notification.success({ content: 'Component generation succeeded!' });
    resetData();
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.list}>
        <div className={styles.item}>
          <div className={styles.label}>
            1. Fill in the component name:
          </div>
          <div className={styles.field}>
            <Input
              placeholder="Starts with A-Z, cannot contain special characters"
              className={styles.pageNameInput}
              value={componentName}
              onChange={(value) => setComponentName(value)}
              disabled={isCreating}
            />
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>
            2. Select Block：
          </div>
          <div className={styles.select}>
            <Material
              disableLazyLoad={true}
              getSources={getSources}
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
          Generate component
        </Button>
      </div>
    </div>
  );
};

export default Home;
