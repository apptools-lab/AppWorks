import React, { useState } from 'react';
import { Radio, Checkbox, Grid, Input, Tree, Button } from '@alifd/next';
import styles from './index.module.scss';

const { Row, Col } = Grid;

const data = [{
  label: 'Component',
  key: '1',
  children: [{
    label: 'Form',
    key: '2',
    selectable: false,
    children: [{
      label: 'Input',
      key: '4',
    }, {
      label: 'Select',
      key: '5',
      disabled: true,
    }],
  }, {
    label: 'Display',
    key: '3',
    children: [{
      label: 'Table',
      key: '6',
    }],
  }],
}];
const ScaffoldLayout = () => {
  const [visible, setVisible] = useState(false);
  console.log(visible);
  return (
    <div className={styles.scaffoldLayout}>
      <div className={styles.layoutSelect}>
        <Row align="center">
          <Col offset={1} span={4}>布局名称：</Col>
          <Col span={20}>
            <Input style={{ width: 200 }} />
          </Col>
        </Row>
      </div>
      <div className={styles.topNavSetting}>
        <Radio>顶部导航</Radio>
        <div className={styles.options}>
          <Checkbox.Group itemDirection="ver" >
            <Checkbox value="Logo">Logo 组件</Checkbox>
            <Checkbox value="avatar">用户头像组件</Checkbox>
            <Checkbox value="notice">通知组件</Checkbox>
            <Checkbox value="menu">
              菜单
            </Checkbox>
          </Checkbox.Group>
          <div className={styles.tree}>
            <Tree
              checkable
              editable
              defaultExpandedKeys={['2']}
              defaultCheckedKeys={['2', '4', '5']}
              onSelect={() => { }}
              onCheck={() => { }}
              onEditFinish={() => { }}
              onRightClick={() => { }}
              dataSource={data}
            />
          </div>
        </div>
      </div>
      <div className={styles.asideNavSetting}>
        <Radio>侧边导航</Radio>
        <div className={styles.options}>
          <Tree
            checkable
            editable
            defaultExpandedKeys={['2']}
            defaultCheckedKeys={['2', '4', '5']}
            onSelect={() => { }}
            onCheck={() => { }}
            onEditFinish={() => { }}
            onRightClick={() => { }}
            dataSource={data}
          />
        </div>
      </div>
      <div className={styles.footerSetting}>
        <Radio>页脚</Radio>
        <Button onClick={() => setVisible(true)}>弹窗</Button>
      </div>
      {/* <Dialog visible={visible}>
        ffff
      </Dialog> */}
    </div>
  );
};

export default ScaffoldLayout;
