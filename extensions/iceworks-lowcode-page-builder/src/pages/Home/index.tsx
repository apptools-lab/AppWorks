import React, { useState } from 'react';
import { Grid, Notification, Button } from '@alifd/next';
import { arrayMove } from 'react-sortable-hoc';
import PageSelected from './components/PageSelected';
import Material from '../../components/Material';
import mockBlocks from '../../mocks/blocks.json';
import mockMaterial from '../../mocks/material.json';
import mockSources from '../../mocks/sources.json';
import styles from './index.module.scss';

const { Row, Col } = Grid;

function closeWindow() {

}

async function getSources() {
  return mockSources;
}

async function getData() {
  return mockMaterial;
}

const Home = () => {
  const [selectedBlocks, setSelectedBlocks] = useState(mockBlocks);
  const [isSorting, setIsSorting] = useState(false);
  const [saveVisible, setSaveVisible] = useState(false);

  // 添加区块
  function onAdd(block) {
    setSelectedBlocks([...selectedBlocks, block]);
  }

  // 删除区块
  function onDelete(targetIndex) {
    setSelectedBlocks(selectedBlocks.filter((_, index) => index !== targetIndex));
  }

  // 名字更新
  function onNameChange(name, targetIndex) {
    selectedBlocks[targetIndex].name = name;
    setSelectedBlocks([...selectedBlocks]);
  }

  // 开始拖拽
  function onSortStart() {
    setIsSorting(true);
  }

  // 结束拖拽
  function onSortEnd({ oldIndex, newIndex }) {
    setIsSorting(false);
    setSelectedBlocks([...arrayMove(selectedBlocks, oldIndex, newIndex)]);
  }

  async function handleSaveOk(data) {
    try {
      // await server.createPage({ ...data, blocks: selectedBlocks });
      setSelectedBlocks([]);
    } catch (error) {
      Notification.error({ content: error.message });
    }

    setSaveVisible(false);
    closeWindow();
  }

  function handleSaveCancel() {
    setSaveVisible(false);
  }

  return (
    <div className={styles.wrap}>
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
      <div className={styles.opts}>
        <Button type="primary">
          创建页面
        </Button>
      </div>
    </div>
  );
};

export default Home;
