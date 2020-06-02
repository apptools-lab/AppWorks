import React, { useState } from 'react';
import { Notification, Button, Input } from '@alifd/next';
import Material from '@iceworks/material-ui';
import callService from '../../callService';
import styles from './index.module.scss';

async function getSources() {
  let sources = [];
  try {
    sources = await callService('material', 'getSources');
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
    data = Notification.error({ content: 'Get Material Data got error, please try aging.' });
  }
  console.log('getData', data);
  return data;
}

function validateData({ blocks, pageName }) {
  if (!pageName) {
    return 'Please set name of page';
  }

  if (!blocks || !blocks.length) {
    return 'Please select blocks';
  }

  return '';
}

const Home = () => {
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [pageName, setPageName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  function onAdd(block) {
    setSelectedBlocks([...selectedBlocks, block]);
  }

  function resetData() {
    setSelectedBlocks([]);
    setPageName('');
  }

  async function handleCreate(data) {
    setIsCreating(true);
    try {
      const data = {
        blocks: selectedBlocks,
        pageName,
      };

      const errorMessage = validateData(data);
      if (errorMessage) {
        Notification.error({ content: errorMessage });
        setIsCreating(false);
        return;
      }

      await callService('page', 'create', data);
    } catch (error) {
      Notification.error({ content: error.message });
      setIsCreating(false);
      throw error;
    }

    setIsCreating(false);
    Notification.success({ content: 'Page generation succeeded!' });
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
              value={pageName}
              onChange={(value) => setPageName(value)}
              disabled={isCreating}
            />
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>
            2. Select Block：
          </div>
          <div className={styles.field}>
            <Material
              getSources={getSources}
              getData={getData}
              onBlockClick={onAdd}
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
