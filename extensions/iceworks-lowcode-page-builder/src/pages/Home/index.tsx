import React, { useState } from 'react';
import { Grid, Notification, Button, Input } from '@alifd/next';
import { arrayMove } from 'react-sortable-hoc';
import PageSelected from './components/PageSelected';
import Material from '../../components/Material';
import callService from '../../callService';
import styles from './index.module.scss';

const { Row, Col } = Grid;

async function getSources() {
  return await callService('material', 'getSources');
}

async function getData(source: string) {
  return await callService('material', 'getData', source);
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
    try {
      const data = {
        blocks: selectedBlocks,
        pageName,
      };

      const errorMessage = validateData(data);
      if (errorMessage) {
        Notification.error({ content: errorMessage });
      }

      await callService('page', 'create', data);
    } catch (error) {
      Notification.error({ content: error.message });
      throw error;
    }

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
                <Material
                  getSources={getSources}
                  getData={getData}
                  onBlockClick={onAdd}
                />
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <div className={styles.opts}>
        <Button type="primary" onClick={handleCreate}>
          Generate page
        </Button>
      </div>
    </div>
  );
};

export default Home;
