import React, { useState } from 'react';
import { Grid, Notification, Button, Input } from '@alifd/next';
import { arrayMove } from 'react-sortable-hoc';
import Material from '@iceworks/material-ui';
import PageSelected from './components/PageSelected';
import callService from '../../callService';
import styles from './index.module.scss';

const { Row, Col } = Grid;

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
  const [isSorting, setIsSorting] = useState(false);
  const [pageName, setPageName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  function onAdd(block) {
    setSelectedBlocks([...selectedBlocks, block]);
  }

  function onDelete(targetIndex) {
    setSelectedBlocks(selectedBlocks.filter((_, index) => index !== targetIndex));
  }

  function onNameChange(name, targetIndex) {
    selectedBlocks[targetIndex].name = name;
    setSelectedBlocks([...selectedBlocks]);
  }

  function onSortStart() {
    setIsSorting(true);
  }

  function onSortEnd({ oldIndex, newIndex }) {
    setIsSorting(false);
    setSelectedBlocks([...arrayMove(selectedBlocks, oldIndex, newIndex)]);
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

      await callService('page', 'generate', data);
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
            1. Fill in the page name:
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
            2. Select Blocks：
          </div>
          <div className={styles.field}>
            <Row gutter={24} className={styles.row}>
              <Col span={16} className={styles.col}>
                <PageSelected
                  useDragHandle
                  lockAxis="y"
                  helperClass={styles.blockIsDraging}
                  blocks={selectedBlocks}
                  onDelete={onDelete}
                  onNameChange={onNameChange}
                  onSortStart={onSortStart}
                  onSortEnd={onSortEnd}
                  isSorting={isSorting}
                />
              </Col>
              <Col span={8} className={styles.col}>
                <div className={styles.material}>
                  <Material
                    getSources={getSources}
                    getData={getData}
                    onBlockClick={onAdd}
                    dataWhiteList={['blocks']}
                  />
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <div className={styles.opts}>
        <Button type="primary" loading={isCreating} onClick={handleCreate}>
          Generate page
        </Button>
      </div>
    </div>
  );
};

export default Home;
