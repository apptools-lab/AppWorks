import React, { useState } from 'react';
import { Grid, Notification } from '@alifd/next';
import { arrayMove } from 'react-sortable-hoc';
import styles from './index.module.scss';
import { PageSelected } from './components/PageSelected';
import mockBlocks from '../../mocks/blocks.json';

const { Row, Col } = Grid;

function closeWindow() {

}

const Home = () => {
  const [selectedBlocks, setSelectedBlocks] = useState(mockBlocks);
  const [isSorting, setIsSorting] = useState(false);
  const [saveVisible, setSaveVisible] = useState(false);

  // 页面操作确认
  function handleOk() {
    setSaveVisible(true);
  }

  // 添加区块
  function onAdd(block) {
    setSelectedBlocks([...selectedBlocks, block]);
  }

  // 删除区块
  function onDelete(targetIndex) {
    setSelectedBlocks(selectedBlocks.filter((_, index) => index !== targetIndex));
  }

  // 名字切换
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

  function showMessage(text: string) {
    Notification.notice({ content: text });
  }

  function showError(text: string) {
    Notification.error({ content: text });
  }

  async function handleSaveOk(data) {
    try {
      // await server.createPage({ ...data, blocks: selectedBlocks });
      setSelectedBlocks([]);
    } catch (error) {
      showError(error.message);
    }

    setSaveVisible(false);
    closeWindow();
  }

  function handleSaveCancel() {
    setSaveVisible(false);
  }

  return (
    <div>
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
          test
        </Col>
      </Row>
    </div>
  );
};

export default Home;
