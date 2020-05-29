import React, { useState } from 'react';
import { Grid, Notification, Button, Input } from '@alifd/next';
import { arrayMove } from 'react-sortable-hoc';
import PageSelected from './components/PageSelected';
import Material from '../../components/Material';
import callService from '../../callService';
import styles from './index.module.scss';

const { Row, Col } = Grid;

function closeWindow() {

}

async function getSources() {
  return await callService('material', 'getSources');
}

async function getData(source: string) {
  return await callService('material', 'getData', source);
}

function validateData({ blocks, pageName }) {
  if (!pageName) {
    return '请填写页面名称';
  }

  if (!blocks || !blocks.length) {
    return '请选择区块';
  }

  return '';
}

const Home = () => {
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [pageName, setPageName] = useState('');

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

      closeWindow();
    } catch (error) {
      Notification.error({ content: error.message });
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.list}>
        <div className={styles.item}>
          <div className={styles.label}>
            1. 填写页面路面名称：
          </div>
          <div className={styles.field}>
            <Input
              placeholder="以字母 a-z 开头，不能包含中文"
              className={styles.pageNameInput}
              value={pageName}
              onChange={(value) => setPageName(value)}
            />
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>
            2. 选择区块：
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
          生成页面
        </Button>
      </div>
    </div>
  );
};

export default Home;
